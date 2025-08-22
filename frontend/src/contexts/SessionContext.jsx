import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession debe ser usado dentro de un SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameProgress, setGameProgress] = useState({});
  const [completedGames, setCompletedGames] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [stemAffinities, setStemAffinities] = useState(null);
  const [suggestedPlanet, setSuggestedPlanet] = useState(null);

  // Crear nueva sesión
  const createSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/sessions/create');
      
      if (response.data.success) {
        const newSessionId = response.data.data.session_id;
        setSessionId(newSessionId);
        setSessionData(response.data.data);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('kallpaia_session_id', newSessionId);
        
        // Cargar juegos completados desde localStorage
        const savedCompletedGames = localStorage.getItem('kallpaia_completed_games');
        if (savedCompletedGames) {
          try {
            const parsed = JSON.parse(savedCompletedGames);
            setCompletedGames(parsed);
            console.log('🎮 Juegos completados cargados desde localStorage:', parsed);
          } catch (e) {
            console.error('Error parsing completed games from localStorage:', e);
          }
        }
        
        return newSessionId;
      }
    } catch (err) {
      console.error('Error creando sesión:', err);
      setError('No se pudo crear la sesión. Intenta de nuevo.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener información de la sesión
  const getSessionInfo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/api/sessions/${id}`);
      
      if (response.data.success) {
        setSessionData(response.data.data);
        
        // Verificar juegos completados desde la base de datos
        try {
          const gameHistoryResponse = await axios.get(`/api/sessions/${id}/games`);
          if (gameHistoryResponse.data.success && gameHistoryResponse.data.data.length > 0) {
            const dbGames = gameHistoryResponse.data.data.map(game => game.game_id);
            const uniqueDbGames = [...new Set(dbGames)];
            
            console.log('🎮 Juegos completados cargados desde BD:', uniqueDbGames);
            setCompletedGames(uniqueDbGames);
            
            // Sincronizar localStorage con la base de datos
            localStorage.setItem('kallpaia_completed_games', JSON.stringify(uniqueDbGames));
          } else {
            // Si no hay datos en BD, limpiar localStorage
            console.log('🎮 No hay juegos completados en BD, limpiando localStorage');
            setCompletedGames([]);
            localStorage.removeItem('kallpaia_completed_games');
          }
        } catch (dbError) {
          console.log('🎮 Error obteniendo datos de BD, usando localStorage como fallback:', dbError.message);
          // Fallback a localStorage solo si hay error de conexión
          const savedCompletedGames = localStorage.getItem('kallpaia_completed_games');
          if (savedCompletedGames) {
            try {
              const parsed = JSON.parse(savedCompletedGames);
              setCompletedGames(parsed);
              console.log('🎮 Juegos completados cargados desde localStorage (fallback):', parsed);
            } catch (e) {
              console.error('Error parsing completed games from localStorage:', e);
              setCompletedGames([]);
            }
          } else {
            setCompletedGames([]);
          }
        }
        
        return response.data.data;
      }
    } catch (err) {
      console.error('Error obteniendo información de sesión:', err);
      setError('No se pudo obtener la información de la sesión.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar actividad de la sesión
  const updateSessionActivity = async (id) => {
    try {
      const response = await axios.patch(`/api/sessions/${id}/activity`);
      
      if (response.data.success) {
        setSessionData(prev => ({
          ...prev,
          last_activity: response.data.data.last_activity
        }));
      }
    } catch (err) {
      console.error('Error actualizando actividad de sesión:', err);
    }
  };

  // Mapeo de nombres de juegos a IDs de la base de datos
  const gameNameToIdMapping = {
    'number_puzzle': 17,
    'green_invention': 18,
    'broken_bridge': 19,
    'space_explorer': 20
  };

  // Guardar progreso del juego
  const saveGameProgress = async (gameId, gameData) => {
    try {
      if (!sessionId) return;

      // Obtener el ID numérico del juego desde la base de datos
      const dbGameId = gameNameToIdMapping[gameId];
      if (!dbGameId) {
        console.error('ID de juego no encontrado para:', gameId);
        return false;
      }

      const gameEvent = {
        session_id: sessionId,
        game_id: dbGameId,
        event_type: 'game_completed',
        event_data: {
          score: gameData.score,
          timeSpent: gameData.timeSpent,
          hintsUsed: gameData.hintsUsed,
          userChoices: gameData.userChoices,
          completedAt: new Date().toISOString()
        }
      };

      // Guardar evento del juego en la base de datos
      const response = await axios.post('/api/games/events', gameEvent);
      
      if (response.data.success) {
        // Actualizar estado local
        setGameProgress(prev => ({
          ...prev,
          [gameId]: gameData
        }));
        
        setCompletedGames(prev => {
          const newList = !prev.includes(gameId) ? [...prev, gameId] : prev;
          console.log('🎮 Actualizando juegos completados:', {
            prev,
            gameId,
            newList
          });
          
          // Guardar en localStorage para persistencia
          localStorage.setItem('kallpaia_completed_games', JSON.stringify(newList));
          
          return newList;
        });
        
        setTotalScore(prev => prev + gameData.score);
        
        // Actualizar actividad de la sesión
        await updateSessionActivity(sessionId);
        
        return true;
      }
    } catch (err) {
      console.error('Error guardando progreso del juego:', err);
      return false;
    }
  };

  // Verificar si todos los juegos están completados
  const allGamesCompleted = useMemo(() => {
    console.log('🎯 Verificando si todos los juegos están completados:', {
      completedGames,
      length: completedGames.length,
      allCompleted: completedGames.length >= 4
    });
    return completedGames.length >= 4; // 4 juegos en total
  }, [completedGames]);

  // Verificar si se debe mostrar el perfil STEM
  const shouldShowStemProfile = useMemo(() => {
    return allGamesCompleted && stemAffinities && suggestedPlanet;
  }, [allGamesCompleted, stemAffinities, suggestedPlanet]);

  // Función para obtener el progreso de los juegos
  const getGameProgress = () => {
    const totalGames = 4;
    const completedCount = completedGames.length;
    const progressPercentage = (completedCount / totalGames) * 100;
    
    return {
      completed: completedCount,
      total: totalGames,
      percentage: progressPercentage,
      remaining: totalGames - completedCount
    };
  };

  // Función para obtener el siguiente juego recomendado
  const getNextRecommendedGame = () => {
    const allGames = ['number_puzzle', 'green_invention', 'broken_bridge', 'space_explorer'];
    const remainingGames = allGames.filter(game => !completedGames.includes(game));
    return remainingGames[0] || null;
  };

  // Obtener progreso del juego desde el estado local
  const getGameProgressFromState = (gameId) => {
    return gameProgress[gameId] || null;
  };

  // Obtener estadísticas de la sesión
  const getSessionStats = async (id) => {
    try {
      const response = await axios.get(`/api/sessions/${id}/stats`);
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.error('Error obteniendo estadísticas de sesión:', err);
      throw err;
    }
  };

  // Obtener historial de juegos
  const getGameHistory = async () => {
    try {
      if (!sessionId) return [];
      
      const response = await axios.get(`/api/sessions/${sessionId}/games`);
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.error('Error obteniendo historial de juegos:', err);
      return [];
    }
  };

  // Limpiar sesión
  const clearSession = () => {
    setSessionId(null);
    setSessionData(null);
    setGameProgress({});
    setCompletedGames([]);
    setTotalScore(0);
    localStorage.removeItem('kallpaia_session_id');
  };

  // Inicializar sesión al cargar la aplicación
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Verificar si ya existe una sesión en localStorage
        const savedSessionId = localStorage.getItem('kallpaia_session_id');
        
        if (savedSessionId) {
          // Verificar si la sesión aún es válida
          try {
            await getSessionInfo(savedSessionId);
            setSessionId(savedSessionId);
            
            // Cargar historial de juegos
            const gameHistory = await getGameHistory();
            if (gameHistory.length > 0) {
              const progress = {};
              let total = 0;
              
              gameHistory.forEach(game => {
                progress[game.game_id] = game.event_data;
                total += game.event_data.score || 0;
              });
              
              setGameProgress(progress);
              setTotalScore(total);
              setCompletedGames(gameHistory.map(g => g.game_id));
            }
          } catch (err) {
            // Si la sesión no es válida, crear una nueva
            console.log('Sesión anterior no válida, creando nueva...');
            await createSession();
          }
        } else {
          // Crear nueva sesión
          await createSession();
        }
      } catch (err) {
        console.error('Error inicializando sesión:', err);
        setError('Error al inicializar la sesión');
      } finally {
        setLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Actualizar actividad periódicamente
  useEffect(() => {
    if (!sessionId) return;

    const activityInterval = setInterval(() => {
      updateSessionActivity(sessionId);
    }, 5 * 60 * 1000); // Cada 5 minutos

    return () => clearInterval(activityInterval);
  }, [sessionId]);

  const value = {
    sessionId,
    sessionData,
    loading,
    error,
    gameProgress,
    completedGames,
    totalScore,
    stemAffinities,
    suggestedPlanet,
    allGamesCompleted,
    shouldShowStemProfile,
    createSession,
    getSessionInfo,
    updateSessionActivity,
    getSessionStats,
    saveGameProgress,
    getGameProgress,
    getGameProgressFromState,
    getGameHistory,
    clearSession,
    getNextRecommendedGame
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

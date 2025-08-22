import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from './SessionContext';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame debe ser usado dentro de un GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const { sessionId } = useSession();
  const [availableGames, setAvailableGames] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener lista de juegos disponibles
  const fetchAvailableGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/games/available');
      
      if (response.data.success) {
        setAvailableGames(response.data.data);
      }
    } catch (err) {
      console.error('Error obteniendo juegos disponibles:', err);
      setError('No se pudieron obtener los juegos disponibles');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar un juego
  const startGame = async (gameId) => {
    if (!sessionId) {
      setError('No hay sesión activa');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/games/${gameId}/start`, {
        session_id: sessionId
      });
      
      if (response.data.success) {
        setCurrentGame(response.data.data.game);
        return response.data.data;
      }
    } catch (err) {
      console.error('Error iniciando juego:', err);
      setError('No se pudo iniciar el juego');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Completar un juego
  const completeGame = async (gameId, score, timeSpent, userChoices) => {
    if (!sessionId) {
      setError('No hay sesión activa');
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`/api/games/${gameId}/complete`, {
        session_id: sessionId,
        score,
        time_spent: timeSpent,
        user_choices: userChoices
      });
      
      if (response.data.success) {
        // Actualizar historial de juegos
        await fetchGameHistory();
        setCurrentGame(null);
        return response.data.data;
      }
    } catch (err) {
      console.error('Error completando juego:', err);
      setError('No se pudo completar el juego');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener historial de juegos
  const fetchGameHistory = async () => {
    if (!sessionId) return;

    try {
      const response = await axios.get(`/api/games/session/${sessionId}/history`);
      
      if (response.data.success) {
        setGameHistory(response.data.data);
      }
    } catch (err) {
      console.error('Error obteniendo historial de juegos:', err);
    }
  };

  // Obtener información de un juego específico
  const getGameInfo = async (gameId) => {
    try {
      const response = await axios.get(`/api/games/${gameId}`);
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      console.error('Error obteniendo información del juego:', err);
      setError('No se pudo obtener la información del juego');
      return null;
    }
  };

  // Cargar juegos disponibles al inicializar
  useEffect(() => {
    fetchAvailableGames();
  }, []);

  // Cargar historial cuando cambie la sesión
  useEffect(() => {
    if (sessionId) {
      fetchGameHistory();
    }
  }, [sessionId]);

  const value = {
    availableGames,
    currentGame,
    gameHistory,
    loading,
    error,
    startGame,
    completeGame,
    getGameInfo,
    fetchAvailableGames,
    fetchGameHistory
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../contexts/SessionContext';
import { useAffinity } from '../contexts/AffinityContext';
import { useNavigate } from 'react-router-dom';
import { Star, Rocket, Trophy, Users, Target, X } from 'lucide-react';

const StemProfileModal = ({ isOpen, onClose }) => {
  const { completedGames, totalScore, getGameProgress, gameProgress, getGameHistory } = useSession();
  const { stemAffinities, dominantArea, suggestedPlanet, confidenceLevel } = useAffinity();
  const navigate = useNavigate();
  const [realGameData, setRealGameData] = useState({});
  const [isLoadingGameData, setIsLoadingGameData] = useState(true);

  // Cargar datos reales de los juegos cuando se abra el modal
  useEffect(() => {
    if (isOpen && completedGames.length >= 4) {
      const loadRealGameData = async () => {
        try {
          setIsLoadingGameData(true);
          const gameHistory = await getGameHistory();
          
                     console.log('📊 Historial de juegos recibido:', gameHistory);
           
                       // Procesar el historial de juegos para obtener datos reales
            const processedData = {};
            gameHistory.forEach(game => {
              const gameId = game.game_id;
              const gameName = getGameNameById(gameId);
              
              if (gameName) {
                // Los datos vienen directamente en las columnas de la base de datos
                processedData[gameName] = {
                  id: gameName,
                  name: getGameDisplayName(gameName),
                  score: game.score || 0,
                  timeSpent: game.time_spent || 0,
                  hintsUsed: game.user_choices?.hintsUsed || 0,
                  completedAt: game.created_at || 'N/A'
                };
              }
            });
            
            console.log('🔍 Datos procesados por juego:', processedData);
            console.log('🔍 Juegos completados:', completedGames);
            console.log('🔍 Mapeo de IDs:', gameHistory.map(g => ({ dbId: g.game_id, gameName: getGameNameById(g.game_id) })));
          
                       console.log('✅ Datos procesados:', processedData);
             setRealGameData(processedData);
           } catch (error) {
          console.error('Error cargando datos reales de juegos:', error);
        } finally {
          setIsLoadingGameData(false);
        }
      };
      
      loadRealGameData();
    }
  }, [isOpen, completedGames, getGameHistory]);

  if (!isOpen) return null;
  
  // Solo mostrar si se han completado los 4 juegos
  if (completedGames.length < 4) {
    return null;
  }
  
  // Si no tenemos los datos completos, mostrar un mensaje de carga
  if (!stemAffinities || !suggestedPlanet) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 rounded-2xl p-8 max-w-2xl w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                         <h2 className="text-2xl font-bold text-white mb-4">
               ¡Todos los Juegos Completados!
             </h2>
             <p className="text-white/80 mb-6">
               Estamos calculando tu perfil STEM basado en tus {completedGames.length} juegos completados.
               <br />
               <span className="text-sm text-white/60">
                 Juegos: {completedGames.join(', ')}
               </span>
             </p>
            <button
              onClick={onClose}
              className="btn-primary px-6 py-3"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const progress = getGameProgress();
  
  // Calcular puntuación total y promedio usando los datos reales
  const calculateRealScores = () => {
    if (Object.keys(realGameData).length === 0) {
      return { totalScore: 0, averageScore: 0 };
    }
    
    const scores = Object.values(realGameData).map(game => game.score || 0);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
    
    console.log('🔍 Calculando puntuaciones reales:', { scores, totalScore, averageScore });
    return { totalScore, averageScore };
  };
  
  const { totalScore: realTotalScore, averageScore: realAverageScore } = calculateRealScores();
  
  const gameStats = {
    totalGames: 4,
    completed: completedGames.length,
    percentage: (completedGames.length / 4) * 100,
    averageScore: realAverageScore
  };

  // Mapeo de nombres de juegos para mostrar
  const gameDisplayNames = {
    'number_puzzle': 'Puzzle de Números',
    'green_invention': 'Invento Verde',
    'broken_bridge': 'Puente Roto',
    'space_explorer': 'Explorador Espacial'
  };

  // Mapeo de IDs de base de datos a nombres de juegos
  const getGameNameById = (dbId) => {
    const idMapping = {
      17: 'number_puzzle',
      18: 'green_invention', 
      19: 'broken_bridge',
      20: 'space_explorer'
    };
    console.log(`🔍 Mapeando ID ${dbId} a:`, idMapping[dbId]);
    return idMapping[dbId] || null;
  };

  // Obtener nombre de visualización del juego
  const getGameDisplayName = (gameId) => {
    return gameDisplayNames[gameId] || gameId;
  };

  // Obtener estadísticas detalladas de cada juego
  const getDetailedGameStats = () => {
    console.log('🔍 getDetailedGameStats llamado con:', { isLoadingGameData, completedGames, realGameData });
    
    if (isLoadingGameData) {
      return ['number_puzzle', 'green_invention', 'broken_bridge', 'space_explorer'].map(gameId => ({
        id: gameId,
        name: getGameDisplayName(gameId),
        score: 'Cargando...',
        timeSpent: 'Cargando...',
        hintsUsed: 'Cargando...',
        completedAt: 'Cargando...'
      }));
    }

    return ['number_puzzle', 'green_invention', 'broken_bridge', 'space_explorer'].map(gameId => {
      const gameData = realGameData[gameId] || {};
      console.log(`🔍 Procesando juego ${gameId}:`, gameData);
      
      return {
        id: gameId,
        name: gameData.name || getGameDisplayName(gameId),
        score: gameData.score || 0,
        timeSpent: gameData.timeSpent || 0,
        hintsUsed: gameData.hintsUsed || 0,
        completedAt: gameData.completedAt || 'N/A'
      };
    });
  };

  // Normaliza el área a un slug sin acentos para la URL (mejor UX/rutas estables)
  const toSlug = (str) =>
    (str || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleExplorePlanet = () => {
    const slug = toSlug(dominantArea).replace(/-/g, ''); // matematicas, tecnologia, ingenieria, ciencia
    navigate(`/planet/${slug}`);
    onClose();
  };

  const handleContinuePlaying = () => {
    onClose();
  };

  // Función para cerrar el modal de forma segura
  const handleBackdropClick = (e) => {
    // Solo cerrar si se hace clic en el backdrop (no en el contenido del modal)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Función para manejar la tecla Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Agregar listener de teclado cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el modal esté abierto
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
             <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={handleBackdropClick}
       >
         {/* Overlay de estrellas */}
         <div className="stars-overlay"></div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-[var(--blur)] rounded-[var(--radius-lg)] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 hover:scale-110"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8" role="dialog" aria-modal="true" aria-labelledby="stem-profile-title">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-6xl mb-4"
            >
              🌟
            </motion.div>
            <h2 id="stem-profile-title" className="text-3xl font-bold text-gradient mb-2">
              ¡Perfil STEM Completado!
            </h2>
            <p className="text-[var(--text-2)] text-lg">
              Has completado todos los juegos de exploración. Descubre tu planeta STEM.
            </p>
          </div>

          {/* Estadísticas de Juegos */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
                         <div className="bg-[var(--glass)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--border-strong)] transition-all duration-300">
               <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                 <Trophy className="w-6 h-6 mr-2 text-[var(--math-yellow)]" />
                 Resumen de Juegos
               </h3>
               
                               {/* Estadísticas Generales */}
                <div className="space-y-3 mb-4 p-3 bg-white/5 rounded-[var(--radius-md)]">
                 <div className="flex justify-between">
                   <span className="text-white/80">Juegos Completados:</span>
                   <span className="text-white font-semibold">{gameStats.completed}/{gameStats.total}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-white/80">Puntuación Total:</span>
                   <span className="text-white font-semibold">{realTotalScore} pts</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-white/80">Puntuación Promedio:</span>
                   <span className="text-white font-semibold">{Math.round(gameStats.averageScore)} pts</span>
                 </div>
                 <div className="progress">
                   <div 
                     className="progress-fill"
                     style={{ width: `${gameStats.percentage}%` }}
                   ></div>
                 </div>
               </div>

                               {/* Resultados Detallados por Juego */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white/80">Resultados por Juego:</h4>
                    {isLoadingGameData && (
                                         <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
                     <div className="animate-spin rounded-full h-3 w-3 border-b border-[var(--brand-2)]"></div>
                     Cargando datos...
                   </div>
                    )}
                  </div>
                 {getDetailedGameStats().map((game, index) => (
                   <div key={game.id} className="p-3 bg-[var(--glass)] border border-[var(--border)] rounded-[var(--radius-md)] border-l-4 border-[var(--stem-green)] hover:border-[var(--border-strong)] transition-all duration-300">
                     <div className="flex justify-between items-center mb-2">
                       <div className="flex items-center gap-2">
                         <span className="text-lg">
                           {game.id === 'number_puzzle' ? '🔢' :
                            game.id === 'green_invention' ? '🌱' :
                            game.id === 'broken_bridge' ? '🌉' :
                            game.id === 'space_explorer' ? '🚀' : '🎮'}
                         </span>
                         <span className="text-white font-medium text-sm">{game.name}</span>
                       </div>
                                               <div className="flex items-center gap-2">
                          {typeof game.score === 'number' ? (
                            <>
                              <span className={`font-bold ${
                                game.score >= 200 ? 'text-green-400' :
                                game.score >= 150 ? 'text-yellow-400' :
                                game.score >= 100 ? 'text-orange-400' : 'text-red-400'
                              }`}>
                                {game.score} pts
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                game.score >= 200 ? 'bg-green-500/20 text-green-300' :
                                game.score >= 150 ? 'bg-yellow-500/20 text-yellow-300' :
                                game.score >= 100 ? 'bg-orange-500/20 text-orange-300' : 'bg-red-500/20 text-red-300'
                              }`}>
                                {game.score >= 200 ? 'Excelente' :
                                 game.score >= 150 ? 'Bueno' :
                                 game.score >= 100 ? 'Regular' : 'Básico'}
                              </span>
                            </>
                          ) : (
                            <span className="text-white/60 text-sm">{game.score}</span>
                          )}
                        </div>
                     </div>
                                           <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                        <div className="flex justify-between">
                          <span>⏱️ Tiempo:</span>
                          <span>{typeof game.timeSpent === 'number' ? `${game.timeSpent}s` : game.timeSpent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>💡 Pistas:</span>
                          <span>{typeof game.hintsUsed === 'number' ? game.hintsUsed : game.hintsUsed}</span>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
             </div>

                         <div className="bg-[var(--glass)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--border-strong)] transition-all duration-300">
               <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                 <Star className="w-6 h-6 mr-2 text-[var(--math-yellow)]" />
                 Tu Perfil STEM
               </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Área Dominante:</span>
                  <span className="text-white font-semibold capitalize">{dominantArea}</span>
                </div>
                                 <div className="flex justify-between">
                   <span className="text-white/80">Nivel de Confianza:</span>
                   <span className="text-white font-semibold">
                     {typeof confidenceLevel === 'number' ? Math.round(confidenceLevel * 100) : confidenceLevel || 'N/A'}%
                   </span>
                 </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Planeta Sugerido:</span>
                  <span className="text-white font-semibold">{suggestedPlanet?.planet}</span>
                </div>
              </div>
            </div>
          </div>

                     {/* Afinidades Detalladas */}
           <div className="bg-[var(--glass)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 mb-8 hover:border-[var(--border-strong)] transition-all duration-300">
             <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
               <Target className="w-6 h-6 mr-2 text-[var(--brand-2)]" />
               Análisis de Afinidades STEM
             </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stemAffinities).map(([area, data]) => (
                <div key={area} className="text-center">
                  <div className="text-2xl mb-2">
                    {area === 'matemáticas' ? '🔢' :
                     area === 'ciencia' ? '🔬' :
                     area === 'tecnología' ? '💻' : '⚙️'}
                  </div>
                  <div className="text-sm font-medium text-white capitalize mb-1">
                    {area}
                  </div>
                                     <div className="text-lg font-bold text-white">
                     {typeof data.normalizedScore === 'number' ? Math.round(data.normalizedScore) : 'N/A'}%
                   </div>
                                     <div className="progress mt-2">
                     <div 
                       className={`progress-fill ${
                         area === dominantArea 
                           ? 'bg-gradient-to-r from-[var(--stem-green)] to-emerald-500' 
                           : 'bg-gradient-to-r from-[var(--brand-2)] to-[var(--brand-1)]'
                       }`}
                       style={{ width: `${Math.min(data.normalizedScore || 0, 100)}%` }}
                     ></div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <button
              onClick={handleExplorePlanet}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
              aria-label={`Explorar ${suggestedPlanet?.planet}`}
            >
              <Rocket className="w-5 h-5 mr-2" />
              🚀 Explorar {suggestedPlanet?.planet}
            </button>
            
                         <button
               onClick={handleContinuePlaying}
               className="btn-outline text-lg px-8 py-4 flex items-center justify-center"
               aria-label="Cerrar y continuar explorando"
             >
               <Users className="w-5 h-5 mr-2" />
               Continuar Explorando
             </button>
          </div>

                     {/* Mensaje de Felicitación */}
           <div className="text-center mt-6">
             <p className="text-[var(--text-2)] text-sm">
               ¡Felicidades! Has completado la Etapa 1 de Exploración Inicial. 
               Tu perfil STEM te guiará hacia las carreras más afines a tus habilidades.
             </p>
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StemProfileModal;

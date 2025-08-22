import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Star, Clock, Target } from 'lucide-react';
import { useSession } from '../../contexts/SessionContext';
import NumberPuzzle from './NumberPuzzle';
import GreenInvention from './GreenInvention';
import BrokenBridge from './BrokenBridge';
import SpaceExplorer from './SpaceExplorer';

const GameContainer = ({ onGameComplete, onBackToGames }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const { gameProgress, saveGameProgress } = useSession();

  const games = [
    {
      id: 'number_puzzle',
      name: 'Puzzle de Números',
      description: 'Descubre patrones matemáticos en secuencias numéricas',
      category: 'matemáticas',
      duration: '3 min',
      difficulty: 'Intermedio',
      icon: '🔢',
      color: 'from-stem-math-500 to-stem-math-600',
      bgColor: 'from-stem-math-900 to-stem-math-800',
      component: NumberPuzzle,
      skills: ['Razonamiento lógico', 'Patrones matemáticos', 'Velocidad de resolución']
    },
    {
      id: 'green_invention',
      name: 'Invento Verde',
      description: 'Diseña soluciones ambientales innovadoras',
      category: 'ingeniería',
      duration: '3 min',
      difficulty: 'Avanzado',
      icon: '🌱',
      color: 'from-stem-engineering-500 to-stem-engineering-600',
      bgColor: 'from-stem-engineering-900 to-stem-engineering-800',
      component: GreenInvention,
      skills: ['Creatividad aplicada', 'Pensamiento ingenieril', 'Sostenibilidad']
    },
    {
      id: 'broken_bridge',
      name: 'El Puente Roto',
      description: 'Resuelve desafíos de ingeniería civil',
      category: 'ingeniería',
      duration: '3 min',
      difficulty: 'Intermedio',
      icon: '🌉',
      color: 'from-stem-engineering-500 to-stem-engineering-600',
      bgColor: 'from-stem-engineering-900 to-stem-engineering-800',
      component: BrokenBridge,
      skills: ['Resolución de problemas', 'Análisis de restricciones', 'Toma de decisiones']
    },
    {
      id: 'space_explorer',
      name: 'Exploradora Espacial',
      description: 'Diseña misiones espaciales con restricciones técnicas',
      category: 'tecnología',
      duration: '3 min',
      difficulty: 'Avanzado',
      icon: '🚀',
      color: 'from-stem-tech-500 to-stem-tech-600',
      bgColor: 'from-stem-tech-900 to-stem-tech-800',
      component: SpaceExplorer,
      skills: ['Afinidad tecnológica', 'Ciencias exactas', 'Optimización de sistemas']
    }
  ];

  const handleGameStart = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleGameComplete = async (gameId, results) => {
    // Guardar progreso en el contexto de sesión
    const saved = await saveGameProgress(gameId, results);
    
    if (saved) {
      console.log(`Progreso del juego ${gameId} guardado exitosamente`);
    } else {
      console.error(`Error guardando progreso del juego ${gameId}`);
    }
    
    // Notificar al componente padre
    if (onGameComplete) {
      onGameComplete(gameId, results);
    }
  };

  const handleBackToSelection = () => {
    setSelectedGame(null);
  };

  const getGameById = (gameId) => {
    return games.find(game => game.id === gameId);
  };

  // Si hay un juego seleccionado, renderizar el juego
  if (selectedGame) {
    const game = getGameById(selectedGame);
    const GameComponent = game.component;
    
    return (
      <div className="min-h-screen">
        <GameComponent
          onGameComplete={(results) => handleGameComplete(selectedGame, results)}
          onGameStart={() => handleGameStart(selectedGame)}
        />
      </div>
    );
  }

  // Pantalla de selección de juegos
  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 to-galaxy-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            Mini-Juegos STEM
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Descubre tus habilidades STEM a través de juegos divertidos y desafiantes. 
            Cada juego evalúa diferentes aspectos de tu potencial en Ciencia, Tecnología, 
            Ingeniería y Matemáticas.
          </p>
        </motion.div>

        {/* Grid de juegos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${game.bgColor} border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105`}
              onClick={() => handleGameStart(game.id)}
            >
              {/* Fondo con patrón */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
              </div>

              {/* Contenido del juego */}
              <div className="relative p-8 h-full flex flex-col">
                {/* Header del juego */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                      {game.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {game.name}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        game.category === 'matemáticas' ? 'bg-stem-math-500/20 text-stem-math-400' :
                        game.category === 'ciencia' ? 'bg-stem-science-500/20 text-stem-science-400' :
                        game.category === 'tecnología' ? 'bg-stem-tech-500/20 text-stem-tech-400' :
                        'bg-stem-engineering-500/20 text-stem-engineering-400'
                      }`}>
                        {game.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Indicador de completado */}
                  {gameProgress[game.id] && (
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <p className="text-white/80 mb-6 flex-grow">
                  {game.description}
                </p>

                {/* Información del juego */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-white/60 mb-1">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="text-sm text-white/70">{game.duration}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-white/60 mb-1">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="text-sm text-white/70">{game.difficulty}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-white/60 mb-1">
                      <Star className="w-4 h-4" />
                    </div>
                    <div className="text-sm text-white/70">
                      {gameProgress[game.id] ? `${gameProgress[game.id].score} pts` : '0 pts'}
                    </div>
                  </div>
                </div>

                {/* Habilidades evaluadas */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white/80 mb-3">
                    Habilidades evaluadas:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {game.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-white/10 rounded text-xs text-white/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botón de jugar */}
                <div className="mt-auto">
                  <button className={`w-full btn-primary bg-gradient-to-r ${game.color} hover:scale-105 transition-transform flex items-center justify-center space-x-2`}>
                    <Play className="w-5 h-5" />
                    <span>
                      {gameProgress[game.id] ? 'Jugar de Nuevo' : 'Jugar Ahora'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Efecto de hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              ¿Cómo funcionan los mini-juegos?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-math-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Juega</h3>
                <p className="text-white/70 text-sm">
                  Completa los mini-juegos en 2-3 minutos cada uno
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-science-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analiza</h3>
                <p className="text-white/70 text-sm">
                  Descubre tus fortalezas en cada área STEM
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-stem-tech-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Explora</h3>
                <p className="text-white/70 text-sm">
                  Encuentra tu planeta STEM ideal
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Botón de regreso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <button
            onClick={onBackToGames}
            className="btn-outline inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Juegos</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default GameContainer;

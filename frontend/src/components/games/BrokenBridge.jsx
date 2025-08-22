import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, CheckCircle, Hammer, Wrench, Lightbulb, Zap } from 'lucide-react';

const BrokenBridge = ({ onGameComplete, onGameStart }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos
  const [gameState, setGameState] = useState('ready');
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Niveles del juego
  const levels = [
    {
      level: 1,
      title: "Puente de Madera",
      description: "Un puente de madera se ha derrumbado. Necesitas reconstruirlo con materiales limitados.",
      scenario: "El puente principal de la aldea se ha derrumbado durante una tormenta. Los aldeanos necesitan cruzar el río para llegar a sus campos.",
      constraints: {
        budget: 15,
        time: 48, // horas
        materials: "Madera, cuerdas, herramientas básicas"
      },
      solutions: [
        {
          id: 'simple_wooden',
          name: 'Puente de Madera Simple',
          description: 'Reconstruir con vigas de madera básicas',
          cost: 8,
          time: 24,
          durability: 0.6,
          safety: 0.7,
          efficiency: 0.5,
          materials: ['Vigas de madera', 'Clavos', 'Martillo'],
          pros: ['Rápido de construir', 'Bajo costo'],
          cons: ['Baja durabilidad', 'Limitado para vehículos']
        },
        {
          id: 'reinforced_wooden',
          name: 'Puente de Madera Reforzado',
          description: 'Estructura mejorada con refuerzos y soportes',
          cost: 14,
          time: 36,
          durability: 0.8,
          safety: 0.9,
          efficiency: 0.8,
          materials: ['Vigas de madera', 'Soportes metálicos', 'Cuerdas de refuerzo'],
          pros: ['Mayor durabilidad', 'Más seguro'],
          cons: ['Más tiempo de construcción', 'Costo más alto']
        },
        {
          id: 'suspension_bridge',
          name: 'Puente Colgante',
          description: 'Diseño innovador con cables de suspensión',
          cost: 20,
          time: 72,
          durability: 0.9,
          safety: 0.95,
          efficiency: 0.9,
          materials: ['Cables de acero', 'Torres de soporte', 'Plataforma de madera'],
          pros: ['Muy duradero', 'Excelente capacidad'],
          cons: ['Muy costoso', 'Tiempo de construcción largo']
        }
      ],
      optimalSolution: 'reinforced_wooden',
      reasoning: 'Balance entre costo, tiempo y durabilidad'
    },
    {
      level: 2,
      title: "Puente de Piedra",
      description: "Un puente histórico de piedra necesita reparación estructural urgente.",
      scenario: "El puente medieval del castillo tiene grietas estructurales. Debe mantenerse su apariencia histórica.",
      constraints: {
        budget: 25,
        time: 72,
        materials: "Piedra, mortero, refuerzos estructurales"
      },
      solutions: [
        {
          id: 'patch_repair',
          name: 'Reparación con Parches',
          description: 'Rellenar grietas y reforzar puntos débiles',
          cost: 12,
          time: 24,
          durability: 0.5,
          safety: 0.6,
          efficiency: 0.4,
          materials: ['Mortero', 'Piedras de relleno', 'Varillas de refuerzo'],
          pros: ['Rápido', 'Preserva apariencia'],
          cons: ['Solución temporal', 'Baja durabilidad']
        },
        {
          id: 'structural_reinforcement',
          name: 'Refuerzo Estructural',
          description: 'Refuerzo interno con estructura de acero',
          cost: 22,
          time: 60,
          durability: 0.8,
          safety: 0.9,
          efficiency: 0.7,
          materials: ['Vigas de acero', 'Mortero especial', 'Anclajes'],
          pros: ['Larga durabilidad', 'Mantiene apariencia'],
          cons: ['Costo moderado', 'Tiempo de construcción']
        },
        {
          id: 'complete_rebuild',
          name: 'Reconstrucción Completa',
          description: 'Reconstruir completamente manteniendo el diseño original',
          cost: 35,
          time: 120,
          durability: 0.95,
          safety: 0.98,
          efficiency: 0.9,
          materials: ['Piedra nueva', 'Estructura moderna', 'Cimientos reforzados'],
          pros: ['Máxima durabilidad', 'Perfecta apariencia'],
          cons: ['Muy costoso', 'Tiempo muy largo']
        }
      ],
      optimalSolution: 'structural_reinforcement',
      reasoning: 'Preserva la historia y proporciona seguridad duradera'
    },
    {
      level: 3,
      title: "Puente de Emergencia",
      description: "Necesitas crear un puente temporal para evacuación de emergencia.",
      scenario: "Una inundación ha cortado el acceso principal. Necesitas un puente temporal para evacuación inmediata.",
      constraints: {
        budget: 10,
        time: 6, // horas
        materials: "Materiales disponibles en el lugar"
      },
        solutions: [
        {
          id: 'makeshift_bridge',
          name: 'Puente Improvisado',
          description: 'Usar materiales disponibles para crear paso temporal',
          cost: 3,
          time: 4,
          durability: 0.3,
          safety: 0.4,
          efficiency: 0.3,
          materials: ['Tablones', 'Cuerdas', 'Piedras'],
          pros: ['Muy rápido', 'Mínimo costo'],
          cons: ['Baja seguridad', 'Durabilidad mínima']
        },
        {
          id: 'modular_bridge',
          name: 'Puente Modular',
          description: 'Sistema de módulos prefabricados',
          cost: 8,
          time: 6,
          durability: 0.7,
          safety: 0.8,
          efficiency: 0.7,
          materials: ['Módulos de acero', 'Conectores', 'Plataformas'],
          pros: ['Rápido montaje', 'Buena seguridad'],
          cons: ['Costo moderado', 'Requiere equipos']
        },
        {
          id: 'inflatable_bridge',
          name: 'Puente Inflable',
          description: 'Sistema inflable de emergencia',
          cost: 12,
          time: 2,
          durability: 0.6,
          safety: 0.7,
          efficiency: 0.6,
          materials: ['Material inflable', 'Compresor', 'Anclajes'],
          pros: ['Muy rápido', 'Fácil transporte'],
          cons: ['Vulnerable a pinchazos', 'Costo alto']
        }
      ],
      optimalSolution: 'modular_bridge',
      reasoning: 'Balance entre velocidad, seguridad y costo para emergencias'
    }
  ];

  // Iniciar juego
  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setCurrentLevel(1);
    setScore(0);
    setTimeLeft(180);
    setHintsUsed(0);
    setAttempts(0);
    setSelectedSolution(null);
    onGameStart && onGameStart();
  };

  // Seleccionar solución
  const selectSolution = (solutionId) => {
    setSelectedSolution(solutionId);
  };

  // Verificar solución
  const checkSolution = () => {
    if (!selectedSolution) {
      setFeedback('Selecciona una solución antes de verificar');
      return;
    }

    setAttempts(prev => prev + 1);
    const level = levels[currentLevel - 1];
    const isCorrect = selectedSolution === level.optimalSolution;

    if (isCorrect) {
      // Calcular score basado en tiempo, intentos y pistas
      const timeBonus = Math.max(0, 30 - Math.floor((Date.now() - startTime) / 1000));
      const attemptsPenalty = Math.max(0, (attempts - 1) * 5);
      const hintsPenalty = hintsUsed * 10;
      const levelScore = 100 + timeBonus - attemptsPenalty - hintsPenalty;
      
      setScore(prev => prev + Math.max(0, levelScore));
      setFeedback(`¡Excelente decisión! +${Math.max(0, levelScore)} puntos`);

      // Siguiente nivel o completar juego
      setTimeout(() => {
        if (currentLevel < levels.length) {
          setCurrentLevel(prev => prev + 1);
          setSelectedSolution(null);
          setFeedback('');
          setAttempts(0);
          setStartTime(Date.now());
        } else {
          completeGame();
        }
      }, 2000);
    } else {
      setFeedback('No es la solución óptima. Considera las restricciones y analiza las opciones.');
      setSelectedSolution(null);
    }
  };

  // Completar juego
  const completeGame = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const timeBonus = Math.max(0, 60 - totalTime);
    const finalScore = score + timeBonus - (hintsUsed * 10);
    
    setGameState('completed');
    
    onGameComplete({
      score: finalScore,
      timeSpent: totalTime,
      level: currentLevel,
      hintsUsed,
      attempts,
      userChoices: {
        selectedSolutions: selectedSolution,
        level: levels[currentLevel - 1]?.title
      }
    });
  };

  // Usar pista
  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      const level = levels[currentLevel - 1];
      setFeedback(`Pista: ${level.reasoning}`);
    }
  };

  // Timer
  useEffect(() => {
    let interval;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // Formatear tiempo
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stem-engineering-900 to-stem-engineering-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="w-24 h-24 bg-stem-engineering-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Hammer className="w-12 h-12 text-stem-engineering-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">El Puente Roto</h1>
          <p className="text-xl text-white/80 mb-8">
            Resuelve desafíos de ingeniería civil analizando restricciones, 
            evaluando opciones y tomando decisiones óptimas.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">¿Cómo jugar?</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-engineering-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="w-6 h-6 text-stem-engineering-400" />
                </div>
                <p className="text-white/70 text-sm">Analiza el problema</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-engineering-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Wrench className="w-6 h-6 text-stem-engineering-400" />
                </div>
                <p className="text-white/70 text-sm">Evalúa las opciones</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-engineering-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-stem-engineering-400" />
                </div>
                <p className="text-white/70 text-sm">Toma la mejor decisión</p>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="btn-primary text-lg px-8 py-4"
          >
            Comenzar Juego
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stem-engineering-900 to-stem-engineering-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">¡Problemas Resueltos!</h1>
          <p className="text-xl text-white/80 mb-8">
            Has demostrado excelente capacidad de resolución de problemas 
            y pensamiento ingenieril
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-engineering-400">{score}</div>
                <div className="text-white/70">Puntuación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-engineering-400">{levels.length}</div>
                <div className="text-white/70">Problemas Resueltos</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="btn-primary text-lg px-8 py-4"
          >
            Jugar de Nuevo
          </button>
        </motion.div>
      </div>
    );
  }

  const level = levels[currentLevel - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stem-engineering-900 to-stem-engineering-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header del juego */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-white/70">
              Nivel {currentLevel} de {levels.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5" />
              <span className="font-mono text-lg">{score}</span>
            </div>
          </div>
        </div>

        {/* Problema actual */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            {level.title}
          </h2>
          <p className="text-xl text-white/80 mb-6 text-center">
            {level.description}
          </p>
          
          <div className="bg-stem-engineering-500/20 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Escenario:</h3>
            <p className="text-white/80 mb-4">{level.scenario}</p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-stem-engineering-400">
                  ${level.constraints.budget}
                </div>
                <div className="text-white/70 text-sm">Presupuesto</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stem-engineering-400">
                  {level.constraints.time}h
                </div>
                <div className="text-white/70 text-sm">Tiempo Disponible</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stem-engineering-400">
                  {level.constraints.materials.split(',').length}
                </div>
                <div className="text-white/70 text-sm">Materiales</div>
              </div>
            </div>
          </div>
        </div>

        {/* Soluciones disponibles */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {level.solutions.map((solution) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 cursor-pointer transition-all ${
                selectedSolution === solution.id
                  ? 'border-stem-engineering-400 bg-stem-engineering-500/20'
                  : 'border-white/20 hover:border-stem-engineering-400/50'
              }`}
              onClick={() => selectSolution(solution.id)}
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {solution.name}
              </h3>
              <p className="text-white/70 mb-4 text-sm">
                {solution.description}
              </p>

              {/* Especificaciones */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Costo:</span>
                  <span className="text-stem-engineering-400">${solution.cost}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Tiempo:</span>
                  <span className="text-stem-engineering-400">{solution.time}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Durabilidad:</span>
                  <span className="text-stem-engineering-400">
                    {Math.round(solution.durability * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Seguridad:</span>
                  <span className="text-stem-engineering-400">
                    {Math.round(solution.safety * 100)}%
                  </span>
                </div>
              </div>

              {/* Materiales */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">Materiales:</h4>
                <div className="flex flex-wrap gap-1">
                  {solution.materials.map((material, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-stem-engineering-500/20 text-stem-engineering-400 text-xs rounded"
                    >
                      {material}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pros y Contras */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <h5 className="font-semibold text-green-400 mb-1">Ventajas:</h5>
                  <ul className="text-white/70 space-y-1">
                    {solution.pros.map((pro, index) => (
                      <li key={index}>• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-red-400 mb-1">Desventajas:</h5>
                  <ul className="text-white/70 space-y-1">
                    {solution.cons.map((con, index) => (
                      <li key={index}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controles */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center">
          <div className="flex justify-center space-x-4">
            <button
              onClick={useHint}
              disabled={hintsUsed >= 3}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pista ({3 - hintsUsed} restantes)
            </button>
            <button
              onClick={checkSolution}
              disabled={!selectedSolution}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verificar Solución
            </button>
          </div>
          
          {selectedSolution && (
            <div className="mt-4 text-white/70">
              Solución seleccionada: {level.solutions.find(s => s.id === selectedSolution)?.name}
            </div>
          )}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white font-semibold ${
                feedback.includes('¡Excelente') 
                  ? 'bg-green-500/90' 
                  : feedback.includes('No es la solución óptima')
                  ? 'bg-red-500/90'
                  : 'bg-stem-engineering-500/90'
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrokenBridge;

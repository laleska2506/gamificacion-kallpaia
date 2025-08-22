import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, CheckCircle, Lightbulb, Leaf, Zap, Wrench } from 'lucide-react';

const GreenInvention = ({ onGameComplete, onGameStart }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos
  const [gameState, setGameState] = useState('ready');
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Desafíos ambientales
  const challenges = [
    {
      id: 1,
      title: "Purificación de Agua",
      description: "Diseña un sistema para purificar agua contaminada en comunidades rurales",
      materials: [
        { id: 'sand', name: 'Arena', category: 'filtration', efficiency: 0.8, cost: 2 },
        { id: 'charcoal', name: 'Carbón Activado', category: 'filtration', efficiency: 0.9, cost: 4 },
        { id: 'gravel', name: 'Gravilla', category: 'filtration', efficiency: 0.6, cost: 1 },
        { id: 'cotton', name: 'Algodón', category: 'filtration', efficiency: 0.7, cost: 2 },
        { id: 'plastic', name: 'Plástico Reciclado', category: 'container', efficiency: 0.5, cost: 1 },
        { id: 'ceramic', name: 'Cerámica', category: 'container', efficiency: 0.8, cost: 3 },
        { id: 'metal', name: 'Metal Reciclado', category: 'container', efficiency: 0.7, cost: 2 },
        { id: 'solar', name: 'Panel Solar', category: 'energy', efficiency: 0.9, cost: 5 },
        { id: 'battery', name: 'Batería', category: 'energy', efficiency: 0.6, cost: 3 }
      ],
      optimalMaterials: ['sand', 'charcoal', 'ceramic', 'solar'],
      maxCost: 12
    },
    {
      id: 2,
      title: "Energía Renovable",
      description: "Crea un sistema de energía renovable para una casa pequeña",
      materials: [
        { id: 'solar', name: 'Panel Solar', category: 'energy', efficiency: 0.9, cost: 5 },
        { id: 'wind', name: 'Turbina Eólica', category: 'energy', efficiency: 0.8, cost: 4 },
        { id: 'battery', name: 'Batería de Almacenamiento', category: 'storage', efficiency: 0.7, cost: 3 },
        { id: 'inverter', name: 'Inversor', category: 'electronics', efficiency: 0.8, cost: 4 },
        { id: 'wire', name: 'Cableado', category: 'electronics', efficiency: 0.6, cost: 2 },
        { id: 'metal', name: 'Metal Reciclado', category: 'structure', efficiency: 0.7, cost: 2 },
        { id: 'wood', name: 'Madera Sostenible', category: 'structure', efficiency: 0.6, cost: 1 },
        { id: 'glass', name: 'Vidrio Reciclado', category: 'structure', efficiency: 0.5, cost: 1 }
      ],
      optimalMaterials: ['solar', 'battery', 'inverter', 'wire'],
      maxCost: 15
    },
    {
      id: 3,
      title: "Agricultura Urbana",
      description: "Diseña un sistema de agricultura urbana vertical y sostenible",
      materials: [
        { id: 'soil', name: 'Tierra Orgánica', category: 'growing', efficiency: 0.8, cost: 2 },
        { id: 'compost', name: 'Compost', category: 'growing', efficiency: 0.9, cost: 3 },
        { id: 'seeds', name: 'Semillas Nativas', category: 'growing', efficiency: 0.7, cost: 1 },
        { id: 'plastic', name: 'Contenedores Reciclados', category: 'container', efficiency: 0.6, cost: 1 },
        { id: 'ceramic', name: 'Macetas de Cerámica', category: 'container', efficiency: 0.8, cost: 3 },
        { id: 'water', name: 'Sistema de Riego', category: 'irrigation', efficiency: 0.8, cost: 4 },
        { id: 'solar', name: 'Panel Solar', category: 'energy', efficiency: 0.9, cost: 5 },
        { id: 'bamboo', name: 'Bambú', category: 'structure', efficiency: 0.7, cost: 2 }
      ],
      optimalMaterials: ['soil', 'compost', 'seeds', 'ceramic', 'water'],
      maxCost: 13
    }
  ];

  // Iniciar juego
  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setCurrentChallenge(0);
    setScore(0);
    setTimeLeft(180);
    setHintsUsed(0);
    setSelectedMaterials([]);
    onGameStart && onGameStart();
  };

  // Seleccionar/deseleccionar material
  const toggleMaterial = (materialId) => {
    setSelectedMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else {
        return [...prev, materialId];
      }
    });
  };

  // Verificar solución
  const checkSolution = () => {
    if (selectedMaterials.length === 0) {
      setFeedback('Selecciona al menos un material');
      return;
    }

    const challenge = challenges[currentChallenge];
    const totalCost = selectedMaterials.reduce((sum, materialId) => {
      const material = challenge.materials.find(m => m.id === materialId);
      return sum + (material?.cost || 0);
    }, 0);

    if (totalCost > challenge.maxCost) {
      setFeedback(`Presupuesto excedido: $${totalCost}/${challenge.maxCost}`);
      return;
    }

    // Calcular score basado en eficiencia y materiales óptimos
    const efficiency = selectedMaterials.reduce((sum, materialId) => {
      const material = challenge.materials.find(m => m.id === materialId);
      return sum + (material?.efficiency || 0);
    }, 0) / selectedMaterials.length;

    const optimalCount = selectedMaterials.filter(id => 
      challenge.optimalMaterials.includes(id)
    ).length;

    const optimalBonus = (optimalCount / challenge.optimalMaterials.length) * 50;
    const efficiencyBonus = efficiency * 30;
    const costBonus = Math.max(0, (challenge.maxCost - totalCost) * 2);
    
    const challengeScore = Math.round(optimalBonus + efficiencyBonus + costBonus);
    setScore(prev => prev + challengeScore);

    setFeedback(`¡Excelente! +${challengeScore} puntos`);

    // Siguiente desafío o completar juego
    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedMaterials([]);
        setFeedback('');
      } else {
        completeGame();
      }
    }, 2000);
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
      challenges: challenges.length,
      hintsUsed,
      userChoices: {
        selectedMaterials: selectedMaterials,
        challenge: challenges[currentChallenge]?.title
      }
    });
  };

  // Usar pista
  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      const challenge = challenges[currentChallenge];
      setFeedback(`Pista: Considera materiales de la categoría "filtration" para este desafío`);
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

  // Obtener material por ID
  const getMaterial = (materialId) => {
    return challenges[currentChallenge]?.materials.find(m => m.id === materialId);
  };

  // Calcular costo total
  const getTotalCost = () => {
    return selectedMaterials.reduce((sum, materialId) => {
      const material = getMaterial(materialId);
      return sum + (material?.cost || 0);
    }, 0);
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
            <Leaf className="w-12 h-12 text-stem-engineering-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Invento Verde</h1>
          <p className="text-xl text-white/80 mb-8">
            Diseña soluciones ambientales innovadoras seleccionando los materiales 
            más eficientes y sostenibles.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">¿Cómo jugar?</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-engineering-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Lightbulb className="w-6 h-6 text-stem-engineering-400" />
                </div>
                <p className="text-white/70 text-sm">Lee el desafío</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-engineering-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Wrench className="w-6 h-6 text-stem-engineering-400" />
                </div>
                <p className="text-white/70 text-sm">Selecciona materiales</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-engineering-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-stem-engineering-400" />
                </div>
                <p className="text-white/70 text-sm">Optimiza tu solución</p>
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
          
          <h1 className="text-4xl font-bold text-white mb-4">¡Invento Completado!</h1>
          <p className="text-xl text-white/80 mb-8">
            Has demostrado excelente creatividad aplicada y pensamiento ingenieril
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-engineering-400">{score}</div>
                <div className="text-white/70">Puntuación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-engineering-400">{challenges.length}</div>
                <div className="text-white/70">Desafíos Completados</div>
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

  const challenge = challenges[currentChallenge];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stem-engineering-900 to-stem-engineering-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header del juego */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-white/70">
              Desafío {currentChallenge + 1} de {challenges.length}
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

        {/* Desafío actual */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{challenge.title}</h2>
          <p className="text-xl text-white/80 mb-6">{challenge.description}</p>
          <div className="bg-stem-engineering-500/20 rounded-lg p-4 inline-block">
            <span className="text-white font-semibold">
              Presupuesto: ${challenge.maxCost}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Materiales disponibles */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Materiales Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {challenge.materials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => toggleMaterial(material.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMaterials.includes(material.id)
                      ? 'bg-stem-engineering-500/30 border-stem-engineering-400'
                      : 'bg-white/10 border-white/20 hover:border-stem-engineering-400/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white mb-2">
                      {material.name}
                    </div>
                    <div className="text-sm text-white/70 mb-2">
                      Categoría: {material.category}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-stem-engineering-400">
                        Eficiencia: {Math.round(material.efficiency * 100)}%
                      </span>
                      <span className="text-stem-engineering-400">
                        Costo: ${material.cost}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selección del usuario */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Tu Selección
            </h3>
            
            {selectedMaterials.length === 0 ? (
              <div className="text-center text-white/50 py-12">
                Selecciona materiales para comenzar
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {selectedMaterials.map((materialId) => {
                    const material = getMaterial(materialId);
                    return (
                      <div
                        key={materialId}
                        className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                      >
                        <span className="text-white font-medium">{material.name}</span>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-stem-engineering-400">
                            {Math.round(material.efficiency * 100)}%
                          </span>
                          <span className="text-stem-engineering-400">
                            ${material.cost}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-stem-engineering-500/20 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center text-white font-semibold">
                    <span>Costo Total:</span>
                    <span className={`${getTotalCost() > challenge.maxCost ? 'text-red-400' : 'text-green-400'}`}>
                      ${getTotalCost()}/{challenge.maxCost}
                    </span>
                  </div>
                </div>

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
                    className="btn-primary"
                  >
                    Verificar Solución
                  </button>
                </div>
              </>
            )}
          </div>
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
                  : feedback.includes('Presupuesto excedido')
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

export default GreenInvention;

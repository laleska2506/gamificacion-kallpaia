import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, CheckCircle, Rocket, Satellite, Globe, Star, Zap } from 'lucide-react';

const SpaceExplorer = ({ onGameComplete, onGameStart }) => {
  const [currentMission, setCurrentMission] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos
  const [gameState, setGameState] = useState('ready');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [missionProgress, setMissionProgress] = useState(0);

  // Misiones espaciales
  const missions = [
    {
      id: 1,
      title: "Sonda de Exploración Lunar",
      description: "Diseña una sonda para explorar la superficie lunar y recopilar datos científicos",
      objective: "Crear una sonda autónoma que pueda aterrizar, moverse y transmitir datos",
      constraints: {
        power: 100, // Watts
        weight: 50, // kg
        budget: 20, // millones USD
        time: 36 // meses
      },
      components: [
        {
          id: 'solar_panel',
          name: 'Panel Solar',
          category: 'power',
          power: 25,
          weight: 8,
          cost: 3,
          reliability: 0.9,
          description: 'Genera energía eléctrica a partir de la luz solar'
        },
        {
          id: 'battery',
          name: 'Batería de Litio',
          category: 'power',
          power: 0,
          weight: 5,
          cost: 2,
          reliability: 0.8,
          description: 'Almacena energía para operaciones nocturnas'
        },
        {
          id: 'camera',
          name: 'Cámara de Alta Resolución',
          category: 'science',
          power: 15,
          weight: 3,
          cost: 4,
          reliability: 0.85,
          description: 'Captura imágenes detalladas de la superficie'
        },
        {
          id: 'spectrometer',
          name: 'Espectrómetro',
          category: 'science',
          power: 20,
          weight: 4,
          cost: 5,
          reliability: 0.8,
          description: 'Analiza la composición química del suelo'
        },
        {
          id: 'rover_wheels',
          name: 'Sistema de Movimiento',
          category: 'mobility',
          power: 10,
          weight: 6,
          cost: 3,
          reliability: 0.75,
          description: 'Permite que la sonda se mueva por la superficie'
        },
        {
          id: 'antenna',
          name: 'Antena de Comunicación',
          category: 'communication',
          power: 8,
          weight: 2,
          cost: 2,
          reliability: 0.9,
          description: 'Transmite datos a la Tierra'
        },
        {
          id: 'computer',
          name: 'Computadora de Vuelo',
          category: 'control',
          power: 12,
          weight: 2,
          cost: 3,
          reliability: 0.95,
          description: 'Controla todas las operaciones de la sonda'
        },
        {
          id: 'thermal_shield',
          name: 'Escudo Térmico',
          category: 'protection',
          power: 0,
          weight: 8,
          cost: 2,
          reliability: 0.85,
          description: 'Protege contra temperaturas extremas'
        }
      ],
      optimalComponents: ['solar_panel', 'battery', 'camera', 'spectrometer', 'rover_wheels', 'antenna', 'computer'],
      maxPower: 100,
      maxWeight: 50,
      maxBudget: 20
    },
    {
      id: 2,
      title: "Satélite de Observación Terrestre",
      description: "Construye un satélite para monitorear cambios climáticos y desastres naturales",
      objective: "Satélite en órbita baja que capture imágenes multiespectrales",
      constraints: {
        power: 150,
        weight: 80,
        budget: 35,
        time: 48
      },
      components: [
        {
          id: 'advanced_solar',
          name: 'Paneles Solares Avanzados',
          category: 'power',
          power: 40,
          weight: 12,
          cost: 6,
          reliability: 0.95,
          description: 'Paneles de alta eficiencia para órbita terrestre'
        },
        {
          id: 'multi_camera',
          name: 'Sistema de Cámaras Multiespectrales',
          category: 'science',
          power: 35,
          weight: 15,
          cost: 8,
          reliability: 0.9,
          description: 'Cámaras que capturan diferentes longitudes de onda'
        },
        {
          id: 'gps_receiver',
          name: 'Receptor GPS',
          category: 'navigation',
          power: 5,
          weight: 1,
          cost: 1,
          reliability: 0.98,
          description: 'Determina la posición exacta del satélite'
        },
        {
          id: 'data_storage',
          name: 'Sistema de Almacenamiento',
          category: 'data',
          power: 8,
          weight: 3,
          cost: 2,
          reliability: 0.9,
          description: 'Almacena datos antes de transmitirlos'
        },
        {
          id: 'high_gain_antenna',
          name: 'Antena de Alta Ganancia',
          category: 'communication',
          power: 12,
          weight: 4,
          cost: 4,
          reliability: 0.92,
          description: 'Transmisión de datos de alta velocidad'
        },
        {
          id: 'attitude_control',
          name: 'Control de Actitud',
          category: 'control',
          power: 15,
          weight: 8,
          cost: 5,
          reliability: 0.88,
          description: 'Mantiene la orientación correcta del satélite'
        },
        {
          id: 'thermal_control',
          name: 'Control Térmico',
          category: 'protection',
          power: 10,
          weight: 6,
          cost: 3,
          reliability: 0.85,
          description: 'Regula la temperatura interna'
        }
      ],
      optimalComponents: ['advanced_solar', 'multi_camera', 'gps_receiver', 'data_storage', 'high_gain_antenna', 'attitude_control'],
      maxPower: 150,
      maxWeight: 80,
      maxBudget: 35
    },
    {
      id: 3,
      title: "Estación Espacial Modular",
      description: "Diseña una estación espacial para investigación científica y habitación humana",
      objective: "Estación modular con laboratorios, habitaciones y sistemas de soporte vital",
      constraints: {
        power: 300,
        weight: 150,
        budget: 80,
        time: 72
      },
      components: [
        {
          id: 'nuclear_reactor',
          name: 'Reactor Nuclear',
          category: 'power',
          power: 100,
          weight: 25,
          cost: 20,
          reliability: 0.99,
          description: 'Fuente de energía principal de alta potencia'
        },
        {
          id: 'life_support',
          name: 'Sistema de Soporte Vital',
          category: 'life',
          power: 40,
          weight: 20,
          cost: 15,
          reliability: 0.98,
          description: 'Mantiene el aire respirable y agua potable'
        },
        {
          id: 'lab_module',
          name: 'Módulo de Laboratorio',
          category: 'science',
          power: 25,
          weight: 15,
          cost: 12,
          reliability: 0.9,
          description: 'Espacio para experimentos científicos'
        },
        {
          id: 'habitation_module',
          name: 'Módulo de Habitación',
          category: 'life',
          power: 20,
          weight: 12,
          cost: 10,
          reliability: 0.9,
          description: 'Área para que vivan los astronautas'
        },
        {
          id: 'docking_port',
          name: 'Puerto de Acoplamiento',
          category: 'infrastructure',
          power: 5,
          weight: 8,
          cost: 8,
          reliability: 0.95,
          description: 'Permite conectar naves espaciales'
        },
        {
          id: 'robotic_arm',
          name: 'Brazo Robótico',
          category: 'operations',
          power: 15,
          weight: 10,
          cost: 12,
          reliability: 0.85,
          description: 'Realiza tareas de mantenimiento exterior'
        },
        {
          id: 'communication_array',
          name: 'Array de Comunicación',
          category: 'communication',
          power: 20,
          weight: 8,
          cost: 8,
          reliability: 0.92,
          description: 'Comunicación con la Tierra y otras naves'
        }
      ],
      optimalComponents: ['nuclear_reactor', 'life_support', 'lab_module', 'habitation_module', 'docking_port', 'robotic_arm'],
      maxPower: 300,
      maxWeight: 150,
      maxBudget: 80
    }
  ];

  // Iniciar juego
  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setCurrentMission(0);
    setScore(0);
    setTimeLeft(180);
    setHintsUsed(0);
    setMissionProgress(0);
    setSelectedComponents([]);
    onGameStart && onGameStart();
  };

  // Seleccionar/deseleccionar componente
  const toggleComponent = (componentId) => {
    setSelectedComponents(prev => {
      if (prev.includes(componentId)) {
        return prev.filter(id => id !== componentId);
      } else {
        return [...prev, componentId];
      }
    });
  };

  // Verificar misión
  const checkMission = () => {
    if (selectedComponents.length === 0) {
      setFeedback('Selecciona al menos un componente');
      return;
    }

    const mission = missions[currentMission];
    const totalPower = selectedComponents.reduce((sum, componentId) => {
      const component = mission.components.find(c => c.id === componentId);
      return sum + (component?.power || 0);
    }, 0);

    const totalWeight = selectedComponents.reduce((sum, componentId) => {
      const component = mission.components.find(c => c.id === componentId);
      return sum + (component?.weight || 0);
    }, 0);

    const totalCost = selectedComponents.reduce((sum, componentId) => {
      const component = mission.components.find(c => c.id === componentId);
      return sum + (component?.cost || 0);
    }, 0);

    // Verificar restricciones
    if (totalPower > mission.maxPower) {
      setFeedback(`Consumo de energía excedido: ${totalPower}/${mission.maxPower}W`);
      return;
    }

    if (totalWeight > mission.maxWeight) {
      setFeedback(`Peso excedido: ${totalWeight}/${mission.maxWeight}kg`);
      return;
    }

    if (totalCost > mission.maxBudget) {
      setFeedback(`Presupuesto excedido: $${totalCost}/${mission.maxBudget}M`);
      return;
    }

    // Calcular score basado en componentes óptimos y eficiencia
    const optimalCount = selectedComponents.filter(id => 
      mission.optimalComponents.includes(id)
    ).length;

    const reliability = selectedComponents.reduce((sum, componentId) => {
      const component = mission.components.find(c => c.id === componentId);
      return sum + (component?.reliability || 0);
    }, 0) / selectedComponents.length;

    const optimalBonus = (optimalCount / mission.optimalComponents.length) * 60;
    const reliabilityBonus = reliability * 30;
    const efficiencyBonus = Math.max(0, (mission.maxPower - totalPower) / mission.maxPower * 20);
    
    const missionScore = Math.round(optimalBonus + reliabilityBonus + efficiencyBonus);
    setScore(prev => prev + missionScore);

    setFeedback(`¡Misión exitosa! +${missionScore} puntos`);
    setMissionProgress(prev => prev + 1);

    // Siguiente misión o completar juego
    setTimeout(() => {
      if (currentMission < missions.length - 1) {
        setCurrentMission(prev => prev + 1);
        setSelectedComponents([]);
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
      missions: missions.length,
      hintsUsed,
      userChoices: {
        selectedComponents: selectedComponents,
        mission: missions[currentMission]?.title
      }
    });
  };

  // Usar pista
  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      const mission = missions[currentMission];
      setFeedback(`Pista: Considera componentes de la categoría "power" para esta misión`);
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

  // Obtener componente por ID
  const getComponent = (componentId) => {
    return missions[currentMission]?.components.find(c => c.id === componentId);
  };

  // Calcular totales
  const getTotals = () => {
    const mission = missions[currentMission];
    if (!mission) return { power: 0, weight: 0, cost: 0 };

    return selectedComponents.reduce((totals, componentId) => {
      const component = getComponent(componentId);
      if (component) {
        totals.power += component.power;
        totals.weight += component.weight;
        totals.cost += component.cost;
      }
      return totals;
    }, { power: 0, weight: 0, cost: 0 });
  };

  if (gameState === 'ready') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stem-tech-900 to-stem-tech-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="w-24 h-24 bg-stem-tech-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-12 h-12 text-stem-tech-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Exploradora Espacial</h1>
          <p className="text-xl text-white/80 mb-8">
            Diseña misiones espaciales seleccionando componentes tecnológicos 
            que cumplan con las restricciones de la misión.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">¿Cómo jugar?</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-tech-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Satellite className="w-6 h-6 text-stem-tech-400" />
                </div>
                <p className="text-white/70 text-sm">Analiza la misión</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-tech-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-6 h-6 text-stem-tech-400" />
                </div>
                <p className="text-white/70 text-sm">Selecciona componentes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-tech-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-stem-tech-400" />
                </div>
                <p className="text-white/70 text-sm">Optimiza tu diseño</p>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="btn-primary text-lg px-8 py-4"
          >
            Comenzar Misión
          </button>
        </motion.div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stem-tech-900 to-stem-tech-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">¡Misiones Completadas!</h1>
          <p className="text-xl text-white/80 mb-8">
            Has demostrado excelente afinidad tecnológica y habilidades 
            en ciencias exactas
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-tech-400">{score}</div>
                <div className="text-white/70">Puntuación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-tech-400">{missions.length}</div>
                <div className="text-white/70">Misiones Completadas</div>
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

  const mission = missions[currentMission];
  const totals = getTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stem-tech-900 to-stem-tech-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header del juego */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="text-white/70">
              Misión {currentMission + 1} de {missions.length}
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

        {/* Misión actual */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            {mission.title}
          </h2>
          <p className="text-xl text-white/80 mb-6 text-center">
            {mission.description}
          </p>
          
          <div className="bg-stem-tech-500/20 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Objetivo:</h3>
            <p className="text-white/80 mb-4">{mission.objective}</p>
            
            <div className="grid md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-stem-tech-400">
                  {mission.maxPower}W
                </div>
                <div className="text-white/70 text-sm">Potencia Máx.</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stem-tech-400">
                  {mission.maxWeight}kg
                </div>
                <div className="text-white/70 text-sm">Peso Máx.</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stem-tech-400">
                  ${mission.maxBudget}M
                </div>
                <div className="text-white/70 text-sm">Presupuesto</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stem-tech-400">
                  {mission.time}m
                </div>
                <div className="text-white/70 text-sm">Tiempo</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Componentes disponibles */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                Componentes Disponibles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mission.components.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => toggleComponent(component.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedComponents.includes(component.id)
                        ? 'bg-stem-tech-500/30 border-stem-tech-400'
                        : 'bg-white/10 border-white/20 hover:border-stem-tech-400/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{component.name}</h4>
                      <span className="text-xs text-stem-tech-400 bg-stem-tech-500/20 px-2 py-1 rounded">
                        {component.category}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{component.description}</p>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div>
                        <div className="text-stem-tech-400 font-semibold">{component.power}W</div>
                        <div className="text-white/50">Potencia</div>
                      </div>
                      <div>
                        <div className="text-stem-tech-400 font-semibold">{component.weight}kg</div>
                        <div className="text-white/50">Peso</div>
                      </div>
                      <div>
                        <div className="text-stem-tech-400 font-semibold">${component.cost}M</div>
                        <div className="text-white/50">Costo</div>
                      </div>
                      <div>
                        <div className="text-stem-tech-400 font-semibold">
                          {Math.round(component.reliability * 100)}%
                        </div>
                        <div className="text-white/50">Confiabilidad</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Diseño del usuario */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Tu Diseño
            </h3>
            
            {selectedComponents.length === 0 ? (
              <div className="text-center text-white/50 py-12">
                Selecciona componentes para comenzar
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {selectedComponents.map((componentId) => {
                    const component = getComponent(componentId);
                    return (
                      <div
                        key={componentId}
                        className="flex items-center justify-between bg-white/10 rounded-lg p-3"
                      >
                        <span className="text-white font-medium text-sm">{component.name}</span>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-stem-tech-400">{component.power}W</span>
                          <span className="text-stem-tech-400">{component.weight}kg</span>
                          <span className="text-stem-tech-400">${component.cost}M</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Totales */}
                <div className="space-y-3 mb-6">
                  <div className="bg-stem-tech-500/20 rounded-lg p-3">
                    <div className="flex justify-between items-center text-white font-semibold">
                      <span>Potencia Total:</span>
                      <span className={`${totals.power > mission.maxPower ? 'text-red-400' : 'text-green-400'}`}>
                        {totals.power}W/{mission.maxPower}W
                      </span>
                    </div>
                  </div>
                  <div className="bg-stem-tech-500/20 rounded-lg p-3">
                    <div className="flex justify-between items-center text-white font-semibold">
                      <span>Peso Total:</span>
                      <span className={`${totals.weight > mission.maxWeight ? 'text-red-400' : 'text-green-400'}`}>
                        {totals.weight}kg/{mission.maxWeight}kg
                      </span>
                    </div>
                  </div>
                  <div className="bg-stem-tech-500/20 rounded-lg p-3">
                    <div className="flex justify-between items-center text-white font-semibold">
                      <span>Costo Total:</span>
                      <span className={`${totals.cost > mission.maxBudget ? 'text-red-400' : 'text-green-400'}`}>
                        ${totals.cost}M/${mission.maxBudget}M
                      </span>
                    </div>
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
                    onClick={checkMission}
                    className="btn-primary"
                  >
                    Verificar Misión
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
                feedback.includes('¡Misión exitosa') 
                  ? 'bg-green-500/90' 
                  : feedback.includes('excedido')
                  ? 'bg-red-500/90'
                  : 'bg-stem-tech-500/90'
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

export default SpaceExplorer;

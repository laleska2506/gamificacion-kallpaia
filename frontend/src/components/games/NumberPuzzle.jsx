import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const NumberPuzzle = ({ onGameComplete, onGameStart }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, completed
  const [currentSequence, setCurrentSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [levelData, setLevelData] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Configuración de niveles
  const levels = [
    {
      level: 1,
      sequenceLength: 4,
      pattern: 'arithmetic',
      description: 'Encuentra el patrón aritmético en la secuencia'
    },
    {
      level: 2,
      sequenceLength: 5,
      pattern: 'geometric',
      description: 'Identifica la progresión geométrica'
    },
    {
      level: 3,
      sequenceLength: 6,
      pattern: 'fibonacci',
      description: 'Descubre la secuencia de Fibonacci'
    }
  ];

  // Generar secuencia según el patrón
  const generateSequence = useCallback((level) => {
    const levelConfig = levels.find(l => l.level === level);
    if (!levelConfig) return [];

    let sequence = [];
    const { pattern, sequenceLength } = levelConfig;

    switch (pattern) {
      case 'arithmetic':
        // Generar secuencia aritmética que se pueda completar con números del 0-9
        const start = Math.floor(Math.random() * 5) + 1; // Empezar con 1-5
        const difference = Math.floor(Math.random() * 3) + 1; // Diferencia 1-3
        
        for (let i = 0; i < sequenceLength; i++) {
          const num = start + (i * difference);
          if (num <= 9) { // Solo números del 0-9
            sequence.push(num);
          }
        }
        break;

      case 'geometric':
        // Generar secuencia geométrica que se pueda completar con números del 0-9
        const first = Math.floor(Math.random() * 3) + 1; // Empezar con 1-3
        const ratio = 2; // Solo ratio 2 para mantener números pequeños
        
        for (let i = 0; i < sequenceLength; i++) {
          const num = first * Math.pow(ratio, i);
          if (num <= 9) { // Solo números del 0-9
            sequence.push(num);
          }
        }
        break;

      case 'fibonacci':
        // Generar secuencia Fibonacci que se pueda completar con números del 0-9
        sequence = [1, 1];
        for (let i = 2; i < sequenceLength; i++) {
          const nextNum = sequence[i-1] + sequence[i-2];
          if (nextNum <= 9) { // Solo números del 0-9
            sequence.push(nextNum);
          } else {
            break;
          }
        }
        break;

      default:
        // Secuencia simple del 1 al sequenceLength
        for (let i = 1; i <= sequenceLength; i++) {
          sequence.push(i);
        }
    }

    return sequence;
  }, []);

  // Iniciar juego
  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setCurrentLevel(1);
    setScore(0);
    setTimeLeft(180);
    setHintsUsed(0);
    onGameStart && onGameStart();
    
    // Generar una secuencia válida para el nivel 1
    const newSequence = generateSequence(1);
    setCurrentSequence(newSequence);
    setLevelData(levels[0]);
  };

  // Pausar/reanudar juego
  const togglePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  // Verificar respuesta del usuario
  const checkAnswer = () => {
    if (userSequence.length !== 1) {
      setFeedback('Selecciona solo un número');
      return;
    }

    // Calcular el siguiente número esperado basado en el patrón actual
    let expectedNextNumber = null;
    const { pattern } = levelData;
    
    switch (pattern) {
      case 'arithmetic':
        // Para secuencia aritmética, continuar con la misma diferencia
        if (currentSequence.length >= 2) {
          const difference = currentSequence[1] - currentSequence[0];
          const lastNumber = currentSequence[currentSequence.length - 1];
          expectedNextNumber = lastNumber + difference;
        }
        break;
        
      case 'geometric':
        // Para secuencia geométrica, continuar con la misma razón
        if (currentSequence.length >= 2) {
          const ratio = currentSequence[1] / currentSequence[0];
          const lastNumber = currentSequence[currentSequence.length - 1];
          expectedNextNumber = Math.round(lastNumber * ratio);
        }
        break;
        
      case 'fibonacci':
        // Para secuencia Fibonacci, continuar sumando los dos últimos
        if (currentSequence.length >= 2) {
          const a = currentSequence[currentSequence.length - 2];
          const b = currentSequence[currentSequence.length - 1];
          expectedNextNumber = a + b;
        }
        break;
        
      default:
        expectedNextNumber = currentSequence[currentSequence.length - 1] + 1;
    }
    
    // Verificar si el número del usuario es correcto
    const isCorrect = userSequence[0] === expectedNextNumber;
    
    // Logging para debugging
    console.log('🔍 Debug NumberPuzzle:', {
      currentSequence,
      userSequence: userSequence[0],
      expectedNextNumber,
      pattern: levelData?.pattern,
      isCorrect
    });
    
    if (isCorrect) {
      const timeBonus = Math.max(0, 30 - Math.floor((Date.now() - startTime) / 1000));
      const levelScore = 100 + timeBonus - (hintsUsed * 10);
      setScore(prev => prev + levelScore);
      
      setFeedback(`¡Correcto! +${levelScore} puntos`);
      
      // Siguiente nivel o completar juego
      if (currentLevel < levels.length) {
        setTimeout(() => {
          const nextLevel = currentLevel + 1;
          setCurrentLevel(nextLevel);
          const newSequence = generateSequence(nextLevel);
          setCurrentSequence(newSequence);
          setLevelData(levels.find(l => l.level === nextLevel));
          setUserSequence([]);
          setFeedback('');
          setStartTime(Date.now());
        }, 1500);
      } else {
        // Juego completado
        setTimeout(() => {
          completeGame();
        }, 1500);
      }
    } else {
      setFeedback('Incorrecto. Intenta de nuevo');
      setUserSequence([]);
    }
  };

  // Completar juego
  const completeGame = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const finalScore = Math.max(0, score - Math.floor(totalTime / 10));
    
    setGameState('completed');
    
    onGameComplete({
      score: finalScore,
      timeSpent: totalTime,
      level: currentLevel,
      hintsUsed,
      userChoices: {
        sequences: currentSequence,
        userAnswers: userSequence,
        pattern: levelData?.pattern
      }
    });
  };

  // Usar pista
  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(prev => prev + 1);
      setFeedback(`Pista: El patrón es ${levelData?.pattern}`);
    }
  };

  // Agregar número a la secuencia del usuario
  const addNumber = (number) => {
    if (userSequence.length === 0) {
      // Si es el primer número, crear un array con el número
      setUserSequence([number]);
    } else {
      // Si ya hay números, construir un número de múltiples dígitos
      const currentNumber = userSequence[0];
      const newNumber = currentNumber * 10 + number;
      
      // Limitar a 3 dígitos máximo
      if (newNumber <= 999) {
        setUserSequence([newNumber]);
      }
    }
  };

  // Remover último dígito
  const removeLastNumber = () => {
    if (userSequence.length > 0) {
      const currentNumber = userSequence[0];
      if (currentNumber < 10) {
        // Si es un solo dígito, eliminar todo
        setUserSequence([]);
      } else {
        // Si tiene múltiples dígitos, eliminar el último
        const newNumber = Math.floor(currentNumber / 10);
        setUserSequence([newNumber]);
      }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stem-math-900 to-stem-math-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="w-24 h-24 bg-stem-math-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔢</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Puzzle de Números</h1>
          <p className="text-xl text-white/80 mb-8">
            Descubre el patrón matemático en cada secuencia. 
            Tu habilidad lógico-matemática será evaluada.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">¿Cómo jugar?</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-math-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">👁️</span>
                </div>
                <p className="text-white/70 text-sm">Observa la secuencia</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-math-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">🧠</span>
                </div>
                <p className="text-white/70 text-sm">Identifica el patrón</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-stem-math-500/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">✅</span>
                </div>
                <p className="text-white/70 text-sm">Completa la secuencia</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stem-math-900 to-stem-math-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl mx-auto p-8"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">¡Juego Completado!</h1>
          <p className="text-xl text-white/80 mb-8">
            Has demostrado excelentes habilidades lógico-matemáticas
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-math-400">{score}</div>
                <div className="text-white/70">Puntuación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-stem-math-400">{currentLevel}</div>
                <div className="text-white/70">Nivel Alcanzado</div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-stem-math-900 to-stem-math-800 p-4">
      {/* Header del juego */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePause}
              className="btn-secondary"
            >
              {gameState === 'playing' ? 'Pausar' : 'Reanudar'}
            </button>
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

        {/* Información del nivel */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {levelData?.description}
          </h2>
                     <p className="text-white/70">
             Encuentra el siguiente número en la secuencia
           </p>
        </div>

        {/* Secuencia actual */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            Secuencia a completar:
          </h3>
          <div className="flex justify-center space-x-4 mb-6">
            {currentSequence.map((num, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="w-16 h-16 bg-stem-math-500/30 border-2 border-stem-math-400/50 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
              >
                {num}
              </motion.div>
            ))}
          </div>
        </div>

                 {/* Siguiente número */}
         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 mb-8">
           <h3 className="text-xl font-semibold text-white mb-4 text-center">
             ¿Cuál es el siguiente número?
           </h3>
                       <div className="flex justify-center mb-6">
              <div className={`rounded-lg flex items-center justify-center text-2xl font-bold border-2 bg-stem-math-400/30 border-stem-math-400 text-white ${
                userSequence[0] ? (userSequence[0] < 10 ? 'w-16 h-16' : userSequence[0] < 100 ? 'w-20 h-16' : 'w-24 h-16') : 'w-16 h-16'
              }`}>
                {userSequence[0] || '?'}
              </div>
            </div>

          {/* Controles */}
          <div className="flex justify-center space-x-4">
                         <button
               onClick={removeLastNumber}
               disabled={userSequence.length === 0}
               className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <RotateCcw className="w-4 h-4 mr-2" />
               {userSequence[0] && userSequence[0] >= 10 ? 'Borrar último dígito' : 'Deshacer'}
             </button>
            <button
              onClick={useHint}
              disabled={hintsUsed >= 3}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pista ({3 - hintsUsed} restantes)
            </button>
                         <button
               onClick={checkAnswer}
               disabled={userSequence.length !== 1}
               className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Verificar
             </button>
          </div>
        </div>

                 {/* Teclado numérico */}
         <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8">
           <h3 className="text-xl font-semibold text-white mb-4 text-center">
             Selecciona el siguiente número:
           </h3>
           <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto">
             {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                               <button
                  key={num}
                  onClick={() => addNumber(num)}
                  disabled={userSequence.length > 0 && userSequence[0] >= 999}
                  className="w-16 h-16 bg-stem-math-500/30 hover:bg-stem-math-500/50 disabled:opacity-50 disabled:cursor-not-allowed border border-stem-math-400/50 rounded-lg text-2xl font-bold text-white transition-colors"
                >
                  {num}
                </button>
             ))}
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
                feedback.includes('Correcto') 
                  ? 'bg-green-500/90' 
                  : feedback.includes('Incorrecto')
                  ? 'bg-red-500/90'
                  : 'bg-stem-math-500/90'
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

export default NumberPuzzle;

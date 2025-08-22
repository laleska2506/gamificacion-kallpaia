import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../contexts/SessionContext';
import { useAffinity } from '../contexts/AffinityContext';
import { useCooperativeRanking } from '../contexts/CooperativeRankingContext';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Rocket,
  Globe,
  Zap,
  Shield
} from 'lucide-react';

const PlanetExploration = () => {
  const { planetKey } = useParams();
  // Acepta slugs sin acento: matematicas, tecnologia, ingenieria, ciencia
  const slugToArea = {
    matematicas: 'matemáticas',
    tecnologia: 'tecnología',
    ingenieria: 'ingeniería',
    ciencia: 'ciencia'
  };
  const normalizedKey = slugToArea[planetKey] || planetKey;
  const navigate = useNavigate();
  const { gameProgress, completedGames } = useSession();
  const { stemAffinities, getAreaStats, getImprovementRecommendations } = useAffinity();
  const { galaxyStats, userContributions, stemPlanets } = useCooperativeRanking();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showAchievement, setShowAchievement] = useState(false);
  const [loading, setLoading] = useState(false);

  // Obtener información del planeta
  const planet = stemPlanets[normalizedKey];
  const planetStats = galaxyStats?.planets?.[normalizedKey];
  const userStats = getAreaStats(normalizedKey);
  const userAffinity = stemAffinities?.[normalizedKey];
  const recommendations = getImprovementRecommendations(normalizedKey);

  // Mapeo de características por planeta
  const planetFeatures = {
    'matemáticas': {
      coreSkills: ['Lógica matemática', 'Pensamiento abstracto', 'Resolución de problemas', 'Análisis numérico'],
      learningPath: [
        { level: 'Básico', topics: ['Aritmética', 'Álgebra básica', 'Geometría plana'] },
        { level: 'Intermedio', topics: ['Cálculo', 'Estadística', 'Geometría analítica'] },
        { level: 'Avanzado', topics: ['Análisis matemático', 'Teoría de números', 'Topología'] }
      ],
      challenges: [
        { title: 'Patrones Numéricos', difficulty: 'Fácil', points: 50 },
        { title: 'Secuencias Lógicas', difficulty: 'Medio', points: 100 },
        { title: 'Problemas de Optimización', difficulty: 'Difícil', points: 200 }
      ],
      resources: [
        { type: 'Libro', title: 'Matemáticas para la Vida', author: 'Dr. María González' },
        { type: 'Video', title: 'Fundamentos de Lógica', duration: '45 min' },
        { type: 'Curso', title: 'Matemáticas Discretas', platform: 'Coursera' }
      ]
    },
    'ciencia': {
      coreSkills: ['Método científico', 'Observación', 'Experimentación', 'Análisis crítico'],
      learningPath: [
        { level: 'Básico', topics: ['Método científico', 'Mediciones', 'Observaciones'] },
        { level: 'Intermedio', topics: ['Hipótesis', 'Experimentos', 'Análisis de datos'] },
        { level: 'Avanzado', topics: ['Teorías científicas', 'Investigación', 'Publicaciones'] }
      ],
      challenges: [
        { title: 'Experimento Verde', difficulty: 'Fácil', points: 50 },
        { title: 'Análisis de Datos', difficulty: 'Medio', points: 100 },
        { title: 'Investigación Avanzada', difficulty: 'Difícil', points: 200 }
      ],
      resources: [
        { type: 'Libro', title: 'El Método Científico', author: 'Dr. Carlos Ruiz' },
        { type: 'Video', title: 'Experimentos Caseros', duration: '30 min' },
        { type: 'Curso', title: 'Ciencia Experimental', platform: 'edX' }
      ]
    },
    'tecnología': {
      coreSkills: ['Pensamiento computacional', 'Resolución de problemas', 'Creatividad', 'Adaptabilidad'],
      learningPath: [
        { level: 'Básico', topics: ['Algoritmos básicos', 'Programación', 'Sistemas'] },
        { level: 'Intermedio', topics: ['Arquitectura de software', 'Bases de datos', 'Redes'] },
        { level: 'Avanzado', topics: ['Inteligencia artificial', 'Ciberseguridad', 'Cloud computing'] }
      ],
      challenges: [
        { title: 'Diseño de Sistemas', difficulty: 'Fácil', points: 50 },
        { title: 'Optimización de Código', difficulty: 'Medio', points: 100 },
        { title: 'Arquitectura Avanzada', difficulty: 'Difícil', points: 200 }
      ],
      resources: [
        { type: 'Libro', title: 'Tecnología del Futuro', author: 'Ing. Ana Martínez' },
        { type: 'Video', title: 'Fundamentos de IA', duration: '60 min' },
        { type: 'Curso', title: 'Machine Learning', platform: 'Udacity' }
      ]
    },
    'ingeniería': {
      coreSkills: ['Pensamiento sistémico', 'Creatividad aplicada', 'Resolución práctica', 'Trabajo en equipo'],
      learningPath: [
        { level: 'Básico', topics: ['Dibujo técnico', 'Materiales', 'Mecánica básica'] },
        { level: 'Intermedio', topics: ['Diseño de estructuras', 'Análisis de fuerzas', 'Proyectos'] },
        { level: 'Avanzado', topics: ['Ingeniería avanzada', 'Innovación', 'Sostenibilidad'] }
      ],
      challenges: [
        { title: 'Diseño de Puentes', difficulty: 'Fácil', points: 50 },
        { title: 'Sistemas Mecánicos', difficulty: 'Medio', points: 100 },
        { title: 'Proyectos Sostenibles', difficulty: 'Difícil', points: 200 }
      ],
      resources: [
        { type: 'Libro', title: 'Ingeniería Práctica', author: 'Ing. Roberto Silva' },
        { type: 'Video', title: 'Construcción Sostenible', duration: '50 min' },
        { type: 'Curso', title: 'Ingeniería Verde', platform: 'MIT OpenCourseWare' }
      ]
    }
  };

  console.log('🌍 Debug PlanetExploration:', { planetKey, normalizedKey, availableKeys: Object.keys(planetFeatures) });

  // Obtener características del planeta actual
  const features = planetFeatures[normalizedKey] || {
    coreSkills: ['Habilidad fundamental', 'Pensamiento crítico', 'Resolución de problemas', 'Creatividad'],
    learningPath: [
      { level: 'Básico', topics: ['Conceptos fundamentales', 'Práctica inicial', 'Ejercicios básicos'] },
      { level: 'Intermedio', topics: ['Aplicación práctica', 'Proyectos reales', 'Análisis avanzado'] },
      { level: 'Avanzado', topics: ['Especialización', 'Investigación', 'Innovación'] }
    ],
    challenges: [
      { title: 'Desafío Inicial', difficulty: 'Fácil', points: 50 },
      { title: 'Desafío Intermedio', difficulty: 'Medio', points: 100 },
      { title: 'Desafío Avanzado', difficulty: 'Difícil', points: 200 }
    ],
    resources: [
      { type: 'Libro', title: 'Guía Fundamental', author: 'Experto del Área' },
      { type: 'Video', title: 'Tutorial Práctico', duration: '30 min' },
      { type: 'Curso', title: 'Especialización Avanzada', platform: 'Plataforma Educativa' }
    ]
  };

  // Calcular progreso del usuario en este planeta
  const userProgress = {
    gamesCompleted: userStats?.games || 0,
    totalPoints: userStats?.points || 0,
    bestScore: userStats?.bestScore || 0,
    averageTime: userStats?.averageTime || 0,
    affinityPercentage: userAffinity?.normalizedScore || 0
  };

  // Verificar si el usuario ha completado juegos de este planeta
  const hasPlayedGames = userProgress.gamesCompleted > 0;

  // Simular logros desbloqueados
  const unlockedAchievements = hasPlayedGames ? [
    { id: 'first_visit', name: 'Primera Visita', icon: '🌟', description: 'Exploraste este planeta por primera vez' },
    { id: 'game_completion', name: 'Jugador Activo', icon: '🎮', description: `Completaste ${userProgress.gamesCompleted} juego(s)` },
    ...(userProgress.affinityPercentage >= 80 ? [{ id: 'high_affinity', name: 'Alta Afinidad', icon: '⭐', description: 'Demostraste gran afinidad por esta área' }] : [])
  ] : [];

  if (!planet) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Planeta no encontrado</h1>
          <Link to="/games" className="btn-primary">
            Volver a los Juegos
          </Link>
        </div>
      </div>
    );
  }

  // Obtener colores específicos del planeta
  const getPlanetColors = (planetKey) => {
    const colors = {
      'matemáticas': {
        primary: '#FBBF24', // Amarillo dorado
        secondary: '#F59E0B',
        accent: '#EAB308',
        glow: 'rgba(251, 191, 36, 0.3)',
        gradient: 'from-yellow-500/20 via-amber-500/20 to-orange-500/20'
      },
      'ingeniería': {
        primary: '#EA580C', // Naranja ingenieril
        secondary: '#DC2626',
        accent: '#F97316',
        glow: 'rgba(234, 88, 12, 0.3)',
        gradient: 'from-orange-600/20 via-red-600/20 to-amber-600/20'
      },
      'tecnología': {
        primary: '#06B6D4', // Cian tecnológico
        secondary: '#0891B2',
        accent: '#0E7490',
        glow: 'rgba(6, 182, 212, 0.3)',
        gradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20'
      },
      'ciencia': {
        primary: '#10B981', // Verde científico
        secondary: '#059669',
        accent: '#047857',
        glow: 'rgba(16, 185, 129, 0.3)',
        gradient: 'from-emerald-500/20 via-green-500/20 to-teal-500/20'
      }
    };
    return colors[normalizedKey] || colors['matemáticas'];
  };

  const planetColors = getPlanetColors(normalizedKey);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Overlay de estrellas espaciales */}
      <div className="stars-overlay"></div>
      
      {/* Partículas flotantes específicas del planeta */}
      <div className="space-particles">
        <div className="particle" style={{ background: planetColors.primary }}></div>
        <div className="particle" style={{ background: planetColors.secondary }}></div>
        <div className="particle" style={{ background: planetColors.accent }}></div>
        <div className="particle" style={{ background: planetColors.primary }}></div>
        <div className="particle" style={{ background: planetColors.secondary }}></div>
      </div>

      {/* Header del Planeta */}
      <div className="relative overflow-hidden">
        {/* Fondo del planeta con colores específicos */}
        <div className={`absolute inset-0 bg-gradient-to-br ${planetColors.gradient}`}></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Navegación */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/games')}
              className="flex items-center space-x-3 px-4 py-2 bg-glass border border-white/20 rounded-xl text-white/80 hover:text-white hover:border-white/40 transition-all duration-300 backdrop-blur-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver a la Galaxia</span>
            </button>
            
            <div className="flex items-center space-x-6">
              <div className="text-right bg-glass border border-white/20 rounded-xl px-6 py-3 backdrop-blur-lg">
                <div className="text-sm text-white/70">Tu Afinidad</div>
                <div className="text-2xl font-bold" style={{ color: planetColors.primary }}>
                  {userProgress.affinityPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Información Principal del Planeta */}
          <div className="text-center mb-12">
            {/* Planeta con efecto de brillo orbital */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              <div 
                className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
                style={{ 
                  background: `radial-gradient(circle, ${planetColors.primary}, ${planetColors.secondary}, transparent)`,
                  width: '200px',
                  height: '200px',
                  margin: 'auto'
                }}
              ></div>
              <div 
                className="relative text-8xl mb-6 drop-shadow-2xl"
                style={{ filter: `drop-shadow(0 0 20px ${planetColors.glow})` }}
              >
                {planet.icon}
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-4 text-gradient"
            >
              {planet.planet}
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl text-yellow-200 max-w-3xl mx-auto mb-8 bg-glass border border-white/20 rounded-2xl p-6 backdrop-blur-lg"
            >
              🌌 {planet.description}
            </motion.p>

            {/* Estadísticas del Planeta */}
            {planetStats && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
              >
                <div className="bg-glass border border-white/20 rounded-xl p-4 text-center backdrop-blur-lg hover:border-white/40 transition-all duration-300">
                  <div className="text-3xl font-bold mb-2" style={{ color: planetColors.primary }}>{planetStats.currentLevel}</div>
                  <div className="text-white/70 text-sm">Nivel Galáctico</div>
                </div>
                <div className="bg-glass border border-white/20 rounded-xl p-4 text-center backdrop-blur-lg hover:border-white/40 transition-all duration-300">
                  <div className="text-3xl font-bold mb-2" style={{ color: planetColors.secondary }}>{planetStats.currentPoints.toLocaleString()}</div>
                  <div className="text-white/70 text-sm">Energía Cósmica</div>
                </div>
                <div className="bg-glass border border-white/20 rounded-xl p-4 text-center backdrop-blur-lg hover:border-white/40 transition-all duration-300">
                  <div className="text-3xl font-bold mb-2" style={{ color: planetColors.accent }}>{planetStats.contributors}</div>
                  <div className="text-white/70 text-sm">Exploradores</div>
                </div>
                <div className="bg-glass border border-white/20 rounded-xl p-4 text-center backdrop-blur-lg hover:border-white/40 transition-all duration-300">
                  <div className="text-3xl font-bold mb-2" style={{ color: planetColors.primary }}>{planetStats.achievements?.length || 0}</div>
                  <div className="text-white/70 text-sm">Constelaciones</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 pb-12 relative z-10">
        {/* Pestañas de Navegación Espaciales */}
        <div className="flex flex-wrap justify-center mb-8">
          {[
            { id: 'overview', label: 'Explorar', icon: Globe, emoji: '🌍' },
            { id: 'skills', label: 'Habilidades', icon: Target, emoji: '🎯' },
            { id: 'learning', label: 'Academia', icon: BookOpen, emoji: '📚' },
            { id: 'challenges', label: 'Misiones', icon: Trophy, emoji: '🚀' },
            { id: 'resources', label: 'Recursos', icon: Lightbulb, emoji: '💎' },
            { id: 'achievements', label: 'Logros', icon: Star, emoji: '⭐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-3 mx-2 mb-2 rounded-xl transition-all duration-300 backdrop-blur-lg ${
                activeTab === tab.id
                  ? 'bg-glass border-2 text-white shadow-2xl transform scale-105'
                  : 'bg-glass border border-white/20 text-white/70 hover:border-white/40 hover:text-white hover:scale-102'
              }`}
              style={activeTab === tab.id ? { 
                borderColor: planetColors.primary,
                boxShadow: `0 0 20px ${planetColors.glow}`
              } : {}}
            >
              <span className="text-lg">{tab.emoji}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de las Pestañas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-glass border rounded-3xl p-8 backdrop-blur-xl"
            style={{ 
              borderColor: `${planetColors.primary}40`,
              boxShadow: `0 0 40px ${planetColors.glow}`
            }}
          >
            {/* Vista General */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 text-gradient">🌌 Bienvenido a {planet.planet}</h2>
                  <p className="text-xl text-yellow-100 leading-relaxed max-w-4xl mx-auto">
                    En este sistema estelar, los exploradores desarrollan habilidades en <strong style={{ color: planetColors.primary }}>{normalizedKey}</strong>. 
                    Cada misión completada te acerca más a dominar las fuerzas cósmicas de este planeta.
                  </p>
                </div>

                {/* Progreso del Usuario */}
                {hasPlayedGames && (
                  <div 
                    className="rounded-2xl p-8 border-2 backdrop-blur-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${planetColors.primary}20, ${planetColors.secondary}20)`,
                      borderColor: planetColors.primary
                    }}
                  >
                    <h3 className="text-3xl font-bold mb-6 text-center text-gradient">
                      🚀 Tu Expedición en {planet.planet}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-glass border border-white/20 rounded-xl p-6 text-center backdrop-blur-lg">
                        <div className="text-4xl font-bold mb-2" style={{ color: planetColors.primary }}>
                          {userProgress.gamesCompleted}
                        </div>
                        <div className="text-white/80 font-medium">Misiones Completadas</div>
                      </div>
                      <div className="bg-glass border border-white/20 rounded-xl p-6 text-center backdrop-blur-lg">
                        <div className="text-4xl font-bold mb-2" style={{ color: planetColors.secondary }}>
                          {userProgress.totalPoints}
                        </div>
                        <div className="text-white/80 font-medium">Energía Acumulada</div>
                      </div>
                      <div className="bg-glass border border-white/20 rounded-xl p-6 text-center backdrop-blur-lg">
                        <div className="text-4xl font-bold mb-2" style={{ color: planetColors.accent }}>
                          {userProgress.bestScore}
                        </div>
                        <div className="text-white/80 font-medium">Récord Galáctico</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estado del Planeta */}
                {planetStats && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl p-6">
                    <h3 className="text-2xl font-bold mb-4 text-center">Estado del Planeta</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Progreso al Nivel {planetStats.currentLevel + 1}</span>
                          <span>{planetStats.currentPoints} / {planetStats.requiredPoints} pts</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-400 to-indigo-400 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (planetStats.currentPoints / planetStats.requiredPoints) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Habilidades */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 text-gradient">🎯 Habilidades Core del {normalizedKey}</h2>
                  <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
                    Desarrolla estas habilidades fundamentales para convertirte en un maestro de {planet.planet}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {features.coreSkills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-glass border rounded-xl p-6 backdrop-blur-lg hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                      style={{ borderColor: `${planetColors.primary}40` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${planetColors.primary}20, ${planetColors.secondary}20)`,
                            border: `2px solid ${planetColors.primary}`
                          }}
                        >
                          {index === 0 ? '🧠' : index === 1 ? '💡' : index === 2 ? '⚡' : '🌟'}
                        </div>
                        <div>
                          <span className="text-xl font-bold text-white">{skill}</span>
                          <p className="text-white/70 text-sm mt-1">
                            {index === 0 ? 'Fundamental para el dominio del área' :
                             index === 1 ? 'Habilidad clave para el progreso' :
                             index === 2 ? 'Competencia avanzada requerida' : 'Maestría especializada'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Nivel de Dominio */}
                <div 
                  className="rounded-2xl p-8 border-2 backdrop-blur-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${planetColors.primary}20, ${planetColors.secondary}20)`,
                    borderColor: planetColors.primary
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center text-white">
                    🏆 Tu Nivel de Dominio
                  </h3>
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold mb-2" style={{ color: planetColors.primary }}>
                      {userProgress.affinityPercentage}%
                    </div>
                    <div className="text-white/80 text-lg">
                      {userProgress.affinityPercentage >= 80 ? 'Maestro Galáctico' :
                       userProgress.affinityPercentage >= 60 ? 'Explorador Experto' :
                       userProgress.affinityPercentage >= 40 ? 'Aventurero Intermedio' : 'Novato Espacial'}
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4 mb-4">
                    <div 
                      className="h-4 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${userProgress.affinityPercentage}%`,
                        background: `linear-gradient(90deg, ${planetColors.primary}, ${planetColors.secondary})`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Recomendaciones de Mejora */}
                {hasPlayedGames && recommendations.length > 0 && (
                  <div className="bg-glass border rounded-xl p-6 backdrop-blur-lg" style={{ borderColor: `${planetColors.accent}40` }}>
                    <h3 className="text-2xl font-bold mb-4 text-center text-white flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 mr-2" style={{ color: planetColors.accent }} />
                      Recomendaciones de Mejora
                    </h3>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 rounded-lg bg-white/5"
                        >
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: planetColors.accent }}></div>
                          <span className="text-white/90">{rec}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Academia */}
            {activeTab === 'learning' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 text-gradient">📚 Academia Galáctica de {normalizedKey}</h2>
                  <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
                    Sigue esta ruta progresiva para convertirte en un maestro de las fuerzas cósmicas
                  </p>
                </div>

                <div className="space-y-6">
                  {features.learningPath.map((level, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-glass border rounded-xl p-6 backdrop-blur-lg hover:border-white/40 transition-all duration-300"
                      style={{ borderColor: `${planetColors.primary}40` }}
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                          style={{ 
                            background: index === 0 ? 'linear-gradient(135deg, #10B981, #059669)' :
                                     index === 1 ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)' :
                                     'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                          }}
                        >
                          {index === 0 ? '🌱' : index === 1 ? '🚀' : '👑'}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{level.level}</h3>
                          <p className="text-white/70 text-lg">Fase de desarrollo cósmico</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        {level.topics.map((topic, topicIndex) => (
                          <motion.div 
                            key={topicIndex} 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: topicIndex * 0.1 }}
                            className="bg-white/10 rounded-lg p-4 text-center border border-white/20 hover:border-white/40 transition-all duration-300"
                          >
                            <span className="text-white font-medium">{topic}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Certificaciones Galácticas */}
                <div 
                  className="rounded-2xl p-8 border-2 backdrop-blur-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${planetColors.primary}20, ${planetColors.secondary}20)`,
                    borderColor: planetColors.primary
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center text-white">
                    🎓 Certificaciones Disponibles
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center bg-glass border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                      <div className="text-4xl mb-3">🥉</div>
                      <h4 className="text-lg font-bold text-white mb-2">Novato Espacial</h4>
                      <p className="text-white/70 text-sm">Completa el nivel básico</p>
                    </div>
                    <div className="text-center bg-glass border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                      <div className="text-4xl mb-3">🥈</div>
                      <h4 className="text-lg font-bold text-white mb-2">Explorador Intermedio</h4>
                      <p className="text-white/70 text-sm">Domina el nivel intermedio</p>
                    </div>
                    <div className="text-center bg-glass border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                      <div className="text-4xl mb-3">🥇</div>
                      <h4 className="text-lg font-bold text-white mb-2">Maestro Galáctico</h4>
                      <p className="text-white/70 text-sm">Conquista el nivel avanzado</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Misiones */}
            {activeTab === 'challenges' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 text-gradient">🚀 Misiones Espaciales de {normalizedKey}</h2>
                  <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
                    Completa estas misiones para desbloquear poderes cósmicos y avanzar en tu dominio del planeta
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {features.challenges.map((challenge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-glass border rounded-xl p-6 backdrop-blur-lg hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                      style={{ borderColor: `${planetColors.primary}40` }}
                    >
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-3">
                          {index === 0 ? '🌱' : index === 1 ? '⚡' : '🔥'}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                        <p className="text-white/70 text-sm">
                          {index === 0 ? 'Misión de iniciación cósmica' :
                           index === 1 ? 'Expedición de desarrollo galáctico' : 'Conquista del dominio estelar'}
                        </p>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Dificultad:</span>
                          <span className={`font-medium px-3 py-1 rounded-full text-sm ${
                            challenge.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                            challenge.difficulty === 'Medio' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Recompensa:</span>
                          <span className="font-bold text-lg" style={{ color: planetColors.primary }}>
                            {challenge.points} ⭐
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Estado:</span>
                          <span className="text-green-400 font-medium">🟢 Disponible</span>
                        </div>
                      </div>

                      <button 
                        className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                        style={{ 
                          background: `linear-gradient(135deg, ${planetColors.primary}, ${planetColors.secondary})`,
                          boxShadow: `0 4px 15px ${planetColors.glow}`
                        }}
                      >
                        🚀 Iniciar Misión
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Misiones Especiales */}
                <div 
                  className="rounded-2xl p-8 border-2 backdrop-blur-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${planetColors.primary}20, ${planetColors.secondary}20)`,
                    borderColor: planetColors.primary
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center text-white">
                    🌟 Misiones Especiales del Sistema
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-glass border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">🏆</div>
                        <h4 className="text-lg font-bold text-white">Misión Legendaria</h4>
                      </div>
                      <p className="text-white/70 text-sm mb-3">Completa todas las misiones básicas para desbloquear</p>
                      <div className="text-center">
                        <span className="text-2xl font-bold" style={{ color: planetColors.primary }}>500 ⭐</span>
                      </div>
                    </div>
                    <div className="bg-glass border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">⚡</div>
                        <h4 className="text-lg font-bold text-white">Misión de Velocidad</h4>
                      </div>
                      <p className="text-white/70 text-sm mb-3">Completa una misión en tiempo récord</p>
                      <div className="text-center">
                        <span className="text-2xl font-bold" style={{ color: planetColors.primary }}>300 ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recursos */}
            {activeTab === 'resources' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 text-gradient">💎 Biblioteca Cósmica de {normalizedKey}</h2>
                  <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
                    Explora estos recursos sagrados para dominar los secretos del planeta y desbloquear poderes ocultos
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {features.resources.map((resource, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-glass border rounded-xl p-6 backdrop-blur-lg hover:border-white/40 transition-all duration-300 transform hover:scale-105"
                      style={{ borderColor: `${planetColors.primary}40` }}
                    >
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-3">
                          {resource.type === 'Libro' ? '📚' : 
                           resource.type === 'Video' ? '🎥' : '🎓'}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
                        <p className="text-white/70 font-medium">{resource.type}</p>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Autor/Plataforma:</span>
                          <span className="text-white font-medium">{resource.author || resource.platform}</span>
                        </div>
                        
                        {resource.duration && (
                          <div className="flex justify-between items-center">
                            <span className="text-white/70">Duración:</span>
                            <span className="text-white font-medium">{resource.duration}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Nivel:</span>
                          <span className="font-medium px-3 py-1 rounded-full text-sm" style={{ 
                            background: `${planetColors.primary}20`, 
                            color: planetColors.primary,
                            border: `1px solid ${planetColors.primary}40`
                          }}>
                            {index === 0 ? 'Básico' : index === 1 ? 'Intermedio' : 'Avanzado'}
                          </span>
                        </div>
                      </div>

                      <button 
                        className="w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                        style={{ 
                          background: `linear-gradient(135deg, ${planetColors.secondary}, ${planetColors.accent})`,
                          boxShadow: `0 4px 15px ${planetColors.glow}`
                        }}
                      >
                        🔓 Desbloquear Recurso
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Recursos Premium */}
                <div 
                  className="rounded-2xl p-8 border-2 backdrop-blur-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${planetColors.primary}20, ${planetColors.secondary}20)`,
                    borderColor: planetColors.primary
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center text-white">
                    🌟 Recursos Premium del Sistema
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-glass border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">🎭</div>
                        <h4 className="text-lg font-bold text-white">Simulador Virtual</h4>
                      </div>
                      <p className="text-white/70 text-sm mb-3">Practica en un entorno virtual inmersivo</p>
                      <div className="text-center">
                        <span className="text-lg font-bold" style={{ color: planetColors.primary }}>Requerido: Nivel 3</span>
                      </div>
                    </div>
                    <div className="bg-glass border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="text-2xl">🤝</div>
                        <h4 className="text-lg font-bold text-white">Mentoría Galáctica</h4>
                      </div>
                      <p className="text-white/70 text-sm mb-3">Sesiones 1:1 con maestros del planeta</p>
                      <div className="text-center">
                        <span className="text-lg font-bold" style={{ color: planetColors.primary }}>Requerido: Nivel 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logros */}
            {activeTab === 'achievements' && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-6 text-gradient">⭐ Constelaciones de Logros de {normalizedKey}</h2>
                  <p className="text-xl text-yellow-100 max-w-3xl mx-auto">
                    Cada logro desbloqueado ilumina una nueva estrella en tu constelación personal del planeta
                  </p>
                </div>

                {unlockedAchievements.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unlockedAchievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-glass border-2 rounded-xl p-6 backdrop-blur-lg text-center transform hover:scale-105 transition-all duration-300"
                        style={{ 
                          borderColor: planetColors.primary,
                          boxShadow: `0 0 20px ${planetColors.glow}`
                        }}
                      >
                        <div className="text-5xl mb-4">{achievement.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-3">{achievement.name}</h3>
                        <p className="text-white/80 text-sm mb-4">{achievement.description}</p>
                        <div className="text-center">
                          <span className="text-lg font-bold" style={{ color: planetColors.primary }}>
                            ✅ Desbloqueado
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-8xl mb-6">🌟</div>
                    <h3 className="text-2xl font-bold mb-4 text-white">¡Comienza tu expedición cósmica!</h3>
                    <p className="text-yellow-100 text-lg mb-8 max-w-2xl mx-auto">
                      Completa misiones en {planet.planet} para desbloquear constelaciones de logros y 
                      convertirte en un legendario explorador del sistema
                    </p>
                    <Link 
                      to="/games" 
                      className="inline-flex items-center px-8 py-4 text-lg font-bold text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                      style={{ 
                        background: `linear-gradient(135deg, ${planetColors.primary}, ${planetColors.secondary})`,
                        boxShadow: `0 4px 15px ${planetColors.glow}`
                      }}
                    >
                      🚀 Ir a las Misiones
                    </Link>
                  </div>
                )}

                {/* Logros Futuros */}
                <div 
                  className="rounded-2xl p-8 border-2 backdrop-blur-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${planetColors.primary}20, ${planetColors.secondary}20)`,
                    borderColor: planetColors.primary
                  }}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center text-white">
                    🌟 Constelaciones por Descubrir
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { 
                        name: 'Maestro del Planeta', 
                        requirement: 'Puntuación perfecta en todas las misiones', 
                        icon: '👑',
                        reward: '500 ⭐'
                      },
                      { 
                        name: 'Explorador Experto', 
                        requirement: 'Completar 10 misiones', 
                        icon: '🚀',
                        reward: '300 ⭐'
                      },
                      { 
                        name: 'Velocista Cósmico', 
                        requirement: 'Completar una misión en tiempo récord', 
                        icon: '⚡',
                        reward: '200 ⭐'
                      },
                      { 
                        name: 'Coleccionista de Estrellas', 
                        requirement: 'Desbloquear 5 logros diferentes', 
                        icon: '⭐',
                        reward: '400 ⭐'
                      },
                      { 
                        name: 'Mentor Galáctico', 
                        requirement: 'Ayudar a 3 novatos a completar misiones', 
                        icon: '🤝',
                        reward: '600 ⭐'
                      },
                      { 
                        name: 'Leyenda del Sistema', 
                        requirement: 'Dominar completamente el planeta', 
                        icon: '🏆',
                        reward: '1000 ⭐'
                      }
                    ].map((achievement, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-glass border border-white/20 rounded-lg p-4 text-center backdrop-blur-lg opacity-60 hover:opacity-80 transition-all duration-300"
                      >
                        <div className="text-3xl mb-3">{achievement.icon}</div>
                        <h4 className="font-bold text-white mb-2">{achievement.name}</h4>
                        <p className="text-white/70 text-sm mb-3">{achievement.requirement}</p>
                        <div className="text-center">
                          <span className="text-sm font-bold" style={{ color: planetColors.primary }}>
                            {achievement.reward}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlanetExploration;

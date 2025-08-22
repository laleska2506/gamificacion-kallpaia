import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from './SessionContext';
import { useAffinity } from './AffinityContext';
import axios from 'axios';

const CooperativeRankingContext = createContext();

export const useCooperativeRanking = () => {
  const context = useContext(CooperativeRankingContext);
  if (!context) {
    throw new Error('useCooperativeRanking debe ser usado dentro de un CooperativeRankingProvider');
  }
  return context;
};

export const CooperativeRankingProvider = ({ children }) => {
  const { gameProgress, completedGames, totalScore } = useSession();
  const { stemAffinities, dominantArea } = useAffinity();
  
  const [galaxyStats, setGalaxyStats] = useState(null);
  const [planetContributions, setPlanetContributions] = useState({});
  const [globalRanking, setGlobalRanking] = useState([]);
  const [userContributions, setUserContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuración de planetas STEM
  const stemPlanets = {
    'matemáticas': {
      id: 'planeta_alfa',
      name: 'Planeta Alfa',
      icon: '🔢',
      color: 'stem-math',
      description: 'Mundo de patrones numéricos y lógica pura',
      currentLevel: 1,
      maxLevel: 10,
      requiredPoints: 1000,
      currentPoints: 0,
      contributors: 0,
      achievements: []
    },
    'ciencia': {
      id: 'planeta_delta',
      name: 'Planeta Delta',
      icon: '🔬',
      color: 'stem-science',
      description: 'Reino de la investigación y el descubrimiento',
      currentLevel: 1,
      maxLevel: 10,
      requiredPoints: 1000,
      currentPoints: 0,
      contributors: 0,
      achievements: []
    },
    'tecnología': {
      id: 'planeta_sigma',
      name: 'Planeta Sigma',
      icon: '💻',
      color: 'stem-tech',
      description: 'Esfera de la innovación digital y sistemas',
      currentLevel: 1,
      maxLevel: 10,
      requiredPoints: 1000,
      currentPoints: 0,
      contributors: 0,
      achievements: []
    },
    'ingeniería': {
      id: 'planeta_kappa',
      name: 'Planeta Kappa',
      icon: '⚙️',
      color: 'stem-engineering',
      description: 'Dominio de la creación y construcción',
      currentLevel: 1,
      maxLevel: 10,
      requiredPoints: 1000,
      currentPoints: 0,
      contributors: 0,
      achievements: []
    }
  };

  // Logros disponibles
  const availableAchievements = [
    {
      id: 'first_contribution',
      name: 'Primera Contribución',
      description: 'Realizaste tu primera contribución a la galaxia STEM',
      icon: '🌟',
      points: 50,
      rarity: 'common'
    },
    {
      id: 'planet_champion',
      name: 'Campeón del Planeta',
      description: 'Contribuiste más de 500 puntos a un planeta específico',
      icon: '🏆',
      points: 200,
      rarity: 'rare'
    },
    {
      id: 'galaxy_explorer',
      name: 'Explorador de la Galaxia',
      description: 'Contribuiste a todos los planetas STEM',
      icon: '🚀',
      points: 300,
      rarity: 'epic'
    },
    {
      id: 'skill_master',
      name: 'Maestro de Habilidades',
      description: 'Obtuviste una puntuación perfecta en un área STEM',
      icon: '👑',
      points: 500,
      rarity: 'legendary'
    },
    {
      id: 'perfectionist',
      name: 'Perfeccionista',
      description: 'Completaste todos los juegos con puntuación perfecta',
      icon: '💎',
      points: 1000,
      rarity: 'mythic'
    }
  ];

  // Calcular contribuciones del usuario a cada planeta
  const calculateUserContributions = useCallback(() => {
    if (!gameProgress || !stemAffinities) return {};

    const contributions = {};
    
    Object.entries(gameProgress).forEach(([gameId, gameData]) => {
      // Mapear juego a planeta STEM
      let planetKey = null;
      if (gameId === 'number_puzzle') planetKey = 'matemáticas';
      else if (gameId === 'green_invention' || gameId === 'broken_bridge') planetKey = 'ingeniería';
      else if (gameId === 'space_explorer') planetKey = 'tecnología';

      if (planetKey && !contributions[planetKey]) {
        contributions[planetKey] = {
          points: 0,
          games: 0,
          bestScore: 0,
          totalTime: 0,
          achievements: []
        };
      }

      if (planetKey) {
        contributions[planetKey].points += gameData.score || 0;
        contributions[planetKey].games += 1;
        contributions[planetKey].bestScore = Math.max(contributions[planetKey].bestScore, gameData.score || 0);
        contributions[planetKey].totalTime += gameData.timeSpent || 0;
      }
    });

    return contributions;
  }, [gameProgress, stemAffinities]);

  // Calcular logros del usuario
  const calculateUserAchievements = useCallback(() => {
    if (!gameProgress || !stemAffinities) return [];

    const achievements = [];
    const userContributions = calculateUserContributions();

    // Primer logro: Primera contribución
    if (Object.keys(userContributions).length > 0) {
      achievements.push(availableAchievements.find(a => a.id === 'first_contribution'));
    }

    // Logro: Campeón del planeta
    Object.entries(userContributions).forEach(([planet, data]) => {
      if (data.points >= 500) {
        achievements.push(availableAchievements.find(a => a.id === 'planet_champion'));
      }
    });

    // Logro: Explorador de la galaxia
    if (Object.keys(userContributions).length >= 4) {
      achievements.push(availableAchievements.find(a => a.id === 'galaxy_explorer'));
    }

    // Logro: Maestro de habilidades
    Object.entries(stemAffinities).forEach(([area, data]) => {
      if (data && data.normalizedScore >= 95) {
        achievements.push(availableAchievements.find(a => a.id === 'skill_master'));
      }
    });

    // Logro: Perfeccionista
    Object.values(gameProgress).forEach(gameData => {
      if (gameData.score === 100) {
        achievements.push(availableAchievements.find(a => a.id === 'perfectionist'));
      }
    });

    // Remover duplicados
    return [...new Set(achievements.filter(Boolean))];
  }, [gameProgress, stemAffinities, calculateUserContributions]);

  // Contribuir puntos a un planeta
  const contributeToPlanet = async (planetKey, points) => {
    try {
      setLoading(true);
      setError(null);

      // Simular contribución a la base de datos
      const contribution = {
        planet_id: stemPlanets[planetKey].id,
        points: points,
        timestamp: new Date().toISOString(),
        user_session: 'anonymous' // Mantener anonimato
      };

      // En un entorno real, esto se enviaría al backend
      // const response = await axios.post('/api/cooperative/contribute', contribution);

      // Actualizar estado local
      setPlanetContributions(prev => ({
        ...prev,
        [planetKey]: {
          ...prev[planetKey],
          points: (prev[planetKey]?.points || 0) + points,
          contributions: [...(prev[planetKey]?.contributions || []), contribution]
        }
      }));

      // Actualizar estadísticas globales
      updateGalaxyStats(planetKey, points);

      return true;
    } catch (err) {
      console.error('Error contribuyendo al planeta:', err);
      setError('No se pudo contribuir al planeta. Intenta de nuevo.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estadísticas de la galaxia
  const updateGalaxyStats = useCallback((planetKey, points) => {
    setGalaxyStats(prev => {
      if (!prev) return prev;

      const updatedPlanets = { ...prev.planets };
      const planet = updatedPlanets[planetKey];
      
      if (planet) {
        planet.currentPoints += points;
        
        // Calcular nuevo nivel
        const newLevel = Math.floor(planet.currentPoints / planet.requiredPoints) + 1;
        if (newLevel > planet.currentLevel && newLevel <= planet.maxLevel) {
          planet.currentLevel = newLevel;
          planet.requiredPoints = newLevel * 1000; // Incrementar puntos requeridos
        }
      }

      return {
        ...prev,
        planets: updatedPlanets,
        totalPoints: prev.totalPoints + points,
        totalContributions: prev.totalContributions + 1
      };
    });
  }, []);

  // Obtener estadísticas de la galaxia
  const fetchGalaxyStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // En un entorno real, esto se obtendría del backend
      // const response = await axios.get('/api/cooperative/galaxy-stats');

      // Simular datos de la galaxia
      const mockStats = {
        totalStudents: 1250,
        totalGamesPlayed: 5670,
        galaxyLevel: 3,
        totalPoints: 125000,
        totalContributions: 8900,
        planets: {
          'matemáticas': {
            ...stemPlanets['matemáticas'],
            currentPoints: 32000,
            currentLevel: 3,
            contributors: 450,
            achievements: ['Nivel 3 alcanzado', '500+ contribuidores']
          },
          'ciencia': {
            ...stemPlanets['ciencia'],
            currentPoints: 28000,
            currentLevel: 3,
            contributors: 380,
            achievements: ['Nivel 3 alcanzado', 'Investigación avanzada']
          },
          'tecnología': {
            ...stemPlanets['tecnología'],
            currentPoints: 35000,
            currentLevel: 4,
            contributors: 520,
            achievements: ['Nivel 4 alcanzado', 'Innovación tecnológica']
          },
          'ingeniería': {
            ...stemPlanets['ingeniería'],
            currentPoints: 30000,
            currentLevel: 3,
            contributors: 420,
            achievements: ['Nivel 3 alcanzado', 'Construcción masiva']
          }
        }
      };

      setGalaxyStats(mockStats);
      return mockStats;
    } catch (err) {
      console.error('Error obteniendo estadísticas de la galaxia:', err);
      setError('No se pudieron obtener las estadísticas de la galaxia.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener ranking global
  const fetchGlobalRanking = async () => {
    try {
      // En un entorno real, esto se obtendría del backend
      // const response = await axios.get('/api/cooperative/ranking');

      // Simular ranking global
      const mockRanking = [
        { rank: 1, points: 2500, games: 12, achievements: 8, planet: 'tecnología' },
        { rank: 2, points: 2300, games: 11, achievements: 7, planet: 'ingeniería' },
        { rank: 3, points: 2100, games: 10, achievements: 6, planet: 'matemáticas' },
        { rank: 4, points: 1900, games: 9, achievements: 5, planet: 'ciencia' },
        { rank: 5, points: 1700, games: 8, achievements: 4, planet: 'tecnología' }
      ];

      setGlobalRanking(mockRanking);
      return mockRanking;
    } catch (err) {
      console.error('Error obteniendo ranking global:', err);
      return [];
    }
  };

  // Inicializar datos cuando cambien las contribuciones del usuario
  useEffect(() => {
    if (completedGames.length > 0) {
      const contributions = calculateUserContributions();
      const achievements = calculateUserAchievements();
      
      setUserContributions(contributions);
      
      // Contribuir automáticamente los puntos del usuario a los planetas correspondientes
      Object.entries(contributions).forEach(([planet, data]) => {
        if (data.points > 0) {
          contributeToPlanet(planet, data.points);
        }
      });
    }
  }, [completedGames, gameProgress, calculateUserContributions, calculateUserAchievements]);

  // Cargar estadísticas de la galaxia al inicializar
  useEffect(() => {
    fetchGalaxyStats();
    fetchGlobalRanking();
  }, []);

  const value = {
    galaxyStats,
    planetContributions,
    globalRanking,
    userContributions,
    loading,
    error,
    stemPlanets,
    availableAchievements,
    contributeToPlanet,
    fetchGalaxyStats,
    fetchGlobalRanking
  };

  return (
    <CooperativeRankingContext.Provider value={value}>
      {children}
    </CooperativeRankingContext.Provider>
  );
};

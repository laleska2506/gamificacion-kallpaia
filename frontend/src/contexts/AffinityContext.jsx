import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from './SessionContext';
import axios from 'axios';

const AffinityContext = createContext();

export const useAffinity = () => {
  const context = useContext(AffinityContext);
  if (!context) {
    throw new Error('useAffinity debe ser usado dentro de un AffinityProvider');
  }
  return context;
};

export const AffinityProvider = ({ children }) => {
  const { sessionId, gameProgress, completedGames } = useSession();
  const [stemAffinities, setStemAffinities] = useState(null);
  const [dominantArea, setDominantArea] = useState(null);
  const [suggestedPlanet, setSuggestedPlanet] = useState(null);
  const [confidenceLevel, setConfidenceLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mapeo de áreas STEM a planetas (para uso local)
  const stemToPlanetMapping = {
    'matemáticas': {
      planet: 'Planeta Alfa',
      description: 'Mundo de patrones numéricos y lógica pura',
      color: 'stem-math',
      icon: '🔢',
      careers: ['Matemática', 'Estadística', 'Actuaría', 'Investigación Operativa']
    },
    'ciencia': {
      planet: 'Planeta Delta',
      description: 'Reino de la investigación y el descubrimiento',
      color: 'stem-science',
      icon: '🔬',
      careers: ['Física', 'Química', 'Biología', 'Astronomía', 'Medicina']
    },
    'tecnología': {
      planet: 'Planeta Sigma',
      description: 'Esfera de la innovación digital y sistemas',
      color: 'stem-tech',
      icon: '💻',
      careers: ['Ingeniería en Sistemas', 'Ciencia de Datos', 'Inteligencia Artificial', 'Ciberseguridad']
    },
    'ingeniería': {
      planet: 'Planeta Kappa',
      description: 'Dominio de la creación y construcción',
      color: 'stem-engineering',
      icon: '⚙️',
      careers: ['Ingeniería Civil', 'Ingeniería Mecánica', 'Ingeniería Eléctrica', 'Ingeniería Industrial']
    }
  };

  // Obtener afinidades STEM desde el backend
  const fetchStemAffinities = useCallback(async () => {
    if (!sessionId) return;

    try {
      console.log('🔍 Fetching STEM affinities for session:', sessionId);
      setLoading(true);
      setError(null);

      const response = await axios.get(`/api/games/affinity/${sessionId}`);
      console.log('📊 Response from affinity API:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        console.log('✅ Setting STEM data:', {
          affinities: !!data.affinities,
          dominantArea: data.dominantArea,
          confidenceLevel: data.confidenceLevel,
          suggestedPlanet: data.suggestedPlanet
        });
        
        setStemAffinities(data.affinities);
        setDominantArea(data.dominantArea);
        setConfidenceLevel(data.confidenceLevel);
        setSuggestedPlanet(data.suggestedPlanet);
        return data;
      }
    } catch (err) {
      console.error('Error obteniendo afinidades STEM:', err);
      setError('No se pudieron obtener las afinidades STEM');
      return null;
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Fetch affinities when session or completed games change
  useEffect(() => {
    if (sessionId && completedGames.length > 0) {
      const timer = setTimeout(() => {
        fetchStemAffinities();
      }, 1000); // Small delay to allow DB save

      return () => clearTimeout(timer);
    }
  }, [sessionId, completedGames, fetchStemAffinities]);

  // Cuando se completen todos los juegos, forzar el cálculo de afinidades
  useEffect(() => {
    if (completedGames.length === 4 && !stemAffinities) {
      fetchStemAffinities();
    }
  }, [completedGames.length, stemAffinities, fetchStemAffinities]);

  // Obtener estadísticas detalladas de un área específica
  const getAreaStats = useCallback((area) => {
    if (!stemAffinities || !stemAffinities[area]) return null;
    
    const data = stemAffinities[area];
    const totalPossibleScore = 100 * data.games;
    const scorePercentage = totalPossibleScore > 0 ? (data.score / totalPossibleScore) * 100 : 0;
    
    return {
      ...data,
      scorePercentage: Math.round(scorePercentage),
      averageTime: data.games > 0 ? Math.round(data.totalTime / data.games) : 0,
      averageHints: data.games > 0 ? Math.round((data.hintsUsed / data.games) * 10) / 10 : 0
    };
  }, [stemAffinities]);

  // Obtener recomendaciones de mejora
  const getImprovementRecommendations = useCallback((area) => {
    if (!stemAffinities || !stemAffinities[area]) return [];
    
    const data = stemAffinities[area];
    const recommendations = [];

    if (data.timeEfficiency < 20) {
      recommendations.push('Practica la resolución rápida de problemas para mejorar tu eficiencia');
    }
    
    if (data.consistency < 50) {
      recommendations.push('Juega más veces para mejorar tu consistencia en esta área');
    }

    if (recommendations.length === 0) {
      recommendations.push('¡Excelente rendimiento! Sigue practicando para mantener tus habilidades');
    }

    return recommendations;
  }, [stemAffinities]);

  // Recargar afinidades manualmente
  const refreshAffinities = useCallback(() => {
    if (sessionId) {
      fetchStemAffinities();
    }
  }, [sessionId, fetchStemAffinities]);

  const value = {
    stemAffinities,
    dominantArea,
    suggestedPlanet,
    confidenceLevel,
    loading,
    error,
    stemToPlanetMapping,
    getAreaStats,
    getImprovementRecommendations,
    refreshAffinities,
    fetchStemAffinities
  };

  return (
    <AffinityContext.Provider value={value}>
      {children}
    </AffinityContext.Provider>
  );
};

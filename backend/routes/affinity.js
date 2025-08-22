const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Calcular afinidades STEM para una sesión
router.post('/calculate/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Validar formato UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'UUID inválido',
        message: 'El session_id proporcionado no tiene un formato válido'
      });
    }

    // Verificar que la sesión existe
    const sessionCheck = await pool.query(
      'SELECT * FROM sessions WHERE session_id = $1',
      [sessionId]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sesión no encontrada',
        message: 'La sesión especificada no existe'
      });
    }

    // Obtener todos los juegos completados de la sesión
    const gameResults = await pool.query(
      `SELECT 
        g.stem_category,
        COUNT(*) as games_played,
        AVG(ge.score) as avg_score,
        AVG(ge.time_spent) as avg_time,
        SUM(ge.score) as total_score
      FROM game_events ge
      JOIN games g ON ge.game_id = g.game_id
      WHERE ge.session_id = $1 AND ge.event_type = 'complete'
      GROUP BY g.stem_category`,
      [sessionId]
    );

    if (gameResults.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No hay datos suficientes',
        message: 'Se necesitan juegos completados para calcular afinidades STEM'
      });
    }

    // Calcular scores normalizados por categoría STEM
    const stemScores = {
      mathematics: 0,
      science: 0,
      technology: 0,
      engineering: 0
    };

    let totalGames = 0;
    let maxPossibleScore = 0;

    gameResults.rows.forEach(row => {
      const category = row.stem_category.toLowerCase();
      const gamesPlayed = parseInt(row.games_played);
      const avgScore = parseFloat(row.avg_score);
      const avgTime = parseFloat(row.avg_time);
      
      totalGames += gamesPlayed;
      maxPossibleScore += gamesPlayed * 100; // Score máximo por juego es 100

      // Calcular score ponderado (score + bonus por velocidad)
      let weightedScore = avgScore;
      if (avgTime < 90) { // Bonus por completar rápido (< 1.5 min)
        weightedScore += 10;
      } else if (avgTime > 180) { // Penalización por ser lento (> 3 min)
        weightedScore -= 5;
      }

      // Normalizar a escala 0-1
      stemScores[category] = Math.min(1, Math.max(0, weightedScore / 100));
    });

    // Calcular área STEM dominante
    let dominantArea = 'mathematics';
    let maxScore = stemScores.mathematics;

    Object.entries(stemScores).forEach(([area, score]) => {
      if (score > maxScore) {
        maxScore = score;
        dominantArea = area;
      }
    });

    // Calcular nivel de confianza basado en cantidad de juegos jugados
    const confidenceLevel = Math.min(1, totalGames / 8); // Máximo confianza con 8+ juegos

    // Crear o actualizar registro de afinidades
    const affinityId = uuidv4();
    const result = await pool.query(
      `INSERT INTO stem_affinities 
       (affinity_id, session_id, mathematics_score, science_score, technology_score, 
        engineering_score, dominant_stem_area, confidence_level, calculated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (session_id) 
       DO UPDATE SET 
         mathematics_score = EXCLUDED.mathematics_score,
         science_score = EXCLUDED.science_score,
         technology_score = EXCLUDED.technology_score,
         engineering_score = EXCLUDED.engineering_score,
         dominant_stem_area = EXCLUDED.dominant_stem_area,
         confidence_level = EXCLUDED.confidence_level,
         calculated_at = NOW()
       RETURNING *`,
      [affinityId, sessionId, stemScores.mathematics, stemScores.science, 
       stemScores.technology, stemScores.engineering, dominantArea, confidenceLevel]
    );

    res.json({
      success: true,
      message: 'Afinidades STEM calculadas exitosamente',
      data: {
        affinity_id: result.rows[0].affinity_id,
        session_id: sessionId,
        stem_scores: stemScores,
        dominant_stem_area: dominantArea,
        confidence_level: confidenceLevel,
        total_games_played: totalGames,
        calculated_at: result.rows[0].calculated_at
      }
    });

  } catch (error) {
    console.error('Error calculando afinidades STEM:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron calcular las afinidades STEM'
    });
  }
});

// Obtener afinidades STEM de una sesión
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Validar formato UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'UUID inválido',
        message: 'El session_id proporcionado no tiene un formato válido'
      });
    }

    const result = await pool.query(
      'SELECT * FROM stem_affinities WHERE session_id = $1 ORDER BY calculated_at DESC LIMIT 1',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Afinidades no encontradas',
        message: 'No se han calculado afinidades STEM para esta sesión'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo afinidades STEM:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las afinidades STEM'
    });
  }
});

// Obtener planeta STEM sugerido basado en afinidades
router.get('/:sessionId/suggested-planet', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Validar formato UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'UUID inválido',
        message: 'El session_id proporcionado no tiene un formato válido'
      });
    }

    // Obtener afinidades STEM de la sesión
    const affinityResult = await pool.query(
      'SELECT * FROM stem_affinities WHERE session_id = $1 ORDER BY calculated_at DESC LIMIT 1',
      [sessionId]
    );

    if (affinityResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Afinidades no encontradas',
        message: 'Primero debes calcular las afinidades STEM'
      });
    }

    const affinity = affinityResult.rows[0];
    const dominantArea = affinity.dominant_stem_area;

    // Mapear área STEM dominante a planeta sugerido
    const planetMapping = {
      'mathematics': 'Planeta Alfa',
      'science': 'Planeta Delta',
      'technology': 'Planeta Sigma',
      'engineering': 'Planeta Kappa'
    };

    const suggestedPlanetName = planetMapping[dominantArea] || 'Planeta Alfa';

    // Obtener información del planeta sugerido
    const planetResult = await pool.query(
      'SELECT * FROM stem_planets WHERE planet_name = $1',
      [suggestedPlanetName]
    );

    if (planetResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Planeta no encontrado',
        message: 'El planeta sugerido no existe en la base de datos'
      });
    }

    const planet = planetResult.rows[0];

    // Calcular nivel de desbloqueo (0-100%)
    const unlockPercentage = Math.round(affinity.confidence_level * 100);

    res.json({
      success: true,
      message: 'Planeta STEM sugerido encontrado',
      data: {
        suggested_planet: planet,
        reasoning: {
          dominant_stem_area: dominantArea,
          confidence_level: affinity.confidence_level,
          unlock_percentage: unlockPercentage,
          stem_scores: {
            mathematics: affinity.mathematics_score,
            science: affinity.science_score,
            technology: affinity.technology_score,
            engineering: affinity.engineering_score
          }
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo planeta sugerido:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el planeta STEM sugerido'
    });
  }
});

// Obtener todos los planetas STEM disponibles
router.get('/planets/available', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM stem_planets ORDER BY difficulty_level, planet_name'
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo planetas disponibles:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los planetas STEM disponibles'
    });
  }
});

module.exports = router;

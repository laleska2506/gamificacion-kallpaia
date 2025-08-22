const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Obtener lista de mini-juegos disponibles
router.get('/available', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM games ORDER BY difficulty_level, game_name'
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo juegos disponibles:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los juegos disponibles'
    });
  }
});

// Obtener información de un juego específico
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    if (!Number.isInteger(parseInt(gameId))) {
      return res.status(400).json({
        success: false,
        error: 'ID de juego inválido',
        message: 'El game_id debe ser un número entero'
      });
    }

    const result = await pool.query(
      'SELECT * FROM games WHERE game_id = $1',
      [gameId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Juego no encontrado',
        message: 'El juego especificado no existe'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error obteniendo juego:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la información del juego'
    });
  }
});

// Iniciar un juego (registrar evento de inicio)
router.post('/:gameId/start', [
  body('session_id').isUUID().withMessage('session_id debe ser un UUID válido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { gameId } = req.params;
    const { session_id } = req.body;
    
    if (!Number.isInteger(parseInt(gameId))) {
      return res.status(400).json({
        success: false,
        error: 'ID de juego inválido',
        message: 'El game_id debe ser un número entero'
      });
    }

    // Verificar que la sesión existe
    const sessionCheck = await pool.query(
      'SELECT session_id FROM sessions WHERE session_id = $1',
      [session_id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sesión no encontrada',
        message: 'La sesión especificada no existe'
      });
    }

    // Verificar que el juego existe
    const gameCheck = await pool.query(
      'SELECT * FROM games WHERE game_id = $1',
      [gameId]
    );

    if (gameCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Juego no encontrado',
        message: 'El juego especificado no existe'
      });
    }

    // Crear evento de inicio de juego
    const eventId = uuidv4();
    const result = await pool.query(
      `INSERT INTO game_events 
       (event_id, session_id, game_id, event_type, created_at) 
       VALUES ($1, $2, $3, 'start', NOW()) 
       RETURNING *`,
      [eventId, session_id, gameId]
    );

    // Actualizar actividad de la sesión
    await pool.query(
      'UPDATE sessions SET last_activity = NOW() WHERE session_id = $1',
      [session_id]
    );

    res.status(201).json({
      success: true,
      message: 'Juego iniciado exitosamente',
      data: {
        event_id: result.rows[0].event_id,
        game: gameCheck.rows[0],
        started_at: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error iniciando juego:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo iniciar el juego'
    });
  }
});

// Completar un juego (registrar evento de finalización)
router.post('/:gameId/complete', [
  body('session_id').isUUID().withMessage('session_id debe ser un UUID válido'),
  body('score').isInt({ min: 0, max: 100 }).withMessage('score debe ser un número entre 0 y 100'),
  body('time_spent').isInt({ min: 1 }).withMessage('time_spent debe ser un número positivo'),
  body('user_choices').isObject().withMessage('user_choices debe ser un objeto válido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { gameId } = req.params;
    const { session_id, score, time_spent, user_choices } = req.body;
    
    if (!Number.isInteger(parseInt(gameId))) {
      return res.status(400).json({
        success: false,
        error: 'ID de juego inválido',
        message: 'El game_id debe ser un número entero'
      });
    }

    // Verificar que la sesión existe
    const sessionCheck = await pool.query(
      'SELECT session_id FROM sessions WHERE session_id = $1',
      [session_id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sesión no encontrada',
        message: 'La sesión especificada no existe'
      });
    }

    // Verificar que el juego existe
    const gameCheck = await pool.query(
      'SELECT * FROM games WHERE game_id = $1',
      [gameId]
    );

    if (gameCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Juego no encontrado',
        message: 'El juego especificado no existe'
      });
    }

    // Crear evento de finalización de juego
    const eventId = uuidv4();
    const result = await pool.query(
      `INSERT INTO game_events 
       (event_id, session_id, game_id, event_type, score, time_spent, user_choices, created_at) 
       VALUES ($1, $2, $3, 'complete', $4, $5, $6, NOW()) 
       RETURNING *`,
      [eventId, session_id, gameId, score, time_spent, user_choices]
    );

    // Actualizar estadísticas de la sesión
    await pool.query(
      `UPDATE sessions 
       SET completed_games = completed_games + 1, 
           total_score = total_score + $1,
           last_activity = NOW() 
       WHERE session_id = $2`,
      [score, session_id]
    );

    res.status(201).json({
      success: true,
      message: 'Juego completado exitosamente',
      data: {
        event_id: result.rows[0].event_id,
        score: result.rows[0].score,
        time_spent: result.rows[0].time_spent,
        completed_at: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error completando juego:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo completar el juego'
    });
  }
});

// Obtener historial de juegos de una sesión
router.get('/session/:sessionId/history', async (req, res) => {
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
      `SELECT 
        ge.*,
        g.game_name,
        g.stem_category,
        g.game_type
      FROM game_events ge
      JOIN games g ON ge.game_id = g.game_id
      WHERE ge.session_id = $1
      ORDER BY ge.created_at DESC`,
      [sessionId]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo historial de juegos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el historial de juegos'
    });
  }
});

// Guardar evento de juego (endpoint genérico para eventos)
router.post('/events', [
  body('session_id').isUUID().withMessage('session_id debe ser un UUID válido'),
  body('game_id').isInt().withMessage('game_id debe ser un número entero'),
  body('event_type').isIn(['game_started', 'game_completed', 'hint_used', 'level_completed']).withMessage('event_type debe ser uno de los valores permitidos'),
  body('event_data').isObject().withMessage('event_data debe ser un objeto')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        details: errors.array()
      });
    }

    const { session_id, game_id, event_type, event_data } = req.body;
    
    // Verificar que la sesión existe
    const sessionCheck = await pool.query(
      'SELECT session_id FROM sessions WHERE session_id = $1',
      [session_id]
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sesión no encontrada',
        message: 'La sesión especificada no existe'
      });
    }

    // Verificar que el juego existe
    const gameCheck = await pool.query(
      'SELECT * FROM games WHERE game_id = $1',
      [game_id]
    );

    if (gameCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Juego no encontrado',
        message: 'El juego especificado no existe'
      });
    }

    // Crear evento del juego
    const eventId = uuidv4();
    const result = await pool.query(
      `INSERT INTO game_events 
       (event_id, session_id, game_id, event_type, score, time_spent, user_choices, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING *`,
      [
        eventId, 
        session_id, 
        game_id, 
        event_type,
        event_data.score || null,
        event_data.timeSpent || null,
        event_data.userChoices ? JSON.stringify(event_data.userChoices) : null
      ]
    );

    // Si es un evento de finalización, actualizar estadísticas de la sesión
    if (event_type === 'game_completed' && event_data.score) {
      await pool.query(
        `UPDATE sessions 
         SET completed_games = completed_games + 1, 
             total_score = total_score + $1,
             last_activity = NOW() 
         WHERE session_id = $2`,
        [event_data.score, session_id]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Evento del juego guardado exitosamente',
      data: {
        event_id: result.rows[0].event_id,
        event_type: result.rows[0].event_type,
        created_at: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error guardando evento del juego:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo guardar el evento del juego'
    });
  }
});

// Calcular afinidades STEM para una sesión
router.get('/affinity/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('🔍 Calculando afinidades STEM para sesión:', sessionId);
    
    // Validar formato UUID
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      return res.status(400).json({
        success: false,
        error: 'UUID inválido',
        message: 'El session_id proporcionado no tiene un formato válido'
      });
    }

    // Obtener todos los eventos de juegos completados de la sesión
    const result = await pool.query(
      `SELECT 
        ge.*,
        g.game_name,
        g.stem_category,
        g.game_type
      FROM game_events ge
      JOIN games g ON ge.game_id = g.game_id
      WHERE ge.session_id = $1 AND ge.event_type = 'game_completed'
      ORDER BY ge.created_at DESC`,
      [sessionId]
    );
    
    console.log('📊 Eventos de juegos encontrados:', result.rows.length);
    console.log('🎮 Eventos:', result.rows.map(e => ({ game: e.game_name, score: e.score, time: e.time_spent })));

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          affinities: {},
          dominantArea: null,
          confidenceLevel: null,
          suggestedPlanet: null
        }
      });
    }

    // Calcular afinidades STEM
    const affinities = {
      matemáticas: { score: 0, games: 0, totalTime: 0, hintsUsed: 0 },
      ciencia: { score: 0, games: 0, totalTime: 0, hintsUsed: 0 },
      tecnología: { score: 0, games: 0, totalTime: 0, hintsUsed: 0 },
      ingeniería: { score: 0, games: 0, totalTime: 0, hintsUsed: 0 }
    };

    // Mapeo de juegos a áreas STEM
    const gameToStemMapping = {
      'number_puzzle': 'matemáticas',
      'green_invention': 'ingeniería',
      'broken_bridge': 'ingeniería',
      'space_explorer': 'tecnología'
    };

    // Procesar cada juego completado
    result.rows.forEach(gameEvent => {
      const gameId = gameEvent.game_name;
      const stemArea = gameToStemMapping[gameId];
      
      if (stemArea && gameEvent.score > 0) {
        affinities[stemArea].score += gameEvent.score;
        affinities[stemArea].games += 1;
        affinities[stemArea].totalTime += gameEvent.time_spent || 0;
        // Nota: hintsUsed no está en la BD actual, se puede agregar después
      }
    });

    // Calcular puntuaciones normalizadas y ponderadas
    const normalizedAffinities = {};
    Object.entries(affinities).forEach(([area, data]) => {
      if (data.games > 0) {
        // Puntuación base (40% del peso total)
        const baseScore = (data.score / data.games) * 0.4;
        
        // Eficiencia de tiempo (30% del peso total)
        // Menor tiempo = mayor puntuación (máximo 3 minutos = 180 segundos)
        const timeEfficiency = Math.max(0, (180 - data.totalTime / data.games) / 180) * 100 * 0.3;
        
        // Consistencia (30% del peso total)
        const consistency = Math.min(100, data.games * 25) * 0.3;
        
        const totalAffinity = Math.round(baseScore + timeEfficiency + consistency);
        
        normalizedAffinities[area] = {
          ...data,
          normalizedScore: totalAffinity,
          baseScore: Math.round(baseScore),
          timeEfficiency: Math.round(timeEfficiency),
          consistency: Math.round(consistency)
        };
      } else {
        normalizedAffinities[area] = {
          ...data,
          normalizedScore: 0,
          baseScore: 0,
          timeEfficiency: 0,
          consistency: 0
        };
      }
    });

    // Determinar el área dominante
    let maxScore = 0;
    let dominantArea = null;

    Object.entries(normalizedAffinities).forEach(([area, data]) => {
      if (data.normalizedScore > maxScore) {
        maxScore = data.normalizedScore;
        dominantArea = area;
      }
    });

    // Calcular nivel de confianza
    let confidenceLevel = 'baja';
    if (dominantArea) {
      const dominantScore = normalizedAffinities[dominantArea].normalizedScore;
      const otherScores = Object.values(normalizedAffinities)
        .filter(data => data.normalizedScore > 0)
        .map(data => data.normalizedScore)
        .sort((a, b) => b - a);

      if (otherScores.length === 1) {
        confidenceLevel = 'alta';
      } else {
        const secondBest = otherScores[1] || 0;
        const difference = dominantScore - secondBest;

        if (difference >= 30) confidenceLevel = 'muy alta';
        else if (difference >= 20) confidenceLevel = 'alta';
        else if (difference >= 10) confidenceLevel = 'media';
        else confidenceLevel = 'baja';
      }
    }

    // Mapeo de áreas STEM a planetas
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

    const suggestedPlanet = dominantArea ? stemToPlanetMapping[dominantArea] : null;

    console.log('🌟 Resultado final:', {
      dominantArea,
      confidenceLevel,
      suggestedPlanet: suggestedPlanet?.planet,
      totalGamesPlayed: result.rows.length
    });

    res.json({
      success: true,
      data: {
        affinities: normalizedAffinities,
        dominantArea,
        confidenceLevel,
        suggestedPlanet,
        totalGamesPlayed: result.rows.length
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

module.exports = router;

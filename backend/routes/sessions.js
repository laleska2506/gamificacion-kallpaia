const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Crear nueva sesión anónima
router.post('/create', async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    const result = await pool.query(
      'INSERT INTO sessions (session_id) VALUES ($1) RETURNING *',
      [sessionId]
    );

    const session = result.rows[0];
    
    res.status(201).json({
      success: true,
      message: 'Sesión creada exitosamente',
      data: {
        session_id: session.session_id,
        created_at: session.created_at,
        completed_games: session.completed_games,
        total_score: session.total_score
      }
    });

  } catch (error) {
    console.error('Error creando sesión:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo crear la sesión'
    });
  }
});

// Obtener información de una sesión
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
      'SELECT * FROM sessions WHERE session_id = $1',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sesión no encontrada',
        message: 'La sesión especificada no existe'
      });
    }

    const session = result.rows[0];
    
    res.json({
      success: true,
      data: {
        session_id: session.session_id,
        created_at: session.created_at,
        last_activity: session.last_activity,
        completed_games: session.completed_games,
        total_score: session.total_score
      }
    });

  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo obtener la información de la sesión'
    });
  }
});

// Actualizar actividad de sesión
router.patch('/:sessionId/activity', async (req, res) => {
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
      'UPDATE sessions SET last_activity = NOW() WHERE session_id = $1 RETURNING *',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sesión no encontrada',
        message: 'La sesión especificada no existe'
      });
    }

    res.json({
      success: true,
      message: 'Actividad de sesión actualizada',
      data: {
        session_id: result.rows[0].session_id,
        last_activity: result.rows[0].last_activity
      }
    });

  } catch (error) {
    console.error('Error actualizando actividad de sesión:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudo actualizar la actividad de la sesión'
    });
  }
});

// Obtener historial de juegos de una sesión
router.get('/:sessionId/games', async (req, res) => {
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

    // Obtener todos los eventos de juegos completados para esta sesión
    const result = await pool.query(
      `SELECT 
        ge.game_id,
        ge.score,
        ge.time_spent,
        ge.user_choices,
        ge.created_at,
        g.game_name,
        g.stem_category
      FROM game_events ge
      JOIN games g ON ge.game_id = g.game_id
      WHERE ge.session_id = $1 AND ge.event_type = 'game_completed'
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

// Obtener estadísticas de sesión
router.get('/:sessionId/stats', async (req, res) => {
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

    // Obtener estadísticas de la sesión
    const sessionStats = await pool.query(
      'SELECT * FROM sessions WHERE session_id = $1',
      [sessionId]
    );

    if (sessionStats.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Sesión no encontrada',
        message: 'La sesión especificada no existe'
      });
    }

    // Obtener estadísticas de juegos completados
    const gameStats = await pool.query(
      `SELECT 
        g.stem_category,
        COUNT(*) as games_played,
        AVG(ge.score) as avg_score,
        AVG(ge.time_spent) as avg_time
      FROM game_events ge
      JOIN games g ON ge.game_id = g.game_id
      WHERE ge.session_id = $1 AND ge.event_type = 'game_completed'
      GROUP BY g.stem_category`,
      [sessionId]
    );

    // Obtener afinidades STEM si existen
    const affinityStats = await pool.query(
      'SELECT * FROM stem_affinities WHERE session_id = $1 ORDER BY calculated_at DESC LIMIT 1',
      [sessionId]
    );

    const stats = {
      session: sessionStats.rows[0],
      games_by_category: gameStats.rows,
      stem_affinity: affinityStats.rows[0] || null
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de sesión:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las estadísticas de la sesión'
    });
  }
});

module.exports = router;

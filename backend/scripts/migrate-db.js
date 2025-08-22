#!/usr/bin/env node

const { pool } = require('../config/database-prod');

// Script de migración para crear las tablas necesarias
const createTables = async () => {
  try {
    console.log('🚀 Iniciando migración de base de datos...');

    // Crear tabla de sesiones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_points INTEGER DEFAULT 0,
        games_completed INTEGER DEFAULT 0,
        stem_affinity_calculated BOOLEAN DEFAULT FALSE
      );
    `);
    console.log('✅ Tabla sessions creada/verificada');

    // Crear tabla de juegos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        difficulty_level INTEGER DEFAULT 1,
        max_points INTEGER DEFAULT 100,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla games creada/verificada');

    // Crear tabla de eventos de juegos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        game_id UUID REFERENCES games(id) ON DELETE CASCADE,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        score INTEGER,
        time_spent INTEGER,
        attempts INTEGER DEFAULT 1,
        success BOOLEAN DEFAULT FALSE
      );
    `);
    console.log('✅ Tabla game_events creada/verificada');

    // Crear tabla de afinidades STEM
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stem_affinities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
        mathematics_score DECIMAL(5,2) DEFAULT 0,
        engineering_score DECIMAL(5,2) DEFAULT 0,
        technology_score DECIMAL(5,2) DEFAULT 0,
        science_score DECIMAL(5,2) DEFAULT 0,
        dominant_stem VARCHAR(20),
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla stem_affinities creada/verificada');

    // Crear tabla de planetas STEM
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stem_planets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        category VARCHAR(20) NOT NULL,
        description TEXT,
        color_hex VARCHAR(7),
        difficulty_level INTEGER DEFAULT 1,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);
    console.log('✅ Tabla stem_planets creada/verificada');

    // Insertar datos iniciales de juegos si no existen
    const gamesCount = await pool.query('SELECT COUNT(*) FROM games');
    if (parseInt(gamesCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO games (name, description, category, difficulty_level, max_points) VALUES
        ('Puzzle de Números', 'Secuencias lógicas y patrones matemáticos', 'Matemáticas', 1, 100),
        ('Invento Verde', 'Soluciones ambientales innovadoras', 'Ingeniería', 1, 100),
        ('El Puente Roto', 'Construcción y estructuras', 'Ingeniería', 1, 100),
        ('Exploradora Espacial', 'Misiones espaciales técnicas', 'Tecnología', 1, 100);
      `);
      console.log('✅ Datos iniciales de juegos insertados');
    }

    // Insertar datos iniciales de planetas si no existen
    const planetsCount = await pool.query('SELECT COUNT(*) FROM stem_planets');
    if (parseInt(planetsCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO stem_planets (name, category, description, color_hex, difficulty_level) VALUES
        ('Mathematica Prime', 'Matemáticas', 'Planeta de patrones y secuencias lógicas', '#FBBF24', 1),
        ('Engineeria Nova', 'Ingeniería', 'Mundo de construcción y estructuras', '#EA580C', 1),
        ('Technologia Alpha', 'Tecnología', 'Esfera de innovación y misiones espaciales', '#06B6D4', 1),
        ('Scientia Verde', 'Ciencia', 'Planeta de descubrimientos científicos', '#10B981', 1);
      `);
      console.log('✅ Datos iniciales de planetas insertados');
    }

    console.log('🎉 Migración completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Ejecutar migración si se llama directamente
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('✅ Migración completada');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en migración:', error);
      process.exit(1);
    });
}

module.exports = { createTables };

const { pool } = require('../config/database');

const setupDatabase = async () => {
  try {
    console.log('🚀 Configurando base de datos KallpaIA...');

    // Crear tabla de sesiones (anonimato por session_id)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_games INTEGER DEFAULT 0,
        total_score INTEGER DEFAULT 0
      );
    `);

    // Crear tabla de mini-juegos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS games (
        game_id SERIAL PRIMARY KEY,
        game_name VARCHAR(100) NOT NULL,
        game_type VARCHAR(50) NOT NULL,
        description TEXT,
        difficulty_level INTEGER DEFAULT 1,
        estimated_duration INTEGER DEFAULT 180, -- en segundos
        stem_category VARCHAR(50) NOT NULL, -- matemáticas, ciencia, tecnología, ingeniería
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Crear tabla de eventos de juego (para tracking de afinidad)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS game_events (
        event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
        game_id INTEGER REFERENCES games(game_id),
        event_type VARCHAR(50) NOT NULL, -- 'start', 'complete', 'fail', 'hint_used'
        score INTEGER DEFAULT 0,
        time_spent INTEGER, -- en segundos
        user_choices JSONB, -- respuestas del usuario
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Crear tabla de afinidades STEM calculadas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stem_affinities (
        affinity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
        mathematics_score DECIMAL(5,2) DEFAULT 0,
        science_score DECIMAL(5,2) DEFAULT 0,
        technology_score DECIMAL(5,2) DEFAULT 0,
        engineering_score DECIMAL(5,2) DEFAULT 0,
        dominant_stem_area VARCHAR(50),
        confidence_level DECIMAL(3,2) DEFAULT 0,
        calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Crear tabla de planetas STEM sugeridos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stem_planets (
        planet_id SERIAL PRIMARY KEY,
        planet_name VARCHAR(100) NOT NULL,
        stem_focus VARCHAR(50) NOT NULL,
        description TEXT,
        difficulty_level INTEGER DEFAULT 1,
        unlock_requirements JSONB, -- requisitos para desbloquear
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Insertar datos iniciales de mini-juegos
    await pool.query(`
      INSERT INTO games (game_name, game_type, description, stem_category, difficulty_level, estimated_duration) VALUES
      ('Puzzle de Números', 'pattern_matching', 'Resuelve patrones matemáticos secuenciales', 'matemáticas', 1, 180),
      ('Invento Verde', 'creative_choice', 'Elige materiales para resolver retos ambientales', 'ingeniería', 1, 180),
      ('El Puente Roto', 'problem_solving', 'Resuelve cómo cruzar un río con recursos limitados', 'ingeniería', 1, 180),
      ('Exploradora Espacial', 'decision_making', 'Toma decisiones sobre navegación espacial', 'tecnología', 1, 180)
      ON CONFLICT DO NOTHING;
    `);

    // Insertar datos iniciales de planetas STEM
    await pool.query(`
      INSERT INTO stem_planets (planet_name, stem_focus, description, difficulty_level, unlock_requirements) VALUES
      ('Planeta Alfa', 'matemáticas', 'Mundo de patrones numéricos y lógica matemática', 1, '{"mathematics_score": 0.3}'),
      ('Planeta Delta', 'ciencia', 'Reino de la experimentación y el método científico', 1, '{"science_score": 0.3}'),
      ('Planeta Sigma', 'tecnología', 'Centro de innovación tecnológica y digital', 1, '{"technology_score": 0.3}'),
      ('Planeta Kappa', 'ingeniería', 'Tierra de construcción y resolución de problemas', 1, '{"engineering_score": 0.3}')
      ON CONFLICT DO NOTHING;
    `);

    // Crear índices para optimizar consultas
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_game_events_session_id ON game_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_game_events_game_id ON game_events(game_id);
      CREATE INDEX IF NOT EXISTS idx_stem_affinities_session_id ON stem_affinities(session_id);
      CREATE INDEX IF NOT EXISTS idx_stem_affinities_dominant_area ON stem_affinities(dominant_stem_area);
    `);

    console.log('✅ Base de datos configurada exitosamente!');
    console.log('📊 Tablas creadas: sessions, games, game_events, stem_affinities, stem_planets');
    console.log('🎮 Mini-juegos iniciales insertados');
    console.log('🌍 Planetas STEM configurados');

  } catch (error) {
    console.error('❌ Error configurando la base de datos:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Configuración completada!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en la configuración:', error);
      process.exit(1);
    });
}

module.exports = setupDatabase;

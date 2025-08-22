const { Pool } = require('pg');

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kallpaia_gamification',
  password: 'laleska',
  port: 5432,
  ssl: false,
  max: 20, // máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo de inactividad antes de cerrar conexión
  connectionTimeoutMillis: 2000, // tiempo máximo para establecer conexión
});

// Evento cuando se crea una nueva conexión
pool.on('connect', (client) => {
  console.log('🔌 Nueva conexión a PostgreSQL establecida');
});

// Evento cuando se libera una conexión
pool.on('remove', (client) => {
  console.log('🔌 Conexión a PostgreSQL liberada');
});

// Evento de error en el pool
pool.on('error', (err, client) => {
  console.error('❌ Error inesperado en el pool de PostgreSQL:', err);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    console.log('🔍 Intentando conectar a PostgreSQL...');
    console.log('📊 Configuración:', {
      user: 'postgres',
      host: 'localhost',
      database: 'kallpaia_gamification',
      port: 5432
    });
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err);
    console.error('🔍 Detalles del error:', {
      code: err.code,
      message: err.message,
      detail: err.detail
    });
    return false;
  }
};

// Función para cerrar el pool (útil para tests)
const closePool = async () => {
  await pool.end();
};

module.exports = {
  pool,
  testConnection,
  closePool
};

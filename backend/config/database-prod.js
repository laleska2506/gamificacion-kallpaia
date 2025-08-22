const { Pool } = require('pg');

// Configuración de la base de datos para producción
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 20,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 2000,
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
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
      ssl: process.env.NODE_ENV === 'production'
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

const { Pool } = require('pg');

// Configuración temporal de la base de datos PostgreSQL
// IMPORTANTE: Este archivo es solo para desarrollo
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kallpaia_gamification',
  password: 'tu_contraseña_real_aqui', // CAMBIA ESTO por tu contraseña real
  port: 5432,
  ssl: false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
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
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('❌ Error conectando a PostgreSQL:', err);
    return false;
  }
};

// Función para cerrar el pool
const closePool = async () => {
  await pool.end();
};

module.exports = {
  pool,
  testConnection,
  closePool
};

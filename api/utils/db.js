/**
 * Database Connection Pool
 *
 * Manages PostgreSQL connections for the API
 */

const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // DigitalOcean managed databases
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection not established
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err.message);
  // Don't exit - let the server continue running
});

// Test connection on startup
pool
  .query('SELECT NOW()')
  .then(() => console.log('✅ Database connection pool initialized'))
  .catch((err) => console.error('❌ Database connection test failed:', err.message));

// Helper function to execute queries
const query = (text, params) => pool.query(text, params);

// Helper function to get a client from the pool (for transactions)
const getClient = () => pool.connect();

module.exports = {
  query,
  getClient,
  pool,
};

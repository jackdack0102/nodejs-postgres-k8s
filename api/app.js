const express = require('express');
const { Pool } = require('pg');
const Vault = require('node-vault');

const app = express();

let pool;

// Initialize Vault client
const vault =  Vault({
  endpoint: process.env.VAULT_ADDR || 'http://127.0.0.1:8200',
  token: process.env.VAULT_TOKEN
});

// Fetch secrets from Vault and initialize DB connection
async function getDbCredentials() {
  const result = await vault.read('database/creds/postgres-role');
  return {
    user: result.data.username,
    password: result.data.password,
    host: 'db',
    database: 'devopsdb',
    port: 5432
  };
}

async function createPool() {
  const creds = await getDbCredentials();
  return new Pool(creds);  // pg Pool
}

async function initializeDatabase() {
  pool = await createPool();
  console.log('Database pool initialized');
}

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({
      status: 'ok'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error'
    });
  }
});

// Start server after initializing database
async function startServer() {
  await initializeDatabase();
  
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
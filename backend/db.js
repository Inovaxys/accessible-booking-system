const { Pool } = require('pg');

const pool = new Pool({
  user: 'yamunah',
  host: 'localhost',
  database: 'booking_system',
  password: '',
  port: 5433,
});

module.exports = pool;
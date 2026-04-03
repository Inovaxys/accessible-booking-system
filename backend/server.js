console.log('THIS IS MY SERVER FILE');

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// 🔍 Get available slots (with optional search)
app.get('/slots', async (req, res) => {
  const { search } = req.query;

  try {
    let query = 'SELECT * FROM slots WHERE is_booked = false';
    let values = [];

    // If search is provided → filter by time
    if (search) {
      query += ' AND start_time::text ILIKE $1';
      values.push(`%${search}%`);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching slots' });
  }
});

// 📌 Book a slot (safe)
app.post('/book', async (req, res) => {
  const { user_id, slot_id } = req.body;

  try {
    // Prevent double booking
    const update = await pool.query(
      'UPDATE slots SET is_booked = true WHERE id = $1 AND is_booked = false RETURNING *',
      [slot_id]
    );

    if (update.rowCount === 0) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    await pool.query(
      'INSERT INTO bookings (user_id, slot_id) VALUES ($1, $2)',
      [user_id, slot_id]
    );

    res.json({ message: 'Booking successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Booking failed' });
  }
});

// 📌 Get all bookings (extra endpoint)
app.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
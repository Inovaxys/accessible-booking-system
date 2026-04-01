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

// Get slots
app.get('/slots', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM slots WHERE is_booked = false'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

// Book slot
app.post('/book', async (req, res) => {
  const { user_id, slot_id } = req.body;

  try {
    await pool.query(
      'UPDATE slots SET is_booked = true WHERE id = $1',
      [slot_id]
    );

    await pool.query(
      'INSERT INTO bookings (user_id, slot_id) VALUES ($1, $2)',
      [user_id, slot_id]
    );

    res.json({ message: 'Booking successful' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Booking failed');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
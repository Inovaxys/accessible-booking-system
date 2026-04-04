const express = require('express');
const app = express();

app.use(express.json());

// API: Get bookings by date
app.get('/api/bookings', (req, res) => {
  try {
    const { date } = req.query;

    // Validation: check if date is provided
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    // Validation: check if date is valid
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    // Mock data (simulate DB response)
    const bookings = [
      { id: 1, time: '10:00 AM', status: 'Available' },
      { id: 2, time: '11:00 AM', status: 'Booked' }
    ];

    // Success response
    res.status(200).json({
      success: true,
      message: `Bookings for ${date}`,
      data: bookings
    });

  } catch (error) {
    // Error handling
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/favorites - Get all favorite cities for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT city_name FROM favorites WHERE user_id = ?', [req.user.id]);
    const cities = rows.map(row => row.city_name);
    res.json({ favorites: cities });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST /api/favorites/add - Add a favorite city
router.post('/add', authenticateToken, async (req, res) => {
  const { city } = req.body;
  const userId = Number(req.user.id);
  console.log('🔍 Add favorite request:', { userId, city });
  console.log('Inserting with userId type:', typeof userId, userId);

  try {
    const [result] = await db.query(
      'INSERT INTO favorites (user_id, city_name) VALUES (?, ?)',
      [userId, city]
    );
    console.log('Insert result:', result);
    res.json({ message: 'City added to favorites' });
  } catch (err) {
    console.error('❌ Error adding favorite:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// POST /api/favorites/remove - Remove a favorite city
router.post('/remove', authenticateToken, async (req, res) => {
  const { city } = req.body;
  const userId = Number(req.user.id);
  console.log('🔍 Remove favorite request:', { userId, city });

  try {
    const [result] = await db.query(
      'DELETE FROM favorites WHERE user_id = ? AND city_name = ?',
      [userId, city]
    );
    console.log('Delete result:', result);
    res.json({ message: 'City removed from favorites' });
  } catch (err) {
    console.error('❌ Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
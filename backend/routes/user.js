const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const db = require('../models/db');
const upload = require('../utils/upload');

router.post('/register', upload.single('photo'), authController.registerUser);


router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Decoded user ID from token:', userId);

    // const [rows] = await db.query('SELECT username FROM users WHERE id = ?', [userId]);
    const [rows] = await db.query('SELECT username, email, location, bio, photo FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // res.json({ username: rows[0].username });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user from database:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ===== account deletion =====
router.delete('/delete', authenticateToken, authController.deleteAccount);

// ===== update info =====
router.put('/update', authenticateToken, upload.single('photo'), authController.updateProfile);
router.put('/password', authenticateToken, authController.changePassword);

module.exports = router;
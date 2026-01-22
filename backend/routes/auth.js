const express = require('express');
const router = express.Router();
const multer = require('multer');
const { registerUser, loginUser } = require('../controllers/authController');

// Configure multer to store files in /uploads
const upload = multer({ dest: 'uploads/' });

// Registration with photo upload
router.post('/register', upload.single('photo'), registerUser);

// Login stays the same
router.post('/login', loginUser);

module.exports = router;
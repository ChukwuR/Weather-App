const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const path = require('path');
const fs = require('fs');

// ===== create account =====

exports.registerUser = async (req, res) => {
  try {
    const { username, email, location, bio, password } = req.body;
    const photo = req.file;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if user already exists
    const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save photo filename or null
    const photoFilename = photo ? photo.filename : null;

    // Insert user into database
    await db.query(
      'INSERT INTO users (photo, username, email, location, bio, password) VALUES (?, ?, ?, ?, ?, ?)',
      [photoFilename, username, email, location, bio, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Something went wrong during registration.' });
  }
};

// ===== login user =====

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        location: user.location,
        bio: user.bio,
        photo: user.photo
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// ===== delete user =====
// deleting along with the photo
exports.deleteAccount = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Get user's photo filename
    const [[user]] = await db.query('SELECT photo FROM users WHERE id = ?', [userId]);

    // 2. Delete photo file if it exists
    if (user?.photo) {
      const photoPath = path.join(__dirname, '../uploads', user.photo);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // 3. Delete related favorites
    await db.query('DELETE FROM favorites WHERE user_id = ?', [userId]);

    // 4. Delete user account
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};

// ===== update profile =====
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, email, location, bio } = req.body;
  const photo = req.file;

  try {
    // Get current photo filename
    const [[user]] = await db.query('SELECT photo FROM users WHERE id = ?', [userId]);

    let newPhoto = user.photo;

    // If a new photo is uploaded, delete the old one and update
    if (photo) {
      if (user?.photo) {
        const oldPath = path.join(__dirname, '../uploads', user.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      newPhoto = photo.filename;
    }

    // Update user info
    await db.query(
      'UPDATE users SET username = ?, email = ?, location = ?, bio = ?, photo = ? WHERE id = ?',
      [username, email, location, bio, newPhoto, userId]
    );

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ===== change password =====
exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Both current and new passwords are required.' });
  }

  try {
    // Get current hashed password
    const [[user]] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect.' });

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Password update error:', err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
};
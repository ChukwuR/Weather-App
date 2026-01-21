const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const weatherRoutes = require('./routes/weather');
const path = require('path');
const favoritesRoutes = require('./routes/favorites');

dotenv.config();
const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://lume-weather.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
// app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/favorites', favoritesRoutes);

// Error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
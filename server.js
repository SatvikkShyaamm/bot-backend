const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const simulationRoutes = require('./routes/simulation');
const claudeRoutes = require('./routes/claude');

const app = express();

// Security middleware
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' })); // Prevent large payload attacks

// CORS - only allow your frontend
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}));

// Rate limiting on auth routes
const authLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 50, // max 50 attempts per window
  message: { error: 'Too many attempts. Please try again in 3 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api', claudeRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
// Support JSON payloads up to 10mb for base64 medical reports uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
connectDB();

// Root route check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Book a Doctor Healthcare Booking API!',
    status: 'Online',
    mockMode: process.env.MOCK_DB === 'true'
  });
});

// Mounting Feature API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/health-records', require('./routes/healthRecords'));
app.use('/api/prescriptions', require('./routes/prescriptions'));

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('\x1b[31m[Server Error]\x1b[0m', err.message);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Bind port and start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n\x1b[32m[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}\x1b[0m`);
  console.log(`\x1b[36m[API URL] http://localhost:${PORT}\x1b[0m\n`);
});

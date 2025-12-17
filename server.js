const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false // Disable for development
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/guide', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'guide.html'));
});

app.get('/media', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'media.html'));
});

app.get('/social', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'social.html'));
});

app.get('/system', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'system.html'));
});

app.get('/members', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'members.html'));
});

app.get('/imihigo', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'imihigo.html'));
});

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalFamilies: 156,
    totalMembers: 623,
    completionRate: 75,
    activeSectors: 2
  });
});

// Error handling
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    🚀 DUHIGURE MU MIRYANGO Server started!
    📍 Port: ${PORT}
    🌐 Environment: ${process.env.NODE_ENV || 'development'}
    🕒 Time: ${new Date().toLocaleString()}
    
    📊 API Endpoints:
    - Health Check: http://localhost:${PORT}/api/health
    - Statistics: http://localhost:${PORT}/api/stats
    - Home Page: http://localhost:${PORT}
    
    🔧 Press Ctrl+C to stop
  `);
});
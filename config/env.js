require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/truck-alert',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  
  // Email configuration
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'Gmail',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Admin credentials (for seeding)
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@trucks.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  ADMIN_PHONE: process.env.ADMIN_PHONE || '0000000000',
  
  // Node environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Geolocation
  GEOCODER_PROVIDER: process.env.GEOCODER_PROVIDER || 'openstreetmap'
};

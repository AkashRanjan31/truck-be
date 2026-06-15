const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to bypass local DNS blocks on Atlas SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.DATABASE_URL;
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Error: ${err.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('🔄 MongoDB reconnected'));

module.exports = connectDB;

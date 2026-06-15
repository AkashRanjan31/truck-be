require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { setupSockets } = require('./config/socket');
const { seedStates } = require('./seed/seedStates');
const { seedAuthorities } = require('./seed/seedAuthorities');
const { seedDefaultUsers } = require('./seed/seedAdmin');
const config = require('./config/env');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));
app.set('io', io);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/drivers',   require('./routes/drivers'));
app.use('/api/reports',   require('./routes/reports'));
app.use('/api/admin',     require('./routes/admin'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/traffic',   require('./routes/traffic'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/states',    require('./routes/states'));
app.use('/api/alerts',    require('./routes/alerts'));
app.use('/api/authority', require('./routes/authority'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);
setupSockets(io);

connectDB().then(async () => {
  await seedStates();
  await seedAuthorities();
  await seedDefaultUsers();   // seeds all 4 roles

  server.listen(config.PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${config.PORT} [${config.NODE_ENV}]`);
  });
}).catch((err) => {
  console.error('❌ Failed to start:', err.message);
  process.exit(1);
});

process.on('SIGTERM', () => server.close(() => console.log('Server closed')));

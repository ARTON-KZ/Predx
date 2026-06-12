require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');

const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
const adminRoutes  = require('./routes/admin');
const authRoutes   = require('./routes/auth');
const memberRoutes = require('./routes/member');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://predx-woad.vercel.app',
    'https://arton-kz.github.io',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Webhook route needs raw body for signature verification — mount BEFORE express.json()
app.use('/api/webhook', webhookRoutes);

app.use(express.json());

app.use('/api/payment', paymentRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/auth',    authRoutes);
app.use('/api/member',  memberRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Predx backend running on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/webhook/paymento`);
});

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');

const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
const adminRoutes  = require('./routes/admin');
const authRoutes   = require('./routes/auth');
const memberRoutes = require('./routes/member');
const { stmts } = require('./db');
const paymento = require('./paymento');

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

// Reconciliation sweep: re-checks pending orders with Paymento so payments
// register even when the customer closed the browser and no IPN arrived.
async function sweepPendingPayments() {
  let pending;
  try {
    pending = stmts.getPendingPayments.all();
  } catch (err) {
    console.error('Pending sweep query failed:', err.message);
    return;
  }
  for (const row of pending) {
    try {
      const v = await paymento.verifyPayment(row.invoice_uuid);
      const status = v.success ? 'paid' : paymento.mapOrderStatus(v.orderStatus);
      if (status !== 'pending') {
        stmts.updateStatusByOrderId.run({ status, order_id: row.order_id });
        console.log(`Sweep: order ${row.order_id} -> ${status}`);
      }
    } catch (e) {
      // Gateway/network hiccup — retried on the next sweep
    }
  }
}

app.listen(PORT, () => {
  console.log(`Predx backend running on http://localhost:${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/api/webhook/paymento`);
  sweepPendingPayments();
  setInterval(sweepPendingPayments, 60_000);
});

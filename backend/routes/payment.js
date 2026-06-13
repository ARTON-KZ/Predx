const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { stmts } = require('../db');
const paymento = require('../paymento');
const { hashPassword } = require('../hash');

const PLANS = {
  basic: { name: 'Basic', amount: '150.00', amountNum: 150 },
  premium: { name: 'Premium', amount: '300.00', amountNum: 300 },
};

router.post('/create', async (req, res) => {
  try {
    const { plan, full_name, email, password } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan. Choose basic or premium.' });
    }
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }
    if (typeof password !== 'string' || password.trim().length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const order_id = uuidv4();
    const selectedPlan = PLANS[plan];
    // Paymento POSTs the customer back to ReturnUrl, which a static frontend can't
    // accept — so we land on the backend and redirect to success.html from there.
    const returnUrl = `${process.env.BASE_URL}/api/payment/return?order_id=${order_id}`;

    const token = await paymento.createPaymentRequest({
      orderId: order_id,
      fiatAmount: selectedPlan.amount,
      email: email.toLowerCase().trim(),
      returnUrl,
    });

    stmts.insertPayment.run({
      order_id,
      plan,
      amount: selectedPlan.amountNum,
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: hashPassword(password.trim()),
    });
    stmts.updateInvoiceUuid.run({ invoice_uuid: token, order_id });

    res.json({ payment_url: paymento.gatewayUrl(token), order_id });
  } catch (err) {
    console.error('Payment create error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create payment. Please try again.' });
  }
});

// Customer lands here after the Paymento gateway (GET or signed POST) —
// forward them to the frontend confirmation page, which polls /status.
const handleReturn = (req, res) => {
  const orderId =
    req.query.order_id || req.body?.OrderId || req.body?.orderId || '';
  const dest = `${process.env.FRONTEND_URL}/success.html?order_id=${encodeURIComponent(orderId)}`;
  res.redirect(303, dest);
};
router.get('/return', handleReturn);
router.post('/return', express.urlencoded({ extended: true }), handleReturn);

router.get('/status/:orderId', async (req, res) => {
  try {
    const record = stmts.getByOrderId.get(req.params.orderId);
    if (!record) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }

    let status = record.status;
    let stage = status === 'paid' ? 'paid' : status === 'failed' ? 'failed' : null;

    // While pending, double-check with Paymento directly so confirmation
    // works even if the IPN hasn't arrived yet.
    if (status === 'pending' && record.invoice_uuid) {
      try {
        const v = await paymento.verifyPayment(record.invoice_uuid);
        status = v.success ? 'paid' : paymento.mapOrderStatus(v.orderStatus);
        stage = status === 'pending' ? paymento.stageFromOrderStatus(v.orderStatus) : status;
        if (status !== record.status) {
          stmts.updateStatusByOrderId.run({ status, order_id: record.order_id });
        }
      } catch (e) {
        // Gateway unreachable — keep last known status (stage stays null);
        // the IPN or the sweep will update us.
      }
    }

    res.json({ status, stage, plan: record.plan, full_name: record.full_name });
  } catch (err) {
    console.error('Status check error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

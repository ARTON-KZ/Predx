const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { stmts } = require('../db');

const PLANS = {
  basic: { name: 'Basic', amount: '150.00', amountNum: 150 },
  premium: { name: 'Premium', amount: '300.00', amountNum: 300 },
};

function buildSign(body) {
  const bodyStr = JSON.stringify(body);
  const base64Body = Buffer.from(bodyStr).toString('base64');
  return crypto.createHash('md5').update(base64Body + process.env.HELEKET_API_KEY).digest('hex');
}

router.post('/create', async (req, res) => {
  try {
    const { plan, full_name, email } = req.body;

    if (!plan || !PLANS[plan]) {
      return res.status(400).json({ error: 'Invalid plan. Choose basic or premium.' });
    }
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const order_id = uuidv4();
    const selectedPlan = PLANS[plan];
    const webhookUrl = `${process.env.BASE_URL}/api/webhook/heleket`;
    const returnUrl = `${process.env.FRONTEND_URL}/success.html?order_id=${order_id}`;

    const invoiceBody = {
      order_id,
      amount: selectedPlan.amount,
      currency: 'USDT',
      url_callback: webhookUrl,
      url_return: returnUrl,
    };

    const sign = buildSign(invoiceBody);

    const heleket = await axios.post(
      'https://api.heleket.com/v1/payment',
      invoiceBody,
      {
        headers: {
          'Content-Type': 'application/json',
          merchant: process.env.HELEKET_MERCHANT_ID,
          sign,
        },
        timeout: 15000,
      }
    );

    const result = heleket.data?.result;
    if (!result?.url) {
      console.error('Heleket response missing payment URL:', heleket.data);
      return res.status(502).json({ error: 'Payment gateway error. Please try again.' });
    }

    stmts.insertPayment.run({
      order_id,
      plan,
      amount: selectedPlan.amountNum,
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
    });

    if (result.uuid) {
      stmts.updateInvoiceUuid.run({ invoice_uuid: result.uuid, order_id });
    }

    res.json({ payment_url: result.url, order_id });
  } catch (err) {
    console.error('Payment create error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create payment. Please try again.' });
  }
});

router.get('/status/:orderId', (req, res) => {
  try {
    const record = stmts.getByOrderId.get(req.params.orderId);
    if (!record) {
      return res.status(404).json({ error: 'Payment record not found.' });
    }
    res.json({ status: record.status, plan: record.plan, full_name: record.full_name });
  } catch (err) {
    console.error('Status check error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

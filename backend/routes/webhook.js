const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { stmts } = require('../db');
const paymento = require('../paymento');

// Paymento IPN — set {BASE_URL}/api/webhook/paymento as the IPN URL in the
// Paymento dashboard. Payloads are signed with HMAC-SHA256 (uppercase hex)
// using the secret key from the dashboard.
router.post('/paymento', express.raw({ type: '*/*' }), async (req, res) => {
  try {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({ error: 'Invalid request body.' });
    }
    const rawBody = req.body;

    const signature = String(req.headers['x-hmac-sha256-signature'] || '').toUpperCase();
    const expected = crypto
      .createHmac('sha256', process.env.PAYMENTO_SECRET_KEY || '')
      .update(rawBody)
      .digest('hex')
      .toUpperCase();

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (!signature || sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      console.warn('Paymento IPN signature mismatch');
      return res.status(400).json({ error: 'Invalid signature.' });
    }

    const body = JSON.parse(rawBody.toString('utf8'));
    const token = body.Token ?? body.token;
    const orderId = body.OrderId ?? body.orderId;
    const orderStatus = body.OrderStatus ?? body.orderStatus;

    const internalStatus = paymento.mapOrderStatus(orderStatus);

    // Paymento expects Paid orders to be confirmed via the Verify API
    // (moves them to Approve and finalizes the payment on their side).
    if (internalStatus === 'paid' && token) {
      try {
        await paymento.verifyPayment(token);
      } catch (e) {
        console.warn('Paymento verify after IPN failed:', e.message);
      }
    }

    let updated = false;
    if (token) {
      const result = stmts.updateStatusByInvoiceUuid.run({ status: internalStatus, invoice_uuid: token });
      if (result.changes > 0) updated = true;
    }
    if (!updated && orderId) {
      stmts.updateStatusByOrderId.run({ status: internalStatus, order_id: orderId });
    }

    console.log(`Paymento IPN: order=${orderId}, paymento_status=${orderStatus}, internal=${internalStatus}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { stmts } = require('../db');

const PAID_STATUSES = new Set(['paid', 'paid_over']);
const FAILED_STATUSES = new Set(['fail', 'cancel', 'system_fail', 'wrong_amount']);

router.post('/heleket', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    let rawBody, body;

    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body;
      body = JSON.parse(rawBody.toString('utf8'));
    } else {
      return res.status(400).json({ error: 'Invalid request body.' });
    }

    const { sign, uuid, order_id, status } = body;

    if (!sign) {
      console.warn('Webhook missing sign field');
      return res.status(400).json({ error: 'Missing signature.' });
    }

    const base64Body = rawBody.toString('base64');
    const expectedSign = crypto
      .createHash('md5')
      .update(base64Body + process.env.HELEKET_API_KEY)
      .digest('hex');

    if (expectedSign !== sign) {
      console.warn('Webhook signature mismatch');
      return res.status(400).json({ error: 'Invalid signature.' });
    }

    let internalStatus;
    if (PAID_STATUSES.has(status)) {
      internalStatus = 'paid';
    } else if (FAILED_STATUSES.has(status)) {
      internalStatus = 'failed';
    } else {
      internalStatus = 'pending';
    }

    let updated = false;

    if (uuid) {
      const result = stmts.updateStatusByInvoiceUuid.run({ status: internalStatus, invoice_uuid: uuid });
      if (result.changes > 0) updated = true;
    }

    if (!updated && order_id) {
      stmts.updateStatusByOrderId.run({ status: internalStatus, order_id });
    }

    console.log(`Webhook received: order=${order_id}, heleket_status=${status}, internal=${internalStatus}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook processing error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

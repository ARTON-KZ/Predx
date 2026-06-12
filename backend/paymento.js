/* Paymento crypto payment gateway client
   Docs: https://docs.paymento.io/api-documention */

const axios = require('axios');

const PAYMENTO_API = 'https://api.paymento.io/v1';
const GATEWAY_URL = 'https://app.paymento.io/gateway';

function apiHeaders(accept) {
  return {
    'Api-key': process.env.PAYMENTO_API_KEY,
    'Content-Type': 'application/json',
    Accept: accept,
  };
}

// Creates a payment request; returns the gateway token for redirecting the customer.
async function createPaymentRequest({ orderId, fiatAmount, email, returnUrl, plan }) {
  const res = await axios.post(
    `${PAYMENTO_API}/payment/request`,
    {
      fiatAmount,
      fiatCurrency: 'USD',
      ReturnUrl: returnUrl,
      orderId,
      Speed: 0,
      EmailAddress: email,
      additionalData: { plan },
    },
    { headers: apiHeaders('text/plain'), timeout: 15000 }
  );

  if (!res.data?.success || !res.data?.body) {
    throw new Error(`Paymento request failed: ${res.data?.message || 'missing token'}`);
  }
  return res.data.body;
}

function gatewayUrl(token) {
  return `${GATEWAY_URL}?token=${encodeURIComponent(token)}`;
}

// Confirms a payment server-side. success:true means the order reached Approve status.
async function verifyPayment(token) {
  const res = await axios.post(
    `${PAYMENTO_API}/payment/verify`,
    { token },
    { headers: apiHeaders('application/json'), timeout: 15000 }
  );
  return { success: !!res.data?.success, orderStatus: res.data?.body?.orderStatus };
}

// Paymento order statuses: 0 Initialize, 1 Pending, 2 PartialPaid, 3 WaitingToConfirm,
// 4 Timeout, 5 UserCanceled, 7 Paid, 8 Approve, 9 Reject (callbacks send numbers,
// the verify API may send names)
const PAID_STATUSES = new Set([7, 8, 'paid', 'approve']);
const FAILED_STATUSES = new Set([4, 5, 9, 'timeout', 'usercanceled', 'reject', 'revert']);

function mapOrderStatus(orderStatus) {
  const key = typeof orderStatus === 'string' && isNaN(Number(orderStatus))
    ? orderStatus.toLowerCase()
    : Number(orderStatus);
  if (PAID_STATUSES.has(key)) return 'paid';
  if (FAILED_STATUSES.has(key)) return 'failed';
  return 'pending';
}

module.exports = { createPaymentRequest, gatewayUrl, verifyPayment, mapOrderStatus };

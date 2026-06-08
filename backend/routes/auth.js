const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { stmts } = require('../db');

// Step 1 — verify email + member password
router.post('/prelogin', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const record = stmts.getByEmailAndPassword.get({
      email: email.toLowerCase().trim(),
      member_password: password.trim(),
    });

    if (!record) {
      return res.status(401).json({
        error: 'Incorrect email or password.',
      });
    }

    // Short-lived token that only unlocks the OTP step
    const tempToken = jwt.sign(
      { id: record.id, email: record.email, step: 'otp' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    res.json({ temp_token: tempToken });
  } catch (err) {
    console.error('Prelogin error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Step 2 — verify OTP with the temp token from step 1
router.post('/login', (req, res) => {
  try {
    const { otp, temp_token } = req.body;

    if (!temp_token || !otp) {
      return res.status(400).json({ error: 'OTP and session token are required.' });
    }

    let payload;
    try {
      payload = jwt.verify(temp_token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    if (payload.step !== 'otp') {
      return res.status(401).json({ error: 'Invalid session.' });
    }

    const record = stmts.getByEmailAndOtp.get({
      email: payload.email,
      otp: otp.trim().toUpperCase(),
    });

    if (!record) {
      return res.status(401).json({
        error: 'Invalid access code. Please check the code sent to you on Telegram.',
      });
    }

    const token = jwt.sign(
      {
        id: record.id,
        full_name: record.full_name,
        email: record.email,
        plan: record.plan,
        role: 'member',
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      member: {
        full_name: record.full_name,
        email: record.email,
        plan: record.plan,
      },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;

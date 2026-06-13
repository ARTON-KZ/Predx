const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { stmts } = require('../db');

function verifyAdminToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    if (payload.role !== 'admin') throw new Error('Not admin');
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}

function generateCode(length = 8) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

router.get('/users', verifyAdminToken, (req, res) => {
  try {
    const users = stmts.getPaidUsers.all();
    res.json({ users });
  } catch (err) {
    console.error('Admin users error:', err.message);
    res.status(500).json({ error: 'Failed to load users.' });
  }
});

// Generates the OTP (login step 2). The customer's password (step 1) is the
// one they chose at checkout, so the admin only issues the access code.
router.post('/generate-credentials/:id', verifyAdminToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID.' });

    const otp = generateCode(8);
    stmts.setMemberOtp.run({ otp, id });
    res.json({ otp });
  } catch (err) {
    console.error('Credential generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate credentials.' });
  }
});

router.post('/mark-issued/:id', verifyAdminToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID.' });
    stmts.markOtpIssued.run({ id });
    res.json({ success: true });
  } catch (err) {
    console.error('Mark issued error:', err.message);
    res.status(500).json({ error: 'Failed to update record.' });
  }
});

// === Predictions CRUD ===

router.get('/predictions', verifyAdminToken, (req, res) => {
  try {
    const predictions = stmts.getAllPredictions.all();
    res.json({ predictions });
  } catch (err) {
    console.error('Get predictions error:', err.message);
    res.status(500).json({ error: 'Failed to load predictions.' });
  }
});

router.post('/predictions', verifyAdminToken, (req, res) => {
  try {
    const { match_date, home_team, away_team, league, prediction, odds, plan } = req.body;
    if (!match_date || !home_team || !away_team || !prediction) {
      return res.status(400).json({ error: 'match_date, home_team, away_team, and prediction are required.' });
    }
    if (!['basic', 'premium'].includes(plan)) {
      return res.status(400).json({ error: 'plan must be basic or premium.' });
    }
    const info = stmts.addPrediction.run({
      match_date,
      home_team: home_team.trim(),
      away_team: away_team.trim(),
      league: (league || '').trim(),
      prediction: prediction.trim(),
      odds: (odds || '').trim(),
      plan,
    });
    res.json({ id: info.lastInsertRowid, success: true });
  } catch (err) {
    console.error('Add prediction error:', err.message);
    res.status(500).json({ error: 'Failed to add prediction.' });
  }
});

router.patch('/predictions/:id', verifyAdminToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID.' });
    const { result } = req.body;
    if (!['pending', 'win', 'loss'].includes(result)) {
      return res.status(400).json({ error: 'result must be pending, win, or loss.' });
    }
    stmts.updatePredictionResult.run({ result, id });
    res.json({ success: true });
  } catch (err) {
    console.error('Update prediction result error:', err.message);
    res.status(500).json({ error: 'Failed to update result.' });
  }
});

router.delete('/predictions/:id', verifyAdminToken, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID.' });
    stmts.deletePrediction.run({ id });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete prediction error:', err.message);
    res.status(500).json({ error: 'Failed to delete prediction.' });
  }
});

module.exports = router;

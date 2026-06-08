const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { stmts } = require('../db');

function verifyMemberToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    if (payload.role !== 'member') throw new Error('Not a member');
    req.member = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

router.get('/predictions', verifyMemberToken, (req, res) => {
  try {
    const plan = req.member.plan;
    const predictions = plan === 'premium'
      ? stmts.getPredictionsPremium.all()
      : stmts.getPredictionsBasic.all();
    res.json({
      predictions,
      date: new Date().toISOString().slice(0, 10),
    });
  } catch (err) {
    console.error('Member predictions error:', err.message);
    res.status(500).json({ error: 'Failed to load predictions.' });
  }
});

module.exports = router;

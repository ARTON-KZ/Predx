const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'predx.db');
const db = new DatabaseSync(DB_PATH);

db.exec(`PRAGMA journal_mode = WAL`);
db.exec(`PRAGMA foreign_keys = ON`);

db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_uuid      TEXT    UNIQUE,
    order_id          TEXT    UNIQUE NOT NULL,
    plan              TEXT    NOT NULL,
    amount            REAL    NOT NULL,
    full_name         TEXT,
    email             TEXT,
    status            TEXT    NOT NULL DEFAULT 'pending',
    otp               TEXT,
    otp_issued        INTEGER NOT NULL DEFAULT 0,
    otp_generated_at  TEXT,
    member_password   TEXT,
    created_at        TEXT    DEFAULT (datetime('now')),
    updated_at        TEXT    DEFAULT (datetime('now'))
  )
`);

// Migrate existing DB: add member_password if it doesn't exist yet
try {
  db.exec(`ALTER TABLE payments ADD COLUMN member_password TEXT`);
} catch (_) { /* column already exists */ }

db.exec(`
  CREATE TABLE IF NOT EXISTS predictions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    match_date  TEXT NOT NULL,
    home_team   TEXT NOT NULL,
    away_team   TEXT NOT NULL,
    league      TEXT,
    prediction  TEXT NOT NULL,
    odds        TEXT,
    result      TEXT NOT NULL DEFAULT 'pending',
    plan        TEXT NOT NULL DEFAULT 'basic',
    created_at  TEXT DEFAULT (datetime('now'))
  )
`);

const stmts = {
  insertPayment: db.prepare(`
    INSERT INTO payments (order_id, plan, amount, full_name, email)
    VALUES (@order_id, @plan, @amount, @full_name, @email)
  `),

  updateInvoiceUuid: db.prepare(`
    UPDATE payments SET invoice_uuid = @invoice_uuid, updated_at = datetime('now')
    WHERE order_id = @order_id
  `),

  getByOrderId: db.prepare(`SELECT * FROM payments WHERE order_id = ?`),

  getByInvoiceUuid: db.prepare(`SELECT * FROM payments WHERE invoice_uuid = ?`),

  updateStatusByOrderId: db.prepare(`
    UPDATE payments SET status = @status, updated_at = datetime('now')
    WHERE order_id = @order_id
  `),

  updateStatusByInvoiceUuid: db.prepare(`
    UPDATE payments SET status = @status, updated_at = datetime('now')
    WHERE invoice_uuid = @invoice_uuid
  `),

  getPendingPayments: db.prepare(`
    SELECT order_id, invoice_uuid FROM payments
    WHERE status = 'pending' AND invoice_uuid IS NOT NULL
      AND created_at > datetime('now', '-48 hours')
  `),

  getPaidUsers: db.prepare(`
    SELECT id, full_name, email, plan, amount, status,
           otp, otp_issued, otp_generated_at, member_password, created_at
    FROM payments WHERE status = 'paid' ORDER BY created_at DESC
  `),

  generateCredentials: db.prepare(`
    UPDATE payments
    SET otp = @otp, member_password = @member_password,
        otp_generated_at = datetime('now'), updated_at = datetime('now')
    WHERE id = @id
  `),

  markOtpIssued: db.prepare(`
    UPDATE payments SET otp_issued = 1, updated_at = datetime('now')
    WHERE id = @id
  `),

  getByEmailAndPassword: db.prepare(`
    SELECT * FROM payments
    WHERE email = @email AND member_password = @member_password AND status = 'paid'
  `),

  getByEmailAndOtp: db.prepare(`
    SELECT * FROM payments WHERE email = @email AND otp = @otp AND status = 'paid'
  `),

  addPrediction: db.prepare(`
    INSERT INTO predictions (match_date, home_team, away_team, league, prediction, odds, plan)
    VALUES (@match_date, @home_team, @away_team, @league, @prediction, @odds, @plan)
  `),

  getAllPredictions: db.prepare(`
    SELECT * FROM predictions ORDER BY match_date DESC, id DESC
  `),

  updatePredictionResult: db.prepare(`
    UPDATE predictions SET result = @result WHERE id = @id
  `),

  deletePrediction: db.prepare(`DELETE FROM predictions WHERE id = @id`),

  getPredictionsBasic: db.prepare(`
    SELECT * FROM predictions
    WHERE match_date = DATE('now') AND plan = 'basic'
    ORDER BY id ASC
  `),

  getPredictionsPremium: db.prepare(`
    SELECT * FROM predictions
    WHERE match_date = DATE('now')
    ORDER BY id ASC
  `),
};

module.exports = { db, stmts };

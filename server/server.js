// server/server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');
const path = require('path');

const app = express();

// --- Middlewares globaux ---
app.use(helmet());
app.use(express.json()); // ✅ doit venir avant les routes API
app.use(express.urlencoded({ extended: true }));

// --- Session ---
app.use(
  session({
    name: 'itlabctf_sid',
    secret: process.env.SESSION_SECRET || 'change_me_in_prod',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1h
    },
  })
);

// --- Rate limit ---
const limiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// --- Chargement des données ---
let ANSWERS = [];
try {
  ANSWERS = JSON.parse(process.env.ANSWERS_JSON || '[]');
} catch (e) {
  console.error('❌ Erreur parsing ANSWERS_JSON :', e);
}
const FLAG = process.env.FLAG || 'ITLABCTF{redacted_flag}';

// --- Fonctions utilitaires ---
function safeEq(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const na = a.trim().toLowerCase();
  const nb = b.trim().toLowerCase();
  const bufA = Buffer.from(na);
  const bufB = Buffer.from(nb);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// --- Routes API ---
app.post('/api/answer', (req, res) => {
  const { index, answer } = req.body || {};
  console.log('DEBUG', req.body); // 👈 utile pour tester localement

  if (typeof index !== 'number' || index < 0 || index >= ANSWERS.length) {
    return res.status(400).json({ ok: false, error: 'invalid_index' });
  }

  const correct = safeEq(answer || '', ANSWERS[index] || '');
  if (correct) {
    if (!req.session.revealed) req.session.revealed = {};
    req.session.revealed[index] = true;
  }
  return res.json({ ok: correct });
});

app.get('/api/status', (req, res) => {
  const revealed = req.session.revealed || {};
  const arr = ANSWERS.map((_, i) => !!revealed[i]);
  res.json({ revealed: arr });
});

app.post('/api/flag', (req, res) => {
  const { flag } = req.body || {};
  if (!flag) return res.status(400).json({ ok: false });
  return res.json({ ok: flag === FLAG });
});

// --- Fichiers statiques (frontend) ---
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));
app.get('/', (_, res) => res.sendFile(path.join(frontendPath, 'index.html')));

app.get('/ping', (_, res) => res.send('pong'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`));

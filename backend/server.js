require('dotenv').config();
const express      = require('express');
const session      = require('express-session');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const path         = require('path');
const pgSession    = require('connect-pg-simple')(session);
const { pool }     = require('./src/config/database');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Behind CloudPanel's nginx: without this, express-session sees a plain HTTP
// connection and silently refuses to set the `secure` cookie — nobody can log in.
if (isProd) app.set('trust proxy', 1);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: isProd ? false : 'http://localhost:5173',
  credentials: true,
}));

// ─── Body / cookies ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// ─── Session ──────────────────────────────────────────────────────────────────
app.use(session({
  store: new pgSession({ pool, tableName: 'user_sessions', createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || 'peacock-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// ─── Uploaded product images ──────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./src/routes/auth'));
app.use('/api',         require('./src/routes/shop'));
app.use('/api/admin',   require('./src/routes/admin'));

// ─── Serve React build in production ──────────────────────────────────────────
if (isProd) {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html')));
}

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: isProd ? 'Internal server error' : err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running → http://localhost:${PORT}`));

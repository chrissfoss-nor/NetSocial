const express = require('express');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/posts');

const app = express();

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const postsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const pagesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());
app.use(cookieParser());

// CSRF protection – double-submit cookie pattern.
// A random token is issued on GET requests (browser page loads).
// State-mutating API requests must echo that token in the X-CSRF-Token header.
app.use((req, res, next) => {
  const existingToken = req.cookies['csrf_token'];

  // Issue a CSRF token to browsers loading pages
  if (req.method === 'GET' && !existingToken) {
    const token = crypto.randomBytes(24).toString('hex');
    res.cookie('csrf_token', token, { sameSite: 'strict', httpOnly: false });
  }

  // Enforce the token on state-mutating API requests when a browser session
  // has been established (i.e., a csrf_token cookie was already issued by a GET)
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
      req.path.startsWith('/api/') && existingToken) {
    const headerToken = req.headers['x-csrf-token'];
    if (!headerToken || headerToken.length !== existingToken.length ||
        !crypto.timingSafeEqual(Buffer.from(headerToken), Buffer.from(existingToken))) {
      return res.status(403).json({ error: 'Forbidden: CSRF check failed' });
    }
  }

  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/posts', postsLimiter, postRoutes);

// Serve SPA pages
app.get('/feed', pagesLimiter, (req, res) => res.sendFile(path.join(__dirname, 'public', 'feed.html')));
app.get('/login', pagesLimiter, (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', pagesLimiter, (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));

module.exports = app;

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/posts');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Serve SPA pages
app.get('/feed', (req, res) => res.sendFile(path.join(__dirname, 'public', 'feed.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));

module.exports = app;

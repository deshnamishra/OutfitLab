require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// JWT verification middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// Serve index.html
app.get('/', (req, res) => {
  console.log('📄 index.html opened');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Protected route: Get all outfits
app.get('/outfits', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM outfits WHERE user_id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('❌ Error fetching outfits:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Protected route: Add new outfit
app.post('/outfits', authenticateToken, (req, res) => {
  const { name, image, category } = req.body;

  if (!name || !image || !category) {
    return res.status(400).json({ error: 'All fields (name, image, category) are required.' });
  }

  const sql = 'INSERT INTO outfits (name, image, category, user_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, image, category, req.user.id], (err, result) => {
    if (err) {
      console.error('❌ Error saving outfit:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Register new user
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Registration error:', err);
        return res.status(500).json({ error: 'Registration failed. Email or username may already exist.' });
      }
      console.log(`✅ User registered with ID: ${result.insertId}`);
      res.json({ success: true, userId: result.insertId });
    });
  } catch (err) {
    console.error('❌ Hashing error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Login error' });
    if (results.length === 0) return res.status(401).json({ error: 'User not found' });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password' });

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      success: true,
      token,
      userId: user.id,
      username: user.username,
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

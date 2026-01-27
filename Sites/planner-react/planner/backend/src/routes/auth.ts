import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Helper function to convert PHP $2y$ to Node.js $2a$ (they're compatible)
function convertPhpBcryptHash(hash: string): string {
  if (hash.startsWith('$2y$')) {
    return '$2a$' + hash.substring(4);
  }
  return hash;
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, nick, password } = req.body;

    // Check if user already exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE nick = ?',
      [nick]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Používateľ už existuje' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, nick, password, veduci) VALUES (?, ?, ?, ?)',
      [name, nick, hashedPassword, false]
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, nick, name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        name,
        nick,
        veduci: false,
        role: null
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Chyba pri registrácii' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { nick, password } = req.body;

    console.log('Login attempt for:', nick);

    // Find user
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE nick = ?',
      [nick]
    );

    if (users.length === 0) {
      console.log('User not found:', nick);
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    const user = users[0];
    console.log('User found:', user.nick, 'Has password:', !!user.password);

    // Check if user has a password
    if (!user.password) {
      return res.status(401).json({ error: 'Účet nemá nastavené heslo. Kontaktujte administrátora.' });
    }

    // Convert PHP $2y$ hash to $2a$ for Node.js compatibility
    const convertedHash = convertPhpBcryptHash(user.password);
    console.log('Original hash prefix:', user.password.substring(0, 4));
    console.log('Converted hash prefix:', convertedHash.substring(0, 4));

    // Check password
    const validPassword = await bcrypt.compare(password, convertedHash);
    console.log('Password valid:', validPassword);

    if (!validPassword) {
      return res.status(401).json({ error: 'Nesprávne prihlasovacie údaje' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, nick: user.nick, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', user.nick);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        nick: user.nick,
        veduci: Boolean(user.veduci),
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Chyba pri prihlásení' });
  }
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Chýba token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, nick, role, veduci FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Používateľ nenájdený' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    res.status(401).json({ error: 'Neplatný token' });
  }
});

export default router;
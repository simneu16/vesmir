import express from 'express';
import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, nick, role, veduci FROM users ORDER BY name'
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, nick, role, veduci FROM users WHERE id = ?',
      [req.params.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (role and veduci)
router.put('/:id', async (req, res) => {
  try {
    const { role, veduci } = req.body;
    
    await pool.query<ResultSetHeader>(
      'UPDATE users SET role = ?, veduci = ? WHERE id = ?',
      [role, veduci ? 1 : 0, req.params.id]
    );
    
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, nick, role, veduci FROM users WHERE id = ?',
      [req.params.id]
    );
    
    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    // First, remove user from all event signups
    await pool.query(
      'DELETE FROM event_signups WHERE user_id = ?',
      [req.params.id]
    );
    
    // Then delete the user
    await pool.query<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
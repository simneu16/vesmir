import express from 'express';
import pool from '../database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { pushService } from '../services/pushService';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT e.*, 
        GROUP_CONCAT(u.id) as signup_ids,
        GROUP_CONCAT(u.name) as signup_names
      FROM events e
      LEFT JOIN event_signups es ON e.id = es.event_id
      LEFT JOIN users u ON es.user_id = u.id
      GROUP BY e.id
      ORDER BY e.od ASC
    `);
    
    const events = rows.map(row => ({
      ...row,
      kamera: Boolean(row.kamera),
      redaktor: Boolean(row.redaktor),
      foto: Boolean(row.foto),
      zvuk: Boolean(row.zvuk),
      reels: Boolean(row.reels),
      od: new Date(row.od),
      do: new Date(row.do),
      signups: row.signup_ids ? row.signup_ids.split(',').map((id: string, idx: number) => ({
        id: parseInt(id),
        name: row.signup_names.split(',')[idx]
      })) : []
    }));
    
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM events WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const { nazov, ucebna, od, do: doDate, kamera, redaktor, foto, zvuk, reels, link, prihlasene_id, createdBy } = req.body;
    
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO events (nazov, ucebna, od, do, kamera, redaktor, foto, zvuk, reels, link, prihlasene_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nazov, ucebna, od, doDate, kamera ? 1 : 0, redaktor ? 1 : 0, foto ? 1 : 0, zvuk ? 1 : 0, reels ? 1 : 0, link, prihlasene_id]
    );
    
    // Send push notification
    await pushService.sendToAll({
      title: '📅 Nová udalosť',
      body: `${nazov} - ${new Date(od).toLocaleDateString('sk-SK')}`,
      icon: '/logo.png',
      data: { eventId: result.insertId, type: 'event_created' }
    }, createdBy);
    
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { nazov, ucebna, od, do: doDate, kamera, redaktor, foto, zvuk, reels, link, prihlasene_id, updatedBy } = req.body;
    
    await pool.query(
      `UPDATE events 
       SET nazov=?, ucebna=?, od=?, do=?, kamera=?, redaktor=?, foto=?, zvuk=?, reels=?, link=?, prihlasene_id=?
       WHERE id=?`,
      [nazov, ucebna, od, doDate, kamera ? 1 : 0, redaktor ? 1 : 0, foto ? 1 : 0, zvuk ? 1 : 0, reels ? 1 : 0, link, prihlasene_id, req.params.id]
    );
    
    // Send push notification
    await pushService.sendToAll({
      title: '✏️ Udalosť upravená',
      body: `${nazov} - ${new Date(od).toLocaleDateString('sk-SK')}`,
      icon: '/logo.png',
      data: { eventId: req.params.id, type: 'event_updated' }
    }, updatedBy);
    
    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    // Get event details before deleting
    const [events] = await pool.query<RowDataPacket[]>('SELECT nazov FROM events WHERE id = ?', [req.params.id]);
    const eventName = events[0]?.nazov || 'Udalosť';
    
    await pool.query('DELETE FROM event_signups WHERE event_id = ?', [req.params.id]);
    await pool.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    
    // Send push notification
    await pushService.sendToAll({
      title: '🗑️ Udalosť zmazaná',
      body: eventName,
      icon: '/logo.png',
      data: { eventId: req.params.id, type: 'event_deleted' }
    });
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Sign up for event
router.post('/:id/signup', async (req, res) => {
  try {
    const { user_id } = req.body;
    await pool.query(
      'INSERT INTO event_signups (event_id, user_id) VALUES (?, ?)',
      [req.params.id, user_id]
    );
    res.json({ message: 'Signed up successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// Remove signup
router.delete('/:id/signup/:user_id', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM event_signups WHERE event_id = ? AND user_id = ?',
      [req.params.id, req.params.user_id]
    );
    res.json({ message: 'Signup removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove signup' });
  }
});

export default router;
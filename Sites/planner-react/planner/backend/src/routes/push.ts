import express from 'express';
import { pushService } from '../services/pushService';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    await pushService.saveSubscription(userId, subscription);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

export default router;
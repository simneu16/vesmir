import webpush from 'web-push';
import pool from '../database';
import { RowDataPacket } from 'mysql2';

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidEmail = process.env.VAPID_EMAIL!;

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const pushService = {
  async saveSubscription(userId: number, subscription: PushSubscription) {
    try {
      // Check if subscription already exists
      const [existing] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM push_subscriptions WHERE user_id = ? AND endpoint = ?',
        [userId, subscription.endpoint]
      );

      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)',
          [userId, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth]
        );
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  },

  async sendToUser(userId: number, payload: any) {
    try {
      const [subscriptions] = await pool.query<RowDataPacket[]>(
        'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?',
        [userId]
      );

      const promises = subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
        } catch (error: any) {
          // If subscription is no longer valid, remove it
          if (error.statusCode === 410) {
            await pool.query('DELETE FROM push_subscriptions WHERE endpoint = ?', [sub.endpoint]);
          }
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  },

  async sendToAll(payload: any, excludeUserId?: number) {
    try {
      let query = 'SELECT user_id, endpoint, p256dh, auth FROM push_subscriptions';
      const params: any[] = [];

      if (excludeUserId) {
        query += ' WHERE user_id != ?';
        params.push(excludeUserId);
      }

      const [subscriptions] = await pool.query<RowDataPacket[]>(query, params);

      const promises = subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        };

        try {
          await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
        } catch (error: any) {
          if (error.statusCode === 410) {
            await pool.query('DELETE FROM push_subscriptions WHERE endpoint = ?', [sub.endpoint]);
          }
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending push notification to all:', error);
    }
  },
};
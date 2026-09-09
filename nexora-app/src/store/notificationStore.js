/**
 * notificationStore.js — Module 4
 *
 * Zustand store — manages notification UI state only.
 * All data operations go through analyticsService.
 *
 * Architecture:
 *   Component → Store action → Service → Mock DB (localStorage) → State update
 */

import { create } from 'zustand';
import {
  fetchNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  createNotification,
} from '../services/analyticsService';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount:   0,
  loading:       false,
  filter:        'all',

  // ── Read ───────────────────────────────────────────────────────────────────

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const { notifications, unreadCount } = await fetchNotifications('all');
      set({ notifications, unreadCount, loading: false });
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      set({ loading: false });
    }
  },

  setFilter: (filter) => set({ filter }),

  // ── Create ─────────────────────────────────────────────────────────────────

  createNotification: async (data) => {
    try {
      const { notification } = await createNotification(data);
      set((s) => ({
        notifications: [notification, ...s.notifications],
        unreadCount:   s.unreadCount + 1,
      }));
      return notification;
    } catch (err) {
      console.error('Failed to create notification:', err);
      throw err;
    }
  },

  // ── Update ─────────────────────────────────────────────────────────────────

  markRead: async (id) => {
    // Optimistic update
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    });
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
      // Rollback
      await get().fetchNotifications();
    }
  },

  markAllRead: async () => {
    // Optimistic update
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount:   0,
    }));
    try {
      await markAllRead();
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
      await get().fetchNotifications();
    }
  },

  // ── Delete ─────────────────────────────────────────────────────────────────

  deleteNotification: async (id) => {
    // Optimistic update
    set((s) => {
      const notifications = s.notifications.filter((n) => n._id !== id);
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    });
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      await get().fetchNotifications();
    }
  },
}));

export default useNotificationStore;

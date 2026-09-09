/**
 * authStore.js
 *
 * Zustand store for authentication state.
 *
 * State:
 *   user       — current logged-in user object or null
 *   token      — simulated session token or null
 *   isLoading  — async operation in progress
 *   error      — last error message
 *
 * Actions:
 *   login()         — authenticates user via authService.loginUser
 *   register()      — registers user via authService.registerUser
 *   logout()        — clears session
 *   loadUser()      — restores session from localStorage using authService.getMe
 *   updateProfile() — updates display name via authService.updateProfile
 *   clearError()    — clears error message
 */

import { create } from 'zustand';
import { loginUser, registerUser, getMe, updateProfile } from '../services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await loginUser(credentials);
      localStorage.setItem('nexora_token', token);
      set({ user, token, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await registerUser(data);
      localStorage.setItem('nexora_token', token);
      set({ user, token, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('nexora_token');
    set({ user: null, token: null, error: null });
  },

  loadUser: async () => {
    const storedToken = localStorage.getItem('nexora_token');
    if (!storedToken) return;
    set({ isLoading: true });
    try {
      const { user } = await getMe(storedToken);
      set({ user, token: storedToken, isLoading: false });
    } catch {
      localStorage.removeItem('nexora_token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateProfile: async (profileData) => {
    const { user } = get();
    if (!user) return;
    set({ isLoading: true, error: null });
    try {
      const { user: updatedUser } = await updateProfile(user._id, profileData);
      set({ user: updatedUser, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// Default export for backwards-compat with pages that use default import
export default useAuthStore;

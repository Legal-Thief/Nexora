/**
 * authService.js — Module 1: Auth & User Management
 *
 * All functions use MOCK DATA only. No backend calls are made.
 *
 * ─── MOCK vs REAL AUTHENTICATION ─────────────────────────────────────────────
 *  This is NOT real authentication.
 *  The "token" produced here is a plain base64-encoded JSON string (btoa).
 *  A real JWT is:
 *    ✗ Cryptographically signed by the backend (HS256 / RS256)
 *    ✗ Verified on every protected API request server-side
 *    ✗ Tamper-proof — modifying payload invalidates the signature
 *  This simulation only demonstrates the session flow:
 *    store token → read userId from token → fetch user.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * localStorage keys:
 *   nexora_users       — persisted user profiles
 *   nexora_credentials — persisted email + password pairs
 *   nexora_token       — active session token
 *
 * FUTURE INTEGRATION:
 *   Replace each function body with an axios call to the real backend.
 *   The store and components do NOT need to change.
 */

import { getUsers, saveUsers, getCredentials, saveCredentials } from '../mock/users';

/** Simulate network latency (removed for instant feel, kept for documentation). */
const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

/** Build a simulated (NOT real) session token from userId. */
function makeToken(userId) {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 86_400_000 }));
}

// ── Validation helpers ────────────────────────────────────────────────────────

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Create ────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * Real API: POST /api/auth/register → { user, token }
 *
 * Validation:
 *   - name, email, password are required
 *   - email must be valid format
 *   - password must be >= 6 characters
 *   - email must not already be registered
 */
export const registerUser = async ({ name, email, password }) => {
  await delay(600);

  // ── Input validation ──
  if (!name?.trim())      throw new Error('Name is required.');
  if (!email?.trim())     throw new Error('Email is required.');
  if (!validateEmail(email.trim())) throw new Error('Please enter a valid email address.');
  if (!password)          throw new Error('Password is required.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters.');

  const users       = getUsers();
  const credentials = getCredentials();

  // ── Duplicate check ──
  if (users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('This email is already registered. Please log in instead.');
  }

  const newUser = {
    _id:            crypto.randomUUID(),
    name:           name.trim(),
    email:          email.trim().toLowerCase(),
    profilePicture: null,
    workspaceRole:  'member',
    projectRole:    'developer',
    isActive:       true,
    lastSeen:       new Date().toISOString(),
    createdAt:      new Date().toISOString(),
  };

  // ── Persist ──
  saveUsers([...users, newUser]);
  saveCredentials([...credentials, { email: newUser.email, password }]);

  return { user: newUser, token: makeToken(newUser._id) };
};

// ── Read ──────────────────────────────────────────────────────────────────────

/**
 * Login with email + password.
 * Real API: POST /api/auth/login → { user, token }
 */
export const loginUser = async ({ email, password }) => {
  await delay(500);

  if (!email?.trim())  throw new Error('Email is required.');
  if (!password)       throw new Error('Password is required.');

  const credentials = getCredentials();
  const users       = getUsers();

  const cred = credentials.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
  );
  if (!cred) throw new Error('Invalid email or password.');

  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) throw new Error('User account not found. Please register.');

  // Update lastSeen and persist
  const updatedUsers = users.map((u) =>
    u._id === user._id ? { ...u, lastSeen: new Date().toISOString() } : u
  );
  saveUsers(updatedUsers);

  return { user: { ...user, lastSeen: new Date().toISOString() }, token: makeToken(user._id) };
};

/**
 * Restore session from a stored token.
 * Real API: GET /api/auth/me (Authorization: Bearer <jwt>)
 */
export const getMe = async (token) => {
  await delay(200);
  if (!token) throw new Error('No session token provided.');
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) throw new Error('Session expired. Please log in again.');
    const user = getUsers().find((u) => u._id === payload.userId);
    if (!user) throw new Error('User account not found.');
    return { user };
  } catch (err) {
    // Re-throw our own errors; wrap unknown parse errors
    if (err.message.includes('expired') || err.message.includes('not found')) throw err;
    throw new Error('Invalid session. Please log in again.');
  }
};

// ── Update ────────────────────────────────────────────────────────────────────

/**
 * Update user profile fields.
 * Real API: PATCH /api/auth/profile → { user }
 */
export const updateProfile = async (userId, profileData) => {
  await delay(400);
  if (!userId) throw new Error('User ID is required.');

  const users = getUsers();
  const idx   = users.findIndex((u) => u._id === userId);
  if (idx === -1) throw new Error('User not found.');

  if (profileData.name !== undefined && !profileData.name.trim()) {
    throw new Error('Name cannot be empty.');
  }

  const updatedUser  = { ...users[idx], ...profileData, updatedAt: new Date().toISOString() };
  const updatedUsers = [...users];
  updatedUsers[idx]  = updatedUser;

  saveUsers(updatedUsers);
  return { user: updatedUser };
};

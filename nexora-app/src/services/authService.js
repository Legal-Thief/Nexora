import { getUsers, saveUsers, getCredentials, saveCredentials } from '../mock/users';

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

function makeToken(userId) {
  return btoa(JSON.stringify({ userId, exp: Date.now() + 86_400_000 }));
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const registerUser = async ({ name, email, password }) => {
  await delay(600);

  if (!name?.trim())      throw new Error('Name is required.');
  if (!email?.trim())     throw new Error('Email is required.');
  if (!validateEmail(email.trim())) throw new Error('Please enter a valid email address.');
  if (!password)          throw new Error('Password is required.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters.');

  const users       = getUsers();
  const credentials = getCredentials();

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

  saveUsers([...users, newUser]);
  saveCredentials([...credentials, { email: newUser.email, password }]);

  return { user: newUser, token: makeToken(newUser._id) };
};

export const loginUser = async ({ email, password }) => {
  await delay(500);

  if (!email?.trim())  throw new Error('Email is required.');
  if (!password)       throw new Error('Password is required.');

  const credentials = getCredentials();
  const users       = getUsers();

  const inputEmail = email.trim().toLowerCase();
  const searchEmail = inputEmail === 'demo@nexora' ? 'demo@nexora.com' : inputEmail;

  const cred = credentials.find(
    (c) => (c.email.toLowerCase() === inputEmail || c.email.toLowerCase() === searchEmail) && c.password === password
  );
  if (!cred) throw new Error('Invalid email or password.');

  const user = users.find(
    (u) => u.email.toLowerCase() === searchEmail || 
           u.email.toLowerCase() === inputEmail ||
           ((searchEmail === 'demo@nexora.com' || searchEmail === 'tanishq@nexora.com') && u._id === 'user_001')
  );
  if (!user) throw new Error('User account not found. Please register.');

  const updatedUsers = users.map((u) =>
    u._id === user._id ? { ...u, lastSeen: new Date().toISOString() } : u
  );
  saveUsers(updatedUsers);

  return { user: { ...user, lastSeen: new Date().toISOString() }, token: makeToken(user._id) };
};

export const getMe = async (token) => {
  await delay(200);
  if (!token) throw new Error('No session token provided.');
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) throw new Error('Session expired. Please log in again.');
    const targetId = payload.userId === 'user_000' ? 'user_001' : payload.userId;
    const user = getUsers().find((u) => u._id === targetId);
    if (!user) throw new Error('User account not found.');
    return { user };
  } catch (err) {
    if (err.message.includes('expired') || err.message.includes('not found')) throw err;
    throw new Error('Invalid session. Please log in again.');
  }
};

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

/**
 * resetDemo.js — Module 3: Tasks + Kanban
 * Clears ONLY the Nexora-specific localStorage keys for this module.
 */

const NEXORA_KEYS = [
  'nexora_tasks',
];

export function resetNexoraData() {
  NEXORA_KEYS.forEach((key) => {
    try { localStorage.removeItem(key); } catch { }
  });
  console.info('[Nexora] Task demo data reset. Reload the page to restart with seed data.');
}

export function getNexoraStorageReport() {
  return NEXORA_KEYS.reduce((acc, key) => {
    const raw = localStorage.getItem(key);
    acc[key] = raw ? `${raw.length} bytes` : 'not set';
    return acc;
  }, {});
}

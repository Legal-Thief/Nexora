const NEXORA_KEYS = [
  'nexora_users', 'nexora_credentials', 'nexora_token',
  'nexora_workspaces', 'nexora_projects',
  'nexora_tasks', 'nexora_notifications',
];
export function resetNexoraData() {
  NEXORA_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch {} });
  console.info('[Nexora] Demo data reset. Reload to restore seed data.');
}
export function getNexoraStorageReport() {
  return NEXORA_KEYS.reduce((acc, k) => {
    const raw = localStorage.getItem(k);
    acc[k] = raw ? `${raw.length} bytes` : 'not set';
    return acc;
  }, {});
}

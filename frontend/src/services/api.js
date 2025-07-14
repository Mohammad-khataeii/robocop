import axios from 'axios';

// Base URL of Django backend API — adjust if running elsewhere
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000, // optional: add timeout for requests
});

// ==========================
// Robot control
// ==========================

const getRobotStatus = () => api.get('/status/');
const moveRobot = (data) => api.post('/move/', data);
const stopRobot = () => api.post('/stop/');

// ==========================
// Saved positions
// ==========================

const getSavedPositions = () => api.get('/positions/');
const savePosition = (data) => api.post('/positions/', data);
const updatePosition = (name, data) => api.patch(`/positions/${encodeURIComponent(name)}/`, data);
const deletePosition = (name) => api.delete(`/positions/${encodeURIComponent(name)}/`);

// ==========================
// Logs (for LogPanel)
// ==========================

const getLogs = () => api.get('/logs/');
const clearLogs = () => api.post('/clear-logs/');

// ==========================
// Settings
// ==========================

const saveSettings = (data) => api.post('/settings/', data);

// ==========================
// Export all API functions
// ==========================

export default {
  getRobotStatus,
  moveRobot,
  stopRobot,
  getSavedPositions,
  savePosition,
  updatePosition,
  deletePosition,
  getLogs,
  clearLogs,
  saveSettings,
};

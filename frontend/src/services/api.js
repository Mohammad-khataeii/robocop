import axios from 'axios';

// Base URL of Django backend API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',  // adjust if backend runs elsewhere
});

// ==========================
// API functions
// ==========================

// Get robot status
export const getRobotStatus = () => api.get('/status/');

// Send move command
export const moveRobot = (data) => api.post('/move/', data);

// Send emergency stop
export const stopRobot = () => api.post('/stop/');

// Get all saved positions
export const getSavedPositions = () => api.get('/positions/');

// Save new position
export const savePosition = (data) => api.post('/positions/', data);

// Update a saved position
export const updatePosition = (name, data) => api.patch(`/positions/${name}/`, data);

// Delete a saved position
export const deletePosition = (name) => api.delete(`/positions/${name}/`);

export default {
  getRobotStatus,
  moveRobot,
  stopRobot,
  getSavedPositions,
  savePosition,
  updatePosition,
  deletePosition,
};

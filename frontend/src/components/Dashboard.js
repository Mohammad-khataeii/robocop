import React, { useEffect, useState } from 'react';
import api from '../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getRobotStatus()
      .then(res => setStatus(res.data))
      .catch(err => setError('Failed to fetch robot status'));
  }, []);

  return (
    <div className={styles.container}>
      <h2>🤖 RoboCop Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {status ? (
        <div>
          <p>Connected: {status.connected ? 'Yes' : 'No'}</p>
          <p>Status: {status.status}</p>
          <p>Mode: {status.mode}</p>
        </div>
      ) : (
        <p>Loading robot status...</p>
      )}
    </div>
  );
};

export default Dashboard;

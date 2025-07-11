import React, { useState } from 'react';
import styles from './LogPanel.module.css';

const LogPanel = () => {
  const [logs, setLogs] = useState([
    'System initialized.',
    'Awaiting robot commands...'
  ]);

  return (
    <div className={styles.container}>
      <h2>📜 Log Panel</h2>
      <ul>
        {logs.map((log, idx) => <li key={idx}>{log}</li>)}
      </ul>
    </div>
  );
};

export default LogPanel;

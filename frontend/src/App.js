import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import MoveRobot from './components/MoveRobot';
import SavedPositions from './components/SavedPositions';
import Settings from './components/Settings';
import LogPanel from './components/LogPanel';
import RobotViewer from './components/RobotViewer';
import api from './services/api';
import styles from './App.module.css';

function App() {
  const [jointPositions, setJointPositions] = useState([0, 0, 0, 0, 0, 0]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchPositions = () => {
      api.getSavedPositions()
        .then(res => {
          const saved = res.data.positions;
          if (saved && Object.values(saved).length > 0) {
            const firstPos = Object.values(saved)[0];
            setJointPositions(firstPos);
          }
        })
        .catch(err => console.error('Failed to fetch positions', err));
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={darkMode ? styles.dark : styles.light}>
      <nav className={styles.navbar}>
        <h1>🤖 RoboCop</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      <section className={styles.section}>
        <h2>🦾 Robot Viewer</h2>
        <RobotViewer jointPositions={jointPositions} />
      </section>

      <section className={styles.grid}>
        <div>
          <Dashboard />
          <MoveRobot />
          <SavedPositions />
        </div>
        <div>
          <Settings />
          <LogPanel />
        </div>
      </section>
    </div>
  );
}

export default App;

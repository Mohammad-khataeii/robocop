import React, { useState } from 'react';
import api from '../services/api';
import styles from './MoveRobot.module.css';

const MoveRobot = () => {
  const [positions, setPositions] = useState([0, 0, 0, 0, 0, 0]);
  const [duration, setDuration] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.moveRobot({ positions, duration, speed })
      .then(res => setMessage(res.data.message))
      .catch(err => setError('Failed to send move command'));
  };

  const handleStop = () => {
    api.stopRobot()
      .then(res => setMessage(res.data.message))
      .catch(err => setError('Failed to send stop command'));
  };

  return (
    <div className={styles.container}>
      <h2>⚙️ Move Robot</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {positions.map((pos, idx) => (
          <div className={styles.formGroup} key={idx}>
            <label>Joint {idx + 1}:</label>
            <input
              type="number"
              value={pos}
              onChange={(e) => {
                const newPos = [...positions];
                newPos[idx] = parseFloat(e.target.value);
                setPositions(newPos);
              }}
            />
          </div>
        ))}
        <div className={styles.formGroup}>
          <label>Duration (s):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Speed (0-1):</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </div>
        <button type="submit">Send Move Command</button>
      </form>
      <button onClick={handleStop} style={{ marginTop: '10px' }}>🚨 Emergency Stop</button>
    </div>
  );
};

export default MoveRobot;

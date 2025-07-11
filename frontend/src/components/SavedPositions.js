import React, { useEffect, useState } from 'react';
import api from '../services/api';
import styles from './SavedPositions.module.css';

const SavedPositions = () => {
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSavedPositions()
      .then(res => {
        const data = res.data.positions || {};
        const formatted = Object.entries(data).map(([name, joints]) => ({ name, joints }));
        setPositions(formatted);
      })
      .catch(err => setError('Failed to fetch saved positions'));
  }, []);

  return (
    <div className={styles.container}>
      <h2>💾 Saved Positions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {positions.length === 0 ? (
          <li>No saved positions found.</li>
        ) : (
          positions.map((pos, idx) => (
            <li key={idx}>
              <strong>{pos.name}</strong>: {pos.joints.join(', ')}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default SavedPositions;

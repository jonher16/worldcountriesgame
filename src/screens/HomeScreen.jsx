import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Country Guessing Game</h1>
      <button onClick={() => navigate('/game')}>Start Game</button>
      <button onClick={() => navigate('/stats')}>View Stats</button>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
  title: { fontSize: '24px', marginBottom: '20px' },
};


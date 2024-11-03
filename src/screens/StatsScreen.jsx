import React from 'react';
import { useLocation } from 'react-router-dom';

export default function StatsScreen() {
  const { state } = useLocation();
  const { score, missed, timeTaken } = state || {};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Game Stats</h1>
      <p>Countries Identified: {score}</p>
      <p>Countries Missed: {missed}</p>
      <p>Time Taken: {Math.floor(timeTaken / 60)}m {timeTaken % 60}s</p>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' },
  title: { fontSize: '24px', marginBottom: '20px' },
};

import React, { useEffect } from 'react';

export default function Timer({ timeLeft, setTimeLeft }) {
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, setTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return <p style={styles.timer}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</p>;
}

const styles = {
  timer: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center' },
};

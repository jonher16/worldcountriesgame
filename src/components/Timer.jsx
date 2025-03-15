import { useEffect } from 'react';
import PropTypes from 'prop-types';

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
  
  // Determine color based on time left
  const getTimerColor = () => {
    if (timeLeft < 60) return '#ff4d4f'; // Red when less than 1 minute
    if (timeLeft < 180) return '#ffaa00'; // Orange when less than 3 minutes
    return '#8cff8c'; // Green otherwise
  };

  return (
    <div style={styles.timerContainer}>
      <span style={styles.timerLabel}>Time Left:</span>
      <span style={{
        ...styles.timer,
        color: getTimerColor(),
      }}>{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</span>
    </div>
  );
}

// Add PropTypes validation
Timer.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  setTimeLeft: PropTypes.func.isRequired
};

const styles = {
  timerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerLabel: {
    fontSize: '14px',
    fontWeight: 'normal',
    marginBottom: '2px',
    color: '#ccc',
  },
  timer: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    transition: 'color 0.5s ease',
  },
};

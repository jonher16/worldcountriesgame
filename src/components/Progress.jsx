import PropTypes from 'prop-types';

export default function Progress({ total, matched }) {
  const percentage = (matched / total) * 100;
  
  // Get color based on progress
  const getProgressColor = () => {
    if (percentage < 33) return '#ff4d4f';
    if (percentage < 66) return '#ffaa00';
    return '#8cff8c';
  };

  return (
    <div style={styles.progressContainer}>
      <div style={styles.labelContainer}>
        <span style={styles.progressLabel}>Progress:</span>
        <span style={styles.progressText}>{`${matched}/${total}`}</span>
      </div>
      <div style={styles.progressBarContainer}>
        <div 
          style={{
            ...styles.progressBar,
            width: `${percentage}%`,
            backgroundColor: getProgressColor()
          }}
        />
      </div>
    </div>
  );
}

// Add PropTypes validation
Progress.propTypes = {
  total: PropTypes.number.isRequired,
  matched: PropTypes.number.isRequired
};

const styles = {
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '120px',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '5px',
  },
  progressLabel: {
    fontSize: '14px',
    color: '#ccc',
    marginBottom: '2px',
  },
  progressText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
  },
  progressBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#444',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    transition: 'width 0.5s ease, background-color 0.5s ease',
  }
};

import React from 'react';

export default function Progress({ total, matched }) {
  return <p style={styles.progress}>{`Progress: ${matched}/${total}`}</p>;
}

const styles = {
  progress: { fontSize: '18px', textAlign: 'center', margin: '10px 0' },
};

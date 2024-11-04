// src/components/LoadingScreen.js
import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div style={styles.loadingContainer}>
      <motion.div
        style={styles.globe}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: 'linear',
        }}
      >
        {/* Simple SVG Globe */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="100"
          height="100"
        >
          <circle cx="32" cy="32" r="30" stroke="#7dd87d" strokeWidth="2" fill="none" />
          <path
            d="M2,32 A30,30 0 0,1 62,32"
            stroke="#7dd87d"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M32,2 A30,30 0 0,1 32,62"
            stroke="#7dd87d"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M12,12 L52,52"
            stroke="#7dd87d"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M52,12 L12,52"
            stroke="#7dd87d"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
      <motion.h2
        style={styles.loadingText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
      >
        Loading Rankings...
      </motion.h2>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    zIndex: 9999,
  },
  globe: {
    marginBottom: '20px',
  },
  loadingText: {
    color: '#7dd87d',
    fontSize: '24px',
    animation: 'fadeInOut 2s infinite',
  },
  '@keyframes fadeInOut': {
    '0%, 100%': { opacity: 0.5 },
    '50%': { opacity: 1 },
  },
};

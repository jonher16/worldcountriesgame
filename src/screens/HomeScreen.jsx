// src/screens/HomeScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌍 World Countries: The Game 🌍
      </motion.h1>
      <motion.p
        style={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Test your knowledge of the world!
      </motion.p>
      <motion.div
        style={styles.buttonContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          style={styles.button}
          onClick={() => navigate('/game')}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7dd87d')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          Start Game
        </button>
        <button
          style={styles.button}
          onClick={() => navigate('/ranking')}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7dd87d')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          View Rankings
        </button>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    background: '#333',
    color: '#fff',
    minHeight: '100vh',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '40px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '30px',
  },
  button: {
    padding: '15px 30px',
    backgroundColor: '#fff',
    color: '#333',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'border-color 0.3s, background-color 0.3s',
    outline: 'none',
  },
};

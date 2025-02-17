// src/screens/HomeScreen.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

function Earth({ tilt = 0.41 }) {
  const texture = useLoader(
    TextureLoader,
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
  );
  return (
    <mesh rotation={[tilt, 1.3 * Math.PI, 0]}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={styles.container} className="home-container">
      {/* Mobile CSS Overrides */}
      <style>{`
        @media (max-width: 600px) {
          .home-container {
            height: 100vh !important;
            width: 100vw !important;
            overflow: hidden !important;
            padding: 0 !important;
            justify-content: space-evenly !important;
          }
          .title {
            font-size: 28px !important;
            margin-bottom: 5px !important;
          }
          .earth-container {
            max-width: 300px !important;
            margin: 5px auto !important;
          }
          .canvas-wrapper {
            padding-top: 100% !important;
          }
          .subtitle {
            font-size: 16px !important;
            margin-bottom: 5px !important;
          }
          .button-container {
            gap: 10px !important;
          }
          .button {
            padding: 8px 16px !important;
            font-size: 14px !important;
          }
        }
      `}</style>

      <motion.h1
        style={styles.title}
        className="title"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌍 World Countries: The Game 🌍
      </motion.h1>

      <motion.div
        style={styles.earthContainer}
        className="earth-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Responsive Canvas Container */}
        <div style={styles.canvasWrapper} className="canvas-wrapper">
          <Canvas dpr={window.devicePixelRatio} style={styles.canvas}>
            <ambientLight intensity={4.5} />
            <directionalLight position={[5, 5, 5]} intensity={2} />
            <Earth tilt={0.41} />
            <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
          </Canvas>
        </div>
      </motion.div>

      <motion.p
        style={styles.subtitle}
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Test your knowledge of the world!
      </motion.p>

      <motion.div
        style={styles.buttonContainer}
        className="button-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          style={styles.button}
          className="button"
          onClick={() => navigate('/game')}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7dd87d')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'transparent')
          }
        >
          Start Game
        </button>
        <button
          style={styles.button}
          className="button"
          onClick={() => navigate('/ranking')}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7dd87d')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'transparent')
          }
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
    position: 'fixed',      // Force container to fill the viewport
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly', // Evenly distribute vertical space
    textAlign: 'center',
    overflow: 'hidden',     // Hide any overflow (no scrolling)
    padding: '0px',
  },
  title: {
    fontSize: 'clamp(36px, 5vw, 64px)',
    marginBottom: '20px',
  },
  earthContainer: {
    margin: '20px auto',
    width: '100%',
    maxWidth: '500px',
  },
  canvasWrapper: {
    position: 'relative',
    width: '100%',
    paddingTop: '90%',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 'clamp(20px, 4vw, 24px)',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px',
    justifyContent: 'center',
  },
  button: {
    padding: '15px 30px',
    backgroundColor: '#fff',
    color: '#333',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(16px, 4vw, 18px)',
    transition: 'border-color 0.3s, background-color 0.3s',
    outline: 'none',
  },
};

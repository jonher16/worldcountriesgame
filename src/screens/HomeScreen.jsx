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
    <div style={styles.container}>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌍 World Countries: The Game 🌍
      </motion.h1>

      <motion.div
        style={styles.earthContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Canvas
          style={{
            display: 'block',
            margin: '0 auto',
            width: '500px',
            height: '450px',
          }}
          dpr={window.devicePixelRatio}
        >
          <ambientLight intensity={4.5} />
          <directionalLight position={[5, 5, 5]} intensity={2} />

          <Earth tilt={0.41} />

          <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
        </Canvas>
      </motion.div>

      <motion.p
        style={styles.subtitle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Test your knowledge of the world!
      </motion.p>

      <motion.div
        style={styles.buttonContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <button
          style={styles.button}
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
    minHeight: '97.5vh',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden',
    padding: '10px',
  },
  title: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  earthContainer: {
    margin: '20px auto',
  },
  subtitle: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
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
    fontSize: '18px',
    transition: 'border-color 0.3s, background-color 0.3s',
    outline: 'none',
  },
};

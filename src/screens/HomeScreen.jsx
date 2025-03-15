// src/screens/HomeScreen.js
/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';

// In Three.js/React Three Fiber, props like rotation, args, map are valid
// These are specific to the 3D rendering context and not standard React props
function Earth({ tilt = 0.41 }) {
  const texture = useLoader(
    TextureLoader,
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
  );
  return (
    <mesh rotation={[tilt, 1.3 * Math.PI, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

// Add PropTypes for the Earth component
Earth.propTypes = {
  tilt: PropTypes.number
};

export default function HomeScreen() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div style={styles.container} className="home-container">
      {/* Mobile CSS Overrides */}
      <style>{`
        @media (max-width: 768px) {
          .home-container {
            height: 100% !important;
            width: 100% !important;
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            overflow: hidden !important;
            padding: 20px 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          
          .title-section {
            flex: 0 0 auto;
            margin-top: 20px;
            width: 100%;
            display: flex;
            justify-content: center;
            text-align: center;
          }
          
          .earth-section {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            min-height: 250px;
            width: 100%;
          }
          
          .bottom-section {
            flex: 0 0 auto;
            margin-bottom: 20px;
            width: 100%;
          }
          
          .title {
            font-size: 26px !important;
            margin-bottom: 5px !important;
            padding: 0 10px !important;
            white-space: nowrap !important;
            display: inline-block !important;
            text-align: center !important;
          }
          
          .earth-container {
            width: 280px !important;
            height: 280px !important;
            position: relative !important;
            margin: 0 auto !important;
          }
          
          .canvas-wrapper {
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
          }
          
          .subtitle {
            font-size: 16px !important;
            margin: 10px 0 !important;
            color: #eee !important;
          }
          
          .button-container {
            gap: 15px !important;
            margin-top: 10px !important;
            width: 100% !important;
            padding: 0 20px !important;
            box-sizing: border-box !important;
          }
          
          .button {
            padding: 12px 20px !important;
            font-size: 16px !important;
            width: 100% !important;
            max-width: 200px !important;
            margin: 0 auto !important;
            background-color: #333 !important;
            color: white !important;
            border: 2px solid transparent !important;
            transition: all 0.2s ease !important;
          }
          
          .button:active {
            transform: scale(0.98) !important;
            background-color: #444 !important;
          }
        }
        
        /* Additional adjustment for very small devices */
        @media (max-height: 600px) and (max-width: 768px) {
          .earth-section {
            min-height: 180px;
          }
          
          .earth-container {
            width: 180px !important;
            height: 180px !important;
          }
          
          .title {
            font-size: 22px !important;
          }
          
          .button {
            padding: 8px 16px !important;
          }
        }
        
        /* Button hover effect to match game screen - toned down */
        .button:hover {
          border-color: #8A2BE2 !important;
        }
      `}</style>

      <div className="title-section" style={styles.titleSection}>
        <motion.h1
          style={styles.title}
          className="title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🌍 World Countries Game 🌍
        </motion.h1>
      </div>

      <div className="earth-section">
        <motion.div
          style={styles.earthContainer}
          className="earth-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Responsive Canvas Container */}
          <div style={styles.canvasWrapper} className="canvas-wrapper">
            <Canvas 
              dpr={window.devicePixelRatio} 
              style={styles.canvas}
              camera={{ position: [0, 0, 7], fov: 40 }}
            >
              <ambientLight intensity={4.5} />
              <directionalLight position={[5, 5, 5]} intensity={2} />
              <Earth tilt={0.41} />
              <OrbitControls 
                autoRotate 
                autoRotateSpeed={isMobile ? 3 : 2} 
                enableZoom={false}
                enablePan={false}
              />
            </Canvas>
          </div>
        </motion.div>
      </div>

      <div className="bottom-section">
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
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
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
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = 'transparent')
            }
          >
            View Rankings
          </button>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#1a1a1a', // Darker background to match game screen
    color: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Changed from space-between to center for better desktop layout
    textAlign: 'center',
    overflow: 'hidden',
    padding: '30px 0',
    boxSizing: 'border-box',
  },
  titleSection: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px', // Added marginBottom to move title closer to the globe
  },
  title: {
    fontSize: 'clamp(26px, 4vw, 42px)',
    fontWeight: 'bold',
    display: 'inline-block',
    textAlign: 'center',
    marginBottom: '10px', // Reduced from 15px
  },
  earthContainer: {
    width: '360px',
    height: '360px',
    position: 'relative',
    margin: '0 auto',
    marginTop: '10px', // Added marginTop to move globe up
    marginBottom: '10px', // Added marginBottom to move globe up
    borderRadius: '50%',
  },
  canvasWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 'clamp(18px, 3vw, 24px)',
    marginBottom: '20px', // Reduced from 25px
    marginTop: '10px', // Added marginTop
    color: '#eee',
    fontWeight: '300',
  },
  buttonContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '5px', // Added marginTop to move buttons up
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#333', // Match game button color
    color: 'white',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(16px, 2vw, 18px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
};

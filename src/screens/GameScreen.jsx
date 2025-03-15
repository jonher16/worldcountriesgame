// src/screens/GameScreen.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import CountryMap from '../components/CountryMap';
import Timer from '../components/Timer';
import Progress from '../components/Progress';
import countryData from '../assets/updated_grouped_country_paths.json';
import validateCountry from '../utils/validateCountry';

export default function GameScreen() {
  const [input, setInput] = useState('');
  const [matchedCountries, setMatchedCountries] = useState([]);
  const [timeLeft, setTimeLeft] = useState(720);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCountryList, setShowCountryList] = useState(false);
  const [showMissingMarkers, setShowMissingMarkers] = useState(false); // Toggle for missing country markers
  const [flashColor, setFlashColor] = useState(null); // 'green' or 'red'
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const totalCountries = countryData.length;
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Detect mobile device
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

  // Detect keyboard visibility on mobile
  useEffect(() => {
    if (!isMobile) return;

    const detectKeyboard = () => {
      // A significant height change can indicate keyboard appearance
      const isKeyboardVisible = window.innerHeight < window.outerHeight * 0.75;
      setKeyboardVisible(isKeyboardVisible);
    };

    window.addEventListener('resize', detectKeyboard);
    return () => window.removeEventListener('resize', detectKeyboard);
  }, [isMobile]);

  // Auto-focus on input when the component mounts (only on desktop)
  useEffect(() => {
    if (!isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  // Clear flash effect after 500ms
  useEffect(() => {
    if (flashColor) {
      const timer = setTimeout(() => {
        setFlashColor(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [flashColor]);

  const handleCountrySubmit = () => {
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;

    const countryClassName = validateCountry(trimmedInput);

    if (countryClassName && !matchedCountries.includes(countryClassName)) {
      setMatchedCountries([...matchedCountries, countryClassName]);
      setFlashColor('green'); // Correct submission: flash neon green
    } else {
      setFlashColor('red'); // Wrong or duplicate submission: flash neon red
    }
    setInput('');
  };

  const handleEndGameClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmQuit = () => {
    setShowConfirmation(false);
    navigate('/stats', {
      state: {
        score: matchedCountries.length,
        missed: totalCountries - matchedCountries.length,
        timeTaken: 720 - timeLeft,
        matchedCountries: matchedCountries,
      },
    });
  };

  const handleCancelQuit = () => {
    setShowConfirmation(false);
  };

  const renderMissingMarkers = () => {
    const missingCountries = countryData.filter(
      (country) => !matchedCountries.includes(country.class)
    );

    return (
      <>
        {missingCountries.map((country) => (
          <circle
            key={country.class}
            cx={country.center.x}
            cy={country.center.y}
            r={5} // Radius of the red dot
            fill="red"
          />
        ))}
      </>
    );
  };

  const toggleCountryList = () => {
    setShowCountryList(!showCountryList);
  };

  const toggleMissingMarkers = () => {
    setShowMissingMarkers(!showMissingMarkers);
  };

  useEffect(() => {
    if (timeLeft === 0 || matchedCountries.length === totalCountries) {
      navigate('/stats', {
        state: {
          score: matchedCountries.length,
          missed: totalCountries - matchedCountries.length,
          timeTaken: 720 - timeLeft,
          matchedCountries: matchedCountries,
        },
      });
    }
  }, [timeLeft, matchedCountries, totalCountries, navigate]);

  const renderCountryList = () => {
    const sortedCountries = countryData
      .map((country) => country.class)
      .sort();

    return (
      <motion.div 
        style={styles.countryListOverlay} 
        className="country-list-overlay"
        initial={{ opacity: 0, x: '-100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <div style={styles.countryListHeader}>
          <h3>Country List</h3>
          <button 
            style={styles.closeButton} 
            onClick={toggleCountryList}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#444')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#333')}
          >
            Close
          </button>
        </div>
        <ul style={styles.countryList}>
          {sortedCountries.map((countryName) => (
            <li key={countryName} style={{
              ...styles.countryItem,
              color: matchedCountries.includes(countryName) ? '#8cff8c' : '#ccc',
              fontWeight: matchedCountries.includes(countryName) ? '600' : '400'
            }}>
              {matchedCountries.includes(countryName) ? countryName : '_____' }
            </li>
          ))}
        </ul>
      </motion.div>
    );
  };

  // Render different layouts for mobile and desktop
  // src/screens/GameScreen.jsx (mobile section only)

// Mobile section of GameScreen.jsx

if (isMobile) {
  return (
    <div className="mobile-game-wrapper">
      <style>{`
        /* Reset and base styles */
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: fixed;
          font-family: Arial, sans-serif;
        }
        
        .mobile-game-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #1a1a1a;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        /* Top section with controls */
        .mobile-top-controls {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          background-color: #222;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
          border-bottom: 1px solid #444;
        }
        
        .mobile-buttons-row {
          display: flex;
          justify-content: space-between;
          padding: 8px;
        }
        
        .mobile-button {
          padding: 8px 12px;
          font-size: 14px;
          background-color: #333;
          color: white;
          border: 2px solid transparent;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          font-weight: bold;
        }
        
        .mobile-button:active {
          transform: scale(0.98);
          background-color: #444;
          border-color: #8A2BE2;
        }
        
        .mobile-timer-row {
          text-align: center;
          padding: 4px;
          background-color: #2a2a2a;
          color: white;
          border-top: 1px solid #333;
          border-bottom: 1px solid #333;
        }
        
        .mobile-timer-row p {
          margin: 4px 0;
          font-size: 18px !important;
          font-weight: bold;
        }
        
        /* Bottom fixed input that stays in position regardless of keyboard */
        .mobile-input-container {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 12px;
          background-color: rgba(34, 34, 34, 0.95);
          border-top: 1px solid #444;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
          z-index: 50;
          transition: transform 0.3s ease-out;
        }
        
        /* Map container positioned between top controls and bottom input */
        .mobile-map-container {
          position: absolute;
          top: 80px; /* Adjust based on your controls height */
          left: 0;
          right: 0;
          bottom: 60px; /* Adjust based on input height + padding */
          overflow: hidden;
          z-index: 5;
        }
                
        /* Overlays and modals */
        .mobile-country-list {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(26, 26, 26, 0.97);
          z-index: 900;
          overflow: auto;
          padding: 20px;
          -webkit-overflow-scrolling: touch;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        .mobile-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .mobile-modal-content {
          background-color: #222;
          padding: 25px;
          border-radius: 12px;
          width: 85%;
          max-width: 320px;
          text-align: center;
          color: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          border: 1px solid #444;
        }

        .mobile-modal-content p {
          color: #fff;
          font-weight: 400;
          margin-bottom: 20px;
          font-size: 16px;
        }
        
        .mobile-modal-button {
          padding: 12px 24px;
          margin: 8px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0,0,0,0.4);
          transition: all 0.2s ease;
          font-size: 16px;
        }
        
        .mobile-modal-button:active {
          transform: scale(0.98);
        }
        
        .mobile-input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 2px solid #444;
          border-radius: 8px;
          background-color: #2a2a2a;
          color: white;
          box-sizing: border-box;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2) inset;
        }
        
        .mobile-input::placeholder {
          color: #999;
        }
        
        /* Adjust for taller devices to maximize map space */
        @media screen and (min-height: 700px) {
          .mobile-map-container {
            bottom: 70px;
          }
        }
        
        /* Flash animation for correct/incorrect answers */
        @keyframes ledFlash {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.0); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        
        /* List header styling */
        .mobile-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          margin-bottom: 15px;
          border-bottom: 1px solid #444;
        }
        
        .mobile-list-header h3 {
          margin: 0;
          font-size: 20px;
        }
        
        /* Animation for country list items */
        .country-item {
          transition: background-color 0.2s;
        }
        
        .found-country {
          color: #8cff8c !important;
          font-weight: 600;
        }
      `}</style>

      {/* Flash effect */}
      {flashColor && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            border: `3px solid ${flashColor === 'green' ? '#39FF14' : '#FF3131'}`,
            borderRadius: '8px',
            boxShadow: `0 0 20px 10px ${flashColor === 'green' ? '#39FF14' : '#FF3131'}`,
            pointerEvents: 'none',
            opacity: 0,
            animation: 'ledFlash 2s forwards',
            zIndex: 9999,
          }}
        />
      )}
      
      {/* Top controls section */}
      <div className="mobile-top-controls">
        <div className="mobile-buttons-row">
          <button 
            className="mobile-button" 
            onClick={handleEndGameClick}
          >
            End Game
          </button>
          <button 
            className="mobile-button" 
            onClick={toggleMissingMarkers}
          >
            {showMissingMarkers ? 'Hide Missing' : 'Show Missing'}
          </button>
          <button 
            className="mobile-button" 
            onClick={toggleCountryList}
          >
            Country List
          </button>
        </div>
        
        <div className="mobile-timer-row">
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
          <Progress total={totalCountries} matched={matchedCountries.length} />
        </div>
      </div>
      
      {/* Map container */}
      <div className="mobile-map-container">
        <CountryMap matchedCountries={matchedCountries}>
          {showMissingMarkers && renderMissingMarkers()}
        </CountryMap>
      </div>
      
      {/* Fixed floating input at bottom that isn't affected by keyboard */}
      <div 
        className="mobile-input-container"
        style={{
          transform: keyboardVisible ? 'translateY(-10px)' : 'translateY(0)',
        }}
      >
        <input
          ref={inputRef}
          className="mobile-input"
          placeholder="Enter a country name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
          onFocus={() => {
            // On iOS, scroll the page a bit to ensure the input is visible
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 100);
          }}
        />
      </div>
      
      {/* Country list overlay */}
      {showCountryList && (
        <div className="mobile-country-list">
          <div className="mobile-list-header">
            <h3 style={{color: 'white', marginTop: '5px'}}>Country List</h3>
            <button 
              className="mobile-button" 
              style={{position: 'absolute', top: '10px', right: '10px'}}
              onClick={toggleCountryList}
            >
              Close
            </button>
          </div>
          <ul style={{color: '#ccc', listStyle: 'none', padding: 0, maxHeight: '80vh', overflowY: 'auto'}}>
            {countryData
              .map((country) => country.class)
              .sort()
              .map((countryName) => (
                <li 
                  key={countryName} 
                  style={{
                    padding: '8px 5px', 
                    borderBottom: '1px solid #444',
                    transition: 'background-color 0.2s'
                  }}
                  className={matchedCountries.includes(countryName) ? 'found-country' : 'country-item'}
                >
                  {matchedCountries.includes(countryName) ? countryName : '_____' }
                </li>
              ))}
          </ul>
        </div>
      )}
      
      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="mobile-modal">
          <div className="mobile-modal-content">
            <p>Are you sure you want to quit? Your game will not be saved.</p>
            <button 
              className="mobile-modal-button" 
              style={{backgroundColor: '#ff4d4f', color: 'white'}}
              onClick={handleConfirmQuit}
            >
              Yes, Quit
            </button>
            <button 
              className="mobile-modal-button" 
              style={{backgroundColor: '#333', color: 'white'}}
              onClick={handleCancelQuit}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

  // Desktop layout with enhanced UI
  return (
    <div style={styles.gameWrapper}>
      {/* Flash overlay styles */}
      <style>{`
        .flash-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          border: 3px solid var(--flash-color);
          border-radius: 0;
          box-shadow: 0 0 20px 10px var(--flash-color);
          pointer-events: none;
          opacity: 0;
          animation: ledFlash 2s forwards;
          z-index: 9999;
        }
        @keyframes ledFlash {
          0% { opacity: 0; transform: scale(0.98); }
          50% { opacity: 1; transform: scale(1.0); }
          100% { opacity: 0; transform: scale(1.01); }
        }
        
        .game-stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          width: 100%;
        }
        
        .button-hover-effect:hover {
          border-color: #8A2BE2 !important;
          transform: translateY(-2px);
        }
        
        .input-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .game-input {
          width: 100%;
          padding: 14px 15px;
          font-size: 18px;
          border: 2px solid #444;
          border-radius: 8px;
          background-color: #2a2a2a;
          color: white;
          transition: border-color 0.3s, box-shadow 0.3s;
          outline: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .game-input:focus {
          border-color: #8A2BE2;
          box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.25);
        }
        
        .game-input::placeholder {
          color: #999;
        }

        /* Custom scrollbar for country list */
        .country-list::-webkit-scrollbar {
          width: 8px;
        }
        
        .country-list::-webkit-scrollbar-track {
          background: #222;
        }
        
        .country-list::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }
        
        .country-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      {flashColor && (
        <div
          className="flash-overlay"
          style={{
            '--flash-color': flashColor === 'green' ? '#39FF14' : '#FF3131',
          }}
        />
      )}

      {/* Main game container */}
      <div style={styles.container} className="container">
        <div style={styles.headerBar}>
          <h1 style={styles.gameTitle}>
            <span style={styles.globeIcon}>🌍</span> World Countries Game
          </h1>
          <div style={styles.headerButtons}>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#8A2BE2' }}
              whileTap={{ scale: 0.98 }}
              style={styles.toggleListButton}
              onClick={toggleCountryList}
              className="button-hover-effect"
            >
              Country List
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#8A2BE2' }}
              whileTap={{ scale: 0.98 }}
              style={styles.showMissingButton}
              onClick={toggleMissingMarkers}
              className="button-hover-effect"
            >
              {showMissingMarkers ? 'Hide Missing' : 'Show Missing'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#8A2BE2' }}
              whileTap={{ scale: 0.98 }}
              style={styles.endGameButton}
              onClick={handleEndGameClick}
              className="button-hover-effect"
            >
              End Game
            </motion.button>
          </div>
        </div>

        <div style={styles.statsBar} className="game-stats">
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
          <Progress total={totalCountries} matched={matchedCountries.length} />
        </div>
        
        <div style={styles.mapContainer}>
          <CountryMap matchedCountries={matchedCountries}>
            {showMissingMarkers && renderMissingMarkers()}
          </CountryMap>
        </div>

        {/* Input container */}
        <div style={styles.inputSection}>
          <div className="input-container">
            <input
              ref={inputRef}
              className="game-input"
              placeholder="Enter a country name..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
            />
          </div>
        </div>

        {showCountryList && renderCountryList()}

        {showConfirmation && (
          <motion.div 
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              style={styles.modal}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <h3 style={{ marginTop: 0 }}>End Game</h3>
              <p>Are you sure you want to quit? Your game will not be saved.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={styles.confirmButton} 
                  onClick={handleConfirmQuit}
                >
                  Yes, Quit
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={styles.cancelButton} 
                  onClick={handleCancelQuit}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Enhanced styles for desktop
const styles = {
  gameWrapper: {
    backgroundColor: '#1a1a1a', 
    color: '#fff',
    minHeight: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    fontFamily: 'Arial, sans-serif',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#111',
    borderBottom: '1px solid #333',
    boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
    zIndex: 100,
    height: '70px',
  },
  gameTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
  },
  globeIcon: {
    marginRight: '10px',
    fontSize: '28px',
  },
  headerButtons: {
    display: 'flex',
    gap: '12px',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 0',
    backgroundColor: '#222',
    borderTop: '1px solid #333',
    borderBottom: '1px solid #333',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    zIndex: 90,
  },
  inputSection: {
    padding: '15px 20px',
    backgroundColor: '#1a1a1a',
    borderTop: '1px solid #333',
    zIndex: 95,
  },
  endGameButton: {
    padding: '10px 16px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  },
  showMissingButton: {
    padding: '10px 16px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  },
  toggleListButton: {
    padding: '10px 16px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  },
  countryListOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '350px',
    height: '100%',
    backgroundColor: 'rgba(17, 17, 17, 0.98)',
    color: '#fff',
    padding: '20px',
    overflowY: 'auto',
    zIndex: 9998,
    boxShadow: '5px 0 15px rgba(0,0,0,0.5)',
    borderRight: '1px solid #444',
  },
  countryListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #444',
  },
  closeButton: {
    padding: '6px 12px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  countryList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
  },
  countryItem: {
    padding: '8px 5px',
    margin: '0',
    fontSize: '16px',
    borderBottom: '1px solid #333',
    transition: 'background-color 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#222',
    padding: '25px',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 5px 25px rgba(0, 0, 0, 0.5)',
    border: '1px solid #444',
  },
  confirmButton: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    padding: '12px 22px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    transition: 'all 0.2s ease',
  },
  cancelButton: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '12px 22px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    transition: 'all 0.2s ease',
  },
};
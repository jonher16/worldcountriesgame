// src/screens/GameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [showMissingMarkers, setShowMissingMarkers] = useState(false); // Toggle for missing markers
  const [flashColor, setFlashColor] = useState(null); // 'green' or 'red'

  const totalCountries = countryData.length;
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Auto-focus on input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clear flash effect after 500ms
  useEffect(() => {
    if (flashColor) {
      const timer = setTimeout(() => setFlashColor(null), 500);
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
    navigate('/stats');
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

  const toggleCountryList = () => setShowCountryList(!showCountryList);
  const toggleMissingMarkers = () => setShowMissingMarkers(!showMissingMarkers);

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
    const sortedCountries = countryData.map((c) => c.class).sort();
    return (
      <div style={styles.countryListOverlay} className="country-list-overlay">
        <h3>Country List</h3>
        <ul style={styles.countryList}>
          {sortedCountries.map((countryName) => (
            <li key={countryName} style={styles.countryItem}>
              {matchedCountries.includes(countryName) ? countryName : '_____'}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Flash overlay */}
      <style>{`
        .flash-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          border: 3px solid var(--flash-color);
          border-radius: 8px;
          box-shadow: 0 0 20px 10px var(--flash-color);
          pointer-events: none;
          opacity: 0;
          animation: ledFlash 2s forwards;
          z-index: 9999;
        }
        @keyframes ledFlash {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.0); }
          100% { opacity: 0; transform: scale(1.05); }
        }
        
        /* MOBILE OVERRIDES */
        @media (max-width: 600px) {
          .game-screen-container {
            /* Ensure the overall container stays fixed */
            height: 100vh !important;
            width: 100vw !important;
            overflow: hidden !important;
          }
          .input-box {
            /* Force the input to remain visible at the bottom */
            width: 90% !important;
            margin-top: 5px !important;
            font-size: 14px !important;
          }
          /* You can adjust further as needed */
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

      {/* Fixed Control Buttons */}
      <button
        style={styles.endGameButton}
        className="game-button"
        onClick={handleEndGameClick}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'transparent')
        }
      >
        End Game
      </button>
      <button
        style={styles.toggleListButton}
        className="game-button"
        onClick={toggleCountryList}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'transparent')
        }
      >
        Toggle Country List
      </button>
      <button
        style={styles.showMissingButton}
        className="game-button"
        onClick={toggleMissingMarkers}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'transparent')
        }
      >
        Toggle Missing Countries
      </button>

      {/* Main Game Screen Layout */}
      <div style={styles.containerInner} className="game-screen-container">
        {/* Top Section: Timer and Map */}
        <div style={styles.topSection}>
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
          <div style={styles.mapContainer}>
            <CountryMap matchedCountries={matchedCountries}>
              {showMissingMarkers && renderMissingMarkers()}
            </CountryMap>
          </div>
        </div>
        {/* Bottom Section: Progress and Input */}
        <div style={styles.bottomSection}>
          <div style={styles.progressContainer}>
            <Progress total={totalCountries} matched={matchedCountries.length} />
          </div>
          <div style={styles.inputContainer}>
            <input
              ref={inputRef}
              className="input-box"
              style={styles.input}
              placeholder="Enter a country"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
            />
          </div>
        </div>
      </div>

      {showCountryList && renderCountryList()}

      {showConfirmation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p>Are you sure you want to quit? Your game will not be saved.</p>
            <button style={styles.confirmButton} onClick={handleConfirmQuit}>
              Yes, Quit
            </button>
            <button style={styles.cancelButton} onClick={handleCancelQuit}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed', // Occupies entire viewport
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#242424',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  // Inner container divides the screen into top and bottom sections.
  containerInner: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  topSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
    margin: '10px 0',
  },
  bottomSection: {
    flex: '0 0 25%', // Reserve 25% of viewport height for progress and input
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  },
  progressContainer: {
    width: '100%',
    maxWidth: '500px',
    marginBottom: '5px',
  },
  inputContainer: {
    width: '100%',
    maxWidth: '500px',
  },
  input: {
    border: '1px solid #333',
    padding: '10px',
    fontSize: '16px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  // Fixed control buttons
  endGameButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'border-color 0.3s, background-color 0.3s',
    outline: 'none',
    zIndex: 9999,
  },
  toggleListButton: {
    position: 'fixed',
    top: '120px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'border-color 0.3s, background-color 0.3s',
    zIndex: 9999,
  },
  showMissingButton: {
    position: 'fixed',
    top: '70px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'border-color 0.3s, background-color 0.3s',
    zIndex: 9999,
  },
  // Country list overlay and modal (unchanged)
  countryListOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '300px',
    height: '100%',
    backgroundColor: 'rgba(36, 36, 36, 0.9)',
    color: '#fff',
    padding: '20px',
    overflowY: 'auto',
    zIndex: 1000,
  },
  countryList: {
    listStyleType: 'none',
    padding: 0,
  },
  countryItem: {
    margin: '5px 0',
    fontSize: '16px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '300px',
    textAlign: 'center',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  cancelButton: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 20px',
    margin: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

// src/screens/GameScreen.jsx
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
  const [showMissingMarkers, setShowMissingMarkers] = useState(false); // Toggle for missing country markers
  const [flashColor, setFlashColor] = useState(null); // 'green' or 'red'

  const totalCountries = countryData.length;
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Auto-focus on input when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      <div style={styles.countryListOverlay} className="country-list-overlay">
        <h3>Country List</h3>
        <ul style={styles.countryList}>
          {sortedCountries.map((countryName) => (
            <li key={countryName} style={styles.countryItem}>
              {matchedCountries.includes(countryName) ? countryName : '_____' }
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      {/* Flash overlay styles */}
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
        
        /* Mobile optimization that preserves desktop experience */
        @media (max-width: 768px) {
          /* Entire container spans full height */
          .game-container {
            display: flex;
            flex-direction: column;
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            padding: 10px !important;
            position: fixed !important;
            width: 100vw !important;
            top: 0;
            left: 0;
          }
          
          /* Sticky input area at bottom */
          .game-input-container {
            position: sticky !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 100% !important;
            background: rgba(51, 51, 51, 0.9) !important;
            padding: 10px !important;
            z-index: 100 !important;
            margin-top: auto !important;
          }
          
          /* Buttons positioning */
          .action-buttons {
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            z-index: 10 !important;
          }
          
          .action-buttons button {
            padding: 8px !important;
            font-size: 14px !important;
            white-space: nowrap !important;
          }
          
          /* Make sure map container fills available space */
          .map-container {
            flex: 1 !important;
            min-height: 60vh !important;
            overflow: hidden !important;
            margin-bottom: 60px !important; /* Space for the input */
          }
          
          /* Make country list more mobile-friendly */
          .country-list-overlay {
            width: 100% !important; 
            height: 80% !important;
            z-index: 1001 !important;
          }
          
          /* Game status (timer/progress) */
          .game-status {
            padding: 5px !important;
            margin-top: 10px !important;
            margin-bottom: 5px !important;
            z-index: 5 !important;
          }
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

      {/* Main game container - using original structure but with classes for mobile targeting */}
      <div style={styles.container} className="game-container">
        {/* Action buttons - same layout but with class for mobile positioning */}
        <div className="action-buttons">
          <button
            style={styles.endGameButton}
            onClick={handleEndGameClick}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            End Game
          </button>
          <button
            style={styles.showMissingButton} 
            onClick={toggleMissingMarkers}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            Toggle Missing
          </button>
          <button
            style={styles.toggleListButton}
            onClick={toggleCountryList}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            Toggle List
          </button>
        </div>

        {/* Game status area - timer and progress */}
        <div className="game-status">
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
          <Progress total={totalCountries} matched={matchedCountries.length} />
        </div>
        
        {/* Map container */}
        <div className="map-container">
          <CountryMap matchedCountries={matchedCountries}>
            {showMissingMarkers && renderMissingMarkers()}
          </CountryMap>
        </div>

        {/* Wrap the input in a container that is fixed on mobile */}
        <div className="game-input-container">
          <input
            ref={inputRef}
            style={styles.input}
            placeholder="Enter a country"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
          />
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
    </div>
  );
}

// Keep the original styles completely intact!
const styles = {
  container: {
    padding: '20px',
    position: 'relative',
    // Ensure your container takes up the navigator's full space:
    minHeight: '100vh',
    boxSizing: 'border-box',
  },
  input: {
    border: '1px solid #333',
    padding: '10px',
    fontSize: '16px',
    textAlign: 'center',
    width: '100%',
  },
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
    zIndex: '9999',
  },
  showMissingButton: {
    position: 'fixed',
    top: '90px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'border-color 0.3s, background-color 0.3s',
    zIndex: '9999',
  },
  toggleListButton: {
    position: 'fixed',
    top: '140px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'border-color 0.3s, background-color 0.3s',
    zIndex: '9999',
  },
  countryListOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: 'rgba(36, 36, 36, 0.9)',
    color: '#fff',
    padding: '20px',
    overflowY: 'auto',
    zIndex: 9998,
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
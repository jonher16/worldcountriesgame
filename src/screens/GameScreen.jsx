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
      <div className="country-list-overlay" style={styles.countryListOverlay}>
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
        
        /* MOBILE OVERRIDES */
        @media (max-width: 600px) {
          /* Make fixed buttons smaller and with higher contrast */
          .game-button {
            padding: 5px 10px !important;
            font-size: 12px !important;
          }
          /* Reposition input to be just below the map */
          .input-style {
            margin: 10px 0 !important;
            /* On mobile the input container is moved above the progress */
          }
          /* Country list overlay reduced in width */
          .country-list-overlay {
            width: 100% !important;
          }
          /* Reorder the game content on mobile:
             Timer (order 1), CountryMap (order 2), input (order 3), Progress (order 4) */
          .game-content {
            display: flex;
            flex-direction: column;
          }
          .game-content .progress-container {
            order: 4;
          }
          .game-content .input-container {
            order: 3;
          }
          /* Timer and map remain in DOM order */
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
      <div style={styles.container}>
        {/* Fixed Control Buttons */}
        <button
          className="game-button"
          style={styles.endGameButton}
          onClick={handleEndGameClick}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = '#8A2BE2')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'transparent')
          }
        >
          End Game
        </button>
        <button
          className="game-button"
          style={styles.toggleListButton}
          onClick={toggleCountryList}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = '#8A2BE2')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'transparent')
          }
        >
          Toggle Country List
        </button>
        <button
          className="game-button"
          style={styles.showMissingButton}
          onClick={toggleMissingMarkers}
          onMouseEnter={(e) =>
            (e.currentTarget.style.borderColor = '#8A2BE2')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.borderColor = 'transparent')
          }
        >
          Toggle Missing Countries
        </button>

        {/* Wrap the main game elements in a flex container */}
        <div className="game-content" style={styles.gameContent}>
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
          <CountryMap matchedCountries={matchedCountries}>
            {showMissingMarkers && renderMissingMarkers()}
          </CountryMap>

          {/* Wrap Progress and Input in separate containers so we can re-order on mobile */}
          <div className="progress-container" style={styles.progressContainer}>
            <Progress total={totalCountries} matched={matchedCountries.length} />
          </div>
          <div className="input-container" style={styles.inputContainer}>
            <input
              ref={inputRef}
              className="input-style"
              style={styles.input}
              placeholder="Enter a country"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
            />
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
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    position: 'relative',
    minHeight: '100vh',
    boxSizing: 'border-box',
    background: '#242424',
  },
  // Wrap game elements so we can re-order them on mobile
  gameContent: {
    display: 'block', // Desktop: normal block flow; mobile media query will set flex
  },
  progressContainer: {
    // By default, follow DOM order (Progress then Input)
  },
  inputContainer: {
    // By default, input comes after progress
  },
  input: {
    border: '1px solid #333',
    padding: '10px',
    fontSize: '16px',
    margin: '20px 0',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
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

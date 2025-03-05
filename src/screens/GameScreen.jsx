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
  const [isMobile, setIsMobile] = useState(false);

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
          overflow: hidden;
        }
        
        .mobile-game-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #333;
          overflow: hidden;
        }
        
        /* Top section with controls */
        .mobile-top-controls {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          background-color: #222;
        }
        
        .mobile-buttons-row {
          display: flex;
          justify-content: space-between;
          padding: 5px;
        }
        
        .mobile-button {
          padding: 5px 8px;
          font-size: 12px;
          background-color: #444;
          color: white;
          border: none;
          border-radius: 5px;
        }
        
        .mobile-timer-row {
          text-align: center;
          padding: 2px;
          background-color: #333;
          color: white;
        }
        
        .mobile-timer-row p {
          margin: 2px 0;
          font-size: 16px !important;
        }
        
        /* Bottom fixed input that truly floats */
        .mobile-input-container {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 10px;
          background-color: rgba(51, 51, 51, 0.95);
          border-top: 1px solid #555;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
          z-index: 50;
        }
        
        .mobile-input {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          box-sizing: border-box;
        }
        
        /* Map container positioned between top controls and bottom input */
        .mobile-map-container {
          position: absolute;
          top: 75px; /* Adjust based on your controls height */
          left: 0;
          right: 0;
          bottom: 60px; /* Adjust based on input height + padding */
          overflow: hidden;
        }
        
        /* Handle keyboard appearance */
        @media screen and (max-height: 450px) {
          .mobile-map-container {
            bottom: 55px; /* Slightly reduce when keyboard appears */
          }
        }
        
        /* Overlays and modals */
        .mobile-country-list {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.9);
          z-index: 900;
          overflow: auto;
          padding: 20px;
        }
        
        .mobile-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .mobile-modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          width: 80%;
          max-width: 300px;
          text-align: center;
          color: #333; /* Add this line to set text color */

        }

        .mobile-modal-content p {
          color: #333;
          font-weight: 500;
          margin-bottom: 15px;
        }
        
        .mobile-modal-button {
          padding: 10px 20px;
          margin: 5px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
        }
        
        /* Flash animation for correct/incorrect answers */
        @keyframes ledFlash {
          0% { opacity: 0; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.0); }
          100% { opacity: 0; transform: scale(1.05); }
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
            Toggle Missing
          </button>
          <button 
            className="mobile-button" 
            onClick={toggleCountryList}
          >
            Toggle List
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
      
      {/* Fixed floating input at bottom */}
      <div className="mobile-input-container">
        <input
          ref={inputRef}
          className="mobile-input"
          placeholder="Enter a country"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
        />
      </div>
      
      {/* Country list overlay */}
      {showCountryList && (
        <div className="mobile-country-list">
          <h3 style={{color: 'white'}}>Country List</h3>
          <button 
            className="mobile-button" 
            style={{position: 'absolute', top: '10px', right: '10px'}}
            onClick={toggleCountryList}
          >
            Close
          </button>
          <ul style={{color: 'white', listStyle: 'none', padding: 0}}>
            {countryData
              .map((country) => country.class)
              .sort()
              .map((countryName) => (
                <li key={countryName} style={{padding: '5px 0', borderBottom: '1px solid #444'}}>
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

  // Desktop layout - original unchanged code
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
        <button
          style={styles.endGameButton}
          onClick={handleEndGameClick}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          End Game
        </button>
        <button
          style={styles.toggleListButton}
          onClick={toggleCountryList}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          Toggle List
        </button>
        <button  
          style={styles.showMissingButton} 
          onClick={toggleMissingMarkers}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          Toggle Missing
        </button>

        <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
        <CountryMap matchedCountries={matchedCountries}>
          {showMissingMarkers && renderMissingMarkers()}
        </CountryMap>
        <Progress total={totalCountries} matched={matchedCountries.length} />

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

// Original styles for desktop
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
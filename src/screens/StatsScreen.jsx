// src/screens/StatsScreen.js
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import countryData from '../assets/updated_grouped_country_paths.json';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function StatsScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { score, missed, timeTaken, matchedCountries } = state || {};
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // To track if the score has been saved

  // Calculate total countries
  const totalCountries = countryData.length;

  // Derive correct and missed countries based on matchedCountries passed via state
  const matched = matchedCountries || [];
  const matchedCountryObjects = countryData.filter((country) =>
    matched.includes(country.class)
  );
  const missedCountryObjects = countryData.filter(
    (country) => !matched.includes(country.class)
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'scores'), {
        name: playerName,
        score: score,
        missed: missed,
        timeTaken: timeTaken,
        date: new Date(),
        matchedCountries: matchedCountries, // Include matchedCountries
      });
      setSubmissionStatus('success');
      setIsSaved(true); // Disable the submit button
    } catch (error) {
      console.error('Error adding document: ', error);
      setSubmissionStatus('error');
    }
    setIsSubmitting(false);
  };

  // Handle redirection after submission status
  useEffect(() => {
    let timer;
    if (submissionStatus === 'success') {
      // Redirect to main screen after 3 seconds
      timer = setTimeout(() => {
        navigate('/'); // Adjust the path to your main screen
      }, 3000);
    }
    return () => clearTimeout(timer); // Cleanup the timer
  }, [submissionStatus, navigate]);

  return (
    <>
      {/* CSS for responsive design and consistent scrolling */}
      <style>
        {`
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: fixed;
          width: 100%;
          overscroll-behavior: none;
        }
        
        #root {
          height: 100%;
          width: 100%;
          position: fixed;
          overflow: hidden;
        }
        
        .stats-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #1a1a1a;
          color: #fff;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: -ms-autohiding-scrollbar;
          overscroll-behavior-y: contain;
          touch-action: pan-y;
        }
        
        .stats-content {
          padding: 20px;
          padding-top: 80px;
          padding-bottom: 60px;
          -webkit-tap-highlight-color: transparent;
        }
        
        .home-button {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          padding: 12px 25px;
          font-size: 16px;
          background-color: #333;
          color: #fff;
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        `}
      </style>

      {/* Home button - outside scrollable area */}
      <button 
        className="home-button"
        onClick={() => navigate('/')}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#e6c200'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
      >
        Home
      </button>
      
      {/* Main scrollable container */}
      <div className="stats-container">
        <div className="stats-content">
          {/* Global styles for the stats screen */}
          <style>{`
            body, html {
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
              background-color: #1a1a1a;
              color: #fff;
              font-family: Arial, sans-serif;
            }
            
            * {
              box-sizing: border-box;
            }
            
            /* Remove the scrolling properties from nested containers */
            .countriesGrid {
              overflow: visible !important;
              max-height: none !important;
            }
            
            /* Custom scrollbar for country lists */
            .countries-grid::-webkit-scrollbar,
            .country-list-container::-webkit-scrollbar {
              width: 8px;
            }
            
            .countries-grid::-webkit-scrollbar-track,
            .country-list-container::-webkit-scrollbar-track {
              background: #222;
              border-radius: 4px;
            }
            
            .countries-grid::-webkit-scrollbar-thumb,
            .country-list-container::-webkit-scrollbar-thumb {
              background: #444;
              border-radius: 4px;
            }
            
            .countries-grid::-webkit-scrollbar-thumb:hover,
            .country-list-container::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
            
            /* Animation for country items */
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .country-item, .country-item-missed {
              animation: fadeIn 0.3s ease-out forwards;
              animation-delay: calc(var(--index) * 0.03s);
              opacity: 0;
            }
            
            /* Input focus effect */
            .stats-input:focus {
              border-color: #8A2BE2;
              box-shadow: 0 0 0 3px rgba(138, 43, 226, 0.25);
            }
            
            /* Submit button hover effect */
            .submit-button:not(:disabled):hover {
              border-color: #8A2BE2;
              transform: translateY(-2px);
            }
            
            .saveScoreForm {
              width: 100%;
            }
            
            .formContent {
              width: 100%;
            }
            
            .statsInput {
              box-sizing: border-box;
              width: 100%;
              max-width: 100%;
            }
            
            /* Mobile styles */
            @media (max-width: 768px) {
              .stats-content {
                padding: 15px !important;
                padding-top: 70px !important;
                padding-bottom: 40px !important;
              }
              
              .header-title {
                font-size: 24px !important;
              }
              
              .stats-grid {
                flex-direction: column !important;
                gap: 15px !important;
                padding: 15px !important;
              }
              
              .stat-item {
                width: 100% !important;
                max-width: 100% !important;
                padding: 12px !important;
              }
              
              .country-list-container {
                padding: 15px !important;
                margin: 15px 0 !important;
                max-height: none !important;
                overflow: visible !important;
              }
              
              .countries-grid {
                gap: 8px !important;
                max-height: none !important;
                overflow: visible !important;
              }
              
              .country-item, .country-item-missed {
                font-size: 14px !important;
                padding: 8px 12px !important;
                flex-basis: calc(50% - 8px) !important;
                box-sizing: border-box !important;
              }
              
              .submit-button, .statsInput {
                padding: 10px !important;
                font-size: 16px !important;
                width: 100% !important;
                max-width: 100% !important;
              }
              
              .formContent {
                flex-direction: column !important;
                gap: 10px !important;
                width: 100% !important;
              }
              
              .saveScoreForm {
                padding: 15px !important;
                width: 100% !important;
              }
              
              .success-notification, .error-notification {
                width: 90% !important;
                padding: 12px 15px !important;
                font-size: 14px !important;
                bottom: 20px !important;
              }
              
              .perfectScoreBanner, .greatScoreBanner, .gameFinishedBanner {
                padding: 12px 10px !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
                text-align: center !important;
              }
              
              .perfectScoreText, .greatScoreText, .gameFinishedText {
                font-size: 18px !important;
                width: 100% !important;
                margin: 5px 0 !important;
                order: 2 !important;
              }
              
              .perfectScoreIcon, .greatScoreIcon, .gameFinishedIcon {
                font-size: 24px !important;
                margin: 0 10px !important;
              }
              
              .statsInput {
                width: 100% !important;
              }
              
              .listTabs {
                gap: 15px !important;
              }
            }
          `}</style>

          <div style={styles.container} className="stats-container">
            {/* Header with navigation */}
            <div style={styles.headerBar}>
              <motion.h1 
                style={styles.headerTitle} 
                className="header-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span style={styles.globeIcon}>🌍</span> Game Results
              </motion.h1>
            </div>

            {/* Stats Summary */}
            <motion.div 
              style={styles.statsGrid} 
              className="stats-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div style={styles.statItem} className="stat-item">
                <div style={styles.statIcon}>🎯</div>
                <div style={styles.statContent}>
                  <div style={styles.statLabel}>Score</div>
                  <div style={styles.statValue}>{score} / {totalCountries}</div>
                  <div style={styles.statPercentage}>
                    {Math.round((score / totalCountries) * 100)}%
                  </div>
                </div>
              </div>
              
              <div style={styles.statItem} className="stat-item">
                <div style={styles.statIcon}>⏱️</div>
                <div style={styles.statContent}>
                  <div style={styles.statLabel}>Time</div>
                  <div style={styles.statValue}>{Math.floor(timeTaken / 60)}m {timeTaken % 60}s</div>
                  <div style={styles.statPercentage}>
                    {Math.round((timeTaken / 720) * 100)}% of max time
                  </div>
                </div>
              </div>
              
              <div style={styles.statItem} className="stat-item">
                <div style={styles.statIcon}>📊</div>
                <div style={styles.statContent}>
                  <div style={styles.statLabel}>Efficiency</div>
                  <div style={styles.statValue}>
                    {(score / (timeTaken / 60)).toFixed(1)} countries/min
                  </div>
                  <div style={styles.statPercentage}>
                    {(score / timeTaken).toFixed(2)} countries/sec
                  </div>
                  <div style={styles.statExtra}>
                    {missed} countries missed
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Game Completion Banner */}
            <AnimatePresence>
              {score === totalCountries ? (
                <motion.div
                  key="perfect-score"
                  style={styles.perfectScoreBanner}
                  className="perfectScoreBanner"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <span style={styles.perfectScoreIcon} className="perfectScoreIcon">🏆</span>
                  <h2 style={styles.perfectScoreText} className="perfectScoreText">Perfect Score! You named all countries!</h2>
                  <span style={styles.perfectScoreIcon} className="perfectScoreIcon">🏆</span>
                </motion.div>
              ) : score > totalCountries * 0.75 ? (
                <motion.div
                  key="great-score"
                  style={styles.greatScoreBanner}
                  className="greatScoreBanner" 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <span style={styles.greatScoreIcon} className="greatScoreIcon">🌟</span>
                  <h2 style={styles.greatScoreText} className="greatScoreText">Great Job! You know the world well!</h2>
                  <span style={styles.greatScoreIcon} className="greatScoreIcon">🌟</span>
                </motion.div>
              ) : (
                <motion.div
                  key="game-finished"
                  style={styles.gameFinishedBanner}
                  className="gameFinishedBanner"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <span style={styles.gameFinishedIcon} className="gameFinishedIcon">🏁</span>
                  <h2 style={styles.gameFinishedText} className="gameFinishedText">Game Finished!</h2>
                  <span style={styles.gameFinishedIcon} className="gameFinishedIcon">🏁</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main content area */}
            <div style={styles.mainContent}>
              {/* Country Lists */}
              <motion.div 
                style={styles.countryListContainer} 
                className="country-list-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div style={styles.listTabs} className="listTabs">
                  <div style={styles.listTab}>
                    <h3 style={styles.correctTitle}>
                      <span style={styles.correctIcon}>✅</span> Correctly Identified ({matchedCountryObjects.length})
                    </h3>
                    <div style={styles.countriesGrid} className="countries-grid">
                      {matchedCountryObjects.map((country, index) => (
                        <motion.div
                          key={country.class}
                          className="country-item"
                          whileHover={{ scale: 1.05 }}
                          style={{
                            ...styles.countryItem,
                            '--index': index
                          }}
                        >
                          {country.class}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={styles.listTab}>
                    <h3 style={styles.missedTitle}>
                      <span style={styles.missedIcon}>❌</span> Missed ({missedCountryObjects.length})
                    </h3>
                    <div style={styles.countriesGrid} className="countries-grid">
                      {missedCountryObjects.map((country, index) => (
                        <motion.div
                          key={country.class}
                          className="country-item-missed"
                          whileHover={{ scale: 1.05 }}
                          style={{
                            ...styles.countryItemMissed,
                            '--index': index
                          }}
                        >
                          {country.class}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Player Name Form */}
              <motion.form 
                style={styles.saveScoreForm} 
                className="saveScoreForm"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div style={styles.formHeader}>
                  <h3 style={styles.formTitle}>Save Your Score</h3>
                </div>
                
                <div style={styles.formContent} className="formContent">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    style={styles.statsInput}
                    className="statsInput"
                    placeholder="Enter your name"
                    required
                    disabled={isSubmitting || isSaved}
                  />
                  
                  <button
                    type="submit"
                    style={isSaved ? styles.buttonDisabled : styles.submitButton}
                    className="submit-button"
                    disabled={isSubmitting || isSaved || !playerName.trim()}
                  >
                    {isSubmitting ? 'Saving...' : isSaved ? 'Score Saved ✓' : 'Save Score'}
                  </button>
                </div>
              </motion.form>
            </div>

            {/* Status Notifications */}
            <AnimatePresence>
              {submissionStatus === 'success' && (
                <motion.div
                  key="success-notification"
                  style={styles.successNotification}
                  className="success-notification"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                >
                  <span style={styles.successIcon}>✓</span>
                  <p style={styles.notificationText}>
                    Score saved successfully! Redirecting to home...
                  </p>
                </motion.div>
              )}
              
              {submissionStatus === 'error' && (
                <motion.div
                  key="error-notification"
                  style={styles.errorNotification}
                  className="error-notification"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                >
                  <span style={styles.errorIcon}>✕</span>
                  <p style={styles.notificationText}>
                    Error saving score. Please try again.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  wrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#1a1a1a',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    boxSizing: 'border-box',
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
  },
  headerTitle: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  globeIcon: {
    marginRight: '10px',
    fontSize: '28px',
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#222',
    borderBottom: '1px solid #333',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: '#2a2a2a',
    padding: '15px',
    borderRadius: '12px',
    width: '280px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease',
    cursor: 'default',
  },
  statIcon: {
    fontSize: '32px',
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: '15px',
    color: '#ccc',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
  },
  statPercentage: {
    fontSize: '14px',
    color: '#999',
    marginTop: '5px',
  },
  statExtra: {
    fontSize: '14px',
    color: '#999',
    marginTop: '5px',
  },
  perfectScoreBanner: {
    backgroundColor: '#8A2BE2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    gap: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    zIndex: 10,
    margin: '10px 0',
    borderRadius: '8px',
  },
  perfectScoreIcon: {
    fontSize: '28px',
  },
  perfectScoreText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
  },
  greatScoreBanner: {
    backgroundColor: '#4f8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    gap: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    zIndex: 10,
    margin: '10px 0',
    borderRadius: '8px',
  },
  greatScoreIcon: {
    fontSize: '28px',
  },
  greatScoreText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  gameFinishedBanner: {
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    gap: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    zIndex: 10,
    margin: '10px 0',
    borderRadius: '8px',
  },
  gameFinishedIcon: {
    fontSize: '28px',
  },
  gameFinishedText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0,
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
  },
  countryListContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: '12px',
    padding: '20px',
    margin: '20px 0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  listTabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  listTab: {
    display: 'flex',
    flexDirection: 'column',
  },
  correctTitle: {
    fontSize: '18px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px',
    marginTop: 0,
  },
  correctIcon: {
    color: '#8cff8c',
  },
  missedTitle: {
    fontSize: '18px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '15px',
    marginTop: 0,
  },
  missedIcon: {
    color: '#ff4d4f',
  },
  countriesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '5px 0',
  },
  countryItem: {
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#8cff8c',
    color: '#333',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s ease',
    flex: '1 0 auto',
    minWidth: '100px',
    textAlign: 'center',
  },
  countryItemMissed: {
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s ease',
    flex: '1 0 auto',
    minWidth: '100px',
    textAlign: 'center',
  },
  saveScoreForm: {
    backgroundColor: '#333',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    margin: '10px 0 20px 0',
    width: '100%',
    boxSizing: 'border-box',
  },
  formHeader: {
    borderBottom: '1px solid #444',
    marginBottom: '15px',
    paddingBottom: '10px',
    width: '100%',
  },
  formTitle: {
    fontSize: '18px',
    color: '#fff',
    margin: 0,
  },
  formContent: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    boxSizing: 'border-box',
  },
  statsInput: {
    flex: 1,
    padding: '12px 15px',
    fontSize: '16px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    border: '2px solid #444',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    width: '100%',
    boxSizing: 'border-box',
    minWidth: 0, // Prevents flex items from overflowing
  },
  submitButton: {
    padding: '12px 25px',
    backgroundColor: '#8A2BE2',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  },
  buttonDisabled: {
    padding: '12px 25px',
    backgroundColor: '#555',
    color: '#ccc',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontSize: '16px',
    fontWeight: 'bold',
    opacity: 0.7,
  },
  successNotification: {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(140, 255, 140, 0.9)',
    color: '#333',
    borderRadius: '8px',
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    zIndex: 1000,
    maxWidth: '400px',
    width: '80%',
  },
  successIcon: {
    fontSize: '22px',
    fontWeight: 'bold',
  },
  errorNotification: {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 77, 79, 0.9)',
    color: '#fff',
    borderRadius: '8px',
    padding: '15px 25px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    zIndex: 1000,
    maxWidth: '400px',
    width: '80%',
  },
  errorIcon: {
    fontSize: '22px',
    fontWeight: 'bold',
  },
  notificationText: {
    margin: 0,
    fontSize: '16px',
  },
};

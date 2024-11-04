// src/screens/StatsScreen.js
import React, { useState, useEffect } from 'react';
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
    <div style={styles.container}>
      {/* Back to Main Screen Button */}
      <button
        style={styles.backButton}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
      >
        Home
      </button>

      {/* Animated Header */}
      <AnimatePresence>
        <motion.div
          key="header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={styles.header}
        >
          <h1 style={styles.title}>Game Stats</h1>
          <div style={styles.stats}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Countries Identified:</span>
              <span style={styles.statValue}>
                {score} / {totalCountries}
              </span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Time Taken:</span>
              <span style={styles.statValue}>
                {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Finish Animation */}
      <AnimatePresence>
        {score === totalCountries && (
          <motion.div
            key="congrats"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={styles.congrats}
          >
            <h2 style={styles.congratsText}>
              🎉 Congratulations! You identified all countries! 🎉
            </h2>
          </motion.div>
        )}
        {score !== totalCountries && (
          <motion.div
            key="finish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.finishAnimation}
          >
            <h2 style={styles.finishText}>🏁 Game Finished! 🏁</h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Country List */}
      <div style={styles.countryListContainer}>
        <div style={styles.countryList}>
          {/* Matched Countries */}
          <div style={styles.matchedSection}>
            <h3 style={styles.sectionTitle}>✅ Correctly Identified</h3>
            <div style={styles.countriesGrid}>
              {matchedCountryObjects.map((country) => (
                <motion.div
                  key={country.class}
                  style={styles.countryItem}
                  whileHover={{ scale: 1.05 }}
                >
                  {country.class}
                </motion.div>
              ))}
            </div>
          </div>
          {/* Missed Countries */}
          <div style={styles.missedSection}>
            <h3 style={styles.sectionTitle}>❌ Missed</h3>
            <div style={styles.countriesGrid}>
              {missedCountryObjects.map((country) => (
                <motion.div
                  key={country.class}
                  style={styles.countryItemMissed}
                  whileHover={{ scale: 1.05 }}
                >
                  {country.class}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player Name Input */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="playerName" style={styles.label}>
          Enter Your Name:
        </label>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={styles.input}
          placeholder="Your Name"
          required
        />
        <button
          type="submit"
          style={isSaved ? styles.buttonDisabled : styles.button}
          disabled={isSaved || isSubmitting}
          onMouseEnter={(e) =>
            !isSaved && (e.currentTarget.style.borderColor = '#8A2BE2')
          }
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >
          {isSubmitting
            ? 'Submitting...'
            : isSaved
            ? 'Score Saved'
            : 'Save Score'}
        </button>
      </form>

      {/* Submission Status */}
      <AnimatePresence>
        {submissionStatus === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.statusMessageSuccess}
          >
            <p>Score saved successfully! 🎉 Redirecting to main screen...</p>
          </motion.div>
        )}
        {submissionStatus === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={styles.statusMessageError}
          >
            <p>Failed to save score. Please try again.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#333', // Dark background for the container
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    overflowY: 'auto',
    position: 'relative',
  },
  backButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#333',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'border-color 0.3s, background-color 0.3s',
    outline: 'none',
    zIndex: 1000,
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    color: '#ffffff', // White title to contrast with the dark background
    marginBottom: '10px',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    fontSize: '18px',
    color: '#ffffff',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '22px',
    color: '#7dd87d', // Green for stats values
  },
  congrats: {
    background: 'linear-gradient(135deg, #8A2BE2 0%, #7dd87d 100%)', // Gradient to make it pop
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#fff',
  },
  congratsText: {
    fontSize: '24px',
  },
  finishAnimation: {
    background: '#444',
    padding: '15px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#ffffff',
  },
  finishText: {
    fontSize: '24px',
  },
  countryListContainer: {
    maxWidth: '800px',
    maxHeight: '40vh',
    overflowY: 'auto',
    margin: '0 auto',
    background: '#444', // Darker shade for the list container
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    marginBottom: '20px',
  },
  countryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#ffffff',
    marginBottom: '10px',
  },
  countriesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  countryItem: {
    fontSize: '14px',
    margin: '5px',
    padding: '8px 12px',
    borderRadius: '5px',
    backgroundColor: '#7dd87d', // Bright green for correct answers
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  countryItemMissed: {
    fontSize: '14px',
    margin: '5px',
    padding: '8px 12px',
    borderRadius: '5px',
    backgroundColor: '#f96d6d', // Bright red for missed countries
    color: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  form: {
    maxWidth: '400px',
    margin: '0 auto 20px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    fontSize: '18px',
    color: '#ffffff',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #7dd87d',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#333',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.3s, background-color 0.3s',
    outline: 'none',
  },
  buttonDisabled: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#666',
    color: '#ffffff',
    border: '2px solid transparent',
    borderRadius: '8px',
    cursor: 'not-allowed',
  },
  statusMessageSuccess: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#7dd87d',
    color: '#ffffff',
    padding: '15px 25px',
    borderRadius: '5px',
    zIndex: 1000,
  },
  statusMessageError: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#f96d6d',
    color: '#ffffff',
    padding: '15px 25px',
    borderRadius: '5px',
    zIndex: 1000,
  },
};

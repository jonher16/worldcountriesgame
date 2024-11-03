import { useState, useEffect, useRef } from 'react';
import CountryMap from '../components/CountryMap';
import Timer from '../components/Timer';
import Progress from '../components/Progress';
import countryData from '../assets/grouped_country_paths.json';
import validateCountry from '../utils/validateCountry';
import { useNavigate } from 'react-router-dom';

export default function GameScreen() {
  const [input, setInput] = useState('');
  const [matchedCountries, setMatchedCountries] = useState([]);
  const [timeLeft, setTimeLeft] = useState(720);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const totalCountries = countryData.length;
  const navigate = useNavigate();

  const handleCountrySubmit = () => {
    const countryClassName = validateCountry(input);

    if (countryClassName && !matchedCountries.includes(countryClassName)) {
      setMatchedCountries([...matchedCountries, countryClassName]);
    }

    setInput('');
  };

  const handleEndGameClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmQuit = () => {
    setShowConfirmation(false);
    navigate('/stats'); // Navigate to stats or any other page you prefer
  };

  const handleCancelQuit = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    if (timeLeft === 0 || matchedCountries.length === totalCountries) {
      navigate('/stats', { state: { score: matchedCountries.length, missed: totalCountries - matchedCountries.length, timeTaken: 720 - timeLeft } });
    }
  }, [timeLeft, matchedCountries, totalCountries, navigate]);

  return (
    <div style={styles.container}>
      <button style={styles.endGameButton} onClick={handleEndGameClick}>End Game</button>
      <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
      <CountryMap matchedCountries={matchedCountries} />
      <Progress total={totalCountries} matched={matchedCountries.length} />
      <input
        style={styles.input}
        placeholder="Enter a country"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleCountrySubmit()}
      />
      
      {/* Confirmation Popup */}
      {showConfirmation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p>Are you sure you want to quit? Your game will not be saved.</p>
            <button style={styles.confirmButton} onClick={handleConfirmQuit}>Yes, Quit</button>
            <button style={styles.cancelButton} onClick={handleCancelQuit}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', position: 'relative' },
  input: { border: '1px solid #333', padding: '10px', fontSize: '16px', margin: '20px 0', textAlign: 'center', width: '100%' },
  endGameButton: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
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

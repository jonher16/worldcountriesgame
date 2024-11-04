// src/screens/RankingScreen.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import HeatMap from '../components/HeatMap'; // Ensure this component can handle heatmap data
import countryData from '../assets/updated_grouped_country_paths.json';
import LoadingScreen from './LoadingScreen'; // Import the LoadingScreen component
import { useNavigate } from 'react-router-dom';

export default function RankingScreen() {
  const [playersData, setPlayersData] = useState([]);
  const [countryPercentages, setCountryPercentages] = useState({});
  const [sortedCountryStats, setSortedCountryStats] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [top50Players, setTop50Players] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();


  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'scores'));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setPlayersData(data);
      calculateTopPlayers(data);
      calculateCountryStats(data);
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
        setLoading(false); // Stop loading after fetching data
      }
  };

  const normalizeCountryName = (name) => name.trim().toLowerCase();

  const calculateTopPlayers = (data) => {
    // Sort players based on score and timeTaken
    const sortedPlayers = data.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      } else {
        return a.timeTaken - b.timeTaken; // Faster time better
      }
    });
    setTopPlayers(sortedPlayers.slice(0, 3)); // Get top 3 players
    setTop50Players(sortedPlayers.slice(0, 50)); // Get top 50 players
  };

  const calculateCountryStats = (data) => {
    const countryCounts = {};
    const totalPlayers = data.length;
  
    data.forEach((player) => {
      const matchedCountries = player.matchedCountries || [];
      matchedCountries.forEach((country) => {
        const normalizedCountry = normalizeCountryName(country);
        countryCounts[normalizedCountry] = (countryCounts[normalizedCountry] || 0) + 1;
      });
    });
    
    // Calculate percentages and map normalized names to original names
  const percentages = {};
  const displayStats = [];

  countryData.forEach((country) => {
    const normalizedCountry = normalizeCountryName(country.class);
    const count = countryCounts[normalizedCountry] || 0;
    const percentage = (count / totalPlayers) * 100;
    percentages[normalizedCountry] = percentage;
    displayStats.push([country.class, percentage]); // Store original name with percentage
  });

  setCountryPercentages(percentages); // For heatmap, using normalized keys
  const sortedStats = displayStats.sort((a, b) => b[1] - a[1]); // Sort by percentage
  setSortedCountryStats(sortedStats); // For display list, using original names
};

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getColorForPercentage = (percentage) => {
    const hue = (percentage * 120) / 100; // 0 (red) to 120 (green)
    const lightness = 60;
    const saturation = 60; // Lower saturation for a muted color

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  };

  return (
    <>
      {loading ? (
        <LoadingScreen /> // Show LoadingScreen while data is loading
      ) : (
    <div style={styles.container}>
        <button
        style={styles.backButton}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#8A2BE2')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
      >
        Home
      </button>
      <motion.h1
        style={styles.title}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🏆 <span style={styles.titleHighlight}>Global Rankings</span> 🏆
      </motion.h1>

      {/* Podium Animation */}
      <div style={styles.podiumContainer}>
        {topPlayers.map((player, index) => (
          <motion.div
            key={index}
            style={{
              ...styles.podiumPlace,
              ...styles[`place${index + 1}`],
            }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.3 }}
          >
            <h2 style={styles.placeTitle}>{index + 1}</h2>
            <p style={styles.playerName}>{player.name}</p>
            <p style={styles.playerScore}>
              Score: {player.score}, Time: {formatTime(player.timeTaken)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Top 50 Ranking */}
      <div style={styles.top50Container}>
        <h2 style={styles.sectionTitle}>Top 50 Players</h2>
        <ul style={styles.top50List}>
          {top50Players.map((player, index) => (
            <li key={index} style={styles.top50Item}>
              <span style={styles.top50Rank}>{index + 1}.</span>
              <span style={styles.top50Name}>{player.name}</span>
              <span style={styles.top50Score}>Score: {player.score}</span>
              <span style={styles.top50Time}>Time: {formatTime(player.timeTaken)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Heatmap */}
      <div style={styles.heatmapContainer}>
        <h2 style={styles.sectionTitle}>🔥 Country Heatmap 🔥</h2>
        <HeatMap heatmapData={countryPercentages} />
      </div>

      {/* Country Statistics */}
      <div style={styles.countryStatsContainer}>
        <h2 style={styles.sectionTitle}>📊 Country Accuracy 📊</h2>
        <ul style={styles.countryStatsList}>
          {sortedCountryStats.map(([countryName, percentage], index) => (
            <li
              key={countryName}
              style={{
                ...styles.countryStatItem,
                backgroundColor: getColorForPercentage(percentage),
              }}
            >
              <span style={styles.countryName}>{countryName}</span>
              <span style={styles.countryPercentage}>
                {percentage.toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
      )}</>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#333',
    color: '#fff',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
    overflowY: 'auto',
    maxHeight: '100vh',
    width: '100vw',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#444',
    color: '#fff',
    border: '2px solid transparent',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  title: {
    fontSize: '48px',
    textAlign: 'center',
    marginBottom: '40px',
  },
  titleHighlight: {
    color: '#7dd87d',
  },
  podiumContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: '60px',
  },
  podiumPlace: {
    width: '150px',
    background: '#444',
    margin: '0 10px',
    textAlign: 'center',
    padding: '20px',
    borderRadius: '10px 10px 0 0',
    color: '#fff',
  },
  place1: {
    height: '250px',
    background: '#ffd700', // Gold
  },
  place2: {
    height: '200px',
    background: '#c0c0c0', // Silver
  },
  place3: {
    height: '150px',
    background: '#cd7f32', // Bronze
  },
  placeTitle: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  playerName: {
    fontSize: '22px',
    marginBottom: '5px',
  },
  playerScore: {
    fontSize: '18px',
  },
  top50Container: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '30px',
  },
  top50List: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  top50Item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    background: '#444',
    marginBottom: '5px',
    borderRadius: '5px',
  },
  top50Rank: {
    width: '5%',
    textAlign: 'center',
  },
  top50Name: {
    width: '30%',
  },
  top50Score: {
    width: '20%',
    textAlign: 'center',
  },
  top50Time: {
    width: '20%',
    textAlign: 'center',
  },
  heatmapContainer: {
    marginBottom: '60px',
  },
  countryStatsContainer: {
    marginBottom: '60px',
    maxHeight: '50vh',
  },
  countryStatsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  countryStatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    marginBottom: '2px',
    borderRadius: '5px',
    color: '#fff',
  },
  countryName: {
    width: '70%',
  },
  countryPercentage: {
    width: '30%',
    textAlign: 'right',
  },
};

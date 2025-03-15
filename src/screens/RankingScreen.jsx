// src/screens/RankingScreen.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import HeatMap from '../components/HeatMap'; // Ensure this component can handle heatmap data
import countryData from '../assets/updated_grouped_country_paths.json';
import LoadingScreen from './LoadingScreen'; // Import the LoadingScreen component
import { useNavigate } from 'react-router-dom';

export default function RankingScreen() {
  const [countryPercentages, setCountryPercentages] = useState({});
  const [sortedCountryStats, setSortedCountryStats] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [top50Players, setTop50Players] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlayerData();
  }, []);

  // Utility function to convert Firestore Timestamp to Date
  const convertFirestoreTimestampToDate = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return new Date(); // Fallback to current date if conversion fails
  };

  // Fetch player data from Firestore
  const fetchPlayerData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'scores'));
      const data = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        docData.date = convertFirestoreTimestampToDate(docData.date);
        data.push(docData);
      });
      calculateTopPlayers(data);
      calculateCountryStats(data);
    } catch (error) {
      console.error('Error fetching player data:', error);
    } finally {
      setLoading(false); // Stop loading after fetching data
    }
  };

  // Normalize country names for consistent counting
  const normalizeCountryName = (name) => name.trim().toLowerCase();

  // Calculate top players based on score and time taken
  const calculateTopPlayers = (data) => {
    // Sort players based on score and timeTaken
    const sortedPlayers = [...data].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      } else {
        return a.timeTaken - b.timeTaken; // Faster time better
      }
    });
    setTopPlayers(sortedPlayers.slice(0, 3)); // Get top 3 players
    setTop50Players(sortedPlayers.slice(0, 50)); // Get top 50 players
  };

  // Calculate country statistics for the heatmap and list
  const calculateCountryStats = (data) => {
    const countryCounts = {};
    const totalPlayers = data.length;

    data.forEach((player) => {
      const matchedCountries = player.matchedCountries || [];
      matchedCountries.forEach((country) => {
        const normalizedCountry = normalizeCountryName(country);
        countryCounts[normalizedCountry] =
          (countryCounts[normalizedCountry] || 0) + 1;
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

  // Format time from seconds to "Xm Ys"
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  // Format date to a readable string
  const formatDate = (date) => {
    if (!(date instanceof Date)) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get color based on percentage for the country stats list
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
            
            .rankings-container {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: #1a1a1a;
              color: #fff;
              overflow-y: auto;
              scrollbar-width: thin;
              scrollbar-color: #444 #222;
              -webkit-overflow-scrolling: touch;
              -ms-overflow-style: -ms-autohiding-scrollbar;
              overscroll-behavior-y: contain;
              touch-action: pan-y;
            }
            
            .rankings-content {
              padding: 20px;
              padding-top: 80px;
              padding-bottom: 60px;
              -webkit-tap-highlight-color: transparent;
            }
            
            .home-button {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 100;
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
            
            .top50-wrapper {
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            @media (max-width: 768px) {
              .rankings-content {
                padding: 15px;
                padding-top: 70px;
                padding-bottom: 40px;
              }
              
              .top50-item {
                flex-wrap: wrap !important;
              }
              
              .top50-rank {
                width: 10% !important;
              }
              
              .top50-name {
                width: 90% !important;
                margin-bottom: 5px !important;
              }
              
              .top50-score {
                width: 40% !important;
                text-align: left !important;
              }
              
              .top50-time {
                width: 60% !important;
                text-align: right !important;
              }
              
              .top50-date {
                width: 100% !important;
                text-align: left !important;
                margin-top: 5px !important;
              }
              
              .section-title {
                font-size: 26px !important;
              }
              
              .main-title {
                font-size: 32px !important;
                margin-bottom: 30px !important;
              }
              
              .podium-container {
                flex-direction: column !important;
                align-items: center !important;
                gap: 15px !important;
              }
              
              .podium-place {
                width: 80% !important;
                max-width: 250px !important;
                height: auto !important;
                padding: 15px 10px !important;
              }
              
              .place1, .place2, .place3 {
                height: auto !important;
                padding: 20px 10px !important;
              }
            }
            
            /* Scrollbar styling */
            .rankings-container::-webkit-scrollbar {
              width: 8px;
            }
            
            .rankings-container::-webkit-scrollbar-track {
              background: #222;
            }
            
            .rankings-container::-webkit-scrollbar-thumb {
              background: #444;
              border-radius: 4px;
            }
            
            .rankings-container::-webkit-scrollbar-thumb:hover {
              background: #555;
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
          <div className="rankings-container">
            <div className="rankings-content">
              {/* Animated Header */}
              <motion.h1
                style={styles.title}
                className="main-title"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                🏆 <span style={styles.titleHighlight}>Global Rankings</span> 🏆
              </motion.h1>

              {/* Podium Animation */}
              <div style={styles.podiumContainer} className="podium-container">
                {topPlayers.map((player, index) => (
                  <motion.div
                    key={index}
                    style={{
                      ...styles.podiumPlace,
                      ...styles[`place${index + 1}`],
                    }}
                    className={`podium-place place${index + 1}`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.3 }}
                  >
                    <h2 style={styles.placeTitle}>{index + 1}</h2>
                    <p style={styles.playerName}>{player.name}</p>
                    <p style={styles.playerScore}>
                      Score: {player.score}
                      <br />
                      Time: {formatTime(player.timeTaken)}
                    </p>
                    <p style={styles.playerDatePodium}>
                      Date: {formatDate(player.date)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Top 50 Ranking */}
              <div style={styles.top50Container}>
                <h2 style={styles.sectionTitle} className="section-title">Top 50 Players</h2>
                <div className="top50-wrapper">
                  <ul style={styles.top50List}>
                    {top50Players.map((player, index) => (
                      <li key={index} style={styles.top50Item} className="top50-item">
                        <span style={styles.top50Rank} className="top50-rank">{index + 1}.</span>
                        <span style={styles.top50Name} className="top50-name">{player.name}</span>
                        <span style={styles.top50Score} className="top50-score">Score: {player.score}</span>
                        <span style={styles.top50Time} className="top50-time">
                          Time: {formatTime(player.timeTaken)}
                        </span>
                        <span style={styles.top50Date} className="top50-date">
                          {formatDate(player.date)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Heatmap */}
              <div style={styles.heatmapContainer}>
                <h2 style={styles.sectionTitle} className="section-title">🔥 Country Heatmap 🔥</h2>
                <div style={styles.heatmapWrapper}>
                  <HeatMap heatmapData={countryPercentages} />
                </div>
              </div>

              {/* Country Statistics */}
              <div style={styles.countryStatsContainer}>
                <h2 style={styles.sectionTitle} className="section-title">📊 Country Accuracy 📊</h2>
                <ul style={styles.countryStatsList}>
                  {sortedCountryStats.map(([countryName, percentage]) => (
                    <li
                      key={countryName}
                      style={{
                        ...styles.countryStatItem,
                        backgroundColor: getColorForPercentage(percentage),
                      }}
                      className="country-stats-item"
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
          </div>
        </>
      )}
    </>
  );
}

const styles = {
  title: {
    fontSize: '42px',
    textAlign: 'center',
    marginBottom: '40px',
    marginTop: '20px',
    fontWeight: 'bold',
  },
  titleHighlight: {
    color: '#e6c200', // Gold color that matches the main theme
  },
  podiumContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: '60px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  podiumPlace: {
    width: '180px',
    textAlign: 'center',
    padding: '20px 10px',
    borderRadius: '10px',
    color: '#fff',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease',
  },
  place1: {
    height: '350px',
    background: 'linear-gradient(to bottom, #ffd700, #e6c200)', // Gold gradient
    zIndex: 3,
  },
  place2: {
    height: '300px',
    background: 'linear-gradient(to bottom, #c0c0c0, #a0a0a0)', // Silver gradient
    zIndex: 2,
  },
  place3: {
    height: '250px',
    background: 'linear-gradient(to bottom, #cd7f32, #a56727)', // Bronze gradient
    zIndex: 1,
  },
  placeTitle: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  playerName: {
    fontSize: '22px',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  playerScore: {
    fontSize: '18px',
    lineHeight: '1.5',
  },
  playerDatePodium: {
    fontSize: '16px',
    marginTop: '15px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  top50Container: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '32px',
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 'bold',
  },
  top50List: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    width: '100%',
  },
  top50Item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    background: '#333',
    marginBottom: '2px',
    borderLeft: '3px solid #e6c200', // Gold color to match main theme
    transition: 'background-color 0.2s ease',
  },
  top50Rank: {
    width: '5%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  top50Name: {
    width: '25%',
    fontWeight: 'bold',
  },
  top50Score: {
    width: '20%',
    textAlign: 'center',
  },
  top50Time: {
    width: '20%',
    textAlign: 'center'
  },
  top50Date: {
    width: '30%',
    textAlign: 'right',
    fontSize: '14px',
    color: '#ccc',
  },
  heatmapContainer: {
    marginBottom: '60px',
  },
  heatmapWrapper: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    background: '#333',
    padding: '15px',
  },
  countryStatsContainer: {
    marginBottom: '60px',
  },
  countryStatsList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  countryStatItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    marginBottom: '1px',
    color: '#333', // Dark text for better contrast on colored backgrounds
    fontWeight: '500',
    transition: 'transform 0.2s ease',
  },
  countryName: {
    width: '70%',
  },
  countryPercentage: {
    width: '30%',
    textAlign: 'right',
    fontWeight: 'bold',
  },
};

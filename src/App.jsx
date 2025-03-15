import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import StatsScreen from './screens/StatsScreen';
import RankingScreen from './screens/RankingScreen';

export default function App() {
  // Add a meta tag for mobile when component mounts
  useEffect(() => {
    // Disable double-tap to zoom on mobile devices
    document.addEventListener('touchstart', function(event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });
    
    // Prevent pinch zoom
    document.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      });
      document.removeEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
          event.preventDefault();
        }
      });
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/stats" element={<StatsScreen />} />
        <Route path="/ranking" element={<RankingScreen />} />
      </Routes>
    </Router>
  );
}

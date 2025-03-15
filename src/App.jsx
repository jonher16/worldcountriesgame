import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import StatsScreen from './screens/StatsScreen';
import RankingScreen from './screens/RankingScreen';

export default function App() {
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

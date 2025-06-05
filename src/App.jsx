// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BiomesPage from './pages/BiomesPage';
import BottomNavbar from './components/BottomNavBar';
import StoryGamePage from './pages/StoryGamePage';
import SoundGamePage from './pages/SoundGamePage';

import './App.css';
 

function App() {
  return (
    <Router basename="/museum-adventure-game">
      <div style={{ paddingBottom: '100px' }}> {/* reserve space for navbar */}
        <Routes>
          <Route path="/" element={<BiomesPage />} />
          <Route path="/story" element={<StoryGamePage />} />
          <Route path="/story-game/sound" element={<SoundGamePage />} />
        </Routes>
        <BottomNavbar />
      </div>
    </Router>
  );
}

export default App;

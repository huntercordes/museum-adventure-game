// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BiomesPage from './pages/BiomesPage';
import BottomNavbar from './components/BottomNavBar';
import NameGamePage from './pages/NameGamePage';
import StoryGamePage from './pages/StoryGamePage';
import SoundGamePage from './pages/SoundGamePage';
import ProfilePage from './pages/ProfilePage';
import RegularQuizPage from './pages/RegularQuizPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

import './App.css';

function App() {
  const { user } = useAuth();

  const [progress, setProgress] = useState({ name: 0, quiz: 0, sound: 0 });

  // Fetch progress on user login
  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProgress(data.progress || { name: 0, quiz: 0, sound: 0 });
        } else {
          // No doc exists, initialize progress to zero
          setProgress({ name: 0, quiz: 0, sound: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error);
      }
    };

    fetchProgress();
  }, [user]);

  // Function to update name progress
  const updateNameProgress = async (newValue) => {
    if (!user) return;
    if (newValue <= progress.name) return; // only update if progress increases

    setProgress((prev) => ({ ...prev, name: newValue }));

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        'progress.name': newValue,
      });
    } catch (error) {
      console.error('Error updating name progress:', error);
    }
  };

  return (
    <Router basename="/museum-adventure-game">
      <div style={{ paddingBottom: '100px' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BiomesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story"
            element={
              <ProtectedRoute>
                <StoryGamePage progress={progress} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story-game/sound"
            element={
              <ProtectedRoute>
                <SoundGamePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story-game/name"
            element={
              <ProtectedRoute>
                <NameGamePage onProgressUpdate={updateNameProgress} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regular-quiz"
            element={
              <ProtectedRoute>
                <RegularQuizPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <BottomNavbar />
      </div>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StoryGamePage.module.css';
import ClueButton from '../components/ClueButton';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import FullscreenVideo from '../components/FullScreenVideo';
import introVideo from '../assets/0605.mp4';
import completionVideo from '../assets/Final cutscene.mp4';

const StoryGamePage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({ name: 0, quiz: 0, sound: 0 });
  const [showIntro, setShowIntro] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userProgress = data.progress || { name: 0, quiz: 0, sound: 0 };
        setProgress(userProgress);

        const totalProgress = (userProgress.name || 0) + (userProgress.quiz || 0) + (userProgress.sound || 0);
        const allCompleted = totalProgress >= 9;

        if (!data.introShown) {
          setShowIntro(true);
          await updateDoc(userDocRef, { introShown: true });
        } else if (allCompleted && !data.completionVideoShown) {
          setShowCompletion(true);
          await updateDoc(userDocRef, { completionVideoShown: true });
        }

        setLoaded(true);
      }
    };

    fetchProgress();
  }, [user]);

  const handleVideoEnd = () => {
    setShowIntro(false);
    setShowCompletion(false);
  };

  // Show nothing until progress is fetched
  if (!loaded) return null;

  if (showIntro) {
    return <FullscreenVideo src={introVideo} onEnded={handleVideoEnd} />;
  }

  if (showCompletion) {
    return <FullscreenVideo src={completionVideo} onEnded={handleVideoEnd} />;
  }

  const updateNameProgress = async (newValue) => {
    if (!user) return;

    setProgress((prev) => ({
      ...prev,
      name: newValue > prev.name ? newValue : prev.name,
    }));

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        'progress.name': newValue,
      });
    } catch (error) {
      console.error('Failed to update progress in Firestore:', error);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Pick your clue</h1>
        <h2 className={styles.subtitle}>What will be your first hint?</h2>
      </div>

      <div className={styles.clueSection}>
        <div className={styles.clueBox}>
          <ClueButton type="name" progress={progress.name} icon="🌍" />
          <ClueButton
            type="quiz"
            progress={progress.quiz}
            icon="❓"
            onClick={() => navigate('/regular-quiz')}
          />
          <ClueButton
            type="sound"
            progress={progress.sound}
            icon="👥"
            onClick={() => navigate('/story-game/sound')}
          />
        </div>
      </div>
    </main>
  );
};

export default StoryGamePage;

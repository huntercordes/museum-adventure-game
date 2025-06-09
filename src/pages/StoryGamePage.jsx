import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StoryGamePage.module.css';
import ClueButton from '../components/ClueButton';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth'; // Assuming you have a custom auth hook

const StoryGamePage = () => {
  const { user } = useAuth(); // Get current user from context
  const [progress, setProgress] = useState({ name: 0, quiz: 0, sound: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProgress(data.progress || { name: 0, quiz: 0, sound: 0 });
      }
    };
    fetchProgress();
  }, [user]);

  return (
    <div className={styles.container}>
      <h1>Pick your clue</h1>
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
  );
};


export default StoryGamePage;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SoundQuestionPlayer from '../components/SoundQuestionPlayer';
import AnswerOptions from '../components/AnswerOptions';
import ProgressBar from '../components/ProgressBar';
import BackButton from '../components/BackButton';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/SoundGamePage.module.css';
import lionSound from '../assets/Lion.mp3';
import monkeySound from '../assets/Monkey.mp3';


const soundData = [
  {
    question: 'Which animal makes this sound?',
    sound: lionSound,
    options: ['Elephant', 'Lion', 'Monkey'],
    answer: 'Lion',
  },
  {
    question: 'Which animal makes this sound?',
    sound: monkeySound,
    options: ['Lion', 'Elephant', 'Zebra'],
    answer: 'Elephant',
  },
  {
    question: 'Which animal makes this sound?',
    sound: monkeySound,
    options: ['Giraffe', 'Monkey', 'Tiger'],
    answer: 'Monkey',
  },
];

export default function SoundGamePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [storedProgress, setStoredProgress] = useState(0); // track stored progress

  // Load existing progress on mount
  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const soundProg = data.progress?.sound || 0;
          setProgress(soundProg);
          setStoredProgress(soundProg);
          setCurrent(soundProg < soundData.length ? soundProg : soundData.length - 1);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    };
    fetchProgress();
  }, [user]);

  // Update Firestore only if progress increased
  useEffect(() => {
    if (!user) return;
    if (progress > storedProgress) {
      const userDocRef = doc(db, 'users', user.uid);
      updateDoc(userDocRef, { 'progress.sound': progress }).catch(console.error);
      setStoredProgress(progress);
    }
  }, [progress, storedProgress, user]);

  const handlePlay = () => {
    new Audio(soundData[current].sound).play();
  };

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === soundData[current].answer) {
      setFeedback('✅ Correct!');
      const nextProgress = current + 1;
      setProgress(nextProgress);

      if (current < soundData.length - 1) {
        setTimeout(() => {
          setCurrent(nextProgress);
          setSelected(null);
          setFeedback('');
        }, 1000);
      } else {
        setTimeout(() => {
          navigate('/story'); // Or wherever the user should go after finishing
        }, 1000);
      }
    } else {
      setFeedback('❌ Try again!');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <BackButton onClick={() => navigate('/story')} />

      <div className={styles.header}>
        <h1>
          {soundData[current].question}
          <span>
            {progress}/{soundData.length}
          </span>
        </h1>
      </div>

      <div className={styles.card}>
        <div className={styles.instruction}>
          <p>Can you guess who made that noise?</p>
          <p>Tap here to play sound</p>
        </div>

        <SoundQuestionPlayer
          soundUrl={soundData[current].sound}
          onPlayClick={handlePlay}
        />

        <AnswerOptions
          options={soundData[current].options}
          selected={selected}
          onSelect={handleAnswer}
        />

        {feedback && <p className={styles.feedback}>{feedback}</p>}

        <ProgressBar current={progress} total={soundData.length} />
      </div>
    </div>
  );
}

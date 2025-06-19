import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SoundQuestionPlayer from '../components/SoundQuestionPlayer';
import AnswerOptions from '../components/AnswerOptions';
import ProgressBar from '../components/ProgressBar';
import BackButton from '../components/BackButton';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/SoundGamePage.module.css';

const soundData = [
  {
    question: 'Which animal makes this sound?',
    sound: '/sounds/lion.mp3',
    options: ['Elephant', 'Lion', 'Monkey'],
    answer: 'Lion',
  },
  {
    question: 'Which animal makes this sound?',
    sound: '/sounds/elephant.mp3',
    options: ['Lion', 'Elephant', 'Zebra'],
    answer: 'Elephant',
  },
  {
    question: 'Which animal makes this sound?',
    sound: '/sounds/monkey.mp3',
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

  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, { 'progress.sound': progress }).catch(console.error);
  }, [progress, user]);

  const handlePlay = () => {
    new Audio(soundData[current].sound).play();
  };

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === soundData[current].answer) {
      setFeedback('Correct!');
      setProgress((p) => p + 1);
      if (current < soundData.length - 1) {
        setTimeout(() => {
          setCurrent((c) => c + 1);
          setSelected(null);
          setFeedback('');
        }, 1000);
      }
    } else {
      setFeedback('Try again!');
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Move BackButton here so it’s outside the frosted card */}
      <BackButton onClick={() => navigate('/story-game')} />

      {/* Header */}
      <div className={styles.header}>
        <h1>
          {soundData[current].question}
          <span>{progress}/{soundData.length}</span>
        </h1>
      </div>

      {/* Frosted-glass card */}
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

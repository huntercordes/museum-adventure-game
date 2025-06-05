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

    const updateProgressInDb = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await updateDoc(userDocRef, {
          'progress.sound': progress,
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };

    updateProgressInDb();
  }, [progress, user]);

  const handlePlay = () => {
    new Audio(soundData[current].sound).play();
  };

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === soundData[current].answer) {
      setFeedback('Correct!');
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (current < soundData.length - 1) {
        setTimeout(() => {
          setCurrent(current + 1);
          setFeedback('');
          setSelected(null);
        }, 1000);
      }
    } else {
      setFeedback('Try again!');
    }
  };

  return (
    <div className={styles.container}>
      <BackButton onClick={() => navigate('/story-game')} />
      <h1>
        {soundData[current].question} <span>{progress}/3 🔊</span>
      </h1>
      <SoundQuestionPlayer soundUrl={soundData[current].sound} onPlayClick={handlePlay} />
      <AnswerOptions options={soundData[current].options} selected={selected} onSelect={handleAnswer} />
      {feedback && <p className={styles.feedback}>{feedback}</p>}
      <ProgressBar current={progress} total={soundData.length} />
    </div>
  );
}

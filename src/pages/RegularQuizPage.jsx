import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RegularQuizPage.module.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const quizData = [
  {
    question: "How do lions typically live?",
    options: ["In packs", "In prides", "Alone"],
    answer: "In prides",
  },
  {
    question: "On which continent primarily do toucans live?",
    options: ["Africa", "South America", "Europe"],
    answer: "South America",
  },
  {
    question: "What do narwhals use their long tusk for?",
    options: ["Fighting", "Eating", "Sensing"],
    answer: "Sensing",
  },
];

const RegularQuizPage = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [userProgress, setUserProgress] = useState(0);

  // Load existing progress from Firestore
  useEffect(() => {
    const fetchUserProgress = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserProgress(data.progress?.quiz || 0);
      }
    };
    fetchUserProgress();
  }, []);

  // Calculate progress percentage for the progress bar
  const progressPercent = ((currentQuestion + 1) / quizData.length) * 100;

  const handleAnswer = async (option) => {
    setSelected(option);
    if (option === quizData[currentQuestion].answer) {
      setScore(prev => prev + 1);
      setFeedback("✅ Correct!");

      // Update Firestore if new progress is greater than stored
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);

          const newProgress = currentQuestion + 1;
          if (newProgress > userProgress) {
            await updateDoc(docRef, {
              'progress.quiz': newProgress,
            });
            setUserProgress(newProgress);
          }
        }
      } catch (error) {
        console.error('Failed to update progress:', error);
      }

      setTimeout(() => {
        if (currentQuestion < quizData.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelected(null);
          setFeedback('');
        } else {
          navigate('/story'); // or wherever next
        }
      }, 1000);
    } else {
      setFeedback("❌ Try again!");
    }
  };

  return (
    <div className={styles['quiz-container']}>
      {/* Progress Bar */}
      <div className={styles.progressBarOuter}>
        <div
          className={styles.progressBarInner}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <h1 className={styles['quiz-question']}>
        {quizData[currentQuestion].question}
      </h1>

      <ul className={styles['quiz-options']}>
        {quizData[currentQuestion].options.map(option => (
          <li key={option}>
            <button
              onClick={() => handleAnswer(option)}
              className={selected === option ? styles.selected : ''}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      {feedback && (
        <p className={styles['quiz-feedback']}>
          {feedback}
        </p>
      )}

      <p className={styles['quiz-score']}>
        Score: {score} / {quizData.length}
      </p>
    </div>
  );
};

export default RegularQuizPage;

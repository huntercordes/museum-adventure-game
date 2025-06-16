import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RegularQuizPage.module.css';


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

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === quizData[currentQuestion].answer) {
      setScore(prev => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Try again!");
    }

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelected(null);
        setFeedback('');
      } else {
        navigate('/');
      }
    }, 1000);
  };

  return (
    <div className={styles['quiz-container']}>
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
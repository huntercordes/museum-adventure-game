import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const quizData = [
  {
    question: "What is the largest biome on Earth?",
    options: ["Desert", "Ocean", "Rainforest"],
    answer: "Ocean",
  },
  {
    question: "Which biome has the most biodiversity?",
    options: ["Tundra", "Rainforest", "Grassland"],
    answer: "Rainforest",
  },
  {
    question: "Which biome is known for very little rainfall?",
    options: ["Desert", "Forest", "Savanna"],
    answer: "Desert",
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
        navigate('/'); // Go to home or result page
      }
    }, 1000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>{quizData[currentQuestion].question}</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {quizData[currentQuestion].options.map((option) => (
          <li key={option}>
            <button
              onClick={() => handleAnswer(option)}
              style={{
                margin: '10px 0',
                padding: '10px 20px',
                backgroundColor: selected === option ? '#d3d3d3' : '#f0f0f0',
                cursor: 'pointer',
              }}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {feedback && <p>{feedback}</p>}
      <p>Score: {score} / {quizData.length}</p>
    </div>
  );
};

export default RegularQuizPage;

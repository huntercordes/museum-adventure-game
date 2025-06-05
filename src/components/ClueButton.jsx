import React from 'react';
import styles from '../styles/ClueButton.module.css';
import { useNavigate } from 'react-router-dom';

const ClueButton = ({ type, progress, icon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story-game/${type}`);
  };

  return (
    <button className={styles.clue} onClick={handleClick}>
      {type === 'name' && 'Name'}
      {type === 'quiz' && 'Fun Facts Quiz'}
      {type === 'sound' && 'Sounds'}
      <span>{progress}/3 {icon}</span>
    </button>
  );
};

export default ClueButton;

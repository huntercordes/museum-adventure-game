import React from 'react';
import styles from '../styles/StoryGamePage.module.css';
import { useNavigate } from 'react-router-dom';

const ClueButton = ({ type, progress, icon, biome, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/story-game/${type}`);
  };

  // Capitalize and match label
  const getLabel = () => {
    switch (type) {
      case 'name':
        return 'Show the Animal';
      case 'quiz':
        return 'Fun Facts Quiz ';
      case 'sound':
        return 'Sounds of Animals';
      default:
        return 'Clue';
    }
  };

  return (
    <button
      className={`${styles.clue} ${biome ? styles[biome] : ''}`}
      onClick={onClick || handleClick}
      aria-label={`${getLabel()} clue - ${progress} of 3`}
    >
      <span>{getLabel()}</span>
      <span className={`${styles.progressSpacing} ${styles.progress}`}>
        {progress}/3 <span className={styles.icon}>{icon}</span>
      </span>
    </button>
  );
};

export default ClueButton;

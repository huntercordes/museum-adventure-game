import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BackButton.module.css';

export default function BackButton({ onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button className={styles.backButton} onClick={handleClick} aria-label="Go Back">
      ← Back
    </button>
  );
}

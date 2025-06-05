import React from 'react';
import styles from '../styles/AnswerOptions.module.css';

export default function AnswerOptions({ options, selected, onSelect }) {
  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option}
          className={`${styles.optionButton} ${selected === option ? styles.selected : ''}`}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

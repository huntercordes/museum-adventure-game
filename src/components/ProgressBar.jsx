import React from 'react';
import styles from '../styles/ProgressBar.module.css';

export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.filled}
        style={{ width: `${percentage}%` }}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
      />
    </div>
  );
}

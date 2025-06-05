// src/components/BiomeCard.jsx
import React from 'react';
import styles from '../styles/BiomeCard.module.css';

function BiomeCard({ title, videoSrc }) {
  return (
    <div className={styles.card}>
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className={styles.video}
      />
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}

export default BiomeCard;

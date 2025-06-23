// components/FullscreenVideo.jsx
import React from 'react';
import styles from '../styles/FullscreenVideo.module.css';


export default function FullscreenVideo({ src, onEnded }) {
  return (
    <div className={styles.overlay}>
      <video
        src={src}
        autoPlay
        playsInline
        onEnded={onEnded}
        className={styles.video}
      />
    </div>
  );
}

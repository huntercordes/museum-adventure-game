import React, { useRef } from 'react';
import styles from '../styles/SoundGamePage.module.css';

export default function SoundQuestionPlayer({ soundUrl, onPlayClick }) {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if (onPlayClick) onPlayClick();
  };

  return (
    <div className={styles.container}>
      <audio ref={audioRef} src={soundUrl} />
      <button className={styles.playButton} onClick={handlePlay}>
        ▶
      </button>
    </div>
  );
}

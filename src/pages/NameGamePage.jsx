import React, { useEffect, useRef, useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/NameGamePage.module.css';

const animalTargets = ['lion', 'polar bear', 'zebra'];

export default function NameGamePage() {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState('Loading model...');
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Load camera
  useEffect(() => {
    async function setupCamera() {
      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      }
    }

    setupCamera();
    mobilenet.load().then(setModel);
  }, []);

  // Start detection loop
  useEffect(() => {
    let interval;
    if (model && videoRef.current) {
      interval = setInterval(() => {
        detectAnimal();
      }, 2000);
    }

    async function detectAnimal() {
      const predictions = await model.classify(videoRef.current);
      const topResult = predictions[0]?.className?.toLowerCase();
      const currentAnimal = animalTargets[currentIndex];

      if (topResult && topResult.includes(currentAnimal)) {
        setMessage(`✅ That is a ${currentAnimal}!`);
        const newProgress = progress + 1;
        setProgress(newProgress);

        if (newProgress >= animalTargets.length) {
          clearInterval(interval);
          setTimeout(() => {
            setMessage('🎉 You have found all the animals!');
          }, 1000);
        } else {
          setTimeout(() => {
            setCurrentIndex(currentIndex + 1);
            setMessage('Keep scanning...');
          }, 2000);
        }
      } else {
        setMessage(`❌ This is not a ${currentAnimal}`);
      }
    }

    return () => clearInterval(interval);
  }, [model, currentIndex, progress]);

  return (
    <div className={styles.container}>
      <h1>{progress >= animalTargets.length ? 'All animals found!' : `Can you find the ${animalTargets[currentIndex]}?`}</h1>

      <div className={styles.progressBar}>
        <div
          className={styles.filler}
          style={{ width: `${(progress / animalTargets.length) * 100}%` }}
        />
      </div>

      <div className={styles.videoContainer}>
        <video ref={videoRef} autoPlay playsInline className={styles.video} />
      </div>

      <p className={styles.message}>{message}</p>

      {progress >= animalTargets.length && (
        <button className={styles.button} onClick={() => navigate('/story-game')}>
          Return to Main Page
        </button>
      )}
    </div>
  );
}

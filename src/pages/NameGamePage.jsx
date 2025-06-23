import React, { useEffect, useRef, useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/NameGamePage.module.css';

// Animal list to find
const animalTargets = ['lion', 'polar bear', 'zebra'];

export default function NameGamePage({ onProgressUpdate }) {
  const videoRef = useRef(null);
  const modelRef = useRef(null); // store model ref so it won't reload
  const currentIndexRef = useRef(0); // track current index for detection loop
  const progressRef = useRef(0); // track progress for detection loop

  const [modelLoaded, setModelLoaded] = useState(false);
  const [message, setMessage] = useState('Loading model...');
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  // Setup camera once
  useEffect(() => {
    async function setupCamera() {
      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    }
    setupCamera();
  }, []);

  // Load model once
  useEffect(() => {
    mobilenet.load().then((loadedModel) => {
      modelRef.current = loadedModel;
      setModelLoaded(true);
      setMessage('Model loaded! Start scanning...');
    });
  }, []);

  // Sync refs when state changes so detection loop has latest values
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    progressRef.current = progress;
    // Also notify parent or main story game page about progress change
    if (typeof onProgressUpdate === 'function') {
      onProgressUpdate(progress);
    }
  }, [progress, onProgressUpdate]);

  // Detection loop - only start when model is loaded
  useEffect(() => {
    if (!modelLoaded) return;

    let isDetecting = false;
    const detectionInterval = setInterval(async () => {
      if (isDetecting) return;
      isDetecting = true;

      try {
        const predictions = await modelRef.current.classify(videoRef.current);
        const topResult = predictions[0]?.className?.toLowerCase();
        const targetAnimal = animalTargets[currentIndexRef.current];

        if (topResult && topResult.includes(targetAnimal)) {
  setMessage(`✅ That is a ${targetAnimal}!`);
  setProgress((prev) => {
    const newProgress = prev + 1;

    if (newProgress >= animalTargets.length) {
      setMessage('🎉 You have found all the animals!');
      clearInterval(detectionInterval);
    } else {
      setTimeout(() => setMessage('Keep scanning...'), 2000);
      setCurrentIndex(prevIndex => Math.min(prevIndex + 1, animalTargets.length - 1));
    }

    return newProgress;
  });
}
else {
          setMessage(`❌ This is not a ${targetAnimal}`);
        }
      } catch (error) {
        console.error('Detection error:', error);
        setMessage('Error detecting animal');
      }

      isDetecting = false;
    }, 2000);

    return () => clearInterval(detectionInterval);
  }, [modelLoaded]);

  return (
    <div className={styles.container}>
      <h1>
        {progress >= animalTargets.length
          ? 'All animals found!'
          : `Can you find the ${animalTargets[currentIndex]}?`}
      </h1>

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
        <button className={styles.button} onClick={() => navigate('/story')}>
          Return to Main Page
        </button>
      )}
    </div>
  );
}

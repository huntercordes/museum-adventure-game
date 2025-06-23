import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import styles from '../styles/LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Basic validation before submit
  const validateForm = () => {
    if (!email) {
      setError('Please enter your email.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date(),
          progress: {
            name: 0,
            quiz: 0,
            sound: 0,
          },
        });
      }

      navigate('/');
    } catch (loginError) {
      if (loginError.code === 'auth/user-not-found') {
        // Try registering the user
        try {
          const newUser = await createUserWithEmailAndPassword(auth, email, password);
          const user = newUser.user;

          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            createdAt: new Date(),
            progress: {
              name: 0,
              quiz: 0,
              sound: 0,
            },
          });

          navigate('/');
        } catch (signupError) {
          setError(signupError.message);
        }
      } else {
        setError(loginError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          disabled={loading}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
          disabled={loading}
        />
        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Login / Register'}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

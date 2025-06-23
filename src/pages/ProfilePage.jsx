import React, { useEffect, useState } from 'react';
import styles from '../styles/ProfilePage.module.css';
import { useAuth } from '../hooks/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background.png';
import hunter from '../assets/hunter.jpeg';

export default function ProfilePage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
        setDisplayName(data.displayName || user.displayName || '');
      }
    };
    fetchUserData();
  }, [user]);

  const totalGamesCompleted =
    (userData?.progress?.name || 0) +
    (userData?.progress?.quiz || 0) +
    (userData?.progress?.sound || 0);

  const showCoupon = totalGamesCompleted === 9;

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      // Only update displayName; photoURL remains unchanged (everyone shares default avatar)
      await updateProfile(user, { displayName });

      // Update Firestore user document
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { displayName });

      alert('Profile updated!');
      setShowModal(false);
      window.location.reload(); // Refresh to show updated profile
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {/* Use same default avatar for all users */}
        <img
          src= {hunter}
          alt="Profile"
          className={styles.avatar}
        />
        <h2>{user?.displayName || 'Guest User'}</h2>
        <button className={styles.editButton} onClick={() => setShowModal(true)}>
          Edit Profile
        </button>
      </div>

      <div className={styles.progressBox}>
        <div className={styles.tabs}>
          <span className={styles.activeTab}>Story Game</span>
          <span>Achievements</span>
        </div>
        <div className={styles.progressBarOuter}>
          <div
            className={styles.progressBarInner}
            style={{ width: `${(totalGamesCompleted / 9) * 100}%` }}
          />
        </div>
        <p>{totalGamesCompleted}/9</p>
      </div>

      <div className={styles.menu}>
        <h3>Collection</h3>
        <button onClick={() => alert('Coming soon!')}>Your collection</button>
        {showCoupon && (
          <button onClick={() => alert('🎉 Your coupon: MUSEUM10')}>🎉 Coupon Codes</button>
        )}

        <h3>Profile</h3>
        <button onClick={() => alert('Account details coming soon!')}>Account details</button>

        <h3>General</h3>
        <button>Language</button>


        <h3>Legal</h3>
        <button>Terms and Conditions</button>
        <button>Privacy Policy</button>

        <button className={styles.logout} onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Edit Profile</h2>
            <label>
              New Display Name:
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </label>

            <div className={styles.modalButtons}>
              <button onClick={() => setShowModal(false)} disabled={isSaving}>
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

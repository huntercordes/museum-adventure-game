import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/BottomNavbar.module.css';
import { FaHome, FaCompass, FaUser } from 'react-icons/fa';

function BottomNavbar() {
  const navigate = useNavigate();

  return (
    <div className={styles.navbar}>
      <button className={styles.iconButton} onClick={() => navigate('/')}>
        <FaHome />
      </button>
      <button className={styles.iconButton} onClick={() => navigate('/story')}>
        <FaCompass />
      </button>
      <button className={styles.iconButton} onClick={() => navigate('/profile')}>
        <FaUser />
      </button>
    </div>
  );
}

export default BottomNavbar;


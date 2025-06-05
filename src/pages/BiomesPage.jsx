// src/pages/BiomesPage.jsx
import React from 'react';
import BiomesSlider from '../components/BiomesSlider';
import styles from '../styles/BiomesPage.module.css';

function BiomesPage() {
  return (
    <div className={styles.page}>
      <BiomesSlider />
    </div>
  );
}

export default BiomesPage;

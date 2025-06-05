import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/BiomesSlider.module.css';
import cardStyles from '../styles/BiomeCard.module.css';
import forestVideo from '../assets/forest.mp4';
import savannaVideo from '../assets/savanna.mp4';
import oceanVideo from '../assets/ocean.mp4';
import jungleVideo from '../assets/jungle.mp4';


const biomes = [
  { title: 'FOREST', src: forestVideo },
  { title: 'SAVANNA', src: savannaVideo },
  { title: 'OCEAN', src: oceanVideo },
  { title: 'JUNGLE', src: jungleVideo },
];

function BiomesSlider() {
  const sliderRef = useRef(null);
  const [currentTitle, setCurrentTitle] = useState(biomes[0].title);

  useEffect(() => {
    const handleScroll = () => {
      const scrollX = sliderRef.current.scrollLeft;
      const width = sliderRef.current.offsetWidth;
      const index = Math.round(scrollX / (width * 0.8 + 20)); // card width + gap
      setCurrentTitle(biomes[index]?.title || biomes[0].title);
    };

    const slider = sliderRef.current;
    slider.addEventListener('scroll', handleScroll);
    return () => slider.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={cardStyles.titleOverlay}>{currentTitle}</div>
      <div className={styles.sliderContainer} ref={sliderRef}>
        {biomes.map((biome, index) => (
          <div key={index} className={styles.cardWrapper}>
            <div className={cardStyles.card}>
              <video
                className={cardStyles.video}
                src={biome.src}
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default BiomesSlider;

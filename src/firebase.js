// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork, getDoc } from "firebase/firestore";
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyDtRYemW6d6-xm0rUNA2b_8Y81lJ9NxsHk",
  authDomain: "museum-app-25a83.firebaseapp.com",
  projectId: "museum-app-25a83",
  storageBucket: "museum-app-25a83.appspot.com",
  messagingSenderId: "1047669053908",
  appId: "1:1047669053908:web:b9adc27c963c7dda9a5e41",
  measurementId: "G-GYH562HEZM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


// (Optional) Force Firestore online
enableNetwork(db).catch((err) => {
  console.error('Error enabling Firestore network:', err);
});

// Helper to retry getDoc in case of offline issues
export async function getDocWithRetry(docRef, retries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const snapshot = await getDoc(docRef); // ✅ fixed
      return snapshot;
    } catch (error) {
      if (error.code === 'unavailable' && attempt < retries) {
        console.warn(`Firestore offline, retrying attempt ${attempt}...`);
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        throw error;
      }
    }
  }
}

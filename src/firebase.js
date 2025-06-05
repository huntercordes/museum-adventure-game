// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtRYemW6d6-xm0rUNA2b_8Y81lJ9NxsHk",
  authDomain: "museum-app-25a83.firebaseapp.com",
  projectId: "museum-app-25a83",
  storageBucket: "museum-app-25a83.firebasestorage.app",
  messagingSenderId: "1047669053908",
  appId: "1:1047669053908:web:b9adc27c963c7dda9a5e41",
  measurementId: "G-GYH562HEZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
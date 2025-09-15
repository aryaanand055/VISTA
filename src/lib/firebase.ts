
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-7608887124-e86fc",
  appId: "1:736587627141:web:6b3164c307aa48fccb47ec",
  storageBucket: "studio-7608887124-e86fc.firebasestorage.app",
  apiKey: "AIzaSyBPtgeucQLKit6bqoTZuMM6mbacVIlbqts",
  authDomain: "studio-7608887124-e86fc.firebaseapp.com",
  messagingSenderId: "736587627141",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

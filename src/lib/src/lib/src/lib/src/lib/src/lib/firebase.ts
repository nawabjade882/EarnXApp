'use client';

import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-2341778168-179e6',
  appId: '1:109486389758:web:690ee4cf2dcde369faa8af',
  apiKey: 'AIzaSyB-NxXmuJ4PAbisI1gpdiNi9VygA1eY7vA',
  authDomain: 'studio-2341778168-179e6.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '109486389758',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};

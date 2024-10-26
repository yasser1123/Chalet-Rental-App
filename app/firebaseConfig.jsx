import { initializeApp } from '@firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';      
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD8bAK12lgZhYtrSM-odzaEjdS_OZmRCdA",
  authDomain: "chalet-rental-app.firebaseapp.com",
  projectId: "chalet-rental-app",
  storageBucket: "chalet-rental-app.appspot.com",
  messagingSenderId: "345787228069",
  appId: "1:345787228069:web:d8466b77e9f0e58900124c"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { app, auth, db };


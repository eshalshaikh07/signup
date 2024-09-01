// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import {GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBiie3izNZuBFGMokKQsahFGIf3M6iV7Lw",
  authDomain: "cepvirtualcampus.firebaseapp.com",
  projectId: "cepvirtualcampus",
  storageBucket: "cepvirtualcampus.appspot.com",
  messagingSenderId: "905682910672",
  appId: "1:905682910672:web:7fbd1930f941fcba7b4dd5",
  measurementId: "G-HM2BT1WBW4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
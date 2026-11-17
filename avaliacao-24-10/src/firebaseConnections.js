// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK66TFytlen00wAGzKs1L9Vlad54oj5kU",
  authDomain: "fatec-756ac.firebaseapp.com",
  projectId: "fatec-756ac",
  storageBucket: "fatec-756ac.firebasestorage.app",
  messagingSenderId: "725885275522",
  appId: "1:725885275522:web:c4eec37db37de31189539b",
  measurementId: "G-1QCMMZKKM1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth};


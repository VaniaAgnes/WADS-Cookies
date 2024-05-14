// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBy_12kWRs0ZGDbP4jLv0ZDL7EQC8YowzM",
  authDomain: "todolist-41bbc.firebaseapp.com",
  projectId: "todolist-41bbc",
  storageBucket: "todolist-41bbc.appspot.com",
  messagingSenderId: "217968942640",
  appId: "1:217968942640:web:979c897e4c5e577009d7f5",
  measurementId: "G-Z949BM6B1D",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

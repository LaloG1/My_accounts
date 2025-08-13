// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtqIYDT58ikGLHxUJHgbkfVADwOsege6g",
  authDomain: "my-accounts-5fa1e.firebaseapp.com",
  projectId: "my-accounts-5fa1e",
  storageBucket: "my-accounts-5fa1e.firebasestorage.app",
  messagingSenderId: "1088581889477",
  appId: "1:1088581889477:web:5f4cacb0256040df096fac",
  measurementId: "G-96GGD9TQQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore
export const db = getFirestore(app);

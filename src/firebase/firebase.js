// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmXrByN1YcuSsz4Vly6f8VLeCa8QcXACE",
  authDomain: "sha8alny-f25b2.firebaseapp.com",
  projectId: "sha8alny-f25b2",
  storageBucket: "sha8alny-f25b2.firebasestorage.app",
  messagingSenderId: "559853106286",
  appId: "1:559853106286:web:3bf3b3726bd9898973627f",
  measurementId: "G-437H9SM5LF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider };
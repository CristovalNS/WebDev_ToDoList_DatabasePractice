// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuKJZErz6VwcNH74punqZP4gILzbA98V4",
  authDomain: "cns-todoapp.firebaseapp.com",
  projectId: "cns-todoapp",
  storageBucket: "cns-todoapp.appspot.com",
  messagingSenderId: "276157345927",
  appId: "1:276157345927:web:13cb83a685a3e3c0580822",
  measurementId: "G-6W71819EB6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication 
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkStUVQjcsSElX55oRM3AWAW4LZGC7kx4",
  authDomain: "disiplinite.firebaseapp.com",
  projectId: "disiplinite",
  storageBucket: "disiplinite.appspot.com",
  messagingSenderId: "729835306045",
  appId: "1:729835306045:web:867ace5ebe16a4e51bbe54",
  measurementId: "G-Z4Q85ZK8HS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export providers
export const googleProvider = new GoogleAuthProvider();
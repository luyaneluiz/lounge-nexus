// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
// import { getAnalytics } from "firebase/analytics"

import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgHZ9_VVrgq3bPulrwlN6P9di_niQQWS4",
  authDomain: "loungenexus-ee957.firebaseapp.com",
  projectId: "loungenexus-ee957",
  storageBucket: "loungenexus-ee957.firebasestorage.app",
  messagingSenderId: "573332150042",
  appId: "1:573332150042:web:23071985d9c1d2bdcc7ea3",
  measurementId: "G-9BEL1MLYP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app)

export const db = getFirestore(app)
export const auth = getAuth(app)

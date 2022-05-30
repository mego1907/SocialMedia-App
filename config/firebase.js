// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALcpYsc7h0BTG5gYDcXdOc4z0ElCSK8Oo",
  authDomain: "socialmedia-shareme-app.firebaseapp.com",
  projectId: "socialmedia-shareme-app",
  storageBucket: "socialmedia-shareme-app.appspot.com",
  messagingSenderId: "36815443390",
  appId: "1:36815443390:web:8013298ab6a938f12195ef",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(); 
export const db = getFirestore();
export const storage = getStorage()
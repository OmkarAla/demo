// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBmdRNy6Z-dO6K2jCAEsbCDNrDx_z-aj6w",
    authDomain: "elective-management-syst-4f710.firebaseapp.com",
    projectId: "elective-management-syst-4f710",
    storageBucket: "elective-management-syst-4f710.firebasestorage.app",
    messagingSenderId: "666024312256",
    appId: "1:666024312256:web:775dfe6a1e9692a284dc25",
    measurementId: "G-6CKZ8DX84T"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();
export { googleProvider, githubProvider, facebookProvider };
export const auth = getAuth(app);  // For Authentication
export const db = getFirestore(app);  // For Firestore Database
export default app;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "myblog-23ba3.firebaseapp.com",
    projectId: "myblog-23ba3",
    storageBucket: "myblog-23ba3.appspot.com",
    messagingSenderId: "841815969154",
    appId: "1:841815969154:web:459e32a6dacd250cbf539b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

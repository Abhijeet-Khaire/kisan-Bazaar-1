import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBiYxahPB6kjpJ5sLOXurPXcDE7ZIGhr2c",
    authDomain: "kisan-bazzar-c7856.firebaseapp.com",
    projectId: "kisan-bazzar-c7856",
    storageBucket: "kisan-bazzar-c7856.firebasestorage.app",
    messagingSenderId: "800353297880",
    appId: "1:800353297880:web:bb7e4be6177181b1593ead"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgLZbki_oRXVHJYS-FlMUdlME-zZcvwyE",
  authDomain: "talktalk-5dc04.firebaseapp.com",
  databaseURL: "https://talktalk-5dc04-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "talktalk-5dc04",
  storageBucket: "talktalk-5dc04.appspot.com",
  messagingSenderId: "645583608369",
  appId: "1:645583608369:web:074ac3eb8188168ef01310"
};

// Initialize Firebase
const cnfg = initializeApp(firebaseConfig);

export default cnfg;
export const auth = getAuth(cnfg);
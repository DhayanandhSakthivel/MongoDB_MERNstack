// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyACzj4TiAPPee6vu18GuTj5Eg3VODhzuyg",
  authDomain: "indeed-3f728.firebaseapp.com",
  projectId: "indeed-3f728",
  storageBucket: "indeed-3f728.appspot.com",
  messagingSenderId: "511574966217",
  appId: "1:511574966217:web:4e36f5c922ce2eadd2f218",
  measurementId: "G-BPCPWER0BM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


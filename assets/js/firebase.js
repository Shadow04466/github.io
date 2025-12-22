
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAc3G14YFLUtEfRZWjmGBU4OEzOrbK77fM",
  authDomain: "my-earning-blog.firebaseapp.com",
  projectId: "my-earning-blog",
  storageBucket: "my-earning-blog.firebasestorage.app",
  messagingSenderId: "591454593500",
  appId: "1:591454593500:web:fac21a06e5faa542f1af19",
  measurementId: "G-XG6V1Z5TVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

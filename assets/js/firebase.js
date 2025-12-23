// Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Firebase Auth
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🔴 YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAc3G14YFLUtEfRZWjmGBU4OEzOrbK77fM",
  authDomain: "my-earning-blog.firebaseapp.com",
  projectId: "my-earning-blog",
  storageBucket: "my-earning-blog.appspot.com",
  messagingSenderId: "591454593500",
  appId: "1:591454593500:web:fac21a06e5faa542f1af19"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT BOTH SERVICES
export const auth = getAuth(app);
export const db = getFirestore(app);

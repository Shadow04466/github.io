import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

loginBtn?.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      msg.innerText = err.message;
    });
});

// 🔐 Protect dashboard
onAuthStateChanged(auth, user => {
  if (!user && location.pathname.includes("dashboard")) {
    window.location.href = "login.html";
  }
});

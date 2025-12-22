// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-qYLlMKvKNiWpnI8MJopb66upMJXsi4Q",
  authDomain: "my-blog-b2e82.firebaseapp.com",
  projectId: "my-blog-b2e82",
  storageBucket: "my-blog-b2e82.firebasestorage.app",
  messagingSenderId: "1036391165706",
  appId: "1:1036391165706:web:c745462a77876afa0dd4f3",
  measurementId: "G-CLCK96ZMLR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let posts = JSON.parse(localStorage.getItem("posts")) || [];

function login() {
 /*
  if (user.value === "admin" && pass.value === "Shadowlpha") {
    localStorage.setItem("login", true);
    location.href = "admin.html";
  } else alert("Wrong login");
}
*/
if (location.pathname.includes("admin") && !localStorage.getItem("login")) {
  location.href = "login.html";
}

function addPost() {
  posts.push({
    title: title.value,
    image: image.value,
    category: category.value,
    content: content.value,
    comments: []
  });
  localStorage.setItem("posts", JSON.stringify(posts));
  alert("Post Published!");
}

function showPosts() {
  let box = document.getElementById("posts");
  if (!box) return;
  box.innerHTML = "";
  posts.forEach((p, i) => {
    box.innerHTML += `
    <div class="post" data-category="${p.category}">
      <h2>${p.title}</h2>
      <img src="${p.image}">
      <p>${p.content}</p>

      <input placeholder="Comment..." onkeypress="addComment(event,${i})">
      <div>${p.comments.join("<br>")}</div>
    </div>`;
  });
}

function addComment(e, i) {
  if (e.key === "Enter") {
    posts[i].comments.push(e.target.value);
    localStorage.setItem("posts", JSON.stringify(posts));
    showPosts();
  }
}

function filterPosts(c) {
  document.querySelectorAll(".post").forEach(p => {
    p.style.display = c === "all" || p.dataset.category === c ? "block" : "none";
  });
}

document.getElementById("search")?.addEventListener("keyup", function () {
  let v = this.value.toLowerCase();
  document.querySelectorAll(".post").forEach(p => {
    p.style.display = p.innerText.toLowerCase().includes(v) ? "block" : "none";
  });
});

function toggleDark() {
  document.body.classList.toggle("dark");
}

showPosts();





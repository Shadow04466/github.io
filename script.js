// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, increment } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let posts = JSON.parse(localStorage.getItem("posts")) || [];

function login() {
  if (user.value === "admin" && pass.value === "Shadowlpha") {
    localStorage.setItem("login", true);
    location.href = "admin.html";
  } else alert("Wrong login");
}

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



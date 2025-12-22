
import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const postsBox = document.getElementById("posts");
const postBox = document.getElementById("post");

// 🔹 BLOG LIST (index.html)
if (postsBox) {
  loadPosts();
}

async function loadPosts() {
  const snap = await getDocs(collection(db, "posts"));
  postsBox.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();
    if (p.status !== "publish") return;

    postsBox.innerHTML += `
  <div class="col-sm-10 col-md-6 col-lg-4">
    <div class="card h-100 blog-card">
      ${p.image ? `<img src="${p.image}" class="card-img-top">` : ""}
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${p.title}</h5>
        <p class="card-text flex-grow-1">
          ${p.content.substring(0,120)}...
        </p>
        <a href="post.html?id=${d.id}" class="btn btn-outline-primary mt-auto">
          Read More →
        </a>
      </div>
    </div>
  </div>
`;
  });
}

// 🔹 SINGLE POST (post.html)
if (postBox) {
  const id = new URLSearchParams(location.search).get("id");
  if (id) loadSinglePost(id);
}

async function loadSinglePost(id) {
  const ref = doc(db, "posts", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    postBox.innerHTML = "Post not found";
    return;
  }

  const p = snap.data();

  document.getElementById("pageTitle").innerText = p.title;
  document.getElementById("metaDesc").content =
    p.content.substring(0, 150);

  postBox.innerHTML = `
    <h1>${p.title}</h1>
    ${p.image ? `<img src="${p.image}">` : ""}
    <p>${p.content}</p>
  `;

  document.getElementById("likeCount").innerText = p.likes || 0;

  document.getElementById("likeBtn").onclick = async () => {
    await updateDoc(ref, { likes: increment(1) });
    document.getElementById("likeCount").innerText++;
  };
}

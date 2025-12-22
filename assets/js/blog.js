import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ======================
   DOM ELEMENTS
====================== */
const postsBox = document.getElementById("posts");
const postBox = document.getElementById("post");
const categoryBox = document.getElementById("categories");

let allPosts = [];

/* ======================
   LOAD POSTS (HOME PAGE)
====================== */
async function loadPosts() {
  const snap = await getDocs(collection(db, "posts"));
  allPosts = [];

  snap.forEach(d => {
    const p = d.data();

    // ✅ STATUS CHECK (FIXED)
    if (!p.status || p.status.toLowerCase() !== "publish") return;

    allPosts.push({
      id: d.id,
      ...p
    });
  });

  renderPosts(allPosts);
}

/* ======================
   RENDER POSTS
====================== */
function renderPosts(posts) {
  postsBox.innerHTML = "";

  if (posts.length === 0) {
    postsBox.innerHTML = `<p class="text-center text-muted">No posts found</p>`;
    return;
  }

  // 🔹 First 3 normal cards
  posts.slice(0, 3).forEach(p => {
    postsBox.innerHTML += `
      <div class="col-12">
        <div class="ad-box">
          Advertisement
          <small>In-feed Ad</small>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card h-100 blog-card">
          ${p.image ? `<img src="${p.image}" class="card-img-top">` : ""}
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text flex-grow-1">
              ${p.content.substring(0, 100)}...
            </p>
            <a href="post.html?id=${p.id}" class="btn btn-outline-primary mt-auto">
              Read More →
            </a>
          </div>
        </div>
      </div>
    `;
  });

  // 🔥 Featured post (4th)
  if (posts[3]) {
    const p = posts[3];
    postsBox.innerHTML += `
      <div class="col-12">
        <div class="card featured-card mt-4">
          <div class="row g-0">
            <div class="col-md-6">
              ${p.image ? `<img src="${p.image}" class="img-fluid featured-img">` : ""}
            </div>
            <div class="col-md-6 d-flex align-items-center">
              <div class="card-body">
                <span class="badge bg-dark mb-2">Featured</span>
                <h3 class="card-title">${p.title}</h3>
                <p class="card-text">
                  ${p.content.substring(0, 180)}...
                </p>
                <a href="post.html?id=${p.id}" class="btn btn-dark">
                  Read Full Article →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/* ======================
   CATEGORY FILTER
====================== */
if (categoryBox) {
  categoryBox.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBox.querySelectorAll("button")
        .forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.dataset.cat;
      if (cat === "all") {
        renderPosts(allPosts);
      } else {
        renderPosts(allPosts.filter(p => p.category === cat));
      }
    });
  });
}

/* ======================
   SINGLE POST PAGE
====================== */
if (postBox) {
  const id = new URLSearchParams(location.search).get("id");
  if (id) loadSinglePost(id);
}

async function loadSinglePost(id) {
  const ref = doc(db, "posts", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    postBox.innerHTML = "<p>Post not found</p>";
    return;
  }

  const p = snap.data();

  document.getElementById("pageTitle").innerText = p.title;
  document.getElementById("metaDesc").content =
    p.content.substring(0, 150);

  postBox.innerHTML = `
    <h1>${p.title}</h1>
    ${p.image ? `<img src="${p.image}" class="img-fluid mb-3">` : ""}
    <p>${p.content}</p>
  `;

  document.getElementById("likeCount").innerText = p.likes || 0;

  document.getElementById("likeBtn").onclick = async () => {
    await updateDoc(ref, { likes: increment(1) });
    document.getElementById("likeCount").innerText++;
  };
}

/* ======================
   INIT
====================== */
if (postsBox) loadPosts();

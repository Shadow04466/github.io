import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  increment,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ======================
   DOM ELEMENTS
====================== */
const postsBox = document.getElementById("posts");
const postBox = document.getElementById("post");
const trendingBox = document.getElementById("trending");

let allPosts = [];

/* ======================
   LOAD POSTS (HOME)
====================== */
async function loadPosts() {
  const snap = await getDocs(collection(db, "posts"));
  allPosts = [];

  snap.forEach(d => {
    const p = d.data();
    if (p.status !== "publish") return;

    allPosts.push({
      id: d.id,
      ...p
    });
  });

  renderPosts();
}

/* ======================
   RENDER POSTS (HOME)
====================== */
function renderPosts() {
  if (!postsBox) return;

  postsBox.innerHTML = "";

  allPosts.forEach(p => {
    postsBox.innerHTML += `
      <div class="col-md-4">
        <div class="card blog-card h-100">
          ${p.image ? `<img src="${p.image}" class="card-img-top">` : ""}
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text">
              ${stripHtml(p.content).substring(0,120)}...
            </p>
            <a href="post.html?id=${p.id}" class="mt-auto text-primary">
              Read →
            </a>
          </div>
        </div>
      </div>
    `;
  });

  loadTrending();
}

/* ======================
   SINGLE POST PAGE
====================== */
async function loadSinglePost(id) {
  const ref = doc(db, "posts", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    postBox.innerHTML = "<p>Post not found</p>";
    return;
  }

  const p = snap.data();

  // SEO
  document.getElementById("pageTitle").innerText = p.title;
  document.getElementById("metaDesc").content =
    stripHtml(p.content).substring(0,150);

  // ✅ IMAGE FIXED HERE
  postBox.innerHTML = `
    <article class="blog-post">

      <h1 class="blog-title">${p.title}</h1>

      ${
        p.image
          ? `<img src="${p.image}"
                 alt="${p.title}"
                 class="blog-featured-img">`
          : ""
      }

      <div class="blog-content">
        ${p.content}
      </div>

    </article>
  `;

  document.getElementById("likeCount").innerText = p.likes || 0;

  document.getElementById("likeBtn").onclick = async () => {
    await updateDoc(ref, { likes: increment(1) });
    document.getElementById("likeCount").innerText++;
  };
}

/* ======================
   TRENDING POSTS
====================== */
function loadTrending() {
  if (!trendingBox) return;

  trendingBox.innerHTML = "";

  [...allPosts]
    .sort((a,b) => (b.likes || 0) - (a.likes || 0))
    .slice(0,5)
    .forEach(p => {
      trendi

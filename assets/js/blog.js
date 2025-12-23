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
   DOM ELEMENTS (SAFE)
====================== */
const postsBox = document.getElementById("posts");
const postBox = document.getElementById("post");
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

/* ======================
   HOME PAGE POSTS
====================== */
async function loadPosts() {
  if (!postsBox) return;

  const snap = await getDocs(collection(db, "posts"));
  postsBox.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();

    // ✅ SAFE STATUS CHECK
    if (!p.status || p.status !== "publish") return;

    postsBox.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 blog-card">
          ${p.image ? `<img src="${p.image}" class="card-img-top" alt="${p.title}">` : ""}
          <div class="card-body">
            <h5>${p.title || ""}</h5>
            <p>${stripHtml(p.content || "").substring(0,120)}...</p>
            <a href="post.html?id=${d.id}">Read</a>
          </div>
        </div>
      </div>
    `;
  });
}

/* ======================
   SINGLE POST PAGE
====================== */
async function loadSinglePost(id) {
  if (!postBox) return;

  const ref = doc(db, "posts", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    postBox.innerHTML = "<p>Post not found</p>";
    return;
  }

  const p = snap.data();

  // SEO
  const pageTitle = document.getElementById("pageTitle");
  const metaDesc = document.getElementById("metaDesc");

  if (pageTitle) pageTitle.innerText = p.title || "";
  if (metaDesc) {
    metaDesc.content = stripHtml(p.content || "").substring(0, 150);
  }

  // ✅ IMAGE RENDER (FIXED)
  postBox.innerHTML = `
    <article class="blog-post">
      <h1 class="blog-title">${p.title || ""}</h1>

      ${
        p.image
          ? `<img src="${p.image}"
                 alt="${p.title || ""}"
                 class="blog-featured-img">`
          : ""
      }

      <div class="blog-content">
        ${p.content || ""}
      </div>
    </article>
  `;

  // Likes (SAFE)
  if (likeCount) likeCount.innerText = p.likes || 0;

  if (likeBtn) {
    likeBtn.onclick = async () => {
      await updateDoc(ref, { likes: increment(1) });
      likeCount.innerText = Number(likeCount.innerText) + 1;
    };
  }
}

/* ======================
   HELPERS
====================== */
function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

/* ======================
   INIT (SAFE)
====================== */
if (postsBox) {
  loadPosts().catch(console.error);
}

if (postBox) {
  const id = new URLSearchParams(window.location.search).get("id");
  if (id) {
    loadSinglePost(id).catch(console.error);
  }
}

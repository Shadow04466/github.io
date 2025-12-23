import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ======================
   DOM ELEMENTS
====================== */
const titleInput = document.getElementById("title");
const imageInput = document.getElementById("image");
const contentInput = document.getElementById("content");
const statusSelect = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");
const postsBox = document.getElementById("postList");

let editId = null;

/* ======================
   LOAD POSTS
====================== */
async function loadPosts() {
  console.log("loadPosts running...");

  if (!postsBox) {
    console.error("❌ postList not found in HTML");
    return;
  }

  postsBox.innerHTML = "";

  try {
    const snap = await getDocs(collection(db, "posts"));
    console.log("Posts found:", snap.size);

    if (snap.size === 0) {
      postsBox.innerHTML = "<p class='text-muted'>No posts found</p>";
      return;
    }

    snap.forEach(d => {
      const p = d.data();

      postsBox.innerHTML += `
        <div class="border rounded p-3 mb-3">
          <strong>${p.title}</strong>
          <small class="text-muted"> (${p.status})</small>

          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary me-2"
              onclick="editPost('${d.id}')">Edit</button>

            <button class="btn btn-sm btn-danger"
              onclick="deletePost('${d.id}')">Delete</button>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Firestore error:", err);
    postsBox.innerHTML =
      "<p class='text-danger'>Error loading posts</p>";
  }
}

/* ======================
   SAVE / UPDATE POST
====================== */
saveBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const image = imageInput.value.trim();
  const content = contentInput.value.trim();
  const status = statusSelect.value;

  if (!title || !content) {
    alert("Title and Content are required");
    return;
  }

  if (editId) {
    await updateDoc(doc(db, "posts", editId), {
      title,
      image,
      content,
      status
    });
    editId = null;
    saveBtn.innerText = "Save Post";
  } else {
    await addDoc(collection(db, "posts"), {
      title,
      image,
      content,
      status,
      category: "testing",
      likes: 0,
      createdAt: serverTimestamp()
    });
  }

  clearForm();
  loadPosts();
});

/* ======================
   EDIT POST
====================== */
window.editPost = async (id) => {
  const snap = await getDocs(collection(db, "posts"));
  snap.forEach(d => {
    if (d.id === id) {
      const p = d.data();
      titleInput.value = p.title || "";
      imageInput.value = p.image || "";
      contentInput.value = p.content || "";
      statusSelect.value = p.status || "publish";
      editId = id;
      saveBtn.innerText = "Update Post";
    }
  });
};

/* ======================
   DELETE POST
====================== */
window.deletePost = async (id) => {
  if (!confirm("Delete this post?")) return;
  await deleteDoc(doc(db, "posts", id));
  loadPosts();
};

/* ======================
   HELPERS
====================== */
function clearForm() {
  titleInput.value = "";
  imageInput.value = "";
  contentInput.value = "";
  statusSelect.value = "publish";
}

/* ======================
   INIT
====================== */
document.addEventListener("DOMContentLoaded", loadPosts);

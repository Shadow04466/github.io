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
const postsBox = document.getElementById("postList"); // ✅ IMPORTANT

let editId = null;

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

  try {
    if (editId) {
      console.log("Updating post:", editId);

      await updateDoc(doc(db, "posts", editId), {
        title,
        image,
        content,
        status
      });

      editId = null;
      saveBtn.innerText = "Save Post";
    } else {
      console.log("Creating new post");

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
  } catch (err) {
    console.error("Save error:", err);
    alert("Error saving post. Check console.");
  }
});

/* ======================
   LOAD POSTS
====================== */
async function loadPosts() {
  console.log("loadPosts running...");
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
      console.log("Post:", p.title);

      postsBox.innerHTML += `
        <div class="border rounded p-3 mb-3">
          <strong>${p.title}</strong>
          <small class="text-muted"> (${p.status})</small>

          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary me-2"
              onclick="editPost('${d.id}')">
              Edit
            </button>

            <button class="btn btn-sm btn-danger"
              onclick="deletePost('${d.id}')">
              Delete
            </button>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Load error:", err);
    postsBox.innerHTML = "<p class='text-danger'>Error loading posts</p>";
  }
}

/* ======================
   EDIT POST
====================== */
window.editPost = async (id) => {
  console.log("Editing post:", id);

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

  try {
    await deleteDoc(doc(db, "posts", id));
    console.log("Deleted post:", id);
    loadPosts();
  } catch (err) {
    console.error("Delete error:", err);
  }
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
loadPosts();

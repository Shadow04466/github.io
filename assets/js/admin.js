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
   LOAD POSTS
====================== */
async function loadPosts() {
  postsBox.innerHTML = "";

  const snap = await getDocs(collection(db, "posts"));

  snap.forEach(d => {
    const p = d.

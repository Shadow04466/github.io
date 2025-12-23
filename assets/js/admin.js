import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { signOut } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

  const title = document.getElementById("title");
  const image = document.getElementById("image");
  const status = document.getElementById("status");
  const saveBtn = document.getElementById("saveBtn");
  const postList = document.getElementById("postList");

  let editId = null;

  // TinyMCE
  tinymce.init({
    selector: '#content',
    height: 400,
    menubar: false,
    plugins: 'lists link image code',
    toolbar: 'undo redo | bold italic | h2 h3 | bullist numlist | link image | code',
    branding: false
  });

  saveBtn.onclick = async () => {
    const content = tinymce.get("content").getContent();

    if (!title.value || !content) {
      alert("Title & content required");
      return;
    }

    if (editId) {
      await updateDoc(doc(db, "posts", editId), {
        title: title.value,
        image: image.value,
        content,
        status: status.value
      });
      editId = null;
      saveBtn.innerText = "Save Post";
    } else {
      await addDoc(collection(db, "posts"), {
        title: title.value,
        image: image.value,
        content,
        status: status.value,
        likes: 0,
        createdAt: serverTimestamp()
      });
    }

    clearForm();
    loadPosts();
  };

  async function loadPosts() {
    postList.innerHTML = "";
    const snap = await getDocs(collection(db, "posts"));

    snap.forEach(d => {
      const p = d.data();
      postList.innerHTML += `
        <div class="border p-2 mb-2">
          <b>${p.title}</b> (${p.status})
          <br>
          <button onclick="editPost('${d.id}')" class="btn btn-sm btn-outline-primary">Edit</button>
          <button onclick="deletePost('${d.id}')" class="btn btn-sm btn-danger">Delete</button>
        </div>
      `;
    });
  }

  window.editPost = async (id) => {
    const snap = await getDocs(collection(db, "posts"));
    snap.forEach(d => {
      if (d.id === id) {
        const p = d.data();
        title.value = p.title;
        image.value = p.image;
        status.value = p.status;
        tinymce.get("content").setContent(p.content);
        editId = id;
        saveBtn.innerText = "Update Post";
      }
    });
  };

  window.deletePost = async (id) => {
    if (confirm("Delete post?")) {
      await deleteDoc(doc(db, "posts", id));
      loadPosts();
    }
  };

  window.logout = async () => {
    await signOut(auth);
    location.href = "login.html";
  };

  function clearForm() {
    title.value = "";
    image.value = "";
    tinymce.get("content").setContent("");
    status.value = "publish";
  }

  loadPosts();
});

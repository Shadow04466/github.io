postList.innerHTML += `
  <div class="post-item">
    <div>
      <b>${p.title}</b>
      <small class="text-muted">(${p.status})</small>
    </div>
    <div>
      <button class="btn btn-sm btn-warning"
        onclick="editPost('${docSnap.id}','${p.title}','${p.image}','${p.content}','${p.status}')">
        Edit
      </button>

      <button class="btn btn-sm btn-danger"
        onclick="deletePost('${docSnap.id}')">
        Delete
      </button>
    </div>
  </div>
`;

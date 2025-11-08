const postsContainer = document.getElementById("postsContainer");
const API_URL = "https://iqtiboslar-backend.onrender.com/api/posts";
const SUB_URL = "https://iqtiboslar-backend.onrender.com/api/subscribers";

const commentModal = document.getElementById("commentModal");
const closeModal = document.querySelector(".close");
const submitCommentBtn = document.getElementById("submitComment");
const thankYouMessage = document.getElementById("thankYouMessage");
const subscribeBtn = document.getElementById("subscribeBtn");
const subscribeMessage = document.getElementById("subscribeMessage");
const userCommentInput = document.getElementById("userComment");
const subName = document.getElementById("subName");
const subEmail = document.getElementById("subEmail");
const subPhone = document.getElementById("subPhone");

let currentPostId = null;

// --- Fetch Posts ---
async function fetchPosts() {
  try {
    const res = await fetch(API_URL);
    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    console.error(err);
    postsContainer.innerHTML = "<p>Postlarni yuklab bo‘lmadi.</p>";
  }
}

// --- Render Posts ---
function renderPosts(posts) {
  postsContainer.innerHTML = "";
  posts.forEach(post => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");

    let commentsHTML = "";
    post.comments.forEach(c => {
      commentsHTML += `<p><strong>${c.user}:</strong> ${c.comment}</p>`;
    });

    postCard.innerHTML = `
      <img src="${post.coverImage}" alt="${post.title}">
      <div class="post-content">
        <h2>${post.title}</h2>
        <h3>${post.author}</h3>
        <p>${post.excerpt}</p>
        <button class="comment-btn" data-id="${post._id}">Fikringizni qoldiring</button>
        <div class="comments">${commentsHTML}</div>
      </div>
    `;

    postsContainer.appendChild(postCard);
  });

  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPostId = btn.dataset.id;
      userCommentInput.value = "";
      submitCommentBtn.disabled = false;
      thankYouMessage.classList.add("hidden");
      commentModal.style.display = "flex";
    });
  });
}

// --- Modal ---
closeModal.onclick = () => commentModal.style.display = "none";
window.onclick = e => {
  if (e.target === commentModal) commentModal.style.display = "none";
};

// --- Submit Comment ---
submitCommentBtn.onclick = async () => {
  const comment = userCommentInput.value.trim();
  const user = subName.value.trim(); // ism maydonidan olamiz
  if (!user || !comment) return alert("Iltimos, ism va fikringizni yozing.");

  try {
    const res = await fetch(`${API_URL}/${currentPostId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, comment })
    });
    const data = await res.json();
    if (data.success) {
      thankYouMessage.classList.remove("hidden");
      submitCommentBtn.disabled = true;
      fetchPosts();
    } else {
      alert("Comment qo‘shishda xato yuz berdi.");
    }
  } catch (err) {
    console.error(err);
    alert("Server bilan ulanishda xato.");
  }
};

// --- Subscribe ---
subscribeBtn.onclick = async () => {
  const name = subName.value.trim();
  const email = subEmail.value.trim();
  const phone = subPhone.value.trim();
  if (!name || !email || !phone) return alert("Iltimos, barcha maydonlarni to‘ldiring.");

  try {
    const res = await fetch(SUB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone })
    });
    const data = await res.json();
    if (data.success) {
      subscribeMessage.textContent = "Siz muvaffaqiyatli azo bo'ldingiz!";
      subscribeMessage.classList.remove("hidden");
      subName.value = "";
      subEmail.value = "";
      subPhone.value = "";
    } else {
      alert("Ma’lumot saqlanmadi.");
    }
  } catch (err) {
    console.error(err);
    alert("Server bilan ulanishda xato.");
  }
};

fetchPosts();

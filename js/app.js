const postsContainer = document.getElementById("postsContainer");
const API_URL = "https://iqtiboslar-backend.onrender.com"; // backend bilan moslashtiring

// Modal elementlari
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

let currentPostIndex = null; // qaysi postga comment yozilayotgani

// --- Fetch Posts ---
async function fetchPosts() {
  try {
    const res = await fetch(API_URL);
    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    console.error("Postlarni olishda xato:", err);
    postsContainer.innerHTML = "<p>Postlarni yuklab bo‘lmadi.</p>";
  }
}

// --- Render Posts ---
function renderPosts(posts) {
  postsContainer.innerHTML = "";
  posts.forEach((post, index) => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");

    postCard.innerHTML = `
      <img src="${post.coverImage}" alt="${post.title}">
      <div class="post-content">
        <h2>${post.title}</h2>
        <h3>${post.author}</h3>
        <p>${post.excerpt}</p>
        <button class="comment-btn" data-index="${index}">Fikringizni qoldiring</button>
      </div>
    `;

    postsContainer.appendChild(postCard);
  });

  // Tugmalarni event bilan bog‘lash
  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPostIndex = btn.dataset.index;
      userCommentInput.value = "";
      submitCommentBtn.disabled = false;
      thankYouMessage.classList.add("hidden");
      commentModal.style.display = "flex";
    });
  });
}

// --- Modalni yopish ---
closeModal.onclick = () => commentModal.style.display = "none";
window.onclick = e => {
  if (e.target === commentModal) commentModal.style.display = "none";
  if (e.target === thankYouMessage) thankYouMessage.style.display = "none";
};

// --- Comment yuborish ---
submitCommentBtn.onclick = async () => {
  const comment = userCommentInput.value.trim();
  if (!comment) return alert("Iltimos, fikringizni yozing.");

  try {
    const res = await fetch(`${API_URL}/${currentPostIndex}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment })
    });

    const data = await res.json();

    if (data.success) {
      thankYouMessage.classList.remove("hidden");
      submitCommentBtn.disabled = true;
      fetchPosts(); // comment qo‘shilgandan keyin postlarni yangilash
    } else {
      alert("Comment qo‘shishda xato yuz berdi.");
    }
  } catch (err) {
    console.error(err);
    alert("Server bilan ulanishda xato.");
  }
};

// --- Azo bo‘lish ---
subscribeBtn.onclick = () => {
  const name = subName.value.trim();
  const email = subEmail.value.trim();
  const phone = subPhone.value.trim();

  if (!name || !email || !phone) return alert("Iltimos, barcha maydonlarni to‘ldiring.");

  subscribeMessage.textContent = "Siz muvaffaqiyatli azo bo'ldingiz!";
  subscribeMessage.classList.remove("hidden");
  subName.value = "";
  subEmail.value = "";
  subPhone.value = "";
};

// --- Sahifa yuklanganda ---
fetchPosts();

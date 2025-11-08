const postsContainer = document.getElementById("postsContainer");
const API_URL = "https://iqtiboslar-backend.onrender.com/api/posts"; // Render backend URL

// Modal elementlari
const commentModal = document.getElementById("commentModal");
const closeModal = document.querySelector(".close");
const submitCommentBtn = document.getElementById("submitComment");
const thankYouMessage = document.getElementById("thankYouMessage");
const subscribeBtn = document.getElementById("subscribeBtn");
const subscribeMessage = document.getElementById("subscribeMessage");
const userCommentInput = document.getElementById("userComment");
const userNameInput = document.getElementById("subName"); // Foydalanuvchi ismi
const userEmailInput = document.getElementById("subEmail"); // Email
const userPhoneInput = document.getElementById("subPhone"); // Telefon

let currentPostId = null; // Qaysi postga comment yozilayotgani

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
  posts.forEach(post => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");

    // Commentlarni render qilish
    const commentsHTML = post.comments.map(c => `<p><strong>${c.user}:</strong> ${c.comment}</p>`).join("");

    postCard.innerHTML = `
      <img src="${post.coverImage}" alt="${post.title}">
      <div class="post-content">
        <h2>${post.title}</h2>
        <h3>${post.author}</h3>
        <p>${post.excerpt}</p>
        <button class="comment-btn" data-id="${post._id}">Fikringizni qoldiring</button>
        <div class="comments-section">
          ${commentsHTML}
        </div>
      </div>
    `;

    postsContainer.appendChild(postCard);
  });

  // Tugmalarni event bilan bog‘lash
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

// --- Modalni yopish ---
closeModal.onclick = () => commentModal.style.display = "none";
window.onclick = e => {
  if (e.target === commentModal) commentModal.style.display = "none";
};

// --- Comment yuborish ---
submitCommentBtn.onclick = async () => {
  const comment = userCommentInput.value.trim();
  const user = userNameInput.value.trim();

  if (!user || !comment) return alert("Iltimos, ism va fikringizni kiriting.");

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
      fetchPosts(); // Comment qo‘shilgandan keyin postlarni yangilash
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
  const name = userNameInput.value.trim();
  const email = userEmailInput.value.trim();
  const phone = userPhoneInput.value.trim();

  if (!name || !email || !phone) return alert("Iltimos, barcha maydonlarni to‘ldiring.");

  subscribeMessage.textContent = "Siz muvaffaqiyatli azo bo'ldingiz!";
  subscribeMessage.classList.remove("hidden");

  // Maydonlarni tozalash
  userNameInput.value = "";
  userEmailInput.value = "";
  userPhoneInput.value = "";
};

// --- Sahifa yuklanganda ---
fetchPosts();

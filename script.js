let state = {
  query: "",
  genre: "Все",
  favOnly: false,
  favorites: JSON.parse(localStorage.getItem("av-favs") || "[]")
};

const grid = document.getElementById("grid");
const topList = document.getElementById("topList");
const genreFilters = document.getElementById("genreFilters");
const searchInput = document.getElementById("search");
const favCount = document.getElementById("favCount");
const favLink = document.getElementById("favLink");
const emptyMsg = document.getElementById("emptyMsg");
const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function saveFavs() {
  localStorage.setItem("av-favs", JSON.stringify(state.favorites));
}

function isFav(id) {
  return state.favorites.includes(id);
}

function toggleFav(id) {
  if (isFav(id)) {
    state.favorites = state.favorites.filter(f => f !== id);
  } else {
    state.favorites.push(id);
  }
  saveFavs();
  favCount.textContent = state.favorites.length;
  render();
}

function filtered() {
  const q = state.query.trim().toLowerCase();
  return ANIME.filter(a => {
    const matchQ = !q || a.title.toLowerCase().includes(q) || a.genres.some(g => g.toLowerCase().includes(q));
    const matchG = state.genre === "Все" || a.genres.includes(state.genre);
    const matchF = !state.favOnly || isFav(a.id);
    return matchQ && matchG && matchF;
  });
}

function makeCard(a) {
  const card = document.createElement("div");
  card.className = "card";

  const rating = document.createElement("div");
  rating.className = "card-rating";
  rating.textContent = "★ " + a.rating.toFixed(1);

  const fav = document.createElement("button");
  fav.className = "fav-btn";
  fav.textContent = isFav(a.id) ? "💖" : "🤍";
  fav.title = "В избранное";
  fav.addEventListener("click", e => {
    e.stopPropagation();
    toggleFav(a.id);
  });

  const poster = document.createElement("div");
  poster.className = "poster";
  poster.style.background = a.gradient;
  poster.textContent = a.symbol;

  const info = document.createElement("div");
  info.className = "card-info";
  const title = document.createElement("div");
  title.className = "card-title";
  title.textContent = a.title;
  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.textContent = a.year + " · " + a.genres.slice(0, 2).join(", ");
  info.append(title, meta);

  card.append(rating, fav, poster, info);
  card.addEventListener("click", () => openModal(a));
  return card;
}

function render() {
  const list = filtered();

  grid.innerHTML = "";
  list.forEach(a => grid.appendChild(makeCard(a)));
  emptyMsg.hidden = list.length > 0;

  if (state.favOnly && list.length === 0) {
    emptyMsg.textContent = "В избранном пока пусто 💔 Жми 🤍 на карточках.";
  } else {
    emptyMsg.textContent = "Ничего не найдено 😔 Попробуй другой запрос.";
  }

  const genres = ["Все", ...new Set(ANIME.flatMap(a => a.genres))];
  genreFilters.innerHTML = "";
  genres.forEach(g => {
    const chip = document.createElement("button");
    chip.className = "chip" + (state.genre === g ? " active" : "");
    chip.textContent = g;
    chip.addEventListener("click", () => {
      state.genre = g;
      render();
    });
    genreFilters.appendChild(chip);
  });

  const top = [...ANIME].sort((a, b) => b.rating - a.rating).slice(0, 5);
  topList.innerHTML = "";
  top.forEach((a, i) => {
    const item = document.createElement("div");
    item.className = "top-item";
    const place = document.createElement("div");
    place.className = "top-place";
    place.textContent = i + 1;
    const title = document.createElement("div");
    title.className = "top-title";
    title.textContent = a.title;
    const meta = document.createElement("div");
    meta.className = "top-meta";
    meta.textContent = a.genres.join(", ");
    const rating = document.createElement("div");
    rating.className = "top-rating";
    rating.textContent = "★ " + a.rating.toFixed(1);
    item.append(place, title, meta, rating);
    item.addEventListener("click", () => openModal(a));
    topList.appendChild(item);
  });
}

function openModal(a) {
  modalBody.innerHTML = "";

  const hero = document.createElement("div");
  hero.className = "modal-hero";

  const poster = document.createElement("div");
  poster.className = "poster";
  poster.style.background = a.gradient;
  poster.textContent = a.symbol;

  const text = document.createElement("div");
  const title = document.createElement("div");
  title.className = "modal-title";
  title.textContent = a.title;
  const meta = document.createElement("div");
  meta.className = "modal-meta";
  meta.textContent = "★ " + a.rating.toFixed(1) + " · " + a.episodes + (a.episodes === 1 ? " фильм" : " эп.");
  const year = document.createElement("div");
  year.className = "modal-year";
  year.textContent = "Год: " + a.year;
  const desc = document.createElement("div");
  desc.className = "modal-desc";
  desc.textContent = a.desc;
  const tags = document.createElement("div");
  tags.className = "modal-tags";
  a.genres.forEach(g => {
    const t = document.createElement("span");
    t.className = "tag";
    t.textContent = g;
    tags.appendChild(t);
  });
  text.append(title, meta, year, desc, tags);
  hero.append(poster, text);
  modalBody.appendChild(hero);

  const actions = document.createElement("div");
  actions.className = "modal-actions";
  const watchBtn = document.createElement("a");
  watchBtn.className = "btn btn-primary";
  watchBtn.href = "watch.html?id=" + a.id;
  watchBtn.textContent = "▶ Смотреть";
  actions.appendChild(watchBtn);
  modalBody.appendChild(actions);

  modalOverlay.classList.add("open");
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

searchInput.addEventListener("input", e => {
  state.query = e.target.value;
  render();
});

favLink.addEventListener("click", e => {
  e.preventDefault();
  state.favOnly = !state.favOnly;
  document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
  render();
});

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

favCount.textContent = state.favorites.length;
render();

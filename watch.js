const params = new URLSearchParams(location.search);
const animeId = Number(params.get("id"));
const anime = ANIME.find(a => a.id === animeId);

const watchHead = document.getElementById("watchHead");
const playerBox = document.getElementById("playerBox");
const playerActions = document.getElementById("playerActions");
const watchDesc = document.getElementById("watchDesc");
const epList = document.getElementById("epList");
const epTitle = document.getElementById("epTitle");

if (!anime) {
  document.title = "Аниме не найдено — AnimeVerse";
  watchHead.innerHTML = "";
  const msg = document.createElement("h1");
  msg.textContent = "Аниме не найдено 😔";
  const back = document.createElement("a");
  back.className = "btn btn-primary";
  back.href = "index.html";
  back.textContent = "Вернуться в каталог";
  watchHead.append(msg, back);
} else {
  document.title = anime.title + " — смотреть на AnimeVerse";
  initPage();
}

function getProgress() {
  return JSON.parse(localStorage.getItem("av-progress-" + anime.id) || "{}");
}

function saveProgress(p) {
  localStorage.setItem("av-progress-" + anime.id, JSON.stringify(p));
}

function getWatched() {
  return JSON.parse(localStorage.getItem("av-watched-" + anime.id) || "[]");
}

function getAutoNext() {
  return localStorage.getItem("av-autonext") === "1";
}

function getCustomUrls() {
  return JSON.parse(localStorage.getItem("av-urls-" + anime.id) || "{}");
}

function saveCustomUrl(num, url) {
  const u = getCustomUrls();
  if (url) {
    u[num] = url;
  } else {
    delete u[num];
  }
  localStorage.setItem("av-urls-" + anime.id, JSON.stringify(u));
}

function toEmbedUrl(raw) {
  const url = raw.trim();
  if (!url) return "";
  const ytWatch = url.match(/youtube\.com\/(?:watch\?v=|shorts\/)([\w-]{6,})/);
  const ytShort = url.match(/youtu\.be\/([\w-]{6,})/);
  if (ytWatch) return "https://www.youtube.com/embed/" + ytWatch[1];
  if (ytShort) return "https://www.youtube.com/embed/" + ytShort[1];
  if (/^https:\/\//.test(url)) return url;
  return "";
}

function kindOfSource(url) {
  const yt = url.match(/youtube\.com\/embed\/([\w-]{6,})/);
  if (yt) return { kind: "youtube", videoId: yt[1] };
  return { kind: "iframe" };
}

let ytApiPromise = null;

function loadYtApi() {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise(resolve => {
    if (window.YT && window.YT.Player) {
      resolve(true);
      return;
    }
    const timer = setTimeout(() => resolve(false), 7000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      resolve(true);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

function getAutoNextMin() {
  return Number(localStorage.getItem("av-autonext-min") || 24);
}

let autoNextTimer = null;

function stopAutoNext() {
  if (autoNextTimer) {
    clearInterval(autoNextTimer);
    autoNextTimer = null;
  }
}

function startAutoNext(currentNum) {
  stopAutoNext();
  const cd = document.getElementById("autoNextCd");
  if (!cd) return;

  const next = anime.playlist.find(e => e.num === currentNum + 1);
  if (!next) {
    cd.textContent = "🏁 последняя серия";
    return;
  }
  if (!getAutoNext()) {
    cd.textContent = "авто-переход выключен";
    return;
  }

  const fmt = s => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  let left = getAutoNextMin() * 60;
  cd.textContent = "⏭ " + fmt(left);

  autoNextTimer = setInterval(() => {
    left--;
    if (left <= 0) {
      stopAutoNext();
      setWatched(currentNum);
      playEpisode(next.num, true);
      return;
    }
    cd.textContent = "⏭ " + fmt(left);
  }, 1000);
}

function setWatched(num) {
  const w = getWatched();
  if (!w.includes(num)) {
    w.push(num);
    localStorage.setItem("av-watched-" + anime.id, JSON.stringify(w));
  }
}

function initPage() {
  const info = document.createElement("div");
  info.className = "watch-info";
  const title = document.createElement("h1");
  title.textContent = anime.title;
  const meta = document.createElement("div");
  meta.className = "watch-meta";
  meta.textContent = "★ " + anime.rating.toFixed(1) + " · " + anime.year + " · " + anime.genres.join(", ");
  info.append(title, meta);
  watchHead.appendChild(info);

  const desc = document.createElement("p");
  desc.textContent = anime.desc;
  watchDesc.appendChild(desc);

  const savedUrls = getCustomUrls();
  ensurePlaylistSize(Math.max(0, ...Object.keys(savedUrls).map(Number)));

  const progress = getProgress();
  const startNum = progress.lastEp && anime.playlist.some(e => e.num === progress.lastEp)
    ? progress.lastEp
    : anime.playlist[0].num;
  renderEpList(startNum);
  playEpisode(startNum, false);
  initBulkImport();
}

function currentNum() {
  const p = getProgress();
  return p.lastEp && anime.playlist.some(e => e.num === p.lastEp)
    ? p.lastEp
    : anime.playlist[0].num;
}

function ensurePlaylistSize(need) {
  while (anime.playlist.length < Math.min(need, anime.episodes)) {
    const n = anime.playlist.length + 1;
    anime.playlist.push({
      num: n,
      title: anime.episodes === 1 ? "Фильм" : "Серия " + n,
      url: ""
    });
  }
}

function initBulkImport() {
  const panel = document.getElementById("bulkPanel");
  const text = document.getElementById("bulkText");
  const status = document.getElementById("bulkStatus");

  document.getElementById("bulkToggle").addEventListener("click", () => {
    const hidden = panel.classList.toggle("hidden");
    if (!hidden) {
      const u = getCustomUrls();
      text.value = Object.keys(u).sort((a, b) => a - b).map(k => u[k]).join("\n");
      status.textContent = "";
    }
  });

  document.getElementById("bulkApply").addEventListener("click", () => {
    const embedded = text.value.split(/\r?\n/).map(toEmbedUrl).filter(Boolean);
    if (!embedded.length) {
      status.textContent = "Не распознал ни одной ссылки — нужны ссылки, начинающиеся с https://";
      status.classList.add("err");
      return;
    }
    ensurePlaylistSize(embedded.length);
    const applied = Math.min(embedded.length, anime.playlist.length);
    embedded.slice(0, applied).forEach((u, i) => saveCustomUrl(anime.playlist[i].num, u));
    let msg = "Готово: " + applied + " ссылок на сериях " + anime.playlist[0].num + "–" + anime.playlist[applied - 1].num;
    if (embedded.length > applied) {
      msg += " · не влезли " + (embedded.length - applied) + " (в тайтсе всего " + anime.episodes + " серий)";
    }
    status.textContent = msg;
    status.classList.remove("err");
    playEpisode(currentNum(), false);
  });

  document.getElementById("bulkClear").addEventListener("click", () => {
    localStorage.removeItem("av-urls-" + anime.id);
    text.value = "";
    status.textContent = "Свои ссылки убраны — вернулись трейлеры";
    status.classList.remove("err");
    playEpisode(currentNum(), false);
  });
}

function renderEpList(activeNum) {
  epTitle.textContent = anime.episodes === 1 ? "Показ" : "Серии (" + anime.playlist.length + ")";
  epList.innerHTML = "";
  const watched = getWatched();

  anime.playlist.forEach(ep => {
    const btn = document.createElement("button");
    btn.className = "ep-btn" + (ep.num === activeNum ? " current" : "") + (watched.includes(ep.num) ? " watched" : "");
    const label = document.createElement("span");
    label.textContent = ep.title;
    const mark = document.createElement("span");
    mark.className = "ep-mark";
    mark.textContent = watched.includes(ep.num) ? "✓" : "•";
    btn.append(label, mark);
    btn.addEventListener("click", () => playEpisode(ep.num, true));
    epList.appendChild(btn);
  });
}

function buildSources(num, ep) {
  const customUrls = getCustomUrls();
  const list = [];
  const custom = toEmbedUrl(customUrls[num] || "");
  if (custom) list.push({ ...kindOfSource(custom), url: custom, custom: true });
  const main = toEmbedUrl(ep.url || "");
  if (main && !list.some(s => s.url === main)) list.push({ ...kindOfSource(main), url: main });
  const alt = toEmbedUrl(ep.alt || "");
  if (alt && !list.some(s => s.url === alt)) list.push({ kind: "iframe", url: alt, mirror: true });
  return list;
}

function buildUrlForm(num) {
  const form = document.createElement("div");
  form.className = "url-form";
  const input = document.createElement("input");
  input.className = "url-input";
  input.type = "url";
  input.placeholder = "https://www.youtube.com/watch?v=...";
  const submit = () => {
    const u = toEmbedUrl(input.value);
    if (!u) {
      input.classList.add("bad");
      setTimeout(() => input.classList.remove("bad"), 800);
      return;
    }
    saveCustomUrl(num, u);
    playEpisode(num, false);
  };
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") submit();
  });
  const btn = document.createElement("button");
  btn.className = "btn btn-primary";
  btn.textContent = "Играть";
  btn.addEventListener("click", submit);
  form.append(input, btn);
  return form;
}

function showEmptyHint(num, box) {
  const hint = document.createElement("div");
  hint.className = "player-hint";
  const icon = document.createElement("div");
  icon.className = "player-hint-icon";
  icon.textContent = "🎬";
  const heading = document.createElement("h3");
  heading.textContent = "Видео пока не добавлено";
  const text = document.createElement("p");
  text.innerHTML = "Вставь ссылку на видео — она сохранится в браузере.<br>" +
    "YouTube: обычная ссылка или <span class='mono'>youtube.com/embed/VIDEO_ID</span><br>" +
    "VK: <span class='mono'>vk.com/video_ext.php?oid=...&amp;id=...</span> (код встраивания)";
  hint.append(icon, heading, text, buildUrlForm(num));
  box.appendChild(hint);
}

function showFailHint(num, stage) {
  stage.innerHTML = "";
  const hint = document.createElement("div");
  hint.className = "player-hint";
  const icon = document.createElement("div");
  icon.className = "player-hint-icon";
  icon.textContent = "📡";
  const heading = document.createElement("h3");
  heading.textContent = "Ни один источник не открылся";
  const text = document.createElement("p");
  text.innerHTML = "Видео недоступно в твоей стране, а зеркало тоже не отвечает.<br>" +
    "Вставь свою ссылку — она сохранится в браузере.";
  hint.append(icon, heading, text, buildUrlForm(num));
  stage.appendChild(hint);
}

function onSourceOk(src, stage, status) {
  if (status) status.remove();
  if (src.mirror) {
    const chip = document.createElement("div");
    chip.className = "mirror-chip";
    chip.textContent = "🔁 зеркало (Rutube)";
    stage.appendChild(chip);
  }
}

function playSources(num, sources) {
  const stage = playerBox.querySelector(".player-stage");
  if (!stage) return;
  const status = stage.querySelector(".player-status");

  const tryAt = i => {
    if (!stage.isConnected) return;
    if (i >= sources.length) {
      showFailHint(num, stage);
      return;
    }
    const src = sources[i];
    if (status && status.isConnected) {
      status.textContent = "⏳ подбираем источник (" + (i + 1) + "/" + sources.length + ")…";
    }
    stage.querySelectorAll("iframe, .player-mount, .player-hint").forEach(el => el.remove());

    if (src.kind === "youtube") {
      loadYtApi().then(ok => {
        if (!stage.isConnected) return;
        if (!ok) {
          if (status && status.isConnected) status.textContent = "📺 YouTube не отвечает — включаю зеркало…";
          tryAt(i + 1);
          return;
        }
        let settled = false;
        let player = null;
        const mount = document.createElement("div");
        mount.className = "player-mount";
        stage.appendChild(mount);
        const timer = setTimeout(() => {
          if (settled) return;
          settled = true;
          try {
            if (player && player.destroy) player.destroy();
          } catch (e) {}
          tryAt(i + 1);
        }, 6000);
        try {
          player = new YT.Player(mount, {
            videoId: src.videoId,
            playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
            events: {
              onReady: () => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                const frame = player.getIframe ? player.getIframe() : null;
                if (frame) frame.className = "player-frame";
                onSourceOk(src, stage, status);
              },
              onError: () => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                tryAt(i + 1);
              }
            }
          });
        } catch (e) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          tryAt(i + 1);
        }
      });
    } else {
      const iframe = document.createElement("iframe");
      iframe.className = "player-frame";
      iframe.src = src.url;
      iframe.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
      iframe.allowFullscreen = true;
      stage.appendChild(iframe);
      onSourceOk(src, stage, status);
    }
  };
  tryAt(0);
}

function playEpisode(num, byUser) {
  const ep = anime.playlist.find(e => e.num === num);
  if (!ep) return;

  const sources = buildSources(num, ep);
  const hasCustom = sources.length > 0 && sources[0].custom;

  const progress = getProgress();
  progress.lastEp = num;
  saveProgress(progress);
  if (byUser) setWatched(num);

  playerBox.innerHTML = "";
  playerActions.innerHTML = "";

  if (!sources.length) {
    showEmptyHint(num, playerBox);
  } else {
    const stage = document.createElement("div");
    stage.className = "player-stage";
    const status = document.createElement("div");
    status.className = "player-status";
    status.textContent = "⏳ подбираем источник…";
    stage.appendChild(status);
    playerBox.appendChild(stage);
    playSources(num, sources);
  }

  const prev = anime.playlist.find(e => e.num === num - 1);
  const next = anime.playlist.find(e => e.num === num + 1);

  if (hasCustom) {
    const note = document.createElement("span");
    note.className = "custom-note";
    note.textContent = "🔗 своя ссылка";
    const reset = document.createElement("button");
    reset.className = "btn btn-ghost reset-btn";
    reset.textContent = "Убрать ссылку";
    reset.addEventListener("click", () => {
      saveCustomUrl(num, "");
      playEpisode(num, false);
    });
    playerActions.append(note, reset);
  }

  if (prev) {
    const b = document.createElement("button");
    b.className = "btn btn-ghost";
    b.textContent = "← Предыдущая";
    b.addEventListener("click", () => {
      playEpisode(prev.num, true);
    });
    playerActions.appendChild(b);
  }
  if (next) {
    const b = document.createElement("button");
    b.className = "btn btn-ghost";
    b.textContent = "Следующая →";
    b.addEventListener("click", () => {
      playEpisode(next.num, true);
    });
    playerActions.appendChild(b);
  }

  const spacer = document.createElement("div");
  spacer.className = "actions-spacer";
  playerActions.appendChild(spacer);

  const toggle = document.createElement("button");
  toggle.className = "btn btn-ghost toggle-btn" + (getAutoNext() ? " on" : "");
  toggle.textContent = "⏭ Авто-переход: " + (getAutoNext() ? "вкл" : "выкл");
  toggle.addEventListener("click", () => {
    localStorage.setItem("av-autonext", getAutoNext() ? "0" : "1");
    playEpisode(num, false);
  });
  playerActions.appendChild(toggle);

  if (next) {
    const select = document.createElement("select");
    select.className = "time-select";
    select.title = "Через сколько переключать серию";
    [4, 12, 20, 24, 45, 60].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.textContent = m + " мин";
      if (m === getAutoNextMin()) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener("change", e => {
      localStorage.setItem("av-autonext-min", e.target.value);
      startAutoNext(num);
    });
    playerActions.appendChild(select);
  }

  const cd = document.createElement("span");
  cd.className = "auto-cd";
  cd.id = "autoNextCd";
  playerActions.appendChild(cd);

  renderEpList(num);
  startAutoNext(num);
}

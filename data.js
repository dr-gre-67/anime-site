const DEMO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

const CUSTOM_PLAYLISTS = {
  1: [
    { num: 1, title: "Официальный трейлер (Crunchyroll Dubs)", url: "https://www.youtube.com/watch?v=HJaUvV9Hwgs", alt: "https://rutube.ru/play/embed/dbe0f3bf1aab168ab4d7d207f7321f05" },
    { num: 2, title: "Трейлер финального сезона", url: "https://www.youtube.com/watch?v=MUCN-JwUvbY", alt: "https://rutube.ru/play/embed/bbfb496ca02b349691296e6a794c6e2c" },
    { num: 3, title: "Трейлер финального сезона — часть 2", url: "https://www.youtube.com/watch?v=4wm8lxLwbvo", alt: "https://rutube.ru/play/embed/bbfb496ca02b349691296e6a794c6e2c" },
    { num: 4, title: "Трейлер финальных глав", url: "https://www.youtube.com/watch?v=8pEg8NrdL_Y", alt: "https://rutube.ru/play/embed/bbfb496ca02b349691296e6a794c6e2c" }
  ],
  2: [
    { num: 1, title: "Официальный трейлер (Crunchyroll)", url: "https://www.youtube.com/watch?v=t6MXHczeEqc", alt: "https://rutube.ru/play/embed/bce4a8fc37b0c938ece721316df60c74" }
  ],
  3: [
    { num: 1, title: "Официальный трейлер (VIZ)", url: "https://www.youtube.com/watch?v=Poo5lqoWSGw", alt: "https://rutube.ru/play/embed/e6338d6fd7c5a21d5602c3198bdc1774" },
    { num: 2, title: "Трейлер аниме (VIZ)", url: "https://www.youtube.com/watch?v=X4e3oZaPtaE", alt: "https://rutube.ru/play/embed/e6338d6fd7c5a21d5602c3198bdc1774" }
  ],
  4: [
    { num: 1, title: "Официальный трейлер (GKIDS)", url: "https://www.youtube.com/watch?v=RuyHIkXdYf8", alt: "https://rutube.ru/play/embed/98b62fc60840719f083414685bd7afe0" }
  ],
  5: [
    { num: 1, title: "Трейлер (Crunchyroll)", url: "https://www.youtube.com/watch?v=pkKu9hLT-t8", alt: "https://rutube.ru/play/embed/e3a8e7b748e8decf52246832110072b6" },
    { num: 2, title: "Трейлер «Игра на истребление»", url: "https://www.youtube.com/watch?v=MPfZhgLiK6w", alt: "https://rutube.ru/play/embed/6e4359d5eb524499f40f111399db776f" }
  ],
  6: [
    { num: 1, title: "Официальный английский трейлер", url: "https://www.youtube.com/watch?v=D9dap98L5nQ" }
  ],
  7: [
    { num: 1, title: "Официальный английский трейлер (VIZ)", url: "https://www.youtube.com/watch?v=yeUpnIKt6k4", alt: "https://rutube.ru/play/embed/1144d34e66695232f77c8eeee7462ed0" }
  ],
  8: [
    { num: 1, title: "Трейлер 1 сезона (uncut)", url: "https://www.youtube.com/watch?v=vGuQeQsoRgU", alt: "https://rutube.ru/play/embed/9224c0a94377e1323d70061900327163" },
    { num: 2, title: "Официальный английский трейлер", url: "https://www.youtube.com/watch?v=ETHpMMV8rJU", alt: "https://rutube.ru/play/embed/9224c0a94377e1323d70061900327163" },
    { num: 3, title: "Трейлер 2 сезона (√A)", url: "https://www.youtube.com/watch?v=v9fgZUBfZjk", alt: "https://rutube.ru/play/embed/9224c0a94377e1323d70061900327163" }
  ],
  9: [
    { num: 1, title: "Трейлер финального сезона (Crunchyroll)", url: "https://www.youtube.com/watch?v=pxbEWUjh6E4", alt: "https://rutube.ru/play/embed/ac7bb2b65dfdabc1bb1ce6d1f74518cc" },
    { num: 2, title: "Тизер финального сезона", url: "https://www.youtube.com/watch?v=ErlRR6b7A-E", alt: "https://rutube.ru/play/embed/ac7bb2b65dfdabc1bb1ce6d1f74518cc" },
    { num: 3, title: "Трейлер 7 сезона", url: "https://www.youtube.com/watch?v=T5HMoxJRhRY", alt: "https://rutube.ru/play/embed/ac7bb2b65dfdabc1bb1ce6d1f74518cc" },
    { num: 4, title: "Трейлер 6 сезона", url: "https://www.youtube.com/watch?v=9Y_eKiT-irU", alt: "https://rutube.ru/play/embed/ac7bb2b65dfdabc1bb1ce6d1f74518cc" }
  ],
  10: [
    { num: 1, title: "Официальный трейлер (GKIDS)", url: "https://www.youtube.com/watch?v=luP4sIz60mA", alt: "https://rutube.ru/play/embed/3a1c4ff2397081bb6a2615d61bdc322a" },
    { num: 2, title: "Официальный английский трейлер (GKIDS)", url: "https://www.youtube.com/watch?v=TQK9By9qQiw", alt: "https://rutube.ru/play/embed/32fba5190be2e27413deea1c30124c4c" }
  ],
  11: [
    { num: 1, title: "Официальный трейлер (VIZ)", url: "https://www.youtube.com/watch?v=22R0j8UKRzY", alt: "https://rutube.ru/play/embed/1144d34e66695232f77c8eeee7462ed0" }
  ],
  12: [
    { num: 1, title: "Серия 1 — демо-встройка (замени ссылку)", url: DEMO_URL }
  ]
};

const BASE_ANIME = [
  {
    id: 1, title: "Атака титанов", year: 2013, rating: 9.0,
    genres: ["Экшен", "Драма", "Фэнтези"], episodes: 87,
    symbol: "進撃", desc: "Человечество живёт за огромными стенами, защищающими его от гигантов-титанов. Эрен Йегер клянётся уничтожить их всех после падения родного города.",
    gradient: "linear-gradient(160deg,#4a3728,#8b5cf6)"
  },
  {
    id: 2, title: "Клинок, рассекающий демонов", year: 2019, rating: 8.9,
    genres: ["Экшен", "Фэнтези", "Сёнэн"], episodes: 55,
    symbol: "鬼滅", desc: "Танджиро Камадо становится охотником на демонов, чтобы вернуть сестре человеческий облик и отомстить за семью.",
    gradient: "linear-gradient(160deg,#1f6f5c,#3fbf9f)"
  },
  {
    id: 3, title: "Ванпанчмен", year: 2015, rating: 8.7,
    genres: ["Экшен", "Комедия", "Сёнэн"], episodes: 38,
    symbol: "ワン", desc: "Сайтама — герой, побеждающий любого врага одним ударом. Проблема лишь в том, что от этого ему скучно.",
    gradient: "linear-gradient(160deg,#c2410c,#f59e0b)"
  },
  {
    id: 4, title: "Твоё имя", year: 2016, rating: 9.0,
    genres: ["Драма", "Романтика", "Фэнтези"], episodes: 1,
    symbol: "君名", desc: "Школьники Таки и Мицуха таинственным образом меняются телами и начинают переписывать судьбу друг друга.",
    gradient: "linear-gradient(160deg,#7c3aed,#ec4899)"
  },
  {
    id: 5, title: "Магическая битва", year: 2020, rating: 8.8,
    genres: ["Экшен", "Фэнтези", "Сёнэн"], episodes: 47,
    symbol: "呪術", desc: "Юдзи Итадори проглатывает палец древнего проклятия и попадает в мир магов, сражающихся с проклятиями.",
    gradient: "linear-gradient(160deg,#1e3a8a,#60a5fa)"
  },
  {
    id: 6, title: "Стальной алхимик: Братство", year: 2009, rating: 9.1,
    genres: ["Экшен", "Приключения", "Фэнтези"], episodes: 64,
    symbol: "鋼錬", desc: "Братья Элрики пытаются вернуть тела, потерянные в неудачной алхимической транмутации, и раскрывают тайну государства.",
    gradient: "linear-gradient(160deg,#b45309,#fbbf24)"
  },
  {
    id: 7, title: "Наруто", year: 2002, rating: 8.4,
    genres: ["Экшен", "Приключения", "Сёнэн"], episodes: 720,
    symbol: "忍者", desc: "История юного ниндзя Наруто Узумаки, мечтающего стать сильнейшим лидером своей деревни — Хокаге.",
    gradient: "linear-gradient(160deg,#ea580c,#fdba74)"
  },
  {
    id: 8, title: "Токийский гуль", year: 2014, rating: 8.0,
    genres: ["Хоррор", "Экшен", "Драма"], episodes: 48,
    symbol: "東京", desc: "Студент Канеки после операции становится полугулем и учится выживать в жестоком мире монстров, живущих среди людей.",
    gradient: "linear-gradient(160deg,#7f1d1d,#dc2626)"
  },
  {
    id: 9, title: "Моя геройская академия", year: 2016, rating: 8.5,
    genres: ["Экшен", "Комедия", "Сёнэн"], episodes: 113,
    symbol: "英雄", desc: "В мире суперспособностей «причуд» Изуку Мидория, родившийся без силы, поступает в элитную академию героев.",
    gradient: "linear-gradient(160deg,#065f46,#34d399)"
  },
  {
    id: 10, title: "Форма голоса", year: 2016, rating: 8.9,
    genres: ["Драма", "Романтика"], episodes: 1,
    symbol: "声形", desc: "Бывший школьный хулиган пытается искупить вину перед глухой одноклассницей, которую когда-то задирал.",
    gradient: "linear-gradient(160deg,#0e7490,#67e8f9)"
  },
  {
    id: 11, title: "Наруто: Ураганные хроники", year: 2007, rating: 8.7,
    genres: ["Экшен", "Приключения", "Сёнэн"], episodes: 500,
    symbol: "疾風", desc: "Повзрослевший Наруто возвращается в деревню после двух лет тренировок и вступает в противостояние с организацией Акацуки.",
    gradient: "linear-gradient(160deg,#9a3412,#fb923c)"
  },
  {
    id: 12, title: "Одинокий мечник", year: 2024, rating: 8.6,
    genres: ["Экшен", "Фэнтези"], episodes: 24,
    symbol: "剣士", desc: "Одинокий мечник с загадочным прошлым путешествует по земле, разорванной войной духов.",
    gradient: "linear-gradient(160deg,#312e81,#818cf8)"
  }
];

function defaultPlaylist(a) {
  if (CUSTOM_PLAYLISTS[a.id]) return CUSTOM_PLAYLISTS[a.id];
  const count = Math.min(a.episodes, 12);
  return Array.from({ length: count }, (_, i) => ({
    num: i + 1,
    title: a.episodes === 1 ? "Фильм" : "Серия " + (i + 1),
    url: ""
  }));
}

const ANIME = BASE_ANIME.map(a => ({ ...a, playlist: defaultPlaylist(a) }));

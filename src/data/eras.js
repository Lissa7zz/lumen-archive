export const eras = [
  {
    id: "faith",
    numeral: "I",
    title: "信仰、宫廷与秩序",
    range: "1400–1599",
    start: 1400,
    end: 1599,
    count: 90,
    representative: "birth-of-venus",
    summary: "宗教图像、宫廷肖像与理想化的古典空间，构成了近代视觉秩序的开端。"
  },
  {
    id: "baroque",
    numeral: "II",
    title: "明暗与革命前夜",
    range: "1600–1799",
    start: 1600,
    end: 1799,
    count: 145,
    representative: "night-watch",
    summary: "戏剧性的光线、权力肖像与市民生活，把观看引向更强烈的现实感。"
  },
  {
    id: "romantic",
    numeral: "III",
    title: "浪漫主义与工业化",
    range: "1800–1879",
    start: 1800,
    end: 1879,
    count: 120,
    representative: "great-wave",
    summary: "摄影术诞生，风景、劳动、战争与城市第一次以新的技术和情绪被记录。"
  },
  {
    id: "modern",
    numeral: "IV",
    title: "现代生活与战争",
    range: "1880–1944",
    start: 1880,
    end: 1944,
    count: 109,
    representative: "hindenburg-disaster",
    summary: "大众媒体、现代主义与全球战争并行，图像开始以前所未有的速度传播。"
  },
  {
    id: "contemporary",
    numeral: "V",
    title: "冷战、太空与当代世界",
    range: "1945–2000",
    start: 1945,
    end: 2000,
    count: 36,
    representative: "blue-marble-1972",
    summary: "从战后新闻摄影到行星视角，图像把人类命运放到更广阔的空间尺度中。"
  }
];

export const eraForYear = (year) =>
  eras.find((era) => year >= era.start && year <= era.end) ?? eras.at(-1);

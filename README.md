# 光迹美术馆 / Lumen Archive

一个开源的跨媒介艺术时间线，收录从文艺复兴到太空时代的经典绘画、版画与摄影作品。首版包含 12 件作品、高清本地图像、媒介筛选、全文搜索、横向时间轴与可缩放的详情查看器。

## 在线体验

GitHub Pages: <https://lissa7zz.github.io/lumen-archive/>

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

构建静态文件：

```bash
npm run build
npm run preview
```

## 重新获取作品图像

作品清单与说明位于 `src/data/artworks.js`。图像处理脚本会从 Wikimedia Commons 获取高分辨率版本，并生成可直接部署的 WebP 文件：

```bash
npm run fetch:artworks
```

该命令需要网络连接。原始下载缓存保存在 `work/artwork-sources/`，不会提交到 Git；生成图片位于 `public/artworks/`。

## 项目结构

```text
src/
  data/artworks.js     作品信息与来源
  main.js              页面渲染、筛选、搜索与查看器
  styles.css           响应式视觉样式
scripts/
  fetch-artworks.mjs   图像下载、压缩与许可清单生成
public/artworks/       本地 WebP 展示图
```

## 许可

- 网站代码与原创中文文本：MIT
- 作品图像：Public Domain，另有 1 件为 CC BY 2.0
- 每件作品的作者、来源与许可详见 [ATTRIBUTION.md](./ATTRIBUTION.md)

如果重新使用站内图像，请保留对应作品页面链接，并遵守该图像的具体许可。

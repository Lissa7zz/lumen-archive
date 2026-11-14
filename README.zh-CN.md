[English](README.md) | [简体中文](README.zh-CN.md)

[![GitHub Pages 部署](https://github.com/Lissa7zz/lumen-archive/actions/workflows/deploy.yml/badge.svg)](https://github.com/Lissa7zz/lumen-archive/actions/workflows/deploy.yml)

**快速入口：[打开光迹美术馆](https://lissa7zz.github.io/lumen-archive/) ·
[浏览完整典藏](https://lissa7zz.github.io/lumen-archive/archive.html)**

# 光迹美术馆 / Lumen Archive

光迹美术馆是一个开源的跨媒介艺术时间线，收录绘画、版画与摄影作品。当前目录汇集
1434 至 1984 年间的 55 件作品，提供本地高清图像、作品来源，以及适合近距离观看的
图像查看器。

站点为纯静态构建，不包含后端、账号系统、访问统计或图像处理服务。

## 项目内容

- 55 件绘画、版画与摄影作品，首页保留 12 件策展精选
- 按年代排列的典藏展墙与横向时间轴
- 按标题、艺术家、年代、媒介或地域搜索
- 传统图录分页，支持排序、搜索与可分享的页面状态链接
- 6 个作品数据分块与独立按需加载的搜索索引
- 480 px 缩略图、1600 px 预览图与 3200 px 高清图
- 支持滚轮、按钮、双击与触屏双指缩放
- 放大后可拖拽平移，适应屏幕时可通过触屏横滑切换作品
- 支持键盘控制、全屏浏览与移动端作品信息抽屉
- 提供 Wikimedia Commons 原始档案链接
- 逐项记录作品许可、来源与署名

## 查看器操作

| 操作 | 控制方式 |
|---|---|
| 放大或缩小 | 鼠标滚轮、`+` / `-` 或查看器工具栏 |
| 查看其他区域 | 放大后拖拽画面 |
| 恢复适应屏幕 | 双击画面、按 `0` 或使用重置按钮 |
| 上一件或下一件 | 方向键或画面两侧按钮 |
| 键盘平移 | `Shift` + 方向键 |
| 进入或退出全屏 | `F` 或全屏按钮 |
| 关闭查看器 | `Esc` |

触屏设备上可双指缩放；放大后用单指拖拽；适应屏幕时可横向滑动切换作品。

## 完整目录

完整图录位于 `/archive.html`，每页展示 12 件作品。页面按需载入 6 个 JSON
作品数据块，搜索时再单独读取索引。搜索词、排序方式与页码会写入 URL，刷新或分享
后可以恢复到同一状态。

## 扩展路线

当前静态分块架构适合 55 件作品，也可以平稳扩展到数百件。达到数千件规模时，图片
应迁移到对象存储并通过 CDN 分发，作品元数据应由轻量 API 或数据库提供，搜索也应
迁移到专用索引，而不是继续向浏览器分发完整数据集。

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

构建生产文件：

```bash
npm run build
npm run preview
```

## 作品图像

作品信息与来源记录位于 `src/data/artworks.js`。图像脚本会从 Wikimedia Commons
下载高分辨率原档，并生成站点使用的本地 WebP 版本：

```bash
npm run fetch:artworks
```

下载缓存保存在 `work/artwork-sources/`，不会提交到 Git；部署图像输出到
`public/artworks/`。

## 项目结构

```text
src/
  data/artworks.js      作品信息与来源
  main.js               页面渲染、搜索、时间轴与图像查看器
  styles.css            响应式站点与查看器样式
scripts/
  build-catalog.mjs     首页数据、分块 JSON 与搜索索引生成
  fetch-artworks.mjs    图像下载与 WebP 生成
public/data/            生成后的作品分块与搜索索引
public/artworks/        本地缩略图、预览图与高清图
```

## 作品权利声明

MIT 许可仅适用于本项目的原创代码与文字，不适用于所收录的作品图像。

本项目中的多数图像属于公共领域。《协和逐日》原图采用 CC BY 2.0 许可，《雅典学院》
的现场摄影采用 CC BY-SA 4.0 许可，使用时应保留署名、许可名称和协议链接。每件作品
的原始页面、许可与署名见
[ATTRIBUTION.md](ATTRIBUTION.md)，其他第三方声明见 [NOTICE.md](NOTICE.md)。

本项目是独立的教育性项目，与页面中提及的博物馆、档案馆、摄影师或艺术家遗产
机构不存在隶属、合作或背书关系。机构名称与作品标题的权利归各自所有者所有。

## 开发者

- 开发者：Lissa7zz
- AI 协作：OpenAI Codex
- 仓库：[Lissa7zz/lumen-archive](https://github.com/Lissa7zz/lumen-archive)

## 许可

Copyright (C) 2026 Lissa7zz

本项目的原创代码、文档和策展文字使用 [MIT License](LICENSE) 发布，可在其条款
允许的范围内复制、修改和分发。

本软件按“原样”提供，不附带任何明示或暗示担保。作品复制图像与第三方内容仍受
各自权利和许可约束。

---

<p align="center"><em>كأن قلبي لم يعد ينبض؛ والريح الباردة تطلق تنهداتها — سانتاباد.</em></p>

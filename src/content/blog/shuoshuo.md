---
title: "搭建说说功能"
description: "不接后端，用一篇文章当数据源实现说说页面"
pubDate: "OCT 11 2026"
categories:
  - Development
tags:
  - 说说
  - Astro
badge: Development
---

声明：这个说说功能在 AI 的辅助下完成。

# 前言

博客里原本有一篇标题为《说说》的文章，里面按时间从新到旧记录了平时想分享的话，有新的说说就写在最前面。

这样感觉太简陋了，于是去了解怎么搭建说说。找了一圈发现，现成的方案大都需要一台服务器，而我没有服务器，也不想为了这个花钱。那么，能不能不依赖后端，直接读取本地这篇文章呢？当然可以，这篇文章就记录一下实现过程。

# 搭建

整体思路是，把《说说》这篇文章当作数据源，渲染成一条条说说，再在页面上排成两列。

## 读取说说

页面放在 `src/pages/shuoshuo.astro`。Astro 自带内容集合（content collection），我们直接按名字把这篇文章取出来渲染，Markdown 不需要自己解析：

```astro
---
import { getEntry } from "astro:content";
const entry = await getEntry("blog", "说说");
const { Content, headings } = await entry.render();
---

<Content />
```

`entry.render()` 会把 Markdown 转成一段 HTML，同时返回 `headings`，供目录使用。这时页面上还是一堆零散的 `<h1>`、`<p>`、`<img>`。

## 拆成卡片

接下来交给浏览器端的脚本。`splitCards()` 做的事情是：每遇到一个 `<h1>`，就新建一张卡片，把它后面的节点都放进这张卡片里。

```js
let currentCard = null;
for (const child of children) {
  if (child.tagName === "H1") {
    // 日期标题 = 新卡片的开始
    currentCard = document.createElement("div");
    currentCard.className = "shuoshuo-card";
    fragment.appendChild(currentCard);
  }
  currentCard.appendChild(child);
}
```

处理完之后，DOM 就变成 `.shuoshuo-list` 里装着若干个 `.shuoshuo-card`。

> 脚本挂在 `astro:page-load` 上。博客开启了视图过渡，切换页面不会整页刷新，换成其他时机容易初始化不到。

## 两列瀑布流

两列用 flex 并排。这里要解决的是每张卡片应该放进哪一列。

我的做法是贪心：每次把下一张卡片放进当前较矮的那一列。这样两列的高度基本齐平，阅读顺序也正好是「左右左右」交替，最新的排在最上面。

```js
const heights = [0, 0];
for (const card of orderedCards) {
  const idx = heights[0] <= heights[1] ? 0 : 1; // 谁矮放谁
  (idx === 0 ? colA : colB).appendChild(card);
  heights[idx] += card.offsetHeight + 12; // 累计这一列的新高度
}
```

配套样式：

```css
.shuoshuo-list.layout-columns {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.shuoshuo-list.layout-columns .shuoshuo-col {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
```

窄屏（`max-width: 768px`）下就退回单列。

## 图片没加载完时高度不准

这里有一个需要注意的地方。上面用 `card.offsetHeight` 来量高度，但 Markdown 里的图片没有写死宽高，在图片加载完之前，卡片的高度只能算到文字部分。如果一开始就分列，相当于按错误的高度来排，等图片显示出来就乱了。

所以先排一遍，再给还没加载完的 `img`/`video` 挂上监听，等它们加载完之后再防抖重排一次。

```js
function watchMedia() {
  const media = orderedCards.flatMap(
    (card) => [...card.querySelectorAll("img, video")],
  );
  for (const el of media) {
    const isLoaded = el.tagName === "IMG" ? el.complete : el.readyState >= 3;
    if (isLoaded) continue;
    el.addEventListener("load", scheduleLayout, { once: true });
    el.addEventListener("error", scheduleLayout, { once: true });
  }
}
```

`scheduleLayout` 里加了防抖，避免几十张图片每张都触发一次重排；窗口 `resize` 和 `load` 也走同一个重排函数。

## 引用到评论

每张卡片右上角有一个引用按钮。点击之后，把这张卡片的文字加上 `>` 变成 Markdown 引用，写进下方的 Twikoo 输入框。

```js
let textParts = [];
for (const child of card.children) {
  if (child.tagName === "H1") continue; // 跳过日期标题
  const text = child.textContent?.trim();
  if (text) textParts.push(text);
}

const quoteText = textParts.join("\n");
const textarea = document.querySelector("#twikoo .el-textarea__inner");
if (textarea) {
  // 每行前都加 >，整段变成一块引用
  textarea.value = "> " + quoteText.replace(/\n/g, "\n> ") + "\n\n";
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}
```

Twikoo 是异步加载的，点击时输入框可能还没渲染出来，所以实际代码里会先滚动到评论区，再用 `setTimeout` 等一会儿。

---
title: "在前端框架使用 Astro 的静态博客搭建 Waline 评论系统"
description: "将 Waline 评论系统集成到 Frosti 博客"
pubDate: "AUG 21 2025"
image: /image/image4.jpg
categories:
  - Development
tags:
  - 评论
  - Waline
  - astro
badge: Development
---

# 介绍
我这个博客用的是 Frosti 这个主题，添加评论系统需要一些额外配置。我们今天就来一步步将 Waline 评论系统集成到 Frosti 博客中（其他主题也可以参考参考）。

由于静态网站无法直接处理动态内容，例如评论。不过，我们可以借助第三方评论服务来处理后端逻辑，同时将他们的前端组件嵌入到我们的网站中（就比如我们今天讲的 Waline 评论系统）。

# 实现
### 部署 Waline 评论系统后端
直接根据 [Waline 官方文档](https://waline.js.org/guide/get-started/)操作，之后复制服务端地址。
### 创建 Waline 组件
在 `src/components/` 中创建一个组件，命名为 `Waline.astro` ，再将以下代码添加到组件：
```astro
---
interface Props {
  serverURL: string;
  lang?: string;
  dark?: string;
  emoji?: string[];
  meta?: string[];
  requiredMeta?: string[];
  reaction?: boolean;
  pageview?: boolean;
}

const {
  serverURL,
  lang = "zh",
  dark = "html[data-theme-type='dark']",
  emoji = ["https://unpkg.com/@waline/emojis@1.1.0/weibo", "https://unpkg.com/@waline/emojis@1.1.0/bilibili", "https://unpkg.com/@waline/emojis@1.1.0/qq", "https://unpkg.com/@waline/emojis@1.1.0/tieba", "https://unpkg.com/@waline/emojis@1.1.0/bmoji", "https://unpkg.com/@waline/emojis@1.1.0/alus"],
  meta = ["nick", "mail", "link"],
  requiredMeta = [],
  reaction = false,
  pageview = false,
} = Astro.props;
---

<div id="waline-container"></div>

<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />

<script
  type="module"
  define:vars={{
    serverURL,
    lang,
    dark,
    emoji,
    meta,
    requiredMeta,
    reaction,
    pageview,
  }}
>
  import { init } from "https://unpkg.com/@waline/client@v3/dist/waline.js";

  async function initWaline() {
    const container = document.querySelector("#waline-container");
    if (!container) return;

    init({
      el: "#waline-container",
      serverURL,
      path: location.pathname,
      lang,
      dark,
      emoji,
      meta,
      requiredMeta,
      reaction,
      pageview,
    });
  }

  document.addEventListener("astro:page-load", () => {
    initWaline();
  });

  if (document.readyState !== "loading") {
    initWaline();
  } else {
    document.addEventListener("DOMContentLoaded", initWaline);
  }
</script>

<style>
  #waline-container {
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
</style>
```
### 使用 Waline 组件
找到 `[...slug].astro` ，添加以下代码：
```astro
---
// 添加这个↓，其他不用动
import Waline from "../../components/Waline.astro";
// 添加这个↑，其他不用动
---

<!-- 添加这些↓，其他不用动 -->
<section class="comments">
  <Waline serverURL="你的服务端地址" />
</section>
```
# 完成！
官方文档：[Adding Comment Systems to Frosti](https://frosti.saroprock.com/blog/adding-comment-systems)
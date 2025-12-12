---
title: "在博客里添加标签栏"
description: "博客美化"
pubDate: "Dec 12 2025"
image: /image/tag_sidebar.PNG
categories:
  - Development
tags:
  - astro
  - 前端
  - 网站搭建
  - 标签栏
  - 交互
badge: Development
---

以我的博客主题Frosti为例，其他主题也可以参考。

## 一、项目结构与组件设计

我们将创建以下核心文件：

```
src/components/new-test/
├── Tags.astro              # 标签栏主组件
├── WidgetLayout.astro      # 带展开/收起功能的容器
├── ButtonTag.astro         # 单个标签按钮
├── url-utils.ts            # 网址跳转
└── content-utils.ts        # 数据获取工具函数
```

## 二、数据获取与处理

首先创建工具函数获取标签数据：

```typescript
// src/components/new-test/content-utils.ts
import { getCollection } from "astro:content";

// 获取所有文章
export async function getAllPosts() {
  return await getCollection("blog");
}

// 获取标签列表
export async function getTagList() {
  const posts = await getAllPosts();
  const tagCount: Record<string, {original: string, count: number}> = {};
  
  posts.forEach(post => {
    if (post.data.tags) {
      post.data.tags.forEach(tag => {
        // 使用小写标签名作为键，但保留原始标签名
        const lowerTag = tag.toLowerCase();
        if (tagCount[lowerTag]) {
          tagCount[lowerTag].count++;
          // 保留最常见的大小写形式
          if (tagCount[lowerTag].original !== tag && 
              tagCount[lowerTag].count > 1) {
            tagCount[lowerTag].original = tag;
          }
        } else {
          tagCount[lowerTag] = {
            original: tag,
            count: 1
          };
        }
      });
    }
  });
  
  return Object.entries(tagCount)
    .map(([lowerName, {original, count}]) => ({ 
      name: original, 
      count,
      lowerName
    }))
    .sort((a, b) => b.count - a.count);
}

export function getTagUrl(tagName: string): string {
  // 直接使用 encodeURIComponent，它会正确处理特殊字符如 C++
  return `/blog/tag/${encodeURIComponent(tagName.toLowerCase())}/`;
}

// 从URL slug获取原始标签名
export function getTagFromSlug(slug: string, allTags: Array<{name: string, lowerName: string}>) {
  // 解码URL参数
  const decodedSlug = decodeURIComponent(slug);
  
  // 查找匹配的标签（不区分大小写）
  return allTags.find(tag => 
    tag.name.toLowerCase() === decodedSlug.toLowerCase() ||
    getTagUrl(tag.name).includes(decodedSlug.toLowerCase())
  );
}
```

## 三、核心组件实现

### 1. 标签按钮组件 (ButtonTag.astro)

```astro
---
interface Props {
	size?: string;
	dot?: boolean;
	href?: string;
	label?: string;
}
const { dot, href, label }: Props = Astro.props;
---
<a href={href} aria-label={label} class="btn-regular h-8 text-sm px-3 rounded-lg">
    {dot && <div class="h-1 w-1 bg-[var(--btn-content)] dark:bg-[var(--card-bg)] transition rounded-md mr-2"></div>}
    <slot></slot>
</a>
```

### 2. 带展开/收起的容器组件 (WidgetLayout.astro)

```astro
---

interface Props {
	id: string;
	name?: string;
	isCollapsed?: boolean;
	collapsedHeight?: string;
	class?: string;
	style?: string;
}
const { id, name, isCollapsed, collapsedHeight, style } = Astro.props;
const className = Astro.props.class;
---
<widget-layout data-id={id} data-is-collapsed={String(isCollapsed)} class={"pb-4 card-base pt-1 " + className} style={style}>
    <div class="font-bold transition text-lg text-base-content relative ml-8 mt-4 mb-2
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:left-[-16px] before:top-[5.5px]">{name}</div>
    <div id={id} class:list={["collapse-wrapper px-4 overflow-hidden", {"collapsed": isCollapsed}]}>
        <slot></slot>
    </div>
    {isCollapsed && <div class="expand-btn px-4 -mb-2">
        <button class="btn-plain rounded-lg w-full h-9">
            <div class="text-[var(--primary)] flex items-center justify-center gap-2 -translate-x-2">
                查看更多
            </div>
        </button>
    </div>}
</widget-layout>

<style define:vars={{ collapsedHeight }}>
    .collapsed {
        height: var(--collapsedHeight);
    }
</style>

<script>
    class WidgetLayout extends HTMLElement {
        constructor() {
            super();

            if (this.dataset.isCollapsed !== "true")
                return;

            const id = this.dataset.id;
            const btn = this.querySelector('.expand-btn');
            const wrapper = this.querySelector(`#${id}`)
            btn!.addEventListener('click', () => {
                wrapper!.classList.remove('collapsed');
                btn!.classList.add('hidden');
            })
        }
    }

    if (!customElements.get("widget-layout")) {
        customElements.define("widget-layout", WidgetLayout);
    }
</script>
```

### 3. 主标签栏组件 (Tags.astro)

```astro
---
import { getTagList } from "./content-utils";
import { getTagUrl } from "./url-utils";
import ButtonTag from "./ButtonTag.astro";
import WidgetLayout from "./WidgetLayout.astro";

const tags = await getTagList();

const COLLAPSED_HEIGHT = "7.5rem";

const isCollapsed = tags.length >= 20;

interface Props {
	class?: string;
	style?: string;
}
const className = Astro.props.class;
const style = Astro.props.style;
---
<WidgetLayout name=标签 id="tags" isCollapsed={isCollapsed} collapsedHeight={COLLAPSED_HEIGHT} class={className} style={style}>
    <div class="flex gap-2 flex-wrap">
        {tags.map(t => (
            <ButtonTag href={getTagUrl(t.name)} label={`View all posts with the ${t.name.trim()} tag`}>
                {t.name.trim()}
            </ButtonTag>
        ))}
    </div>
</WidgetLayout>
```

## 四、样式配置

在全局 CSS 文件中添加以下样式：

```css
:root {
  --primary: oklch(var(--p)); /* 使用你现有的 primary 颜色 */
  --btn-content: oklch(var(--bc) / 0.8); /* 使用现有文本颜色，带透明度 */
  --card-bg: oklch(var(--b1)); /* 使用现有背景颜色 */
}

/* 暗色主题适配 */
[data-theme-type="dark"] {
  --btn-content: oklch(var(--bc) / 0.9);
}

/* 按钮样式 */
.btn-regular {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--card-bg);
  color: var(--btn-content);
  border: 1px solid oklch(var(--bc) / 0.2);
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  height: 2rem;
  font-size: 0.875rem;
  padding: 0 0.75rem;
  border-radius: 0.5rem;
}

.btn-regular:hover {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-1px);
}

.btn-plain {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  border-radius: 0.5rem;
}

.btn-plain:hover {
  background-color: oklch(var(--p) / 0.1);
}

/* 卡片基础样式 */
.card-base {
  background-color: var(--card-bg);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding-bottom: 1rem;
}

/* 折叠动画 */
.collapse-wrapper {
  transition: height 0.3s ease;
}

/* WidgetLayout 组件特定样式 */
widget-layout {
  display: block;
}

.widget-layout-title {
  font-weight: bold;
  transition: color 0.2s;
  font-size: 1.125rem;
  color: oklch(var(--bc));
  position: relative;
  margin-left: 2rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.widget-layout-title::before {
  content: "";
  width: 0.25rem;
  height: 1rem;
  border-radius: 0.375rem;
  background-color: var(--primary);
  position: absolute;
  left: -1rem;
  top: 0.35rem;
}

.collapse-wrapper {
  padding: 0 1rem;
  overflow: hidden;
}

.collapsed {
  height: 7.5rem;
}

.expand-btn {
  padding: 0 1rem;
  margin-bottom: -0.5rem;
}

/* 标签云样式 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* 确保自定义元素正确显示 */
widget-layout {
  display: block;
}
```

## 五、在侧边栏中使用

将标签栏组件添加到你的侧边栏中：

```astro
<!-- /src/components/Sidebar.astro -->
---
<!-- 其他 -->
import Tags from "@components/tags/Tags.astro";
<!-- 其他 -->
---

  <!-- 其他侧边栏组件... -->
  
<div class="relative mb-4">
    <Tags />
</div>
  
  <!-- 更多侧边栏组件... -->
```

## 六、创建标签详情页面

为了使标签链接正常工作，需要创建标签详情页：

```astro
// src/pages/blog/tag/[tag].astro
---
import type { Post, Page } from "@interfaces/data";
import PostCard from "@components/PostCard.astro";
import BaseLayout from "@layouts/BaseLayout.astro";
import BaseCard from "@components/BaseCard.astro";
import Pagination from "@components/widgets/Pagination.astro";
import CardGroup from "@components/temple/CardGroup.astro";
import { t } from "@config";
import { Icon } from "astro-icon/components";
import { generatePageLinks } from "@utils/blogUtils";
import { getTagPaginationPaths } from "@utils/paginationUtils";

export async function getStaticPaths({ paginate }: { paginate: any }) {
  return getTagPaginationPaths({ paginate });
}

const { page } = Astro.props as { page: Page };
const params = Astro.params as { tag: string; page: string };

const totalPages = Math.ceil(page.total / page.size);
const pageLinks = generatePageLinks(totalPages);
---

<BaseLayout title={`${t("label.tagPage")} - ${params.tag}`}>
  <BaseCard title={t("label.tagPage")}>
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex items-center gap-2">
        <Icon name="lucide:tag" class="w-6 h-6 text-secondary" />
        <h1 id="h1" class="text-2xl md:text-3xl font-bold">{params.tag}</h1>
        <div class="badge badge-secondary">{page.total} {page.total === 1 ? t("label.post") : t("label.posts")}</div>
      </div>
      <a href="/blog/tags" class="btn btn-outline btn-sm gap-2">
        <Icon name="lucide:tag" class="w-4 h-4" />
        <span>{t("label.allTags")}</span>
      </a>
    </div>
    <div class="divider my-2"></div>
    <p class="text-sm opacity-75">{t("label.tagDescription")}</p>
  </BaseCard>
  <CardGroup cols="1" gap="6">
    {
      page.data.map((blog: Post) => (
        <PostCard
          title={blog.data.title}
          image={blog.data.image}
          description={blog.data.description}
          url={"/blog/" + blog.slug}
          pubDate={blog.data.pubDate}
          badge={blog.data.badge}
          categories={blog.data.categories}
          tags={blog.data.tags}
          word={blog.remarkPluginFrontmatter.totalCharCount}
          time={blog.remarkPluginFrontmatter.readingTime}
        />
      ))
    }
  </CardGroup>
  <Pagination page={page} totalPages={totalPages} pageLinks={pageLinks} baseUrl={`/blog/tag/${params.tag}`} />
</BaseLayout>

```

## 七、完活！

OK完工！
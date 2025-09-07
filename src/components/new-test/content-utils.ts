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
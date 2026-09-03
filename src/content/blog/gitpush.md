---
title: "怎么提交本地代码？"
description: "留档"
pubDate: "SEP 7 2025"
categories:
  - Development
badge: Development
draft: true
---

首先，你需要让Git知道你是谁：`git config --global user.name "你的Github用户名"` 和 `git config --global user.email "你的Github邮箱@example.com"`

然后，更改远程仓库为ssh*（如果是通过ssh克隆的不用改）：`git remote set-url origin git@github.com:xxx/xxx`

随后，让我们提交所有文件：`git add .`

之后，让我们发布一个本地提交：`git commit -m "项目初始化"`

最后，让我们将本地更改提交到远程仓库：`git push`

feat：新增特性或功能
fix：修复Bug
docs：文档相关的变更
style：代码风格的调整，如格式化、空格等
refactor：重构代码
test：增加或修改测试用例
chore：构建过程或辅助工具的变更


海阔天空下载链接：https://link.jiyiho.cn/orfile/down.php/4cd38ddc0719573d04599e609dfbf96a.mp3

新电脑测试内容。

https://cloudflare.pay/claimed?tag=78787

本次修改总结
修复内容
问题	原因
放大时边框遮盖内容	.lightbox-stage 的 overflow: hidden 裁切放大后的图片
左右箭头始终显示	display: flex 覆盖了 [hidden] 的 display: none
鼠标悬停出现提示	title 属性触发浏览器原生 tooltip
新增功能
- 首尾箭头智能隐藏：第一张不显示 ←，最后一张不显示 →
移除内容
- 移除底部提示文字 <div class="lightbox-hint">滚轮缩放 · 双击复位</div> 及对应 CSS
验证
astro check 通过，0 错误。
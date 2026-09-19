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

已全部恢复原装（工作区干净，和 main 一致）。
本次会话总结
背景：文章页左侧边栏把目录埋在底部（头像/搜索/标签下面），长文章要滚很久才看到目录。
过程中尝试的三个方案（均未留存）：
1. 目录右移 + 悬浮栏结合（第一版已实现）
- 右下角悬浮工具条上方加浮动目录面板 + 开关按钮，开合状态记忆在 localStorage。
- 已通过 build/check/eslint，但因"长目录打开显示不全"被否，已回退。
2. 目录移到侧边栏最上方（第二版）
- 只改 Sidebar.astro：文章页目录置顶并 sticky，标签留在原处。
- 出现 bug：滚动时头像/搜索从目录卡片前面滑过（侧边 DOM 顺序导致 z 序问题），被否。
3. 文章页侧边栏只留目录（第三版）
- 头像/搜索/标签用 CSS 整体 translateX(-115%) 移出屏幕（md+ 生效），目录置顶 sticky；其他页面服务端直接渲染完整侧边栏，无额外 JS。
- 通过了所有检查与构建验证，但整体方案被否。
最终：按用户要求全部回退，git status 干净，无任何残留改动。
经验记录：根因是目录初始位置在侧边栏折叠线之下；侧边栏卡片 z 序（position:sticky 未建堆叠上下文时，后渲染的同层卡片会盖在上面）是方案二的坑；方案一/三若要"进入文章的瞬间先滑出头像"需要配合 astro:before-swap 做逐元素动画，本次未做。
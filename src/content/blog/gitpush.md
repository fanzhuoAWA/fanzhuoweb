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
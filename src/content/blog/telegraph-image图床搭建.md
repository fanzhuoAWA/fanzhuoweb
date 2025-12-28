---
title: "搭建免费、无限空间的图床"
description: "搭建基于 Telegraph 的图片上传工具"
pubDate: "AUG 20 2025"
image: https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAOLaVCtZIxNPVXj8iKtBYn6h-gN_AoAAqsLaxtWrYhWxQAB_Mg60AyBAQADAgADeQADNgQ.png
categories:
  - Development
tags:
  - 网站搭建
badge: Development
---

在写网页、写博客的时候，经常会遇到需要插入图片的情况，这个时候就需要一款图片托管工具，那么我们能不能自己搭建一款呢？
# 简介
Telegraph-Image 是一款开源的图床系统，通过 Telegraph-Image ，我们可以更轻松地上传、管理和引用图片。
# 搭建
### 账号注册
首先我们需要一个 [Github](https://github.com/) 账号、一个 [Clougflare](https://dash.cloudflare.com/) 账号和一个 [Telegram](http://telegram.org/) 账号。
### 在 Github 上 Fork Telegraph-Image 项目。
打开 [Telegraph-Image 项目仓库](https://github.com/cf-pages/Telegraph-Image) 点击右上角的 Fork ，创建新分支到你的仓库。
![](https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAOMaVCuB2f_7kgC06NhhRJeRFqQOkMAArALaxtWrYhWqc1xreG5gT4BAAMCAAN5AAM2BA.png)

### 获取 Bot_Token
在 Telegram 中，向 @BotFather 发送命令 ```/newbot``` ，根据提示依次输入你的机器人名称和用户名。成功创建机器人后，你将会收到一个 BOT_TOKEN ，用于与 Telegram API 进行交互。
![](https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAONaVCu0V9UPg6pD4wUWkTOCQQL9C4AArcLaxtWrYhWVM1uahKJy7cBAAMCAAN4AAM2BA.png)

### 设置机器人为频道管理员
创建一个新的频道（ Channel ），进入该频道后，选择频道设置。将刚刚创建的机器人添加为频道管理员，这样机器人才能发送消息。
![](https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAOOaVCu9taZcyL80alkphwMqBWWppEAArgLaxtWrYhW4yg-tdaVi2gBAAMCAAN4AAM2BA.png)![](https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAOPaVCvDA3Nwt4Cwm3kYteHUDZlOnEAArsLaxtWrYhW0A_wAdf_JcUBAAMCAAN5AAM2BA.png)

### 获取Chat_ID
通过 @VersaToolsBot 获取你的频道ID：向该机器人发送消息，按照指示操作，最后就可以得到 CHAT_ID （即频道的ID）。

或者也可以通过 @GetTheirIDBot 获取（也是按指示操作）。
![](https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAOQaVCvRS0RAdSWbzV8NcnEa4RTXsAAArwLaxtWrYhWhXC2IPgOHjABAAMCAAN4AAM2BA.png)

# 部署
### 连接 Git 提供程序
打开 Cloudflare Dashboard ，进入 Pages 管理页面，选择创建项目，选择连接到 Git 提供程序
![](https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAORaVCvWsA7LMai4_J0VMJCa05KPo8AAr0LaxtWrYhWFoQeXjJ3tqUBAAMCAAN5AAM2BA.png)

按照页面提示输入项目名称，选择我们刚刚 Frok 的 git 仓库，点击部署站点即可完成部署
### 设置环境变量
去Cloudflare Pages后台设置相关的环境变量（注：修改环境变量后，需要重新部署才能生效）
|环境变量      |示例值       |说明        |
|:--------:|:--------:|:--------:|
|TG_Bot_Token|123468:AAxxxGKrn5	|从 @BotFather 获取的 Telegram Bot Token 。|
|TG_Chat_ID|-1234567  |频道的ID，确保 TG Bot 是该频道或群组的管理员。|
### 绑定自定义域名
在 Pages 的自定义域里面，绑定 cloudflare 中存在的域名，在 Cloudflare 托管的域名，自动会修改 dns 记录。

# 完成了！
现在你可以通过你的域名或者 Cloudflare 给你分配的域名访问这个图床了！

这个是我制作的，可以先看看最终效果[awa](https://image.fanzhuo.xyz/)

参考文档：[Telegraph-Image 项目仓库的 README](https://github.com/cf-pages/Telegraph-Image)
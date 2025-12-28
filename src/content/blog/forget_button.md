---
title: "使用 CSS 和 HTML 实现“失忆按钮”"
description: "如何使用 HTML 和 CSS 创建一个有趣的“失忆按钮”"
pubDate: "AUG 21 2025"
image: https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAOJaVCscOx3sKkyG7LFKNI13zPdnzYAAp8LaxtWrYhWJkmudnbuzg4BAAMCAAN5AAM2BA.png
categories:
  - Development
tags:
  - 交互
  - html
  - css
badge: Development
---

![](https://image.fanzhuo.xyz/file/AgACAgUAAyEGAASKws10AAOKaVCsojqQyD9-P4iSZwuU48ePHi4AAqgLaxtWrYhWRVFfYuZx1eIBAAMCAAN4AAM2BA.png)
看到这张表情包，突然心血来潮（，想在网站里塞一个小彩蛋：失忆按钮(。・ω・。)

### 先理一下功能
为了避免无限循环，还是加上退出按钮……
> 点击"失忆按钮"链接时，触发按钮
> 
> 显示自定义弹窗，内容为"这是什么？"和两个按钮："点一下"、"不点啦"
>
> 当点击"点一下"按钮时，弹窗会关闭并立即重新打开
>
> 当用户点击"不点啦"按钮时，弹窗会关闭

# 实现
我们使用 CSS 类来控制动画，并在适当的时候添加和移除类。
 定义动画：
   - 打开动画：我们命名为 `dialog-open-animation`
   - 关闭动画：命名为 `dialog-close-animation`

 在弹窗显示时，我们添加 `dialog-open-animation` 类，并移除关闭动画类。
 
 在关闭时，我们添加 `dialog-close-animation` 类，然后等待动画结束再隐藏。
 
 每次打开时，我们需要先移除之前的动画类，然后添加打开动画类，以重新触发动画。
 
 由于我们每次打开都是同一个弹窗，我们需要在关闭后重置样式，以便下次打开时动画重新开始。

 我们这样设计：
 
 显示弹窗：
   - 设置 display: block
   - 移除关闭动画类（如果有）
   - 添加打开动画类

 关闭弹窗：
   - 添加关闭动画类
   - 监听动画结束事件，结束后隐藏弹窗并移除关闭动画类

好像我们可以使用更简单的方法：在关闭弹窗后，我们将弹窗的 display 设为 none ，并移除所有动画类。这样下次打开时，再重新添加动画类就行啦。

### 具体实现
```html
<!-- 页面中的按钮 -->
<a class="projectItem b" href="javascript:void(0)" onclick="showRecursiveDialog()">
    <div class="projectItemLeft">
        <h1>失忆按钮</h1>
        <p>这是什么？点一下</p>
    </div>
</a>

<!-- 递归弹窗容器 -->
<div id="recursiveDialog" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; opacity: 0; transition: opacity 0.3s ease;">
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.8); background: white; padding: 25px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); text-align: center; max-width: 80%; transition: transform 0.3s ease, opacity 0.3s ease;">
        <p style="font-size: 18px; margin-bottom: 20px; line-height: 1.5; color: #000;">这是什么？</p>
        <div>
            <button onclick="handleDialogChoice('click')" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px; font-size: 16px; transition: all 0.2s ease;">点一下</button>
            <button onclick="handleDialogChoice('cancel')" style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px; transition: all 0.2s ease;">不点啦</button>
        </div>
    </div>
</div>

<script>
let dialogActive = false; // 跟踪弹窗状态

// 显示递归弹窗（带动画）
function showRecursiveDialog() {
    if (dialogActive) return; // 防止重复打开
    
    const dialog = document.getElementById("recursiveDialog");
    const content = dialog.querySelector("div");
    
    // 重置状态
    dialogActive = true;
    dialog.style.display = "block";
    
    // 触发动画
    setTimeout(() => {
        dialog.style.opacity = "1";
        content.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
}

// 关闭弹窗（带动画）
function closeRecursiveDialog() {
    const dialog = document.getElementById("recursiveDialog");
    const content = dialog.querySelector("div");
    
    // 关闭动画
    dialog.style.opacity = "0";
    content.style.transform = "translate(-50%, -50%) scale(0.8)";
    
    // 动画结束后隐藏
    setTimeout(() => {
        dialog.style.display = "none";
        dialogActive = false; // 重置状态
    }, 300);
}

// 处理选择
function handleDialogChoice(choice) {
    if (choice === 'click') {
        // 先关闭当前弹窗
        closeRecursiveDialog();
        
        // 延迟后打开新弹窗
        setTimeout(() => {
            showRecursiveDialog();
        }, 350); // 比关闭动画稍长一点
    } else {
        closeRecursiveDialog();
    }
}
</script>
```
### 完成！
你可以在[飞屋工作室官网](https://shg.fanzhuo.xyz/)看到我留的失忆按钮小彩蛋！
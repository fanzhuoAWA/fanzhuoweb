---
title: "P11385 [POI 2024/2025 R1] Walki robotów 题解"
description: "模拟？"
pubDate: "Dec 28 2024"
image: https://cdn.luogu.com.cn/upload/image_hosting/juamdoau.png
categories:
  - Algorithm
tags:
  - 题解
  - C++
  - 普及/提高−
badge: Solution
---
## 题意
有若干个机器人要比赛，每个机器人有一个力量和敏捷度，如果在比赛时这两项值任意一个大于对手，就可以将对手淘汰。如果这两项值一个大于对方一个小于对方，就会同归于尽。现在需要安排机器人比赛顺序使所有机器人都被同归于尽。如果可以，输出 ```TAK```，否者输出 ```NIE```。

## 思路
先按照力量升序排序。
![](https://cdn.luogu.com.cn/upload/image_hosting/juamdoau.png)
排完后，用力量从小到大找出若干条路径。
![](https://cdn.luogu.com.cn/upload/image_hosting/t12qcoeh.png)
这样子，每条路径的终点是可以一路“吃”下去的，最后会剩下两个高手机器人，它们可以同归于尽，所以是 ```TAK```。

所以，我们可以发现，如果路径是**偶数个**，那么一定是 ```TAK```。那要是路径为奇数个呢？

![](https://cdn.luogu.com.cn/upload/image_hosting/dw3hta88.png)

如果有这些机器人，那么找出路径后如下图。

![](https://cdn.luogu.com.cn/upload/image_hosting/p6jhb8u9.png)

“吃”完后剩下奇数个高手，同归于尽不了啊。

其实是可以的。

![](https://cdn.luogu.com.cn/upload/image_hosting/0d0jj1y9.png)

让一个高手跳过一个本该被它“吃”掉的机器人，让它最后去和多出的那个高手（见图中红色路径）同归于尽。

如果找不到这样的“小兵”去碰高手，才输出 ```NIE```。

完活！

感谢 [**purinliang**](https://www.luogu.com.cn/user/177859) 的指导。
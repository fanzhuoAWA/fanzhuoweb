---
title: "UVA11661 Burger Time?题解"
description: "简单的字符串问题"
pubDate: Dec 15 2024
image: https://pic.52112.com/2019/09/05/JPG-190906_320/gorDA81zm9_small.jpg
categories:
  - Algorithm
tags:
  - 题解
  - C++
  - 暂无评定
badge: Solution
---
~~也可以在[**我的洛谷博客**](https://www.luogu.com.cn/article/zgo3vjow)中食用。~~
## 题意
给定若干个长度为 $l$ 的字符串，其间 ```R``` 表示餐厅，```D``` 表示药店，```Z``` 表示两者，```.``` 代表空地。

## 思路
先是一个 while 循环输入 $l$，里面定义一个 $ans$ 表示最终答案，$r$ 和 $d$ 分别表示餐厅位置和药店位置，再输入字符串 $s$，把 $s$ 的每一个字符遍历一遍。

如果那个字符是 ```Z``` 就直接 $ans$ 设为 $0$ 后退出循环。

```R``` 或者 ```D``` 的时候就分别把 $r$ 或者 $d$ 赋值为当前循环的次数 $i$。

每次循环时如果 $r$ 和 $d$ 已经有值了就把 $ans$ 赋值为 $\min(ans, |r - d|)$。

注意哦，$ans$ 初始要**赋值为一个较大的值**，不然在取最小值的时候会错。

## Code

```cpp
#include <iostream>
#include <algorithm>
#include <cmath>
using namespace std;
int main()
{
    int l;
    cin >> l;
    while(l != 0)
    {
        int r = -1, d = -1, ans = 1e9;
        string s;
        cin >> s;
        for(int i = 0; i < l; i++)
        {
            if(s[i] == 'Z')
            {
                ans = 0;
                break;
            }
            if(s[i] == 'D')
            {
                d = i;
            }
            else if(s[i] == 'R')
            {
                r = i;
            }
            if(r != -1 && d != -1)
            {
                ans = min(abs(r - d), ans);
            }
        }
        if(ans == 1e9)//一间都没有
        {
             ans = 0;
        }
        cout << ans << "\n";
        cin >> l;
    }
    return 0;
}
```
如有不严谨之处欢迎指出。
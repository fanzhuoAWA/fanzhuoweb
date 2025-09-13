---
title: "C++二分模板"
description: "zzz"
pubDate: "MAY 24 2025"
categories:
  - Algorithm
tags:
  - 模板
  - C++
  - 二分
badge: Algorithm
---

上课时记下的一些笔记

```cpp
//整数二分
int L = 0, R= 1e9;
int ans = -1;
while(L <= R)
{
    int mid = (L + R) >> 1;
    if(check(mid))
    {
        ans = mid;
        R = mid - 1;
    }
    else
    {
        L = mid + 1;
    }
}
//实数二分 或者 浮点数二分
long double l = 0, r = 1e9;
int T = 100;
while(T--)
{
    long double mid = (l + r) * 0.5;
    if(check(mid))
    {
        l = mid;
    }
    else
    {
        r = mid;
    }
}
cout << l << "\n";//输出r也可
//二分函数
//lower_bound(*begin, *end, val, cmp) //cmp是自主设定的比较函数（可有可无，不建议使用）
//upper_bound()

//lower表示 在我给定的排序规则下，找到第一个大于等于val的位置指针
//upper表示                                大于

//例：
int a[50];
a[1] = 2;
a[2] = 4;
a[3] = 5;
a[4] = 6;
auto it = lower_bound(a + 1, a + 49, 5);
cout << *it << "\n";//输出的是5（a[3]），实际得到的是第一个大于等我要求的值（val项的5）的位置
//访问第一个大于等于val的值
//第二种用法
int pos = lower_bound(a + 1, a + 49, 5) - a;//得到了我们想要的位置
//a[pos] == *it
## ## ```

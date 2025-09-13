---
title: "C++模意义下的乘法逆元模板"
description: "zzz"
pubDate: "MAY 24 2025"
categories:
  - Algorithm
tags:
  - 模板
  - C++
  - 笔记
badge: Algorithm
---

也是上课时记的笔记

## 前导知识
费马小定理：若$p$是质数，对任意整数$a$不是$p$的倍数，有$a^{p-1}\equiv 1\pmod pap−1≡1(modp)$，也可以写作$a^{p}\equiv a\pmod pap≡a(modp)$。

```cpp
#include <iostream>
using namespace std;
const int N = 3e6 + 1;//题目的数据范围
int fac[N], ifac[N], inv[N], n, p;
int fast_power(int a, int b)//快速幂
{
    int res = 1;
    while(b)
    {
        if(b & 1)
        {
            res = 1ll * res * a % p;
        }
        a = 1ll * a * a % p;
        b >>= 1;
    }
    return res;
}
int main()
{
    scanf("%d%d", &n, &p);
    fac[0] = 1;
    for(int i = 1; i <= n; i++)
    {
        fac[i] = 1ll * fac[i - 1] * i % p;
    }
    ifac[n] = fast_power(fac[n], p - 2);
    for(int i = n - 1; i >= 0; i--)
    {
        ifac[i] = 1ll * ifac[i + 1] * (i + 1) % p;
        inv[i + 1] = 1ll * ifac[i + 1] * fac[i] % p;
    }
    for(int i = 1; i <= n; i++)
    {
        printf("%d\n", inv[i]);
    }
    return 0;
}
```
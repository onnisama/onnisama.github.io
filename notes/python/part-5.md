---
permalink: /notes/python/5/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (5)：高级特性、模块与常用库"
author: "雾汐"
header-style: text
catalog: true
date: 2026-07-06
tags:
  - Python
  - 编程基础
  - 学习笔记
---

> [返回 Python 学习笔记总目录](/2026/07/06/Python-Note/)

## 高级特性

### 切片

如果想取 `list` 或 `tuple` 的部分元素可以使用切片，所得出的结果依旧是 `list` 或 `tuple`

区间范围为 **左闭右开** ，同时也可以指定步长

```python
list = [1,2,3,4]
print(list[1:3])
print(list[:2])
print(list[2:])
print(list[0:-1])
print(list[:])
print(list[::2])
print(list[::-1])

>>>[2, 3]
>>>[1, 2]
>>>[3, 4]
>>>[1, 2, 3]
>>>[1, 2, 3, 4]
>>>[1, 3]
>>>[4, 3, 2, 1]
```



### 列表生成式

在列表的生成时，可以使用 **条件** 和 **迭代** 来对生成的内容进行调整

例如生成 1-10 中偶数的平方数：

```python
>>> [x * x for x in range(1, 11) if x % 2 == 0]
[4, 16, 36, 64, 100]
```

其中 `for` 后面的 `if` 是对 `x` 的过滤条件，不可以带 `else` 

下面的用法中 `for` 前面的 `if ... else` 是表达式，必须含有 `else` ，意为满足 `if` 则执行 `if` 前的表达式，否则执行 `else` 后的表达式

> [!CAUTION]
>
> 不能使用 `elif` ，当使用嵌套 `if ... else` 结构

```python
>>> [2 * x if x % 2 == 0 else -x for x in range(1, 11)]
[-1, 4, -3, 8, -5, 12, -7, 16, -9, 20]
```



### 生成器（generator）

用于在循环的过程中计算出后续元素，而非直接构造整个列表，节省空间

生成器有两种构造方法：

1. 直接构造

只需把列表生成式的 `[ ]` 改为 `( )` 即可

例如：

```python
g = (x * x for x in range(10))
```

2. 函数构造

函数的返回值改为 `yield` ，且每次调用都从上次的 `yeild` 处继续

下面是斐波那契数列构造生成器：

```python
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'

g = fib(6)
```

> [!WARNING]
>
> **调用generator函数会创建一个generator对象，多次调用generator函数会创建多个相互独立的generator**
>
> 因此需要给生成器指定一个变量名，确保每次调用都经由同一个变量名



生成器的元素也有两种迭代方法：

1.  `next` 函数

```python
t = triangles()
results = []
for _ in range(10):
    results.append(next(t))

for t in results:
    print(t)
    

[1]
[1, 1]
[1, 2, 1]
[1, 3, 3, 1]
[1, 4, 6, 4, 1]
[1, 5, 10, 10, 5, 1]
[1, 6, 15, 20, 15, 6, 1]
[1, 7, 21, 35, 35, 21, 7, 1]
[1, 8, 28, 56, 70, 56, 28, 8, 1]
[1, 9, 36, 84, 126, 126, 84, 36, 9, 1]
```

2.  `for` 循环

```python
n = 0
results = []
for t in triangles():
    results.append(t)
    n = n + 1
    if n == 10:
        break
        
for t in results:
    print(t)
    
#结果同上
```

#### 杨辉三角构造生成器：

```python
def triangles():
    row = [1]
    while True:
        yield row
        row = [1] + [row[i] + row[i+1] for i in range(len(row) - 1)] + [1]
```



### 附录：`Iterable` 和 `Iterator` 的比较

| 对比点           | Iterable         | Iterator           |
| ---------------- | ---------------- | ------------------ |
| 能否 for 遍历    | ✅                | ✅                  |
| 能否 next()      | ❌                | ✅                  |
| 是否保存遍历状态 | ❌                | ✅                  |
| 是否一次性       | ❌                | ✅                  |
| iter(x) 返回     | iterator         | iterator           |
| 记忆点           | 能“被遍历”的东西 | 正在“遍历中”的东西 |

可以使用下面方法判断是否是 `iterable` 及 `iterator` ：

```python
from collections.abc import Iterable, Iterator	#注意大写
print(isinstance(..., Iterable))
print(isinstance(..., Iterator))
```



---

## Modules

### 编写模块

自己编写模块并放置在不同的 `.py` 文件中可以有效提高代码的可维护性，避免冲突

可以设置包来管理目录，注意每一个包的目录都需要一个 `__init.py__` 文件，可以没有内容

例如：

>```python
>mycompany
> ├─ web
> │  ├─ __init__.py
> │  ├─ utils.py
> │  └─ www.py
> ├─ __init__.py
> ├─ abc.py
> └─ utils.py
>```

可以使用

```python
mycompany.utils
mycompany.web.utils
```

来代表不同的包

> [!WARNING]
>
> 自己创建模块时要注意命名，不能和Python自带的模块名称冲突



### 导入模块

使用 `import` 可以导入存在的模块，不需要写模块的 `.py` 后缀

例如：

```python
import module
module.function()

from module import function
function()
```

前者导入整个模块的所有函数，需要加模块前缀；后者仅导入某个或某些函数，可以直接使用

以具体包的编写为例：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

#文档注释
' a test module '

#作者
__author__ = 'Michael Liao'

import sys

def test():
    args = sys.argv
    if len(args)==1:
        print('Hello, world!')
    elif len(args)==2:
        print('Hello, %s!' % args[1])
    else:
        print('Too many arguments!')

if __name__=='__main__':	#为主函数时为真
    test()
```



### 作用域

|    变量种类    |     普通变量      |       private变量        |             特殊变量              |
| :------------: | :---------------: | :----------------------: | :-------------------------------: |
| **被外部引用** |         √         |            ×             |                 √                 |
|    **格式**    |        无         |     `_` 或 `__` 开头     |             `__xx__`              |
|    **例子**    | `abc`,`x123`,`PI` | `_private1`,`__private2` | `__author__`,`__doc__`,`__name__` |



### 安装第三方模块

在 [pypi](https://pypi.python.org/) 官网搜索库的名称，使用 `pip install ...` 即可



### 常用库

#### time

##### time.time() 

获取当前时间戳（秒）

```python
>>> import time
>>> print(time.time())

1713181234.123
```

含义：

- 从 1970-01-01 到现在的秒数



##### time.sleep()

让程序暂停

```python
>>> import time
>>> time.sleep(2)
```

暂停 2 秒

常用场景：

- 模拟延迟
- 控制循环速度
- 爬虫限速



##### time.perf_counter()

高精度计时

```
>>> import time
>>> start = time.perf_counter()
>>> for i in range(1000000):
    pass
>>> end = time.perf_counter()
>>> print(end - start)

28.99913320000087	# 单位为 s
```

用于：

- 性能测试
- 算法计时



##### time.ctime()

把时间戳转成人类可读格式

```python
>>> import time
>>> print(time.ctime())

Wed Apr 15 20:00:00 2026
```



##### time.localtime() 

```python
>>> import time
>>> t = time.localtime()
>>> print(t)

time.struct_time(tm_year=2026, tm_mon=4, tm_mday=15, ...)

# 可以拆年月日
>>> print(t.tm_year)
>>> print(t.tm_mon)
>>> print(t.tm_mday)
```



##### time.strftime()

把时间变成你想要的格式

```python
>>> import time
>>> print(time.strftime("%Y-%m-%d %H:%M:%S"))

2026-04-15 20:10:00
```



##### time.strptime()

把字符串转时间

```python
>>> import time
>>> t = time.strptime("2026-04-15", "%Y-%m-%d")
>>> print(t)
```



#### random

##### random.random()

生成 0 ~ 1 之间的随机小数

```python
>>> import random
>>> print(random.random())

0.3729183	# 范围为 [0.0, 1.0)
```



##### random.randint(a, b)

生成整数（包含两端）

```python
>>> import random
>>> random.randint(1, 10)

1 ~ 10（包括10）
```



##### random.randrange()

类似 range()

```python
>>> import random
>>> random.randrange(0, 10, 2)	# 区间和步长

0, 2, 4, 6, 8
```



##### random.choice(seq)

从列表随机选一个

```python
>>> import time
>>> random.choice(["A", "B", "C"])

"A" 或 "B" 或 "C"
```



##### random.choices(seq, k=n)

可重复抽样

```python
>>> import random
>>> random.choices(["A", "B", "C"], k=3)

['A', 'C', 'C']
```



##### random.sample(seq, k=n)

不重复抽样

```python
>>> import random
>>> random.sample([1,2,3,4,5], 3)

[2, 5, 1]
```



##### random.shuffle(list)

打乱列表

```python
>>> import random
>>> lst = [1,2,3,4,5]
>>> random.shuffle(lst)
>>> print(lst)

[3, 1, 5, 2, 4]
```



##### random.uniform(a, b)

生成浮点数范围

```python
>>> import random
>>> random.uniform(1, 10)

3.14159
```





---

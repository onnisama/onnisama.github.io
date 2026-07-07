---
permalink: /notes/python/3/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (3)：函数进阶、字符串与文件"
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

## 函数进阶

### 高阶函数

python 的变量可以指向函数，如 `f = abs` 即可将 `f` 指向绝对值函数本身，调用 `f( )` 与 `abs( )` 并无区别

同样函数名也是变量，若将 `abs = 10` ，则无法通过 `abs(...)` 来调用绝对值函数，因为其指向整数 `10`

一个函数通过变量名接收另一个函数作为参数，这种函数就称之为高阶函数

例如：

```python
def add(x, y, f):
    return f(x) + f(y)

add(-5, 6, abs)
>>>11
```

编写高阶函数，就是让函数的参数能够接收别的函数

1. `map( )` 函数

将一个列表内的所有函数经过函数运算后形成新的 `iterator` ，可以使用 `list( )` 直接查看，也可以使用 `next( )` 遍历

例如：

```python
>>> list(map(str, [1, 2, 3, 4, 5, 6, 7, 8, 9]))
['1', '2', '3', '4', '5', '6', '7', '8', '9']

def f(x):
     return x * x
r = map(f, [1, 2, 3, 4, 5, 6, 7, 8, 9])

>>> list(r)
[1, 4, 9, 16, 25, 36, 49, 64, 81]
```

2. `reduce( )` 函数（需调用 `functools` 模块）

将列表中元素经函数运算的结果继续和序列的下一个元素做累积计算

例如：

```python
from functools import reduce
def fn(x, y):
     return x * 10 + y

>>> reduce(fn, [1, 3, 5, 7, 9])
13579
```

配合 `map( )` 可以完成 `str -> int` 的转换：

```python
from functools import reduce

DIGITS = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}

def str2int(s):
    def fn(x, y):
        return x * 10 + y
    def char2num(s):
        return DIGITS[s]
    return reduce(fn, map(char2num, s))
```

3. `filter( )`

用于筛选处出序列中满足函数值为真的元素

例如：

```python
def is_odd(n):
    return n % 2 == 1

>>>list(filter(is_odd, [1, 2, 4, 5, 6, 9, 10, 15]))
[1, 5, 9, 15]
```

再如把一个序列中的空字符串删掉：

```python
def not_empty(s):
    return s and s.strip()

list(filter(not_empty, ['A', '', 'B', None, 'C', '  ']))
['A', 'B', 'C']
```

> 'A'  ->  s 为真，执行 s.strip() 为真值 ‘A‘ ，返回
>
> ''  ->  s 为假，短路不返回
>
> None  ->  s 为假，短路不返回
>
> '  '  ->  s 为真，执行 s.strip() 为假值空字符串，不返回

可以使用 `filter( )` 求素数：

```python
def _odd_iter():
    n = 1
    while True:
        n += 2
        yield n

def _not_divisible(n):
    return lambda x : x % n > 0

def primes():
    yield 2
    it = _odd_iter()
    while True:
        n = next(it)
        yield n
        it = filter(_not_divisible(n), it)	#清除生成器中所有因素含有n的元素

for n in primes():
    if n < 10000:
        print(n)
    else:
        break
```

4. `sorted( )`

用于排序，可以接收一个关键字为 `key` 的函数实现自定义排序

排序默认为升序，如需降序排序则需添加 `reverse = True` 参数

例如：

```python
>>> sorted(['bob', 'about', 'Zoo', 'Credit'], key=str.lower, reverse=True)
['Zoo', 'Credit', 'bob', 'about']
```



### 闭包

指 **函数在定义时捕获并保存其外部作用域中的变量** ，即使外层函数已经执行结束，这些变量仍然可以被访问

```python
def outer(x):
    def inner():
        return x + 1
    return inner
f = outer(10)
print(f())

>>>11
```

> + `inner` **引用了** x
>
> + Python 会把 `x` **保留下来**
>
> + 和 `inner` 这个函数 **一起打包返回**

闭包需要满足三点：

1. 有**嵌套函数**
2. 内层函数使用了**外层函数的变量**
3. 外层函数返回了内层函数

***闭包的用处***

1. 延迟计算

```python
def power(n):
    return lambda x: x ** n

#根据实际需要定义几次方的运算
square = power(2)
cube = power(3)

print(square(5))  # 25
print(cube(5))    # 125
```

2. 保存状态

```python
def counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

c = counter()
print(c())  # 1
print(c())  # 2
```

> 使用 `nonlocal` 表明我们要修改的是外层 `outer` 的 `count` 变量，而不是在 `inner` 内部创建一个新的局部变量 `count`

3. 装饰器



### 匿名函数

有时候比起显式定义函数，传入匿名函数更加方便

例如：

```python
>>> list(map(lambda x: x * x, [1, 2, 3, 4, 5, 6, 7, 8, 9]))
[1, 4, 9, 16, 25, 36, 49, 64, 81]
```

这里的 `lambda x: x * x` 相当于：

```python
def f(x):
    return x * x
```

匿名函数也是一个函数对象，也可以把匿名函数赋值给一个变量，再利用变量来调用该函数：

```plain
>>> f = lambda x: x * x
>>> f(5)
25
```

同样，也可以把匿名函数作为返回值返回，比如：

```python
def build(x, y):
    return lambda: x * x + y * y	#闭包，与return x * x + y * y相比需再次使用()调用函数才显示结果
```



### 装饰器

在函数前通过 `@` 调用装饰器，可以使用 `func.__name__` 来获取函数的名称

```python
import functools
def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper

#自定义参数需要多一层嵌套
def log2(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator

@log	#相当于print1 = log(print1)
def print1():
    print('1')
    
@log2('execute')	#相当于print2 = log('execute')(print2)
def print2():
    print('2')
    
>>> print1()
call print1():
1
>>> print2()
execute print2():
2
```

> [!TIP]
>
> `functools.wraps` 用于防止经过 `decorator` 装饰后的函数的 `__name__` 变为 `wrapper`



### 偏函数

可以用于定义原函数部分参数固定的新函数

创建偏函数时，可以接收函数对象、`*args`和`**kw`这3种参数

以下为接收 `*args` 和 `**kw` 的例子：

```python
import functools
max2 = functools.partial(max, 10)	#将10置于函数左端，相当于max(10, *args)

>>> max2(5, 6, 7)	#max(10, 5, 6, 7)
10
```



```python
import functools
int2 = functools.partial(int, base=2)	#固定int为二进制转换

>>> int2('1000000')
64
>>> int2('1010101')
85
```



---

## Strings

### [ ] 的作用

`[ ]` 可以直接对 string 的某个元素进行操作（从 0 开始）

例如：

```python
fruit = 'banana'
letter = fruit[1]
print(letter)

>>>a
```

使用 `:` 可以表示从某个序号到某个序号（左闭右开）

例如：

```python
fruit = 'banana'
print(fruit[0:4])

>>>bana
```

`:` 前面省略为开头（0），后面省略为结尾（len - 1）



### Strings 和 for 循环

字符串自身可以作为一个 `for` 循环的范围，运行时会遍历所有字符元素

例如：

```python
fruit = 'banana'
for letter in fruit :
    print(letter)
    
>>>b
>>>a
>>>n
>>>a
>>>n
>>>a
```



### + 运算符的作用

`+` 可以连接不同字符串形成新的字符串

例如：

```python
a = 'Hello'
b = a + ' ' + 'world'
print(b)

>>>Hello world
```



### lower 和 upper

我们使用 **面向对象** 的方式来改变大小写

例如：

```python
str = 'Hello World'
upper = str.upper()
lower = str.lower()
print(upper)
print(lower)

>>>HELLO WORLD
>>>hello world
```

类似的 string 面向对象用法可参见：

https://docs.python.org/3/library/stdtypes.html#string-methods



### 列表的等价

当使用 `b`  列表 `=`  `a` 列表时，它们代表同一个列表

一个修改后另一个也会变动

```python
a = [1, 2, 3, 4, 5]
b = a
print(a is b)
a[0] = 6
print(b)

>>>True
>>>[6, 2, 3, 4, 5]
```



### f-string

在字符串前加上 `f` 可以使得引号内部的 `{ }` 可以自动求值，并且输出值的 `str( )` 形式

例如：

```python
from fractions import Fraction
half = Fraction(1, 2)

>>> print(f'{half}')
1/2
>>> print(f'2 + 2 = {2 + 2}')
2 + 2 = 4
```





---

## Files

### open 函数

调用 `open` 函数不会直接读取文件，而是返回文件句柄

例如：

```python
fhand = open('1.txt')	#文件名需要写成字符串形式，或者直接 input 输入，返回值为文件句柄
inp = fhand.read()	#将整个文件写在一个字符串中
for line in fhand :
    #line = line.rstrip()
    print(line)
    
>>>1
>>>
>>>2
>>>
```

`print` 函数会在输出行后再加一行空行，如果不需要该空行可以加上注释中的表达式，意为删去右边的空白内容



### 在文件中寻找语句

可以用以下方法查找符合某种条件的语句（其中 `if` 语句和对应的 `if not` 语句等价）：

```python
fhand = open('1.txt')
for line in fhand :
    if line.startswith('string') :
        ...
    if not line.startswith('string') :
        continue
    if 'string' in line :
        ...
    if not 'string' in line :
        continue
```



---

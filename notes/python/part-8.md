---
permalink: /notes/python/8/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (8)：定制类、枚举与错误处理"
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

## 定制类、枚举与错误处理

### 定制类

类有很多特殊变量函数，可以用于定制类的各种特殊用途

#### \__str__ 和 \_\_repr__

`__str__( )` 可以改变 `print` 实例的结果

```python
class Student(object):
    def __init__(self, name):
        self.name = name
    def __str__(self):
        return 'Student object (name: %s)' % self.name

>>> print(Student('Michael'))
Student object (name: Michael)
```

`__repr__( )` 可以改变交互界面直接输入的结果

```python
class Student(object):
    def __init__(self, name):
        self.name = name
    def __str__(self):
        return 'Student object (name: %s)' % self.name
    __repr__ = __str__

>>> s = Student('Michael')
>>> s
Student object (name: Michael)
```

`__str__( )` 返回用户看到的字符串，而 `__repr__( )` 返回程序开发者看到的字符串

#### \__iter__ 和 \_\_next__

如果一个类想被用于 `for ... in` 循环，必须实现一个 `__iter__( )` 方法，该方法返回一个迭代对象，for循环会不断调用该迭代对象的 `__next__( )` 方法拿到循环的下一个值，直到遇到 `StopIteration` 错误时退出循环

以斐波那契数列为例：

```python
class Fib(object):
    def __init__(self):
        self.a, self.b = 0, 1 # 初始化两个计数器a，b

    def __iter__(self):
        return self # 实例本身就是迭代对象，故返回自己

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b # 计算下一个值
        if self.a > 100000: # 退出循环的条件
            raise StopIteration()
        return self.a # 返回下一个值

>>> for n in Fib():
...     print(n)
1
1
2
3
5
...
46368
75025
```

#### \__getitem__

需要按照下标取出对应的元素，需要实现 `__getitem__( )` 方法

如果需要取出特殊切片内容，需要对括号内的内容进行判断，但尚未对 `step` 参数和负数作处理

```python
class Fib(object):
    def __getitem__(self, n):
        if isinstance(n, int): # n是索引
            a, b = 1, 1
            for x in range(n):
                a, b = b, a + b
            return a
        if isinstance(n, slice): # n是切片
            start = n.start
            stop = n.stop
            if start is None:
                start = 0
            a, b = 1, 1
            L = []
            for x in range(stop):
                if x >= start:
                    L.append(a)
                a, b = b, a + b
            return L

>>> f = Fib()
>>> f[0]
1
>>> f[1]
1
>>> f[2]
2
>>> f[3]
3
>>> f[10]
89
>>> f[100]
573147844013817084101
>>> f[0:5]
[1, 1, 2, 3, 5]
>>> f[:10]
[1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
```

此外， `__setitem__( )` 可以把对象视作 list 或 dict 来对集合赋值， `__delitem__( )` 用于删除某个元素

#### \__getattr__

当调用不存在的属性时， Python 会试图调用 `__getattr__(self, '...')` 来尝试获得属性，属性在调用时会获得并保持 `return` 的内容（可以是函数）

例如：

```python
class Student(object):
    def __init__(self):
        self.name = 'Michael'

    def __getattr__(self, attr):
        if attr=='score':
            return 99
        raise AttributeError('\'Student\' object has no attribute \'%s\'' % attr)

>>> s = Student()
>>> s.name
'Michael'
>>> s.score
99
```

只有在没有找到属性的情况下，才调用 `__getattr__` ，已有的属性不会调用

一定检查完需要有 `raise` 报错信息，否则未定义新属性自动在 `__getattr__` 中寻找，默认返回 `None` ，只需要一个 `return` 就可以处理所有属性

#### \__call__

任何类，只需要定义一个 `__call__` 方法，就可以直接对实例进行调用， `__call__`  还可以定义参数

例如：

```python
class Student(object):
    def __init__(self, name):
        self.name = name

    def __call__(self):
        print('My name is %s.' % self.name)

>>> s = Student('Michael')
>>> s() # self参数不要传入
My name is Michael.
```

#### \__add__ & \_\_radd__

通过定义 `__add__` 方法可以定制类的加法，而 `__radd__` 定义的则是类位右侧的加法

例如：

```python
class number(object):
    def __init__(self, n):
        self.num = n
    def __add__(self, other):
        if isinstance(other, int):
            return self.num + n
        if isinstance(other, number):
        	return self.num + other.num
    __radd__ = __add__
    
>>> number(1) + 2
3
>>> number(1) + number(2)
3
```





### 枚举类

枚举类是用来定义一组固定常量的类型，比单纯用数字或字符串更安全、可读性更好

例如：

```python
from enum import Enum

Month = Enum('Month', ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))

for name, member in Month.__members__.items():
    print(name, '=>', member, ',', member.value)
Jan => Month.Jan , 1
Feb => Month.Feb , 2
Mar => Month.Mar , 3
Apr => Month.Apr , 4
May => Month.May , 5
Jun => Month.Jun , 6
Jul => Month.Jul , 7
Aug => Month.Aug , 8
Sep => Month.Sep , 9
Oct => Month.Oct , 10
Nov => Month.Nov , 11
Dec => Month.Dec , 12
```

`value` 自动赋予成员，默认从 `1` 开始

如要更精准地控制枚举类型：

```python
from enum import Enum, unique

@unique		#@unique装饰器检查保证没有重复值
class Weekday(Enum):	#继承自Enum
    Sun = 0 # Sun的value被设定为0
    Mon = 1
    Tue = 2
    Wed = 3
    Thu = 4
    Fri = 5
    Sat = 6
    
>>> day1 = Weekday.Mon
>>> print(day1)
Weekday.Mon
>>> print(Weekday.Tue)
Weekday.Tue
>>> print(Weekday['Tue'])
Weekday.Tue
>>> print(Weekday.Tue.value)
2
>>> print(day1 == Weekday.Mon)
True
>>> print(day1 == Weekday.Tue)
False
>>> print(Weekday(1))
Weekday.Mon
>>> print(day1 == Weekday(1))
True
>>> Weekday(7)
Traceback (most recent call last):
  ...
ValueError: 7 is not a valid Weekday
>>> for name, member in Weekday.__members__.items():
...     print(name, '=>', member)
...
Sun => Weekday.Sun
Mon => Weekday.Mon
Tue => Weekday.Tue
Wed => Weekday.Wed
Thu => Weekday.Thu
Fri => Weekday.Fri
Sat => Weekday.Sat
```

既可以用成员名称引用枚举常量，又可以直接根据value的值获得枚举常量



## 错误处理

> BaseException类的继承和派生

```
BaseException
 ├── BaseExceptionGroup
 ├── GeneratorExit
 ├── KeyboardInterrupt
 ├── SystemExit
 └── Exception
      ├── ArithmeticError
      │    ├── FloatingPointError
      │    ├── OverflowError
      │    └── ZeroDivisionError
      ├── AssertionError
      ├── AttributeError
      ├── BufferError
      ├── EOFError
      ├── ExceptionGroup [BaseExceptionGroup]
      ├── ImportError
      │    └── ModuleNotFoundError
      ├── LookupError
      │    ├── IndexError
      │    └── KeyError
      ├── MemoryError
      ├── NameError
      │    └── UnboundLocalError
      ├── OSError
      │    ├── BlockingIOError
      │    ├── ChildProcessError
      │    ├── ConnectionError
      │    │    ├── BrokenPipeError
      │    │    ├── ConnectionAbortedError
      │    │    ├── ConnectionRefusedError
      │    │    └── ConnectionResetError
      │    ├── FileExistsError
      │    ├── FileNotFoundError
      │    ├── InterruptedError
      │    ├── IsADirectoryError
      │    ├── NotADirectoryError
      │    ├── PermissionError
      │    ├── ProcessLookupError
      │    └── TimeoutError
      ├── ReferenceError
      ├── RuntimeError
      │    ├── NotImplementedError
      │    ├── PythonFinalizationError
      │    └── RecursionError
      ├── StopAsyncIteration
      ├── StopIteration
      ├── SyntaxError
      │    └── IndentationError
      │         └── TabError
      ├── SystemError
      ├── TypeError
      ├── ValueError
      │    └── UnicodeError
      │         ├── UnicodeDecodeError
      │         ├── UnicodeEncodeError
      │         └── UnicodeTranslateError
      └── Warning
           ├── BytesWarning
           ├── DeprecationWarning
           ├── EncodingWarning
           ├── FutureWarning
           ├── ImportWarning
           ├── PendingDeprecationWarning
           ├── ResourceWarning
           ├── RuntimeWarning
           ├── SyntaxWarning
           ├── UnicodeWarning
           └── UserWarning
```

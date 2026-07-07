---
permalink: /notes/python/2/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (2)：函数基础与常用内置能力"
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

## Functions

### 函数的定义

使用 `def` 函数名 + `:` 

注意函数的内容要缩进

没有返回值时默认返回 `None` ，若要提前返回可以 `return` 或 `return None`

以下为无参函数例子：

```python
def printsomething() :
    print('Hello,world!')

printsomething()
```

以下为含参函数例子：

```python
def greet(lang,yes):
    if yes == 1 :
        if lang == 'es' :
            print('Hola')
        elif lang == 'fr' :
            print('Bonjour')
        else :
            print('Hello')
    else :
        print('你好')
        
greet('es',1)
greet('fr',1)
greet('en',1)
greet('es',0)
greet('fr',0)
greet('en',0)
```

以下为含返回值函数例子：

```python
def greet() :
    return 'Hello'

print(greet(), 'Peter')
```

函数名类似于指向一个函数对象的引用，可以把函数名赋给一个变量，相当于给这个函数起了一个“别名”

例如：

```python
a = abs # 变量a指向abs函数
print(a(-1)) # 所以也可以通过a调用abs函数

>>>1
```

若尚未想好如何写函数的具体代码，可以使用 `pass` 作为占位符

函数可以返回多个值，返回值是 `tuple`

返回一个 `tuple` 可以省略括号，而多个变量同时接收一个tuple，则按位置赋给对应的值



### 调用外部库函数

在外部库定义的函数可以使用 `import` 引用该函数

例如：

```python
#file_test.py
def my_abs (x):
    if not isinstance(x, (int, float)):			#可以用内置的isinstance函数对函数接收的数据类型作限定
        raise TypeError('bad operand type')		#raise写入报错内容
    if x >= 0:
        return x
    else:
        return -x

#main.py
from file_test import my_abs	#这是从模块引入某函数的写法
print(my_abs(-99))

import file_test	#这是引入整个模块的写法
print(file_test.my_abs(-99))	#需要模块名前缀

>>>99
```



### 函数的默认参数

和 C 语言一样，函数的形参可以默认，但是请注意：

>  [!WARNING]
>
> **默认参数必须指向不变对象**

如使用可变对象列表会发生以下问题：

```python
def add_end(L=[]):
    L.append('END')
    return L

>>> add_end()
['END']
>>> add_end()
['END', 'END']
>>> add_end()
['END', 'END', 'END']
```

这是由于函数调用时会改变 `L` 自身的内容

此时，可以用 `None` 这个不变对象来实现：

```python
def add_end(L=None):
    if L is None:
        L = []
    L.append('END')
    return L

>>> add_end()
['END']
>>> add_end()
['END']
```



### 可变参数

在函数的参数前加上 `*` 可以自主控制输入参数的数量，此时参数接收到的是一个 `tuple` ，可以使用元组的规则进行数据加工处理

例如求未知数量参数的平方和函数：

```python
def calc(*numbers):
    sum = 0
    for n in numbers:
        sum = sum + n * n
    return sum
```

如果可变参数的实参是 `list` 或者 `tuple` ，可以在实参前添加 `*` 使其变为可变参数传入

如：

```python
>>> nums = [1, 2, 3]
>>> calc(*nums)
14
```



### 关键字参数

前面的可变参数传入的是元组，如果需要传入含有关键字的参数形成字典，可以使用 `**` 开头的关键字参数

同样，若实参输入是字典的话，可以加上 `**` 变为关键词参数输入

例如：

```python
def person(name, age, **kw):
    print('name:', name, 'age:', age, 'other:', kw)
    
>>> person('Adam', 45, gender='M',job='Engineer')
name: Adam age: 45 other: {'gender': 'M', 'job': 'Engineer'}

>>> extra = {'city': 'Beijing', 'job': 'Engineer'}
>>> person('Jack', 24, **extra)
name: Jack age: 24 other: {'city': 'Beijing', 'job': 'Engineer'}
```



### 命名关键词参数

只能用关键字传，不能靠位置传的参数

```python
def connect(host, port, timeout, retry):
    pass
```

调用时很容易看不懂，如 `connect("localhost", 3306, 5, 3)`

只需要在需要关键字的参数前加上 `*` 即可强制函数在输入参数时指定关键词

```python
def func(a, b, *, c, d):
    print(a, b, c, d)
    
func(1,2,c = 3,d = 4)
```

> [!CAUTION]
>
> `*args` 之后的参数，天然是命名关键字参数

```python
def func(a, *args, b, c):
    print(a, args, b, c)
```

>`a`：位置参数
>
>`args`：可变位置参数
>
>`b, c`：**命名关键字参数**



### type 函数

`type(x)` 可以获取数据类型

例如：

```python
sval = '123'
type(sval)

>>> <class 'str'>
```



### eval 函数

类似于 `f("{ }")` ，`eval(" ")` 可以做到解析字符串，表达式算出结果，变量直接翻译成值

例如：

```python
>>> hello = 'h'
>>> eval("hello")
'h'
>>> eval('1+1')
2
```



### random numbers

需要引入 `random` 库，然后调用多种函数完成提供伪随机数操作

如 `random()` 函数随机生成 `[0,1)` 范围内的数，`randint(a,b)` 函数随机生成 `[a,b]` 范围内的整数，`choice(listname)` 函数随机生成列表范围内的一个数

例如：

```python
import random

for i in range(10):
    print(random.random())
    print(random.randint(5.0,10.0))
    t = range(3)
    print(random.choice(t))
    
>>>0.25213676975219756
>>>9
>>>1
>>>0.8501875820493452
>>>6
>>>0
>>>0.2062370414825051
>>>9
>>>1
```





### String 类型函数

#### print 函数

输出函数，注意逗号会直接转换成空格，输出完自动换行

若字符串前含有 `r` 则表示默认不转移

例如：

```python
print('Hello,','world')
print(r'you')

>>>Hello, world
>>>you
```



#### input 函数

输入函数，返回值为字符串，如果需要输入数字，则需要使用类型转换

例如：

```python
name = input('Who are you?')
print('Welcome', name)
```



#### len 函数

输出字符串或列表的长度

例如：

```python
fruit = 'banana'
print(len(fruit))

>>>6
```



#### replace 函数

可以生成一个将字符串内 **所有** 字符转化成别的字符的新字符串

注意！！！原字符串不会发生改变，而是生成一个新的字符串且指定变量指向

例如：

```python
a = 'abc'
b = a.replace('a', 'A')
print(b)
print(a)

>>>'Abc'
>>>'abc'
```



#### format 函数

`string.format()` 是一个**字符串格式化函数**，用于把变量“填进”字符串里，比拼接字符串更清晰、灵活。

##### 一、基本用法

```python
>>> "Hello, {}".format("Alice")
Hello, Alice
```

`{}` 是**占位符**，`format()` 里的参数会按顺序填进去。

##### 二、多个参数

```python
>>> "{} is {} years old".format("Alice", 20)
Alice is 20 years old
```

##### 三、指定位置（索引）

```python
>>> "{1} is {0} years old".format(20, "Alice")
Alice is 20 years old
```

说明：

- `{0}` → 第一个参数
- `{1}` → 第二个参数

------

##### 四、使用关键字参数

```python
>>> "{name} is {age} years old".format(name="Alice", age=20)
Alice is 20 years old
```

##### 五、格式控制

1. 保留小数

```python
>>> "pi = {:.2f}".format(3.14159)
pi = 3.14
```

2. 对齐

```python
"{:<10}".format("hi")   # 左对齐
"{:>10}".format("hi")   # 右对齐
"{:^10}".format("hi")   # 居中
```

3. 补零

```python
>>> "{:05d}".format(42)
00042
```

4. 百分比

```python
>>> "{:.2%}".format(0.256)
25.60%
```

##### 六、访问数据结构

1. 列表

```python
>>> "{0[0]} {0[1]}".format([1, 2])
1 2
```

2. 字典

```
"{name} is {age}".format(**{"name": "Alice", "age": 20})
```

### 列表类型函数

可以使用一些函数对列表进行处理

1. 添加元素

+ append 用于在列表后添加元素

```python
stuff = list()
stuff.append('book')
stuff.append(99)
print(stuff)

['book',99]
```

+ insert 用于将元素插到指定位置

```python
classmates = ['Michael', 'Bob', 'Tracy']
classmates.insert(1, 'Jack')
print(classmates)

>>>['Michael', 'Jack', 'Bob', 'Tracy']
```

2. 删除元素

- pop 用于根据序号删除指定元素并返回删除元素

- del 用于根据序号删除指定元素
- remove 用于根据元素内容删除指定元素（只删除首元素）

```python
list = [1, 2, 3, 4, 3, 4]
pop = list.pop(0)
print(pop)
print(list)
del list[:2]
print(list)
list.remove(4)
print(list)

>>>1
>>>[2, 3, 4, 3, 4]
>>>[4, 3, 4]
>>>[3, 4]
```

3. sort 用于排列列表

```python
friends = ['Peter','Linda','Tom']
friends.sort()
print(friends)

>>>['Linda', 'Peter', 'Tom']
```

4. sum , max , min 分别表示总和，最大值和最小值

格式为

```python
sum([], start)	#表示从start开始对list中的内容求和
max([], key = func)	#找到list中使func取最大值时的取值
min([], key = func)	#找到list中使func取最小值时的取值
```

例如：

```python
>>> max(range(10), key = lambda x: 7-(x-4)*(x-2))
3
```

5. split 用于分隔字符串生成列表，默认以空格 / 回车为界限分隔，也可备注其他的分隔符号

```python
str = 'Hello world you'
str1 = 'Hello@world@you'
stuff = str.split()
stuff1 = str1.split('@')
print(stuff)
print(stuff1)

>>>['Hello', 'world', 'you']
>>>['Hello', 'world', 'you']
```

6. join 相当于 split 的反函数，用于将列表元素用分界符连接成字符串

```python
list = ['Hello', 'world', 'you']
delimiter = '-'
result = delimiter.join(list)
print(result)

>>>Hello-world-you
```

7. all 在 list 中所有值为真时取 True

例如：

```python
>>> all([x < 5 for i in range(5)])
True
>>> all(range(5))
False
```

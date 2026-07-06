---
layout: post
title: "Python 学习笔记"
author: "雾汐"
header-style: text
catalog: true
tags:
  - Python
  - 编程基础
  - 学习笔记
---

## Introduction and Elements

### Constants(常量)

数字常量即为本身，字符常量需要加 `''` 或者 `""` 



### Reserved words (保留字)

Python 自带的一些保留字不能直接作为变量名、函数名或类名。可以先按用途粗略记忆：

| 类型 | 常见关键词 |
| :--- | :--- |
| 布尔与空值 | `True`、`False`、`None` |
| 条件与循环 | `if`、`elif`、`else`、`for`、`while`、`break`、`continue` |
| 函数与类 | `def`、`return`、`lambda`、`class`、`yield` |
| 异常处理 | `try`、`except`、`finally`、`raise`、`assert` |
| 导入与作用域 | `import`、`from`、`as`、`global`、`nonlocal` |
| 逻辑与成员判断 | `and`、`or`、`not`、`is`、`in` |
| 上下文与异步 | `with`、`async`、`await` |

另外，`match` 和 `case` 是模式匹配语法中的软关键字，只在特定语境下具有特殊含义。



### Sentences or Lines (语句或行)

语句  `x = 2`  非数学表达式，意为把常数2存到内存中某个位置并命名为x



### Numeric Expressions (数学符号)

+ \+  Addition
+ \-   Subtraction
+ \*  Multiplication
+ `/`  Division
+ `//`  Quotient
+ ** Power (次方)
+ %  Remainder



### None 变量

类似于空变量，在变量无法提前赋值时使用

下例便是利用空变量寻找列表最小值的实现方式：

```python
smallest = None			# 因不确定初始最小值的设置范围，先设为 None 变量
for value in [9,41,12,3,74,15] :
    if smallest is None :		# 使用条件语句讨论为 None 情况并初始化为第一个值
        smallest = value
    elif value < smallest :
        smallest = value
print('最小值为', smallest)
```



###  is 的作用

`is` 的判断要求高于 `==`，`==` 仅要求数值相等，`is` 同时要求两者指向同一个对象

例如：

0 和 0.0

- [ ] is
- [x] ==

故在使用时，is 尽量仅用于 None 变量和 Bool 变量，其余均使用 ==



### in 的作用

- 与 for 搭配时可作为循环范围

- 与 if 搭配时可作为运算符，比如检验某元素是否属于某个列表



### 布尔逻辑运算符的作用

- **not** 表示否定，常与保留字连用，例如 `if not` , `is not`
- **and** 表示和
- **or** 表示或



PS：Python中为明确声明为 `global` 或 `nonlocal` 的变量默认为局部变量，例如函数内无法直接调用未显式声明的全局变量

例如：

```python
n = 0
def fun():
	global n	#缺少此句会报错
    n += 1
    return n
```



### 复数

用 `complex(_ + _j)` 来表示一个复数

例如：

```python
a = complex(1 + 2j)
>>> b = 2 * a
>>> b
(2+4j)
```





---

## Conditionals

### if 结构

与C/C++差异的地方为：

1. 缩进代替{ }包含内容
2. 条件语句无括号
3. 条件语句末需要加 :
4. else if简写为 elif

例如：

```python
if x < 5 :
	if x < 3 :
 	   print('Too small')
	else:
        print('Small')
elif x < 10 : 
    print('Medium')
else :
    print('Large')
```



### match 结构

`match` 结构类似于 C 语言的 `switch` 结构

区别如下：

+ 可以按一定格式表示一个区间
+ 表示例外情况使用 `case _` （ C 语言为 `default` ）

例如：

```python
age = 15

match age:
    case x if x < 10:
        print(f'< 10 years old: {x}')
    case 10:
        print('10 years old.')
    case 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18:	#case x if x <= 18 and x >= 11:
        print('11~18 years old.')
    case 19:
        print('19 years old.')
    case _:
        print('not sure.')
```

此外还可以匹配列表

例如：

```python
args = ['gcc', 'hello.c', 'world.c']	#仅匹配gcc开头且含有文件名的列表
# args = ['clean']
# args = ['gcc']

match args:
    # 如果仅出现gcc，报错:
    case ['gcc']:
        print('gcc: missing source file(s).')
    # 出现gcc，且至少指定了一个文件:
    case ['gcc', file1, *files]:
        print('gcc compile: ' + file1 + ', ' + ', '.join(files))
    # 仅出现clean:
    case ['clean']:
        print('clean')
    case _:
        print('invalid command.')
```



### try / except 结构

用于检测结果是否正确，若 `try` 语句正确执行，则忽略 `except` 语句。否则将会执行 `except` 语句

例如：

```python
num = 'Bob'
try :
    num = int(num)
except :
    num = -1
print('First', num)
    
num = '123'
try :
    num = int(num)
except :
    num = -1
print('Second', num)

>>>First -1
>>>Second 123
```



由于执行到错误语句后直接转而执行 `except` 语句，因此错误语句后的正确语句可能造成短路

一个常见应用：

```python
rawstr = input('Enter a number:')
try :
    ival = int(rawstr)
except :
    ival = -1

if ival > 0 :
    print('Nice work!')
else :
    print('Not a number！')
```



---

## Loops and Iteration

### while 循环

条件语句格式与 python 中的 `if` 语句类似

`break` 和 `continue` 的用法与 C 类似

恒为真时使用 `True` （非0数值均为 `True` ），反之使用 `False`

例如:

```python
while True :
    line = input('>')
    if line[0] == '#' :
        continue
    if line == 'done' :
        break
    print(line)
print('Done!')

>>hello
>>>hello
>>#don't print it
>>done
>>>Done!
```



### for 循环

可以设定一个列表为 `for` 的循环变量范围

如此 `for` 语句就会依次遍历所有变量然后结束

例如：

```python
for friend in ['Peter', 'Alice', 'Kate'] :
    print("Hello", friend)
```

也可以提前设置一个列表来作为循环变量范围

例如：

```python
friends = ['Peter', 'Alice', 'Kate']
for friend in friends :
    print("Hello", friend)
```

#### range 函数

可以使用 `range()` 函数实现 `for` 遍历（**左闭右开**）

```python
range(stop)	#0 -- stop-1
range(start, stop)	#strat -- stop-1
range(start, stop, step)	#步长为step
range(start, stop, -1)	#可以实现倒数

for _ in range(n):	#不需要使用参数，只需要计数
for i in range(n):	#需要使用参数
```



---

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

## Lists

### 列表

列表可以表示为任何结构的集合，如：

- 整数：`[1,2,3]`
- 浮点数：`[1.1,1.2,1.3]`
- 字符串：`['Peter','Linda','Tom']`
- 混合：`[1,1.1,'Peter']`
- 嵌套列表：`[1,[2,3],4]`
- 空列表：`[]` 即为 `list()`

`for` 常用于处理列表变量，不论是普通列表，还是字符串或文件句柄

若要表示具体某个元素，可以在列表后加上 `[]` （从0开始），类似于 C 语言的数组。但是可以直接使用 `-1`  , `-2`  等表示倒数第几个元素 



### + 和 * 运算符的作用

与字符串类似， `+` 也可以连接两个列表

`*` 可以表示重复

例如：

```python
list1 = [1,2]
list2 = [3,4]
list = list1 + list2
print(list)
list *= 2
print(list)

>>>[1, 2, 3, 4]
>>>[1, 2, 3, 4, 1, 2, 3, 4]
```



### 迭代

如果想要在列表迭代同时迭代索引，可以使用 `enumerate` 函数把一个 `list` 变成索引-元素对，这样就可以在 `for` 循环中同时迭代索引和元素本身

```python
for i, value in enumerate(['A', 'B', 'C']):
    print(i, value)

>>>0 A
>>>1 B
>>>2 C
```





---

## Dictionaries

### 字典

包括键（key）和值（value），用于表示某个键的值，用 `{( )}` 表示

例如：

```python
cabinet = dict()
cabinet('summer') = 12
cabinet('fall') = 3
cabinet('spring') = 75
print(cabinet)
print(cabinet['fall'])

>>>{'summer': 12, 'fall': 3, 'spring': 75}
>>>3
```



### get 函数

常用 `dict_name.get(name,n)` （n 为初始值），来对一个列表中出现的键计数

例如：

```python
counts = dict()
names = ['a','b','a','c','b','a']
for name in names: 
    counts[name] = counts.get(name,0) + 1
print(counts)

>>>{'a': 3, 'b': 2, 'c': 1}
```

这段代码的 `counts[name] = counts.get(name,0) + 1` 可以替换成如下实现方式：

```python
old value = 0
if name in counts :
    oldvalue = counts[name]
counts[name] = oldvalue + 1
```

编译后可以得出相同结果



### key , value 和 items

key 为键，value 为值，item 为项

可以分别使用函数列表提取某一元素

直接输出字典的列表时输出的是键

输出 `items` 则会出现元组

例如：

```python
jjj = {'a': 3, 'b': 2, 'c': 1}
print(list(jjj))
print(list(jjj.keys()))
print(list(jjj.values()))
print(list(jjj.items()))
for k, v in jjj.items():
    print(k, v)

>>>['a', 'b', 'c']
>>>['a', 'b', 'c']
>>>[3, 2, 1]
>>>[('a', 3), ('b', 2), ('c', 1)]
>>>a 3
>>>b 2
>>>c 1
```

可以使用两个变量与 `item` 的键和值一一对应

迭代时不能直接使用 `dict` ，否则是乱序，需要使用 `dict.items`、`dict.keys`、`dict.values`



---

## Sets

### 集合

类似 `dict` 和数学上的集合的结合体，用 `{ }` 表示

可以表示一组 `key` 的集合，但不储存 `value` ，而且是无序的

`key` 如果重复则会重合，不会添加新元素



### 元素处理

可以使用 `add` 和 `remove` 做加减元素的处理

```python
s = {1, 2, 3}
s.add(4)
print(s)
s.remove(4)
print(s)

>>>{1, 2, 3, 4}
>>>{1, 2, 3}
```



### 数学性质

`set` 可以看成数学意义上的无序和无重复元素的集合，因此，两个set可以做数学意义上的交集、并集等操作：

```python
s1 = {1, 2, 3}
s2 = {2, 3, 4}
print(s1 & s2)
print(s1 | s2)

>>>{2, 3}
>>>{1, 2, 3, 4}
```



---

## Tuples

### 元组

与列表相似，但是赋值后无法修改，占用更小的存储空间，用 `( )` 表示

如果只存储一个列表，且查看完即丢弃不需修改可以创建元组

若元组内存在诸如 `list` 之类的可变数组，则可改变其中的 `list` 等

```python
t = ('a', 'b', ['A', 'B'])
t[2][0] = 'X'
t[2][1] = 'Y'
print(t)

>>>('a', 'b', ['X', 'Y'])
```

这意味着 `tuple` 的元素指向不变

只有1个元素的 `tuple` 定义时必须加一个逗号 `,`  来消除歧义

例如：

```python
t = (1,)
print(t)

>>>(1,)
```



### 可比较性

元组间可以比较大小，比较方式是从左到右依次比较

例如：

```python
print((1,2,3) < (5,2,3))

>>>True
```

于是可以使用 `sorted(dictname.items())` 来进行根据键升序排序，与值无关

附带 `reverse=True` 可以降序排序

例如：

```python
d = dict()
d['c'] = 3
d['a'] = 7
d['b'] = 2
print(d.items())
print(sorted(d.items()))
print(sorted(d.items(), reverse=True))

>>>dict_items([('c', 3), ('a', 7), ('b', 2)])
>>>[('a', 7), ('b', 2), ('c', 3)]
>>>[('c', 3), ('b', 2), ('a', 7)]
```



---

## 附录：几种储存方式的比较

| 特性             | 列表 (List)                       | 元组 (Tuple)                      | 集合 (Set)                             | 字典 (Dictionary)                  |
| ---------------- | --------------------------------- | --------------------------------- | -------------------------------------- | ---------------------------------- |
| **可变性**       | 可变                              | 不可变                            | 可变                                   | 可变                               |
| **元素类型**     | 任意类型（可包含可变/不可变对象） | 任意类型（可包含可变/不可变对象） | 必须为不可变对象（可哈希）             | 键必须为不可变对象，值可为任意类型 |
| **有序性**       | 有序                              | 有序                              | 无序                                   | 有序                               |
| **允许重复元素** | 是                                | 是                                | 否                                     | 键唯一，值可重复                   |
| **语法示例**     | `[1, 'a', [2]]`                   | `(1, 'a', [2])`                   | `{1, 2, 3}`                            | `{'key1': 10, 'key2': 20}`         |
| **适用场景**     | 动态数据集合，需频繁增删改查      | 固定数据集合（如配置项、常量）    | 去重、快速成员检查、集合运算（交并差） | 键值对映射，快速通过键查找值       |
| **是否支持索引** | 是（`list[0]`）                   | 是（`tuple[0]`）                  | 否                                     | 通过键访问（`dict['key']`）        |
| **内存占用**     | 较高（因预留空间）                | 较低（不可变，存储紧凑）          | 高（哈希表实现）                       | 高（哈希表实现）                   |
| **底层实现**     | 动态数组                          | 静态数组                          | 哈希表                                 | 哈希表                             |



---

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

## Object-Oriented Programming

### 类和示例

```python
class Student(object):	#object表明为基类
    def __init__(self, name, score):
        self.name = name
        self.score = score
    def print_score(self):	#需要self，相当于this指针
        print('%s: %s' % (self.name, self.score))
        
def print_score2(std):	#可供任何含有name和score属性的实例使用
    print('%s: %s' % (std.name, std.score))
    
>>> bart = Student('Bart Simpson', 59)
>>> lisa = Student('Lisa Simpson', 87)
>>> bart.name
'Bart Simpson'
>>> bart.score
59
>>> bart.print_score()
Bart Simpson: 59
>>> print_score2(bart)
Bart Simpson: 59

>>> bart.age = 8
>>> bart.age	#可以自定义实例的新属性
8
>>> lisa.age	#同一类的不同实例所拥有的属性可以不一致
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'Student' object has no attribute 'age'
```



### 访问限制

python并不强制约定变量的访问权限，而是用一些约定俗成的命名规则来限制使用。在属性前加上 `__` 一般可以视为 `private` 变量，无法直接从外部访问

可以用于对输入的参数做检查，例如：

```python
class Student(object):
    def set_score(self, score):
        if 0 <= score <= 100:
            self.__score = score
        else:
            raise ValueError('bad score')
```

实际上， `__` 意为改名，只是将原属性的名称加了个类名前缀

例如将外部的 `__name` 改为 `_Student__name` 限制外部的直接访问

| 写法  | 含义            | 是否能访问   |
| ----- | --------------- | ------------ |
| `x`   | public          | 随便         |
| `_x`  | protected(约定) | 可以，但不该 |
| `__x` | private(改名)   | 强烈不建议   |



### 继承和多态

可以让某个类在定义时使其继承某个基类的函数、属性等。判断一个变量是否是某个类型可以用 `isinstance()` ，判断内容可以使用括号实现多选一为真

可以在括号内写入多个父类可以完成多重继承，子类包含所有父类的属性和功能

例如：

```python
class Animal(object):
    def run(self):
        print('Animal is running...')
   
class Dog(Animal):	#继承自Animal类
    def run(self):	#重写run函数
        print('Dog is running...')

class Cat(Animal):
    pass	#不重写

>>dog = Dog()
>>dog.run()
Dog is running...

>>cat = Cat()
>>cat.run()
Animal is running...

>>> isinstance(dog, Animal)	#子类的实例也属于基类的类型
True
>>> isinstance(dog, Dog)
True
```

#### Mixin

`MixIn` 是一种设计模式，用于在不使用多重继承的全部复杂性的情况下，为类添加额外功能。本质上是一个专门用于 “被继承” 的类，提供一些通用方法，但自身通常不单独实例化

> MixIn 的核心思想

+ 功能复用：将多个类可能共用的功能提取到 MixIn 类中，避免代码重复
+ 职责单一：每个 MixIn 只专注于实现某一类特定功能（如日志记录、序列化等）
+ 组合灵活：通过 “继承” 多个 MixIn 类，一个类可以灵活组合多种功能

> 为什么需要 MixIn？

Python 支持多重继承，但过度使用可能导致菱形继承问题（多个父类最终继承自同一个基类，引发方法调用歧义）。
MixIn 通过约定（而非强制）解决这个问题：
MixIn 类不单独使用，仅作为 “功能补充” 被继承。
MixIn 类通常不定义 __init__ 方法（或设计为可安全继承），避免初始化逻辑冲突。
示例：用 MixIn 实现功能组合
假设我们需要给不同的类添加 “日志记录” 和 “JSON 序列化” 功能，可以用 MixIn 实现：

```python
# 1. 日志功能 MixIn
class LoggingMixin:
    def log(self, message):
        """打印带时间戳的日志"""
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {self.__class__.__name__}: {message}")


# 2. JSON 序列化 MixIn
import json
class JsonSerializableMixin:
    def to_json(self):
        """将对象属性转换为 JSON 字符串"""
        # 假设对象的属性都在 __dict__ 中
        return json.dumps(self.__dict__)


# 3. 业务类：组合多个 MixIn
class User(LoggingMixin, JsonSerializableMixin):
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        self.log(f"用户 {self.name} 打招呼")  # 使用 LoggingMixin 的方法
        return f"你好，我是 {self.name}，今年 {self.age} 岁"


# 使用示例
user = User("小明", 18)
print(user.greet())  # 触发日志输出
print(user.to_json())  # 调用序列化方法
输出：
plaintext
[2023-10-01 12:00:00] User: 用户 小明 打招呼
你好，我是 小明，今年 18 岁
{"name": "小明", "age": 18}
```

> MixIn 的命名约定

为了明确区分普通类和 MixIn 类，通常会在类名后加 Mixin 后缀（如 LoggingMixin、JsonSerializableMixin），让其他开发者一眼看出这是用于混入的功能类

> MixIn 与普通继承的区别

|     特性     |         普通继承          |          MixIn 继承          |
| :----------: | :-----------------------: | :--------------------------: |
|     目的     | 表示 “是一个”（is-a）关系 | 表示 “具有某种功能”（has-a） |
|    实例化    |       可单独实例化        |       通常不单独实例化       |
|   方法设计   |       完整的类逻辑        |     仅提供特定功能的方法     |
| 多重继承风险 |   高（易引发菱形问题）    |   低（功能单一，约定明确）   |

> 总结

MixIn 是 Python 中实现功能复用和组合的优雅方式，它通过 “混入” 特定功能类，让主类在不增加复杂性的前提下获得多种能力。合理使用 MixIn 可以显著提高代码的复用性和灵活性，尤其适合为不同类添加通用功能（如日志、缓存、序列化等）



### dir 函数

`dir(x)` 可以获取一个对象的所有属性和方法，即该数据的类型可用的前缀和后缀

例如：

```python
x=list()
dir(x)

>>>['__add__', '__class__', '__class_getitem__', '__contains__', '__delattr__', '__delitem__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__getitem__', '__getstate__', '__gt__', '__hash__', '__iadd__', '__imul__', '__init__', '__init_subclass__', '__iter__', '__le__', '__len__', '__lt__', '__mul__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__reversed__', '__rmul__', '__setattr__', '__setitem__', '__sizeof__', '__str__', '__subclasshook__', 'append', 'clear', 'copy', 'count', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort']
```

其中格式为  `__...__`  的为前缀，意为特殊变量，可写作 `...(x)` 或 `x.__...__()` ；格式为 `...` 的为后缀，意为普通属性或方法，可写作 `x. ...()`

如果自定的类也想使用特殊变量，可以自定义特殊变量的方法

```python
class MyDog(object):
	def __len__(self):
        return 100

>>> dog = MyDog()
>>> len(dog)
100
```

使用 `getattr()` 、 `setattr()` 以及 `hasattr()` ，可以直接操作一个对象的状态

例如：

```python
class MyObject(object):
    def __init__(self):
        self.x = 9
    def power(self):
        return self.x * self.x

>>> obj = MyObject()
>>> hasattr(obj, 'x') # 有属性'x'吗？
True
>>> obj.x
9
>>> hasattr(obj, 'y') # 有属性'y'吗？
False
>>> setattr(obj, 'y', 19) # 设置一个属性'y'
>>> hasattr(obj, 'y') # 有属性'y'吗？
True
>>> getattr(obj, 'y') # 获取属性'y'
19
>>> obj.y # 获取属性'y'
19
>>> getattr(obj, 'z') # 获取属性'z'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'MyObject' object has no attribute 'z'
>>> getattr(obj, 'z', 404) # 获取属性'z'，如果不存在，返回默认值404
404
#获取对象的方法
>>> hasattr(obj, 'power') # 有属性'power'吗？
True
>>> getattr(obj, 'power') # 获取属性'power'
<bound method MyObject.power of <__main__.MyObject object at 0x10077a6a0>>
>>> fn = getattr(obj, 'power') # 获取属性'power'并赋值到变量fn
>>> fn # fn指向obj.power
<bound method MyObject.power of <__main__.MyObject object at 0x10077a6a0>>
>>> fn() # 调用fn()与调用obj.power()是一样的
81
```

只有在不知道对象信息的时候，才会去获取对象信息

例如：

```python
def readImage(fp):
    if hasattr(fp, 'read'):	#判断该fp对象是否存在read方法
        return readData(fp)
    return None
```



### 类属性

可以通过实例变量或者 `self` 变量给实例绑定属性。如果需要给整个类绑定属性，可以直接在 `class` 里定义。属性归类所有，而且类的所有实例都可以访问

```python
class Student(object):
    name = 'Student'
    
>>> s = Student() # 创建实例s
>>> print(s.name) # 打印name属性，因为实例并没有name属性，所以会继续查找class的name属性
Student
>>> print(Student.name) # 打印类的name属性
Student
>>> s.name = 'Michael' # 给实例绑定name属性
>>> print(s.name) # 由于实例属性优先级比类属性高，因此，它会屏蔽掉类的name属性
Michael
>>> print(Student.name) # 但是类属性并未消失，用Student.name仍然可以访问
Student
>>> del s.name # 如果删除实例的name属性
>>> print(s.name) # 再次调用s.name，由于实例的name属性没有找到，类的name属性就显示出来了
Student
```

相同名称的实例属性将屏蔽类属性。删除实例属性后，再使用相同的名称，访问到的将是类属性

> 作用

统计学生人数：

```python
class Student(object):
    count = 0

    def __init__(self, name):
        self.name = name
        Student.count += 1
```



### \__slots__ 属性

Python是动态语言，对于普通的类，可以为类实例赋值任何属性，这些属性会存储在 `__dict__` 中：

```python
>>> class Student(object):
...     pass
...     
>>> Abey = Student()
>>> Abey.name = 'Abey'
>>> Abey.__dict__
{'name': 'Abey'}
```

这样的特性带来两个问题：

**1、数据通过字典(Hash)存储所占用的空间较大**

**2、随意生成类属性（有可能是拼写错误）**

示例：

```python
class Vehicle:
    __slots__ = ('id_number', 'make', 'model')
    
# 注意看下面的书写：
# 
# 这是属性的"随意生成"所引发的问题：
# 如果不使用"__slots__"，就会创建一个新的实例属性"id_nubmer"，
# 而代码不会报错。

auto = Vehicle()
auto.id_nubmer = 'VYE483814LQEX'

Traceback (most recent call last):
    ...
AttributeError: 'Vehicle' object has no attribute 'id_nubmer'
```

**slots** 就是为了解决这两个问题而设立。通过 **slots** 属性限定类属性的创建。 所以，在应用中，我们只需要记住一个要点：

> 要用 __slots__ ，父类声明 __slots__ ，子类必须声明 __slots__ ，并且不与父类的 __slots__ 中的属性重复。子类通过继承，它的 __slots__ 为：“自身+父类”



### @property 装饰器

由于直接暴露属性无法检查参数是否合法，分别需要 `get` 和 `set` 函数来获取和设置合法的属性

例如：

```python
class Student(object):
    def get_score(self):
         return self._score

    def set_score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value
        
>>> s = Student()
>>> s.set_score(60) # ok!
>>> s.get_score()
60
>>> s.set_score(9999)
Traceback (most recent call last):
  ...
ValueError: score must between 0 ~ 100!
```

上面的调用方法略显复杂，没有直接用属性这么直接简单，可以使用 `@property` 装饰器以及配套的 `@xxx.setter` 装饰器，其负责把一个方法变成属性调用

若不定义 `setter` 就是一个只读属性

例如：

```python
class Student(object):
    @property
    def score(self):
        return self._score	#属性不能与函数同名，可以在前面加个_

    @score.setter
    def score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value
        
>>> s = Student()
>>> s.score = 60 # OK，实际转化为s.score(60)
>>> s.score # OK，实际转化为s.score()
60
>>> s.score = 9999
Traceback (most recent call last):
  ...
ValueError: score must between 0 ~ 100!
```



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

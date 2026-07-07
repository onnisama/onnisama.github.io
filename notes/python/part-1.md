---
permalink: /notes/python/1/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (1)：基础语法、条件与循环"
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

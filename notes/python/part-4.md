---
permalink: /notes/python/4/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (4)：列表、字典、集合与元组"
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

---
permalink: /notes/python/6/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (6)：面向对象基础、继承与 Mixin"
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

---
permalink: /notes/python/7/
hide-in-nav: true
layout: post
title: "Python 学习笔记 (7)：对象属性、slots 与 property"
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

## 对象属性与类约束

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

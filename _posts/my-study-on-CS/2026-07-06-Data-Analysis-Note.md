---
layout: post
title: "Python 数据分析学习笔记"
author: "雾汐"
header-style: text
catalog: true
tags:
  - Python
  - Pandas
  - 数据分析
  - 学习笔记
---

## Pandas

Python 的 Pandas 库是用于数据分析的一个常用库，取名自 `panel data` （即面板数据）的首字母。它可以处理各种文件格式的数据，例如： `CSV` , `JSON`, `SQL` 等等。

常用导入方式：

```python
import pandas as pd
```



---

### Series 和 DataFrame

`Series` 类似于表格的一个列，常常只包含一组数据属性和与之相关联的索引。

`DataFrame` 类似于一个标准的二维表格，既有行索引又有列索引，可以用于选择、过滤、合并等操作。

二者可以这样区分：

| 类型 | 数据形态 | 典型用途 |
| :--- | :--- | :--- |
| `Series` | 一维带索引数据 | 存放单列数据、标签序列或统计结果 |
| `DataFrame` | 二维表格，包含行索引和列索引 | 存放完整数据集，进行筛选、合并、统计和导出 |

可以这样创建 `Series` 和 `DataFrame` 示例：

```python
import pandas as pd

# 直接用列表来创建 Series
series1 = pd.Series([1,3,5,7])
series2 = pd.Series([2,4,6,8])

# 将两个 Series 组合成 DataFrame，用键值格式指定列的名称
df = pd.DataFrame({ 'Series1': series1, 'Series2': series2 })

print(df)
```

输出为：

```python
   Series1  Series2
0        1        2
1        3        4
2        5        6
3        7        8
```

Series 在创建时可以使用一些关键字参数来规范，例如 `name` 可用于命名、`index` 为列表时可以显式指定索引（若未指定则默认从 0 开始），也可以用字典的方式显式指定索引，例如：

```python
import pandas as pd

data = {
    'x': 'apple',
    'y': 'banana',
    'z': 'cherry'
}

series = pd.Series(data)
print(series)
```

结果如下：

```python
x     apple
y    banana
z    cherry
```

`DataFrame` 也可以使用列表和字典创建：

```python
import pandas as pd

# 二维列表初始化数据，每个子列表都是一个元组
data1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# 字典初始化数据，其中键为列名，值为列表
data2 = {
    'x': [1, 2, 3],
    'y': [4, 5, 6],
    'z': [7, 8, 9]
}

# 需要指定列名
dataframe1 = pd.DataFrame(data1, columns=['x', 'y', 'z'])
dataframe2 = pd.DataFrame(data2)

print(dataframe1)
print(dataframe2)
```

结果均为：

```python
   x  y  z
0  1  4  7
1  2  5  8
2  3  6  9
```

也可以使用关键字参数 `name` 和 `index` 来指定名称和索引。

可以使用 `set_index` 来为 `DataFrame` 指定某一列为索引：

```python
dataframe.set_index('ID')
```

下面会主要讨论 `DataFrame`，但是 `Series` 也能找到一些共通的方法。

测试时可以选择 `head()`，内部可以填入想要展示的行数，缺省为 5。



---

### 查找元素

对于一个 `DataFrame` 若要查找指定列的数据，可以用两种方式：

```python
dataframe.attribute
dataframe['attribute']
```

其后可以加上索引号（如 `[0]`）来指定取哪行数据。

> [!TIP]
>
> 更推荐使用后者，以避免属性内部有空格时需要转码。

更标准和多功能的查找方式需要使用 `iloc` 和 `loc`，前者主要用于查找位置，后者主要用于查找索引和标签。

> [!CAUTION]
>
> 这是一个很需要辨析的概念，例如对于下面名为 `data` 的 `DataFrame`，使用 `loc` 和 `iloc` 会得到不同的结果：
>
> ```python
> data = {
>     'x': [1, 3],
>     'y': [2, 4],
> }
> 
> dataframe = pd.DataFrame(data, index=[1, 0])
> 
> print(dataframe.loc[0])  # 按照索引标签获取行，即查找索引为 0 的行
> print(dataframe.iloc[0])  # 按照行号获取行，即查找第 0 行
> ```
>
> 结果为：
>
> ```python
> x    3
> y    4
> Name: 0, dtype: int64
> x    1
> y    2
> Name: 1, dtype: int64
> ```

二者都可以包含两个参数，其中前者为行，后者为列，而且参数均可以为值或列表（以及切片）：

```python
dataframe.iloc[:, 0]			# 取所有行第 0 列
dataframe.iloc[[0, 1, 2], 0]	# 取前三行第 0 列
dataframe.loc[0, 'country']		# 取索引标签为 0 的行的 country 属性
dataframe.loc[:, ['x', 'y']]	# 取所有行的 x,y 属性列
```

> [!CAUTION]
>
> 索引切片和位置切片存在区别，例如 `loc` 中 `0:10` 包括 10，但 `iloc` 中 `0:10` 只到 9

**条件选择**：可以使用条件关系式子以及 `&` 和 `|` 来选择想要的元组。

`dataframe.x == 1` 可以单纯输出一个包含索引的布尔 `Series`，每一行都是 `True` 或 `False`，我们可以利用这个特性来完成筛选。

`dataframe.loc[(dataframe.x == 1) | (dataframe.x == 2)]` 可筛出 `x` 属性为 1 或 2 的行。

也可以使用 `isin` 函数进行筛选，例如 `dataframe.loc[dataframe.x.isin([1, 2])]`。

`isnull()` 和 `notnull()` 可以筛选出属性值为空和非空的元组。



---

### Summary Functions

`pandas` 向我们提供了一些 `Summary Functions` 来帮助我们重新组织数据。

`dataframe.x.describe()` 可以给出该列的所有属性。

对于数值属性，可以为总数 `count`、平均值 `mean`、最大值 `max`、中位数 `median`等等；对于字符属性，可以为总数 `count`、去重总数 `unique`、频率最高 `top`

我们也可以调用具体的函数来获得列的具体属性值，`dataframe.x.mean()` 直接获取 x 列的平均值，`dataframe.y.unique()` 和 `dataframe.y.nunique()` 分别可以得到字符属性的去重后的列表以及去重总数，`dataframe.y.value_counts()` 可以得到每个值的数目。



---

### Maps

`map` 和 `apply` 可以用于对整个 `DataFrame` 进行某种函数作用，区别是前者的作用对象是其中某一个 `Series`，生成结果也是 `Series`；而后者则作用于整个 `DataFrame`，而且可以在函数中指定一些属性，生成的结果也是 `DataFrame`。

例如：

```python
x_mean = dataframe.x.mean()

# 作用于 Series
newSeries = dataframe.x.map(lambda p: p - x_mean)

def remean_x(row):
    row.x = row.x - x_mean
    return row	# 也可以 return 具体数值，此时可能结果为 Series

dataframe.apply(remean_x, axis='columns')	# 指定为列，若 axis 为 index，则可以转换索引
```



---

### 数据读写

核心 `I/O` 函数如下：

| 读取函数            | 写入函数       | 支持格式             | 典型场景           |
| :------------------ | :------------- | :------------------- | :----------------- |
| `pd.read_csv()`     | `to_csv()`     | CSV、TSV             | 日志文件、表格数据 |
| `pd.read_excel()`   | `to_excel()`   | Excel（.xlsx, .xls） | 业务报表、财务数据 |
| `pd.read_sql()`     | `to_sql()`     | SQL 数据库           | 企业数据库交互     |
| `pd.read_html()`    | -              | HTML 表格            | 网页数据抓取       |
| `pd.read_parquet()` | `to_parquet()` | Apache Parquet       | 大数据分析、存储   |
| `pd.read_feather()` | `to_feather()` | Feather 格式         | 快速读写、内存数据 |
| `pd.read_json()`    | `to_json()`    | JSON                 | API 数据、Web 服务 |
| `pd.read_pickle()`  | `to_pickle()`  | Python pickle        | 序列化 Python 对象 |

后续会继续补充可视化、缺失值处理和分组聚合等内容。



---

## 相关资源链接

- [菜鸟教程：Pandas 教程](https://www.runoob.com/pandas/pandas-tutorial.html)

- [Kaggle](https://www.kaggle.com)


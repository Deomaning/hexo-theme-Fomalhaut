---
title: Java知识点小结
description: List删除元素的最佳方式、BitSet大数据处理、subList引用陷阱
mathjax: true
tags:
  - Java
  - Java学习
categories:
  - Java学习
abbrlink: '0'
date: 2022-08-09 18:19:03
updated: 2026-06-11 12:00:00
---

# Java 知识点小结

## List 中删除元素的推荐方式

1. 通过 Stream 的 filter 方法，因为 Stream 每次处理后都会生成一个新的 Stream，不存在并发问题，所以 Stream 的 filter 也可以修改 list 集合。（**建议，简单高效**）

```java
public List<String> streamRemove() {
    List<String> students = this.getStudents();
    return students.stream()
        .filter(this::notNeedDel)
        .collect(Collectors.toList());
}
```

2. 通过 removeIf 方法，实现元素的过滤删除。从 Java 8 开始，List 接口提供了 removeIf 方法用于删除所有满足特定条件的数组元素（**推荐**）

```java
arraylist.removeIf(this::needDel);
```

## BitSet 大数据场景

BitSet 常见的使用例子往往和大数相关：

1. **现在有 1 千万个随机数，随机数的范围在 1 到 1 亿之间，求出 1 到 1 亿之间没有在随机数中的数**
2. 统计 N 亿个数据中没有出现的数据
3. 将 N 亿个不同数据进行排序等

> （不太理解这种，随机数是自己去生成？还是啥意思，随机数是函数？）

但是 BitSet 也有缺点，譬如集合中存储一些差值比较大的数，如 1 亿和 1 两个数，就会导致内存的严重浪费。

## subList 引用陷阱

**List 中通过 subList 形成的 list 是引用原来的 list 中的内容，并不是新创建了一个 list，所以在这个 subList 中修改内容或者插入数据，会导致原来的 list 中的内容也会改变！**

如果不想改变原有 list，那么新建一个 list 这样写即可：

```java
subList = Lists.newArrayList(subList);
list.stream().skip(start).limit(end).collect(Collectors.toList());
```

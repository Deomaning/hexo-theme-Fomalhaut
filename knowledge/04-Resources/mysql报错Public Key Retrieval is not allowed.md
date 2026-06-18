---
title: mysql报错Public Key Retrieval is not allowed
description: mysql连接报错 Public Key Retrieval is not allowed
mathjax: true
tags:
  - "#Mysql"
categories:
  - 笔记
abbrlink: "20241126"
sticky: 5
swiper_index: 7
date: 2024-11-26 14:57
updated: 2024-11-26  14:57
author: 安好
---

# MySQL 报错：Public Key Retrieval is not allowed

已解决：MySQL8报错：Public Key Retrieval is not allowed

## 问题描述

连接数据库总是报错 `Public Key Retrieval is not allowed`

## 解决方案

MySQL 8.0 默认使用 `caching_sha2_password` 身份验证机制，即从原来的 `mysql_native_password` 更改为 `caching_sha2_password`。

从 5.7 升级 8.0 版本不会改变现有用户的身份验证方法，但新用户会默认使用新的 `caching_sha2_password`。由于客户端不支持新的加密方式，因此需要修改用户的密码和加密方式。

### 方案一

在命令行模式下进入 MySQL，输入以下命令：

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
```

或者：

```sql
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';
```

即重新修改密码，然后就可以正常连接了。

### 方案二

在配置数据源的时候，直接将属性 `allowPublicKeyRetrieval` 设置为 `true` 即可。

![MySQL连接配置](/images/mysqlfangan2.png)

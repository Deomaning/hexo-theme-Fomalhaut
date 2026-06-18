---
title: Maven报错Cannot access central in offline mode
description: 好久没用的项目,打包时报错
mathjax: true
tags:
  - "#Maven"
categories:
  - 奇葩报错
abbrlink: 2013454d
sticky: 2
swiper_index: 2
date: 2024-11-19 10:28
updated: 2024-11-19 10:28
---

# Maven 报错：Cannot access central in offline mode

## 步骤（两种方案）

- 一种是在settings.xml中配置，把true改为false，如果没有，默认为false，就不用改
    ![settings.xml中的offline配置](https://i-blog.csdnimg.cn/blog_migrate/97e9322e27ae217cb66e9b30312cc236.png)
- 另一种是IDEA中配置，把这个offline勾选去掉即可
    ![IDEA中取消勾选offline](https://i-blog.csdnimg.cn/blog_migrate/0566b543faf4813d2ee9dc86a393ad64.png)

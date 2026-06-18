---
title: gradle加载项目报错您的主机中止了一个连接
description: 解决gradle报错,且并不是热点问题
mathjax: true
tags:
  - "#gradle"
  - "#奇怪的问题"
categories:
  - 奇葩报错
abbrlink: gradle-error-fix
sticky: 2
swiper_index: 2
date: 2022-08-09 18:19:03
updated: 2022-10-23 22:00:00
cover: https://s2.loli.net/2024/10/22/IPoZb73rgSD9GM2.jpg
---

# Gradle 加载项目报错：您的主机中止了一个连接

## 问题描述

由于更换新电脑，所以安装了新的idea2024.2.2。由此引发的问题，在拉取一个gradle项目时，加载一直报错==**您的主机中止了一个连接**==。

gradle版本使用的是6.7。

## 排查过程

刚开始以为是版本问题，所以升级到了8.7版本的gradle，结果加载不报这个错，又爆了另一个错，说是下载的jar包中缺失某个类。

因为以前用过这个项目，所以确定6.7是可以的。百度问题，基本都是说热点问题，关闭热点就好了。但实际上我并没有开启热点，经过测试，并不是热点问题。

最终在github的Issues中找到一个解决方案：

> [gradle an existing connection was forcibly closed by the remote host · Issue #14094 · gradle/gradle (github.com)](https://github.com/gradle/gradle/issues/14094)
>
> - deleting $USER_HOME/.gradle directory
> - deleting project .gradle directory
> - I have downgraded from 6.5.1 do 6.4 and that works.
> - Version 6.6 also affected
> - Version 6.4.1 does not work

## 解决方案

将gradle版本降低到6.1，方案是可行的。

## 总结

更换新环境后遇到Gradle连接中断问题，排查发现并非热点问题，而是Gradle特定版本的兼容性缺陷。通过参考GitHub Issues中的讨论，将Gradle版本降级到6.1即可解决。若后续需要使用更高版本，建议清理本地`.gradle`缓存目录后重试。

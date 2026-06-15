---
abbrlink: 15156df
title: linux安装telnet以及授权
description: linux安装telnet
mathjax: false
tags:
  - "#linux"
  - "#telnet"
categories:
  - 随手笔记
sticky: 2
swiper_index: 2
date: 2025-08-09T18:19:03
updated: 2025-08-09T22:00:00
cover: https://s2.loli.net/2024/10/09/vZ8SYVMfBb9pnwT.webp
---

# Linux 安装 Telnet 及授权

### Linux 安装 telnet 命令

1. 离线包下载
   - 首先下载 telnet-client（或 telnet）[客户端](https://so.csdn.net/so/search?q=%E5%AE%A2%E6%88%B7%E7%AB%AF&spm=1001.2101.3001.7020)软件包，这里我们下载 telnet-0.17-64.el7.x86_64.rpm 版本：

   下载地址：[http://www.rpmfind.net/linux/rpm2html/search.php?query=telnet](http://www.rpmfind.net/linux/rpm2html/search.php?query=telnet)

   `安装：[http](https://so.csdn.net/so/search?q=http&spm=1001.2101.3001.7020)://www.rpmfind.net/linux/centos/7.9.2009/updates/x86_64/Packages/telnet-0.17-66.el7.x86_64.rpm`

   - 接着下载真正的 Telnet server [软件包](https://so.csdn.net/so/search?q=%E8%BD%AF%E4%BB%B6%E5%8C%85&spm=1001.2101.3001.7020)，这里我们下载 telnet-server-0.17-64.el7.x86_64.rpm 版本：

   下载地址：[http://www.rpmfind.net/linux/rpm2html/search.php?query=telnet-server(x86-64)](http://www.rpmfind.net/linux/rpm2html/search.php?query=telnet-server%28x86-64%29)

   安装：http://www.rpmfind.net/linux/centos/7.9.2009/updates/x86_64/Packages/telnet-server-0.17-66.el7.x86_64.rpm

   - 由于 telnet-server 服务启动依赖 xinetd 服务，最后还要下载 xinetd 安装包，这里我们下载 xinetd-2.3.14-40.el6.x86_64.rpm 版本：

   下载地址：[http://www.rpmfind.net/linux/rpm2html/search.php?query=xinetd](http://www.rpmfind.net/linux/rpm2html/search.php?query=xinetd)

   安装：http://www.rpmfind.net/linux/centos/7.9.2009/os/x86_64/Packages/xinetd-2.3.15-14.el7.x86_64.rpm

2. 开始安装
   - 将下载下来的三个 rpm 包上传到服务器，首先执行如下命令安装 xinetd：

   ```bash
   rpm -ivh xinetd-2.3.15-14.el7.x86_64.rpm
   ```

   - 接着执行如下命令安装客户端：

   ```bash
   rpm -ivh telnet-0.17-66.el7.x86_64.rpm
   ```

   - 最后执行如下命令安装服务端：

   ```bash
   rpm -ivh telnet-server-0.17-66.el7.x86_64.rpm
   ```

   - 安装后可以执行如下命令查看是否安装成功：

   ```bash
   rpm -qa | grep telnet
   rpm -qa | grep xinetd
   ```

3. 开始测试
   - 执行如下 telnet 命令：

   ```bash
   telnet ip 端口
   ```

### **在 Linux 系统中，可以使用 chown 命令将文件夹授权给指定用户**

```bash
sudo chown -R username:username foldername
```

其中，-R 参数表示递归处理所有子文件夹和文件，将其授权给指定用户；username 为要授权的用户，后面的 username 表示用户所在的组；foldername 为要授权的文件夹。

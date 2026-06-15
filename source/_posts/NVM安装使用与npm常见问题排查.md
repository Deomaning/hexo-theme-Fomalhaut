---
abbrlink: 2013454d
title: NVM安装使用与npm常见问题排查
description: NVM下载安装教程、Node/npm版本管理、npm install报错排查（旧镜像源问题）
mathjax: true
tags:
  - "#NVM"
  - "#node"
  - "#npm"
categories:
  - 随手笔记
sticky: 2
swiper_index: 2
date: 2022-08-09 18:19:03
updated: 2026-06-11 12:00:00
cover: https://s2.loli.net/2024/10/09/yr7ndWcbZBwOosJ.webp
---

# 一、NVM 下载与安装

！！！特别提醒！！！如果已经有node，需要**卸载当前node**，不然会产生报错或异常情况！

卸载直接通过**控制面板**卸载即可！

> 大家可以通过下面链接按需下载不同版本的nvm，这里笔者用的是_V1.1.11_版本。
> [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

![](https://i-blog.csdnimg.cn/blog_migrate/6eb992de33cbec446d7cc4752c6385a1.png)

> 下图两个随便下载一个即可，**下一步式安装**，不用另外配置环境变量等操作。

![](https://i-blog.csdnimg.cn/blog_migrate/7e44af2ff58bdc2c2bd6a0308e24380b.png)

>  nvm-setup.zip解压后是nvm-setup.exe

![](https://i-blog.csdnimg.cn/blog_migrate/19403e50c1931846cacc2fc2aed54be9.png)

>  然后双击nvm-setup.exe进行安装，步骤如下：

![](https://i-blog.csdnimg.cn/blog_migrate/996b2aadbf9e0930ec87be27e710535a.png)

>  一、下面这个是nvm的安装路径
>
>          这里面可以存放不同版本的node，后面会有截图给大家看一下

![](https://i-blog.csdnimg.cn/blog_migrate/2c14c532ff59b19fd516da084f1c50ee.png)

> 二、下面是node的安装路径：
>
>          可能这里会有朋友产生疑问：刚刚不是说nvm下存放多个版本的node吗？
>
>          这里笔者理解为：这里的node安装路径会和[nvm安装](https://so.csdn.net/so/search?q=nvm%E5%AE%89%E8%A3%85&spm=1001.2101.3001.7020)路径下不同版本的node路径相互映射，如果切换为某个版本，此时node安装路径便会映射到当前版本的文件下。

 ![](https://i-blog.csdnimg.cn/blog_migrate/07fbae4c613856c0ffe79d11a21d1b68.png)

>  此时，我们就安装好了，来看一下对应的文件夹及环境变量（环境变量自动配置）

>  环境变量
>
>  ![](https://i-blog.csdnimg.cn/blog_migrate/0cd25174a6f345eb27807fdb38e69b67.png)

>  nvm安装目录![](https://i-blog.csdnimg.cn/blog_migrate/5bff1ad6eeedfc7c965ed0ee031dbcce.png)

>  node安装目录![](https://i-blog.csdnimg.cn/blog_migrate/875eec1bc13ed10d8c9cb8c9ae38aa2b.png)

---

# 二、使用前的准备工作

## 1、nvm换镜像源

> 我们打开nvm的安装目录下的**settings.txt**文件，加入以下两行：

![](https://i-blog.csdnimg.cn/blog_migrate/0e542bb9930e3ed2981af9dfe52b1120.png)

```ini
node_mirror: http://npmmirror.com/mirrors/node/npm_mirror: http://registry.npmmirror.com/mirrors/npm/
```

 ![](https://i-blog.csdnimg.cn/direct/712034479a364f3aab307fbca89198d0.png)

> **特别提醒：**如果不记得nvm安装在哪了，可以使用打开**管理员**命令提示符页面，使用**where nvm**命令查看安装路径。

## 2、安装所需的node版本

>  安装好了之后，我们需要安装使用命令node的版本才能使用

>  此时我们可以看一下，没有安装node版本之前，node和npm命令都是不可用的
>
>  ![](https://i-blog.csdnimg.cn/blog_migrate/37879bd4695c1657c5a2b84c16ef9823.png)

>  使用命令： **nvm list available** 查看目前可以下载的版本，结果如下：

```bash
nvm list available //查看当前可下载的版本
```

![](https://i-blog.csdnimg.cn/blog_migrate/790ff8584479dfa64e3565a6ae0b87ec.png)

>  这里笔者选择16.20.0版本下载，命令为：**nvm install 16.20.0**   结果如下：
>
>  ![](https://i-blog.csdnimg.cn/blog_migrate/5ea633387bdb3cc1190d7ca48b88ee0e.png)

>  接着我们使用命令：**nvm use 16.20.0**  切换到已安装的版本
>
>  现在我们再次查看，node和npm命令都是可用状态了，此时已经安装成功了
>
>  ![](https://i-blog.csdnimg.cn/blog_migrate/08eee586164e6064e0ce8ec22bfd5070.png)
>
>  到此，我们可以开始使用node和npm了

---

# 三、特殊情况（需要下载其他版本的npm）

> 可以通过下面网站下载所需npm版本：
>
> npm下载地址：http://npm.taobao.org/mirrors/npm/ **（下载对应版本的zip文件）**
>
> 也可以通过node下载对应版本，参考下面网站：
>
> node版本对应npm版本：https://nodejs.org/zh-cn/download/releases/

> 下载完成后解压，重命名为npm放至nvm路径下的对应版本下的 node_modules下
>
> ![](https://i-blog.csdnimg.cn/blog_migrate/522141c2804bdbbe85c86b798df3de2b.png)

> 最后将这个npm文件夹里面的bin目录下的 **npm** 和 **npm.cmd** 两个文件复制一份到之前node安装路径下的bin目录下
>
> ![](https://i-blog.csdnimg.cn/blog_migrate/37ae50c2ce3b2717b22ad14ea5d36a47.png)

> 就此，安装成功

---

# 四、NVM 常用命令

```bash
nvm install <version>        //安装指定版本的 Node.js。
#例如，nvm install 16.20.0 将安装 Node.js 的 16.20.0 版本。

nvm use <version>            //切换使用指定版本的 Node.js。
#例如，nvm use 16.20.0 将设置当前会话中使用 Node.js 的 16.20.0 版本。

nvm list                     //列出已安装的所有 Node.js 版本。
#例如，nvm list 它将显示已安装的版本列表，并在当前使用的版本旁边加上一个箭头标记。

nvm alias <name> <version>   //创建一个别名以便更方便地引用特定的 Node.js 版本。
#例如，nvm alias default 16.20.0 将创建一个名为 "default" 的别名，指向 Node.js 的 16.20.0 版本。

nvm uninstall <version>      //卸载指定的 Node.js 版本。
#例如，nvm uninstall 16.20.0 将卸载 Node.js 的 16.20.0 版本。

nvm current                  //显示当前正在使用的 Node.js 版本。
#例如，nvm current 将显示正使用的V16.20.0 版本

nvm use default              //切换到默认的 Node.js 版本（由 nvm alias 命令设置的别名）。
#例如，nvm use default 将切换到刚刚设置default别名的16.20.0版本

nvm exec <version> <command> //在指定版本的 Node.js 环境中执行特定的命令。
#例如，nvm exec 16.20.0 node app.js 将使用 Node.js 的 16.20.0 版本来运行 app.js 文件。

npm cache clean --force  清除 npm 下载的缓存
```

---

# 五、常见问题排查

## 记一次前端执行 npm install 报错

由于项目是一个老项目，本地电脑上安装的node(20.9)以及npm(10.1)都是最新版本

刚开始执行 `npm install`报错
```
npm warn old lockfile This is a one-time fix-up, please be patient...
npm warn old lockfile
npm warn old lockfile
```
以为是版本不一致导致的,于是下载nvm降低版本到16.1
但是还是报错
  于是找到项目中有一个
  ![package-lock.json文件](/images/Pasted image 20241012163343.png)
猜测是由于这个里面写明了 各个包的明细导致,于是删掉,重新执行`npm install`
结果还是不行,依然报错
```
npm ERR! JSON.parse Unexpected token "/" (0x2F) in JSON at position 83 while parsing near "...e,\n  \"scripts\": {\n  /*  \"start\": \"vue-cl..."
```
网上查询方法都说是降版本什么的,总之 都没有用
**于是打开这个文件,发现里面指定了下载地址是之前淘宝的旧镜像源,将所有旧镜像源全部替换成新的地址,成功下载并运行**
不太理解为什么需要生成这种文件,完全指定才能够何处下载镜像源,导致本机修改的npm镜像源并不生效

**最终解决方法：将 package-lock.json 文件中的旧镜像源下载地址修改为最新的下载地址**

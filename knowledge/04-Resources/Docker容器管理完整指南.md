---
title: Docker 容器管理完整指南
description: Windows安装Docker、Oracle 12c/MySQL 8.0部署、存储空间管理、轻量替代工具选型与Portainer CE使用指南
mathjax: true
tags:
  - docker-desktop
  - Oracle-12c
  - Portainer
  - 容器管理
categories:
  - Java学习
abbrlink: 9c55edba
sticky: 2
swiper_index: 2
date: 2022-10-23 22:00:00
updated: 2026-06-11 12:00:00
cover: https://s2.loli.net/2024/10/22/IPoZb73rgSD9GM2.jpg
---

# 一、Windows 安装 Docker                #docker-desktop
	进入官网下载docker desktop   (不太好用,最起码不如linux docker好用)
		安装默认选择C盘 C:\Program Files\Docker\Docker
		如果需要安装到其他盘符 使用命令安装
		docker desktop 的设置有时管用,有时不管用,例如设置镜像源和设置下载镜像位置的时候
		不管用只能卸载重启,或者试下到文件夹修改文件,(我测试的时候修改文件也不好使,重装了N次才好😅)
	win11电脑还有可能会遇到安装新功能中没有hype-V的选项
	那么手动执行下面这个.bat文件即可,需要关机重启
	![Hyper-V安装脚本](/assets/Hyper-V.bat)

## 安装的必备条件

因为Windows上安装Docker实际上是基于Hyper-V或者WSL2这两项虚拟化技术，所以不管是对于系统还是硬件都有一定的要求。

**1，系统要求**

- Windows 11 64 位：家庭版或专业版 21H2 或更高版本，或企业版或教育版 21H2 或更高版本。

- Windows 10 64 位：

    - 建议使用 Home 或 Pro 22H2（内部版本 19045）或更高版本，或者企业或教育版 22H2（内部版本 19045）或更高版本。

    - 最低要求是 Home 或 Pro 21H2（内部版本 19044）或更高版本，或者 Enterprise 或教育版 21H2（内部版本 19044）或更高版本。


**2，[处理器](https://www.smzdm.com/ju/s2zxqy2/)开启虚拟化**

[![手把手教你如何在Windows 11上安装并使用Docker](https://qnam.smzdm.com/202407/06/6688f744679cc5077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_2/)

🔺处理器是否开启虚拟化可以直接在"任务管理器 —— 性能 —— [CPU](https://www.smzdm.com/fenlei/cpu/)"中查看，如果虚拟化显示"已启用"就说明没问题，如果没启用就需要进[主板](https://www.smzdm.com/fenlei/zhuban/)BIOS中开启，具体开启方法可以[百度](https://pinpai.smzdm.com/3357/)自己的主板型号开启。

## 安装前的准备

满足以上必备条件之后，我们还需要对电脑进行必要的环境设置。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f7442aeab5077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_3/)

🔺电脑桌面使用快捷键 `win + r` 键入 `OptionalFeatures`，"确定"之后打开 Windows 功能。

[![手把手教你如何在Windows 11上安装并使用Docker](https://qnam.smzdm.com/202407/06/6688f745b9edc134.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_4/)

🔺然后在"Windows 功能"中勾选Hyper-V、Windows虚拟机监控程序平台、容器、适用于Linux的Windows子系统这四项，点"确定"。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744773d75077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_5/)

🔺提示重启系统，点"立即重新启动"。

## 正式安装

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744526265077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_6/)

🔺重启之后打开Docker官网下载Windows版本的安装程序，下载页面地址：[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/ "https://www.docker.com/products/docker-desktop/")

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744a33695077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_7/)

🔺下载好之后直接双击安装，安装过程中这里有两个选项，记得都勾选上。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744a23eb5077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_8/)

🔺之后它就会自动下载安装必要的程序到本地，时间视自己的网络而定。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f7449d8365077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_9/)

🔺出现上图界面就说明安装完成，点"Close"关闭安装界面。

## 初始配置

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f7459cf4a134.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_10/)

🔺电脑桌面上的"Docker Desktop"图标打开程序，这里点"Accept"接受。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744696e05077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_11/)

🔺选择"Con....."

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f74486e865077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_12/)

🔺继续选择"Skip survey"

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f74585c22134.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_13/)

🔺终于来到Docker Desktop页面，不过这个出现上图所示的弹窗报错。我在这里卡了很久，因为不管是主板BIOS还很设置中我都启用了虚拟化的，突然记得我之前在电脑上折腾模拟器的时候使用命令手动关闭过虚拟化技术，所以这个时候我需要再次使用命令启用它即可。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f7452fffe134.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_14/)

🔺启用也很简单，[鼠标](https://www.smzdm.com/fenlei/shubiao/)右键电脑底部状态栏的"开始"图标，选择"终端管理员"。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f7441d9865077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_15/)

🔺然后输入命令"bcdedit /set hypervisorlaunchtype auto"并回车即可。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744338c25077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_16/)

🔺这个时候再次打开Docker Desktop程序就没问题了。不过在"设置"里面它会提示我们没有安装WSL2发行版，这个也好解决。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744cb0db5077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_17/)

🔺也是和前面一样，打开"终端管理员"，先输入命令"wsl.exe --list --online"查看当前在系统上可以安装并运行的WLS发行版列表。从列表中我们可以看到支持的有常见的Ubuntu、Debian等。（**这步不下载也可以**）

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f7458fedf134.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_18/)

🔺这里我以安装Debian为例，输入命令"wsl.exe --install Debian"即可。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f745e013c134.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_19/)

🔺安装好之后会让我们设置一个账号和密码，自己随意设置即可。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744d8ba75077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_20/)

🔺 看到以上信息不报错，就说明没有问题。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744b52b05077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_21/)

🔺回到Docker Desktop，还是正在"设置"里面的WSL可以看到它这里已经有个Debian选项了，开启并保存即可。至此， 我们在Windows 11上的Docker已经可以直接使用了。

## 成果检验

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f74467eae5077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_22/)

🔺和NAS上不同的是，我们也不需要SSH终端工具，直接使用电脑自己的"终端管理员"就能使用Docker命令。比如我们使用命令"docker version"可以查询当前的Docker版本信息。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f7447ba9a5077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_23/)

🔺或者可以直接输入命令"docker run hallo-world"命令部署一个检验容器，从下方输出看了一看出没有问题。

[![手把手教你如何在Windows 11上安装并使用Docker](https://am.zdmimg.com/202407/06/6688f744136685077.png_e1080.jpg)](https://post.smzdm.com/p/arrw990x/pic_24/)

🔺桌面上的Docker Desktop程序也显示了刚部署好的检验容器。


# 二、拉取 Oracle 12c 镜像并启动                              #Oracle-12c

MySQL和Oracle是开发中常用到的两个**关系型数据库管理系统**，接上一期内容，这一期在Docker中完成`oracle-12c`的安装和配置。

## 安装oracle-12c

### 1、拉取oracle-12c镜像

启动**Docker Desktop**后在cmd窗口中执行`docker search oracle`命令，搜索Oracle相关的镜像，可以看到搜索结果中的**truevoly/oracle-12c**
![](https://i-blog.csdnimg.cn/blog_migrate/df03f4a0da6d5897ddbc5a1cb0135aab.png)
不指定版本则默认下载oracle-12c最新版本的镜像，Oracle的镜像文件较大，拉取镜像会久一些。

```bash
# 拉取镜像(默认下载oracle-12c最新版本的镜像)
docker pull truevoly/oracle-12c
```

![](https://i-blog.csdnimg.cn/blog_migrate/d303716c01e9fbfd326de4b757885866.png)

---

### 2、创建并启动容器

cmd中执行以下命令，在docker中创建并启动一个oracle-12c容器，**对物理机暴露2122、9090和1521三个端口分别映射到容器内的22、8080和1521端口**，并且将容器内的oracle目录**挂载**到物理机的D盘中

```bash
# 创建oracle-12c容器并启动
docker run -d -p 2122:22 -p 9090:8080 -p 1521:1521 -v D:\lingSoftware\Docker\WorkSpace\Oracle:/u01/app/oracle/ --name oracle-12c truevoly/oracle-12c
```

查看容器启动日志（看到**Import finished Database ready to use. Enjoy!** 即容器创建并启动完成）

```bash
# 查看oracle-12c启动日志
docker logs -f oracle-12c
```

![](https://i-blog.csdnimg.cn/blog_migrate/ec334ef421594ae9eece0a8a97cb2479.png)
![](https://i-blog.csdnimg.cn/blog_migrate/e083b8a692d6c727664b16c9bc31c95f.png)
若日志中出现以下报错，是因为对外暴露的端口不可用访问权限已被禁止，只要更改创建容器时对外暴露的端口即可

```text
docker: Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:1521 -> 0.0.0.0:0: listen tcp 0.0.0.0:1521: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

可在cmd中执行以下命令查看哪些端口被禁用TCP协议

```bash
# cmd命令查看哪些端口被禁用TCP协议
netsh interface ipv4 show excludedportrange protocol=tcp
```

![](https://i-blog.csdnimg.cn/blog_migrate/9bf5186ba2db1c9e3841cc9270333b03.png)

---

### 3、修改oracle账号密码设置

truevoly/oracle-12c镜像创建的容器**默认有`sys`和`system`两个用户，密码都是`oracle`，默认的一个SID/服务名是xe**，Oracle的用户密码默认有效期是180天，180天后用户会自动锁住，下面进入oracle-12c容器内将密码的有效期设置为永久！

```bash
# 进入oracle-12c容器内
docker exec -it oracle-12c /bin/bash
# 切换成oracle用户
su oracle
# 进入sqlplus
$ORACLE_HOME/bin/sqlplus / as sysdba
# 设置密码有效期为无限制
SQL> ALTER PROFILE DEFAULT LIMIT PASSWORD_LIFE_TIME UNLIMITED;
# 解锁system用户
SQL> alter user SYSTEM account unlock;
```

![](https://i-blog.csdnimg.cn/blog_migrate/3d33128dca8aed52e4e9925bce28c714.png)

### 4、物理机连接oracle-12c

使用PL/SQL或Navicat等工具测试连接oracle-12c
![](https://i-blog.csdnimg.cn/blog_migrate/bf2611c3a90aa4e983ba6a4a9606ede2.png)

## 拓展

### Oracle创建表空间与用户

以下创建一个`ling_mf3`数据表空间

```sql
-- 创建ling_mf3数据表空间
create tablespace ling_mf3 datafile '/u01/app/oracle/data/ling_mf3.dbf' size 50M;
```

创建表空间成功，同时也会在挂载的目录下生成相应数据文件
![](https://i-blog.csdnimg.cn/blog_migrate/b9ce478867c79452b47630ac30557194.png)
以下创建一个用户`ling`并授权，且设置`ling_mf3`为它的默认表空间

```sql
-- 创建ling用户密码为meet0and1#202302并设置ling_mf3为它的默认表空间
create user ling identified by "meet0and1#202302" default tablespace ling_mf3;
-- 给用户ling授权 dba：管理员的权限
grant connect,resource,dba to ling;
```

![](https://i-blog.csdnimg.cn/blog_migrate/1cb8f1e8993a8a5cef0a24e36c555a0f.png)

### 重启Oracle服务

在**Docker Desktop**中可以一键重启，但实际开发中一般是在Linux环境中，我这里演示用命令重启Oracle服务

```bash
-- 查看监听状态
lsnrctl status
-- 停监听
lsnrctl stop
sqlplus / as sysdba
-- 停止oracle
SQL>shutdown immediate;
-- 启服务
SQL>startup;
SQL>exit
-- 启监听
lsnrctl start
```

### 更多常用…

```sql
-- 删除表空间
drop tablespace ling_mf3;

-- 查询所有的表空间
select tablespace_name from dba_tablespaces;

-- 查看当前的用户和表空间
select username,default_tablespace from user_users;

-- 查看当前用户的角色
select * from user_role_privs;
-- 查询实例名/SID/服务名
select instance_name from v$instance;
```

```sql
-- 查看Oracle版本
select * from v$version;

-- 查看数据库允许的最大连接数
select value from v$parameter where name = 'processes';

-- 查看当前连接数
select count(*) from v$process;

-- 查看数据库当前会话的连接数
select count(*) from v$session;

-- 查看数据库当前的并发连接数
select count(*) from v$session where status = 'ACTIVE';
```


# 三、Docker 修改文件大小(容器占用大小和池大小(docker_data.vhdx))
Docker默认空间大小分为两个，一个是池空间大小，另一个是容器空间大小。

池空间大小默认为：100G

容器空间大小默认为是：10G

所以修改空间大小也分为两个：

这里使用centos下的yum进行安装的Docker。

`首先，修改空间大小，必需使Docker运行在daemon环境下，即先停止正在运行的docker服务：`

```bash
service docker stop
然后使用命令使用daemon环境下运行docker：
docker -d
```

## 修改池空间大小

```bash
dd if=/dev/zero of=/var/lib/docker/devicemapper/devicemapper/data bs=1G count=0 seek=1000
dd if=/dev/zero of=/var/lib/docker/devicemapper/devicemapper/metadata bs=1G count=0 seek=10
```

`上面的1000为1TB大小，即为数据池空间大小为1TB，而10则为Metadata的空间大小，10GB`

从运行完后，使用命令查看docker池空间大小：

docker info
![docker相关截图](https://i-blog.csdnimg.cn/blog_migrate/64bee7c0d962c18cefe70c17b94b3592.png)

可以看到池空间已经被设置为data=1TB和metadata=10GB

## 修改容器空间大小

1、首先先进入目录（使用yum安装docker的默认目录）：

`cd /dev/mapper/`

2、使用命令查看容器是否正在运行。

`docker ps -a`
![docker相关截图](https://i-blog.csdnimg.cn/blog_migrate/feaeb93b524d028896542c6472ff37d5.png)

这里可以看到容器test正在运行。

3、使用命令查看容器卷：

`dmsetup table`
![docker相关截图](https://i-blog.csdnimg.cn/blog_migrate/abf079d46146acb95c5b04e052a9ce5f.png)

可以看到20971520，这个是卷空间值，我们需要修改的就是这里。

其它的值要记下：253:7 11

4、使用ls或ll命令查看在/dev/mapper/目录下的文件是否存在。（这步很重要，因为非正在运行的Container是不会有这个文件的）
![docker相关截图](https://i-blog.csdnimg.cn/blog_migrate/f686a39fc1e4d42ae7a484e512493ed9.png)

5、使用命令修改容器空间大小：

`echo 0 88080384 thin 253:7 11 | dmsetup load docker-253:1-184549824-95f242e4fe2fef132ab1a706ebf8eecbb1c6db19547c3f12b34b76a5dee96c7e`

**这里的 88080384 会替换原 20971520 值，意思为：42GB**

计数公式为：42_1024_1024*1024/512

可以使用命令打印：

`echo $((42*1024*1024*1024/512))`
![docker相关截图](https://i-blog.csdnimg.cn/blog_migrate/dbc1d6854e427fa93bee6488e7494f28.png)
接着使用命令：

`dmsetup resume docker-253:1-184549824-95f242e4fe2fef132ab1a706ebf8eecbb1c6db19547c3f12b34b76a5dee96c7e`

`resize2fs /dev/mapper/docker-253:1-184549824-95f242e4fe2fef132ab1a706ebf8eecbb1c6db19547c3f12b34b76a5dee96c7e`
![docker相关截图](https://i-blog.csdnimg.cn/blog_migrate/470ed240d43275c6d7848b8540bf01e5.png)
完成。

然后进入容器的终端，使用命令df -h即可看到修改后的容器空间：


写了个shell脚本，用于修改池、容器空间使用：

### resize_docker.sh 脚本

```bash


#!/bin/bash
DATA_SIZE=$1
METADATA_SIZE=$2
if [ "$DATA_SIZE" = "" ]; then
    DATA_SIZE=1000
fi
if [ "$METADATA_SIZE" = "" ]; then
    METADATA_SIZE=10
fi
```

#Stop docker service

```bash
systemctl stop docker
```

#Resize docker data space

```bash
dd if=/dev/zero of=/var/lib/docker/devicemapper/devicemapper/data bs=1G count=0 seek=$DATA_SIZE
```

#Resize docker metadata space

```bash
dd if=/dev/zero of=/var/lib/docker/devicemapper/devicemapper/metadata bs=1G count=0 seek=$METADATA_SIZE
```

#Start docker service

```bash
systemctl start docker
```

运行脚本方法：

```bash
sh resize_docker.sh 1000 10
```

将会把docker的池修改为data=1TB，metadata=10GB

### resize_container.sh 脚本

```bash
#!/bin/bash

CID=$1
SIZE=$2


if [ "$CID" != "" ] && [ "$SIZE" != "" ]; then
    DEV=$(basename $(echo /dev/mapper/docker-*-$CID));
    dmsetup table $DEV | sed "s/0 [0-9]* thin/0 $(($SIZE*1024*1024*1024/512)) thin/" | dmsetup load $DEV;
    dmsetup resume $DEV;
    resize2fs /dev/mapper/$DEV;
  echo "Resize $CID completed."
else
    echo "Usage: sh resize_container 459fd505311ad364309940ac24dcdb2bdfc68e3c3b0f291c9153fb54fbd46771 100";
fi
```

运行脚本方法：

```bash
sh resize_container.sh 459fd505311ad364309940ac24dcdb2bdfc68e3c3b0f291c9153fb54fbd46771 100
```

将容器459fd505311ad364309940ac24dcdb2bdfc68e3c3b0f291c9153fb54fbd46771的空间修改为100GB

注：修改空间，必需是在docker的daemon模式下进行。


docker容器默认的空间是10G,如果想指定默认容器的大小（在启动容器的时候指定），可以在docker配置文件里通过dm.basesize参数指定，比如

```bash
docker -d --storage-opt dm.basesize=20G
```

是指定默认的大小为20G，具体参数可以参考https://github.com/docker/docker/tree/master/daemon/graphdriver/devmapper

上面方法只是真的生成容器的时候进行的，并且修改后需要重启docker，无法做到动态给运行容器指定大小，下面我介绍一下如何动态的扩展容器空间大小。

## 动态扩展的优点：

1、不需要修改docker配置，并且重启docker服务；

2、可以直接对运行中的容器进行动态扩展（只能增，无法缩）；

缺点：
`1、docker所在宿主机分区的格式必须是ext2、ext3、ext4；`

`2、docker存储引擎必须是devicemapper`

存储引擎查看，可以使用docker info查看

15:25:49 # docker info

Containers: 5
Images: 62
Storage Driver: devicemapper
Pool Name: docker-8:17-37748738-pool
Data file: /data1/docker/devicemapper/devicemapper/data
Metadata file: /data1/docker/devicemapper/devicemapper/metadata
Data Space Used: 21498.9 Mb
Data Space Total: 102400.0 Mb
Metadata Space Used: 13.7 Mb
Metadata Space Total: 2048.0 Mb
Execution Driver: lxc-1.0.6
Kernel Version: 3.10.0-123.el7.x86_64

从上面的Storage Driver可以看到我使用的引擎。

下面是动态扩展的例子：

1、新建立个test容器

15:23:48 # docker run --privileged -d -p 22 --name='test' docker.ops-chukong.com:5000/CentOS6-http:new /usr/bin/supervisord
1716fe941926dbd0b247b85d73e83b9465322a5005edc3c6182b59a6ac0939a7

root@ip-10-10-27-221:/tmp

15:24:01 # docker inspect test|grep -i add

```json
    "IPAddress": "172.17.0.18",
```

root@ip-10-10-27-221:/tmp

15:24:08 # ssh 172.17.0.18

The authenticity of host '172.17.0.18 (172.17.0.18)' can't be established.
RSA key fingerprint is 39:7c:13:9f:d4:b0:d7:63:fc:ff:ae:e3:46:a4:bf:6b.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '172.17.0.18' (RSA) to the list of known hosts.
root@172.17.0.18's password:

Last login: Mon Nov 17 14:10:39 2014 from 172.17.42.1

root@1716fe941926:~

15:24:13 # df -hT
Filesystem Type Size Used Avail Use% Mounted on
rootfs rootfs 9.8G 470M 8.8G 5% /
/dev/mapper/docker-8:17-37748738-1716fe941926dbd0b247b85d73e83b9465322a5005edc3c6182b59a6ac0939a7
ext4 9.8G 470M 8.8G 5% /
shm tmpfs 64M 0 64M 0% /dev/shm
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /.dockerinit
/dev/sda3 ext4 518G 30G 462G 6% /etc/resolv.conf
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /etc/hostname
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /etc/hosts
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /.dockerenv

可以看到我运行test容器的根分区是ext4分区，容器是10G

2、使用我的脚本动态扩展容器空间

脚本内容
`# cat dynamic_modify_docker_disk.sh`

```bash
#!/bin/bash
#This script is dynamic modify docker container disk
#Author Deng Lei
if [ -z $1 ] || [ -z $2 ]; then
    echo "Usage: container_name increase_capacity"
    echo "Example: I want increase 11G to test"
    echo "The command is:  sh `basename $0` test 11"
    exit 1
fi
if [ `docker inspect $1 &>>/dev/null &&  echo 0 || echo 1` -eq 1 ];then
    echo "The container $1 is no exist!"
    exit 1
fi
container_id=`docker inspect -f '{{ .Id }}' $1`
now_disk=`dmsetup table /dev/mapper/docker-*-$container_id|awk '{print $2}'`
disk=$(($2*1024*1024*1024/512))
if [ $disk -lt $now_disk ];then
    echo "I can't shink container $1 from $(($now_disk*512/1024/1024/1024))G to ${2}G!I only modify contanier increase disk!"
    exit 1
fi
dmsetup table /dev/mapper/docker-*-$container_id|sed "s/0 [0-9]* thin/0 $disk thin/"|dmsetup load /dev/mapper/docker-*-$container_id
dmsetup resume /dev/mapper/docker-*-$container_id
resize2fs /dev/mapper/docker-*-$container_id
if [ $? -eq 0 ];then
    echo "dynamic container $1 disk to ${2}G is success!"
else
    echo "dynamic container $1 disk to ${2}G is fail!"
fi
```

目前给test容器进行动态增加20G空间

```bash
 # sh dynamic_modify_docker_disk.sh test 20
```

dynamic container test disk to 20G is success!

root@ip-10-10-27-221:/tmp

15:24:46 # ssh 172.17.0.18

root@172.17.0.18's password:
Last login: Tue Jan 20 15:24:52 2015 from 172.17.42.1

root@1716fe941926:~

15:24:52 # df -hT
Filesystem Type Size Used Avail Use% Mounted on
rootfs rootfs 20G 475M 19G 3% /
/dev/mapper/docker-8:17-37748738-1716fe941926dbd0b247b85d73e83b9465322a5005edc3c6182b59a6ac0939a7
ext4 20G 475M 19G 3% /
shm tmpfs 64M 0 64M 0% /dev/shm
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /.dockerinit
/dev/sda3 ext4 518G 30G 462G 6% /etc/resolv.conf
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /etc/hostname
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /etc/hosts
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /.dockerenv

可以看到已经增加成功
下面在给test增加到50G

15:25:21 # sh dynamic_modify_docker_disk.sh test 50

dynamic container test disk to 50G is success!

root@ip-10-10-27-221:/tmp

15:25:24 # ssh 172.17.0.18
root@172.17.0.18's password:
Last login: Tue Jan 20 15:24:52 2015 from 172.17.42.1

root@1716fe941926:~

15:25:27 # df -hT
Filesystem Type Size Used Avail Use% Mounted on
rootfs rootfs 50G 480M 47G 1% /
/dev/mapper/docker-8:17-37748738-1716fe941926dbd0b247b85d73e83b9465322a5005edc3c6182b59a6ac0939a7
ext4 50G 480M 47G 1% /
shm tmpfs 64M 0 64M 0% /dev/shm
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /.dockerinit
/dev/sda3 ext4 518G 30G 462G 6% /etc/resolv.conf
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /etc/hostname
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /etc/hosts
/dev/sdb1 ext4 1.8T 30G 1.7T 2% /.dockerenv

也可以增加成功

但我要是像缩减到30G

15:25:45 # sh dynamic_modify_docker_disk.sh test 30
I can't shink container test from 50G to 30G!I only modify contanier increase disk!

是无法进行缩减的，仅能进行增加操作。

至于动态增加的原理请参考http://jpetazzo.github.io/2014/01/29/docker-device-mapper-resize/
FAQ：
centos 7里使用docker的时候默认存储引擎是devicemapper

在进行动态调整docker容器磁盘空间的时候，出现

resize2fs 1.42.9 (28-Dec-2013)
resize2fs: Device or resource busy while trying to open /dev/mapper/docker-253:1-1270544-d2d2cef71c86910467c1afdeb79c1a008552f3f9ef9507bb1e04d77f2ad5eac4
Couldn't find valid filesystem superblock.

原因是resize2fs仅能支持ext2、ext3、ext4，不支持xfs ，所以建议docker服务器的文件系统格式调整为ext4


通过命令可以观察到/var/lib/Docker目录很大，我的主机只有20G，这个目录占了18G；原因是devicemapper的空间设的太大，通过docker info打印的Data Space Total参数可以看到，默认是107.4G。

思路如下：
备份当前容器、镜像；
删除/var/lib/docker目录；
使用dd命令重设大小；
恢复容器、镜像；
工具：
需要额外空间保存备份文件，可以挂载一个u盘或者云盘。

docker save 可以导出镜像 tar文件；

docker export 可以导出容器 tar文件；

备份好之后停止docker


#/etc/init.d/docker stop

删除/var/lib/docker目录；


#mkdir -p /var/lib/docker/devicemapper/devicemapper/data

#dd if=/dev/zero of=/var/lib/docker/devicemapper/devicemapper/data bs=1M count=0 seek=8192

建立的文件最大为 1M * 8192 = 8G

启动docker


#/etc/init.d/docker start

使用docker info看看Data Space Total，检查是否设置成功

docker load 可以导入镜像tar文件为 镜像

注意load用法为：docker load image1:new<image1.tar

docker import 可以导入容器tar文件为 镜像

注意import用法为： cat container1.tar |docker import - container1:new

## Docker 安装 MySQL 8.0
docker pull mysql:8..15等待下载完成即可
启动命令 :
```bash
# 先启动一个临时的mysql容器，将容器的配置复制到服务器
docker cp mysql_v8_0:/etc/my.cnf D:\env\docker\mysql\conf\my.cnf


docker run --name mysql -p 33067:3306 -v "D:\tools\docker\WorkSpace\mysql\conf\my.cnf:/etc/my.cnf" -v "D:\tools\docker\WorkSpace\mysql\data:/var/lib/mysql"  -v "D:\tools\docker\WorkSpace\mysql\logs:/logs" -e MYSQL_ROOT_PASSWORD=Srcloud@216 --restart=always -d mysql:8.0

- `docker run`: 这是启动新容器的命令。
- `--name mysql`: 指定容器名称为 `mysql`。
- `-p 3306:3306`: 将宿主机的端口 `3306` 映射到容器的端口 `3306`。这样，您可以通过宿主机的 `3306` 端口访问容器中的 MySQL 服务。
- `-v "D:\env\docker\mysql\conf\my.cnf:/etc/my.cnf"`: 将宿主机的 `D:\env\docker\mysql\conf\my.cnf` 文件映射到容器的 `/etc/my.cnf` 文件。`my.cnf` 是 MySQL 的配置文件，这样您可以在宿主机上编辑配置文件并让 MySQL 容器使用它。
- `-v "D:\env\docker\mysql\data:/var/lib/mysql"`: 将宿主机的 `D:\env\docker\mysql\data` 目录映射到容器的 MySQL 数据目录 `/var/lib/mysql`。这样，MySQL 数据文件将存储在宿主机上，即使容器被删除，数据也不会丢失。
- `-v "D:\env\docker\mysql\logs:/logs"`: 将宿主机的 `D:\env\docker\mysql\logs` 目录映射到容器的 `/logs` 目录。这样，MySQL 的日志文件将存储在宿主机的指定目录。
- `-e MYSQL_ROOT_PASSWORD=root`: 设置环境变量 `MYSQL_ROOT_PASSWORD` 为 `root`，这是 MySQL 容器的 root 用户的密码。
- `--restart=always`: 设置容器在 Docker 启动时总是自动重启。这意味着如果 Docker 服务重启或者容器本身非正常退出，它将自动尝试重启。
- `-d`: 表示以守护态（后台）运行容器。
- `mysql:8.0`: 指定要使用的 Docker 镜像。这里使用的是标签为 `8.0` 的官方 MySQL 镜像。
总的来说，这个命令会创建一个名为 `mysql` 的容器，运行 MySQL 8.0，将 MySQL 服务暴露在宿主机的 3306 端口，并映射了配置文件、数据目录和日志目录到宿主机上，同时设置了 MySQL 的 root 密码，并配置了容器随 Docker 服务启动而自动重启。
```


# 四、轻量替代工具选型与 Portainer CE 使用指南

> 整理日期：2026-06-10

## 需求背景

- 需要轻量级、开源免费、UI 友好的容器管理工具
- 替代 Docker Desktop（收费且较重）
- 已在另一台电脑配置好 WSL2 + Ubuntu + Docker 环境

## 工具对比与选择

### 候选工具

| 工具 | 特点 | 适用场景 |
|------|------|----------|
| **Podman Desktop** | RedHat 出品，无守护进程，轻量 | 完整桌面应用替代 Docker Desktop |
| **Rancher Desktop** | SUSE 出品，内置 K8s，免费开源 | 需要 Kubernetes 的开发者 |
| **Portainer CE** | Web UI，极轻量，功能强大 | 已有 Docker 环境，只需管理界面 |
| **Finch** | AWS 出品，命令行为主 | 轻量命令行工具 |

### 最终选择：Portainer CE

**理由**：
- 已有 Docker 环境，不需要重复创建容器运行时
- 启动极快（一条命令）
- 资源占用极低（只是一个容器）
- UI 专业直观，支持多环境管理

## Portainer CE 使用指南

### 镜像获取

**方式一：直接拉取（联网环境）**
```bash
docker pull portainer/portainer-ce:latest
```

**方式二：离线导入（无网络环境）**
```bash
# 在有网络的机器上导出
docker save -o portainer-ce-latest.tar portainer/portainer-ce:latest

# 拷贝到目标机器后导入
docker load -i portainer-ce-latest.tar
```

### 启动容器

```bash
docker run -d \
  -p 8000:8000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

### 访问地址

- **管理界面**：https://localhost:9443
- 首次访问需设置管理员账号密码
- 证书为自签名，浏览器提示不安全时点击"继续前往"

### 汉化方案

**推荐：使用第三方汉化镜像**
```bash
docker pull 6053537/portainer-ce:latest

docker run -d \
  -p 8000:8000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  6053537/portainer-ce:latest
```

## 常见问题

### docker load 报错：无法连接 docker.sock

**原因**：Docker 服务未启动

**解决**：
```bash
# 启动 Docker 服务
sudo systemctl start docker

# 或后台启动
dockerd &
```

### 开机自动启动 WSL2 + Docker

**创建 Windows 启动脚本**

文件：start-wsl-docker.vbs
```vb
Set ws = CreateObject("Wscript.Shell")
ws.Run "wsl -d Ubuntu -u root -- /usr/sbin/dockerd > /dev/null 2>&1 &", 0, False
```

放置位置：Win + R 输入 shell:startup，把文件放进去

## 文件清单

| 文件 | 位置 | 说明 |
|------|------|------|
| portainer-ce-latest.tar | D:\Test\ | Portainer CE 离线镜像包 |
| start-wsl-docker.vbs | 启动文件夹 | WSL2 Docker 开机自启脚本 |

## 参考链接

- Portainer 官网：https://www.portainer.io/
- Portainer CE 文档：https://docs.portainer.io/
- GitHub 发布页：https://github.com/portainer/portainer/releases

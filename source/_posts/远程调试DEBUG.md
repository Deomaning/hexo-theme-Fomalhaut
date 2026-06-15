---
abbrlink: 54564w
title: 远程调试DEBUG
description: 🥧只需要线上和本地代码一致,即可远程调试
mathjax: true
tags:
  - "#DEBUG调试"
categories:
  - 随手笔记
sticky: 1
swiper_index: 2
date: 2022-08-09 18:19:03
updated: 2022-10-23 22:00:00
cover: https://s2.loli.net/2024/10/09/vZ8SYVMfBb9pnwT.webp
---
# 远程调试 DEBUG

在工作中遇到了需要远程调试程序的问题，需要本地远程 debug 代码。

下面讲解两种方式，方式一是我觉得最舒服的解决方案大家可以参考一下。

方式一和方式二首先只是配置远程服务端的参数，后面还有 Idea 连接的配置（这里因为远程服务端的配置包括启动命令可能有所不同，Idea 的配置基本相同，所以放到了最后统一描述）。

## 服务端的配置

### 方式一：启动命令添加调试参数

通过命令启动 jar 包

```bash
java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=n -jar  xxx.jar
```

这种方式直接，不需要在打包插件中添加内容。

> 完整命令：
>
> 端口号为：5005 这个是远程调试的端口号
>
> -Dspring.cloud.nacos.config.server-addr=127.0.0.1:8848
>
> -Dspring.cloud.nacos.config.namespace=test
>
> 这两行命令为获取配置文件的命令，如果没有也可以不要。
>
> test.jar 这个为启动的 jar 包
>
> eg：
> java -Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=5005,suspend=n -jar -Dfile.encoding=utf-8 -Dspring.cloud.nacos.config.server-addr=127.0.0.1:8848 -Dspring.cloud.nacos.config.namespace=test  -Xms512m -Xmx512m test.jar >/dev/null 2>&1  &

### 方式二：Maven 插件配置

需要在打包插件中加入 configuration 标签中的内容，然后打包发布到服务器上。

```xml
<build>
    <finalName>Test</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <jvmArguments>-Xdebug -Xrunjdwp:transport=dt_socket,address=5005,server=y,suspend=n</jvmArguments>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>8</source>
                <target>8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```

这里需要注意的是，远程连接的端口号要跟后面 Idea 配置的相同。

通过命令启动 jar 包：

```bash
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar  xxx.jar
```

### Idea 的配置

上述远程配置和启动命令有所不同，但是 Idea 的配置和使用是相同的。

步骤一：

![](https://i-blog.csdnimg.cn/blog_migrate/a2f51d974ae8292f4e926ebbc98e9dd7.png)

进入后添加 remote ![](https://i-blog.csdnimg.cn/blog_migrate/82ad0634f787a5a00481662943629861.png)

这里要注意 host 和 port；一个是服务的远程 ip 地址，一个是端口号，这些要跟远程服务的配置相同。

然后启动：

![](https://i-blog.csdnimg.cn/blog_migrate/c991b27ea7cff19ee543ce535ac357ee.png)

如果出现如图所示说明启动成功。

然后调用接口，可以正常进入 debug。

## 实际使用场景

远程调用 Nacos 调试程序：

1. 修改 `stamd.cmd` 脚本
2. 在其中添加：

```bash
set "JAVA_DEBUG=-Xdebug -Xrunjdwp:transport=dt_socket,address=6666,server=y,suspend=n"
```

3. 监听 6666 端口
4. command 中将命令添加进去即可远程调试

![远程调试配置](/images/debug.jpg)

## Tomcat 远程调试

1. 在 Windows 系统里，在 `catalina.bat` 中加入：

```bash
set "JAVA_OPTS=%JAVA_OPTS% -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8888 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"
```

或者下面这个（具体忘了是哪个了）：

```bash
set CATLINA_OPTS=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000
```

![catalina.bat](/images/catlina-bat.bmp)

2. 在 Linux 系统里，在 `catalina.sh` 中加入：

```bash
set "JAVA_OPTS=%JAVA_OPTS% -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8888 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8"
```

## 金蝶 AAS 应用服务器

在资源管理 --> JVM 参数中开启 debug，重启即可，端口默认 8000。

---
title: Docker 容器日志清理踩坑记
description: 服务器磁盘突然爆满，排查发现是 Docker 容器日志文件失控增长，记录完整的排查过程和解决方案
date: 2026-06-17 11:00:00
updated: 2026-06-17 11:00:00
tags:
  - Docker
  - 运维
  - 日志
categories:
  - 随手笔记
abbrlink: docker-log-cleanup
mathjax: false
---

## 前言

上周六凌晨，我正在睡觉，突然收到阿里云告警短信："磁盘使用率超过 85%"。

我心想，这服务器刚扩容没多久啊，怎么又满了？登录一看，根目录 100G 只剩 2G 可用。排查了一圈，罪魁祸首竟然是 **Docker 容器日志**。

## 排查过程

### 第一步：定位大文件

用 `du` 命令快速定位：

```bash
sudo du -sh /var/lib/docker/containers/* | sort -rh | head -10
```

输出让我震惊：

```
42G     /var/lib/docker/containers/a1b2c3d4e5f6...
38G     /var/lib/docker/containers/b2c3d4e5f6a7...
15G     /var/lib/docker/containers/c3d4e5f6a7b8...
```

三个容器的日志文件就占了 95G！

### 第二步：查看日志文件

进入目录一看，每个容器都有一个 `-json.log` 文件：

```bash
ls -lh /var/lib/docker/containers/a1b2c3d4e5f6.../

# 输出
-rw-r----- 1 root root 42G Jun 17 02:15 a1b2c3d4e5f6...-json.log
```

42G 的单个日志文件！这谁顶得住啊。

### 第三步：确认日志来源

查看是什么容器：

```bash
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Image}}"
```

发现是 **Nginx 反向代理容器** 和 **Spring Boot 应用容器**。前者因为记录了所有访问日志，后者因为打印了大量 DEBUG 级别日志。

## 坑一：直接删除日志文件

我第一反应是直接删：

```bash
sudo rm -f /var/lib/docker/containers/a1b2c3d4e5f6.../a1b2c3d4e5f6...-json.log
```

磁盘空间确实释放了，但...

> 容器还在运行，日志文件被删除后，Docker 仍然向已删除的文件描述符写入数据，导致 `df` 显示空间未释放（需要重启容器才能彻底释放）。

更坑的是，Nginx 容器重启后，配置文件里没改日志级别，没几天日志又涨回来了。

## 坑二：用 truncate 清空但不限制

后来学聪明了，用 `truncate` 清空而不删除：

```bash
sudo truncate -s 0 /var/lib/docker/containers/a1b2c3d4e5f6.../a1b2c3d4e5f6...-json.log
```

这样不需要重启容器，空间立即释放。但是...

这只是治标不治本！日志还是会继续增长，过几周又要手动清理一次。

## 正确解决方案

### 方案一：配置 Docker 全局日志限制（推荐）

编辑 `/etc/docker/daemon.json`：

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "3"
  }
}
```

参数说明：

| 参数 | 含义 |
|------|------|
| `max-size` | 单个日志文件最大 100MB |
| `max-file` | 最多保留 3 个日志文件（轮转） |

重启 Docker 生效：

```bash
sudo systemctl restart docker
```

> 注意：已运行的容器不会生效，需要重建容器。

### 方案二：针对单个容器配置

在 `docker-compose.yml` 中配置：

```yaml
version: '3'
services:
  app:
    image: myapp:latest
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "3"
```

或者 `docker run` 时指定：

```bash
docker run -d \
  --log-driver json-file \
  --log-opt max-size=100m \
  --log-opt max-file=3 \
  myapp:latest
```

### 方案三：使用日志驱动转发到外部

如果日志需要长期保留，可以转发到日志收集系统：

```yaml
logging:
  driver: "fluentd"
  options:
    fluentd-address: "localhost:24224"
    tag: "docker.{{.Name}}"
```

或者直接用 `syslog`：

```yaml
logging:
  driver: "syslog"
  options:
    syslog-address: "tcp://logs.example.com:514"
```

## 清理脚本（应急用）

虽然配置了限制，但有时候还是需要手动清理。我写了一个安全脚本：

```bash
#!/bin/bash
# docker-log-cleanup.sh
# 安全清理 Docker 容器日志，不删除文件

echo "开始清理 Docker 容器日志..."

# 清理所有容器的日志
for log in /var/lib/docker/containers/*/*-json.log; do
    if [ -f "$log" ]; then
        size=$(du -sh "$log" | cut -f1)
        echo "清理: $log (大小: $size)"
        sudo truncate -s 0 "$log"
    fi
done

echo "清理完成！"

# 显示当前磁盘使用情况
df -h /
```

使用方法：

```bash
chmod +x docker-log-cleanup.sh
sudo ./docker-log-cleanup.sh
```

## 额外建议

### 1. 应用层控制日志级别

Spring Boot 应用，把 `application.yml` 里的日志级别调高：

```yaml
logging:
  level:
    root: info
    com.mycompany: warn
```

Nginx 关闭不必要的访问日志：

```nginx
# 对静态资源不记录访问日志
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    access_log off;
}
```

### 2. 监控告警

在 Prometheus + Alertmanager 中添加磁盘监控：

```yaml
- alert: DiskSpaceUsage
  expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: "磁盘空间不足"
    description: "{{ $labels.instance }} 磁盘使用率超过 90%"
```

### 3. 定期检查

加入 crontab，每周检查一次：

```bash
# 每周一凌晨 3 点检查并清理超过 1G 的日志
0 3 * * 1 find /var/lib/docker/containers -name "*-json.log" -size +1G -exec truncate -s 0 {} \;
```

## 总结

| 做法 | 是否推荐 | 说明 |
|------|---------|------|
| 直接 `rm` 删除日志 | 不推荐 | 需要重启容器才能释放空间 |
| `truncate` 清空 | 应急可用 | 治标不治本 |
| Docker 日志限制配置 | 强烈推荐 | 一劳永逸，自动轮转 |
| 外部日志收集 | 推荐 | 适合需要长期保留日志的场景 |

Docker 日志管理是很多新手容易忽视的问题，等到磁盘满了才想起来就晚了。建议在新项目部署时就配置好日志限制，避免半夜被告警叫醒 😅

## 参考

- [Docker 官方文档 - 日志驱动](https://docs.docker.com/config/containers/logging/configure/)
- [Docker Compose 日志配置](https://docs.docker.com/compose/compose-file/compose-file-v3/#logging)

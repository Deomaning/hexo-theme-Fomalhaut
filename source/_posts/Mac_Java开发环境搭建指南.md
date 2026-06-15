---
title: Mac Java 开发环境搭建指南
description: 适用 Mac（Intel / Apple Silicon M 系列）的一键安装脚本与配置指南
tags:
  - Mac
  - Java
  - 开发环境
categories:
  - 随手笔记
abbrlink: a895dee9
date: 2025-01-01 00:00:00
updated: 2026-06-11 12:00:00
---

# Mac Java 开发环境搭建指南

> 适用 Mac（Intel / Apple Silicon M 系列）
> 生成时间：2025年

## 一、一键安装脚本

将以下内容保存为 `setup-mac-dev.sh`，在终端执行：

```bash
#!/bin/bash
# Mac Java 开发环境一键安装脚本
# 用法: chmod +x setup-mac-dev.sh && ./setup-mac-dev.sh

set -e

echo "========================================="
echo "  Mac Java 开发环境一键安装"
echo "========================================="

# 1. 安装 Homebrew（如已安装则跳过）
if ! command -v brew &> /dev/null; then
    echo "[1/8] 安装 Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Apple Silicon 需要额外配置 PATH
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo "[1/8] Homebrew 已安装，更新中..."
    brew update
fi

# 2. 安装 SDKMAN!（管理 JDK/Gradle/Maven 版本）
echo "[2/8] 安装 SDKMAN!..."
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# 3. 安装 JDK（Eclipse Temurin JDK 21 LTS）
echo "[3/8] 安装 JDK 21 (Eclipse Temurin)..."
brew install temurin21

# 验证
java -version

# 4. 安装构建工具（Maven + Gradle）
echo "[4/8] 安装 Maven & Gradle..."
brew install maven gradle

# 验证
mvn -version
gradle -version

# 5. 安装 Git
echo "[5/8] 安装 Git..."
brew install git

# Git 基础配置（请按需修改用户名和邮箱）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main

# 6. 安装 Docker（容器环境）
echo "[6/8] 安装 Docker..."
brew install --cask docker

# 7. 安装 iTerm2 + Oh My Zsh
echo "[7/8] 安装 iTerm2 + Oh My Zsh..."
brew install --cask iterm2

# Oh My Zsh
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# 8. 安装杂项工具（DBeaver、Postman、VisualVM）
echo "[8/8] 安装 DBeaver、Postman、VisualVM..."
brew install --cask dbeaver-community
brew install --cask postman
brew install --cask visualvm

echo ""
echo "========================================="
echo "  安装完成！🎉"
echo ""
echo "  请手动安装："
echo "    - IntelliJ IDEA:  https://www.jetbrains.com/idea/download/"
echo "    - VS Code:        https://code.visualstudio.com/"
echo "========================================="

# 打印安装的版本汇总
echo ""
echo "--- 已安装工具版本 ---"
echo "Java:      $(java -version 2>&1 | head -1)"
echo "Maven:     $(mvn -version 2>&1 | head -1)"
echo "Gradle:    $(gradle -version 2>&1 | head -1)"
echo "Git:       $(git --version)"
echo "Docker:    $(docker --version 2>&1)"
```

---

## 二、工具清单与说明

### 1️⃣ 包管理器

| 工具 | 用途 | 推荐理由 | 安装方式 |
|------|------|----------|----------|
| **Homebrew** | macOS 包管理器 | 业界标准，社区活跃，卸载干净 | `brew install xxx` |
| **MacPorts** | 备选包管理器 | 部分旧软件支持好 | `port install xxx` |

---

### 2️⃣ JDK（核心）

| 产品 | 用途 | 推荐理由 |
|------|------|----------|
| **Eclipse Temurin 21** ⭐ | 开源 JDK（Adoptium） | 免费、稳定、无商业限制，新手首选 |
| **Oracle JDK 21** | 官方 JDK | 企业级支持，生产环境首选 |
| **Azul Zulu 21** | OpenJDK 构建版 | Apple Silicon 优化好，低延迟 |
| **Amazon Corretto 21** | AWS 免费 JDK | AWS 部署原生优化 |
| **GraalVM** | 高性能 JDK + AOT 编译 | 支持编译原生可执行文件，启动极快 |

**安装示例：**
```bash
# 用 SDKMAN 管理多版本 JDK（推荐）
sdk install java 21.0.5-tem
sdk install java 17.0.13-tem
sdk use java 21.0.5-tem   # 切换版本

# 用 Homebrew 安装
brew install temurin21
brew install zulu21
```

---

### 3️⃣ IDE（开发环境）

| 工具 | 用途 | 推荐理由 | 价格 |
|------|------|----------|------|
| **IntelliJ IDEA Ultimate** ⭐ | JetBrains 旗舰 IDE | 最强 Java 支持，Spring/Maven/Git 深度集成 | 付费（学生免费） |
| **IntelliJ IDEA Community** | IntelliJ 免费版 | 纯 Java/Android 开发够用 | 免费 |
| **VS Code + Java Pack** | 轻量编辑器 | 启动快，前端+Java 全栈通用 | 免费 |
| **Eclipse** | 老牌开源 IDE | 插件生态大，维护旧项目 | 免费 |
| **NetBeans** | Apache 开源 IDE | 自带 Swing GUI 设计器 | 免费 |

---

### 4️⃣ 构建工具

| 工具 | 用途 | 推荐理由 |
|------|------|----------|
| **Maven** ⭐ | 基于 XML 的构建/依赖管理 | 规范统一，企业主流，新手首选 |
| **Gradle** | 基于 Groovy/Kotlin DSL | 配置简洁，构建快，Android 官方工具 |
| **Ant + Ivy** | 最早 Java 构建工具 | 仅历史项目维护用 |

**安装：**
```bash
brew install maven gradle
# 或用 SDKMAN
sdk install maven
sdk install gradle
```

---

### 5️⃣ 版本控制

| 工具 | 用途 | 推荐理由 |
|------|------|----------|
| **Git** ⭐ | 命令行版本控制 | 必装，所有开发的基础 |
| **Sourcetree** | Git GUI 客户端 | 可视化操作，适合新手 |
| **GitHub Desktop** | 官方 Git GUI | 界面简洁，GitHub 集成好 |
| **Fork** | macOS 原生 Git GUI | 速度快，UI 精美，付费但值得 |

---

### 6️⃣ 数据库工具

| 工具 | 用途 | 推荐理由 | 价格 |
|------|------|----------|------|
| **DBeaver** ⭐ | 通用数据库管理 | 支持所有主流数据库，免费版够用 | 免费 |
| **DataGrip** | JetBrains 数据库 IDE | 智能 SQL 补全极强 | 付费 |
| **TablePlus** | macOS 原生客户端 | 颜值高、启动快 | 免费版够用 |
| **Navicat Premium** | 老牌数据库工具 | 功能完整，支持数据同步 | 付费 |

---

### 7️⃣ API 调试工具

| 工具 | 用途 | 推荐理由 |
|------|------|----------|
| **Postman** ⭐ | HTTP API 测试 | 功能最全：集合/环境/自动化测试 |
| **Insomnia** | 开源 API 客户端 | 比 Postman 轻量，支持 GraphQL |
| **Bruno** | 本地优先 API 客户端 | 数据本地存储，隐私友好，新晋热门 |
| **HTTPie** | 命令行 HTTP 客户端 | 一行命令快速测试 |

---

### 8️⃣ 终端增强

| 工具 | 用途 | 推荐理由 |
|------|------|----------|
| **iTerm2** ⭐ | 终端替代品 | 分屏、搜索、主题，比自带强很多 |
| **Oh My Zsh** ⭐ | Zsh 配置框架 | 插件丰富，提升终端效率 |
| **Warp** | 新式 Rust 终端 | AI 辅助，智能补全，现代化体验 |

---

### 9️⃣ 容器化

| 工具 | 用途 | 推荐理由 |
|------|------|----------|
| **Docker Desktop** | 容器运行环境 | 跑数据库/中间件，开发环境一致 |
| **OrbStack** ⭐ | macOS 原生 Docker 替代 | 启动秒级，资源占用极低，Apple Silicon 优化好（付费） |
| **Colima** | 开源 Docker 运行时 | 免费、轻量、无 GUI |

---

### 🔟 其他实用工具

| 工具 | 用途 | 推荐理由 |
|------|------|----------|
| **SDKMAN!** ⭐ | JDK/Maven/Gradle 多版本管理 | 一键切换版本 |
| **VisualVM** | JVM 性能监控 | 查堆内存、线程、GC 情况 |
| **Draw.io** | 画架构图 | 免费，支持本地文件 |
| **Typora** | Markdown 编辑器 | 所见即所得，写文档舒服 |
| **Raycast** | 效率启动器（替代 Alfred） | 快速启动、剪贴板历史、窗口管理 |

---

## 三、快速起步推荐（极简方案）

```
┌──────────────────────────────────────────┐
│  1. Homebrew          → brew 装一切        │
│  2. SDKMAN!           → 管理 JDK 版本       │
│  3. Temurin JDK 21    → Java 运行核心       │
│  4. IntelliJ IDEA CE  → 主力开发            │
│  5. Maven             → 构建与依赖管理       │
│  6. Git               → 版本控制            │
│  7. iTerm2 + Oh My Zsh → 终端体验           │
│  8. DBeaver           → 数据库管理           │
│  9. Postman           → API 测试            │
│ 10. Docker (OrbStack) → 容器环境            │
└──────────────────────────────────────────┘
```

---

## 四、验证环境是否装好

在终端执行以下命令检查：

```bash
echo "=== Java 开发环境验证 ==="
echo "Java:      $(java -version 2>&1 | head -1)"
echo "Javac:     $(javac -version 2>&1)"
echo "Maven:     $(mvn -version 2>&1 | head -1)"
echo "Gradle:    $(gradle -version 2>&1 | head -1)"
echo "Git:       $(git --version)"
echo "Docker:    $(docker --version 2>&1)"
echo "Homebrew:  $(brew --version 2>&1 | head -1)"
```

正常输出示例：
```
=== Java 开发环境验证 ===
Java:      openjdk version "21.0.5" 2024-10-15 LTS
Javac:     javac 21.0.5
Maven:     Apache Maven 3.9.9
Gradle:    Gradle 8.10
Git:       git version 2.47.0
Docker:    Docker version 27.3.1
Homebrew:  Homebrew 4.4.2
```

---

## 五、注意事项

1. **Apple Silicon（M1/M2/M3/M4）兼容性：**
   - 大部分软件已原生支持 ARM64，安装时自动适配
   - 如遇不兼容的旧软件，Rosetta 2 可运行 Intel 版：`softwareupdate --install-rosetta`

2. **IntelliJ IDEA 免费获取：**
   - 学生/教师可申请免费 Ultimate 版：https://www.jetbrains.com/community/education/
   - 开源项目维护者可申请免费授权

3. **JDK 版本选择：**
   - 新项目 → JDK 21 LTS（或 17 LTS）
   - 维护旧项目 → 按项目要求装对应版本（SDKMAN 管理）

4. **环境变量配置：**
   - Apple Silicon 的 Homebrew 路径：`/opt/homebrew/bin`
   - Intel Mac 的 Homebrew 路径：`/usr/local/bin`
   - SDKMAN 自动配置 `JAVA_HOME`，一般无需手动设置

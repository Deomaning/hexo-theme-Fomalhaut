---
title: Git 提交信息规范与踩坑记录
description: 记录我在团队协作中因为 Git 提交信息不规范引发的各种问题，以及最终采用的 Conventional Commits 规范实践
date: 2026-06-17 10:00:00
updated: 2026-06-17 10:00:00
tags:
  - Git
  - 团队协作
  - 规范
categories:
  - 随手笔记
abbrlink: git-commit-pitfalls
mathjax: false
---

## 前言

说实话，我刚开始写代码的时候，Git 提交信息都是随便写的。什么 `update`、`fix bug`、`111`、`test` 之类的，反正自己看得懂就行。直到有一天...

## 坑一：回溯历史时完全看不懂

那天生产环境出了个紧急问题，需要快速定位是哪个提交引入的 Bug。我打开 Git log，看到的是这样的历史：

```bash
commit a1b2c3d
Author: anhao
Date:   2024-03-15

    update

commit b2c3d4e
Author: anhao
Date:   2024-03-14

    fix

commit c3d4e5f
Author: anhao
Date:   2024-03-13

    test
```

我当时就懵了。`update`？更新了什么？`fix`？修复了什么？`test`？测试了什么？

最后花了整整 2 个小时，逐个 checkout 到历史版本手动测试，才找到问题引入的提交。

> 如果当时提交信息写清楚，用 `git bisect` 几分钟就能定位到问题。

## 坑二：自动生成 CHANGELOG 失败

后来项目需要维护 CHANGELOG，我想着用工具自动生成。结果...

```bash
$ conventional-changelog -p angular -i CHANGELOG.md -s
# 生成的 CHANGELOG 几乎全是 "update"、"fix"，毫无价值
```

因为提交信息没有遵循任何规范，自动化工具无法识别哪些是新功能、哪些是修复、哪些是破坏性变更。

最后只能手动整理，花了大半天时间。

## 坑三：代码审查时沟通成本极高

在 Pull Request 里，审查者看到这种提交信息：

```
fix bug
```

只能留言问："具体修复了什么 Bug？有对应的 Issue 吗？"

来回沟通好几次才能搞清楚，审查效率极低。

## 解决方案：Conventional Commits

后来团队统一采用了 [Conventional Commits](https://www.conventionalcommits.org/) 规范，问题迎刃而解。

### 基本格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### type 类型

| 类型 | 含义 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(auth): 添加微信登录` |
| `fix` | 修复 Bug | `fix(api): 修复用户列表分页错误` |
| `docs` | 文档更新 | `docs(readme): 更新部署说明` |
| `style` | 代码格式（不影响功能） | `style: 统一缩进为2空格` |
| `refactor` | 重构 | `refactor(service): 优化订单查询逻辑` |
| `perf` | 性能优化 | `perf(db): 添加用户表索引` |
| `test` | 测试相关 | `test: 补充用户模块单元测试` |
| `chore` | 构建/工具相关 | `chore: 升级 Spring Boot 至 3.2` |
| `ci` | CI/CD 相关 | `ci: 添加自动化部署流程` |

### 实际示例

```bash
# 好的提交信息
feat(payment): 集成支付宝支付接口

- 添加支付宝 SDK 依赖
- 实现支付下单接口
- 添加支付回调处理
- 补充接口文档

Closes #123

# 修复类
fix(cache): 解决 Redis 缓存穿透问题

添加布隆过滤器防止缓存穿透，避免数据库压力过大。

Fixes #456
```

## 我的实践配置

### Git 提交模板

在 `~/.gitmessage` 创建模板：

```
# <type>(<scope>): <subject>
# 
# <body>
# 
# <footer>
# 
# Type 可以是:
#   feat     : 新功能
#   fix      : 修复
#   docs     : 文档
#   style    : 格式
#   refactor : 重构
#   perf     : 性能
#   test     : 测试
#   chore    : 构建/工具
```

配置 Git 使用模板：

```bash
git config --global commit.template ~/.gitmessage
```

### 提交前检查

使用 `commitlint` + `husky` 强制规范：

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli husky
```

`commitlint.config.js`：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'style', 'refactor',
      'perf', 'test', 'chore', 'ci', 'revert'
    ]],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never']
  }
};
```

### IDEA 插件推荐

如果你用 IDEA，推荐安装 **Git Commit Template** 插件，提交时自动弹出规范模板，非常方便。

## 总结

| 不规范的提交 | 规范的提交 |
|-------------|-----------|
| `update` | `feat(user): 添加用户资料编辑功能` |
| `fix bug` | `fix(api): 修复订单查询时 NPE 异常` |
| `test` | `test(service): 补充支付流程单元测试` |
| `111` | `docs: 更新 API 接口文档` |

花几秒钟写个规范的提交信息，可能帮你省下几小时的排错时间。这绝对是值得的投资。

## 参考

- [Conventional Commits 官方文档](https://www.conventionalcommits.org/)
- [Angular 提交规范](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

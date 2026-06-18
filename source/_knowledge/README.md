# Obsidian + Hexo 知识库融合方案

## 目录结构

```
_knowledge/
├── 01-Inbox/          # 收件箱 - 临时记录，每日清空
├── 02-Projects/       # 项目 - 有明确截止时间的写作
├── 03-Areas/          # 领域 - 长期维护的知识领域
├── 04-Resources/      # 资源 - 读书笔记、参考资料
├── 05-Reviews/        # 复盘 - 每日/周复盘、知识提炼
├── 99-Templates/      # 模板
└── README.md          # 本说明
```

## 工作流

### 1. 收集阶段 (01-Inbox)
- 任何想法、链接、灵感先丢到这里
- 当天或次日进行加工

### 2. 加工阶段
- 用自己的话重写
- 添加 `published: true` 或 `published: false`
- 移动到对应目录

### 3. 发布阶段
- `published: true` → 同步到博客 `_posts`
- `published: false` → 留在知识库，仅自己可见

### 4. 复盘阶段 (05-Reviews)
- 每日复盘：回顾输入，提炼新知
- 每周复盘：整理连接，发现模式
- 知识提炼：把碎片整理成永久笔记

## 发布规则

| 目录 | published | 是否发布到博客 |
|------|-----------|----------------|
| 02-Projects/文章 | true | 是 |
| 03-Areas/ | true | 是 |
| 04-Resources/ | false | 否 |
| 05-Reviews/ | false | 否 |

## 标签体系

### 知识类型
- `#article` - 可发布的文章
- `#knowledge` - 知识提炼
- `#review` - 复盘笔记
- `#resource` - 参考资料

### 领域标签
- `#技术` `#工具` `#方法论` `#读书笔记`

## 同步脚本

运行 `sync-to-blog.ps1` 将 `published: true` 的文章同步到博客：

```powershell
.\scripts\sync-to-blog.ps1
```

## 在 Obsidian 中使用

1. 打开 Obsidian
2. 将本目录作为 Vault 打开
3. 安装推荐插件（可选）

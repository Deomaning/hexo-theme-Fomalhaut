---
title: 每日AI新闻简报自动推送到微信公众号 - 完整配置笔记
description: 阿里云函数计算FC部署、微信公众号API调用、定时推送完整配置与问题排查
mathjax: true
tags:
  - AI
  - 微信公众号
  - 阿里云函数计算
  - Python
categories:
  - 随手笔记
abbrlink: ai-news-wechat
date: 2026-06-09 12:00:00
updated: 2026-06-11 12:00:00
cover: https://s2.loli.net/2024/10/22/IPoZb73rgSD9GM2.jpg
---

# 每日AI新闻简报自动推送到微信公众号 - 完整配置笔记

> 记录日期：2026-06-09
> 目标：每天早上8点自动搜索AI行业新闻，生成投资分析简报，推送到微信公众号

---

## 一、推送方式选型

### 微信推送的几种方式对比

| 方式 | 实现难度 | 稳定性 | 是否需要IP白名单 | 适用场景 |
|------|---------|--------|-----------------|---------|
| 企业微信机器人 | 简单 | 高 | 不需要 | 发送到企业微信群 |
| Server酱 | 最简单 | 中等 | 不需要 | 推送到个人微信 |
| 公众号（图文发布） | 中等 | 高 | 需要 | 发布到自己的公众号 |
| 公众号（模板消息） | 中等 | 高 | 需要 | 服务号实时推送 |

### 最终选择

- **公众号图文发布**：每天自动发布一篇图文文章到公众号
- 公众号类型确认：目前微信分为"公众号"和"服务号"两种（已取消"订阅号"分类）
- 公众号每天可群发1次，服务号每月可群发4次但支持模板消息

### 获取公众号AppID和AppSecret

1. 登录微信公众平台 https://mp.weixin.qq.com/
2. 左侧菜单 → 开发 → 基本配置
3. 获取 AppID 和 AppSecret
4. 配置IP白名单（重要，后面详述）

---

## 二、运行平台选型

### 方案对比

| 方案 | 是否需要电脑开机 | IP是否固定 | 费用 | 稳定性 |
|------|-----------------|-----------|------|--------|
| 本地Windows定时任务 | 需要 | 固定 | 免费 | 依赖电脑 |
| GitHub Actions | 不需要 | 动态IP | 免费 | 高，但IP不固定 |
| 阿里云函数计算FC | 不需要 | 动态IP（需NAT网关才有固定IP） | 有免费额度 | 高 |
| 腾讯云函数 | 不需要 | 相对固定 | 有免费额度 | 高 |
| VPS/云服务器 | 不需要 | 固定 | 每月10-20元 | 高 |

### 最终选择：阿里云函数计算FC

选择理由：免费额度足够（每月100万次调用免费），24小时运行，不需要电脑开机。

---

## 三、阿里云函数计算FC部署步骤

### 3.1 准备代码文件

需要两个文件：

- `index.py` — 主程序（函数入口为 `handler(event, context)`）
- `requirements.txt` — Python依赖

### 3.2 创建函数

1. 登录阿里云函数计算控制台 https://fcnext.console.aliyun.com/
2. 选择地域（建议华东1杭州或华东2上海）
3. 创建服务，名称如 `ai-news-service`
4. 创建函数：
   - 函数名称：`ai-news-wechat`
   - 运行环境：Python 3.9
   - 函数入口：`index.handler`
   - 内存：512MB
   - 超时时间：300秒

### 3.3 上传代码

在函数代码页签，选择在线编辑或上传ZIP包，创建 `index.py` 和 `requirements.txt`。

### 3.4 配置环境变量

在函数配置页签，添加环境变量：

| 变量名 | 值 |
|--------|-----|
| WECHAT_APPID | 你的公众号AppID |
| WECHAT_APPSECRET | 你的公众号AppSecret |

### 3.5 安装依赖

使用在线安装依赖功能，`requirements.txt` 内容为：

```text
urllib3<2.0
requests
beautifulsoup4
```

注意：`urllib3` 必须限制版本 `<2.0`，因为阿里云Python 3.9运行环境的OpenSSL版本为1.1.0，不支持urllib3 v2。

### 3.6 配置定时触发器

1. 函数详情 → 触发器管理 → 创建触发器
2. 触发器类型：定时触发器
3. CRON表达式：`CRON_TZ=Asia/Shanghai 0 0 8 * * *`（每天早上8点北京时间）

### 3.7 配置IP白名单（关键步骤）

微信公众号要求调用API的服务器IP必须在白名单中。

**阿里云函数的出口IP是动态的**，有三种处理方式：

- 方式1：先运行一次函数，从错误日志中获取当前IP，添加到微信白名单（IP可能变化）
- 方式2：配置NAT网关获取固定IP（收费，约3.6元/天，不推荐）
- 方式3：使用固定IP的代理转发请求

**实际操作**：先运行一次，从报错日志中提取IP地址，然后去微信公众平台添加到IP白名单。

### 3.8 测试运行

点击"测试函数"按钮，查看执行日志确认是否成功。

---

## 四、遇到的问题及解决方案

### 问题1：GitHub Actions IP不在微信白名单中

**错误信息**：
```json
{'errcode': 40164, 'errmsg': 'invalid ip 172.214.155.117, not in whitelist'}
```

**原因**：GitHub Actions的服务器IP是动态的，每次运行可能不同，无法预先添加到微信白名单。

**解决**：放弃GitHub Actions，改用阿里云函数计算。

### 问题2：阿里云函数缺少Python依赖

**错误信息**：
```python
ModuleNotFoundError: No module named 'bs4'
```

**原因**：阿里云函数不会自动安装 `requirements.txt` 中的依赖。

**解决**：在函数控制台使用"在线安装依赖"功能，或使用层（Layer）管理依赖。

### 问题3：requirements.txt 格式错误

**错误信息**：
```text
ERROR: Invalid requirement: 'pip install requests beautifulsoup4'
```

**原因**：`requirements.txt` 中写了完整的pip命令，但这个文件只需要写包名，每行一个。

**解决**：`requirements.txt` 正确内容：
```text
urllib3<2.0
requests
beautifulsoup4
```

### 问题4：urllib3版本不兼容

**错误信息**：
```python
ImportError: urllib3 v2 only supports OpenSSL 1.1.1+, currently the 'ssl' module is compiled with 'OpenSSL 1.1.0'
```

**原因**：阿里云Python 3.9运行环境的OpenSSL版本为1.1.0，不支持urllib3 v2.x。

**解决**：在 `requirements.txt` 中限制版本：`urllib3<2.0`

### 问题5：创建草稿报错 invalid media_id

**错误信息**：
```json
{'errcode': 40007, 'errmsg': 'invalid media_id'}
```

**原因**：微信公众号创建草稿时，`thumb_media_id`（封面图）虽然官方文档标注为非必填，但实际上是**必填的**。传空字符串或缺失都会报40007错误。

**解决**：在创建草稿之前，先上传一张封面图片到微信素材库，获取有效的 `media_id`，再传入 `thumb_media_id` 字段。

上传封面图的API：
```text
POST https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=ACCESS_TOKEN&type=image
```

可以使用网络图片URL下载后上传，例如：
```python
def upload_thumb_image(self, image_url):
    access_token = self.get_access_token()
    url = f"https://api.weixin.qq.com/cgi-bin/material/add_material?access_token={access_token}&type=image"
    img_response = requests.get(image_url, timeout=15)
    files = {"media": ("cover.jpg", img_response.content, "image/jpeg")}
    response = requests.post(url, files=files, timeout=15)
    data = response.json()
    return data.get("media_id")
```

### 问题6：NAT网关费用过高

阿里云NAT网关按小时收费（约0.15元/小时），即使每天只用1分钟也要收24小时费用，约3.6元/天、108元/月。

**解决**：不使用NAT网关，改为每次运行后从日志获取当前IP，手动更新微信白名单（IP变化不频繁时可行）。

---

## 五、核心代码结构

### 函数入口

```python
def handler(event, context):
    # 阿里云函数计算入口
    # 1. 初始化微信API
    # 2. 搜索AI新闻
    # 3. 分析投资价值
    # 4. 上传封面图
    # 5. 创建草稿
    # 6. 发布图文
```

### 新闻搜索

从百度新闻搜索以下关键词的最新资讯：
- AI人工智能、大模型LLM、AIGC、算力芯片GPU、自动驾驶、人形机器人、OpenAI、英伟达NVIDIA

### 投资分析规则

根据新闻中的关键词自动匹配投资视角：
- 融资 → 资本动向
- 财报 → 业绩表现
- 政策 → 政策影响
- 芯片/GPU/算力 → 关注算力基础设施产业链
- 自动驾驶 → 关注激光雷达、域控制器
- 机器人 → 关注减速器、电机、传感器
- 大模型 → 关注AI应用落地

---

## 六、微信公众号API要点

### 获取access_token

```text
GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```

### 上传永久素材（封面图）

```text
POST https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=TOKEN&type=image
```

### 创建草稿

```text
POST https://api.weixin.qq.com/cgi-bin/draft/add?access_token=TOKEN
```

请求体：
```json
{
  "articles": [{
    "title": "标题",
    "author": "作者",
    "digest": "摘要",
    "content": "HTML正文",
    "content_source_url": "",
    "thumb_media_id": "必填，封面图media_id",
    "need_open_comment": 0,
    "only_fans_can_comment": 0
  }]
}
```

### 发布草稿

```text
POST https://api.weixin.qq.com/cgi-bin/freepublish/submit?access_token=TOKEN
```

请求体：
```json
{
  "media_id": "草稿的media_id"
}
```

---

## 七、CRON表达式参考

| 执行时间 | CRON表达式 |
|---------|-----------|
| 每天早上8点（北京时间） | `CRON_TZ=Asia/Shanghai 0 0 8 * * *` |
| 每天晚上8点（北京时间） | `CRON_TZ=Asia/Shanghai 0 0 20 * * *` |
| 每周一早上8点 | `CRON_TZ=Asia/Shanghai 0 0 8 * * 1` |
| 每天中午12点 | `CRON_TZ=Asia/Shanghai 0 0 12 * * *` |

注意：阿里云函数的CRON默认使用UTC时间，需要通过 `CRON_TZ` 指定时区。

---

## 八、费用估算

| 项目 | 费用 |
|------|------|
| 阿里云函数计算 | 每月100万次调用免费，400,000GB-秒免费 |
| NAT网关（不推荐） | 约108元/月 |
| 本地运行 | 免费 |
| Server酱 | 免费（有次数限制） |

每天执行一次的场景下，阿里云函数计算完全在免费额度内。

最后的结果就是，如果不使用Server酱这个方案，那就必须得有一个VPS去固定IP，否则是不能推送到微信的。**微信的API调用必须指定白名单**，如果IP老是变那就不能使用这个方案，导致**需要付费**购买NAT网关或者去购买VPS固定公网IP。

用到的文件都存在在这个压缩包中了
![AI新闻简报代码包](/assets/ai-newstoday.zip)

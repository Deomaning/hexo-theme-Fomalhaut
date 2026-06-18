---
title: el-transfer穿梭框
description: 记录一下el-transfer拖拽
mathjax: false
tags:
  - "#el-transfer"
categories:
  - 随手笔记
abbrlink: "20250729"
sticky: 2
swiper_index: 2
date: 2025-07-29 15:22
updated: 2025-07-29  15:22
cover: "https://s2.loli.net/2024/10/09/vZ8SYVMfBb9pnwT.webp"
---

## 前言

前因：由于前端的组件以前实现拖拽是用 **el-tree-transfer** 这个第三方组件去实现的，但是项目中发现已经使用了 **el-transfer** 组件，但是该组件本身不支持拖拽功能，又不想改动后台和大量改动，所以想使用 **sortablejs** 这个组件去实现这个拖拽功能！

## 实现步骤

1. 项目中缺少 **sortablejs** 这个组件，需要先下载该组件到 node_modules 中。
2. 由于项目使用的 Vue 版本是 2.5.2，所以考虑兼容性选择 **sortablejs** 1.14.0 版本：

   ```bash
   npm install sortablejs@1.14.0
   ```

3. 在页面中添加：

   ```javascript
   import Sortable from 'sortablejs'
   ```

4. 在 `mounted() {}` 钩子中加入一个函数，==以此来保证 el-transfer 组件正确加载之后再去执行这个函数==。

## 核心代码

```javascript
this.$nextTick(() => {
  const el = this.$refs.transfer.$el;
  const rightPanel = el.querySelectorAll('.el-transfer-panel')[1];
  const list = rightPanel.querySelector('.el-transfer-panel__list');
  new Sortable(list, {
    handle: '.drag-handle',
    animation: 150,
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;
      const item = this.value.splice(oldIndex, 1)[0];
      this.value.splice(newIndex, 0, item);
    }
  });
});
```

## 注意事项

==如果执行之后报错找不到 list 这个对象，那可能你项目是嵌套组件这么用的，那你得把这一步放到获取 el-transfer 数据之后再去获取 list 对象==

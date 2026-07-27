CSS Grid 是前端布局的一把瑞士军刀。本文通过实际案例，带你从零掌握 Grid 布局的核心概念和进阶技巧。

## 为什么是 Grid

在 Grid 出现之前，我们用过浮动、定位、Flexbox。每一种都有自己的适用场景，但面对二维布局（行和列同时控制）时总是有些力不从心。

Grid 的出现完美解决了这个问题。

## 核心概念

### 网格容器与网格项

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: 16px;
}
```

### fr 单位

`fr` 是 Grid 特有的弹性单位，代表剩余空间的一份：

```css
/* 三列，1:2:1 的比例 */
grid-template-columns: 1fr 2fr 1fr;

/* 固定 + 弹性结合 */
grid-template-columns: 200px 1fr 200px;
```

## 实战案例

### 1. 响应式卡片网格

不需要媒体查询的自动响应式布局：

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
```

`auto-fill` + `minmax` 的组合是 Grid 中最强大的响应式方案之一。它会自动填充尽可能多的列，每列最小 280px，最大 1fr（弹性拉伸）。

### 2. 经典圣杯布局

```css
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav    main   aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

### 3. 杂志风格封面

利用 `grid-column` 和 `grid-row` 创建不对称的视觉布局：

```css
.cover {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 200px);
  gap: 8px;
}

.featured {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}
```

## 性能建议

- Grid 布局的渲染性能一般优于 JavaScript 实现的手动布局
- 避免嵌套过深的 Grid 容器（通常不超过 3 层）
- 使用 `gap` 代替 `margin` 来创建间距，更简洁高效

## 总结

CSS Grid 是现代前端开发的必备技能。掌握它之后，你会发现很多以前需要 JavaScript 才能实现的复杂布局，现在几行 CSS 就能搞定。

> 推荐学习资源：
> - [CSS Grid Garden](https://cssgridgarden.com/) —— 玩游戏学 Grid
> - [MDN CSS Grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout) —— 官方文档

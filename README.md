# 🪲 虫巢 - 个人博客

一个简洁、优雅的个人博客，可直接部署在 **GitHub Pages** 上。

## ✨ 特性

- 📝 **首页展示**：文章标题列表 + 内容摘要
- 📖 **文章详情**：完整的 Markdown 渲染阅读体验
- 🌓 **深色模式**：跟随系统主题自动切换
- 📱 **响应式设计**：桌面端和移动端完美适配
- ⚡ **纯静态**：无需后端，前端动态渲染
- 🔍 **SEO 友好**：支持 Open Graph 协议

## 🗂️ 项目结构

```
blog/
├── index.html          # 首页
├── post.html           # 文章详情页
├── about.html          # 关于页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── main.js         # 首页逻辑
│   └── post.js         # 文章详情逻辑
├── data/
│   └── posts.json      # 文章数据
└── README.md
```

## 🚀 部署到 GitHub Pages

### 方式一：直接推送（推荐）

1. **创建 GitHub 仓库**

   在 GitHub 上新建一个公开仓库，例如 `username/username.github.io`（这是 GitHub Pages 的用户/组织站点），或者一个普通仓库如 `my-blog`。

2. **初始化并推送代码**

   ```bash
   # 在项目根目录执行
   git init
   git add .
   git commit -m "初始化虫巢博客"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**

   - 进入仓库的 **Settings** → **Pages**
   - 在 **Branch** 中选择 `main` 分支，根目录 (`/`)
   - 点击 **Save**
   - 等待几分钟，你的博客就会出现在 `https://你的用户名.github.io/仓库名/`

### 方式二：使用 GitHub Actions（自动部署）

在项目根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
```

### 访问地址

- 如果是 `username.github.io` 仓库：`https://username.github.io`
- 如果是普通仓库 `my-blog`：`https://username.github.io/my-blog/`

> ⚠️ **注意**：如果部署在子路径（如 `username.github.io/my-blog/`），需要修改 HTML 中引用的资源路径为相对路径。本项目已全部使用相对路径，开箱即用。

## ✏️ 如何添加新文章

1. 打开 `data/posts.json`
2. 在数组中添加一个新对象，格式如下：

```json
{
  "id": "article-url-slug",
  "title": "文章标题",
  "date": "2026-07-27",
  "tags": ["标签1", "标签2"],
  "coverDescription": "封面图描述",
  "excerpt": "文章摘要，显示在首页卡片上",
  "content": [
    "第一段文字",
    "## 二级标题",
    "更多段落...",
    "支持 **加粗**、*斜体*、`代码` 等 Markdown 语法"
  ]
}
```

3. 提交并推送，GitHub Pages 会自动更新

### 支持的 Markdown 语法

- **标题**：`#` ~ `###`
- **文本样式**：`**加粗**`、`*斜体*`、`~~删除线~~`、`` `代码` ``
- **链接**：`[文字](url)`
- **代码块**：` ``` ` 包裹
- **引用**：`> ` 开头
- **列表**：无序 `- `、有序 `1. `
- **表格**：`| 列1 | 列2 |`
- **任务列表**：`- [ ]` / `- [x]`
- **分割线**：`---`

## 🛠️ 本地预览

直接用浏览器打开 `index.html` 即可本地预览。由于使用了 `fetch` 加载 JSON 数据，建议使用 **Live Server** 或 **Python HTTP 服务器** 来获得完整体验：

```bash
# Python 3
python -m http.server 8000

# 或者使用 VS Code 的 Live Server 扩展
```

## 📄 许可证

MIT License

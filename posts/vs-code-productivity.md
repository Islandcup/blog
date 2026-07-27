VS Code 已经成为最流行的代码编辑器之一。今天分享一下我的 VS Code 配置，包括主题、字体、扩展和快捷键，希望能帮你提升开发效率。

## 主题与外观

一个好的主题不仅能保护眼睛，还能提升 coding 的心情。

```json
{
  "workbench.colorTheme": "One Dark Pro",
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', Consolas, monospace",
  "editor.fontSize": 14,
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6
}
```

**推荐主题：**
- **One Dark Pro** —— 经典耐看
- **Catppuccin** —— 柔和护眼
- **Night Owl** —— 对比度高

## 必备扩展

### 开发辅助

| 扩展 | 用途 |
|------|------|
| **GitLens** | Git 历史可视化 |
| **Error Lens** | 行内错误提示 |
| **Live Share** | 实时协作编辑 |
| **Prettier** | 代码格式化 |

### 语言支持

- **Python** (ms-python.python) —— Python 全功能支持
- **ESLint** —— JavaScript/TypeScript 代码检查
- **Tailwind CSS IntelliSense** —— Tailwind 智能提示

### 效率工具

- **GitHub Copilot** —— AI 编程助手，强烈推荐
- **Path Intellisense** —— 路径自动补全
- **Todo Tree** —— 管理代码中的 TODO 注释

## 快捷键速查

```
Ctrl+P          —— 快速打开文件
Ctrl+Shift+P    —— 命令面板
Ctrl+D          —— 选中下一个相同词
Ctrl+Shift+L    —— 选中所有相同词
Alt+↑/↓         —— 移动当前行
Ctrl+Shift+K    —— 删除当前行
Ctrl+/          —— 注释/取消注释
```

掌握这些快捷键，你的编码速度至少提升 30%。

## 自定义片段 (Snippets)

自定义代码片段可以帮你避免重复劳动：

```json
{
  "React Component": {
    "scope": "javascript,typescript",
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "const $1 = () => {",
      "  return <div>$2</div>;",
      "};",
      "",
      "export default $1;"
    ],
    "description": "React Functional Component"
  }
}
```

## 小贴士

1. 善用 `Ctrl+Shift+P` 打开命令面板，几乎所有操作都可以在这里完成
2. 使用 `settings.json` 同步配置（Settings Sync 扩展）
3. 经常更新 VS Code 和扩展，新功能往往能带来惊喜

希望这些配置对你有帮助！如果你有更好的推荐，欢迎分享。

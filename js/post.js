// ==========================================
// 虫巢 - 文章详情页 JavaScript
// ==========================================

// ---- 简单的 Markdown 渲染器 ----
// 将 Markdown 文本转换为 HTML
function renderMarkdown(text) {
  if (!text) return '';

  // 统一换行符（处理 Windows 的 \r\n）
  let html = text.replace(/\r\n/g, '\n');

  // 代码块 (先处理，避免被后续规则污染)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const langClass = lang ? ` class="language-${lang}"` : '';
    return `<pre><code${langClass}>${escapeHtml(code.trim())}</code></pre>`;
  });

  // 行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 加粗和斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // 删除线
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // 图片
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

  // 链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // 任务列表
  html = html.replace(/^- \[x\] /gim, '<li class="task-done"><input type="checkbox" checked disabled> ');
  html = html.replace(/^- \[ \] /gim, '<li class="task-todo"><input type="checkbox" disabled> ');

  // 无序列表
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  // 有序列表
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // 表格 - 处理完整的 Markdown 表格块
  html = html.replace(/(^\|.+\|\n?)+/gm, (match) => {
    const rows = match.trim().split('\n').filter(r => r.trim());
    if (rows.length < 2) return match; // 至少需要表头和分隔行

    // 解析分隔行获取列对齐方式
    const alignments = rows[1].split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(c => {
      const t = c.trim();
      if (t.startsWith(':') && t.endsWith(':')) return 'center';
      if (t.endsWith(':')) return 'right';
      return 'left';
    });

    let tableHtml = '<table>\n  <thead>\n    <tr>';
    // 表头行
    const headerCells = rows[0].split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1).map(c => c.trim());
    tableHtml += headerCells.map((c, i) => {
      const align = alignments[i] && alignments[i] !== 'left' ? ` style="text-align:${alignments[i]}"` : '';
      return `<th${align}>${c}</th>`;
    }).join('');
    tableHtml += '</tr>\n  </thead>\n  <tbody>\n';

    // 数据行（从第3行开始，跳过分隔行）
    for (let i = 2; i < rows.length; i++) {
      const cells = rows[i].split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim());
      tableHtml += '    <tr>';
      tableHtml += cells.map((c, j) => {
        const align = alignments[j] && alignments[j] !== 'left' ? ` style="text-align:${alignments[j]}"` : '';
        return `<td${align}>${c}</td>`;
      }).join('');
      tableHtml += '</tr>\n';
    }

    tableHtml += '  </tbody>\n</table>';
    return tableHtml;
  });

  // 引用
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // 标题
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // 水平线
  html = html.replace(/^---$/gm, '<hr>');

  // 段落 (剩下的文本块)
  const lines = html.split('\n');
  let result = '';
  let inList = false;
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('<li>') || line.startsWith('<tr>')) {
      inList = true;
      result += line + '\n';
      continue;
    }

    if (inList && (line.startsWith('<li>') || line.startsWith('<tr>'))) {
      result += line + '\n';
      continue;
    }

    if (inList) {
      if (line.startsWith('<table>')) {
        // Previous list was actually a table opening, keep going
        inList = false;
        inTable = true;
        result += line + '\n';
        continue;
      }
      if (result.trimEnd().endsWith('<li>') || result.trimEnd().endsWith('</tr>')) {
        // Close the list/table
        if (result.includes('<li>') && !result.includes('<ul>')) {
          result = result.replace(/^<li>/gm, '<ul><li>');
          result = result.replace(/<\/li>(\n?)$/m, '</li></ul>');
        }
        if (result.includes('<tr>') && !result.includes('<table>')) {
          // This shouldn't happen since we check <table> above
        }
      }
      inList = false;
    }

    if (line.startsWith('<table>')) {
      inTable = true;
      result += line + '\n';
      continue;
    }

    if (inTable && line.includes('</table>')) {
      result += line + '\n';
      inTable = false;
      continue;
    }

    if (inTable) {
      result += line + '\n';
      continue;
    }

    // 空行跳过
    if (!line.trim()) {
      result += '\n';
      continue;
    }

    // 已经是 HTML 标签开头的行直接保留
    if (line.trim().startsWith('<')) {
      result += line + '\n';
      continue;
    }

    // 否则作为段落
    result += `<p>${line}</p>\n`;
  }

  return result.trim();
}

// ---- HTML 转义 ----
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---- 获取 URL 参数 ----
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ---- 加载文章 ----
async function loadPost() {
  const postId = getUrlParam('id');

  if (!postId) {
    showError('未指定文章 ID');
    return;
  }

  try {
    // 加载元数据
    const metaResp = await fetch('data/posts.json');
    if (!metaResp.ok) throw new Error('Failed to load posts metadata');
    const posts = await metaResp.json();
    const post = posts.find(p => p.id === postId);
    if (!post) {
      showError('文章不存在');
      return;
    }

    // 加载 .md 文件内容
    const mdResp = await fetch(`posts/${postId}.md`);
    if (!mdResp.ok) throw new Error('Failed to load article content');
    post.mdContent = await mdResp.text();

    renderPost(post, posts);
  } catch (error) {
    console.error('加载文章失败:', error);
    showError('加载文章失败，请稍后重试。');
  }
}

// ---- 渲染文章 ----
function renderPost(post, allPosts) {
  // 更新页面标题和 SEO
  document.title = `${post.title} - 虫巢`;
  document.getElementById('ogTitle').setAttribute('content', post.title);
  document.getElementById('ogDescription').setAttribute('content', post.excerpt || '');

  // 隐藏加载状态
  const loadingEl = document.getElementById('postLoading');
  if (loadingEl) loadingEl.style.display = 'none';

  // 显示文章头部
  const headerEl = document.getElementById('postHeader');
  if (headerEl) headerEl.style.display = 'block';

  // 文章标题
  const titleEl = document.getElementById('postTitle');
  if (titleEl) titleEl.textContent = post.title;

  // 文章元信息
  const metaEl = document.getElementById('postMeta');
  if (metaEl) {
    const readTime = estimateReadTime(post.mdContent);
    metaEl.innerHTML = `
      <span class="meta-item">📅 ${formatDate(post.date)}</span>
      <span class="dot"></span>
      <span class="meta-item">📖 ${readTime} 分钟阅读</span>
    `;
  }

  // 文章内容（直接渲染 .md 全文）
  const contentEl = document.getElementById('postContent');
  if (contentEl) {
    contentEl.innerHTML = renderMarkdown(post.mdContent);
  }

  // 文章标签
  const tagsEl = document.getElementById('postTags');
  if (tagsEl && post.tags && post.tags.length > 0) {
    const tagsHtml = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    tagsEl.innerHTML = `<span class="tag-label">🏷️ 标签：</span>${tagsHtml}`;
  }

  // 上下篇文章导航
  const currentIndex = allPosts.findIndex(p => p.id === post.id);

  // 文章按日期降序排列，index-1 为更新的文章，index+1 为更早的文章
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const prevEl = document.getElementById('prevPost');
  const nextEl = document.getElementById('nextPost');
  const prevTitle = document.getElementById('prevTitle');
  const nextTitle = document.getElementById('nextTitle');

  if (olderPost && prevEl) {
    prevEl.style.display = 'block';
    prevEl.href = `post.html?id=${olderPost.id}`;
    if (prevTitle) prevTitle.textContent = olderPost.title;
  } else if (prevEl) {
    prevEl.style.display = 'none';
  }

  if (newerPost && nextEl) {
    nextEl.style.display = 'block';
    nextEl.href = `post.html?id=${newerPost.id}`;
    if (nextTitle) nextTitle.textContent = newerPost.title;
  } else if (nextEl) {
    nextEl.style.display = 'none';
  }

  // 显示文章底部
  const footerEl = document.getElementById('postFooter');
  if (footerEl) footerEl.style.display = 'block';

  // 页面滚动到顶部
  window.scrollTo(0, 0);
}

// ---- 估计阅读时间 ----
function estimateReadTime(markdownText) {
  if (!markdownText) return 1;
  // 中文字数 / 300 ≈ 分钟，英文词数 / 200 ≈ 分钟
  const chineseChars = (markdownText.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = (markdownText.match(/[a-zA-Z]+/g) || []).length;
  const minutes = Math.ceil(chineseChars / 300 + englishWords / 200);
  return Math.max(1, minutes);
}

// ---- 错误显示 ----
function showError(message) {
  const loadingEl = document.getElementById('postLoading');
  if (loadingEl) {
    loadingEl.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">😢</div>
        <h3>${message}</h3>
        <p><a href="index.html">返回首页</a></p>
      </div>
    `;
  }
}

// ---- 启动 ----
document.addEventListener('DOMContentLoaded', loadPost);

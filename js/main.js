// ==========================================
// 虫巢 - 首页 JavaScript
// ==========================================

// ---- 移动端菜单切换 ----
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // 点击导航链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
});

// ---- 格式化日期 ----
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year} 年 ${month} 月 ${day} 日`;
}

// ---- 将 Markdown 风格文本转换为 HTML ----
function renderExcerpt(text) {
  if (!text) return '';
  // 只做基本的处理：保留段落
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

// ---- 创建文章卡片 ----
function createPostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card fade-in';
  card.style.animationDelay = '0ms';

  const tagsHtml = post.tags && post.tags.length > 0
    ? post.tags.map(tag => `<span class="post-card-tag">${tag}</span>`).join('')
    : '';

  card.innerHTML = `
    <div class="post-card-meta">
      <span class="post-card-date">📅 ${formatDate(post.date)}</span>
      ${tagsHtml}
    </div>
    <h2 class="post-card-title">${post.title}</h2>
    <p class="post-card-excerpt">${renderExcerpt(post.excerpt)}</p>
    <div class="post-card-footer">
      <span class="read-more">
        阅读全文 <span class="arrow">→</span>
      </span>
    </div>
  `;

  // 点击跳转到文章详情
  card.addEventListener('click', () => {
    window.location.href = `post.html?id=${post.id}`;
  });

  // 允许通过键盘访问
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `post.html?id=${post.id}`;
    }
  });

  return card;
}

// ---- 加载文章列表 ----
async function loadPosts() {
  const postsList = document.getElementById('postsList');
  const postCount = document.getElementById('postCount');

  if (!postsList) return;

  try {
    const response = await fetch('data/posts.json');
    if (!response.ok) throw new Error('Failed to load posts');

    const posts = await response.json();

    // 按日期倒序排列（最新的在前）
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 更新文章数量
    if (postCount) {
      postCount.textContent = `共 ${posts.length} 篇`;
    }

    // 清空骨架屏
    postsList.innerHTML = '';

    if (posts.length === 0) {
      postsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>还没有文章</h3>
          <p>作者正在努力写作中，敬请期待...</p>
        </div>
      `;
      return;
    }

    // 渲染文章卡片（带交错过场动画）
    posts.forEach((post, index) => {
      const card = createPostCard(post);
      card.style.animationDelay = `${index * 100}ms`;
      postsList.appendChild(card);
    });
  } catch (error) {
    console.error('加载文章失败:', error);
    postsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">😢</div>
        <h3>加载失败</h3>
        <p>无法加载文章列表，请稍后重试。</p>
      </div>
    `;
  }
}

// ---- 启动 ----
document.addEventListener('DOMContentLoaded', loadPosts);

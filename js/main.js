// ==========================================
// 虫巢 - 首页 JavaScript
// ==========================================

let allPosts = [];
let activeCategory = 'all';

// ---- 将摘要中的 Markdown 转换为 HTML ----
function renderExcerpt(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

// ---- 创建文章卡片 ----
function createPostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card fade-in';
  card.dataset.category = post.tags.join(' ');

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

  card.addEventListener('click', () => {
    window.location.href = `post.html?id=${post.id}`;
  });

  card.addEventListener('auxclick', (e) => {
    if (e.button === 1) {
      e.preventDefault();
      window.open(`post.html?id=${post.id}`, '_blank');
    }
  });

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

// ---- 提取所有分类标签 ----
function extractCategories(posts) {
  const categorySet = new Set();
  posts.forEach(post => {
    post.tags.forEach(tag => categorySet.add(tag));
  });
  return Array.from(categorySet).sort();
}

// ---- 渲染分类按钮 ----
function renderCategories(posts) {
  const container = document.getElementById('categoriesList');
  if (!container) return;

  // 为已有的"全部"按钮绑定点击事件
  const allBtn = container.querySelector('[data-category="all"]');
  if (allBtn) {
    allBtn.addEventListener('click', () => {
      filterByCategory('all');
    });
  }

  const categories = extractCategories(posts);
  const categoryIcons = {
    '技术': '💻',
    '前端': '🎨',
    '工具': '🛠️',
    '效率': '⚡',
    '读书': '📚',
    '生活': '🌿',
    '站点日志': '📌',
    '杂谈': '💭',
    '设定': '📖'
  };

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.dataset.category = cat;
    const icon = categoryIcons[cat] || '📂';
    btn.innerHTML = `${icon} ${cat}`;
    btn.addEventListener('click', () => {
      filterByCategory(cat);
    });
    container.appendChild(btn);
  });
}

// ---- 按分类筛选 ----
function filterByCategory(category) {
  activeCategory = category;

  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  window.location.hash = category === 'all' ? '' : category;

  const sectionTitle = document.getElementById('sectionTitle');
  if (sectionTitle) {
    sectionTitle.textContent = category === 'all' ? '最新文章' : `分类：${category}`;
  }

  const filtered = category === 'all'
    ? allPosts
    : allPosts.filter(post => post.tags.includes(category));

  renderPostList(filtered);
}

// ---- 渲染文章列表 ----
function renderPostList(posts) {
  const postList = document.getElementById('postsList');
  const postCount = document.getElementById('postCount');
  if (!postList) return;

  postList.innerHTML = '';

  if (postCount) {
    postCount.textContent = `共 ${posts.length} 篇`;
  }

  if (posts.length === 0) {
    postList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>该分类暂无文章</h3>
        <p>换个分类看看吧</p>
      </div>
    `;
    return;
  }

  posts.forEach((post, index) => {
    const card = createPostCard(post);
    card.style.animationDelay = `${index * 100}ms`;
    postList.appendChild(card);
  });
}

// ---- 加载文章列表 ----
async function loadPosts() {
  const postsList = document.getElementById('postsList');
  if (!postsList) return;

  try {
    const response = await fetch('data/posts.json');
    if (!response.ok) throw new Error('Failed to load posts');

    allPosts = await response.json();

    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderCategories(allPosts);
    renderPostList(allPosts);

    // 从 URL Hash 恢复分类筛选状态
    const hash = window.location.hash.slice(1);
    if (hash) {
      const allCats = extractCategories(allPosts);
      if (allCats.includes(hash)) {
        filterByCategory(hash);
      }
    }
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

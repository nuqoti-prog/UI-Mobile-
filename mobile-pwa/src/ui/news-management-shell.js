import { createEditor } from './editor-shell.js';

const MOCK_TECHNICIANS = {
  username: 'kthuatvien',
  password: '123456',
  name: 'Kỹ thuật viên CMS'
};

const MOCK_ARTICLES = [
  {
    id: 'TIN-001',
    title: 'Nâng cấp hạ tầng số tại phường Mỹ Bình',
    summary: 'Hệ thống một cửa số hóa giúp xử lý hồ sơ nhanh hơn cho người dân.',
    chapeau: 'Dự án ưu tiên nâng chất lượng phục vụ hành chính công.',
    status: 'Chờ duyệt',
    author: 'Ban biên tập',
    updatedAt: '2026-04-12 09:20',
    category: 'Thời sự',
    subCategory: 'Chuyển đổi số',
    province: 'An Giang',
    keywords: ['chuyển đổi số', 'mỹ bình', 'hạ tầng'],
    podcastUrl: 'https://example.com/podcast/tin-001.mp3',
    avatarUrl: 'https://picsum.photos/seed/tin-001/320/220',
    avatarCaption: 'Cán bộ tiếp nhận hồ sơ tại bộ phận một cửa phường Mỹ Bình.',
    content:
      '<p>Phường Mỹ Bình triển khai hạ tầng số mới để hỗ trợ xử lý hồ sơ nhanh.</p><figure class="image"><img src="https://picsum.photos/seed/mybinh-content/640/360" alt="Mỹ Bình"><figcaption>Hệ thống máy chủ mới giúp đồng bộ dữ liệu hồ sơ.</figcaption></figure><p>Người dân có thể theo dõi trạng thái xử lý qua ứng dụng công trực tuyến.</p>'
  },
  {
    id: 'TIN-002',
    title: 'Khởi động chiến dịch du lịch hè An Giang',
    summary: 'Nhiều hoạt động trải nghiệm sẽ diễn ra từ tháng 5.',
    chapeau: 'Các khu, điểm du lịch chuẩn bị sản phẩm mới cho mùa cao điểm.',
    status: 'Đang biên tập',
    author: 'Phòng nội dung',
    updatedAt: '2026-04-11 14:45',
    category: 'Du lịch',
    subCategory: 'Sự kiện',
    province: 'An Giang',
    keywords: ['du lịch hè', 'an giang'],
    podcastUrl: '',
    avatarUrl: 'https://picsum.photos/seed/tin-002/320/220',
    avatarCaption: 'Du khách trải nghiệm tuyến tham quan sinh thái mùa hè.',
    content:
      '<p>Chiến dịch du lịch hè tập trung quảng bá các điểm đến sinh thái và văn hóa.</p>'
  }
];

export function createNewsManagementApp(root) {
  const appState = {
    currentScreen: 'login',
    selectedArticleId: null,
    previewDraft: null,
    isLoggedIn: false,
    technicianName: '',
    articles: structuredClone(MOCK_ARTICLES)
  };

  function render() {
    if (appState.currentScreen === 'editor') {
      renderEditorScreen();
      return;
    }

    root.innerHTML = `
      <main class="mobile-shell">
        <header class="topbar">
          <h1>Quản lý tin kỹ thuật viên</h1>
          ${
            appState.isLoggedIn
              ? `<button class="btn btn-outline" id="logoutBtn">Đăng xuất</button>`
              : ''
          }
        </header>
        <section class="panel" id="screenContainer"></section>
      </main>
    `;

    const screenContainer = root.querySelector('#screenContainer');

    if (appState.currentScreen === 'login') {
      screenContainer.innerHTML = loginTemplate();
      attachLoginEvents();
    } else if (appState.currentScreen === 'list') {
      screenContainer.innerHTML = listTemplate();
      attachListEvents();
    } else if (appState.currentScreen === 'detail') {
      screenContainer.innerHTML = detailTemplate();
      attachDetailEvents();
    } else if (appState.currentScreen === 'preview') {
      screenContainer.innerHTML = previewTemplate();
      attachPreviewEvents();
    }

    root.querySelector('#logoutBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'login';
      appState.isLoggedIn = false;
      appState.selectedArticleId = null;
      appState.previewDraft = null;
      appState.technicianName = '';
      render();
    });
  }

  function renderEditorScreen() {
    root.innerHTML = `
      <main class="mobile-shell">
        <header class="topbar">
          <h1>Sửa tin</h1>
          <button class="btn btn-outline" id="backToDetailBtn">Về chi tiết tin</button>
        </header>
        <section class="panel" id="editorHost"></section>
      </main>
    `;

    const article = getSelectedArticle();
    const editorHost = root.querySelector('#editorHost');
    createEditor(editorHost, {
      article,
      onSave: (draft) => {
        saveArticleDraft(draft);
        appState.currentScreen = 'detail';
        render();
      },
      onPreview: (draft) => {
        appState.previewDraft = draft;
        appState.currentScreen = 'preview';
        render();
      },
      onBack: () => {
        appState.currentScreen = 'detail';
        render();
      }
    });

    root.querySelector('#backToDetailBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'detail';
      render();
    });
  }

  function loginTemplate() {
    return `
      <h2>Đăng nhập kỹ thuật viên</h2>
      <p class="muted">Dùng mock data để demo luồng quản lý tin trên mobile.</p>
      <form id="loginForm" class="stack-md">
        <label class="stack-xs">
          <span>Tài khoản</span>
          <input class="input" name="username" value="${MOCK_TECHNICIANS.username}" />
        </label>
        <label class="stack-xs">
          <span>Mật khẩu</span>
          <input class="input" type="password" name="password" value="${MOCK_TECHNICIANS.password}" />
        </label>
        <button class="btn btn-primary btn-lg" type="submit">Đăng nhập</button>
        <small class="muted" id="loginHint"></small>
      </form>
    `;
  }

  function listTemplate() {
    const cards = appState.articles
      .map(
        (article) => `
      <article class="card article-card" data-id="${article.id}">
        <div class="card-head">
          <h3>${article.title}</h3>
          <span class="badge">${article.status}</span>
        </div>
        <p>${article.summary}</p>
        <div class="card-foot">
          <small class="muted">${article.updatedAt}</small>
          <button class="btn btn-primary btn-lg" data-open-detail="${article.id}">Xem chi tiết</button>
        </div>
      </article>`
      )
      .join('');

    return `
      <h2>Danh sách tin</h2>
      <p class="muted">Xin chào ${appState.technicianName}. Chọn một tin để thao tác.</p>
      <div class="stack-md">${cards}</div>
    `;
  }

  function detailTemplate() {
    const article = getSelectedArticle();

    if (!article) {
      return `
        <h2>Không tìm thấy tin</h2>
        <button class="btn btn-primary btn-lg" id="backToListBtn">Về danh sách</button>
      `;
    }

    return `
      <h2>Chi tiết tin</h2>
      <article class="card stack-sm">
        <h3>${article.title}</h3>
        <p><strong>Mã tin:</strong> ${article.id}</p>
        <p><strong>Tác giả:</strong> ${article.author}</p>
        <p><strong>Trạng thái:</strong> ${article.status}</p>
        <p><strong>Cập nhật:</strong> ${article.updatedAt}</p>
        <p><strong>Chuyên mục:</strong> ${article.category} / ${article.subCategory}</p>
        <p><strong>Tỉnh:</strong> ${article.province}</p>
        <p><strong>Từ khóa:</strong> ${article.keywords.join(', ')}</p>
        <p>${article.summary}</p>
      </article>
      <div class="toolbar-row toolbar-actions">
        <button class="btn btn-outline btn-lg" id="backToListBtn">Về danh sách tin</button>
        <button class="btn btn-primary btn-lg" id="openEditorBtn">Sửa tin</button>
      </div>
    `;
  }

  function previewTemplate() {
    const draft = appState.previewDraft;
    if (!draft) {
      return `
        <h2>Chưa có dữ liệu xem trước</h2>
        <button class="btn btn-primary btn-lg" id="backToEditorBtn">Về màn sửa tin</button>
      `;
    }

    return `
      <h2>Xem trước tin</h2>
      <article class="card stack-sm">
        <h3>${draft.title}</h3>
        <p class="muted">${draft.chapeau}</p>
        <img class="preview-image" src="${draft.avatarUrl}" alt="${draft.title}" />
        <p class="muted">${draft.avatarCaption}</p>
        <p>${draft.summary}</p>
        <div class="preview-content">${draft.content}</div>
      </article>
      <div class="toolbar-row toolbar-actions">
        <button class="btn btn-outline btn-lg" id="backToEditorBtn">Quay lại sửa</button>
      </div>
    `;
  }

  function attachLoginEvents() {
    root.querySelector('#loginForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const username = form.get('username');
      const password = form.get('password');
      const hint = root.querySelector('#loginHint');

      if (username === MOCK_TECHNICIANS.username && password === MOCK_TECHNICIANS.password) {
        appState.currentScreen = 'list';
        appState.isLoggedIn = true;
        appState.technicianName = MOCK_TECHNICIANS.name;
        render();
      } else {
        hint.textContent = 'Sai tài khoản hoặc mật khẩu (mock). Vui lòng thử lại.';
      }
    });
  }

  function attachListEvents() {
    root.querySelectorAll('[data-open-detail]').forEach((button) => {
      button.addEventListener('click', () => {
        appState.selectedArticleId = button.getAttribute('data-open-detail');
        appState.currentScreen = 'detail';
        render();
      });
    });
  }

  function attachDetailEvents() {
    root.querySelector('#backToListBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'list';
      render();
    });

    root.querySelector('#openEditorBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'editor';
      render();
    });
  }

  function attachPreviewEvents() {
    root.querySelector('#backToEditorBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'editor';
      render();
    });
  }

  function getSelectedArticle() {
    return appState.articles.find((article) => article.id === appState.selectedArticleId) || null;
  }

  function saveArticleDraft(draft) {
    const index = appState.articles.findIndex((article) => article.id === appState.selectedArticleId);
    if (index < 0) {
      return;
    }

    appState.articles[index] = {
      ...appState.articles[index],
      ...draft,
      updatedAt: formatNowUtc()
    };
  }

  render();
}

function formatNowUtc() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`;
}

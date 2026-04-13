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
    status: 'Chờ duyệt',
    author: 'Ban biên tập',
    updatedAt: '2026-04-12 09:20',
    category: 'Thời sự',
    subCategory: 'Chuyển đổi số',
    province: 'An Giang',
    keywords: ['chuyển đổi số', 'mỹ bình', 'hạ tầng'],
    avatarUrl: 'https://picsum.photos/seed/tin-001/320/220',
    content:
      '<p>Phường Mỹ Bình triển khai hạ tầng số mới để hỗ trợ xử lý hồ sơ nhanh.</p><figure class="image"><img src="https://picsum.photos/seed/mybinh-content/640/360" alt="Mỹ Bình"><figcaption>Hệ thống máy chủ mới giúp đồng bộ dữ liệu hồ sơ.</figcaption></figure><p>Người dân có thể theo dõi trạng thái xử lý qua ứng dụng công trực tuyến.</p>'
  },
  {
    id: 'TIN-002',
    title: 'Khởi động chiến dịch du lịch hè An Giang',
    summary: 'Nhiều hoạt động trải nghiệm sẽ diễn ra từ tháng 5.',
    status: 'Đang biên tập',
    author: 'Phòng nội dung',
    updatedAt: '2026-04-11 14:45',
    category: 'Du lịch',
    subCategory: 'Sự kiện',
    province: 'An Giang',
    keywords: ['du lịch hè', 'an giang'],
    avatarUrl: 'https://picsum.photos/seed/tin-002/320/220',
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
          <button class="btn btn-outline" id="backToListBtn">Về danh sách tin</button>
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
        appState.currentScreen = 'list';
        render();
      },
      onPreview: (draft) => {
        appState.previewDraft = draft;
        appState.currentScreen = 'preview';
        render();
      },
      onBack: () => {
        appState.currentScreen = 'list';
        render();
      }
    });

    root.querySelector('#backToListBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'list';
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
      <article class="card article-card" data-open-editor="${article.id}" role="button" tabindex="0">
        <div class="article-headline">
          <img class="thumb" src="${article.avatarUrl}" alt="Ảnh đại diện ${article.title}" />
          <div class="stack-xs">
            <h3>${article.title}</h3>
            <span class="badge">${article.status}</span>
          </div>
        </div>
        <p>${article.summary}</p>
        <div class="card-foot">
          <small class="muted">${article.updatedAt}</small>
          <button class="btn btn-primary btn-lg" data-open-editor="${article.id}" type="button">Sửa tin</button>
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
        <img class="preview-image" src="${draft.avatarUrl}" alt="${draft.title}" />
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
    root.querySelectorAll('[data-open-editor]').forEach((item) => {
      const openEditor = () => {
        appState.selectedArticleId = item.getAttribute('data-open-editor');
        appState.currentScreen = 'editor';
        render();
      };

      item.addEventListener('click', openEditor);
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openEditor();
        }
      });
    });
  }

  function attachPreviewEvents() {
    root.querySelector('#backToEditorBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'editor';
      render();
    });
  }

  function getSelectedArticle() {
    return appState.articles.find((item) => item.id === appState.selectedArticleId) || null;
  }

  function saveArticleDraft(draft) {
    appState.articles = appState.articles.map((item) => {
      if (item.id !== draft.id) {
        return item;
      }

      return {
        ...item,
        ...draft,
        updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
    });
  }

  render();
}

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
    summary: 'Hệ thống mới giúp xử lý hồ sơ nhanh hơn cho người dân.',
    status: 'Chờ duyệt',
    author: 'Ban biên tập',
    updatedAt: '2026-04-12 09:20',
    content:
      '<p>Phường Mỹ Bình triển khai hệ thống hạ tầng số mới để hỗ trợ xử lý hồ sơ nhanh.</p><p><figure class="image"><img src="https://picsum.photos/320/200" alt="Mỹ Bình"><figcaption>Hạ tầng mới tại phường Mỹ Bình</figcaption></figure></p>'
  },
  {
    id: 'TIN-002',
    title: 'Khởi động chiến dịch du lịch hè An Giang',
    summary: 'Nhiều hoạt động trải nghiệm được tổ chức từ tháng 5.',
    status: 'Đang biên tập',
    author: 'Phòng nội dung',
    updatedAt: '2026-04-11 14:45',
    content:
      '<p>Chiến dịch du lịch hè tập trung quảng bá các điểm đến sinh thái và văn hóa.</p>'
  },
  {
    id: 'TIN-003',
    title: 'Kế hoạch chỉnh trang tuyến đường ven sông',
    summary: 'Dự kiến hoàn thiện giai đoạn 1 trước quý III.',
    status: 'Đã xuất bản',
    author: 'Tổ đô thị',
    updatedAt: '2026-04-10 18:10',
    content:
      '<p>Tuyến đường ven sông được chỉnh trang để phục vụ giao thông và cảnh quan đô thị.</p>'
  }
];

export function createNewsManagementApp(root) {
  const appState = {
    currentScreen: 'login',
    selectedArticleId: null,
    isLoggedIn: false,
    technicianName: ''
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
    }

    root.querySelector('#logoutBtn')?.addEventListener('click', () => {
      appState.currentScreen = 'login';
      appState.isLoggedIn = false;
      appState.selectedArticleId = null;
      appState.technicianName = '';
      render();
    });
  }

  function renderEditorScreen() {
    root.innerHTML = `
      <main class="mobile-shell">
        <header class="topbar">
          <h1>Editor bài viết</h1>
          <button class="btn btn-outline" id="backToDetailBtn">Về chi tiết tin</button>
        </header>
        <section class="panel" id="editorHost"></section>
      </main>
    `;

    const article = getSelectedArticle();
    const editorHost = root.querySelector('#editorHost');
    createEditor(editorHost, {
      initialData: article?.content || '<p>Nhập nội dung tại đây...</p>'
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
    const cards = MOCK_ARTICLES.map(
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
    ).join('');

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
        <p>${article.summary}</p>
      </article>
      <div class="toolbar-row toolbar-actions">
        <button class="btn btn-outline btn-lg" id="backToListBtn">Về danh sách tin</button>
        <button class="btn btn-primary btn-lg" id="openEditorBtn">Mở editor</button>
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

  function getSelectedArticle() {
    return MOCK_ARTICLES.find((article) => article.id === appState.selectedArticleId) || null;
  }

  render();
}

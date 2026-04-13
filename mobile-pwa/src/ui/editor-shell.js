import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { showToast } from '../extensions/toast.js';

const MOBILE_TOOLBAR = [
  'heading',
  '|',
  'bold',
  'italic',
  'link',
  '|',
  'bulletedList',
  'numberedList',
  '|',
  'insertTable',
  'blockQuote',
  '|',
  'undo',
  'redo'
];

export function createEditor(root, options = {}) {
  const article = options.article ?? {};
  const draft = {
    id: article.id || '',
    title: article.title || '',
    summary: article.summary || '',
    avatarUrl: article.avatarUrl || '',
    category: article.category || '',
    subCategory: article.subCategory || '',
    province: article.province || '',
    keywords: Array.isArray(article.keywords) ? [...article.keywords] : [],
    content: article.content || '<p>Nhập nội dung bài viết...</p>'
  };

  root.innerHTML = `
    <section class="edit-news stack-md">
      <h2>Màn Sửa tin</h2>
      <p class="muted">Mô phỏng CMS mobile-first cho kỹ thuật viên.</p>

      <div class="segmented-tabs" role="tablist" aria-label="Nhóm chỉnh sửa tin">
        <button class="segmented-tab is-active" type="button" data-tab="info">Thông tin bài</button>
        <button class="segmented-tab" type="button" data-tab="metadata">Metadata</button>
        <button class="segmented-tab" type="button" data-tab="content">Nội dung</button>
      </div>

      <section class="editor-section stack-sm" data-panel="info">
        <label class="stack-xs">
          <span>Tiêu đề</span>
          <textarea class="input textarea" id="titleInput" rows="2">${escapeHtml(draft.title)}</textarea>
        </label>

        <label class="stack-xs">
          <span>Hình đại diện</span>
          <input class="input" id="avatarFileInput" type="file" accept="image/*" />
          <small class="muted">Chọn ảnh trực tiếp từ máy hoặc điện thoại.</small>
        </label>

        <img class="avatar-preview ${draft.avatarUrl ? '' : 'hidden'}" id="avatarPreview" src="${escapeHtml(
          draft.avatarUrl
        )}" alt="Xem trước ảnh đại diện" />

        <label class="stack-xs">
          <span>Mô tả</span>
          <textarea class="input textarea" id="summaryInput" rows="3">${escapeHtml(draft.summary)}</textarea>
        </label>
      </section>

      <section class="editor-section stack-sm hidden" data-panel="metadata">
        <label class="stack-xs">
          <span>Chuyên mục</span>
          <input class="input" id="categoryInput" value="${escapeHtml(draft.category)}" />
        </label>

        <label class="stack-xs">
          <span>Chuyên mục con</span>
          <input class="input" id="subCategoryInput" value="${escapeHtml(draft.subCategory)}" />
        </label>

        <label class="stack-xs">
          <span>Tỉnh</span>
          <input class="input" id="provinceInput" value="${escapeHtml(draft.province)}" />
        </label>

        <label class="stack-xs">
          <span>Từ khóa (phân tách bằng dấu phẩy)</span>
          <textarea class="input textarea" id="keywordsInput" rows="2">${escapeHtml(draft.keywords.join(', '))}</textarea>
        </label>
      </section>

      <section class="editor-section stack-sm hidden" data-panel="content">
        <div id="editor"></div>
      </section>

      <div class="toolbar-row toolbar-actions">
        <button class="btn btn-primary btn-lg" type="button" id="saveBtn">Lưu</button>
        <button class="btn btn-outline btn-lg" type="button" id="previewBtn">Xem trước</button>
        <button class="btn btn-outline btn-lg" type="button" id="backBtn">Quay lại</button>
      </div>
    </section>
  `;

  attachTabEvents(root);

  const avatarFileInput = root.querySelector('#avatarFileInput');
  const avatarPreview = root.querySelector('#avatarPreview');

  avatarFileInput?.addEventListener('change', async (event) => {
    const [file] = event.target.files || [];
    if (!file) {
      return;
    }

    draft.avatarUrl = await fileToDataUrl(file);
    avatarPreview.src = draft.avatarUrl;
    avatarPreview.classList.remove('hidden');
  });

  const syncDraftFromInputs = () => {
    draft.title = root.querySelector('#titleInput').value.trim();
    draft.summary = root.querySelector('#summaryInput').value.trim();
    draft.category = root.querySelector('#categoryInput').value.trim();
    draft.subCategory = root.querySelector('#subCategoryInput').value.trim();
    draft.province = root.querySelector('#provinceInput').value.trim();
    draft.keywords = root
      .querySelector('#keywordsInput')
      .value.split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  };

  ClassicEditor.create(root.querySelector('#editor'), {
    toolbar: MOBILE_TOOLBAR,
    image: {
      toolbar: ['imageTextAlternative', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side']
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    },
    initialData: draft.content
  }).then((editor) => {
    root.querySelector('#saveBtn')?.addEventListener('click', () => {
      syncDraftFromInputs();
      draft.content = editor.getData();
      options.onSave?.(draft);
      showToast('Đã lưu bài viết (mock data).');
    });

    root.querySelector('#previewBtn')?.addEventListener('click', () => {
      syncDraftFromInputs();
      draft.content = editor.getData();
      options.onPreview?.(draft);
    });

    root.querySelector('#backBtn')?.addEventListener('click', () => {
      options.onBack?.();
    });
  });
}

function attachTabEvents(root) {
  const tabs = root.querySelectorAll('[data-tab]');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetPanel = tab.getAttribute('data-tab');
      tabs.forEach((item) => item.classList.toggle('is-active', item === tab));
      root.querySelectorAll('[data-panel]').forEach((panel) => {
        panel.classList.toggle('hidden', panel.getAttribute('data-panel') !== targetPanel);
      });
    });
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh.'));
    reader.readAsDataURL(file);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

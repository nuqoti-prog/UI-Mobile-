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
    chapeau: article.chapeau || '',
    avatarUrl: article.avatarUrl || '',
    avatarCaption: article.avatarCaption || '',
    category: article.category || '',
    subCategory: article.subCategory || '',
    province: article.province || '',
    keywords: Array.isArray(article.keywords) ? [...article.keywords] : [],
    podcastUrl: article.podcastUrl || '',
    content: article.content || '<p>Nhập nội dung bài viết...</p>'
  };

  root.innerHTML = `
    <section class="edit-news stack-md">
      <h2>Màn Sửa tin</h2>
      <p class="muted">Mô phỏng CMS hiện tại: nhóm thông tin bài, metadata và nội dung.</p>

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
        <button class="btn btn-outline btn-lg" type="button" id="checkTitleBtn">Kiểm tra tiêu đề</button>

        <label class="stack-xs">
          <span>Hình đại diện (URL)</span>
          <input class="input" id="avatarInput" value="${escapeHtml(draft.avatarUrl)}" />
        </label>

        <label class="stack-xs">
          <span>Caption hình đại diện</span>
          <input class="input" id="avatarCaptionInput" value="${escapeHtml(draft.avatarCaption)}" />
        </label>

        <label class="stack-xs">
          <span>Mô tả / Sapo</span>
          <textarea class="input textarea" id="summaryInput" rows="3">${escapeHtml(draft.summary)}</textarea>
        </label>

        <label class="stack-xs">
          <span>Chapeau</span>
          <textarea class="input textarea" id="chapeauInput" rows="3">${escapeHtml(draft.chapeau)}</textarea>
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

        <label class="stack-xs">
          <span>Audio podcast (URL)</span>
          <input class="input" id="podcastInput" value="${escapeHtml(draft.podcastUrl)}" />
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
  const syncDraftFromInputs = () => {
    draft.title = root.querySelector('#titleInput').value.trim();
    draft.avatarUrl = root.querySelector('#avatarInput').value.trim();
    draft.avatarCaption = root.querySelector('#avatarCaptionInput').value.trim();
    draft.summary = root.querySelector('#summaryInput').value.trim();
    draft.chapeau = root.querySelector('#chapeauInput').value.trim();
    draft.category = root.querySelector('#categoryInput').value.trim();
    draft.subCategory = root.querySelector('#subCategoryInput').value.trim();
    draft.province = root.querySelector('#provinceInput').value.trim();
    draft.keywords = root
      .querySelector('#keywordsInput')
      .value.split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    draft.podcastUrl = root.querySelector('#podcastInput').value.trim();
  };

  root.querySelector('#checkTitleBtn')?.addEventListener('click', () => {
    const title = root.querySelector('#titleInput').value.trim();
    if (!title) {
      showToast('Tiêu đề đang trống. Vui lòng nhập trước khi lưu.');
      return;
    }

    if (title.length < 10) {
      showToast('Tiêu đề hơi ngắn, nên rõ nghĩa hơn để dễ duyệt tin.');
      return;
    }

    showToast('Tiêu đề hợp lệ để tiếp tục biên tập.');
  });

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

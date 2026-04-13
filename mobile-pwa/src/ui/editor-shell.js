import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ArticleState } from '../core/article-state.js';
import { suggestKeywords } from '../core/keyword-engine.js';
import { detectProvince } from '../core/province-engine.js';
import { normalizeCaption } from '../extensions/image-caption.js';
import { showToast } from '../extensions/toast.js';

export function createEditor(root) {
  const state = new ArticleState();

  root.innerHTML = `
    <main class="mobile-shell">
      <section class="panel">
        <div class="toolbar-row">
          <button id="syncBtn">Sync trạng thái</button>
          <button id="keywordBtn">Auto keyword</button>
          <button id="provinceBtn">Auto địa phương</button>
        </div>
        <div id="editor"></div>
        <p><small class="muted" id="meta"></small></p>
      </section>
    </main>
  `;

  const meta = root.querySelector('#meta');

  ClassicEditor.create(root.querySelector('#editor')).then((editor) => {
    const syncBtn = root.querySelector('#syncBtn');
    const keywordBtn = root.querySelector('#keywordBtn');
    const provinceBtn = root.querySelector('#provinceBtn');

    syncBtn.addEventListener('click', () => {
      state.setStatus('synced');
      state.markSynced();
      meta.textContent = `Trạng thái: ${state.status} - ${state.lastSyncedAt}`;
      showToast('Đã sync trạng thái bài viết');
    });

    keywordBtn.addEventListener('click', () => {
      const text = editor.getData().replace(/<[^>]*>/g, ' ');
      const keywords = suggestKeywords(text).join(', ');
      showToast(`Keyword: ${keywords || 'chưa đủ dữ liệu'}`);
    });

    provinceBtn.addEventListener('click', () => {
      const text = editor.getData().replace(/<[^>]*>/g, ' ');
      const province = detectProvince(text);
      showToast(`Địa phương: ${province || 'không xác định'}`);
    });

    editor.model.document.on('change:data', () => {
      const text = editor.getData();
      const imageCaption = normalizeCaption(
        text.match(/<figcaption>(.*?)<\/figcaption>/)?.[1] || ''
      );
      if (imageCaption) {
        meta.textContent = `Caption ảnh: ${imageCaption}`;
      }
    });
  });
}

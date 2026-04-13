
(function () {
  'use strict';

  if (window.__AGO_AUTHOR_QUICK_V3__) return;
  window.__AGO_AUTHOR_QUICK_V3__ = true;

  const STORAGE_KEY = 'ago_author_quick_names_v3';
  const LEGACY_KEYS = ['ago_author_quick_names_v2', 'ago_author_quick_names_v1'];
  const DEFAULT_NAMES = ['THÚY VI - QUỐC TRÍ', 'H.Đ TƯỞNG', 'H.Đ TÀI'];
  const MAX_ITEMS = 30;
  const BTN_ID = 'ago-author-quick-btn';
  const POP_ID = 'ago-author-quick-pop';
  const STYLE_ID = 'ago-author-quick-style';
  const MAX_WIDTH = 420;
  const MIN_WIDTH = 165;
  const CKEDITOR_IFRAME_SEL = 'iframe.cke_wysiwyg_frame, .cke iframe';

  function normalizeName(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function readStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function saveNames(list, persistToStorage = true) {
    const unique = [];
    const seen = new Set();
    (list || []).forEach((item) => {
      const value = normalizeName(item);
      const key = value.toLowerCase();
      if (!value || seen.has(key)) return;
      seen.add(key);
      unique.push(value);
    });
    const result = unique.slice(0, MAX_ITEMS);
    if (persistToStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      } catch (e) {}
    }
    return result;
  }

  function loadNames() {
    let parsed = readStorage(STORAGE_KEY);
    if (!parsed) {
      for (const key of LEGACY_KEYS) {
        parsed = readStorage(key);
        if (parsed) break;
      }
    }
    if (!parsed) return DEFAULT_NAMES.slice();
    const cleaned = saveNames(parsed, false);
    return cleaned.length ? cleaned : DEFAULT_NAMES.slice();
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      #${BTN_ID}{
        margin-left:6px;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:34px;
        height:24px;
        padding:0 9px;
        border:none;
        border-radius:999px;
        background:linear-gradient(180deg,#f5edff 0%,#efe5ff 100%);
        box-shadow:inset 0 0 0 1px rgba(138,92,246,.18), 0 1px 2px rgba(138,92,246,.12);
        color:#7c3aed;
        font:600 12px/1 Arial,sans-serif;
        cursor:pointer;
        vertical-align:middle;
      }
      #${BTN_ID}:hover{filter:brightness(.98)}
      #${BTN_ID}:active{transform:translateY(1px)}
      #${POP_ID}{
        position:absolute;
        z-index:2147483647;
        background:#fff;
        border:1px solid #e7d9ff;
        border-radius:12px;
        box-shadow:0 12px 28px rgba(70,26,120,.18);
        padding:8px;
        font:12px/1.4 Arial,sans-serif;
        color:#312e81;
        min-width:${MIN_WIDTH}px;
        max-width:${MAX_WIDTH}px;
        width:max-content;
      }
      #${POP_ID}[hidden]{display:none !important}
      #${POP_ID} .aq-head{display:flex;align-items:center;justify-content:center;margin-bottom:6px}
      #${POP_ID} .aq-title{font:700 13px/1 Arial,sans-serif;color:#6d28d9;text-transform:uppercase;letter-spacing:.35px}
      #${POP_ID} .aq-list{display:flex;flex-direction:column;gap:6px;max-height:260px;overflow:auto;padding-right:2px}
      #${POP_ID} .aq-item{display:flex;align-items:center;gap:6px}
      #${POP_ID} .aq-item[draggable="true"]{cursor:grab}
      #${POP_ID} .aq-item.aq-dragging{opacity:.48}
      #${POP_ID} .aq-item.aq-drop-before .aq-name,
      #${POP_ID} .aq-item.aq-drop-before .aq-input-badge{box-shadow:inset 0 0 0 1px rgba(124,58,237,.10), 0 -2px 0 0 #8b5cf6}
      #${POP_ID} .aq-item.aq-drop-after .aq-name,
      #${POP_ID} .aq-item.aq-drop-after .aq-input-badge{box-shadow:inset 0 0 0 1px rgba(124,58,237,.10), 0 2px 0 0 #8b5cf6}
      #${POP_ID} .aq-drag{
        width:20px;height:20px;border:none;background:transparent;color:#8b5cf6;
        cursor:grab;padding:0;display:inline-flex;align-items:center;justify-content:center;
        font-size:14px;line-height:1;flex:0 0 20px;
      }
      #${POP_ID} .aq-name,
      #${POP_ID} .aq-input-badge{
        flex:1;min-width:0;
        border:none;
        border-radius:999px;
        padding:6px 10px;
        text-align:left;
        background:#f7f2ff;
        color:#4c1d95;
        box-shadow:inset 0 0 0 1px rgba(124,58,237,.10);
        white-space:nowrap;
        height:30px;
      }
      #${POP_ID} .aq-name{
        cursor:pointer;
        overflow:visible;
        text-overflow:clip;
      }
      #${POP_ID} .aq-name:hover{background:#efe7ff}
      #${POP_ID} .aq-input-badge{outline:none;background:#fff}
      #${POP_ID} .aq-input-badge:focus{box-shadow:inset 0 0 0 1px #8b5cf6,0 0 0 2px rgba(139,92,246,.12)}
      #${POP_ID} .aq-icon{
        width:22px;height:22px;border:none;border-radius:999px;cursor:pointer;
        display:inline-flex;align-items:center;justify-content:center;
        background:#fff;color:#7c3aed;box-shadow:inset 0 0 0 1px rgba(124,58,237,.16);
        flex:0 0 22px;
      }
      #${POP_ID} .aq-icon:hover{background:#f8f5ff}
      #${POP_ID} .aq-empty{padding:10px 8px;text-align:center;color:#8b5cf6;background:#faf7ff;border-radius:10px}
      #${POP_ID} .aq-add-wrap{margin-top:8px}
      #${POP_ID} .aq-add-btn{
        width:100%;height:30px;border:none;border-radius:10px;cursor:pointer;
        background:linear-gradient(180deg,#f5edff 0%,#efe5ff 100%);color:#6d28d9;font-weight:700;
      }
    `;
    (document.head || document.documentElement).appendChild(s);
  }

  function setNativeValue(el, value) {
    const proto = Object.getPrototypeOf(el);
    const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
    if (descriptor && descriptor.set) descriptor.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function setRoyaltyByAuthorValue(value) {
    const hasAuthor = normalizeName(value).length > 0;
    const yes = document.querySelector('input[name="news_isroyalty"][value="1"]');
    const no = document.querySelector('input[name="news_isroyalty"][value="0"]');
    const target = hasAuthor ? yes : no;
    if (!target) return;
    target.checked = true;
    target.dispatchEvent(new Event('click', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function createPopover(input, btn) {
    let names = loadNames();
    let editingIndex = -1; // -1 none, -2 new item
    let dragIndex = -1;
    let pop = document.getElementById(POP_ID);
    if (pop) pop.remove();
    pop = document.createElement('div');
    pop.id = POP_ID;
    pop.hidden = true;
    document.body.appendChild(pop);

    function clearDropMarkers() {
      pop.querySelectorAll('.aq-drop-before, .aq-drop-after, .aq-dragging').forEach(function (el) {
        el.classList.remove('aq-drop-before', 'aq-drop-after', 'aq-dragging');
      });
    }

    function fitWidth() {
      pop.style.width = 'max-content';
      let width = Math.max(MIN_WIDTH, pop.scrollWidth + 2);
      width = Math.min(width, MAX_WIDTH);
      pop.style.width = width + 'px';
    }

    function position() {
      fitWidth();
      const rect = btn.getBoundingClientRect();
      const top = rect.bottom + window.scrollY + 6;
      let left = rect.left + window.scrollX;
      const maxLeft = window.scrollX + window.innerWidth - pop.offsetWidth - 8;
      if (left > maxLeft) left = Math.max(window.scrollX + 8, maxLeft);
      pop.style.top = top + 'px';
      pop.style.left = left + 'px';
    }

    function close() {
      pop.hidden = true;
      editingIndex = -1;
      clearDropMarkers();
    }

    function open() {
      position();
      pop.hidden = false;
      fitWidth();
    }

    function persist(list) {
      names = saveNames(list);
      render();
    }

    function startEdit(index) {
      editingIndex = index;
      render();
      const inputEl = pop.querySelector('.aq-input-badge');
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
    }

    function buildEditableRow(initialValue, isEdit) {
      const item = document.createElement('div');
      item.className = 'aq-item';

      const spacer = document.createElement('span');
      spacer.style.width = '20px';
      spacer.style.flex = '0 0 20px';

      const inputEl = document.createElement('input');
      inputEl.className = 'aq-input-badge';
      inputEl.type = 'text';
      inputEl.maxLength = 120;
      inputEl.placeholder = 'Nhập tên';
      inputEl.value = initialValue || '';

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'aq-icon';
      saveBtn.title = 'Lưu';
      saveBtn.textContent = '✓';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'aq-icon';
      cancelBtn.title = 'Hủy';
      cancelBtn.textContent = '×';

      function submit() {
        const value = normalizeName(inputEl.value);
        if (!value) {
          inputEl.focus();
          return;
        }
        const next = names.slice();
        const duplicateIndex = next.findIndex((item, idx) => idx !== editingIndex && item.toLowerCase() === value.toLowerCase());
        if (duplicateIndex >= 0) {
          if (isEdit && editingIndex >= 0) next.splice(editingIndex, 1);
          const [existing] = next.splice(duplicateIndex, 1);
          next.unshift(existing || value);
          editingIndex = -1;
          persist(next);
          return;
        }
        if (isEdit && editingIndex >= 0 && editingIndex < next.length) next[editingIndex] = value;
        else next.push(value);
        editingIndex = -1;
        persist(next);
      }

      saveBtn.addEventListener('click', submit);
      cancelBtn.addEventListener('click', function () {
        editingIndex = -1;
        render();
      });
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submit();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          editingIndex = -1;
          render();
        }
      });

      item.appendChild(spacer);
      item.appendChild(inputEl);
      item.appendChild(saveBtn);
      item.appendChild(cancelBtn);
      requestAnimationFrame(function () { fitWidth(); });
      return item;
    }

    function handleDrop(fromIndex, toIndex, placeAfter) {
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
      const next = names.slice();
      const moved = next.splice(fromIndex, 1)[0];
      let insertIndex = toIndex;
      if (fromIndex < toIndex) insertIndex -= 1;
      if (placeAfter) insertIndex += 1;
      if (insertIndex < 0) insertIndex = 0;
      if (insertIndex > next.length) insertIndex = next.length;
      next.splice(insertIndex, 0, moved);
      persist(next);
    }

    function render() {
      pop.innerHTML = '';
      const head = document.createElement('div');
      head.className = 'aq-head';
      head.innerHTML = '<div class="aq-title">TÊN NHANH</div>';
      pop.appendChild(head);

      const list = document.createElement('div');
      list.className = 'aq-list';

      if (!names.length && editingIndex !== -2) {
        const empty = document.createElement('div');
        empty.className = 'aq-empty';
        empty.textContent = 'Chưa có tên';
        list.appendChild(empty);
      }

      names.forEach(function (name, index) {
        if (editingIndex === index) {
          list.appendChild(buildEditableRow(name, true));
          return;
        }

        const item = document.createElement('div');
        item.className = 'aq-item';
        item.draggable = true;
        item.dataset.index = String(index);

        const dragBtn = document.createElement('button');
        dragBtn.type = 'button';
        dragBtn.className = 'aq-drag';
        dragBtn.title = 'Kéo để đổi thứ tự';
        dragBtn.textContent = '⋮⋮';

        const nameBtn = document.createElement('button');
        nameBtn.type = 'button';
        nameBtn.className = 'aq-name';
        nameBtn.title = name;
        nameBtn.textContent = name;
        nameBtn.addEventListener('click', function () {
          setNativeValue(input, name);
          setRoyaltyByAuthorValue(name);
          close();
          input.focus();
        });

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'aq-icon';
        editBtn.title = 'Sửa';
        editBtn.textContent = '✎';
        editBtn.addEventListener('click', function () { startEdit(index); });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'aq-icon';
        delBtn.title = 'Xóa';
        delBtn.textContent = '×';
        delBtn.addEventListener('click', function () {
          const next = names.slice();
          next.splice(index, 1);
          editingIndex = -1;
          persist(next);
        });

        item.addEventListener('dragstart', function (e) {
          dragIndex = index;
          item.classList.add('aq-dragging');
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', String(index)); } catch (err) {}
        });

        item.addEventListener('dragend', function () {
          dragIndex = -1;
          clearDropMarkers();
        });

        item.addEventListener('dragover', function (e) {
          e.preventDefault();
          if (dragIndex < 0 || dragIndex === index) return;
          clearDropMarkers();
          const rect = item.getBoundingClientRect();
          const placeAfter = (e.clientY - rect.top) > rect.height / 2;
          item.classList.add(placeAfter ? 'aq-drop-after' : 'aq-drop-before');
        });

        item.addEventListener('drop', function (e) {
          e.preventDefault();
          if (dragIndex < 0 || dragIndex === index) return;
          const rect = item.getBoundingClientRect();
          const placeAfter = (e.clientY - rect.top) > rect.height / 2;
          clearDropMarkers();
          handleDrop(dragIndex, index, placeAfter);
          dragIndex = -1;
        });

        item.appendChild(dragBtn);
        item.appendChild(nameBtn);
        item.appendChild(editBtn);
        item.appendChild(delBtn);
        list.appendChild(item);
      });

      if (editingIndex === -2) {
        list.appendChild(buildEditableRow('', false));
      }

      pop.appendChild(list);

      if (editingIndex < 0) {
        const wrap = document.createElement('div');
        wrap.className = 'aq-add-wrap';
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'aq-add-btn';
        addBtn.textContent = '＋ Thêm';
        addBtn.addEventListener('click', function () {
          editingIndex = -2;
          render();
          const inputEl = pop.querySelector('.aq-input-badge');
          if (inputEl) inputEl.focus();
        });
        wrap.appendChild(addBtn);
        pop.appendChild(wrap);
      }

      fitWidth();
      if (!pop.hidden) position();
    }

    function bindIframes() {
      document.querySelectorAll(CKEDITOR_IFRAME_SEL).forEach(function (iframe) {
        if (iframe.dataset.agoAuthorQuickBound === '1') return;
        iframe.dataset.agoAuthorQuickBound = '1';

        function bindFrameDoc() {
          try {
            const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
            if (!doc) return;
            ['mousedown', 'pointerdown', 'click', 'focusin', 'keydown'].forEach(function (type) {
              doc.addEventListener(type, function () { close(); }, true);
            });
          } catch (e) {}
        }

        iframe.addEventListener('load', bindFrameDoc, true);
        bindFrameDoc();
      });
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (pop.hidden) open();
      else close();
    });

    document.addEventListener('click', function (e) {
      if (pop.hidden) return;
      if (e.target === btn || btn.contains(e.target)) return;
      if (pop.contains(e.target)) return;
      close();
    }, true);

    document.addEventListener('focusin', function (e) {
      if (pop.hidden) return;
      if (e.target === btn || btn.contains(e.target)) return;
      if (pop.contains(e.target)) return;
      close();
    }, true);

    window.addEventListener('scroll', function () {
      if (!pop.hidden) position();
    }, true);
    window.addEventListener('resize', function () {
      if (!pop.hidden) position();
    });

    const observer = new MutationObserver(function () { bindIframes(); });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    bindIframes();

    input.addEventListener('input', function () {
      setRoyaltyByAuthorValue(input.value);
    });

    render();
  }

  function attachWidget(input) {
    if (!input || input.dataset.agoAuthorQuickReady === '1') return true;
    injectStyles();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = BTN_ID;
    btn.title = 'Tên nhanh tác giả';
    btn.textContent = '👤+';

    input.insertAdjacentElement('afterend', btn);
    input.dataset.agoAuthorQuickReady = '1';
    createPopover(input, btn);
    return true;
  }

  function findAuthorInput() {
    return document.querySelector('#newsauthor, input[name="newsauthor"]');
  }

  function start() {
    const input = findAuthorInput();
    if (input) attachWidget(input);

    const observer = new MutationObserver(function () {
      const el = findAuthorInput();
      if (!el) return;
      attachWidget(el);
    });

    const root = document.documentElement || document.body;
    if (root) observer.observe(root, { childList: true, subtree: true });

    let tries = 0;
    const timer = setInterval(function () {
      const el = findAuthorInput();
      if (el) attachWidget(el);
      tries += 1;
      if (tries > 60) clearInterval(timer);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();

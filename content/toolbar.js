/*
 * CRMAG Toolbar bundle from Tampermonkey script
 * Added to extension for CRM only
 */
(function(){
  const __tmGlobal = typeof globalThis !== 'undefined' ? globalThis : window;

  __tmGlobal.__tmSafeRoot = function __tmSafeRoot() {
    return document.body || document.documentElement || null;
  };

  __tmGlobal.__tmAppendWhenReady = function __tmAppendWhenReady(el) {
    if (!el) return false;
    const root = __tmGlobal.__tmSafeRoot();
    if (root) {
      if (!el.isConnected) root.appendChild(el);
      return true;
    }
    const onReady = () => {
      const lateRoot = __tmGlobal.__tmSafeRoot();
      if (lateRoot && !el.isConnected) lateRoot.appendChild(el);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady, { once: true });
    } else {
      setTimeout(onReady, 0);
    }
    return false;
  };

  __tmGlobal.__tmBodyAddClass = function __tmBodyAddClass(cls) {
    const run = () => {
      if (document.body) document.body.classList.add(cls);
    };
    if (document.body) return run();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      setTimeout(run, 0);
    }
  };

  __tmGlobal.__tmBodyRemoveClass = function __tmBodyRemoveClass(cls) {
    const run = () => {
      if (document.body) document.body.classList.remove(cls);
    };
    if (document.body) return run();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      setTimeout(run, 0);
    }
  };
if (typeof window.GM_addStyle !== 'function') {
    window.GM_addStyle = function(css) {
      const s = document.createElement('style');
      s.textContent = css;
      (document.head || document.documentElement).appendChild(s);
      return s;
    };
  }
  if (typeof window.unsafeWindow === 'undefined') {
    window.unsafeWindow = window;
  }
})();

(function () {

/* === FORMAT AURA : ROG THAT === */
GM_addStyle(`
.tm-act[data-action-id="format"]{
  position:relative !important;
  overflow:hidden !important;
  isolation:isolate !important;
  border:1px solid rgba(255,255,255,.40) !important;
  border-radius:999px !important;
  color:#240b18 !important;
  background: linear-gradient(
    90deg,
    #ff2d6f,
    #ff7a00,
    #ffe600,
    #00ffa2,
    #00c8ff,
    #7a5cff,
    #ff2d6f
  ) !important;
  background-size: 420% 100% !important;
  box-shadow:
    0 0 0 1px rgba(255,255,255,.18) inset,
    0 10px 24px rgba(255, 55, 110, .18) !important;
  animation:
    tmAuraBgFlow 1.28s linear infinite,
    tmAuraJiggle 0.92s ease-in-out infinite !important;
  transition: transform .16s ease, box-shadow .2s ease, filter .2s ease !important;
  filter: saturate(1.26) contrast(1.07);
}
.tm-act[data-action-id="format"] > *{ position:relative; z-index:2; }
.tm-act[data-action-id="format"] .tm-act-icon{
  filter: drop-shadow(0 0 10px rgba(255,255,255,.28)) drop-shadow(0 0 14px rgba(255, 110, 150, .22));
}

.tm-act[data-action-id="format"]::before{
  content:"";
  position:absolute;
  inset:-5px;
  border-radius:inherit;
  z-index:-1;
  background: radial-gradient(circle, rgba(255, 45, 111, .52) 0%, rgba(255, 45, 111, .24) 48%, rgba(255,45,111,0) 76%);
  filter: blur(14px);
  opacity:.98;
  animation: tmAuraGlowPulse 1.08s ease-in-out infinite;
}
.tm-act[data-action-id="format"]::after{
  content:"";
  position:absolute;
  top:-24%;
  left:-26%;
  width:12%;
  height:158%;
  z-index:1;
  border-radius:26px;
  pointer-events:none;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.14), rgba(255,255,255,.92), rgba(255,235,244,.58), rgba(255,255,255,0));
  transform: rotate(18deg);
  filter: blur(.5px);
  mix-blend-mode: screen;
  animation: tmAuraSweepThin 2.25s ease-in-out infinite;
}
.tm-act[data-action-id="format"]:hover{
  filter: saturate(1.4) brightness(1.05) contrast(1.08);
  box-shadow:
    0 0 0 1px rgba(255,255,255,.22) inset,
    0 0 18px rgba(255, 45, 111, .46),
    0 0 38px rgba(255, 26, 92, .24),
    0 12px 28px rgba(255, 45, 111, .24) !important;
}
.tm-act[data-action-id="format"]:active{ transform: scale(.982) !important; }
.tm-act[data-action-id="format"]:active::before{ animation: tmAuraClickPulse .42s ease-out 1; }
.tm-act[data-action-id="format"]{ transform: perspective(800px) rotateX(var(--tm-rx, 0deg)) rotateY(var(--tm-ry, 0deg)); }
@keyframes tmAuraBgFlow{ 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
@keyframes tmAuraSweepThin{ 0%{left:-26%;opacity:0;} 18%{opacity:.92;} 72%{opacity:.62;} 100%{left:112%;opacity:0;} }
@keyframes tmAuraGlowPulse{ 0%,100%{opacity:.84; transform:scale(1); filter:blur(13px);} 50%{opacity:1; transform:scale(1.05); filter:blur(16px);} }
@keyframes tmAuraClickPulse{ 0%{opacity:.95; transform:scale(1); filter:blur(10px);} 100%{opacity:0; transform:scale(1.12); filter:blur(18px);} }
@keyframes tmAuraJiggle{
  0%{transform:perspective(800px) rotateX(var(--tm-rx,0deg)) rotateY(var(--tm-ry,0deg)) rotate(-1deg) translateY(0);}
  20%{transform:perspective(800px) rotateX(var(--tm-rx,0deg)) rotateY(var(--tm-ry,0deg)) rotate(1deg) translateY(-.35px);}
  40%{transform:perspective(800px) rotateX(var(--tm-rx,0deg)) rotateY(var(--tm-ry,0deg)) rotate(-.85deg) translateY(.1px);}
  60%{transform:perspective(800px) rotateX(var(--tm-rx,0deg)) rotateY(var(--tm-ry,0deg)) rotate(.88deg) translateY(-.24px);}
  80%{transform:perspective(800px) rotateX(var(--tm-rx,0deg)) rotateY(var(--tm-ry,0deg)) rotate(-.8deg) translateY(.16px);}
  100%{transform:perspective(800px) rotateX(var(--tm-rx,0deg)) rotateY(var(--tm-ry,0deg)) rotate(1deg) translateY(0);}
}
`);


(function(){
  function bindFormatAuraReactive(){
    const btn = document.querySelector('.tm-act[data-action-id="format"]');
    if (!btn || btn.__tmAuraReactiveBound) return;
    btn.__tmAuraReactiveBound = 1;
    const reset = () => {
      btn.style.setProperty('--tm-rx', '0deg');
      btn.style.setProperty('--tm-ry', '0deg');
    };
    btn.addEventListener('mousemove', function(e){
      const r = btn.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const ry = ((px - 0.5) * 5.6).toFixed(2) + 'deg';
      const rx = ((0.5 - py) * 4.8).toFixed(2) + 'deg';
      btn.style.setProperty('--tm-rx', rx);
      btn.style.setProperty('--tm-ry', ry);
    });
    btn.addEventListener('mouseleave', reset);
    btn.addEventListener('blur', reset, true);
  }
  const boot = () => {
    bindFormatAuraReactive();
    const mo = new MutationObserver(() => bindFormatAuraReactive());
    const root = document.body || document.documentElement;
    if (root) mo.observe(root, { childList:true, subtree:true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else setTimeout(boot, 0);
})();



  'use strict';

  /***********************
   * 0) Detect CRM
   ***********************/
  const isCRM = /(^|\.)crmag\.baoangiang\.com\.vn$/i.test(location.hostname);
  const isBaoAnGiang = /(^|\.)baoangiang\.com\.vn$/i.test(location.hostname) && !isCRM;
  const isToolbarHost = isCRM || isBaoAnGiang;

  /***********************
   * 1) Toast + common styles
   ***********************/
  GM_addStyle(`
    .tm-toast{
      position:fixed; left:50%; bottom:86px; transform:translateX(-50%);
      z-index:2147483647; background:rgba(20,20,20,.86); color:#fff;
      padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.14);
      box-shadow:0 16px 40px rgba(0,0,0,.35); opacity:0; transition:opacity .18s ease;
      pointer-events:none; max-width:min(560px, calc(100vw - 24px)); text-align:center;
      font: 700 13px/1.25 system-ui, -apple-system, Segoe UI, Roboto, Arial;
    }
    .tm-toast.show{ opacity:1; }
  `);

  var backlinkPanelToastContext = null;

  function toast(msg) {
    try {
      if (backlinkPanelToastContext && msg === 'Hãy chọn từ để backlink') return;
    } catch (e) {}
    let t = document.querySelector('.tm-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'tm-toast';
      __tmAppendWhenReady(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => t.classList.remove('show'), 1400);
  }

  /***********************
   * CLEAN BOX UI
   ***********************/
  let cleanBoxVisible = false;
  let cleanBox = null;

  function cleanWordHTML(html) {
    return html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<\/?(span|font|strong|b|i|em|u)[^>]*>/gi, '')
      .replace(/ class="[^"]*"/gi, '')
      .replace(/ style="[^"]*"/gi, '')
      .replace(/<o:p>[\s\S]*?<\/o:p>/gi, '')
      .replace(/&nbsp;/g, ' ');
  }

  function getEditorForCleanBox() {
    try {
      if (typeof unsafeWindow !== 'undefined' && unsafeWindow.CKEDITOR) {
        const CK = unsafeWindow.CKEDITOR;
        if (CK.currentInstance) return CK.currentInstance;
        if (CK.instances) for (let k in CK.instances) return CK.instances[k];
      }
      if (window.CKEDITOR) {
        const CK = window.CKEDITOR;
        if (CK.currentInstance) return CK.currentInstance;
        if (CK.instances) for (let k in CK.instances) return CK.instances[k];
      }
    } catch (e) {
      console.error('CleanBox CKEditor error', e);
    }
    return null;
  }

  function closeCleanBox() {
    cleanBoxVisible = false;
    if (cleanBox) cleanBox.style.display = 'none';
  }

  function resetCleanBox() {
    const input = document.getElementById('cleanbox-input');
    if (input) input.innerHTML = '';
  }

  function injectCleanBox() {
    if (cleanBox) return;

    cleanBox = document.createElement('div');
    cleanBox.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 420px;
      z-index: 2147483647;
      display: none;
      border-radius: 18px;
      background: rgba(76,175,80,.22);
      backdrop-filter: blur(22px);
      box-shadow: 0 20px 50px rgba(0,0,0,.35);
      font-family: system-ui, -apple-system, Segoe UI, Arial;
    `;

    cleanBox.innerHTML = `
      <div style="padding:14px 18px;color:#fff;font-weight:700;border-bottom:1px solid rgba(255,255,255,.25)">
        CLEAN TEXT
      </div>
      <div style="padding:14px">
        <div id="cleanbox-input"
          contenteditable="true"
          style="width:100%;height:200px;border:0;border-radius:14px;padding:12px;overflow:auto;background:#fff;outline:none">
          (AGO) - Dán nội dung vào đây
        </div>
      </div>
      <div style="padding:12px 16px;display:flex;gap:10px;justify-content:flex-end">
        <button id="cleanbox-insert">📥 Insert</button>
        <button id="cleanbox-close">✕</button>
      </div>
    `;

    __tmAppendWhenReady(cleanBox);

    const input = cleanBox.querySelector('#cleanbox-input');
    input.addEventListener('paste', function (e) {
      e.preventDefault();
      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');
      if (html) input.innerHTML = cleanWordHTML(html);
      else input.innerText = text;
    });

    document.addEventListener('click', (e) => {
      if (e.target.id === 'cleanbox-insert') {
        const ed = getEditorForCleanBox();
        if (!ed) return;

        const inp = document.getElementById('cleanbox-input');
        const html = (inp?.innerHTML || '').trim();
        if (!html) return;

        ed.focus();
        ed.insertHtml(html);
        resetCleanBox();
        closeCleanBox();
      }

      if (e.target.id === 'cleanbox-close') {
        closeCleanBox();
      }
    }, true);
  }

  function toggleCleanBox() {
    if (!cleanBox) injectCleanBox();
    cleanBoxVisible = !cleanBoxVisible;
    cleanBox.style.display = cleanBoxVisible ? 'block' : 'none';
    if (cleanBoxVisible) {
      setTimeout(() => document.getElementById('cleanbox-input')?.focus(), 0);
    }
  }

  /***********************
   * 2) HOTKEY: Alt+1 = Paste link (CRM only)
   ***********************/
  function isAltDigit(e, digit) {
    if (!e.altKey) return false;
    if (e.ctrlKey || e.metaKey) return false;

    const k = (e.key || '').toLowerCase();
    if (k === String(digit)) return true;

    const code = e.code || '';
    if (digit === 1 && (code === 'Digit1' || code === 'Numpad1')) return true;

    const kc = e.keyCode || 0;
    if (digit === 1 && (kc === 49 || kc === 97)) return true;

    return false;
  }

  function bindHotkeys(pasteFn) {
    if (window.__tm_hotkeys_bound_alt_v62) return;
    window.__tm_hotkeys_bound_alt_v62 = 1;

    window.addEventListener('keydown', async function (e) {
      if (isAltDigit(e, 1)) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (typeof pasteFn === 'function') await pasteFn();
        else toast('⚠️ Alt+1 chỉ dùng ở trang CRM');
      }
    }, true);
  }

  /***********************
   * 3) CRM: Link helper
   ***********************/
  function findLinkInput() {
    let el = document.querySelector('input[placeholder*="link" i]');
    if (el) return el;

    const nodes = document.querySelectorAll('td, label, div, span');
    for (let i = 0; i < nodes.length; i++) {
      const txt = (nodes[i].innerText || '').trim().toLowerCase();
      if (txt === 'link gốc:' || txt === 'link gốc' || txt.startsWith('link gốc') || txt === 'link:' || txt === 'link') {
        const row = nodes[i].closest('tr') || nodes[i].parentElement;
        if (row) {
          const f = row.querySelector('input, textarea');
          if (f) return f;
        }
      }
    }

    el = document.querySelector('input[name*="link" i], input[id*="link" i]');
    if (el) return el;

    return null;
  }

  function setNativeValue(el, value) {
    try {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) desc.set.call(el, value);
      else el.value = value;
    } catch (e) {
      el.value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  async function readClipboardText() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const t = await navigator.clipboard.readText();
        return (t || '').trim();
      }
    } catch (e) {}
    const manual = prompt('Không đọc được Clipboard. Dán link vào đây:');
    return (manual || '').trim();
  }

  async function pasteLinkFromClipboard() {
    if (!isCRM) { toast('⚠️ Alt+1 chỉ dùng ở trang CRM'); return; }
    const url = await readClipboardText();
    if (!url) { toast('⚠️ Clipboard trống hoặc không có link'); return; }
    const input = findLinkInput();
    if (!input) { alert('Không tìm thấy ô nhập link.'); return; }
    setNativeValue(input, url);
    input.focus();
    try { input.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
    toast('✅ Đã dán Link');
  }

  /***********************
   * 4) CKEditor: helpers
   ***********************/
  function getCK() {
    try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow.CKEDITOR) return unsafeWindow.CKEDITOR; } catch (e) {}
    return window.CKEDITOR;
  }

  function pickActiveEditor(CKEDITOR) {
    if (!CKEDITOR || !CKEDITOR.instances) return null;
    if (CKEDITOR.currentInstance) return CKEDITOR.currentInstance;

    try {
      for (var k in CKEDITOR.instances) {
        var ed = CKEDITOR.instances[k];
        if (ed && ed.focusManager && ed.focusManager.hasFocus) return ed;
      }
    } catch (e) {}

    for (var name in CKEDITOR.instances) return CKEDITOR.instances[name];
    return null;
  }

  function safeActiveEditor() {
    var CK = getCK();
    var ed = pickActiveEditor(CK);
    if (!ed) { toast('⚠️ Không tìm thấy CKEditor'); return null; }
    return { CK: CK, ed: ed };
  }



  /***********************
   * 4.5) COUNT PANEL
   ***********************/
  const LS_COUNT_PREFS_KEY = 'tm_count_panel_prefs_v1';
  let countPanelEl = null;
  let countPanelBound = false;
  let countEditorBindingTimer = null;

  function loadCountPrefs() {
    const defaults = { title: true, sapo: true, content: true };
    try {
      const raw = localStorage.getItem(LS_COUNT_PREFS_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        title: parsed && typeof parsed.title === 'boolean' ? parsed.title : true,
        sapo: parsed && typeof parsed.sapo === 'boolean' ? parsed.sapo : true,
        content: parsed && typeof parsed.content === 'boolean' ? parsed.content : true
      };
    } catch (e) {
      return defaults;
    }
  }

  function saveCountPrefs(prefs) {
    try { localStorage.setItem(LS_COUNT_PREFS_KEY, JSON.stringify(prefs || {})); } catch (e) {}
  }

  function count_normalizeSpaces(text) {
    return String(text || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function count_isAuthorLikeText(text) {
    const plain = count_normalizeSpaces(text);
    if (!plain) return false;

    if (/^(tin|bài)(\s+và|\s*,)?\s*ảnh\s*:\s*.+$/i.test(plain)) return true;

    if (/[.!?;:]$/.test(plain)) return false;
    if (plain.length > 48) return false;
    if (/\d/.test(plain)) return false;

    const words = plain.split(' ').filter(Boolean);
    if (!words.length || words.length > 4) return false;

    return words.every(function (word) {
      return /^[A-ZÀ-Ỹ][A-ZÀ-Ỹa-zà-ỹ'.-]*$/u.test(word);
    });
  }

  function count_findLastMeaningfulNode(root) {
    if (!root) return null;
    const nodes = Array.prototype.slice.call(root.querySelectorAll('p,div'));
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i];
      if (!node || !node.parentNode) continue;
      const text = count_normalizeSpaces(node.textContent || node.innerText || '');
      if (text) return node;
    }
    return null;
  }

  function count_stripAuthorTail(root) {
    if (!root) return;

    try {
      Array.prototype.slice.call(root.querySelectorAll('[data-tm-author="1"], .author')).forEach(function (el) {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      });
    } catch (e) {}

    let guard = 0;
    while (guard < 3) {
      guard += 1;
      const lastNode = count_findLastMeaningfulNode(root);
      if (!lastNode) break;

      const text = count_normalizeSpaces(lastNode.textContent || lastNode.innerText || '');
      if (!count_isAuthorLikeText(text)) break;
      if (lastNode.parentNode) lastNode.parentNode.removeChild(lastNode);
    }
  }

  function count_plainTextFromHtml(html) {
    const wrap = document.createElement('div');
    wrap.innerHTML = String(html || '');
    try {
      Array.prototype.slice.call(wrap.querySelectorAll('script,style,noscript,iframe,object')).forEach(function (el) { el.remove(); });
    } catch (e) {}
    count_stripAuthorTail(wrap);
    return count_normalizeSpaces(wrap.textContent || wrap.innerText || '');
  }

  function count_words(text) {
    const plain = count_normalizeSpaces(text);
    if (!plain) return 0;
    return plain.split(' ').filter(Boolean).length;
  }

  function count_chars(text) {
    const plain = count_normalizeSpaces(text);
    if (!plain) return 0;
    return plain.replace(/\s/g, '').length;
  }

  function count_getFieldValue(selector) {
    const el = document.querySelector(selector);
    return el ? String(el.value || '') : '';
  }

  function count_getEditorHtml() {
    try {
      const x = safeActiveEditor();
      if (x && x.ed && typeof x.ed.getData === 'function') return String(x.ed.getData() || '');
    } catch (e) {}

    try {
      const CK = getCK();
      if (CK && CK.instances) {
        for (const name in CK.instances) {
          const ed = CK.instances[name];
          if (ed && typeof ed.getData === 'function') return String(ed.getData() || '');
        }
      }
    } catch (e) {}
    return '';
  }

  function count_collectStats() {
    const titleText = count_getFieldValue('#news_title');
    const sapoText = count_getFieldValue('#news_subcontent');
    const contentText = count_plainTextFromHtml(count_getEditorHtml());

    return {
      title: { label: 'Tiêu đề', words: count_words(titleText), chars: count_chars(titleText) },
      sapo: { label: 'Sapo', words: count_words(sapoText), chars: count_chars(sapoText) },
      content: { label: 'Nội dung', words: count_words(contentText), chars: count_chars(contentText) }
    };
  }

  function count_totalWords(stats, prefs) {
    let total = 0;
    if (prefs.title) total += stats.title.words;
    if (prefs.sapo) total += stats.sapo.words;
    if (prefs.content) total += stats.content.words;
    return total;
  }

  function count_rowHtml(key, label) {
    return `
      <div class="tm-count-row" data-count-key="${key}">
        <div class="tm-count-left">
          <div class="tm-count-label">${label}</div>
          <div class="tm-count-sub">0 chữ</div>
        </div>
        <label class="tm-ios-switch tm-count-switch">
          <input type="checkbox" data-count-toggle="${key}" checked>
          <span class="tm-ios-slider"></span>
        </label>
      </div>
    `;
  }

  function ensureCountPanel() {
    if (countPanelEl) return countPanelEl;

    countPanelEl = document.createElement('div');
    countPanelEl.id = 'tm-count-panel';
    countPanelEl.className = 'tm-count-panel';
    countPanelEl.style.display = 'none';
    countPanelEl.innerHTML = `
      <div class="tm-count-head">
        <div class="tm-count-title-wrap">
          <div class="tm-count-title">Số chữ trong tin/bài</div>
        </div>
        <button type="button" class="tm-count-close" aria-label="Đóng">✕</button>
      </div>
      <div class="tm-count-body">
        ${count_rowHtml('title', 'Tiêu đề')}
        ${count_rowHtml('sapo', 'Sapo')}
        ${count_rowHtml('content', 'Nội dung')}
      </div>
      <div class="tm-count-total">
        <div>
          <div class="tm-count-total-label">TỔNG</div>
          <div class="tm-count-total-note">Chỉ tính các mục đang bật</div>
        </div>
        <div class="tm-count-total-badge">0 chữ</div>
      </div>
    `;

    __tmAppendWhenReady(countPanelEl);
    bindCountPanel();
    renderCountPanel();
    return countPanelEl;
  }

  function bindCountPanel() {
    if (!countPanelEl || countPanelBound) return;
    countPanelBound = true;

    countPanelEl.addEventListener('click', function (e) {
      const closeBtn = e.target.closest('.tm-count-close');
      if (closeBtn) {
        closeCountPanel();
        return;
      }
    }, true);

    countPanelEl.addEventListener('change', function (e) {
      const input = e.target.closest('input[data-count-toggle]');
      if (!input) return;
      const prefs = loadCountPrefs();
      prefs[input.dataset.countToggle] = !!input.checked;
      saveCountPrefs(prefs);
      renderCountPanel();
    }, true);

    document.addEventListener('mousedown', function (e) {
      if (!countPanelEl || countPanelEl.style.display === 'none') return;
      if (countPanelEl.contains(e.target)) return;
      const toolbarBtn = e.target.closest('.tm-act-count');
      if (toolbarBtn) return;
      closeCountPanel();
    }, true);

    window.addEventListener('resize', function () {
      if (countPanelEl && countPanelEl.style.display !== 'none') placeCountPanel();
    });
    window.addEventListener('scroll', function () {
      if (countPanelEl && countPanelEl.style.display !== 'none') placeCountPanel();
    }, true);

    const bindInput = function (selector) {
      const el = document.querySelector(selector);
      if (!el || el.__tmCountBound) return;
      el.__tmCountBound = 1;
      ['input', 'change', 'keyup', 'paste'].forEach(function (evt) {
        el.addEventListener(evt, renderCountPanel, true);
      });
    };

    bindInput('#news_title');
    bindInput('#news_subcontent');
    count_bindCkEditors();
  }

  function count_bindCkEditors() {
    try {
      const CK = getCK();
      if (!CK || !CK.instances) return;

      for (const name in CK.instances) {
        const ed = CK.instances[name];
        if (!ed || ed._tmCountBound) continue;
        ed._tmCountBound = 1;

        const rerender = function () { renderCountPanel(); };
        ed.on('change', rerender);
        ed.on('afterCommandExec', rerender);
        ed.on('blur', rerender);
        ed.on('contentDom', function () {
          try {
            if (ed.document && ed.document.$ && !ed.document.$.__tmCountDomBound) {
              ed.document.$.__tmCountDomBound = 1;
              ['keyup', 'paste', 'cut'].forEach(function (evt) {
                ed.document.$.addEventListener(evt, rerender, true);
              });
              ['mousedown', 'touchstart', 'focusin'].forEach(function (evt) {
                ed.document.$.addEventListener(evt, function () {
                  closeCountPanel();
                }, true);
              });
            }
          } catch (e) {}
        });

        ed.on('focus', function () {
          closeCountPanel();
        });
      }
    } catch (e) {}
  }

  function scheduleCountEditorBinding() {
    if (countEditorBindingTimer) return;
    countEditorBindingTimer = setInterval(function () {
      count_bindCkEditors();
      const CK = getCK();
      if (CK && CK.instances && Object.keys(CK.instances).length) {
        clearInterval(countEditorBindingTimer);
        countEditorBindingTimer = null;
      }
    }, 1200);
  }

  function renderCountPanel() {
    if (!countPanelEl) return;
    const prefs = loadCountPrefs();
    const stats = count_collectStats();

    ['title', 'sapo', 'content'].forEach(function (key) {
      const row = countPanelEl.querySelector('.tm-count-row[data-count-key="' + key + '"]');
      if (!row) return;
      const item = stats[key];
      const checked = !!prefs[key];
      row.classList.toggle('inactive', !checked);

      const sub = row.querySelector('.tm-count-sub');
      if (sub) sub.textContent = item.words + ' chữ';

      const toggle = row.querySelector('input[data-count-toggle="' + key + '"]');
      if (toggle) toggle.checked = checked;
    });

    const badge = countPanelEl.querySelector('.tm-count-total-badge');
    if (badge) badge.textContent = String(count_totalWords(stats, prefs));
  }

  function placeCountPanel(anchorEl) {
    if (!countPanelEl) return;
    const anchor = anchorEl || document.querySelector('.tm-act-count');
    if (!anchor) return;

    const r = anchor.getBoundingClientRect();
    const panelW = 340;
    const gap = 12;
    let left = r.left;
    let top = r.top - gap;

    countPanelEl.style.left = '0px';
    countPanelEl.style.top = '0px';
    countPanelEl.style.maxWidth = 'min(340px, calc(100vw - 24px))';

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const estimatedH = countPanelEl.offsetHeight || 280;

    left = Math.min(Math.max(12, left), Math.max(12, vw - panelW - 12));
    top = r.top - estimatedH - gap;
    if (top < 12) top = Math.min(vh - estimatedH - 12, r.bottom + gap);
    if (top < 12) top = 12;

    countPanelEl.style.left = Math.round(left) + 'px';
    countPanelEl.style.top = Math.round(top) + 'px';
  }

  function openCountPanel(anchorEl) {
    const panel = ensureCountPanel();
    renderCountPanel();
    panel.style.display = 'block';
    placeCountPanel(anchorEl);
  }

  function closeCountPanel() {
    if (!countPanelEl) return;
    countPanelEl.style.display = 'none';
  }

  function toggleCountPanel(anchorEl) {
    const panel = ensureCountPanel();
    if (panel.style.display !== 'none') closeCountPanel();
    else openCountPanel(anchorEl);
  }

  /***********************
   * 5) F2 - CENTER
   ***********************/
  var KEY_F2 = 113;

  function f2_getSelectedBlocks(editor) {
    const sel = editor.getSelection();
    if (!sel) return [];

    const ranges = sel.getRanges();
    if (!ranges || !ranges.length) return [];

    const out = [];
    const seen = new Set();

    ranges.forEach(r => {
      if (!r.collapsed && r.createIterator) {
        const it = r.createIterator();
        it.enforceRealBlocks = true;
        let p;
        while ((p = it.getNextParagraph())) {
          if (!seen.has(p.$)) {
            seen.add(p.$);
            out.push(p);
          }
        }
      }
    });

    if (out.length) return out;

    let el = sel.getStartElement();
    if (!el) return [];

    if (el.getName && el.getName() === 'img') {
      const p = el.getAscendant('p', true) || el.getAscendant('div', true);
      if (p) return [p];
    }

    const path = editor.elementPath(el);
    let block = path && path.block;
    if (!block) block = el.getAscendant('p', true);
    if (!block) block = el.getAscendant('div', true);

    return block ? [block] : [];
  }

  function f2_hardReset(block) {
    block.removeAttribute('style');
    block.removeAttribute('align');
    block.removeAttribute('class');

    const ems = block.find('em,i');
    if (ems) for (let i = ems.count() - 1; i >= 0; i--) ems.getItem(i).remove(true);

    const spans = block.find('span');
    if (spans) for (let i = spans.count() - 1; i >= 0; i--) spans.getItem(i).remove(true);
  }

  function f2_isItalic(block) {
    if (block.getStyle('font-style') === 'italic') return true;
    const ems = block.find('em,i');
    return ems && ems.count() > 0;
  }

  function f2_toggle(editor) {
    const blocks = f2_getSelectedBlocks(editor);
    if (!blocks.length) return;

    const nextIsCaption = !f2_isItalic(blocks[0]);

    editor.fire('saveSnapshot');
    blocks.forEach(b => f2_hardReset(b));

    if (nextIsCaption) {
      editor.execCommand('justifycenter');
      blocks.forEach(b => b.setStyle('font-style', 'italic'));
    } else {
      editor.execCommand('justifyleft');
    }

    editor.fire('saveSnapshot');
  }

  function setupF2(editor) {
    if (!editor || editor._f2NewBound) return;
    editor._f2NewBound = 1;

    editor.addCommand('toggleCenterItalicSafe', { exec: function (ed) { f2_toggle(ed); } });

    try {
      editor.setKeystroke(KEY_F2, 'toggleCenterItalicSafe');
      if (editor.keystrokeHandler?.keystrokes) editor.keystrokeHandler.keystrokes[KEY_F2] = 'toggleCenterItalicSafe';
    } catch (e) {}
  }


  /***********************
   * 6) FORMAT + BACKLINK
   ***********************/
  var BACKLINK_URL = 'https://baoangiang.com.vn/';
  var BACKLINK_APEC_URL = 'https://www.youtube.com/@AnGiang_News';
  var BACKLINK_LINKS_STORAGE_KEY = 'tm_backlink_links_v2';
  var BACKLINK_DEFAULT_STORAGE_KEY = 'tm_backlink_default_v2';
  var KEY_F3 = 114;
  var BACKLINK_LOCATIONS = ["An Biên", "An Châu", "An Cư", "An Minh", "An Phú", "Ba Chúc", "Bình An", "Bình Giang", "Bình Hòa", "Bình Mỹ", "Bình Sơn", "Bình Thạnh Đông", "Bình Đức", "Chi Lăng", "Châu Phong", "Châu Phú", "Châu Thành", "Châu Đốc", "Chợ Mới", "Chợ Vàm", "Cô Tô", "Cù Lao Giêng", "Cần Đăng", "Giang Thành", "Giồng Riềng", "Gò Quao", "Hà Tiên", "Hòa Hưng", "Hòa Lạc", "Hòa Thuận", "Hòa Điền", "Hòn Nghệ", "Hòn Đất", "Hội An", "Khánh Bình", "Kiên Hải", "Kiên Lương", "Long Kiến", "Long Phú", "Long Thạnh", "Long Xuyên", "Long Điền", "Mỹ Hòa Hưng", "Mỹ Thuận", "Mỹ Thới", "Mỹ Đức", "Ngọc Chúc", "Nhơn Hội", "Nhơn Mỹ", "Núi Cấm", "Phú An", "Phú Hòa", "Phú Hữu", "Phú Lâm", "Phú Quốc", "Phú Tân", "Rạch Giá", "Sơn Hải", "Sơn Kiên", "Thoại Sơn", "Thạnh Hưng", "Thạnh Lộc", "Thạnh Mỹ Tây", "Thạnh Đông", "Thổ Châu", "Thới Sơn", "Tiên Hải", "Tri Tôn", "Tân An", "Tân Châu", "Tân Hiệp", "Tân Hội", "Tân Thạnh", "Tây Phú", "Tây Yên", "Tô Châu", "Tịnh Biên", "U Minh Thượng", "Vân Khánh", "Vĩnh An", "Vĩnh Bình", "Vĩnh Gia", "Vĩnh Hanh", "Vĩnh Hòa", "Vĩnh Hòa Hưng", "Vĩnh Hậu", "Vĩnh Phong", "Vĩnh Thuận", "Vĩnh Thông", "Vĩnh Thạnh Trung", "Vĩnh Trạch", "Vĩnh Tuy", "Vĩnh Tế", "Vĩnh Xương", "Vĩnh Điều", "Óc Eo", "Ô Lâm", "Đông Hòa", "Đông Hưng", "Đông Thái", "Định Hòa", "Định Mỹ"];
  var FORMAT_IMAGE_NOTE_RE = /^(?:ảnh|nguồn ảnh|chú thích ảnh)\s*:/i;
  var FORMAT_AUTHOR_RE = /^(?:tin(?:\s*và|\s*,)\s*ảnh|bài(?:\s*và|\s*,)\s*ảnh|ảnh(?:\s*và|\s*,)\s*(?:bài|tin))\s*:/i;
  var FORMAT_NOISE_PREFIX_RE = /^(?:điểm\s*neo|anchor|mục\s*neo)\s*/i;
  var FORMAT_NOT_CAPTION_RE = /^(?:theo\b|vì vậy\b|hành trình\b|box\s*:)/i;


  function backlink_defaultLinks() {
    return [BACKLINK_URL, BACKLINK_APEC_URL];
  }

  function backlink_sanitizeUrl(url) {
    var value = String(url || '').trim();
    if (!value) return '';
    if (!/^https?:\/\//i.test(value)) value = 'https://' + value.replace(/^\/+/, '');
    try {
      var u = new URL(value);
      if (!/^https?:$/i.test(u.protocol)) return '';
      return u.href;
    } catch (e) {
      return '';
    }
  }

  function backlink_loadLinks() {
    try {
      var raw = localStorage.getItem(BACKLINK_LINKS_STORAGE_KEY);
      if (raw == null) return backlink_defaultLinks().map(backlink_sanitizeUrl).filter(Boolean);
      var list = JSON.parse(raw || '[]');
      if (!Array.isArray(list)) list = [];
      var seen = Object.create(null);
      return list.map(backlink_sanitizeUrl).filter(function (url) {
        var key = backlink_normUrl(url);
        if (!key || seen[key]) return false;
        seen[key] = 1;
        return true;
      });
    } catch (e) {
      return backlink_defaultLinks().map(backlink_sanitizeUrl).filter(Boolean);
    }
  }

  function backlink_saveLinks(list) {
    try {
      var seen = Object.create(null);
      var clean = (Array.isArray(list) ? list : []).map(backlink_sanitizeUrl).filter(function (url) {
        var key = backlink_normUrl(url);
        if (!key || seen[key]) return false;
        seen[key] = 1;
        return true;
      });
      localStorage.setItem(BACKLINK_LINKS_STORAGE_KEY, JSON.stringify(clean));
      return clean;
    } catch (e) {
      return backlink_loadLinks();
    }
  }

  function backlink_getSelectedUrl() {
    try {
      var saved = backlink_sanitizeUrl(localStorage.getItem(BACKLINK_DEFAULT_STORAGE_KEY) || '');
      var links = backlink_loadLinks();
      if (saved && links.some(function (url) { return backlink_normUrl(url) === backlink_normUrl(saved); })) return saved;
      return links[0] || backlink_sanitizeUrl(BACKLINK_APEC_URL) || backlink_sanitizeUrl(BACKLINK_URL) || '';
    } catch (e) {
      return backlink_sanitizeUrl(BACKLINK_APEC_URL) || backlink_sanitizeUrl(BACKLINK_URL) || '';
    }
  }

  function backlink_setSelectedUrl(url) {
    var clean = backlink_sanitizeUrl(url);
    if (!clean) return '';
    try { localStorage.setItem(BACKLINK_DEFAULT_STORAGE_KEY, clean); } catch (e) {}
    return clean;
  }

  function backlink_getManagedUrls() {
    var seen = Object.create(null);
    var urls = backlink_loadLinks().concat(backlink_defaultLinks().map(backlink_sanitizeUrl));
    return urls.filter(function (url) {
      var key = backlink_normUrl(url);
      if (!key || seen[key]) return false;
      seen[key] = 1;
      return true;
    });
  }

  function backlink_makeManualTargetFromSelection(text, preferredUrl) {
    var phrase = backlink_normalizeText(text || '');
    var url = backlink_sanitizeUrl(preferredUrl) || backlink_getSelectedUrl();
    if (!phrase || !url) return null;
    return { phrase: phrase, url: url, addKeyword: false };
  }

  function backlink_getState() {
    try {
      if (!window.__tmBacklinkState) {
        window.__tmBacklinkState = { suppressedLinks: Object.create(null), suppressedKeywords: Object.create(null), autoKeywords: Object.create(null), watcherBound: false };
      }
      return window.__tmBacklinkState;
    } catch (e) {
      return { suppressedLinks: Object.create(null), suppressedKeywords: Object.create(null), autoKeywords: Object.create(null), watcherBound: false };
    }
  }

  function backlink_phraseKey(phrase) {
    return backlink_normalizeText(phrase || '');
  }

  function backlink_isLinkSuppressed(phrase) {
    var key = backlink_phraseKey(phrase);
    if (!key) return false;
    var st = backlink_getState();
    return !!(st.suppressedLinks && st.suppressedLinks[key]);
  }

  function backlink_isKeywordSuppressed(phrase) {
    var key = backlink_phraseKey(phrase);
    if (!key) return false;
    var st = backlink_getState();
    return !!(st.suppressedKeywords && st.suppressedKeywords[key]);
  }

  function backlink_suppressPhrase(phrase) {
    var key = backlink_phraseKey(phrase);
    if (!key) return;
    var st = backlink_getState();
    st.suppressedLinks[key] = 1;
    st.suppressedKeywords[key] = 1;
    try { delete st.autoKeywords[key]; } catch (e) {}
  }

  function backlink_suppressKeywordOnly(phrase) {
    var key = backlink_phraseKey(phrase);
    if (!key) return;
    var st = backlink_getState();
    st.suppressedKeywords[key] = 1;
    try { delete st.autoKeywords[key]; } catch (e) {}
  }

  function backlink_markAutoKeyword(phrase) {
    var key = backlink_phraseKey(phrase);
    if (!key) return;
    backlink_getState().autoKeywords[key] = phrase;
  }

  function backlink_removeKeywordInputByPhrase(phrase) {
    if (!phrase) return;
    try {
      var input = document.getElementById('news_tag');
      if (!input) return;
      var norm = backlink_phraseKey(phrase);
      var items = String(input.value || '').split(',').map(function (x) { return String(x || '').trim(); }).filter(Boolean);
      var seen = Object.create(null);
      items = items.filter(function (x) {
        var n = backlink_phraseKey(x);
        if (!n || n === norm || seen[n]) return false;
        seen[n] = 1;
        return true;
      });
      input.value = items.length ? items.join(', ') + ', ' : '';
      try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch (e1) {}
      try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e2) {}
    } catch (e) {}
  }

  function backlink_attachKeywordWatcher() {
    try {
      var st = backlink_getState();
      var input = document.getElementById('news_tag');
      if (!input || input.__tmKeywordWatcherBound) return;
      var syncRemoved = function () {
        try {
          var current = Object.create(null);
          String(input.value || '').split(',').map(function (x) { return String(x || '').trim(); }).filter(Boolean).forEach(function (x) {
            current[backlink_phraseKey(x)] = 1;
          });
          Object.keys(st.autoKeywords || {}).forEach(function (key) {
            if (!current[key]) {
              st.suppressedKeywords[key] = 1;
              try { delete st.autoKeywords[key]; } catch (e) {}
            }
          });
        } catch (e) {}
      };
      input.addEventListener('input', syncRemoved, true);
      input.addEventListener('change', syncRemoved, true);
      input.__tmKeywordWatcherBound = 1;
    } catch (e) {}
  }

  function backlink_normUrl(u) {
    return (u || '').trim().replace(/\/+$/g, '');
  }

  function backlink_escapeRegExp(s) {
    return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function backlink_normalizeText(s) {
    return String(s || '')
      .replace(/[​-‍﻿]/g, '')
      .replace(/^[\s.,;:!?()\[\]{}'"“”‘’_-]+|[\s.,;:!?()\[\]{}'"“”‘’_-]+$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function backlink_makePhraseRe(phrase, flags) {
    var escaped = backlink_escapeRegExp(backlink_normalizeText(phrase)).replace(/\s+/g, '\\s+');
    return new RegExp('(^|[^\\p{L}\\p{N}])(' + escaped + ')(?=$|[^\\p{L}\\p{N}])', flags || 'iu');
  }

  function backlink_isManagedHref(href) {
    var h = backlink_normUrl(href);
    if (!h) return false;
    return backlink_getManagedUrls().some(function (url) {
      return h === backlink_normUrl(url);
    });
  }

  function backlink_unwrapManagedLinksInRoot(root) {
    if (!root || !root.querySelectorAll) return;
    var links = Array.prototype.slice.call(root.querySelectorAll('a[href]'));
    links.forEach(function (a) {
      if (!backlink_isManagedHref(a.getAttribute('href'))) return;
      a.replaceWith((a.ownerDocument || document).createTextNode(a.textContent || ''));
    });
  }

  function backlink_iterTextNodes(root, fn) {
    if (!root) return;
    var doc = root.ownerDocument || document;
    var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = node.parentNode;
        if (!p || !p.tagName) return NodeFilter.FILTER_ACCEPT;
        var tag = String(p.tagName).toUpperCase();
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('a')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) fn(n);
  }

  function backlink_countOccurrences(root, phrase) {
    var re = backlink_makePhraseRe(phrase, 'giu');
    var count = 0;
    var firstIndex = Infinity;
    var globalIndex = 0;
    backlink_iterTextNodes(root, function (node) {
      var text = node.nodeValue || '';
      re.lastIndex = 0;
      var m;
      while ((m = re.exec(text))) {
        var leading = (m[1] || '').length;
        var idx = m.index + leading;
        count += 1;
        var pos = globalIndex + idx;
        if (pos < firstIndex) firstIndex = pos;
        if (m[0].length === 0) re.lastIndex += 1;
      }
      globalIndex += text.length + 1;
    });
    return { count: count, firstIndex: firstIndex };
  }

  function backlink_linkFirstOccurrence(root, phrase, url) {
    var doc = root.ownerDocument || document;
    var done = false;
    backlink_iterTextNodes(root, function (node) {
      if (done) return;
      var re = backlink_makePhraseRe(phrase, 'iu');
      var text = node.nodeValue || '';
      var m = text.match(re);
      if (!m) return;
      var full = m[0] || '';
      var leading = (m[1] || '').length;
      var matched = m[2] || '';
      var start = text.indexOf(full) + leading;
      if (start < 0) return;
      var end = start + matched.length;
      var before = text.slice(0, start);
      var after = text.slice(end);
      var frag = doc.createDocumentFragment();
      if (before) frag.appendChild(doc.createTextNode(before));
      var a = doc.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.textContent = matched;
      frag.appendChild(a);
      if (after) frag.appendChild(doc.createTextNode(after));
      node.parentNode.replaceChild(frag, node);
      done = true;
    });
    return done;
  }

  function backlink_collectTargetsFromRoot(root) {
    var newsPhrase = 'Báo và Phát thanh - Truyền hình An Giang';
    var anGiang = 'An Giang';
    var apec = 'Apec';
    var targets = [];

    var newsStat = backlink_countOccurrences(root, newsPhrase);
    var anGiangStat = backlink_countOccurrences(root, anGiang);
    if (newsStat.count > 0 && !backlink_isLinkSuppressed(newsPhrase)) {
      targets.push({ phrase: newsPhrase, url: BACKLINK_URL, addKeyword: true });
    } else if (anGiangStat.count > 0 && !backlink_isLinkSuppressed(anGiang)) {
      targets.push({ phrase: anGiang, url: BACKLINK_URL, addKeyword: false });
    }

    var apecStat = backlink_countOccurrences(root, apec);
    if (apecStat.count > 0 && !backlink_isLinkSuppressed(apec)) {
      targets.push({ phrase: apec, url: BACKLINK_APEC_URL, addKeyword: true });
    }

    var bestLoc = null;
    BACKLINK_LOCATIONS.forEach(function (loc) {
      var st = backlink_countOccurrences(root, loc);
      if (!st.count || backlink_isLinkSuppressed(loc)) return;
      if (!bestLoc || st.count > bestLoc.count || (st.count === bestLoc.count && st.firstIndex < bestLoc.firstIndex)) {
        bestLoc = { phrase: loc, url: BACKLINK_URL, addKeyword: true, count: st.count, firstIndex: st.firstIndex };
      }
    });
    if (bestLoc) targets.push(bestLoc);
    return targets;
  }

  function backlink_applyToHtml(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString('<!doctype html><html><body>' + (html || '') + '</body></html>', 'text/html');
    var body = doc.body;
    backlink_unwrapManagedLinksInRoot(body);
    var targets = backlink_collectTargetsFromRoot(body);
    targets.forEach(function (target) {
      backlink_linkFirstOccurrence(body, target.phrase, target.url);
    });
    return { html: body.innerHTML, targets: targets };
  }

  function backlink_makeSource(editor) {
    var ta = editor.textarea && editor.textarea.$;
    if (!ta) return;
    var out = backlink_applyToHtml(ta.value || '');
    ta.value = out.html;
  }

  function backlink_makeWysiwyg(editor) {
    var html = '';
    try { html = editor.getData ? editor.getData() : ''; } catch (e) {}
    var out = backlink_applyToHtml(html || '');
    try { editor.setData(out.html); } catch (e) {}
  }

  function backlink_textContainsPhrase(text, phrase) {
    if (!text || !phrase) return false;
    var re = backlink_makePhraseRe(phrase, 'iu');
    return re.test(text);
  }

  function backlink_pickBestLocationFromText(text) {
    var best = null;
    BACKLINK_LOCATIONS.forEach(function (loc) {
      if (!backlink_textContainsPhrase(text, loc)) return;
      if (!best || loc.length > best.phrase.length) {
        best = { phrase: loc, url: BACKLINK_URL, addKeyword: true };
      }
    });
    return best;
  }

  function backlink_pickRuleFromText(text) {
    var t = backlink_normalizeText(text);
    if (!t) return null;

    var newsPhrase = 'Báo và Phát thanh - Truyền hình An Giang';
    var apec = 'Apec';
    var anGiang = 'An Giang';

    if (backlink_textContainsPhrase(t, newsPhrase)) {
      return { phrase: newsPhrase, url: BACKLINK_URL, addKeyword: true };
    }
    if (backlink_textContainsPhrase(t, apec)) {
      return { phrase: apec, url: BACKLINK_APEC_URL, addKeyword: true };
    }
    var bestLoc = backlink_pickBestLocationFromText(t);
    if (bestLoc) return bestLoc;
    if (backlink_textContainsPhrase(t, anGiang)) {
      return { phrase: anGiang, url: BACKLINK_URL, addKeyword: false };
    }
    return null;
  }

  function backlink_pickManualRuleFromText(text) {
    var raw = String(text || '').trim();
    if (!raw) return null;
    var matched = backlink_pickRuleFromText(raw);
    if (matched) return matched;

    var norm = backlink_normalizeText(raw);
    if (!norm) return null;

    return {
      phrase: raw,
      url: BACKLINK_URL,
      addKeyword: norm !== backlink_normalizeText('An Giang')
    };
  }

  function backlink_syncKeywordInput(target, source) {
    if (!target || !target.addKeyword || !target.phrase) return;
    try {
      backlink_attachKeywordWatcher();
      if (source === 'auto' && backlink_isKeywordSuppressed(target.phrase)) return;
      var input = document.getElementById('news_tag');
      if (!input) return;
      var raw = String(input.value || '');
      var items = raw.split(',').map(function (x) { return String(x || '').trim(); }).filter(Boolean);
      var norm = backlink_normalizeText(target.phrase);
      var seen = Object.create(null);
      var unique = [];
      items.forEach(function (x) {
        var n = backlink_normalizeText(x);
        if (!n || seen[n]) return;
        seen[n] = 1;
        unique.push(x);
      });
      if (!seen[norm]) unique.push(String(target.phrase || '').trim());
      input.value = unique.length ? unique.join(', ') + ', ' : '';
      if (source === 'auto') backlink_markAutoKeyword(target.phrase);
      try { input.dispatchEvent(new Event('input', { bubbles: true })); } catch (e1) {}
      try { input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e2) {}
    } catch (e) {}
  }

  function backlink_syncKeywordTargets(targets, source) {
    (targets || []).forEach(function (target) { backlink_syncKeywordInput(target, source || 'auto'); });
  }

  function backlink_wrapNativeRange(editor, target) {
    try {
      var win = editor && editor.window && editor.window.$;
      var sel = win && win.getSelection ? win.getSelection() : null;
      if (!sel || !sel.rangeCount) return false;
      var range = sel.getRangeAt(0);
      if (!range || range.collapsed) return false;
      var a = editor.document.$.createElement('a');
      a.setAttribute('href', target.url);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      try {
        range.surroundContents(a);
      } catch (e) {
        var frag = range.extractContents();
        a.appendChild(frag);
        range.insertNode(a);
      }
      sel.removeAllRanges();
      var nr = editor.document.$.createRange();
      nr.selectNodeContents(a);
      sel.addRange(nr);
      return true;
    } catch (e) {
      return false;
    }
  }

  function backlink_getSelectedTextWysiwyg(editor) {
    try {
      var sel = editor.getSelection && editor.getSelection();
      if (!sel) return '';
      return String(sel.getSelectedText ? (sel.getSelectedText() || '') : '').trim();
    } catch (e) {
      return '';
    }
  }

  function backlink_runManualSource(editor, preferredUrl) {
    var ta = editor && editor.textarea && editor.textarea.$;
    if (!ta) return false;
    var s = ta.selectionStart, e = ta.selectionEnd;
    if (typeof s !== 'number' || typeof e !== 'number' || e <= s) {
      toast('Hãy chọn từ để backlink');
      return false;
    }
    var selected = String((ta.value || '').slice(s, e) || '').trim();
    var target = backlink_makeManualTargetFromSelection(selected, preferredUrl);
    if (!target) {
      toast('Không nhận diện được từ để backlink');
      return false;
    }
    var original = String((ta.value || '').slice(s, e) || '');
    var linkHtml = '<a href="' + target.url + '" target="_blank" rel="noopener">' + original + '</a>';
    var val = ta.value || '';
    ta.value = val.slice(0, s) + linkHtml + val.slice(e);
    ta.selectionStart = s;
    ta.selectionEnd = s + linkHtml.length;
    backlink_syncKeywordInput(target, 'manual');
    return true;
  }

  function backlink_runManualWysiwyg(editor, CK, preferredUrl) {
    var selected = backlink_getSelectedTextWysiwyg(editor);
    if (!selected) {
      toast('Hãy chọn từ để backlink');
      return false;
    }
    var target = backlink_makeManualTargetFromSelection(selected, preferredUrl);
    if (!target) {
      toast('Không nhận diện được từ để backlink');
      return false;
    }

    var sel = editor.getSelection && editor.getSelection();
    var startEl = sel && sel.getStartElement && sel.getStartElement();
    var inAnchor = startEl && startEl.getAscendant && startEl.getAscendant('a', true);
    if (inAnchor) {
      try {
        inAnchor.setAttribute('href', target.url);
        inAnchor.setAttribute('target', '_blank');
        inAnchor.setAttribute('rel', 'noopener');
        backlink_syncKeywordInput(target);
        return true;
      } catch (e) {}
    }

    if (!backlink_wrapNativeRange(editor, target)) {
      try {
        editor.insertHtml('<a href="' + target.url + '" target="_blank" rel="noopener">' + selected + '</a>');
      } catch (e) {
        return false;
      }
    }
    backlink_syncKeywordInput(target, 'manual');
    return true;
  }

  function backlink_unwrapAnchorNode(anchor) {
    try {
      if (!anchor || !anchor.parentNode) return '';
      var txt = anchor.textContent || '';
      var tn = anchor.ownerDocument.createTextNode(txt);
      anchor.parentNode.replaceChild(tn, anchor);
      return txt;
    } catch (e) {
      return '';
    }
  }

  function backlink_tryRemoveManualSource(editor) {
    var ta = editor && editor.textarea && editor.textarea.$;
    if (!ta) return false;
    var s = ta.selectionStart, e = ta.selectionEnd;
    if (typeof s !== 'number' || typeof e !== 'number' || e <= s) return false;
    var selected = String((ta.value || '').slice(s, e) || '');
    var m = selected.match(/^\s*<a\b[^>]*href=["'][^"']+["'][^>]*>([\s\S]*?)<\/a>\s*$/i);
    if (!m) return false;
    var inner = String(m[1] || '').replace(/<[^>]+>/g, '').trim();
    var val = ta.value || '';
    ta.value = val.slice(0, s) + inner + val.slice(e);
    ta.selectionStart = s;
    ta.selectionEnd = s + inner.length;
    backlink_suppressPhrase(inner);
    backlink_removeKeywordInputByPhrase(inner);
    return true;
  }

  function backlink_tryRemoveManualWysiwyg(editor) {
    try {
      var sel = editor.getSelection && editor.getSelection();
      var startEl = sel && sel.getStartElement && sel.getStartElement();
      var inAnchor = startEl && startEl.getAscendant && startEl.getAscendant('a', true);
      if (!inAnchor || !inAnchor.$) return false;
      var phrase = backlink_unwrapAnchorNode(inAnchor.$).trim();
      if (!phrase) return false;
      backlink_suppressPhrase(phrase);
      backlink_removeKeywordInputByPhrase(phrase);
      try { editor.focus(); } catch (e) {}
      return true;
    } catch (e) {
      return false;
    }
  }

  function backlink_tryRemoveManual(editor) {
    if (!editor) return false;
    if (editor.mode === 'source') return backlink_tryRemoveManualSource(editor);
    return backlink_tryRemoveManualWysiwyg(editor);
  }

  function backlink_makeSuccessToast(preferredUrl) {
    var clean = backlink_sanitizeUrl(preferredUrl) || backlink_getSelectedUrl();
    return clean ? ('Đã backlink ' + clean) : 'Đã backlink thủ công';
  }

  function backlink_run(editor, CK, preferredUrl, opts) {
    if (!editor) return false;
    var options = opts || {};
    backlink_attachKeywordWatcher();
    try { editor.focus(); } catch (e) {}
    try { editor.fire('saveSnapshot'); } catch (e) {}
    var removed = backlink_tryRemoveManual(editor);
    if (removed) {
      try { editor.fire('saveSnapshot'); } catch (e) {}
      if (!options.silentRemoveToast) toast(options.removeMessage || 'Đã hủy backlink thủ công');
      return true;
    }
    var ok = false;
    if (editor.mode === 'source') ok = backlink_runManualSource(editor, preferredUrl);
    else ok = backlink_runManualWysiwyg(editor, CK, preferredUrl);
    try { editor.fire('saveSnapshot'); } catch (e) {}
    if (ok && !options.silentSuccessToast) toast(options.successMessage || backlink_makeSuccessToast(preferredUrl));
    return !!ok;
  }

  function setupF3(editor, CK) {
    if (!editor || editor._backlinkBoundF3) return;
    editor._backlinkBoundF3 = 1;

    editor.addCommand('makeBacklinkFixedF3', {
      exec: function (ed) { backlink_run(ed, CK); }
    });

    try {
      if (editor.setKeystroke) editor.setKeystroke(KEY_F3, 'makeBacklinkFixedF3');
      if (editor.keystrokeHandler && editor.keystrokeHandler.keystrokes) {
        editor.keystrokeHandler.keystrokes[KEY_F3] = 'makeBacklinkFixedF3';
      }
    } catch (e) {}

    editor.on('contentDom', function () {
      try {
        editor.document.$.addEventListener('keydown', function (e) {
          var kc = e.keyCode || 0;
          if (kc === KEY_F3 || e.key === 'F3') {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            backlink_run(editor, CK);
          }
        }, true);
      } catch (e) {}
    });
  }

  function format_unwrapElement(el) {
    if (!el || !el.parentNode) return;
    while (el.firstChild) el.parentNode.insertBefore(el.firstChild, el);
    el.parentNode.removeChild(el);
  }


  function format_specialTextValue(text) {
    var out = String(text || '');
    out = out.replace(/(\d)\s*m2\b/g, '$1m²');
    out = out.replace(/\bm2\b/g, 'm²');
    out = out.replace(/(\d)\s*m3\b/g, '$1m³');
    out = out.replace(/\bm3\b/g, 'm³');
    out = out.replace(/(\d)\s*cm2\b/g, '$1cm²');
    out = out.replace(/\bcm2\b/g, 'cm²');
    out = out.replace(/(\d)\s*cm3\b/g, '$1cm³');
    out = out.replace(/\bcm3\b/g, 'cm³');
    out = out.replace(/(\d)\s*km2\b/g, '$1km²');
    out = out.replace(/\bkm2\b/g, 'km²');
    out = out.replace(/(\d)\s*(?:oC|0C)\b/g, '$1⁰C');
    out = out.replace(/\b(?:oC|0C)\b/g, '⁰C');
    return out;
  }

  function format_applySpecialTermsToRoot(root) {
    if (!root || !root.ownerDocument) return;
    var doc = root.ownerDocument;
    var walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
        var p = node.parentNode;
        if (!p || !p.tagName) return NodeFilter.FILTER_ACCEPT;
        var tag = String(p.tagName).toUpperCase();
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      var next = format_specialTextValue(n.nodeValue || '');
      if (next !== n.nodeValue) n.nodeValue = next;
    }
  }

  function format_isCenteredItalic(block) {
    if (!block) return false;
    var style = String(block.getAttribute('style') || '').toLowerCase();
    var align = String(block.getAttribute('align') || '').toLowerCase();
    var centered = /text-align\s*:\s*center/.test(style) || align === 'center';
    var italic = !!block.querySelector('em,i') || /font-style\s*:\s*italic/.test(style);
    return centered && italic;
  }

  function format_isEmptyBlockNode(node) {
    if (!node) return true;
    if (node.nodeType === 3) return !String(node.nodeValue || '').trim();
    if (node.nodeType !== 1) return true;
    var tag = String(node.tagName || '').toUpperCase();
    if (tag && !/^(P|DIV|BR)$/i.test(tag)) return false;
    var clone = node.cloneNode(true);
    try { Array.prototype.slice.call(clone.querySelectorAll('img,video,iframe,table')).forEach(function (el) { el.remove(); }); } catch (e) {}
    var text = backlink_normalizeText(clone.textContent || '');
    return !text;
  }

  function format_trimTrailingEmptyBlocks(body) {
    if (!body) return;
    while (body.lastChild && format_isEmptyBlockNode(body.lastChild)) {
      body.removeChild(body.lastChild);
    }
  }

  function format_applySpecialFields() {
    ['news_title', 'news_subcontent', 'news_headline'].forEach(function (id) {
      try {
        var el = document.getElementById(id);
        if (!el) return;
        var next = format_specialTextValue(el.value || '');
        if (next !== el.value) {
          el.value = next;
          try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e1) {}
          try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e2) {}
        }
      } catch (e) {}
    });
  }

  function format_cleanupInline(root) {
    if (!root || !root.querySelectorAll) return;
    Array.prototype.slice.call(root.querySelectorAll('span,font,strong,b,i,em,u')).forEach(function (el) {
      format_unwrapElement(el);
    });
    Array.prototype.slice.call(root.querySelectorAll('*')).forEach(function (el) {
      var tag = (el.tagName || '').toUpperCase();
      if (tag === 'IMG') return;
      if (tag === 'A') {
        el.removeAttribute('style');
        el.removeAttribute('class');
        el.removeAttribute('align');
        return;
      }
      el.removeAttribute('style');
      el.removeAttribute('class');
      el.removeAttribute('align');
    });
  }

  function format_textWithoutImages(block) {
    if (!block) return '';
    var clone = block.cloneNode(true);
    Array.prototype.slice.call(clone.querySelectorAll('img')).forEach(function (img) { img.remove(); });
    return backlink_normalizeText(clone.textContent || '');
  }

  function format_hasImage(block) {
    return !!(block && block.querySelector && block.querySelector('img'));
  }

  function format_isImageNote(text) {
    return FORMAT_IMAGE_NOTE_RE.test(backlink_normalizeText(text));
  }

  function format_isAuthorText(text) {
    return FORMAT_AUTHOR_RE.test(backlink_normalizeText(text));
  }

  function format_isMarkedAuthorBlock(block) {
    if (!block) return false;
    var cls = String(block.getAttribute('class') || '').toLowerCase();
    if (cls.indexOf('author') >= 0) return true;
    return String(block.getAttribute('data-tm-author') || '') === '1';
  }

  function format_looksLikeAuthorName(text, block, idx, blocks) {
    var t = String(text || '').replace(/\s+/g, ' ').trim();
    if (!t) return false;
    if (format_hasImage(block)) return false;
    if (t.length < 3 || t.length > 90) return false;
    if (/[.!?,:;]/.test(t)) return false;

    var lastMeaningful = -1;
    (blocks || []).forEach(function (b, i) {
      var bt = backlink_normalizeText((b && b.textContent) || '');
      if (format_hasImage(b)) bt = format_textWithoutImages(b);
      if (bt && bt !== '') lastMeaningful = i;
    });
    if (idx !== lastMeaningful && idx !== (lastMeaningful - 1)) return false;

    var upper = '';
    try { upper = t.toLocaleUpperCase('vi-VN'); } catch (e) { upper = t.toUpperCase(); }
    if (t !== upper) return false;

    if (format_isRightBold(block)) return /[A-ZÀ-ỸĐ]/.test(upper);
    return /[A-ZÀ-ỸĐ]/.test(upper) && /^[A-ZÀ-ỸĐ\s\-–]+$/.test(upper);
  }

  function format_isRightBold(block) {
    if (!block) return false;
    var style = String(block.getAttribute('style') || '').toLowerCase();
    var align = String(block.getAttribute('align') || '').toLowerCase();
    var right = /text-align\s*:\s*right/.test(style) || align === 'right';
    var bold = !!block.querySelector('strong,b') || /font-weight\s*:\s*(bold|[6-9]00)/.test(style);
    return right && bold;
  }

  function format_removeNoisePrefix(text) {
    return String(text || '').replace(FORMAT_NOISE_PREFIX_RE, '').trim();
  }

  function format_removeEditorAnchors(root) {
    if (!root || !root.querySelectorAll) return;
    Array.prototype.slice.call(root.querySelectorAll('img.cke_anchor, a.cke_anchor, a[name], a[data-cke-saved-name], a[data-cke-anchor]')).forEach(function (el) {
      if (!el || !el.parentNode) return;
      var tag = String(el.tagName || '').toUpperCase();
      if (tag === 'IMG') {
        el.parentNode.removeChild(el);
        return;
      }
      var hasInternalAnchorAttr = el.hasAttribute('name') || el.hasAttribute('data-cke-saved-name') || el.hasAttribute('data-cke-anchor');
      var href = String(el.getAttribute('href') || '');
      var isInternalHref = href === '' || href === '#' || href.indexOf('#') === 0 || /^javascript:/i.test(href);
      if (hasInternalAnchorAttr || isInternalHref || /(^|\s)cke_anchor(\s|$)/i.test(String(el.getAttribute('class') || ''))) {
        format_unwrapElement(el);
      }
    });
  }

  function format_convertHeadingsToParagraphs(body) {
    Array.prototype.slice.call(body.querySelectorAll('h1,h2,h3,h4')).forEach(function (el) {
      var p = body.ownerDocument.createElement('p');
      var strong = body.ownerDocument.createElement('strong');
      Array.prototype.slice.call(el.childNodes || []).forEach(function (node) {
        strong.appendChild(node.cloneNode(true));
      });
      p.appendChild(strong);
      Array.prototype.slice.call(el.attributes || []).forEach(function (attr) {
        if (!attr || !attr.name) return;
        if (/^(class|style|align|data-)/i.test(attr.name)) p.setAttribute(attr.name, attr.value);
      });
      el.parentNode.replaceChild(p, el);
    });
  }

  function format_isBoldLike(block) {
    if (!block) return false;
    var style = String(block.getAttribute('style') || '').toLowerCase();
    return !!block.querySelector('strong,b') || /font-weight\s*:\s*(bold|[6-9]00)/.test(style);
  }

  function format_prevMeaningfulBlock(blocks, idx) {
    for (var i = idx - 1; i >= 0; i--) {
      var b = blocks[i];
      if (!b) continue;
      var hasImg = format_hasImage(b);
      var bt = backlink_normalizeText((b.textContent || ''));
      if (hasImg || bt) return b;
    }
    return null;
  }

  function format_shouldKeepSubhead(block, text) {
    var t = format_removeNoisePrefix(backlink_normalizeText(text));
    if (!t) return false;
    if (format_hasImage(block)) return false;
    if (format_isImageNote(t) || format_isAuthorText(t)) return false;
    if (t.length > 120) return false;
    if (/[.!?:]$/.test(t)) return false;
    return format_isBoldLike(block);
  }

  function format_isCaptionCandidate(text, block, prev) {
    var t = backlink_normalizeText(text);
    if (!t) return false;
    if (!prev || !format_hasImage(prev)) return false;
    if (format_isImageNote(t) || format_isAuthorText(t)) return false;
    if (FORMAT_NOT_CAPTION_RE.test(t)) return false;
    if (t.length > 260) return false;
    var style = String(block.getAttribute('style') || '').toLowerCase();
    var cls = String(block.getAttribute('class') || '').toLowerCase();
    var align = String(block.getAttribute('align') || '').toLowerCase();
    var centered = /text-align\s*:\s*center/.test(style) || align === 'center';
    var italic = !!block.querySelector('em,i') || /font-style\s*:\s*italic/.test(style);
    var noteLike = cls.indexOf('note') >= 0;
    var boldLike = format_isBoldLike(block);
    var sentenceCount = (t.match(/[.!?…](?:\s|$)/g) || []).length;
    if (sentenceCount >= 3) return false;
    if (centered || italic || noteLike) return true;
    if (!boldLike && t.length <= 180) return true;
    return false;
  }

  function format_setParagraphMode(block, mode) {
    if (!block) return;
    block.removeAttribute('class');
    block.removeAttribute('align');
    block.removeAttribute('style');
    if (mode === 'caption') {
      block.setAttribute('style', 'text-align:center;font-style:italic;');
      block.removeAttribute('data-tm-author');
      block.removeAttribute('data-tm-author-key');
    } else if (mode === 'note') {
      block.setAttribute('class', 'note ignore');
      block.setAttribute('style', 'text-align:right;font-weight:bold;');
      block.removeAttribute('data-tm-author');
      block.removeAttribute('data-tm-author-key');
    } else if (mode === 'author') {
      block.setAttribute('class', 'author ignore');
      block.setAttribute('style', 'text-align:right;font-weight:bold;');
      block.setAttribute('data-tm-author', '1');
    } else {
      block.removeAttribute('data-tm-author');
      block.removeAttribute('data-tm-author-key');
    }
  }

  function format_normalizeBlock(block, mode) {
    if (!block) return;
    format_cleanupInline(block);
    format_setParagraphMode(block, mode);
  }

  function format_restoreImageSources(body) {
    Array.prototype.slice.call(body.querySelectorAll('img')).forEach(function (img) {
      if (!img) return;
      var src = img.getAttribute('src') || '';
      var saved = img.getAttribute('data-cke-saved-src') || '';
      if (!src && saved) img.setAttribute('src', saved);
    });
  }

  function format_centerImageBlocks(body) {
    if (!body || !body.querySelectorAll) return;
    Array.prototype.slice.call(body.querySelectorAll('p,div')).forEach(function (block) {
      if (!format_hasImage(block)) return;
      var images = Array.prototype.slice.call(block.querySelectorAll('img'));
      if (!images.length) return;
      images.forEach(function (img) {
        var src = img.getAttribute('src') || '';
        var saved = img.getAttribute('data-cke-saved-src') || '';
        if (!src && saved) img.setAttribute('src', saved);
        img.style.display = 'block';
        img.style.margin = '5px auto';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      });
      block.setAttribute('style', 'text-align:center;');
      block.removeAttribute('align');
    });
  }

  function format_isWhitespaceOnlyText(text) {
    var t = String(text || '').replace(/\u00a0/g, ' ');
    t = t.replace(/[\r\n\t ]+/g, ' ').trim();
    return !t;
  }

  function format_cleanTextNodeValue(value) {
    var t = String(value || '').replace(/\u00a0/g, ' ');
    t = t.replace(/[ \t]*[\r\n]+[ \t]*/g, ' ');
    t = t.replace(/[ \t]{2,}/g, ' ');
    return t;
  }

  function format_cleanWhitespaceInBlock(block) {
    if (!block || format_hasImage(block)) return;
    var walker = block.ownerDocument.createTreeWalker(block, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      node.nodeValue = format_cleanTextNodeValue(node.nodeValue || '');
    });
  }

  function format_removeEmptyIntermediateBlocks(body) {
    Array.prototype.slice.call(body.children || []).forEach(function (block) {
      if (!block || !/^(P|DIV)$/i.test(block.tagName || '')) return;
      if (format_hasImage(block)) return;
      var html = String(block.innerHTML || '')
        .replace(/<br\s*\/?>(\s|&nbsp;|\u00a0)*/gi, '')
        .replace(/&nbsp;/gi, ' ')
        .trim();
      var text = backlink_normalizeText(block.textContent || '');
      if (!html || format_isWhitespaceOnlyText(text)) {
        if (!/<img\b/i.test(html)) block.remove();
      }
    });
  }

  function format_extractCaptionTextFromMixedImageBlock(block) {
    if (!block) return '';
    var clone = block.cloneNode(true);
    try {
      Array.prototype.slice.call(clone.querySelectorAll('img')).forEach(function (img) { img.remove(); });
    } catch (e) {}
    var raw = clone.textContent || '';
    raw = String(raw || '').replace(/\u00a0/g, ' ');
    raw = raw.replace(/[ \t]*[\r\n]+[ \t]*/g, ' ');
    raw = raw.replace(/[ 	]{2,}/g, ' ');
    return raw.trim();
  }

  function format_shouldTreatMixedImageTextAsCaption(text, block) {
    var t = backlink_normalizeText(text);
    if (!t || !block || !format_hasImage(block)) return false;
    if (format_isAuthorText(t) || format_isImageNote(t)) return false;
    if (FORMAT_NOT_CAPTION_RE.test(t)) return false;
    var sentenceCount = (t.match(/[.!?…](?:\s|$)/g) || []).length;
    if (sentenceCount >= 3) return false;
    if (t.length > 280) return false;
    return true;
  }

  function format_splitMixedImageTextBlocks(body) {
    if (!body) return;
    var blocks = Array.prototype.slice.call(body.children || []).filter(function (el) {
      return el && /^(P|DIV)$/i.test(el.tagName || '');
    });
    blocks.forEach(function (block) {
      if (!block || !format_hasImage(block)) return;
      var captionText = format_extractCaptionTextFromMixedImageBlock(block);
      if (!captionText) return;
      var imageHtml = '';
      try {
        imageHtml = Array.prototype.slice.call(block.querySelectorAll('img')).map(function (img) {
          return img.outerHTML || '';
        }).join('');
      } catch (e) {}
      if (!imageHtml) return;

      var doc = body.ownerDocument;
      var imageBlock = doc.createElement('p');
      imageBlock.innerHTML = imageHtml;

      block.parentNode.insertBefore(imageBlock, block);

      if (format_shouldTreatMixedImageTextAsCaption(captionText, block)) {
        var captionBlock = doc.createElement('p');
        captionBlock.textContent = captionText;
        block.parentNode.insertBefore(captionBlock, block.nextSibling);
      } else {
        var contentBlock = doc.createElement('p');
        contentBlock.textContent = captionText;
        block.parentNode.insertBefore(contentBlock, block.nextSibling);
      }

      block.parentNode.removeChild(block);
    });
  }

  function format_applyToHtml(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString('<!doctype html><html><body>' + (html || '') + '</body></html>', 'text/html');
    var body = doc.body;
    format_removeEditorAnchors(body);
    format_applySpecialTermsToRoot(body);
    format_convertHeadingsToParagraphs(body);
    format_restoreImageSources(body);
    format_splitMixedImageTextBlocks(body);
    format_centerImageBlocks(body);
    var blocks = Array.prototype.slice.call(body.children || []).filter(function (el) {
      return /^(P|DIV)$/i.test(el.tagName || '');
    });
    blocks.forEach(function (block, idx) {
      var text = backlink_normalizeText(block.textContent || '');
      var cleanedText = format_removeNoisePrefix(text);
      if (!format_hasImage(block)) {
        format_cleanWhitespaceInBlock(block);
        text = backlink_normalizeText(block.textContent || '');
        cleanedText = format_removeNoisePrefix(text);
        if (cleanedText !== text) {
          block.textContent = cleanedText;
          text = cleanedText;
        }
      }
      if (format_hasImage(block)) return;
      if (!text) {
        format_normalizeBlock(block, 'content');
        return;
      }
      var prevDirect = block.previousElementSibling;
      while (prevDirect && !/^(P|DIV)$/i.test(prevDirect.tagName || '')) prevDirect = prevDirect.previousElementSibling;
      var prev = prevDirect || format_prevMeaningfulBlock(blocks, idx);
      var prevHasImg = format_hasImage(prev);
      if (prevHasImg && format_isCaptionCandidate(text, block, prev)) {
        format_normalizeBlock(block, 'caption');
        return;
      }
      if (format_shouldKeepSubhead(block, text)) {
        return;
      }
      if (format_isMarkedAuthorBlock(block) || format_isAuthorText(text) || format_looksLikeAuthorName(text, block, idx, blocks)) {
        // Always normalize author blocks to a single canonical form.
        // This prevents repeated FORMAT runs from preserving nested <strong><strong>...</strong></strong>
        // or other inline wrappers copied from outside sources.
        format_normalizeBlock(block, 'author');
        return;
      }
      if (format_isImageNote(text)) {
        format_normalizeBlock(block, 'note');
        return;
      }
      format_normalizeBlock(block, 'content');
    });
    format_removeEmptyIntermediateBlocks(body);
    format_trimTrailingEmptyBlocks(body);
    return body.innerHTML;
  }

  function format_withBacklink_applyToHtml(html) {
    var formatted = format_applyToHtml(html || '');
    var out = backlink_applyToHtml(formatted || '');
    return { html: out.html, targets: out.targets || [] };
  }

  function format_run(editor, CK) {
    if (!editor) return;
    backlink_attachKeywordWatcher();
    format_applySpecialFields();
    try { editor.focus(); } catch (e) {}
    try { editor.fire('saveSnapshot'); } catch (e) {}
    var result = { html: '', targets: [] };
    if (editor.mode === 'source') {
      var ta = editor.textarea && editor.textarea.$;
      if (ta) {
        result = format_withBacklink_applyToHtml(ta.value || '');
        ta.value = result.html;
      }
    } else {
      var html = '';
      try { html = editor.getData ? editor.getData() : ''; } catch (e) {}
      result = format_withBacklink_applyToHtml(html || '');
      try { editor.setData(result.html); } catch (e) {}
    }
    backlink_syncKeywordTargets(result.targets || [], 'auto');
    try { editor.fire('saveSnapshot'); } catch (e) {}
    if (result.targets && result.targets.length) toast('Đã chuẩn hóa định dạng và backlink tự động');
    else toast('Đã chuẩn hóa định dạng');
  }


  /***********************
   * 7) F4 - AUTHOR (TOGGLE)
   ***********************/
  var KEY_F4 = 115;

  function author_genKey() {
    return 'tm_author_' + Date.now() + '_' + Math.random().toString(16).slice(2);
  }

  function author_getCurrentBlock(editor) {
    var sel = editor.getSelection && editor.getSelection();
    if (!sel) return null;

    var el = sel.getStartElement && sel.getStartElement();
    if (!el) return null;

    var block = null;
    try {
      var path = editor.elementPath && editor.elementPath(el);
      block = path && path.block;
    } catch (e) {}

    if (!block) { try { block = el.getAscendant && el.getAscendant('p', true); } catch (e) {} }
    if (!block) { try { block = el.getAscendant && el.getAscendant('div', true); } catch (e) {} }

    return block || null;
  }

  function author_isBoldBlock(block) {
    try {
      var fw = block.getStyle && block.getStyle('font-weight');
      if (fw) {
        var n = parseInt(fw, 10);
        if (fw === 'bold' || (!isNaN(n) && n >= 600)) return true;
      }
    } catch (e) {}

    try {
      var b = block.find && block.find('strong,b');
      if (b && b.count && b.count() > 0) return true;
    } catch (e) {}

    return false;
  }

  function author_looksLikeAuthor(block) {
    try {
      var ta = (block.getStyle && block.getStyle('text-align')) || '';
      ta = (ta || '').toLowerCase();
      if (ta !== 'right') return false;
    } catch (e) { return false; }
    return author_isBoldBlock(block);
  }

  function author_mark(block, key) {
    try {
      block.setAttribute('data-tm-author', '1');
      block.setAttribute('data-tm-author-key', key);
    } catch (e) {}
  }

  function author_unmark(block) {
    try {
      block.removeAttribute('data-tm-author');
      block.removeAttribute('data-tm-author-key');
    } catch (e) {}
  }

  function author_getMarkKey(block) {
    try { return block.getAttribute && block.getAttribute('data-tm-author-key'); } catch (e) { return null; }
  }

  function author_captureRangeHtml(editor, CK, range) {
    try {
      var frag = range.cloneContents();
      if (!frag) return '';

      if (typeof frag.getHtml === 'function') return frag.getHtml();

      // fallback: wrap div
      var tmp = new CK.dom.element('div', editor.document);
      try { tmp.append(frag); } catch (e) {}
      var html = '';
      try { html = tmp.getHtml ? tmp.getHtml() : (tmp.$ ? tmp.$.innerHTML : ''); } catch (e2) {}
      try { tmp.remove(); } catch (e3) {}
      return html || '';
    } catch (e) {
      return '';
    }
  }

  // Toggle: ON = căn phải + đậm + xóa phần sau + lưu để restore
  //         OFF = trả style như cũ + trả lại phần đã xóa
  function author_finalize(editor, CK) {
    if (!editor) return;

    // (tùy bạn) nếu muốn chặn source mode:
    if (editor.mode === 'source') return;

    var block = author_getCurrentBlock(editor);
    if (!block) return;

    if (!editor._tmAuthorStore) editor._tmAuthorStore = Object.create(null);

    var isMarked = false;
    try { isMarked = (block.getAttribute && block.getAttribute('data-tm-author') === '1'); } catch (e) {}

    // ===== TOGGLE OFF: đã finalize bằng script trước đó =====
    if (isMarked) {
      var key = author_getMarkKey(block);
      var st = key ? editor._tmAuthorStore[key] : null;

      try { editor.fire('saveSnapshot'); } catch (e) {}

      // restore align (style + attr)
      try {
        if (st && st.prevAlignStyle) block.setStyle('text-align', st.prevAlignStyle);
        else block.removeStyle('text-align');
      } catch (e) {}

      try {
        if (st && st.prevAlignAttr != null && st.prevAlignAttr !== '') block.setAttribute('align', st.prevAlignAttr);
        else block.removeAttribute('align');
      } catch (e) {}

      // restore bold style nếu chính script đã thêm
      try {
        if (st && st.addedBold) {
          if (st.prevFontWeightStyle) block.setStyle('font-weight', st.prevFontWeightStyle);
          else block.removeStyle('font-weight');
        }
      } catch (e) {}

      // restore phần đã xóa sau block
      if (st && st.afterHtml) {
        try {
          var rIns = new CK.dom.range(editor.document);
          rIns.setStartAfter(block);
          rIns.collapse(true);
          editor.getSelection().selectRanges([rIns]);
          editor.insertHtml(st.afterHtml);
        } catch (e) {}
      }

      author_unmark(block);
      if (key) { try { delete editor._tmAuthorStore[key]; } catch (e) {} }

      // caret về cuối block
      try {
        var r2 = new CK.dom.range(editor.document);
        r2.moveToPosition(block, CK.POSITION_BEFORE_END);
        r2.select();
      } catch (e) {}

      try { editor.fire('saveSnapshot'); } catch (e) {}
      return;
    }

    // ===== TOGGLE OFF nhẹ: block “trông như author” (do format tay/copy) =====
    if (author_looksLikeAuthor(block)) {
      try { editor.fire('saveSnapshot'); } catch (e) {}
      try { block.removeStyle('text-align'); } catch (e) {}
      try { block.removeAttribute('align'); } catch (e) {}
      try { block.removeStyle('font-weight'); } catch (e) {}
      try { editor.fire('saveSnapshot'); } catch (e) {}
      return;
    }

    // ===== TOGGLE ON: finalize + lưu trạng thái để restore =====
    var keyOn = author_genKey();

    var prevAlignStyle = '';
    var prevAlignAttr = '';
    var prevFontWeightStyle = '';
    var wasBold = false;

    try { prevAlignStyle = (block.getStyle && block.getStyle('text-align')) || ''; } catch (e) {}
    try { prevAlignAttr  = (block.getAttribute && block.getAttribute('align')) || ''; } catch (e) {}
    try { prevFontWeightStyle = (block.getStyle && block.getStyle('font-weight')) || ''; } catch (e) {}
    wasBold = author_isBoldBlock(block);

    var afterHtml = '';
    var addedBold = false;

    try {
      var body = editor.document.getBody();
      var r = new CK.dom.range(editor.document);
      r.setStartAfter(block);
      r.setEndAt(body, CK.POSITION_BEFORE_END);

      afterHtml = author_captureRangeHtml(editor, CK, r);

      try { editor.fire('saveSnapshot'); } catch (e) {}

      // set author format
      try { block.setStyle('text-align', 'right'); } catch (e) {}
      if (!wasBold) {
        try { block.setStyle('font-weight', 'bold'); addedBold = true; } catch (e) {}
      }

      // delete trailing content
      try { r.deleteContents(); } catch (e) {}

      // mark + store
      author_mark(block, keyOn);
      editor._tmAuthorStore[keyOn] = {
        prevAlignStyle: prevAlignStyle || '',
        prevAlignAttr: prevAlignAttr || '',
        prevFontWeightStyle: prevFontWeightStyle || '',
        addedBold: addedBold,
        afterHtml: afterHtml || ''
      };

      // caret về cuối block
      try {
        var r2 = new CK.dom.range(editor.document);
        r2.moveToPosition(block, CK.POSITION_BEFORE_END);
        r2.select();
      } catch (e) {}

      try { editor.fire('saveSnapshot'); } catch (e) {}
    } catch (e) {}
  }

  function setupF4(editor, CK) {
    if (!editor || editor._finalizeF4Bound) return;
    editor._finalizeF4Bound = 1;

    editor.addCommand('finalizeAuthorF4', { exec: function (ed) { author_finalize(ed, CK); } });

    try {
      if (editor.setKeystroke) editor.setKeystroke(KEY_F4, 'finalizeAuthorF4');
      if (editor.keystrokeHandler?.keystrokes) editor.keystrokeHandler.keystrokes[KEY_F4] = 'finalizeAuthorF4';
    } catch (e) {}

    editor.on('contentDom', function () {
      try {
        editor.document.$.addEventListener('keydown', function (e) {
          if (e.key === 'F4' || e.keyCode === KEY_F4) {
            e.preventDefault(); e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            author_finalize(editor, CK);
          }
        }, true);
      } catch (e) {}
    });
  }


  /***********************
   * 8) F6 - BLUE
   ***********************/
  var KEY_F6 = 117;
  var BLUE_HEX = '#0000CD';

  function blue_selectLinkIfCollapsed(editor, CK) {
    var sel = editor.getSelection && editor.getSelection();
    if (!sel) return null;

    var ranges = sel.getRanges && sel.getRanges();
    if (!ranges || !ranges.length) return null;

    var r = ranges[0];
    var el = sel.getStartElement && sel.getStartElement();
    if (!el) return null;

    var a = el.getAscendant && el.getAscendant('a', true);

    if (r.collapsed && a) {
      var nr = new CK.dom.range(editor.document);
      nr.selectNodeContents(a);
      sel.selectRanges([nr]);
    }

    return a || null;
  }

  function blue_forceStyleOnAnchor(a) {
    var st = a.getAttribute('style') || '';
    st = st.replace(/color\s*:\s*[^;]+;?/ig, '');
    st = st.replace(/font-weight\s*:\s*[^;]+;?/ig, '');
    st = st.trim();
    if (st && !st.endsWith(';')) st += ';';
    st += 'color:' + BLUE_HEX + ' !important;font-weight:bold;';
    a.setAttribute('style', st);
  }

  function blue_applyToSelection(editor, CK) {
    var style = new CK.style({ element: 'span', styles: { color: BLUE_HEX } });
    editor.applyStyle(style);
  }

  function blue_applyBoldIfNeeded(editor, CK) {
    var cmd = editor.getCommand && editor.getCommand('bold');
    if (cmd && cmd.state !== CK.TRISTATE_ON) editor.execCommand('bold');
  }

  function blue_run(editor, CK) {
    if (!editor) return;
    try { editor.focus(); } catch (e) {}

    var a = blue_selectLinkIfCollapsed(editor, CK);
    if (a) { blue_forceStyleOnAnchor(a); return; }

    blue_applyToSelection(editor, CK);
    blue_applyBoldIfNeeded(editor, CK);
  }

  function setupF6(editor, CK) {
    if (!editor || editor._f6Bound) return;
    editor._f6Bound = 1;

    editor.addCommand('f6BlueBold', { exec: function (ed) { blue_run(ed, CK); } });

    try {
      if (editor.setKeystroke) editor.setKeystroke(KEY_F6, 'f6BlueBold');
      if (editor.keystrokeHandler?.keystrokes) editor.keystrokeHandler.keystrokes[KEY_F6] = 'f6BlueBold';
    } catch (e) {}

    editor.on('contentDom', function () {
      try {
        editor.document.$.addEventListener('keydown', function (e) {
          if ((e.keyCode || 0) === KEY_F6 || e.key === 'F6') {
            e.preventDefault(); e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            blue_run(editor, CK);
          }
        }, true);
      } catch (e) {}
    });
  }

  /***********************
   * 9) F9 - OLD BOX
   ***********************/
  var KEY_F9 = 120;
  var HTML_BOX =
    '<table data-widget="table" cellspacing="1" cellpadding="1" border="1" style="width:980px">' +
      '<tbody><tr><td style="background-color:#ffff99;padding:10px;">&nbsp;</td></tr></tbody>' +
    '</table><p></p>';

  function box_insert(editor) {
    if (!editor || !editor.insertHtml) return;
    try { editor.focus(); } catch (e) {}
    editor.insertHtml(HTML_BOX);
  }

  function setupF9(editor) {
    if (!editor || editor._f9InsertBound) return;
    editor._f9InsertBound = 1;

    editor.addCommand('insertYellowTableF9', { exec: function (ed) { box_insert(ed); } });

    try {
      if (editor.setKeystroke) editor.setKeystroke(KEY_F9, 'insertYellowTableF9');
      if (editor.keystrokeHandler?.keystrokes) editor.keystrokeHandler.keystrokes[KEY_F9] = 'insertYellowTableF9';
    } catch (e) {}

    editor.on('contentDom', function () {
      try {
        editor.document.$.addEventListener('keydown', function (e) {
          if (e.key === 'F9' || e.keyCode === KEY_F9) {
            e.preventDefault(); e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            box_insert(editor);
          }
        }, true);
      } catch (e) {}
    });
  }

  /***********************
   * 9.5) F8 - QUICK BOX (NEW)
   ***********************/
  var KEY_QB_F8 = -1;        // disabled old F8 quick box
  var QB_IMG_WIDTH = 350;

  function qb_buildHtml(id) {
    return (
      `<table id="${id}" data-qb="1" border="0" align="left" cellspacing="0" cellpadding="0" ` +
      `style="width:400px;" class="cke_show_border">` +
        `<tbody><tr>` +
          `<td><br></td>` +
          `<td style="width: 20px;"><br></td>` +
        `</tr></tbody>` +
      `</table>`
    );
  }

function qb_insert(editor, CK) {
  if (!editor) return;

  if (editor.mode === 'source') {
    var ta = editor.textarea && editor.textarea.$;
    if (!ta) return;

    var htmlSrc = qb_buildHtml('');
    var s = ta.selectionStart, e = ta.selectionEnd;
    if (typeof s !== 'number' || typeof e !== 'number') return;

    var val = ta.value || '';
    ta.value = val.slice(0, s) + htmlSrc + val.slice(e);
    ta.selectionStart = ta.selectionEnd = s + htmlSrc.length;
    return;
  }

  var id = 'qb_' + Date.now() + '_' + Math.random().toString(16).slice(2);
  var html = qb_buildHtml(id);

  try { editor.focus(); } catch (e) {}
  editor.insertHtml(html);

  setTimeout(function () {
    var table = editor.document && editor.document.getById(id);
    if (!table) return;

    table.removeAttribute('id');
    var firstCell = table.findOne('td');
    if (!firstCell) return;

    var range = editor.createRange();
    range.moveToPosition(firstCell, CK.POSITION_AFTER_START);
    range.select();
  }, 0);
}


  function qb_isInsideQuickBox(node) {
    if (!node || !node.getAscendant) return false;
    const table = node.getAscendant('table', true);
    return !!(table && table.getAttribute && table.getAttribute('data-qb') === '1');
  }

  function qb_forceImgWidth(img) {
    if (!img || !img.is || !img.is('img')) return;
    img.setStyle('width', QB_IMG_WIDTH + 'px');
    img.setStyle('height', 'auto');
    img.setAttribute('width', String(QB_IMG_WIDTH));
    img.removeAttribute('height');
    img.removeStyle('height');
  }

  function qb_fixImgsInNearestQuickBox(editor) {
    const sel = editor.getSelection && editor.getSelection();
    const start = sel && sel.getStartElement && sel.getStartElement();
    if (!start) return;

    const table = start.getAscendant('table', true);
    if (!table || table.getAttribute('data-qb') !== '1') return;

    const imgs = table.find('img');
    for (let i = 0; i < imgs.count(); i++) qb_forceImgWidth(imgs.getItem(i));
  }

  function setupF8QuickBox(editor, CK) {
    if (!editor || editor._qbBoundF8) return;
    editor._qbBoundF8 = 1;

    editor.addCommand('insertQuickBoxF8', { exec: function (ed) { qb_insert(ed, CK); } });

    try {
      if (KEY_QB_F8 > 0 && editor.setKeystroke) editor.setKeystroke(KEY_QB_F8, 'insertQuickBoxF8');
      if (KEY_QB_F8 > 0 && editor.keystrokeHandler?.keystrokes) editor.keystrokeHandler.keystrokes[KEY_QB_F8] = 'insertQuickBoxF8';
    } catch (e) {}

    editor.on('contentDom', function () {
      try {
        editor.document.$.addEventListener('keydown', function (e) {
          if (KEY_QB_F8 > 0 && ((e.keyCode || 0) === KEY_QB_F8 || e.key === 'F8')) {
            e.preventDefault(); e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            qb_insert(editor, CK);
          }
        }, true);
      } catch (e) {}
    });

    if (!editor._qbImgHooked) {
      editor._qbImgHooked = true;

      editor.on('insertElement', function (evt) {
        const el = evt.data;
        if (!el) return;

        if (el.is && el.is('img')) {
          if (qb_isInsideQuickBox(el)) qb_forceImgWidth(el);
          return;
        }

        if (el.findOne) {
          const img = el.findOne('img');
          if (img && qb_isInsideQuickBox(img)) qb_forceImgWidth(img);
        }
      });

      editor.on('afterInsertHtml', function () {
        setTimeout(() => qb_fixImgsInNearestQuickBox(editor), 0);
      });

      let qbTimer = null;
      editor.on('change', function () {
        clearTimeout(qbTimer);
        qbTimer = setTimeout(() => qb_fixImgsInNearestQuickBox(editor), 150);
      });
    }
  }

  /***********************
   * 10) Init CK bindings
   ***********************/
  function initCKBindings() {
    var CK = getCK();
    if (!CK || !CK.instances) return false;

    for (var name in CK.instances) {
      setupF2(CK.instances[name], CK);
      setupF3(CK.instances[name], CK);
      setupF4(CK.instances[name], CK);
      setupF6(CK.instances[name], CK);
      setupF8QuickBox(CK.instances[name], CK);
      setupF9(CK.instances[name], CK);
    }

    CK.on('instanceReady', function (evt) {
      setupF2(evt.editor, CK);
      setupF3(evt.editor, CK);
      setupF4(evt.editor, CK);
      setupF6(evt.editor, CK);
      setupF8QuickBox(evt.editor, CK);
      setupF9(evt.editor, CK);
    });

    return true;
  }

  /***********************
   * 11) CRM Toolbar
   ***********************/
  const LS_ORDER_KEY  = 'tm_toolbar_order_v63';
const LS_HIDDEN_KEY = 'tm_toolbar_hidden_v62';
const LS_HIDDEN_ACTIONS_KEY = 'tm_toolbar_hidden_actions_v63';
const LS_SHORTCUTS_KEY = 'tm_toolbar_shortcuts_v63';
const DEFAULT_VISIBLE_ACTION_IDS = ['news','backlink','box','spellcheck','count','format','truc'];
const DEFAULT_ORDER_IDS = ['news','backlink','box','spellcheck','count','format','truc','center','author','blue'];
const BAR_H = 56;

  function loadOrder(defaultIds) {
    try {
      const raw = localStorage.getItem(LS_ORDER_KEY);
      if (!raw) return DEFAULT_ORDER_IDS.filter(id => defaultIds.includes(id));
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr) || !arr.length) throw 0;

      const seen = {};
      const out = [];
      arr.forEach(id => { if (defaultIds.includes(id) && !seen[id]) { seen[id]=1; out.push(id); } });
      defaultIds.forEach(id => { if (!seen[id]) out.push(id); });
      return out;
    } catch (e) {
      return DEFAULT_ORDER_IDS.filter(id => defaultIds.includes(id));
    }
  }

  function saveOrderFromDOM(container) {
    const ids = [];
    Array.prototype.forEach.call(container.children, function (el) {
      const id = el && el.dataset ? el.dataset.actionId : null;
      if (id) ids.push(id);
    });
    try { localStorage.setItem(LS_ORDER_KEY, JSON.stringify(ids)); } catch (e) {}
  }

  function loadHidden() {
    try { return localStorage.getItem(LS_HIDDEN_KEY) === '1'; } catch (e) { return false; }
  }
  function saveHidden(v) {
    try { localStorage.setItem(LS_HIDDEN_KEY, v ? '1' : '0'); } catch (e) {}
  }
    function loadHiddenActionIds(defaultIds) {
  try {
    const raw = localStorage.getItem(LS_HIDDEN_ACTIONS_KEY);
    if (!raw) return defaultIds.filter(id => DEFAULT_VISIBLE_ACTION_IDS.indexOf(id) === -1);
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return defaultIds.filter(id => DEFAULT_VISIBLE_ACTION_IDS.indexOf(id) === -1);
    const valid = new Set(defaultIds);
    return arr.filter(id => valid.has(id));
  } catch (e) {
    return defaultIds.filter(id => DEFAULT_VISIBLE_ACTION_IDS.indexOf(id) === -1);
  }
}

function saveHiddenActionIds(arr) {
  try {
    localStorage.setItem(LS_HIDDEN_ACTIONS_KEY, JSON.stringify(Array.from(new Set(arr))));
  } catch (e) {}
}

function loadShortcuts(defaultIds) {
  try {
    const raw = localStorage.getItem(LS_SHORTCUTS_KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== 'object') return {};
    const valid = new Set(defaultIds || []);
    const out = {};
    Object.keys(obj).forEach(id => {
      if (valid.has(id) && typeof obj[id] === 'string') {
        const norm = normalizeShortcutValue(obj[id]);
        if (norm) out[id] = norm;
      }
    });
    return out;
  } catch (e) {
    return {};
  }
}

function getDefaultShortcutMap(ACTIONS) {
  const out = {};
  (ACTIONS || []).forEach(a => {
    const norm = normalizeShortcutValue(a && a.hotkey);
    if (a && a.id && norm) out[a.id] = norm;
  });
  return out;
}

function getEffectiveShortcutMap(ACTIONS, defaultIds) {
  const custom = loadShortcuts(defaultIds);
  const defaults = getDefaultShortcutMap(ACTIONS);
  return Object.assign({}, defaults, custom);
}

function saveShortcuts(obj, defaultIds) {
  try {
    const valid = new Set(defaultIds || []);
    const clean = {};
    Object.keys(obj || {}).forEach(id => {
      if (!valid.has(id)) return;
      const norm = normalizeShortcutValue(obj[id]);
      if (norm) clean[id] = norm;
    });
    localStorage.setItem(LS_SHORTCUTS_KEY, JSON.stringify(clean));
  } catch (e) {}
}

function resetShortcutsToDefaults() {
  try { localStorage.removeItem(LS_SHORTCUTS_KEY); } catch (e) {}
}

function normalizeShortcutValue(value) {
  if (!value) return '';
  const tokens = String(value).split('+').map(s => s.trim()).filter(Boolean);
  if (!tokens.length) return '';

  const mods = [];
  let key = '';
  tokens.forEach(token => {
    const t = token.toLowerCase();
    if (t === 'ctrl' || t === 'control') { if (!mods.includes('Ctrl')) mods.push('Ctrl'); return; }
    if (t === 'shift') { if (!mods.includes('Shift')) mods.push('Shift'); return; }
    if (t === 'alt' || t === 'option') { if (!mods.includes('Alt')) mods.push('Alt'); return; }
    if (t === 'meta' || t === 'cmd' || t === 'command') { if (!mods.includes('Meta')) mods.push('Meta'); return; }
    key = normalizeShortcutKey(token);
  });

  if (!key) return '';
  const ordered = [];
  ['Ctrl','Shift','Alt','Meta'].forEach(m => { if (mods.includes(m)) ordered.push(m); });
  ordered.push(key);
  return ordered.join('+');
}

function normalizeShortcutKey(key) {
  if (!key) return '';
  const raw = String(key).trim();
  if (!raw) return '';
  const low = raw.toLowerCase();
  if (low === ' ') return 'Space';
  if (low === 'spacebar' || low === 'space') return 'Space';
  if (low === 'escape' || low === 'esc') return 'Esc';
  if (low === 'arrowup' || low === 'up') return 'ArrowUp';
  if (low === 'arrowdown' || low === 'down') return 'ArrowDown';
  if (low === 'arrowleft' || low === 'left') return 'ArrowLeft';
  if (low === 'arrowright' || low === 'right') return 'ArrowRight';
  if (/^f\d{1,2}$/i.test(raw)) return raw.toUpperCase();
  if (raw.length === 1) return raw.toUpperCase();
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

function formatShortcutDisplay(value) {
  const norm = normalizeShortcutValue(value);
  if (!norm) return '';
  return norm
    .replace(/Ctrl/g, '⌃')
    .replace(/Shift/g, '⇧')
    .replace(/Alt/g, '⌥')
    .replace(/Meta/g, '⌘')
    .replace(/ArrowUp/g, '↑')
    .replace(/ArrowDown/g, '↓')
    .replace(/ArrowLeft/g, '←')
    .replace(/ArrowRight/g, '→')
    .replace(/Esc/g, '⎋')
    .replace(/Space/g, '␣')
    .replace(/\+/g, ' ');
}

function shortcutTokensForDisplay(value) {
  const norm = normalizeShortcutValue(value);
  if (!norm) return [];
  return norm.split('+').map(part => formatShortcutDisplay(part));
}

function renderShortcutKeycaps(value) {
  const tokens = shortcutTokensForDisplay(value);
  if (!tokens.length) return '<span class="tm-shortcut-placeholder">Gán phím</span>';
  return tokens.map(t => `<span class="tm-keycap${/^[⌃⇧⌥⌘]$/.test(t) ? ' mod' : ''}">${t}</span>`).join('');
}

function comboFromEvent(e) {
  const parts = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.shiftKey) parts.push('Shift');
  if (e.altKey) parts.push('Alt');
  if (e.metaKey) parts.push('Meta');

  let key = e.key || '';
  if (!key || ['Control','Shift','Alt','Meta'].includes(key)) return '';
  key = normalizeShortcutKey(key);
  if (!key) return '';
  parts.push(key);
  return parts.join('+');
}

function isTypingTarget(node) {
  if (!node) return false;
  if (node.closest && node.closest('.tm-shortcut-input, .tm-shortcut-capture')) return true;
  if (node.isContentEditable) return true;
  const tag = (node.tagName || '').toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select';
}

function bindCustomShortcutHandlers(ACTIONS, defaultIds) {
  if (window.__tm_custom_shortcuts_bound_v63) return;
  window.__tm_custom_shortcuts_bound_v63 = 1;

  function runShortcut(e) {
    if (isTypingTarget(e.target)) return;
    const combo = comboFromEvent(e);
    if (!combo) return;

    const custom = loadShortcuts(defaultIds);
    const effective = getEffectiveShortcutMap(ACTIONS, defaultIds);
    const action = ACTIONS.find(a => effective[a.id] === combo);

    if (!action) {
      if (combo === 'F8') {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      }
      return;
    }

    const hasCustom = !!custom[action.id];
    const defaultCombo = normalizeShortcutValue(action.hotkey);
    if (hasCustom && defaultCombo && combo === defaultCombo && custom[action.id] !== defaultCombo) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    Promise.resolve().then(() => action.run && action.run()).catch(err => {
      console.error(err);
      toast('⚠️ Không chạy được phím tắt');
    });
  }

  window.addEventListener('keydown', runShortcut, true);

  const hookEditors = function () {
    try {
      const CK = getCK && getCK();
      if (!CK || !CK.instances) return;
      for (const name in CK.instances) {
        const editor = CK.instances[name];
        if (!editor || editor._tmCustomShortcutHookedV63) continue;
        editor._tmCustomShortcutHookedV63 = 1;
        editor.on('contentDom', function () {
          try {
            if (!editor.document || !editor.document.$) return;
            editor.document.$.addEventListener('keydown', runShortcut, true);
          } catch (e) {}
        });
      }
    } catch (e) {}
  };

  hookEditors();
  try {
    const CK = getCK && getCK();
    if (CK && CK.on) CK.on('instanceReady', hookEditors);
  } catch (e) {}
}

function mountCRMToolbar() {
  if (document.getElementById('tm-ckeditor-bar')) return;

  GM_addStyle(`
    .tm-bar{
      position: fixed;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
      width: fit-content;
      max-width: calc(100vw - 24px);
      display:flex;
      align-items:center;
      gap:10px;
      padding:8px 14px;
      border-radius:18px;
      background: linear-gradient(180deg, rgba(255,255,255,.38), rgba(255,255,255,.14));
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border:1px solid rgba(255,255,255,.30);
      box-shadow: 0 12px 30px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.35);
      color:#111;
      z-index:2147483647;
    }
    .tm-bar.hidden{ display:none !important; }

    .tm-actions{
      display:flex;
      align-items:center;
      gap:8px;
      flex:0 0 auto;
      min-width:0;
      overflow: visible;
    }

    .tm-act{
      display:inline-flex; align-items:center; gap:8px;
      height:38px; padding:0 12px; border-radius:999px;
      border:1px solid rgba(255,255,255,.28);
      background: rgba(255,255,255,.16);
      box-shadow: 0 6px 14px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.35);
      cursor:pointer;
      font:700 12px/1.2 "Segoe UI", Tahoma, Arial, "Noto Sans", sans-serif;
      white-space:nowrap;
      color: inherit;
    }
 .tm-act:hover{ background: rgba(255,255,255,.22); }
.tm-act:active{ transform: translateY(1px); }

/* khi reorder thì không dùng hiệu ứng active cũ nữa */
.tm-actions.reorder-on .tm-act:active{
  transform: none !important;
}
    .tm-act.dragging{ opacity:.55; }

    .tm-act-icon{
      min-width:18px; height:18px; display:inline-flex; align-items:center; justify-content:center;
      font-size:14px; line-height:1; flex:0 0 auto;
    }
    .tm-act-icon svg{ width:16px; height:16px; display:block; }
    .tm-act-icon .cke_button_icon{ margin:0 !important; }

    .tm-handle{
      width:12px; height:18px; display:inline-grid; place-items:center;
      opacity:.55; margin-left:2px; font-size:12px;
    }

    .tm-toggle{
      height:38px; width:44px; border-radius:14px;
      border:1px solid rgba(255,255,255,.28);
      background: radial-gradient(circle at 30% 28%, rgba(255,255,255,.34), rgba(255,255,255,.13) 58%, rgba(255,255,255,.10));
      box-shadow: 0 6px 14px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.35);
      display:grid; place-items:center; cursor:pointer; flex:0 0 auto;
      color: inherit;
      user-select:none;
      overflow:hidden;
      transition: transform .22s ease, background .22s ease, box-shadow .22s ease;
    }
    .tm-toggle::before{
      content:"";
      position:absolute; inset:-2px;
      border-radius:16px;
      background: linear-gradient(135deg, rgba(255,105,180,.0), rgba(124,58,237,.0), rgba(56,189,248,.0), rgba(251,191,36,.0));
      filter: blur(9px);
      opacity:0;
      pointer-events:none;
      transition: opacity .22s ease, transform .22s ease;
      z-index:0;
    }
    .tm-toggle:hover{
      background: radial-gradient(circle at 30% 28%, rgba(255,255,255,.56), rgba(255,255,255,.22) 58%, rgba(255,255,255,.14));
      box-shadow: 0 12px 26px rgba(0,0,0,.16), inset 0 1px 0 rgba(255,255,255,.5);
      transform: translateY(-1px) scale(1.08);
    }
    .tm-toggle:hover::before{
      opacity:1;
      transform: scale(1.06);
      background: linear-gradient(135deg, rgba(255,105,180,.34), rgba(124,58,237,.30), rgba(56,189,248,.30), rgba(251,191,36,.28));
    }
    .tm-toggle svg{ width:20px; height:20px; display:block; }
    .tm-toggle .tm-gear{
      position:relative;
      z-index:1;
      display:block;
      transform-origin:center;
      animation: tmGearSpin 4.6s linear infinite;
      filter: drop-shadow(0 1px 1px rgba(255,255,255,.18));
      font-size:20px;
      line-height:1;
      will-change: transform;
    }
    .tm-toggle:hover .tm-gear{
      animation-duration: 1.1s;
      transform: scale(1.12);
      filter: drop-shadow(0 0 8px rgba(255,255,255,.52)) drop-shadow(0 0 10px rgba(168,85,247,.28));
    }
    @keyframes tmGearSpin{ from{ transform: rotate(0deg); } to{ transform: rotate(360deg); } }

    .tm-toggle.fab{
      position:fixed; left:12px; bottom:12px;
      height:46px; width:46px; border-radius:16px;
      z-index:2147483647;
      box-shadow: 0 12px 28px rgba(0,0,0,.22),
                  inset 0 1px 0 rgba(255,255,255,.35);
    }

    html.tm-pad-bottom, body.tm-pad-bottom { padding-bottom:${BAR_H + 32}px !important; }

    .tm-act-box{
      background: linear-gradient(180deg, rgba(255,193,7,.35), rgba(255,193,7,.20));
      border: 1px solid rgba(255,193,7,.45);
      color:#7a4b00;
    }
    .tm-act-clean{
      background: linear-gradient(180deg, rgba(76,175,80,.38), rgba(76,175,80,.22));
      border: 1px solid rgba(76,175,80,.55);
      color:#0b3d17;
    }
    .tm-act-center{
      background: linear-gradient(180deg, rgba(244,67,54,.32), rgba(244,67,54,.18));
      border: 1px solid rgba(244,67,54,.45);
      color:#7a1b0e;
    }
    .tm-act-backlink{
      background: linear-gradient(180deg, rgba(156,39,176,.30), rgba(156,39,176,.16));
      border: 1px solid rgba(156,39,176,.42);
      color:#3f0d4a;
    }

    .tm-act-backlink.tm-act-split{ padding-right:6px; gap:0; }
    .tm-act-main{ display:inline-flex; align-items:center; gap:8px; min-width:0; }
    .tm-act-arrow{
      display:inline-flex; align-items:center; justify-content:center;
      width:28px; height:28px; margin-left:6px; border-radius:999px;
      border:1px solid rgba(255,255,255,.22);
      background: rgba(255,255,255,.18);
      font-size:11px; line-height:1; flex:0 0 auto;
      position:relative; z-index:2; pointer-events:auto;
      cursor:pointer;
    }
    .tm-act-arrow:hover{ background: rgba(255,255,255,.28); }
    .tm-backlink-panel{
      position:fixed; z-index:2147483647;
      display:grid; gap:8px;
      min-width:240px; width:max-content; max-width:min(560px, calc(100vw - 24px));
      padding:10px; border-radius:18px;
      background:
        radial-gradient(120% 90% at 15% 10%, rgba(255,255,255,.82) 0%, rgba(255,255,255,0) 55%),
        linear-gradient(165deg, rgba(250,245,255,.96) 0%, rgba(243,232,255,.9) 55%, rgba(233,213,255,.78) 100%);
      backdrop-filter: blur(24px) saturate(185%);
      -webkit-backdrop-filter: blur(24px) saturate(185%);
      border:1px solid rgba(156,39,176,.22);
      box-shadow: 0 24px 56px rgba(63,13,74,.24), inset 0 1px 0 rgba(255,255,255,.62);
      font-family:"Segoe UI", Tahoma, Arial, "Noto Sans", sans-serif;
      color:#3f0d4a;
    }
    .tm-backlink-list{ display:grid; gap:8px; max-height:min(50vh, 420px); overflow:auto; padding-right:2px; }
    .tm-backlink-item{
      display:grid; grid-template-columns:36px minmax(0,1fr) 32px 32px; align-items:center; column-gap:8px; min-width:0;
      padding:9px 10px; border-radius:14px;
      background: rgba(255,255,255,.58);
      border:1px solid rgba(156,39,176,.12);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.72);
      cursor:default;
    }
    .tm-backlink-item.dragging{ opacity:.55; }
    .tm-backlink-item.is-selected{
      background: linear-gradient(180deg, rgba(156,39,176,.24), rgba(156,39,176,.14));
      border-color: rgba(156,39,176,.34);
    }
    .tm-backlink-grip{
      display:inline-flex; align-items:center; justify-content:center;
      width:36px; height:32px; border-radius:10px;
      font-size:16px; opacity:.7; cursor:grab; user-select:none; touch-action:none;
      background: rgba(76,29,149,.06);
      border:1px solid rgba(156,39,176,.14);
      flex:0 0 auto;
    }
    .tm-backlink-grip:active{ cursor:grabbing; }
    .tm-backlink-view{
      min-width:0; width:100%; overflow:hidden; cursor:pointer;
      border-radius:10px; padding:6px 8px;
      background: rgba(255,255,255,.42);
    }
    .tm-backlink-text{
      display:block; width:100%; overflow:hidden; text-overflow:ellipsis;
      font:700 12px/1.4 "Segoe UI",Tahoma,Arial,"Noto Sans",sans-serif; color:#3f0d4a;
      white-space:nowrap;
    }
    .tm-backlink-view:hover{ background: rgba(255,255,255,.68); }
    .tm-backlink-url{
      min-width:0; width:100%; border:0; outline:none; background:transparent; display:none;
      font:700 12px/1.4 "Segoe UI",Tahoma,Arial,"Noto Sans",sans-serif; color:#3f0d4a;
      grid-column: 2 / 3;
    }
    .tm-backlink-item.is-editing .tm-backlink-view{ display:none; }
    .tm-backlink-item.is-editing .tm-backlink-url{
      display:block; white-space:normal; overflow:visible; text-overflow:clip; cursor:text;
      padding:6px 8px; border-radius:10px; background: rgba(255,255,255,.78);
      border:1px solid rgba(156,39,176,.22);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.8);
    }
    .tm-backlink-edit,
    .tm-backlink-delete{
      flex:0 0 auto; width:28px; height:28px; border-radius:10px; border:0; cursor:pointer;
      font-weight:900;
    }
    .tm-backlink-edit{
      background: rgba(76,29,149,.10); color:#6b21a8;
    }
    .tm-backlink-delete{
      background: rgba(190,24,93,.10); color:#be185d;
    }
      88%, 100% { transform: translateX(calc(-1 * var(--tm-backlink-overflow, 0px))); }
    }
    .tm-backlink-add{
      display:flex; align-items:center; justify-content:center; gap:8px;
      min-height:40px; padding:0 12px; border-radius:14px; cursor:pointer;
      border:1px dashed rgba(156,39,176,.34);
      background: rgba(255,255,255,.45); font:800 12px/1.2 "Segoe UI",Tahoma,Arial,"Noto Sans",sans-serif;
      color:#6b21a8;
    }
    .tm-act-author{
      background: linear-gradient(180deg, rgba(158,158,158,.32), rgba(158,158,158,.18));
      border: 1px solid rgba(158,158,158,.42);
      color:#333;
    }

    .tm-act-count{
      background: linear-gradient(180deg, rgba(236,72,153,.30), rgba(236,72,153,.16));
      border: 1px solid rgba(236,72,153,.42);
      color:#831843;
    }

    .tm-act-blue{
      background: linear-gradient(180deg, rgba(33,150,243,.30), rgba(33,150,243,.16));
      border: 1px solid rgba(33,150,243,.42);
      color:#083a66;
    }
    .tm-act-spellcheck{
      background: linear-gradient(180deg, rgba(77,208,225,.34), rgba(77,208,225,.18));
      border: 1px solid rgba(38,182,222,.48);
      color:#075985;
    }


    .tm-count-panel{
      position: fixed;
      z-index: 2147483647;
      width: min(340px, calc(100vw - 24px));
      border-radius: 22px;
      overflow: hidden;
      background:
        radial-gradient(120% 90% at 15% 10%, rgba(255,255,255,.78) 0%, rgba(255,255,255,0) 55%),
        linear-gradient(165deg, rgba(255,246,250,.96) 0%, rgba(252,231,243,.88) 55%, rgba(251,207,232,.76) 100%);
      backdrop-filter: blur(28px) saturate(190%);
      -webkit-backdrop-filter: blur(28px) saturate(190%);
      border: 1px solid rgba(236,72,153,.28);
      box-shadow:
        0 24px 60px rgba(131,24,67,.24),
        inset 0 1px 0 rgba(255,255,255,.62);
      font-family: "Segoe UI", Tahoma, Arial, "Noto Sans", sans-serif;
      color: #831843;
    }
    .tm-count-head{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:14px 16px 12px;
      border-bottom:1px solid rgba(236,72,153,.16);
      background: linear-gradient(180deg, rgba(255,255,255,.26), rgba(255,255,255,0));
    }
    .tm-count-title-wrap{ display:flex; align-items:center; gap:12px; min-width:0; }
.tm-count-title{ font-size:15px; font-weight:900; letter-spacing:.01em; line-height:1.2; }
    .tm-count-desc{ display:none; }
    .tm-count-close{
      width:34px; height:34px; border:0; border-radius:12px; cursor:pointer;
      background: rgba(255,255,255,.62); color:#9d174d; font-weight:900;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.72);
    }
    .tm-count-body{ padding:14px 14px 10px; display:grid; gap:10px; }
    .tm-count-row{
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      padding:12px 14px; border-radius:16px;
      background: rgba(255,255,255,.56);
      border:1px solid rgba(236,72,153,.16);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.72);
      transition: opacity .18s ease, transform .18s ease, filter .18s ease;
    }
    .tm-count-row.inactive{ opacity:.54; filter: grayscale(.08); }
    .tm-count-left{ min-width:0; }
    .tm-count-label{ font-size:14px; font-weight:900; line-height:1.15; }
    .tm-count-sub{ margin-top:4px; font-size:13px; color:rgba(131,24,67,.82); font-weight:700; }
    .tm-count-total{
      margin:0 14px 14px;
      padding:14px;
      border-radius:18px;
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      background: linear-gradient(180deg, rgba(244,114,182,.18), rgba(251,207,232,.28));
      border:1px solid rgba(236,72,153,.20);
    }
    .tm-count-total-label{ font-size:13px; font-weight:900; color:#9d174d; }
    .tm-count-total-note{ margin-top:4px; font-size:11px; color:rgba(131,24,67,.72); font-weight:700; line-height:1.35; }
    .tm-count-total-badge{
      min-width:88px; padding:10px 12px; border-radius:999px; text-align:center;
      background: linear-gradient(180deg, #ec4899 0%, #db2777 100%);
      color:#fff; font-size:15px; font-weight:900;
      box-shadow: 0 12px 24px rgba(236,72,153,.24);
    }
     /* ===== BOX MENU ===== */
    .tm-menu{
      font-family: "Segoe UI", Tahoma, Arial, "Noto Sans", sans-serif;
      position:fixed;
      z-index:2147483647;
      width: 180px;
      padding:10px;
      border-radius:18px;
      background:
        radial-gradient(120% 90% at 18% 12%, rgba(255,255,255,.72) 0%, rgba(255,255,255,0) 55%),
        linear-gradient(155deg,
          rgba(255, 249, 230, .92) 0%,
          rgba(255, 221, 140, .68) 48%,
          rgba(255, 193,   7, .34) 100%);
      backdrop-filter: blur(26px) saturate(190%);
      -webkit-backdrop-filter: blur(26px) saturate(190%);
      border:1px solid rgba(255,193,7,.42);
      box-shadow:
        0 22px 52px rgba(0,0,0,.26),
        inset 0 1px 0 rgba(255,255,255,.52);
    }

    .tm-menu-divider{
      height:2px;
      margin:10px 6px;
      border-radius:999px;
      background: linear-gradient(90deg,
        rgba(0,0,0,0),
        rgba(0,0,0,.14),
        rgba(0,0,0,0));
    }

    .tm-menu-item{
      display:flex;
      align-items:center;
      gap:10px;
      padding:10px 10px;
      border-radius:14px;
      cursor:pointer;
      user-select:none;
      border:1px solid rgba(255,255,255,.22);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.35);
    }

    .tm-menu-item:hover{ transform: translateY(-1px); }
    .tm-menu-item:active{ transform: translateY(0px); }

    .tm-mi-ico{
      width:22px; height:22px;
      display:grid; place-items:center;
      border-radius:8px;
      border:1px solid rgba(255,255,255,.30);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.35);
      flex:0 0 auto;
      font-size:13px;
    }

    .tm-menu-item[data-box="old"]{
      background: linear-gradient(180deg, rgba(255,193,7,.34), rgba(255,193,7,.18));
      border-color: rgba(255,193,7,.44);
      color:#7a4b00;
    }
    .tm-menu-item[data-box="old"]:hover{
      background: linear-gradient(180deg, rgba(255,193,7,.42), rgba(255,193,7,.20));
    }
    .tm-menu-item[data-box="old"] .tm-mi-ico{
      background: linear-gradient(180deg, rgba(255,193,7,.42), rgba(255,193,7,.22));
      border-color: rgba(255,193,7,.48);
    }

    .tm-menu-item[data-box="quick"]{
      background: linear-gradient(180deg, rgba(210,210,210,.44), rgba(160,160,160,.18));
      border-color: rgba(160,160,160,.42);
      color:#2b2b2b;
    }
    .tm-menu-item[data-box="quick"]:hover{
      background: linear-gradient(180deg, rgba(220,220,220,.50), rgba(170,170,170,.20));
    }
    .tm-menu-item[data-box="quick"] .tm-mi-ico{
      background: linear-gradient(180deg, rgba(210,210,210,.50), rgba(160,160,160,.22));
      border-color: rgba(160,160,160,.45);
    }
    .tm-menu-item[data-box="iframe"]{
  background: linear-gradient(180deg, rgba(59,130,246,.28), rgba(59,130,246,.14));
  border-color: rgba(59,130,246,.38);
  color:#0b2a55;
}
.tm-menu-item[data-box="iframe"]:hover{
  background: linear-gradient(180deg, rgba(59,130,246,.36), rgba(59,130,246,.16));
}
.tm-menu-item[data-box="iframe"] .tm-mi-ico{
  background: linear-gradient(180deg, rgba(59,130,246,.34), rgba(59,130,246,.16));
  border-color: rgba(59,130,246,.42);
}

    /* ===== SABER ===== */
    .tm-bar{ position: fixed; isolation:isolate; }

    .tm-saber{
      position:absolute;
      inset:0;
      pointer-events:none;
      z-index:1;
      border-radius:inherit;
    }

    .tm-saber svg{ width:100%; height:100%; display:block; }

.tm-saber rect{
  fill:none;

  /* dùng hue động 0..359 */
  stroke: hsla(var(--saber-h, 210), 100%, 58%, .95);

  stroke-width: 1.1;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 90 910;
  animation: tm-saber-run 3.5s linear infinite;

  transition: stroke .35s ease, filter .35s ease;

  filter:
    drop-shadow(0 0 5px hsla(var(--saber-h, 210), 100%, 58%, .45))
    drop-shadow(0 0 10px hsla(var(--saber-h, 210), 100%, 58%, .18));
}

    @keyframes tm-saber-run{
      to{ stroke-dashoffset: -1000; }
    }
    /* particles */
    .tm-particles{
      position:absolute;
      inset:-2px;
      border-radius:20px;
      overflow:hidden;
      pointer-events:none;
      z-index:0;
    }

.tm-particles span{
  position:absolute;
  bottom:-12px;
  border-radius:999px;

  background: rgba(var(--pcol-rgb, 255,193,7), .72);
  box-shadow:
    0 0 12px rgba(var(--pcol-rgb, 255,193,7), .9),
    0 0 26px rgba(var(--pcol-rgb, 255,193,7), .45);

  filter: blur(.12px);
  animation-name: tm-float;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

    .tm-bar > .tm-toggle,
    .tm-bar > .tm-actions{
      position: relative;
      z-index: 2;
    }

    @keyframes tm-float{
      0%   { transform: translateY(0) scale(.6); opacity:0; }
      12%  { opacity:1; }
      100% { transform: translateY(-78px) scale(1.15); opacity:0; }
    }

 /* ===== REORDER MODE ===== */
.tm-handle{
  display:none !important;   /* luôn ẩn dấu chấm */
}

.tm-actions.reorder-on .tm-handle{
  display:none !important;   /* bật sắp xếp cũng không hiện */
}

.tm-actions.reorder-on .tm-act{
  cursor: grab;
}

.tm-actions.reorder-on .tm-act:active{
  cursor: grabbing;
  transform: none;
}
/* ===== iOS JIGGLE MODE ===== */
@keyframes tm-ios-jiggle{
  0%   { transform: rotate(-1.7deg) translateY(0); }
  25%  { transform: rotate(1.7deg) translateY(-0.5px); }
  50%  { transform: rotate(-1.35deg) translateY(0); }
  75%  { transform: rotate(1.35deg) translateY(0.5px); }
  100% { transform: rotate(-1.7deg) translateY(0); }
}

.tm-actions.reorder-on .tm-act{
  animation: tm-ios-jiggle .38s ease-in-out infinite;
  transform-origin: center center;
}

/* cho mỗi nút lệch nhịp nhau nhìn tự nhiên hơn */
.tm-actions.reorder-on .tm-act:nth-child(odd){
  animation-duration: .36s;
}

.tm-actions.reorder-on .tm-act:nth-child(even){
  animation-duration: .42s;
}

.tm-actions.reorder-on .tm-act:nth-child(3n){
  animation-delay: -.04s;
}

.tm-actions.reorder-on .tm-act:nth-child(4n){
  animation-delay: -.08s;
}

/* khi nhấn giữ để kéo thì ngưng rung nhẹ cho dễ thao tác */
.tm-actions.reorder-on .tm-act.dragging{
  animation: none !important;
  opacity: .72;
}
/* ===== TRIANGLE MENU ===== */
.tm-tri-menu{
  position:fixed;
  z-index:2147483647;

  width: fit-content;
  max-width: calc(100vw - 24px);
  padding:8px;

  border-radius:14px;

  /* xám-glass nhẹ */
  background:
    linear-gradient(180deg, rgba(255,255,255,.34), rgba(255,255,255,.18));
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);

  border:1px solid rgba(255,255,255,.30);
  box-shadow:
    0 14px 34px rgba(0,0,0,.16),
    inset 0 1px 0 rgba(255,255,255,.35);

  color:#222;
  font: 700 13px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial;
}

.tm-tri-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 10px;
  border-radius:10px;
  cursor:pointer;
  border:1px solid rgba(255,255,255,.28);
  background: linear-gradient(180deg, rgba(255,255,255,.20), rgba(255,255,255,.10));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.30);
  color:#4a4a4a;
  white-space: nowrap;
}

.tm-tri-item + .tm-tri-item{ margin-top:6px; }

.tm-tri-item:hover{
  background: linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,.14));
  border-color: rgba(255,255,255,.34);
}

.tm-tri-item:active{
  transform: translateY(1px);
}

.tm-tri-item .ico{
  width:20px; height:20px;
  display:grid; place-items:center;
  border-radius:7px;
  background: rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.28);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.30);
  color:#666;
  flex:0 0 auto;
}
/* ===== SETTINGS PANEL / WHITE GLASS ===== */
.tm-settings{
  font-family: "Segoe UI", Tahoma, Arial, "Noto Sans", sans-serif;
  position: fixed;
  z-index: 2147483647;
  width: 344px;
  max-width: min(344px, calc(100vw - 20px));
  max-height: min(88vh, 860px);
  overflow: hidden;
  padding: 12px;
  display:flex;
  flex-direction:column;
  border-radius: 28px;
  background:
    radial-gradient(130% 120% at 18% 0%, rgba(255,255,255,.88) 0%, rgba(255,255,255,.64) 42%, rgba(255,255,255,.52) 100%),
    linear-gradient(180deg, rgba(255,255,255,.78), rgba(244,245,248,.72));
  backdrop-filter: blur(24px) saturate(170%);
  -webkit-backdrop-filter: blur(24px) saturate(170%);
  border: 1px solid rgba(255,255,255,.50);
  box-shadow:
    0 24px 56px rgba(15,23,42,.16),
    inset 0 1px 0 rgba(255,255,255,.72),
    inset 0 -1px 0 rgba(255,255,255,.22);
  color: #1f2937;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}
.tm-settings::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  background: linear-gradient(180deg, rgba(255,255,255,.28), rgba(255,255,255,0));
  pointer-events:none;
}
.tm-settings-inner{ position:relative; z-index:1; display:flex; flex-direction:column; min-height:0; flex:1 1 auto; }
.tm-settings-head{ display:flex; justify-content:center; margin-bottom:10px; flex:0 0 auto; }
.tm-settings-topbar{ display:flex; align-items:center; justify-content:center; gap:10px; width:100%; }
.tm-settings-reorder-wrap, .tm-settings-default-wrap{ display:flex; justify-content:center; }
.tm-mode-toggle{
  appearance:none; border:none; cursor:pointer; height:38px; min-width:126px; padding:0 16px;
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:999px; color:#4b5563; font-size:13px; font-weight:700; letter-spacing:.03em; font-family: "Arial", "Tahoma", "Segoe UI", sans-serif; line-height:1;
  background: linear-gradient(180deg, rgba(255,255,255,.88), rgba(227,232,239,.76));
  border:1px solid rgba(209,213,219,.9);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.85), 0 10px 24px rgba(15,23,42,.08);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, color .18s ease, filter .18s ease;
}
.tm-mode-toggle:hover{ transform:translateY(-1px); }
.tm-mode-toggle.active{
  color:#fff;
  transform: translateY(-1px) scale(1.02);
  background: linear-gradient(180deg, rgba(96,165,250,.96), rgba(59,130,246,.78));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 0 0 1px rgba(59,130,246,.18), 0 14px 28px rgba(37,99,235,.30), 0 0 22px rgba(59,130,246,.34);
  filter: saturate(115%);
  animation: tm-ios-jiggle .38s ease-in-out infinite;
}
.tm-settings-groups{ display:flex; flex-direction:column; gap:8px; flex:1 1 auto; min-height:0; }
.tm-settings-list{ display:flex; flex-direction:column; gap:8px; flex:1 1 auto; min-height:0; overflow:auto; padding-right:2px; padding-bottom:2px; }
.tm-default-toggle{
  color:#fff;
  background: linear-gradient(180deg, rgba(96,165,250,.96), rgba(59,130,246,.78));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.24), 0 0 0 1px rgba(59,130,246,.18), 0 14px 28px rgba(37,99,235,.22), 0 0 18px rgba(59,130,246,.24);
}
.tm-settings-list::-webkit-scrollbar{ width:6px; }
.tm-settings-list::-webkit-scrollbar-thumb{ background: rgba(148,163,184,.34); border-radius:999px; }
.tm-settings-row{
  display:grid;
  grid-template-columns: minmax(0,1fr) 116px 50px;
  align-items:center;
  gap:8px;
  min-height:48px;
  padding:8px 10px;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.80);
  box-shadow: 0 8px 16px rgba(15,23,42,.06), inset 0 1px 0 rgba(255,255,255,.55);
}
.tm-settings-row[data-accent="red"]{
  background: linear-gradient(180deg, rgba(244,67,54,.32), rgba(244,67,54,.18));
  border-color: rgba(244,67,54,.45);
  color:#7a1b0e;
}
.tm-settings-row[data-accent="pink"]{
  background: linear-gradient(180deg, rgba(236,72,153,.30), rgba(236,72,153,.16));
  border-color: rgba(236,72,153,.42);
  color:#831843;
}
.tm-settings-row[data-accent="violet"]{
  background: linear-gradient(180deg, rgba(156,39,176,.30), rgba(156,39,176,.16));
  border-color: rgba(156,39,176,.42);
  color:#3f0d4a;
}
.tm-settings-row[data-accent="slate"]{
  background: linear-gradient(180deg, rgba(158,158,158,.32), rgba(158,158,158,.18));
  border-color: rgba(158,158,158,.42);
  color:#333;
}
.tm-settings-row[data-accent="blue"]{
  background: linear-gradient(180deg, rgba(33,150,243,.30), rgba(33,150,243,.16));
  border-color: rgba(33,150,243,.42);
  color:#083a66;
}
.tm-settings-row[data-accent="cyan"]{
  background: linear-gradient(180deg, rgba(77,208,225,.34), rgba(77,208,225,.18));
  border-color: rgba(38,182,222,.48);
  color:#075985;
}
.tm-settings-row[data-accent="yellow"]{
  background: linear-gradient(180deg, rgba(255,193,7,.35), rgba(255,193,7,.20));
  border-color: rgba(255,193,7,.45);
  color:#7a4b00;
}
.tm-settings-row[data-accent="green"]{
  background: linear-gradient(180deg, rgba(76,175,80,.38), rgba(76,175,80,.22));
  border-color: rgba(76,175,80,.55);
  color:#0b3d17;
}
.tm-settings-row[data-accent="black"]{
  background: linear-gradient(180deg, rgba(96,96,96,.34), rgba(62,62,62,.18));
  border-color: rgba(66,66,66,.45);
  color:#111;
}
.tm-settings-meta{ min-width:0; }
.tm-settings-check-label{ display:block; font-size:14px; font-weight:800; color: currentColor; letter-spacing:.01em; line-height:1.05; }
.tm-shortcut-capture{
  min-width:0; width:100%; height:34px; padding:4px 7px; border-radius:12px; outline:none;
  border:1px solid rgba(255,255,255,.42);
  background: rgba(255,255,255,.20);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.45);
  display:flex; align-items:center; justify-content:center; gap:4px;
  color:inherit; cursor:text;
}
.tm-shortcut-capture:focus{
  border-color: rgba(59,130,246,.55);
  box-shadow: 0 0 0 3px rgba(59,130,246,.14), inset 0 1px 0 rgba(255,255,255,.55);
}
.tm-shortcut-placeholder{ font-size:11px; font-weight:700; color:rgba(31,41,55,.42); }
.tm-keycap{
  min-width:22px; height:22px; padding:0 6px; border-radius:8px;
  display:inline-flex; align-items:center; justify-content:center;
  background: linear-gradient(180deg, rgba(255,255,255,.98), rgba(241,245,249,.92));
  border:1px solid rgba(148,163,184,.30);
  color:#334155; font-size:11px; font-weight:800; line-height:1;
  box-shadow: 0 1px 0 rgba(255,255,255,.65), 0 2px 6px rgba(15,23,42,.10);
}
.tm-keycap.mod{ color:#0f172a; }
.tm-ios-switch{ position:relative; width:48px; height:28px; justify-self:end; }
.tm-ios-switch input{ position:absolute; inset:0; opacity:0; margin:0; width:100%; height:100%; cursor:pointer; z-index:2; }
.tm-ios-slider{
  position:absolute; inset:0; border-radius:999px;
  background: rgba(148,163,184,.42);
  border:1px solid rgba(255,255,255,.42);
  box-shadow: inset 0 0 0 1px rgba(15,23,42,.08);
  transition: background .22s ease, box-shadow .22s ease;
}
.tm-ios-slider::after{
  content:""; position:absolute; top:2px; left:2px; width:22px; height:22px; border-radius:50%;
  background: linear-gradient(180deg, rgba(255,255,255,.98), rgba(235,239,245,.94));
  box-shadow: 0 2px 10px rgba(15,23,42,.20);
  transition: transform .24s cubic-bezier(.22,.8,.2,1);
}
.tm-ios-switch input:checked + .tm-ios-slider{ background: linear-gradient(180deg, rgba(59,130,246,.95), rgba(37,99,235,.78)); box-shadow: inset 0 0 0 1px rgba(37,99,235,.14), 0 8px 18px rgba(37,99,235,.18); }
.tm-ios-switch input:checked + .tm-ios-slider::after{ transform: translateX(20px); }
.tm-lich-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.45);
  backdrop-filter: blur(4px);
}
.tm-lich-modal{
  position:fixed;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%) scale(.95);
  width:min(1100px,90vw);
  max-height:85vh;
  background:#fff;
  border-radius:20px;
  box-shadow:0 30px 70px rgba(0,0,0,.4);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  opacity:0;
  transition:all .25s cubic-bezier(.2,.8,.2,1);
}

.tm-lich-modal.show{
  opacity:1;
  transform:translate(-50%,-50%) scale(1);
}
.tm-role-icon{
  width:50px;
  height:50px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
}

/* 🎨 MÀU RIÊNG */
.tm-lich-content{
  padding:20px;
  overflow:auto;
  font-size:14px;
}

/* ===== DASHBOARD STYLE ===== */

.tm-lich-content table{
  width:100%;
  border-collapse:separate;
  border-spacing:0;
  background:#ffffff;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 15px 40px rgba(0,0,0,.08);
  font-size:14px;
}

.tm-lich-content thead{
  background:#1e293b;
  color:#fff;
}

.tm-lich-content th{
  padding:14px 12px;
  text-align:left;
  font-size:13px;
  font-weight:700;
  letter-spacing:.4px;
  border:none;
}

.tm-lich-content td{
  padding:12px;
  border-bottom:1px solid #f1f1f1;
  transition:all .15s ease;
}

.tm-lich-content tbody tr:nth-child(even){
  background:#f8fafc;
}

.tm-lich-content tbody tr:hover{
  background:#eaf4ff;
}

.tm-lich-content td:first-child{
  font-weight:600;
  color:#334155;
  width:120px;
}

.tm-lich-content td:nth-child(2){
  font-weight:600;
  color:#0f172a;
}

.tm-lich-content td:nth-child(4){
  font-weight:600;
  color:#2563eb;
}

/* ===== LỊCH TRỰC - TODAY HIGHLIGHT ===== */
.tm-lich-today{
  background: #fff8d6 !important;
  position: relative;
  box-shadow: 0 0 0 3px #ff3b3b inset,
              0 0 18px rgba(255,0,0,.25);
  border-radius: 8px;
  transition: all .3s ease;
}
/* ===== LEVEL 4 NEWSROOM ===== */

.tm-role-card{
  display:flex;
  align-items:center;
  gap:14px;
  padding:14px;
  border-radius:16px;
  margin-bottom:12px;
  background:#f8fafc;
  transition:.2s;
  box-shadow:0 8px 20px rgba(0,0,0,.06);
}

.tm-clock-lunar{
  grid-column: 1 / 3;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,.78);
  font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial;
  margin-top: -4px;
}

.tm-progress-bar{
  height:100%;
  width:0%;
  transition:width .4s;
}

/* =========================
   iOS THEME - LỊCH TRỰC
   (override only)
========================= */

:root{
  --ios-card: rgba(255,255,255,.72);
  --ios-text: #111827;
  --ios-sub: #6b7280;
  --ios-shadow: 0 10px 30px rgba(0,0,0,.12);
  --ios-shadow-soft: 0 6px 18px rgba(0,0,0,.08);
}
/* overlay + modal */
.tm-lich-overlay{
  background: rgba(15,23,42,.35) !important;
  backdrop-filter: blur(10px) saturate(140%);
  -webkit-backdrop-filter: blur(10px) saturate(140%);
}

.tm-lich-modal{
  width: min(1180px, 92vw) !important;
  max-height: 88vh !important;
  border-radius: 24px !important;
  background:
    linear-gradient(180deg, rgba(255,255,255,.88), rgba(255,255,255,.72)) !important;
  border: 1px solid rgba(255,255,255,.65);
  box-shadow:
    0 28px 80px rgba(0,0,0,.22),
    inset 0 1px 0 rgba(255,255,255,.75) !important;
  overflow: hidden;
}
.tm-lich-content{
  padding: 16px !important;
  background:
    radial-gradient(1200px 300px at 10% -20%, rgba(59,130,246,.10), transparent 60%),
    radial-gradient(1200px 300px at 90% -10%, rgba(16,185,129,.10), transparent 60%),
    linear-gradient(180deg, rgba(248,250,252,.85), rgba(241,245,249,.75));
}
/* top dashboard row */
.tm-lich-banner{
  display: grid !important;
  grid-template-columns: 1.05fr 1fr 1.35fr 1fr;
  gap: 12px !important;
  margin: 0 0 14px 0 !important;
  align-items: stretch;
}
@media (max-width: 980px){
  .tm-lich-banner{
    grid-template-columns: 1fr 1fr;
  }
}
/* status card */
.tm-news-status{
  border-radius: 18px !important;
  padding: 14px 12px !important;
  min-height: 86px;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  font-weight: 800 !important;
  font-size: 13px !important;
  line-height: 1.2 !important;
  letter-spacing: .3px;
  border: 1px solid rgba(255,255,255,.55);
  box-shadow: var(--ios-shadow-soft);
  background: var(--ios-card) !important;
  color: var(--ios-text) !important;
  position: relative;
  overflow: hidden;
}
.tm-news-status::before{
  content:"";
  position:absolute;
  inset:0;
  background: linear-gradient(180deg, rgba(255,255,255,.42), rgba(255,255,255,.12));
  pointer-events:none;
}

.tm-status-warning{
  background:
    linear-gradient(180deg, rgba(250,204,21,.28), rgba(250,204,21,.14)) !important;
  color:#854d0e !important;
  animation: none !important;
}
/* role cards */
.tm-role-card{
  margin: 0 !important;
  border-radius: 18px !important;
  padding: 12px 14px !important;
  gap: 12px !important;
  background: var(--ios-card) !important;
  border: 1px solid rgba(255,255,255,.55);
  box-shadow: var(--ios-shadow-soft) !important;
  min-height: 86px;
  display:flex;
  align-items:center;
}
.tm-role-card:hover{
  transform: none !important;
  box-shadow: var(--ios-shadow-soft) !important;
}
.tm-role-icon{
  width: 42px !important;
  height: 42px !important;
  border-radius: 999px !important;
  color: #fff !important;
  border: 1px solid rgba(255,255,255,.38);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.35),
    0 4px 10px rgba(0,0,0,.10) !important;
  flex: 0 0 auto;
}

.tm-role-icon svg{
  width: 20px !important;
  height: 20px !important;
}

.tm-role-icon.tm-role-publish{
  background: linear-gradient(180deg, #ff7a1a, #ff5a00) !important;
}
.tm-role-icon.tm-role-edit{
  background: linear-gradient(180deg, #3b82f6, #2563eb) !important;
}
.tm-role-icon.tm-role-tech{
  background: linear-gradient(180deg, #10b981, #059669) !important;
}

.tm-role-title{
  font-size: 12px !important;
  font-weight: 700 !important;
  color: var(--ios-sub) !important;
  margin-bottom: 2px;
}

.tm-role-name{
  font-size: 13px;
  font-weight: 800;
  color: var(--ios-text);
  line-height: 1.15;
  word-break: break-word;
}

/* clock panel (iOS card) */
.tm-clock-panel{
  grid-column: 1 / -1;
  margin-top: 0 !important;
  border-radius: 18px !important;
  padding: 12px 14px !important;
  background: rgba(17,24,39,.78) !important;
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 10px 22px rgba(0,0,0,.18) !important;
  color: #e5f7ff !important;
  text-align: left !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 10px 14px;
  align-items: center;
}

.tm-clock-panel > div:nth-child(1),
.tm-clock-panel > div:nth-child(2){
  font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial;
  font-weight: 700;
  color: rgba(255,255,255,.86);
  margin: 0 !important;
}

.tm-clock-time{
  grid-column: 3;
  justify-self: end;
  font-size: 22px !important;
  font-weight: 800 !important;
  color: #8be9ff !important;
  text-shadow: 0 0 8px rgba(139,233,255,.45) !important;
  letter-spacing: .6px;
}

.tm-clock-countdown{
  grid-column: 1 / -1;
  margin-top: -2px;
  font-size: 12px !important;
  color: #fde68a !important;
  font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial;
  font-weight: 700;
}

.tm-progress{
  grid-column: 1 / -1;
  margin-top: 0 !important;
  height: 8px !important;
  border-radius: 999px;
  background: rgba(255,255,255,.12) !important;
  overflow: hidden;
}

.tm-progress-bar{
  background: linear-gradient(90deg, #22c55e, #3b82f6) !important;
  border-radius: 999px;
}

/* table iOS style */
.tm-lich-wrap{
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255,255,255,.55);
  border: 1px solid rgba(255,255,255,.62);
  box-shadow: var(--ios-shadow);
}

.tm-lich-table{
  width: 100%;
  border-collapse: separate !important;
  border-spacing: 0 !important;
  background: transparent !important;
  font-size: 13px !important;
}

.tm-lich-table thead th{
  position: sticky;
  top: 0;
  z-index: 2;
  background:
    linear-gradient(180deg, rgba(255,255,255,.92), rgba(248,250,252,.88)) !important;
  color: #475569 !important;
  font-weight: 800 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: .4px;
  border-bottom: 1px solid rgba(148,163,184,.22) !important;
  padding: 12px 10px !important;
}

.tm-lich-table td{
  background: rgba(255,255,255,.62);
  border-bottom: 1px solid rgba(148,163,184,.12) !important;
  color: #0f172a;
  padding: 11px 10px !important;
  vertical-align: top;
  line-height: 1.35;
}

.tm-lich-table tbody tr:nth-child(even) td{
  background: rgba(248,250,252,.72) !important;
}

.tm-lich-table tbody tr:hover td{
  background: rgba(239,246,255,.86) !important;
}

.tm-lich-table td:first-child{
  font-weight: 800 !important;
  color: #334155 !important;
  width: 120px;
}

/* ===== FONT FIX (Vietnamese-friendly) ===== */
.tm-lich-modal,
.tm-lich-content,
.tm-lich-banner,
.tm-news-status,
.tm-role-card,
.tm-role-title,
.tm-role-name,
.tm-lich-wrap,
.tm-lich-table,
.tm-lich-table th,
.tm-lich-table td,
.tm-clock-countdown {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    "Liberation Sans",
    Tahoma,
    sans-serif !important;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Clock số giữ kiểu mono cho đẹp */
.tm-clock-time {
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    "Liberation Mono",
    monospace !important;
}

/* Nếu chữ đậm bị lỗi nét, hạ weight chút */
.tm-role-name,
.tm-news-status,
.tm-lich-table td:first-child {
  font-weight: 700 !important;
}
/* =========================
   PATCH iOS LỊCH TRỰC (STATUS + CARDS)
========================= */

/* --- chấm trạng thái nhấp nháy --- */
@keyframes tm-dot-blink{
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .35; transform: scale(.86); }
}

/* ô trạng thái */
.tm-news-status{
  position: relative;
  justify-content: flex-start !important;
  padding: 14px 14px !important;
  gap: 8px;
  font-weight: 800 !important;
  letter-spacing: .2px;
  border-radius: 18px !important;
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
}

/* chấm trạng thái (hỗ trợ cả span cũ lẫn span có class mới) */
.tm-news-status .tm-status-dot,
.tm-news-status > span:first-child{
  width: 9px !important;
  height: 9px !important;
  min-width: 9px;
  min-height: 9px;
  border-radius: 999px !important;
  margin-right: 0 !important;
  display: inline-block !important;
  animation: tm-dot-blink .95s infinite ease-in-out;
}

/* ĐANG GIỜ HÀNH CHÍNH -> đỏ */
.tm-status-work{
  background: linear-gradient(180deg, rgba(220,38,38,.18), rgba(127,29,29,.14)) !important;
  border: 1px solid rgba(220,38,38,.28) !important;
  color: #991b1b !important;
  box-shadow:
    0 8px 22px rgba(127,29,29,.10),
    inset 0 1px 0 rgba(255,255,255,.45) !important;
}
.tm-status-work .tm-status-dot,
.tm-status-work > span:first-child{
  background: #ff3b30 !important;
  box-shadow:
    0 0 0 4px rgba(255,59,48,.12),
    0 0 12px rgba(255,59,48,.55) !important;
}

/* NGOÀI GIỜ -> đen + chấm trắng */
.tm-status-after{
  background: linear-gradient(180deg, rgba(17,24,39,.88), rgba(2,6,23,.88)) !important;
  border: 1px solid rgba(255,255,255,.10) !important;
  color: #f8fafc !important;
  box-shadow:
    0 10px 24px rgba(0,0,0,.20),
    inset 0 1px 0 rgba(255,255,255,.05) !important;
}
.tm-status-after .tm-status-dot,
.tm-status-after > span:first-child{
  background: #ffffff !important;
  box-shadow:
    0 0 0 4px rgba(255,255,255,.10),
    0 0 12px rgba(255,255,255,.45) !important;
}

.tm-status-warning{
  background: linear-gradient(180deg, rgba(250,204,21,.20), rgba(202,138,4,.10)) !important;
  border: 1px solid rgba(250,204,21,.26) !important;
  color: #854d0e !important;
}
.tm-status-warning .tm-status-dot,
.tm-status-warning > span:first-child{
  background: #facc15 !important;
  box-shadow: 0 0 10px rgba(250,204,21,.45) !important;
}

/* --- 3 ô vai trò: glass iOS + tint theo màu icon --- */
.tm-role-card{
  background: rgba(255,255,255,.58) !important;
  border: 1px solid rgba(255,255,255,.56) !important;
  border-radius: 18px !important;
  backdrop-filter: blur(14px) saturate(155%);
  -webkit-backdrop-filter: blur(14px) saturate(155%);
  box-shadow:
    0 8px 20px rgba(0,0,0,.06),
    inset 0 1px 0 rgba(255,255,255,.55) !important;
}

/* tint nền theo icon (Chrome hỗ trợ :has tốt) */
.tm-role-card:has(.tm-role-icon.tm-role-publish){
  background:
    linear-gradient(180deg, rgba(255,122,26,.10), rgba(255,255,255,.55)) !important;
  border-color: rgba(255,122,26,.18) !important;
}
.tm-role-card:has(.tm-role-icon.tm-role-edit){
  background:
    linear-gradient(180deg, rgba(59,130,246,.10), rgba(255,255,255,.55)) !important;
  border-color: rgba(59,130,246,.18) !important;
}
.tm-role-card:has(.tm-role-icon.tm-role-tech){
  background:
    linear-gradient(180deg, rgba(16,185,129,.10), rgba(255,255,255,.55)) !important;
  border-color: rgba(16,185,129,.18) !important;
}

/* tiêu đề role in đậm */
.tm-role-title{
  font-weight: 800 !important;
  font-size: 12px !important;
  text-transform: uppercase;
  letter-spacing: .35px;
  color: #475569 !important;
}

/* tên người rõ hơn */
.tm-role-name{
  font-weight: 700 !important;
  color: #111827 !important;
  line-height: 1.18;
}
/* ===== Đồng bộ màu cột với các ô phía trên ===== */

/* Cột Xuất bản -> tông cam */
.tm-lich-table td:nth-child(2){
  color: #9a3412 !important;
  font-weight: 600 !important;
}

/* Cột Biên tập -> tông xanh dương */
.tm-lich-table td:nth-child(3){
  color: #1d4ed8 !important;
  font-weight: 600 !important;
}

/* Cột Kỹ thuật (cột phải) -> tông xanh lá */
.tm-lich-table td:nth-child(4){
  color: #047857 !important;
  font-weight: 700 !important;
}

/* (tuỳ chọn) Header cũng tint nhẹ theo cột */
.tm-lich-table th:nth-child(2){ color: #c2410c !important; }
.tm-lich-table th:nth-child(3){ color: #1d4ed8 !important; }
.tm-lich-table th:nth-child(4){ color: #047857 !important; }
/* ===== Đổi màu TÊN NGƯỜI ở 3 ô trên (giữ nguyên title) ===== */

/* Xuất bản -> cam */
.tm-role-card .tm-role-icon.tm-role-publish + div .tm-role-name{
  color: #c2410c !important;
}

/* Biên tập -> xanh dương */
.tm-role-card .tm-role-icon.tm-role-edit + div .tm-role-name{
  color: #1d4ed8 !important;
}

/* Kỹ thuật -> xanh lá */
.tm-role-card .tm-role-icon.tm-role-tech + div .tm-role-name{
  color: #047857 !important;
}
/* ===== DATE COLUMN - iOS calendar chip ===== */

.tm-date-cell{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.tm-date-main{
  display: inline-block;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: .2px;
  color: #334155;
}

.tm-date-sub{
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.1;
  color: #475569;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(148,163,184,.14);
  border: 1px solid rgba(148,163,184,.18);
  white-space: nowrap;
}

/* Sunday */
.tm-date-cell.is-sun .tm-date-main{
  color: #dc2626 !important;
}
.tm-date-cell.is-sun .tm-date-sub{
  color: #b91c1c !important;
  background: rgba(239,68,68,.10) !important;
  border-color: rgba(239,68,68,.18) !important;
}

/* Saturday */
.tm-date-cell.is-sat .tm-date-main{
  color: #ea580c !important;
}
.tm-date-cell.is-sat .tm-date-sub{
  color: #c2410c !important;
  background: rgba(249,115,22,.10) !important;
  border-color: rgba(249,115,22,.18) !important;
}

/* ===== FIX: Giữ banner lịch trực cố định, chỉ scroll bảng ===== */
.tm-lich-modal{
  display: flex !important;
  flex-direction: column !important;
}

.tm-lich-content{
  display: flex !important;
  flex-direction: column !important;
  min-height: 0 !important;
  height: 100% !important;
  overflow: hidden !important; /* bỏ scroll ở toàn khối content */
}

/* Banner luôn nằm trên */
.tm-lich-banner{
  flex: 0 0 auto !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 20 !important;

  /* nền nhẹ để nhìn đẹp khi cuộn */
  background: linear-gradient(
    180deg,
    rgba(248,250,252,.92),
    rgba(241,245,249,.82)
  ) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  padding-bottom: 8px; /* tạo khoảng cách với bảng */
  margin-bottom: 8px !important;
}

/* Chỉ phần bảng scroll */
.tm-lich-wrap{
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow: auto !important;
}

/* Header bảng vẫn sticky trong vùng bảng */
.tm-lich-table thead th{
  position: sticky !important;
  top: 0 !important;
  z-index: 5 !important;
}
/* ===== TOP BAR iOS cho modal LỊCH TRỰC ===== */
.tm-lich-content{
  display:flex !important;
  flex-direction:column !important;
  min-height:0 !important;
  height:100% !important;
  overflow:hidden !important;
}


.tm-lich-top-btn{
  appearance:none;
  border:1px solid rgba(255,255,255,.55);
  outline:none;
  cursor:pointer;
  user-select:none;

  height:34px;
  padding:0 12px;
  border-radius:999px;

  display:inline-flex;
  align-items:center;
  gap:6px;

  font: 800 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial;
  letter-spacing:.1px;

  box-shadow:
    0 8px 18px rgba(0,0,0,.08),
    inset 0 1px 0 rgba(255,255,255,.65);

  transition: transform .08s ease, box-shadow .15s ease, background .15s ease;
}
.tm-lich-top-btn.delete{
width:34px;
min-width:34px;
padding:0;
justify-content:center;
color:#ef4444;
background:rgba(239,68,68,0.08);
border-color:rgba(239,68,68,0.15);
transition:all .18s ease;
}

.tm-lich-top-btn.delete:hover{
background:rgba(239,68,68,0.18);
color:#dc2626;
transform:translateY(-1px);
}

.tm-lich-top-btn:hover{ transform: translateY(-1px); }
.tm-lich-top-btn:active{ transform: translateY(0); }

/* Chỉ bảng scroll */
.tm-lich-wrap{
  flex:1 1 auto !important;
  min-height:0 !important;
  overflow:auto !important;
}

/* Header bảng sticky trong vùng bảng */
.tm-lich-table thead th{
  position: sticky !important;
  top: 0 !important;
  z-index: 5 !important;
}

@media (max-width: 760px){
  .tm-lich-topbar{
    flex-direction:column;
    align-items:flex-start;
  }
  .tm-lich-top-actions{
    width:100%;
    justify-content:flex-start;
  }
}
/* ===== TOPBAR đỏ nhẹ iOS (phiên bản mới) ===== */
.tm-lich-topbar{
  position: sticky;
  top: 0;
  z-index: 40;

  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;

  margin: 0 0 10px 0 !important;
  padding: 10px 12px;
  min-height: 46px;
  border-radius: 16px;

  /* glass đỏ nhẹ */
  background:
    linear-gradient(180deg, rgba(255, 99, 99, .16), rgba(255, 99, 99, .10)),
    linear-gradient(180deg, rgba(255,255,255,.82), rgba(255,255,255,.62));
  border:1px solid rgba(255, 80, 80, .20);
  box-shadow:
    0 10px 24px rgba(255, 80, 80, .08),
    inset 0 1px 0 rgba(255,255,255,.72);

  backdrop-filter: blur(16px) saturate(170%);
  -webkit-backdrop-filter: blur(16px) saturate(170%);
}

.tm-lich-brand{
  display:flex !important;
  align-items:center !important;   /* align lại cho đẹp khi bỏ sub */
  min-width:0;
}

.tm-lich-brand-title{
  font-size: 14px;
  font-weight: 800;
  color: #dc2626 !important;       /* đỏ */
  letter-spacing: .2px;
  white-space: nowrap;
  line-height: 1;
  margin: 0;
}
/* chỉ 1 nút */
.tm-lich-top-actions{
  display:flex;
  align-items:center;
  gap:8px;
}

.tm-lich-top-btn.add{
  background: linear-gradient(180deg, rgba(239,68,68,.16), rgba(239,68,68,.08));
  color:#b91c1c;
  border-color: rgba(239,68,68,.22);
}
.tm-lich-top-btn.delete{
  width: 34px;
  min-width: 34px;
  padding: 0;
  justify-content: center;
  gap: 0;
  background: linear-gradient(180deg, rgba(239,68,68,.12), rgba(239,68,68,.06));
  color:#b91c1c;
  border-color: rgba(239,68,68,.18);
}

.tm-lich-top-btn.delete svg{
  width: 15px;
  height: 15px;
  display:block;
}

.tm-lich-top-btn.delete:hover{
  background: linear-gradient(180deg, rgba(239,68,68,.18), rgba(239,68,68,.10));
}

/* banner nằm dưới topbar */
.tm-lich-banner{
  position: sticky !important;
  top: 58px !important;
  z-index: 20 !important;
}
/* ===== Freeze header như Excel ===== */
.tm-lich-table thead th{
  position: sticky !important;
  top: 0 !important;
  z-index: 10 !important;
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(241,245,249,.92)) !important;
  border-bottom: 1px solid rgba(148,163,184,.25) !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.7) inset,
    0 6px 14px rgba(0,0,0,.05);
}
/* ===== Freeze header kiểu Excel (bản chắc ăn) ===== */
.tm-lich-wrap{
  position: relative !important;
  overflow: auto !important;
  flex: 1 1 auto !important;
  min-height: 0 !important;
}

/* Header clone dính trên đầu vùng bảng */
.tm-lich-freeze-head{
  position: sticky;
  top: 0;
  z-index: 35;
  overflow: hidden;
  pointer-events: none; /* không chặn scroll/click */
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Bảng clone header */
.tm-lich-freeze-head .tm-lich-table{
  margin: 0 !important;
  table-layout: fixed !important;
  border-collapse: separate !important;
  border-spacing: 0 !important;
}

.tm-lich-freeze-head .tm-lich-table th{
  background: linear-gradient(180deg, rgba(255,255,255,.96), rgba(241,245,249,.92)) !important;
  border-bottom: 1px solid rgba(148,163,184,.25) !important;
  box-shadow:
    0 1px 0 rgba(255,255,255,.7) inset,
    0 6px 14px rgba(0,0,0,.05);
}

/* Ẩn header gốc nhưng vẫn giữ chiều cao để không lệch layout */
.tm-lich-table-main thead{
  display: none !important;
}
/* giảm lệch do rounding + scrollbar */
.tm-lich-table,
.tm-lich-freeze-head .tm-lich-table{
  table-layout: fixed !important;
  width: 100% !important;
}

.tm-lich-freeze-head{
  width: 100%;
  box-sizing: border-box;
}
/* ===== Fit lại độ rộng các cột (đẹp + dễ nhìn) ===== */
:root{
  --lich-col-date: 110px;   /* cột Ngày */
  --lich-col-xb:   250px;   /* Trực xuất bản */
  --lich-col-kt:   280px;   /* Trực kỹ thuật */
  /* cột Biên tập sẽ tự ăn phần còn lại */
}

/* Bảng chính + bảng header clone */
.tm-lich-table,
.tm-lich-freeze-head .tm-lich-table{
  table-layout: fixed !important;
  width: 100% !important;
}

/* Cột 1: NGÀY (nhỏ lại) */
.tm-lich-table th:nth-child(1),
.tm-lich-table td:nth-child(1){
  width: var(--lich-col-date) !important;
  min-width: var(--lich-col-date) !important;
  max-width: var(--lich-col-date) !important;
}

/* Cột 2: XUẤT BẢN */
.tm-lich-table th:nth-child(2),
.tm-lich-table td:nth-child(2){
  width: var(--lich-col-xb) !important;
  min-width: var(--lich-col-xb) !important;
  max-width: var(--lich-col-xb) !important;
}

/* Cột 4: KỸ THUẬT */
.tm-lich-table th:nth-child(4),
.tm-lich-table td:nth-child(4){
  width: var(--lich-col-kt) !important;
  min-width: var(--lich-col-kt) !important;
  max-width: var(--lich-col-kt) !important;
}

/* Cột 3: BIÊN TẬP -> phần còn lại (rộng nhất) */
.tm-lich-table th:nth-child(3),
.tm-lich-table td:nth-child(3){
  width: auto !important;
}

/* Đồng bộ thêm cho class cột ngày (nếu đang dùng) */
.tm-lich-table td.tm-date-col{
  width: var(--lich-col-date) !important;
  min-width: var(--lich-col-date) !important;
}

/* Cho text dài nhìn gọn hơn */
.tm-lich-table td{
  word-break: break-word;
}
/* ===== Căn giữa đẹp cho cột NGÀY ===== */
.tm-lich-table td.tm-date-col{
  padding: 8px 6px !important;
  text-align: center !important;
  vertical-align: middle !important;
}

/* wrapper của ngày + thứ */
.tm-lich-table td.tm-date-col .tm-date-cell{
  width: 100%;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;      /* <-- đổi từ flex-start sang center */
  justify-content: center !important;
  gap: 4px !important;
  text-align: center !important;
}

/* số ngày */
.tm-lich-table td.tm-date-col .tm-date-main{
  display: block;
  width: 100%;
  text-align: center !important;
  line-height: 1.05;
  margin: 0 !important;
}

/* chip thứ */
.tm-lich-table td.tm-date-col .tm-date-sub{
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  text-align: center !important;
  margin: 0 auto !important;
  min-width: 54px;   /* để chip đều hơn */
  padding: 4px 10px !important;
  line-height: 1 !important;
}
/* ===== ROW MAGNIFY / DOCK-LIKE - BEST iOS COMBO ===== */
.tm-lich-wrap{
  padding: 8px 6px 10px !important;
  overflow: auto !important;
}

.tm-lich-table{
  border-collapse: separate !important;
  border-spacing: 0 8px !important;
}

.tm-lich-table tbody tr{
  --mag: 1;
  --magx: 1;
  --lift: 0px;

  position: relative;
  transform: translateY(calc(var(--lift) * -1)) scale(var(--magx), var(--mag));
  transform-origin: center center;
  transition:
    transform .16s cubic-bezier(.22,.78,.2,1),
    filter .16s ease,
    opacity .16s ease;
  will-change: transform, filter;
}

.tm-lich-table tbody tr td{
  transition:
    background .16s ease,
    box-shadow .16s ease,
    border-color .16s ease;
}

/* active row */
.tm-lich-table tbody tr.is-magnify{
  z-index: 12;
  filter: saturate(1.02) brightness(1.01);
}

/* iOS glass + soft shadow */
.tm-lich-table tbody tr.is-magnify td{
  background: rgba(255,255,255,.96) !important;
  border-top: 1px solid rgba(255,255,255,.92) !important;
  border-bottom: 1px solid rgba(255,255,255,.92) !important;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.78),
    0 12px 28px rgba(15,23,42,.09),
    0 2px 8px rgba(15,23,42,.05);

  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
}

.tm-lich-table tbody tr.is-magnify td:first-child{
  border-left: 1px solid rgba(255,255,255,.94) !important;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
}

.tm-lich-table tbody tr.is-magnify td:last-child{
  border-right: 1px solid rgba(255,255,255,.94) !important;
  border-top-right-radius: 16px !important;
  border-bottom-right-radius: 16px !important;
}

/* today row vẫn giữ chất xanh iOS */
.tm-lich-table tbody tr.tm-lich-today.is-magnify td{
  background: rgba(10,132,255,.13) !important;
  border-top: 1px solid rgba(10,132,255,.22) !important;
  border-bottom: 1px solid rgba(10,132,255,.22) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.62),
    0 12px 28px rgba(10,132,255,.12),
    0 2px 8px rgba(10,132,255,.06);
}

.tm-lich-table tbody tr.tm-lich-today.is-magnify td:first-child{
  border-left: 1px solid rgba(10,132,255,.24) !important;
}

.tm-lich-table tbody tr.tm-lich-today.is-magnify td:last-child{
  border-right: 1px solid rgba(10,132,255,.24) !important;
}

/* chip ngày phồng rất nhẹ */
.tm-lich-table tbody tr.is-magnify .tm-date-cell{
  transform: scale(1.018);
  transition: transform .16s cubic-bezier(.22,.78,.2,1);
}

@media (prefers-reduced-motion: reduce){
  .tm-lich-table tbody tr,
  .tm-lich-table tbody tr td,
  .tm-lich-table tbody tr .tm-date-cell{
    transition: none !important;
  }
}

  `);
GM_addStyle(`
  :root{
    --tm-safe-top: 96px;
    --tm-safe-bottom: 86px;
  }

  /* ===== Modal fit giữa header và toolbar ===== */
  .tm-lich-modal{
    left: 50% !important;
    top: var(--tm-safe-top) !important;
    bottom: var(--tm-safe-bottom) !important;

    transform: translateX(-50%) scale(.96) !important;
    width: min(1120px, calc(100vw - 32px)) !important;
    max-width: calc(100vw - 32px) !important;

    max-height: none !important;
    height: auto !important;
    overflow: hidden !important;
  }

  .tm-lich-modal.show{
    transform: translateX(-50%) scale(1) !important;
  }

  /* ===== Compact nhẹ cho phần trên ===== */
  .tm-lich-content{
    padding: 12px !important;
  }

  .tm-lich-topbar{
    margin-bottom: 8px !important;
    padding: 8px 10px !important;
    min-height: 42px !important;
  }

  .tm-lich-banner{
    gap: 10px !important;
    margin: 0 0 10px 0 !important;
  }

  .tm-news-status,
  .tm-role-card{
    min-height: 72px !important;
    padding: 12px 13px !important;
  }

  .tm-role-icon{
    width: 38px !important;
    height: 38px !important;
  }

  .tm-clock-panel{
    padding: 10px 12px !important;
  }

  .tm-lich-wrap{
    padding: 6px 6px 8px !important;
  }

  .tm-lich-table{
    border-spacing: 0 6px !important;
  }

  .tm-lich-table td{
    padding: 9px 10px !important;
  }
/* Đồng hồ to hơn nhưng KHÔNG nới khung chứa */
.tm-clock-time{
  font-size: 22px !important;          /* giữ size layout gốc */
  display: block !important;
  width: 132px !important;             /* giữ vùng đồng hồ gọn cố định */
  margin-left: auto !important;
  text-align: right !important;
  line-height: 1 !important;
  letter-spacing: .2px !important;
  transform: scale(1.55) !important;   /* phóng riêng chữ */
  transform-origin: right center !important;
}
/* ===== Patch nhẹ: icon âm lịch + label progress ===== */

/* Nếu không có dữ liệu âm lịch thì ẩn luôn dòng đó */
.tm-clock-lunar:empty{
  display: none !important;
}

/* Icon nhẹ cho dòng âm lịch */
.tm-clock-lunar{
  display: inline-flex !important;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,.78) !important;
}

.tm-clock-lunar::before{
  content: "☾";
  font-size: 12px;
  line-height: 1;
  color: rgba(255,255,255,.62);
  transform: translateY(-.5px);
}

/* Label nhỏ cho progress bar */
.tm-progress{
  position: relative !important;
  margin-top: 14px !important;
}

.tm-progress::before{
  content: "Tiến độ ca hôm nay";
  position: absolute;
  left: 0;
  top: -14px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: .2px;
  color: rgba(255,255,255,.50);
  font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  pointer-events: none;
}
/* ===== Progress bar: giữ màu, thêm cảm giác chuyển động trái -> phải ===== */
.tm-progress-bar{
  position: relative !important;
  overflow: hidden !important;

  /* giữ nguyên dải màu hiện tại, không cho màu tự chạy */
  animation: none !important;
  background-size: 100% 100% !important;
}

/* lớp bóng nhẹ cố định để thanh nhìn “có chiều sâu” hơn */
.tm-progress-bar::before{
  content: "" !important;
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,.16) 0%,
    rgba(255,255,255,.05) 35%,
    rgba(255,255,255,0) 55%,
    rgba(255,255,255,.10) 100%
  );
}

/* lớp ánh sáng quét từ trái sang phải */
.tm-progress-bar::after{
  content: "" !important;
  position: absolute;
  inset: -1px;
  pointer-events: none;

  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,.05) 35%,
    rgba(255,255,255,.28) 50%,
    rgba(255,255,255,.05) 65%,
    rgba(255,255,255,0) 100%
  );

  transform: translateX(-140%);
  animation: tm-progress-sweep 1.35s linear infinite;
  mix-blend-mode: screen;
}

@keyframes tm-progress-sweep{
  from { transform: translateX(-140%); }
  to   { transform: translateX(140%); }
}

@media (prefers-reduced-motion: reduce){
  .tm-progress-bar::after{
    animation: none !important;
  }
}
/* ===== WEEKEND iOS GLASS ===== */
/* chỉ áp cho cuối tuần, không đè hàng hôm nay */
.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sat) td{
  background:
    linear-gradient(180deg,
      rgba(255,179,71,.10),
      rgba(255,255,255,.72)) !important;
  border-top: 1px solid rgba(255,179,71,.18) !important;
  border-bottom: 1px solid rgba(255,179,71,.18) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.55),
    0 4px 14px rgba(255,179,71,.05);
}

.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sat) td:first-child{
  border-left: 1px solid rgba(255,179,71,.18) !important;
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
}

.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sat) td:last-child{
  border-right: 1px solid rgba(255,179,71,.18) !important;
  border-top-right-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}

.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sun) td{
  background:
    linear-gradient(180deg,
      rgba(255,105,97,.10),
      rgba(255,255,255,.72)) !important;
  border-top: 1px solid rgba(255,105,97,.18) !important;
  border-bottom: 1px solid rgba(255,105,97,.18) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.55),
    0 4px 14px rgba(255,105,97,.05);
}

.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sun) td:first-child{
  border-left: 1px solid rgba(255,105,97,.18) !important;
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
}

.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sun) td:last-child{
  border-right: 1px solid rgba(255,105,97,.18) !important;
  border-top-right-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}

/* hover sáng hơn nhẹ */
.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sat):hover td{
  background:
    linear-gradient(180deg,
      rgba(255,179,71,.14),
      rgba(255,255,255,.86)) !important;
}

.tm-lich-table tbody tr:not(.tm-lich-today):has(.tm-date-cell.is-sun):hover td{
  background:
    linear-gradient(180deg,
      rgba(255,105,97,.14),
      rgba(255,255,255,.86)) !important;
}

/* chip ngày nổi hơn */
.tm-lich-table tbody tr:has(.tm-date-cell.is-sat) .tm-date-sub{
  background: rgba(255,179,71,.14) !important;
  border-color: rgba(255,179,71,.26) !important;
  color: #c2410c !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.55),
    0 2px 8px rgba(255,179,71,.08);
}

.tm-lich-table tbody tr:has(.tm-date-cell.is-sun) .tm-date-sub{
  background: rgba(255,105,97,.12) !important;
  border-color: rgba(255,105,97,.24) !important;
  color: #dc2626 !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.55),
    0 2px 8px rgba(255,105,97,.08);
}

/* số ngày đậm hơn chút */
.tm-lich-table tbody tr:has(.tm-date-cell.is-sat) .tm-date-main{
  color: #ea580c !important;
}

.tm-lich-table tbody tr:has(.tm-date-cell.is-sun) .tm-date-main{
  color: #dc2626 !important;
}
/* hover vẫn giữ green glass */
.tm-lich-table tr.tm-lich-today:hover td{
  background: linear-gradient(
    180deg,
    rgba(34,197,94,.12),
    rgba(255,255,255,.84)
  ) !important;
}
.tm-lich-table tr.tm-lich-today{
  background: transparent !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

/* bo góc 2 đầu hàng */
.tm-lich-table tr.tm-lich-today td:first-child{
  border-left: 1px solid rgba(34,197,94,.22) !important;
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
  position: relative !important;
  padding-left: 22px !important;
}

.tm-lich-table tr.tm-lich-today td:last-child{
  border-right: 1px solid rgba(34,197,94,.22) !important;
  border-top-right-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}

/* thay vạch xanh cũ bằng chấm tròn xanh lá */
.tm-lich-table tr.tm-lich-today td:first-child::before{
  content: "" !important;
  position: absolute !important;
  left: 8px !important;
  top: 50% !important;
  width: 8px !important;
  height: 8px !important;
  border-radius: 999px !important;
  background: #22c55e !important;
  box-shadow:
    0 0 0 3px rgba(34,197,94,.14),
    0 0 10px rgba(34,197,94,.34) !important;
  animation: tm-today-dot-green .95s ease-in-out infinite !important;
}

/* chip ngày hôm nay xanh lá */
.tm-lich-table tr.tm-lich-today .tm-date-sub{
  background: rgba(34,197,94,.14) !important;
  border-color: rgba(34,197,94,.24) !important;
  color: #15803d !important;
}

/* số ngày hôm nay */
.tm-lich-table tr.tm-lich-today .tm-date-main{
  color: #15803d !important;
}

/* ===== TODAY ROW FORCE GREEN GLASS ===== */
@keyframes tm-today-dot-green{
  0%,100%{
    opacity:1;
    transform:translateY(-50%) scale(1);
    box-shadow:
      0 0 0 0 rgba(34,197,94,.30),
      0 0 10px rgba(34,197,94,.42);
  }
  50%{
    opacity:.45;
    transform:translateY(-50%) scale(.88);
    box-shadow:
      0 0 0 6px rgba(34,197,94,0),
      0 0 14px rgba(34,197,94,.18);
  }
}

/* ép toàn bộ state của "hôm nay" sang xanh lá */
.tm-lich-table tbody tr.tm-lich-today td,
.tm-lich-table tbody tr.tm-lich-today:hover td,
.tm-lich-table tbody tr.tm-lich-today.is-magnify td{
  background: linear-gradient(
    180deg,
    rgba(34,197,94,.16),
    rgba(255,255,255,.82)
  ) !important;
  border-top: 1px solid rgba(34,197,94,.22) !important;
  border-bottom: 1px solid rgba(34,197,94,.22) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.62),
    0 8px 20px rgba(34,197,94,.06) !important;
}

/* bo góc 2 đầu */
.tm-lich-table tbody tr.tm-lich-today td:first-child,
.tm-lich-table tbody tr.tm-lich-today:hover td:first-child,
.tm-lich-table tbody tr.tm-lich-today.is-magnify td:first-child{
  border-left: 1px solid rgba(34,197,94,.24) !important;
  border-top-left-radius: 12px !important;
  border-bottom-left-radius: 12px !important;
  position: relative !important;
  padding-left: 22px !important;
}

.tm-lich-table tbody tr.tm-lich-today td:last-child,
.tm-lich-table tbody tr.tm-lich-today:hover td:last-child,
.tm-lich-table tbody tr.tm-lich-today.is-magnify td:last-child{
  border-right: 1px solid rgba(34,197,94,.24) !important;
  border-top-right-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
}

/* bỏ vạch xanh cũ, thay bằng chấm tròn xanh lá */
.tm-lich-table tbody tr.tm-lich-today td:first-child::before,
.tm-lich-table tbody tr.tm-lich-today:hover td:first-child::before,
.tm-lich-table tbody tr.tm-lich-today.is-magnify td:first-child::before{
  content: "" !important;
  position: absolute !important;
  left: 8px !important;
  top: 50% !important;
  bottom: auto !important;
  width: 8px !important;
  height: 8px !important;
  border-radius: 999px !important;
  background: #22c55e !important;
  box-shadow:
    0 0 0 3px rgba(34,197,94,.14),
    0 0 10px rgba(34,197,94,.34) !important;
  animation: tm-today-dot-green .95s ease-in-out infinite !important;
}

/* ngày hôm nay cũng xanh lá */
.tm-lich-table tbody tr.tm-lich-today .tm-date-main{
  color: #15803d !important;
}

.tm-lich-table tbody tr.tm-lich-today .tm-date-sub{
  background: rgba(34,197,94,.14) !important;
  border-color: rgba(34,197,94,.24) !important;
  color: #15803d !important;
}



`);

  const ICON_ALIGN_CENTER = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6h14M7 10h10M6 14h12M8 18h8"
            fill="none" stroke="currentColor" stroke-width="1.8"
            stroke-linecap="round"/>
    </svg>

  `;

let boxMenuEl = null;
let settingsMenuEl = null;
let triangleMenuEl = null;
let backlinkPanelEl = null;
let backlinkPanelCtx = null;
let reorderMode = false;

  // ========= menus =========
  function closeBoxMenu() {
    if (!boxMenuEl) return;
    boxMenuEl.remove();
    boxMenuEl = null;
  }

  function toggleBoxMenu(anchorEl) {
    if (boxMenuEl) closeBoxMenu();
    else openBoxMenu(anchorEl);
  }
    function closeTriangleMenu() {
  if (!triangleMenuEl) return;
  triangleMenuEl.remove();
  triangleMenuEl = null;
}

function toggleTriangleMenu(anchorEl, ACTIONS, defaultIds, rerenderFn) {
  if (triangleMenuEl) {
    closeTriangleMenu();
    return;
  }
  openTriangleMenu(anchorEl, ACTIONS, defaultIds, rerenderFn);
}

function openTriangleMenu(anchorEl, ACTIONS, defaultIds, rerenderFn) {
  closeBoxMenu();
  closeSettingsMenu();
  closeTriangleMenu();

  const hidden = loadHidden();

  triangleMenuEl = document.createElement('div');
  triangleMenuEl.className = 'tm-tri-menu';
  triangleMenuEl.innerHTML = `
    <div class="tm-tri-item" data-role="togglebar">
      <span class="ico">${hidden ? '👁️' : '🙈'}</span>
      <span>Ẩn/Hiện</span>
    </div>
    <div class="tm-tri-item" data-role="settings">
      <span class="ico">⚙️</span>
      <span>Tùy chỉnh</span>
    </div>
  `;
  __tmAppendWhenReady(triangleMenuEl);

  // Position
  const r = anchorEl.getBoundingClientRect();
  const m = triangleMenuEl.getBoundingClientRect();
  let left = Math.min(Math.max(12, r.left), window.innerWidth - m.width - 12);
  let top = r.top - m.height - 10;
  if (top < 12) top = r.bottom + 10;

  triangleMenuEl.style.left = left + 'px';
  triangleMenuEl.style.top = top + 'px';

  triangleMenuEl.addEventListener('click', function (e) {
    const item = e.target.closest('.tm-tri-item');
    if (!item) return;

    const role = item.getAttribute('data-role');

    if (role === 'togglebar') {
      closeTriangleMenu();
      setHidden(!loadHidden());
      return;
    }

    if (role === 'settings') {
      closeTriangleMenu();
      // mở menu cài đặt tại vị trí nút tam giác/fab
      toggleSettingsMenu(anchorEl, ACTIONS, defaultIds, rerenderFn);
      return;
    }
  }, true);

  const onDocDown = function (e) {
    if (!triangleMenuEl) return;
    if (triangleMenuEl.contains(e.target) || anchorEl.contains(e.target)) return;
    document.removeEventListener('mousedown', onDocDown, true);
    closeTriangleMenu();
  };
  document.addEventListener('mousedown', onDocDown, true);

  window.addEventListener('scroll', closeTriangleMenu, { once:true, capture:true });
  window.addEventListener('resize', closeTriangleMenu, { once:true });
}



function backlink_capturePanelContext() {
  try {
    var active = safeActiveEditor();
    if (!active || !active.ed) {
      backlinkPanelCtx = null;
      return null;
    }
    var editor = active.ed;
    var ctx = { editor: editor, CK: active.CK, mode: editor.mode || 'wysiwyg', selectedText: '' };
    if (editor.mode === 'source') {
      var ta = editor && editor.textarea && editor.textarea.$;
      if (ta) {
        ctx.selectionStart = ta.selectionStart;
        ctx.selectionEnd = ta.selectionEnd;
        try { ctx.selectedText = String((ta.value || '').slice(ctx.selectionStart, ctx.selectionEnd) || '').trim(); } catch (e) {}
      }
    } else {
      try { ctx.bookmarks = box_captureBookmark(editor); } catch (e) {}
      try { ctx.selectedText = backlink_getSelectedTextWysiwyg(editor); } catch (e) {}
    }
    backlinkPanelCtx = ctx;
    return ctx;
  } catch (e) {
    backlinkPanelCtx = null;
    return null;
  }
}

function backlink_restorePanelContext(ctx) {
  var use = ctx || backlinkPanelCtx;
  if (!use || !use.editor) return false;
  try {
    if (use.mode === 'source') {
      var ta = use.editor && use.editor.textarea && use.editor.textarea.$;
      if (!ta) return false;
      ta.focus();
      if (typeof use.selectionStart === 'number' && typeof use.selectionEnd === 'number') {
        ta.selectionStart = use.selectionStart;
        ta.selectionEnd = use.selectionEnd;
      }
      return true;
    }
    return !!box_restoreBookmark(use.editor, use.bookmarks);
  } catch (e) {
    return false;
  }
}

function backlink_applyFromPanel(url) {
  var preferredUrl = backlink_sanitizeUrl(url);
  backlink_setSelectedUrl(preferredUrl);
  rerenderBacklinkButtonTitles();
  var ctx = backlinkPanelCtx || backlink_capturePanelContext();
  if (!ctx || !ctx.editor) {
    toast('Không tìm thấy CKEditor');
    return false;
  }
  backlinkPanelToastContext = { url: preferredUrl };
  backlink_restorePanelContext(ctx);
  var ok = false;
  try {
    ok = backlink_run(ctx.editor, ctx.CK, preferredUrl, {
      silentSuccessToast: true,
      silentRemoveToast: true,
      successMessage: backlink_makeSuccessToast(preferredUrl)
    });
  } catch (e) {
    ok = false;
  }
  if (!ok) {
    try { backlink_restorePanelContext(ctx); } catch (e) {}
    try {
      if (ctx.mode === 'source') ok = backlink_runManualSource(ctx.editor, preferredUrl);
      else ok = backlink_runManualWysiwyg(ctx.editor, ctx.CK, preferredUrl);
    } catch (e) {
      ok = false;
    }
  }
  if (ok) {
    toast(backlink_makeSuccessToast(preferredUrl));
  }
  backlinkPanelToastContext = null;
  return !!ok;
}

function closeBacklinkPanel() {
  if (!backlinkPanelEl) return;
  backlinkPanelEl.remove();
  backlinkPanelEl = null;
}

function positionBacklinkPanel(panelEl, anchorEl) {
  if (!panelEl || !anchorEl) return;
  var r = anchorEl.getBoundingClientRect();
  var m = panelEl.getBoundingClientRect();
  var left = Math.min(Math.max(12, r.right - m.width), window.innerWidth - m.width - 12);
  var top = r.top - m.height - 10;
  if (top < 12) top = r.bottom + 10;
  panelEl.style.left = left + 'px';
  panelEl.style.top = top + 'px';
}

function rerenderBacklinkButtonTitles() {
  try {
    var selected = backlink_getSelectedUrl();
    Array.prototype.forEach.call(document.querySelectorAll('.tm-act[data-action-id="backlink"]'), function (btn) {
      btn.title = 'BACKLINK • ' + selected + ' • F3';
    });
  } catch (e) {}
}

function renderBacklinkPanel(panelEl, anchorEl) {
  if (!panelEl) return;
  var links = backlink_loadLinks();
  var selected = backlink_getSelectedUrl();
  panelEl.innerHTML = '<div class="tm-backlink-list"></div><div class="tm-backlink-add">＋ Thêm liên kết</div>';
  var listEl = panelEl.querySelector('.tm-backlink-list');
  var addEl = panelEl.querySelector('.tm-backlink-add');
  var dragState = null;

  function updateMarqueeState(viewEl, textEl) { return; }

  function updateDropHint(row, clientY) {
    if (!row) return;
    var rect = row.getBoundingClientRect();
    var before = clientY < rect.top + rect.height / 2;
    row.style.boxShadow = before
      ? 'inset 0 2px 0 rgba(124,58,237,.95)'
      : 'inset 0 -2px 0 rgba(124,58,237,.95)';
    row.dataset.dropBefore = before ? '1' : '0';
  }

  function clearDropHint(row) {
    if (!row) return;
    row.style.boxShadow = '';
    delete row.dataset.dropBefore;
  }

  function startEditing(row, input) {
    if (!row || !input) return;
    row.classList.add('is-editing');
    input.removeAttribute('readonly');
    input.focus();
    try { input.setSelectionRange(input.value.length, input.value.length); } catch (err) {}
    positionBacklinkPanel(panelEl, anchorEl);
  }

  function commitInput(input, url, opts) {
    var options = opts || {};
    var value = backlink_sanitizeUrl(input && input.value);
    if (!value) {
      if (options.isNew) {
        renderBacklinkPanel(panelEl, anchorEl);
        return;
      }
      input.value = url || '';
      input.setAttribute('readonly', 'readonly');
      input.closest('.tm-backlink-item') && input.closest('.tm-backlink-item').classList.remove('is-editing');
      positionBacklinkPanel(panelEl, anchorEl);
      return;
    }
    var next = links.slice();
    if (options.isNew) next.push(value);
    else next[options.index] = value;
    next = backlink_saveLinks(next);
    backlink_setSelectedUrl(value);
    renderBacklinkPanel(panelEl, anchorEl);
    rerenderBacklinkButtonTitles();
  }

  links.forEach(function (url, index) {
    var row = document.createElement('div');
    row.className = 'tm-backlink-item' + (backlink_normUrl(url) === backlink_normUrl(selected) ? ' is-selected' : '');
    row.draggable = false;
    row.dataset.index = String(index);
    row.innerHTML = '' +
      '<span class="tm-backlink-grip" title="Kéo để sắp xếp">⋮⋮</span>' +
      '<div class="tm-backlink-view" title="Chèn backlink với liên kết này"><span class="tm-backlink-text"></span></div>' +
      '<input class="tm-backlink-url" type="text" readonly>' +
      '<button class="tm-backlink-edit" type="button" title="Sửa">✎</button>' +
      '<button class="tm-backlink-delete" type="button" title="Xóa">✕</button>';
    var grip = row.querySelector('.tm-backlink-grip');
    var view = row.querySelector('.tm-backlink-view');
    var textNode = row.querySelector('.tm-backlink-text');
    var input = row.querySelector('.tm-backlink-url');
    var editBtn = row.querySelector('.tm-backlink-edit');
    var delBtn = row.querySelector('.tm-backlink-delete');
    input.value = url;
    textNode.textContent = url;
    updateMarqueeState(view, textNode);

    [view, input, editBtn, delBtn].forEach(function (el) {
      if (!el) return;
      el.addEventListener('mousedown', function (e) { e.stopPropagation(); }, true);
      el.addEventListener('click', function (e) { e.stopPropagation(); }, true);
    });

    view.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var ok = backlink_applyFromPanel(url);
      if (ok) closeBacklinkPanel();
    }, true);

    editBtn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      startEditing(row, input);
    }, true);

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitInput(input, url, { index: index });
      } else if (e.key === 'Escape') {
        e.preventDefault();
        renderBacklinkPanel(panelEl, anchorEl);
      }
    }, true);

    input.addEventListener('blur', function () {
      if (!row.classList.contains('is-editing')) return;
      commitInput(input, url, { index: index });
    }, true);

    delBtn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var next = links.slice();
      next.splice(index, 1);
      next = backlink_saveLinks(next);
      if (!next.length) next = backlink_saveLinks(backlink_defaultLinks());
      if (!next.some(function (item) { return backlink_normUrl(item) === backlink_normUrl(backlink_getSelectedUrl()); })) {
        backlink_setSelectedUrl(next[0] || backlink_defaultLinks()[0]);
      }
      renderBacklinkPanel(panelEl, anchorEl);
      rerenderBacklinkButtonTitles();
    }, true);

    grip.draggable = true;
    grip.addEventListener('mousedown', function (e) {
      e.stopPropagation();
      row.draggable = true;
    }, true);
    grip.addEventListener('mouseup', function () {
      row.draggable = false;
    }, true);
    row.addEventListener('dragstart', function (e) {
      if (e.target !== grip) {
        e.preventDefault();
        row.draggable = false;
        return false;
      }
      var rows = Array.prototype.slice.call(listEl.querySelectorAll('.tm-backlink-item'));
      dragState = { from: rows.indexOf(row) };
      row.classList.add('dragging');
      try { e.dataTransfer.effectAllowed = 'move'; } catch (_) {}
      try { e.dataTransfer.setData('text/plain', String(dragState.from)); } catch (_) {}
    }, true);
    row.addEventListener('dragend', function () {
      row.classList.remove('dragging');
      row.draggable = false;
      clearDropHint(row);
      dragState = null;
      Array.prototype.forEach.call(listEl.querySelectorAll('.tm-backlink-item'), clearDropHint);
    }, true);
    row.addEventListener('dragover', function (e) {
      if (!dragState) return;
      e.preventDefault();
      updateDropHint(row, e.clientY || 0);
    }, true);
    row.addEventListener('dragleave', function () {
      clearDropHint(row);
    }, true);
    row.addEventListener('drop', function (e) {
      if (!dragState) return;
      e.preventDefault();
      var fromIndex = dragState.from;
      clearDropHint(row);
      row.draggable = false;
      row.classList.remove('dragging');
      var rows = Array.prototype.slice.call(listEl.querySelectorAll('.tm-backlink-item'));
      var toIndex = rows.indexOf(row);
      if (fromIndex < 0 || fromIndex === toIndex) {
        dragState = null;
        return;
      }
      var next = links.slice();
      var moved = next.splice(fromIndex, 1)[0];
      var before = row.dataset.dropBefore !== '0';
      var insertIndex = toIndex;
      if (!before) insertIndex += 1;
      if (fromIndex < insertIndex) insertIndex -= 1;
      next.splice(insertIndex, 0, moved);
      backlink_saveLinks(next);
      dragState = null;
      renderBacklinkPanel(panelEl, anchorEl);
      rerenderBacklinkButtonTitles();
    }, true);

    listEl.appendChild(row);
  });

  addEl.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    if (panelEl.querySelector('.tm-backlink-item.is-editing')) return;
    var row = document.createElement('div');
    row.className = 'tm-backlink-item is-editing';
    row.innerHTML = '' +
      '<span class="tm-backlink-grip">＋</span>' +
      '<div class="tm-backlink-view"><span class="tm-backlink-text"></span></div>' +
      '<input class="tm-backlink-url" type="text" placeholder="https://...">' +
      '<button class="tm-backlink-edit" type="button" title="Sửa">✎</button>' +
      '<button class="tm-backlink-delete" type="button" title="Hủy">✕</button>';
    var input = row.querySelector('.tm-backlink-url');
    var delBtn = row.querySelector('.tm-backlink-delete');
    var editBtn = row.querySelector('.tm-backlink-edit');
    editBtn.disabled = true;
    editBtn.style.opacity = '0.35';
    editBtn.style.cursor = 'default';
    delBtn.addEventListener('click', function (ev) {
      ev.preventDefault(); ev.stopPropagation();
      renderBacklinkPanel(panelEl, anchorEl);
    }, true);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        commitInput(input, '', { isNew: true });
      } else if (ev.key === 'Escape') {
        ev.preventDefault();
        renderBacklinkPanel(panelEl, anchorEl);
      }
    }, true);
    input.addEventListener('blur', function () {
      commitInput(input, '', { isNew: true });
    }, true);
    listEl.appendChild(row);
    positionBacklinkPanel(panelEl, anchorEl);
    input.focus();
  }, true);

  positionBacklinkPanel(panelEl, anchorEl);
}

function toggleBacklinkPanel(anchorEl) {
  if (backlinkPanelEl) {
    closeBacklinkPanel();
    return;
  }
  closeBoxMenu();
  closeTriangleMenu();
  closeSettingsMenu();
  backlink_capturePanelContext();
  try { bindCloseSettingsOnEditorFrames && bindCloseSettingsOnEditorFrames(); } catch (e) {}
  backlinkPanelEl = document.createElement('div');
  backlinkPanelEl.className = 'tm-backlink-panel';
  __tmAppendWhenReady(backlinkPanelEl);
  renderBacklinkPanel(backlinkPanelEl, anchorEl);

  var detachFns = [];
  var detachAll = function () {
    while (detachFns.length) {
      try { detachFns.pop()(); } catch (e) {}
    }
  };
  var closeAndDetach = function () {
    detachAll();
    closeBacklinkPanel();
  };

  var onDocDown = function (e) {
    if (!backlinkPanelEl) return;
    if (backlinkPanelEl.contains(e.target) || anchorEl.contains(e.target)) return;
    closeAndDetach();
  };
  var onKeyDown = function (e) {
    if (e.key === 'Escape') closeAndDetach();
  };
  var onWindowBlur = function () {
    setTimeout(function () {
      try {
        if (!backlinkPanelEl) return;
        var ae = document.activeElement;
        var isEditorFrame = !!(ae && ae.tagName === 'IFRAME' && ((ae.classList && ae.classList.contains('cke_wysiwyg_frame')) || /cke|soạn thảo|editor/i.test(String(ae.className || '') + ' ' + String(ae.title || ''))));
        if (isEditorFrame) closeAndDetach();
      } catch (e) {}
    }, 0);
  };

  document.addEventListener('mousedown', onDocDown, true);
  document.addEventListener('pointerdown', onDocDown, true);
  document.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('blur', onWindowBlur, true);
  window.addEventListener('scroll', closeAndDetach, { once:true, capture:true });
  window.addEventListener('resize', closeAndDetach, { once:true });

  detachFns.push(function(){ document.removeEventListener('mousedown', onDocDown, true); });
  detachFns.push(function(){ document.removeEventListener('pointerdown', onDocDown, true); });
  detachFns.push(function(){ document.removeEventListener('keydown', onKeyDown, true); });
  detachFns.push(function(){ window.removeEventListener('blur', onWindowBlur, true); });
  detachFns.push(function(){ window.removeEventListener('scroll', closeAndDetach, true); });
  detachFns.push(function(){ window.removeEventListener('resize', closeAndDetach, false); });

  try {
    Array.prototype.forEach.call(document.querySelectorAll('iframe.cke_wysiwyg_frame, .cke_contents iframe, iframe[title*="Bộ soạn thảo"], iframe[title*="editor" i]'), function (frame) {
      if (!frame || frame.__tmBacklinkCloseBound) return;
      frame.__tmBacklinkCloseBound = 1;
      var closeFromFrame = function () { if (backlinkPanelEl) closeAndDetach(); };
      ['mousedown','pointerdown','focus','focusin','click','touchstart'].forEach(function (evt) {
        try { frame.addEventListener(evt, closeFromFrame, true); } catch (e) {}
      });
      try {
        var fdoc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
        if (fdoc) {
          ['mousedown','pointerdown','click','focusin','touchstart'].forEach(function (evt) {
            try { fdoc.addEventListener(evt, closeFromFrame, true); } catch (e) {}
            try { fdoc.body && fdoc.body.addEventListener(evt, closeFromFrame, true); } catch (e) {}
          });
        }
      } catch (e) {}
    });
  } catch (e) {}
}

function closeSettingsMenu(options) {
  if (!settingsMenuEl) return;

  const keepReorder = !!(options && options.keepReorder);
  settingsMenuEl.remove();
  settingsMenuEl = null;

  if (!keepReorder) resetSettingsModes();
}
function resetSettingsModes() {
  if (typeof setReorderMode === 'function') {
    setReorderMode(false, true);
  }
}
function isToolbarInteractionTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  return !!target.closest('#tm-ckeditor-bar, .tm-toggle.fab, .tm-act, .tm-actions, .tm-settings');
}

  function bindCloseSettingsOnEditorFrames() {
  try {
    const closeFloatingMenus = function () {
      if (reorderMode) return;
      closeSettingsMenu();
      closeTriangleMenu && closeTriangleMenu();
      closeBoxMenu && closeBoxMenu();
      closeBacklinkPanel && closeBacklinkPanel();
    };

    const bindNodeOnce = function (node, key, events, handler) {
      try {
        if (!node || node[key]) return;
        node[key] = 1;
        events.forEach(function (evt) {
          try { node.addEventListener(evt, handler, true); } catch (e) {}
        });
      } catch (e) {}
    };

    const attachDomListeners = function (docLike) {
      try {
        if (!docLike) return;
        bindNodeOnce(docLike, '__tmFloatingMenusBound', ['mousedown', 'pointerdown', 'click', 'touchstart', 'focusin'], closeFloatingMenus);
        if (docLike.documentElement) bindNodeOnce(docLike.documentElement, '__tmFloatingMenusRootBound', ['mousedown', 'pointerdown', 'click', 'touchstart'], closeFloatingMenus);
        if (docLike.body) bindNodeOnce(docLike.body, '__tmFloatingMenusBodyBound', ['mousedown', 'pointerdown', 'click', 'touchstart', 'focusin'], closeFloatingMenus);
      } catch (e) {}
    };

    const attachIframeListeners = function (iframeEl) {
      try {
        if (!iframeEl) return;
        bindNodeOnce(iframeEl, '__tmFloatingMenusIframeBound', ['mousedown', 'pointerdown', 'click', 'focus', 'focusin'], closeFloatingMenus);
        if (!iframeEl.__tmFloatingMenusLoadBound) {
          iframeEl.__tmFloatingMenusLoadBound = 1;
          iframeEl.addEventListener('load', function () {
            try { attachDomListeners(iframeEl.contentDocument || (iframeEl.contentWindow && iframeEl.contentWindow.document)); } catch (e) {}
          }, true);
        }
        try { attachDomListeners(iframeEl.contentDocument || (iframeEl.contentWindow && iframeEl.contentWindow.document)); } catch (e) {}
      } catch (e) {}
    };

    const bindIframeElementsInPage = function () {
      try {
        Array.prototype.forEach.call(document.querySelectorAll('iframe.cke_wysiwyg_frame, .cke_contents iframe, iframe[title*="Bộ soạn thảo"]'), function (iframeEl) {
          attachIframeListeners(iframeEl);
        });
      } catch (e) {}
    };

    const CK = getCK && getCK();
    if (CK && CK.instances) {
      for (const name in CK.instances) {
        const editor = CK.instances[name];
        if (!editor) continue;

        if (!editor._tmSettingsCloseBound) {
          editor._tmSettingsCloseBound = 1;

          const attachToEditorDoc = () => {
            try {
              if (editor.document && editor.document.$) attachDomListeners(editor.document.$);
            } catch (e) {}
            try {
              var editable = editor.editable && editor.editable();
              if (editable && editable.$) {
                bindNodeOnce(editable.$, '__tmFloatingMenusEditableBound', ['mousedown', 'pointerdown', 'click', 'touchstart', 'focusin'], closeFloatingMenus);
              }
            } catch (e) {}
            try {
              var container = editor.container && editor.container.$;
              if (container) {
                var frame = container.querySelector('iframe.cke_wysiwyg_frame, iframe');
                if (frame) attachIframeListeners(frame);
              }
            } catch (e) {}
          };

          attachToEditorDoc();

          editor.on('contentDom', function () {
            attachToEditorDoc();
            bindIframeElementsInPage();
          });

          editor.on('mode', function () {
            setTimeout(function () {
              attachToEditorDoc();
              bindIframeElementsInPage();
            }, 0);
          });

          editor.on('focus', function () {
            closeFloatingMenus();
            attachToEditorDoc();
            bindIframeElementsInPage();
          });
        }
      }
    }

    bindIframeElementsInPage();

    if (!bindCloseSettingsOnEditorFrames._tmWatcherStarted) {
      bindCloseSettingsOnEditorFrames._tmWatcherStarted = 1;
      try {
        const mo = new MutationObserver(function () {
          bindIframeElementsInPage();
        });
        mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
      } catch (e) {}
      setInterval(function () {
        try { bindIframeElementsInPage(); } catch (e) {}
      }, 1200);
    }
  } catch (e) {
    console.error('bindCloseSettingsOnEditorFrames error', e);
  }
}
    function pointInsideEl(e, el) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const x = e.clientX;
  const y = e.clientY;
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}


  function setReorderMode(v, silent) {
    reorderMode = !!v;
    actionsWrap.classList.toggle('reorder-on', reorderMode);

    Array.prototype.forEach.call(actionsWrap.querySelectorAll('.tm-act'), function (btn) {
      btn.draggable = reorderMode;
    });

    if (!silent) {
      toast(reorderMode ? '↕️ Bật chế độ sắp xếp action' : '✅ Tắt chế độ sắp xếp');
    }
  }

  function buildSettingsMenuHtml(ACTIONS, defaultIds) {
    const hiddenIds = new Set(loadHiddenActionIds(defaultIds));
    const effectiveShortcuts = getEffectiveShortcutMap(ACTIONS, defaultIds);

    const rows = ACTIONS.map(a => {
      const checked = hiddenIds.has(a.id) ? '' : 'checked';
      const value = effectiveShortcuts[a.id] || '';
      return `
        <div class="tm-settings-row" data-accent="${a.accent || 'blue'}">
          <div class="tm-settings-meta">
            <span class="tm-settings-check-label">${a.label}</span>
          </div>
          <button
            type="button"
            class="tm-shortcut-capture"
            data-shortcut-id="${a.id}"
            data-shortcut-value="${value}"
            title="Nhấn tổ hợp phím để gán, Backspace để xóa"
          >${renderShortcutKeycaps(value)}</button>
          <label class="tm-ios-switch">
            <input type="checkbox" data-act-id="${a.id}" ${checked}>
            <span class="tm-ios-slider"></span>
          </label>
        </div>
      `;
    }).join('');

    return `
      <div class="tm-settings-inner">
        <div class="tm-settings-head">
          <div class="tm-settings-topbar">
            <div class="tm-settings-reorder-wrap">
              <button
                type="button"
                class="tm-mode-toggle ${reorderMode ? 'active' : ''}"
                data-role="reorder"
              >
                SẮP XẾP
              </button>
            </div>
            <div class="tm-settings-default-wrap">
              <button
                type="button"
                class="tm-mode-toggle tm-default-toggle"
                data-role="defaults"
              >
                MẶC ĐỊNH
              </button>
            </div>
          </div>
        </div>

        <div class="tm-settings-groups">
          <div class="tm-settings-list">${rows}</div>
        </div>
      </div>
    `;
  }

  function toggleSettingsMenu(anchorEl, ACTIONS, defaultIds, rerenderFn) {
    if (settingsMenuEl) {
      closeSettingsMenu();
      return;
    }

    closeBoxMenu(); // tránh chồng menu
	bindCloseSettingsOnEditorFrames();

    settingsMenuEl = document.createElement('div');
    settingsMenuEl.className = 'tm-settings';
    settingsMenuEl.innerHTML = buildSettingsMenuHtml(ACTIONS, defaultIds);
    __tmAppendWhenReady(settingsMenuEl);

    const r = anchorEl.getBoundingClientRect();
    const m = settingsMenuEl.getBoundingClientRect();

    let left = Math.min(Math.max(12, r.left), window.innerWidth - m.width - 12);
    let top = r.top - m.height - 10;
    if (top < 12) top = r.bottom + 10;

    settingsMenuEl.style.left = left + 'px';
    settingsMenuEl.style.top = top + 'px';

    settingsMenuEl.addEventListener('click', function (e) {
const reorderBtn = e.target.closest('[data-role="reorder"]');
if (reorderBtn) {
  setReorderMode(!reorderMode);
  reorderBtn.classList.toggle('active', reorderMode);
  return;
}

const defaultsBtn = e.target.closest('[data-role="defaults"]');
if (defaultsBtn) {
  resetShortcutsToDefaults();
  rerenderFn();
  closeSettingsMenu();
  toggleSettingsMenu(anchorEl, ACTIONS, defaultIds, rerenderFn);
  toast('↺ Đã đưa phím tắt về mặc định');
  return;
}
    }, true);

    settingsMenuEl.addEventListener('change', function (e) {
      const cb = e.target.closest('input[type="checkbox"][data-act-id]');
      if (!cb) return;

      const id = cb.getAttribute('data-act-id');
      const hidden = new Set(loadHiddenActionIds(defaultIds));

      if (cb.checked) hidden.delete(id);
      else hidden.add(id);

      saveHiddenActionIds(Array.from(hidden));
      rerenderFn();
      setReorderMode(reorderMode, true);
    }, true);

    settingsMenuEl.addEventListener('keydown', function (e) {
      const btn = e.target.closest('.tm-shortcut-capture[data-shortcut-id]');
      if (!btn) return;

      const id = btn.getAttribute('data-shortcut-id');
      if (!id) return;

      if (e.key === 'Tab') return;
      e.preventDefault();
      e.stopPropagation();

      const shortcuts = loadShortcuts(defaultIds);

      if (e.key === 'Backspace' || e.key === 'Delete') {
        delete shortcuts[id];
        saveShortcuts(shortcuts, defaultIds);
        btn.dataset.shortcutValue = '';
        btn.innerHTML = renderShortcutKeycaps('');
        toast('🗑️ Đã xóa phím tắt ' + ACTIONS.find(a => a.id === id)?.label);
        return;
      }

      const combo = comboFromEvent(e);
      if (!combo) return;

      Object.keys(shortcuts).forEach(key => {
        if (key !== id && shortcuts[key] === combo) delete shortcuts[key];
      });
      shortcuts[id] = combo;
      saveShortcuts(shortcuts, defaultIds);

      btn.dataset.shortcutValue = combo;
      btn.innerHTML = renderShortcutKeycaps(combo);
      rerenderFn();
      setReorderMode(reorderMode, true);
      toast('⌨️ ' + (ACTIONS.find(a => a.id === id)?.label || id) + ': ' + combo);
    }, true);

const onDocDown = function (e) {
  if (!settingsMenuEl) return;

  const insideMenu =
    settingsMenuEl.contains(e.target) || pointInsideEl(e, settingsMenuEl);

  const insideAnchor =
    anchorEl.contains(e.target) || pointInsideEl(e, anchorEl);

  const insideToolbar = isToolbarInteractionTarget(e.target) || pointInsideEl(e, bar) || pointInsideEl(e, fabToggle);

  if (insideMenu || insideAnchor || (reorderMode && insideToolbar)) return;

  document.removeEventListener('mousedown', onDocDown, true);
  closeSettingsMenu();
};
document.addEventListener('mousedown', onDocDown, true);

window.addEventListener('scroll', closeSettingsMenu, { once:true, capture:true });
window.addEventListener('resize', closeSettingsMenu, { once:true });
  }
/***********************
 * BOX IFRAME (NEW)  ✅
 ***********************/
var IFRAME_W = 800;
var IFRAME_H = 440;

function iframe_buildPlaceholder(src) {
  var iframe =
    '<iframe src="' + src + '" width="' + IFRAME_W + '" height="' + IFRAME_H +
    '" scrolling="no" frameborder="0" align="middle"></iframe>';

  var encoded = encodeURIComponent(iframe);

  return '<img class="cke_iframe" ' +
    'data-cke-realelement="' + encoded + '" ' +
    'data-cke-real-node-type="1" ' +
    'alt="IFrame" title="IFrame" align="middle" ' +
    'src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==" ' +
    'data-cke-real-element-type="iframe" ' +
    'data-cke-resizable="true" ' +
    'style="width:' + IFRAME_W + 'px;height:' + IFRAME_H + 'px;">';
}

function iframe_promptUrl() {
  var url = prompt('Nhập link iframe:', '');
  return (url || '').trim();
}

function box_captureBookmark(editor) {
  if (!editor || editor.mode === 'source') return null;
  try {
    var sel = editor.getSelection && editor.getSelection();
    if (!sel) return null;
    return sel.createBookmarks2 ? sel.createBookmarks2(true) : (sel.createBookmarks ? sel.createBookmarks(true) : null);
  } catch (e) {
    return null;
  }
}

function box_restoreBookmark(editor, bookmarks) {
  if (!editor || editor.mode === 'source' || !bookmarks) return false;
  try {
    editor.focus();
    var sel = editor.getSelection && editor.getSelection();
    if (!sel) return false;
    sel.selectBookmarks(bookmarks);
    return true;
  } catch (e) {
    return false;
  }
}

function iframe_insert(editor, CK) {
  if (!editor) return;

  var url = iframe_promptUrl();
  if (!url) return;

  // SOURCE mode: chèn iframe thật
  if (editor.mode === 'source') {
    var ta = editor.textarea && editor.textarea.$;
    if (!ta) return;

    var htmlSrc =
      '<iframe src="' + url + '" width="' + IFRAME_W + '" height="' + IFRAME_H +
      '" scrolling="no" frameborder="0" align="middle"></iframe>';

    var s = ta.selectionStart, e = ta.selectionEnd;
    if (typeof s !== 'number' || typeof e !== 'number') return;

    var val = ta.value || '';
    ta.value = val.slice(0, s) + htmlSrc + val.slice(e);
    ta.selectionStart = ta.selectionEnd = s + htmlSrc.length;
    return;
  }

  // WYSIWYG mode: chèn placeholder CKEditor
  try { editor.focus(); } catch (e) {}
  editor.insertHtml(iframe_buildPlaceholder(url));
}

    function openBoxMenu(anchorEl) {
    closeSettingsMenu(); // tránh chồng menu
    closeBoxMenu();
    if (!anchorEl) return;

    var bookmarkCtx = null;
    try {
      var active = safeActiveEditor();
      if (active && active.ed) bookmarkCtx = { editor: active.ed, bookmarks: box_captureBookmark(active.ed) };
    } catch (e) {}

    boxMenuEl = document.createElement('div');
    boxMenuEl.className = 'tm-menu';
    boxMenuEl.innerHTML = `
      <div class="tm-menu-item" data-box="old">
        <span class="tm-mi-ico">🟨</span>
        <span>BOX FULL VÀNG</span>
      </div>

      <div class="tm-menu-divider"></div>

      <div class="tm-menu-item" data-box="quick">
        <span class="tm-mi-ico">🖼️</span>
        <span>BOX ẢNH</span>
      </div>
      <div class="tm-menu-divider"></div>

  <div class="tm-menu-item" data-box="iframe">
    <span class="tm-mi-ico">🧩</span>
    <span>BOX IFRAME</span>
  </div>
    `;

    __tmAppendWhenReady(boxMenuEl);

    const r = anchorEl.getBoundingClientRect();
    const m = boxMenuEl.getBoundingClientRect();
    let left = Math.min(Math.max(12, r.left), window.innerWidth - m.width - 12);
    let top = r.top - m.height - 10;
    if (top < 12) top = r.bottom + 10;
    boxMenuEl.style.left = left + 'px';
    boxMenuEl.style.top = top + 'px';

    boxMenuEl.addEventListener('click', function (e) {
      const item = e.target.closest('.tm-menu-item');
      if (!item) return;

      const x = safeActiveEditor();
      if (!x) return;
      try { if (bookmarkCtx && bookmarkCtx.editor === x.ed) box_restoreBookmark(x.ed, bookmarkCtx.bookmarks); } catch (e) {}

      if (item.dataset.box === 'old') {
  box_insert(x.ed);
} else if (item.dataset.box === 'quick') {
  qb_insert(x.ed, x.CK);
} else if (item.dataset.box === 'iframe') {
  iframe_insert(x.ed, x.CK);
}

      closeBoxMenu();
    }, true);

    const onDocDown = function (e) {
      if (!boxMenuEl) return;
      if (boxMenuEl.contains(e.target) || anchorEl.contains(e.target)) return;
      document.removeEventListener('mousedown', onDocDown, true);
      closeBoxMenu();
    };
    document.addEventListener('mousedown', onDocDown, true);

    window.addEventListener('scroll', closeBoxMenu, { once:true, capture:true });
    window.addEventListener('resize', closeBoxMenu, { once:true });
  }

  /***********************
   * Nguồn báo nhanh
   ***********************/
  const AGO_NEWS_STORAGE_KEY = 'ago_news_sources_v20260410_final';
  const AGO_NEWS_DEFAULTS = {
    local: [
      { name:'Báo Bắc Ninh', url:'https://baobacninhtv.vn/', note:'' },
      { name:'Báo Điện Biên Phủ', url:'https://baodienbienphu.vn/', note:'' },
      { name:'Báo Gia Lai', url:'https://baogialai.com.vn/', note:'' },
      { name:'Báo Khánh Hòa', url:'https://baokhanhhoa.vn/', note:'' },
      { name:'Báo Lai Châu', url:'https://baolaichau.vn/', note:'' },
      { name:'Báo Lạng Sơn', url:'https://baolangson.vn/', note:'' },
      { name:'Báo Ninh Bình', url:'https://baoninhbinh.org.vn/', note:'' },
      { name:'Báo Quảng Ngãi', url:'https://baoquangngai.vn/', note:'' },
      { name:'Báo Sơn La', url:'https://baosonla.vn/', note:'' },
      { name:'Báo Thanh Hóa', url:'https://baothanhhoa.vn/', note:'' },
      { name:'Báo Thanh Hóa - Văn hóa Đời sống', url:'https://vhds.baothanhhoa.vn/', note:'' },
      { name:'Báo Tuyên Quang', url:'https://baotuyenquang.com.vn/', note:'' },
      { name:'Báo và Phát thanh, Truyền hình Huế', url:'https://huetv.com.vn/', note:'' },
      { name:'Huế Ngày Nay', url:'https://huengaynay.vn/', note:'' }
    ],
    central: [
      { name:'An Ninh Thủ Đô', url:'https://www.anninhthudo.vn/', note:'' },
      { name:'Bóng đá', url:'https://bongda.com.vn', note:'' },
      { name:'Chính phủ', url:'https://baochinhphu.vn/', note:'' },
      { name:'Công lý', url:'https://congly.vn/', note:'' },
      { name:'Dân Trí', url:'https://dantri.com.vn/', note:'' },
      { name:'Dân Việt', url:'https://danviet.vn/', note:'' },
      { name:'Đảng Cộng Sản', url:'https://dangcongsan.vn/', note:'' },
      { name:'Đầu tư', url:'https://baodautu.vn/', note:'' },
      { name:'Hải Quan', url:'https://haiquanonline.com.vn', note:`- Lấy thông tin sau 30 phút.
- Không được chỉnh giờ.` },
      { name:'Kinh tế nông thôn', url:'https://kinhtenongthon.vn/', note:'' },
      { name:'Người Lao Động', url:'https://nld.com.vn/', note:'' },
      { name:'Nhân Dân', url:'https://nhandan.vn/', note:'' },
      { name:'PetroTimes', url:'http://petrotimes.vn', note:'' },
      { name:'Pháp Luật Việt Nam', url:'https://baophapluat.vn/', note:'' },
      { name:'Quân đội Nhân dân', url:'https://www.qdnd.vn/', note:'' },
      { name:'Sài Gòn Tiếp Thị', url:'https://www.sgtiepthi.vn/', note:'' },
      { name:'Tạp chí Điện tử Bảo vệ rừng và Môi trường', url:'https://www.baovemoitruong.org.vn', note:'' },
      { name:'Thanh Niên', url:'https://thanhnien.vn/', note:'' },
      { name:'The SaigonTimes', url:'https://thesaigontimes.vn/', note:'- Đính kèm link gốc' },
      { name:'Tin thể thao', url:'https://tinthethao.com.vn', note:'' },
      { name:'Tổ Quốc', url:'https://toquoc.vn/', note:'' },
      { name:'Tuổi trẻ', url:'https://tuoitre.vn/', note:`- Thêm cụm từ: Xem bản tin gốc của báo Tuổi trẻ tại đây
- Đính kèm link gốc` },
      { name:'VietNamNet', url:'https://vietnamnet.vn/', note:'' },
      { name:'VietnamPlus', url:'https://vietnamplus.vn/', note:`- Lấy thông tin sau 1 giờ.
- Đính kèm link gốc.
- Không sử dụng ảnh có nguồn AFP/TTXVN, APTTXVN, EPA/TTXVN` },
      { name:'VnEconomy', url:'https://vneconomy.vn/', note:'' },
      { name:'VTC NEWS', url:'https://vtc.vn/', note:'' },
      { name:'Báo Tin tức', url:'https://baotintuc.vn/', note:`- Lấy thông tin sau 1 giờ
- Đính kèm link gốc
- Không sử dụng ảnh có nguồn AFP/TTXVN, APTTXVN, EPA/TTXVN
- Không lấy mục Hồ sơ, Sáng tác và Tư liệu` }
    ]
  };

  function agoNewsClone(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function agoNewsEnsureUrl(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^(https?:|chrome:|about:|data:|mailto:|tel:)/i.test(raw)) return raw;
    return 'https://' + raw.replace(/^\/+/, '');
  }

  function agoNewsNoteHtml(note) {
    return agoNewsEscapeHtml(String(note || '')).replace(/\n/g, '<br>');
  }

  function agoNewsNormalizeItem(item) {
    const src = item && typeof item === 'object' ? item : {};
    return {
      name: String(src.name || '').trim(),
      url: agoNewsEnsureUrl(src.url),
      note: String(src.note || '').trim(),
      favorite: !!src.favorite
    };
  }


  function agoNewsCompareName(a, b) {
    return String((a && a.name) || '').localeCompare(String((b && b.name) || ''), 'vi', { sensitivity: 'base', numeric: true });
  }

  function agoNewsSortAlpha(items) {
    return (items || []).slice().sort(agoNewsCompareName);
  }

  function agoNewsUniqueSorted(items) {
    const seen = new Set();
    const merged = [];
    const pushUnique = (item) => {
      const normalized = agoNewsNormalizeItem(item);
      if (!normalized.name) return;
      const key = `${normalized.name.toLowerCase()}|${normalized.url.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      merged.push(normalized);
    };
    (items || []).forEach(pushUnique);
    return agoNewsSortAlpha(merged);
  }

  function agoNewsSortPinned(items) {
    return (items || []).slice().sort((a, b) => {
      const af = !!(a && a.favorite);
      const bf = !!(b && b.favorite);
      if (af !== bf) return af ? -1 : 1;
      return agoNewsCompareName(a, b);
    });
  }

  function agoNewsFavicon(url) {
    const href = agoNewsEnsureUrl(url);
    if (!href) return '';
    return 'https://www.google.com/s2/favicons?sz=32&domain_url=' + encodeURIComponent(href);
  }

  function agoNewsNormalizeData(data) {
    const src = data && typeof data === 'object' ? data : {};
    const hasLocal = Array.isArray(src.local);
    const hasCentral = Array.isArray(src.central);
    const normLocal = hasLocal
      ? agoNewsUniqueSorted(src.local.map(agoNewsNormalizeItem).filter(x => x.name))
      : agoNewsClone(AGO_NEWS_DEFAULTS.local);
    const normCentral = hasCentral
      ? agoNewsUniqueSorted(src.central.map(agoNewsNormalizeItem).filter(x => x.name))
      : agoNewsClone(AGO_NEWS_DEFAULTS.central);
    return {
      local: normLocal,
      central: normCentral
    };
  }

  function agoNewsLoad() {
    return new Promise((resolve) => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get([AGO_NEWS_STORAGE_KEY], (res) => {
            resolve(agoNewsNormalizeData(res && res[AGO_NEWS_STORAGE_KEY]));
          });
          return;
        }
      } catch (_) {}
      resolve(agoNewsClone(AGO_NEWS_DEFAULTS));
    });
  }

  function agoNewsSave(data) {
    const normalized = agoNewsNormalizeData(data);
    return new Promise((resolve) => {
      try {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ [AGO_NEWS_STORAGE_KEY]: normalized }, () => resolve(normalized));
          return;
        }
      } catch (_) {}
      resolve(normalized);
    });
  }

  function agoNewsOpen(url) {
    const href = agoNewsEnsureUrl(url);
    if (!href) return;
    try { window.open(href, '_blank', 'noopener,noreferrer'); } catch (_) { location.href = href; }
  }

  function agoNewsEscapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  let agoNewsModal = null;

  function ensureAgoNewsModal() {
    if (agoNewsModal && agoNewsModal.isConnected) return agoNewsModal;
    const root = document.createElement('div');
    root.className = 'ago-news-modal';
    root.innerHTML = `
      <div class="ago-news-overlay" data-close="1"></div>
      <div class="ago-news-dialog" role="dialog" aria-modal="true" aria-label="Danh sách đã Ký kết">
        <div class="ago-news-header">
          <div class="ago-news-header-main">
            <div class="ago-news-title-wrap">
              <h3 class="ago-news-title">Danh sách đã ký kết</h3>
              <div class="ago-news-subtitle">Bấm để mở link. Di chuột để xem điều kiện hoặc ghi chú.</div>
            </div>
          </div>
          <div class="ago-news-head-actions">
            <button class="ago-news-ghost" data-action="import-defaults" hidden>Khôi phục mặc định</button>
            <button class="ago-news-ghost" data-action="cancel-edit" hidden>Đóng</button>
            <button class="ago-news-primary" data-action="save-edit" hidden>Lưu danh sách</button>
            <button class="ago-news-ghost" data-action="edit">Chỉnh sửa</button>
            <button class="ago-news-close" data-close="1" aria-label="Đóng">×</button>
          </div>
        </div>
        <div class="ago-news-toolbar">
          <input class="ago-news-search" type="text" placeholder="Tìm nhanh tên báo..." />
          <button class="ago-news-ghost" data-action="reset-view">Xóa lọc</button>
        </div>
        <div class="ago-news-columns">
          <section class="ago-news-panel">
            <div class="ago-news-panel-head"><span>Báo Địa phương</span><div class="ago-news-panel-head-right"><button class="ago-news-ghost small" data-action="add-local" hidden>+ Thêm</button><b class="ago-news-count" data-count="local">0</b></div></div>
            <div class="ago-news-list" data-list="local"></div>
          </section>
          <section class="ago-news-panel">
            <div class="ago-news-panel-head"><span>Báo, Tạp chí Trung ương</span><div class="ago-news-panel-head-right"><button class="ago-news-ghost small" data-action="add-central" hidden>+ Thêm</button><b class="ago-news-count" data-count="central">0</b></div></div>
            <div class="ago-news-list" data-list="central"></div>
          </section>
        </div>
      </div>`;
    __tmAppendWhenReady(root);
    agoNewsModal = root;

    const searchInput = root.querySelector('.ago-news-search');
        const localListEl = root.querySelector('[data-list="local"]');
    const centralListEl = root.querySelector('[data-list="central"]');
    const localCountEl = root.querySelector('[data-count="local"]');
    const centralCountEl = root.querySelector('[data-count="central"]');

    root.__state = { data: agoNewsClone(AGO_NEWS_DEFAULTS), draft: agoNewsClone(AGO_NEWS_DEFAULTS), q: '', tooltipEl: null, editing: false };

    function renderLists() {
      const editing = !!root.__state.editing;
      const q = editing ? '' : (root.__state.q || '').trim().toLowerCase();
      const sourceLocal = editing ? root.__state.draft.local : root.__state.data.local;
      const sourceCentral = editing ? root.__state.draft.central : root.__state.data.central;
      const local = agoNewsSortPinned(sourceLocal.filter(item => !q || item.name.toLowerCase().includes(q)));
      const central = agoNewsSortPinned(sourceCentral.filter(item => !q || item.name.toLowerCase().includes(q)));
      localCountEl.textContent = String(sourceLocal.length);
      centralCountEl.textContent = String(sourceCentral.length);
      renderList(localListEl, local, 'local', editing ? 'Chưa có Báo Địa phương.' : 'Không tìm thấy Báo Địa phương phù hợp.');
      renderList(centralListEl, central, 'central', editing ? 'Chưa có báo trung ương.' : 'Không tìm thấy báo trung ương phù hợp.');
    }

    function renderList(target, items, group, emptyText) {
      target.innerHTML = '';
      if (!items.length) {
        const empty = document.createElement('div');
        empty.className = 'ago-news-empty';
        empty.textContent = emptyText;
        target.appendChild(empty);
        return;
      }
      const frag = document.createDocumentFragment();
      if (root.__state.editing) {
        items.forEach((item) => frag.appendChild(editorCard(item, group, root.__state.draft[group].indexOf(item))));
      } else {
        items.forEach((item) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'ago-news-item';
          btn.dataset.note = item.note || '';
          btn.innerHTML = `
            <span class="ago-news-item-main">
              <span class="ago-news-fav${item.favorite ? ' is-on' : ''}" title="${item.favorite ? 'Bỏ ghim' : 'Ghim lên đầu'}" aria-label="${item.favorite ? 'Bỏ ghim' : 'Ghim lên đầu'}" role="button" tabindex="0">${item.favorite ? '★' : '☆'}</span>
              <span class="ago-news-icon-wrap">
                ${item.url ? `<img class="ago-news-icon" src="${agoNewsEscapeHtml(agoNewsFavicon(item.url))}" alt="" loading="lazy" referrerpolicy="no-referrer">` : '<span class="ago-news-icon-fallback">📰</span>'}
              </span>
              <span class="ago-news-item-name">${agoNewsEscapeHtml(item.name)}</span>
            </span>`;
          btn.addEventListener('click', () => agoNewsOpen(item.url));
          const fav = btn.querySelector('.ago-news-fav');
          async function toggleFavorite(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            item.favorite = !item.favorite;
            const saved = await agoNewsSave(root.__state.data);
            root.__state.data = saved;
            root.__state.draft = agoNewsClone(saved);
            renderLists();
          }
          fav.addEventListener('click', toggleFavorite);
          fav.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') toggleFavorite(ev);
          });
          const iconImg = btn.querySelector('.ago-news-icon');
          if (iconImg) {
            iconImg.addEventListener('error', () => {
              const fallback = document.createElement('span');
              fallback.className = 'ago-news-icon-fallback';
              fallback.textContent = '📰';
              iconImg.replaceWith(fallback);
            }, { once: true });
          }
          frag.appendChild(btn);
        });
      }
      target.appendChild(frag);
    }

    function editorCard(item, group, idx) {
      const wrap = document.createElement('div');
      wrap.className = 'ago-news-inline-card';
      wrap.innerHTML = `
        <div class="ago-news-inline-top">
          <label class="ago-news-inline-name"><span>Tên báo</span><input data-field="name" value="${agoNewsEscapeHtml(item.name)}" /></label>
          <label class="ago-news-inline-fav"><input type="checkbox" data-field="favorite" ${item.favorite ? 'checked' : ''}> Ghim</label>
        </div>
        <label class="ago-news-inline-field"><span>Liên kết</span><input data-field="url" value="${agoNewsEscapeHtml(item.url)}" placeholder="https://..." /></label>
        <label class="ago-news-inline-field"><span>Ghi chú</span><textarea data-field="note" rows="2" placeholder="Hiện khi hover">${agoNewsEscapeHtml(item.note)}</textarea></label>
        <div class="ago-news-inline-actions">
          <button class="ago-news-ghost small" data-action="up">↑</button>
          <button class="ago-news-ghost small" data-action="down">↓</button>
          <button class="ago-news-danger small" data-action="remove">Xóa</button>
        </div>`;
      const updateField = (field, value) => {
        if (!root.__state.draft[group][idx]) return;
        root.__state.draft[group][idx][field] = value;
      };
      wrap.querySelectorAll('input,textarea').forEach((el) => {
        const evtName = (el.type === 'checkbox') ? 'change' : 'input';
        el.addEventListener(evtName, () => updateField(el.dataset.field, el.type === 'checkbox' ? !!el.checked : el.value));
      });
      wrap.querySelector('[data-action="remove"]').addEventListener('click', (ev) => {
        ev.preventDefault();
        root.__state.draft[group].splice(idx, 1);
        renderLists();
      });
      wrap.querySelector('[data-action="up"]').addEventListener('click', (ev) => {
        ev.preventDefault();
        if (idx <= 0) return;
        const arr = root.__state.draft[group];
        const temp = arr[idx - 1]; arr[idx - 1] = arr[idx]; arr[idx] = temp;
        renderLists();
      });
      wrap.querySelector('[data-action="down"]').addEventListener('click', (ev) => {
        ev.preventDefault();
        const arr = root.__state.draft[group];
        if (idx >= arr.length - 1) return;
        const temp = arr[idx + 1]; arr[idx + 1] = arr[idx]; arr[idx] = temp;
        renderLists();
      });
      return wrap;
    }

    function ensureTooltipEl() {
      if (root.__state.tooltipEl && root.__state.tooltipEl.isConnected) return root.__state.tooltipEl;
      const el = document.createElement('div');
      el.className = 'ago-news-floating-tooltip';
      el.hidden = true;
      __tmAppendWhenReady(el);
      root.__state.tooltipEl = el;
      return el;
    }

    function showTooltipFor(btn) {
      if (!btn) return;
      const note = String(btn.dataset.note || '').trim();
      const tip = ensureTooltipEl();
      tip.innerHTML = note
        ? `<div class="ago-news-tooltip-title">GHI CHÚ</div><div class="ago-news-tooltip-body">${agoNewsNoteHtml(note)}</div>`
        : `<div class="ago-news-tooltip-title">GHI CHÚ</div><div class="ago-news-tooltip-empty">Không có ghi chú</div>`;
      tip.hidden = false;
      const rect = btn.getBoundingClientRect();
      const margin = 14;
      const width = Math.min(tip.offsetWidth || 320, window.innerWidth - 24);
      let left = rect.right + margin;
      let top = rect.top + (rect.height / 2);
      if (left + width > window.innerWidth - 12) left = Math.max(12, rect.left - width - margin);
      let translateY = -50;
      if (top < 70) { top = rect.bottom + margin; translateY = 0; }
      if (top > window.innerHeight - 70) { top = rect.top - margin; translateY = -100; }
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
      tip.style.transform = `translateY(${translateY}%)`;
      tip.dataset.open = '1';
    }

    function hideTooltip() {
      const tip = root.__state.tooltipEl;
      if (!tip) return;
      tip.hidden = true;
      tip.dataset.open = '0';
    }

    root.addEventListener('mouseover', (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('.ago-news-item') : null;
      if (!root.__state.editing && btn && root.contains(btn)) showTooltipFor(btn);
    });
    root.addEventListener('mouseout', (e) => {
      const from = e.target && e.target.closest ? e.target.closest('.ago-news-item') : null;
      if (!from) return;
      const to = e.relatedTarget && e.relatedTarget.closest ? e.relatedTarget.closest('.ago-news-item') : null;
      if (from !== to) hideTooltip();
    });
    window.addEventListener('scroll', hideTooltip, true);
    window.addEventListener('resize', hideTooltip);

    function syncEditUi() {
      const editing = !!root.__state.editing;
      const editBtn = root.querySelector('[data-action="edit"]');
      const saveBtn = root.querySelector('[data-action="save-edit"]');
      const cancelBtn = root.querySelector('[data-action="cancel-edit"]');
      const defaultsBtn = root.querySelector('[data-action="import-defaults"]');
      const addBtns = root.querySelectorAll('[data-action="add-local"],[data-action="add-central"]');
      if (editBtn) editBtn.hidden = editing;
      if (saveBtn) saveBtn.hidden = !editing;
      if (cancelBtn) cancelBtn.hidden = !editing;
      if (defaultsBtn) defaultsBtn.hidden = !editing;
      addBtns.forEach(btn => btn.hidden = !editing);
      root.classList.toggle('is-editing', editing);
      hideTooltip();
    }

    root.__renderLists = renderLists;
    root.__open = function(data) {
      root.hidden = false;
      hideTooltip();
      root.__state.data = agoNewsNormalizeData(data);
      root.__state.draft = agoNewsClone(root.__state.data);
      root.__state.q = '';
      searchInput.value = '';
      root.__state.editing = false;
      syncEditUi();
      renderLists();
    };

    searchInput.addEventListener('input', () => {
      root.__state.q = searchInput.value || '';
      renderLists();
    });

    root.addEventListener('click', async (e) => {
      const action = e.target && e.target.getAttribute && e.target.getAttribute('data-action');
      if (e.target && e.target.getAttribute && e.target.getAttribute('data-close') === '1') {
        hideTooltip();
        root.hidden = true;
        return;
      }
      if (!action) return;
      if (action === 'reset-view') {
        root.__state.q = '';
        searchInput.value = '';
        renderLists();
      } else if (action === 'edit') {
        root.__state.draft = agoNewsClone(root.__state.data);
        root.__state.editing = true;
        syncEditUi();
        renderLists();
      } else if (action === 'cancel-edit') {
        root.__state.editing = false;
        root.__state.draft = agoNewsClone(root.__state.data);
        syncEditUi();
        renderLists();
      } else if (action === 'add-local') {
        root.__state.draft.local.push({ name:'', url:'', note:'' });
        renderLists();
      } else if (action === 'add-central') {
        root.__state.draft.central.push({ name:'', url:'', note:'' });
        renderLists();
      } else if (action === 'import-defaults') {
        root.__state.draft = agoNewsClone(AGO_NEWS_DEFAULTS);
        renderLists();
      } else if (action === 'save-edit') {
        const saved = await agoNewsSave(root.__state.draft);
        root.__state.data = saved;
        root.__state.draft = agoNewsClone(saved);
        root.__state.editing = false;
      syncEditUi();
        renderLists();
        toast('Đã lưu danh sách báo');
      }
    });

    root.hidden = true;
    return root;
  }

  function openAgoNewsModal() {
    const modal = ensureAgoNewsModal();
    if (!modal.hidden) {
      if (modal.__state && modal.__state.tooltipEl) modal.__state.tooltipEl.hidden = true;
      modal.hidden = true;
      return;
    }
    agoNewsLoad().then((data) => modal.__open(data));
  }

  GM_addStyle(`
    .ago-news-modal{position:fixed;inset:0;z-index:2147483646;}
    .ago-news-overlay{position:absolute;inset:0;background:rgba(15,23,42,.45);backdrop-filter:blur(2px);}
    .ago-news-dialog{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(920px,calc(100vw - 40px));max-height:min(calc(100vh - 104px),730px);display:flex;flex-direction:column;border-radius:24px;background:rgba(255,255,255,.98);border:1px solid rgba(148,163,184,.22);box-shadow:0 24px 64px rgba(15,23,42,.24);overflow:hidden;font:14px/1.5 "Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}
    .ago-news-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:18px 20px 16px;border-bottom:1px solid rgba(148,163,184,.14);background:linear-gradient(180deg,#f8fbff 0%,#ffffff 82%);}
    .ago-news-header-main{display:flex;align-items:center;gap:14px;min-width:0;flex:1;}
    .ago-news-header-main::before{display:none !important;content:none !important;}
    .ago-news-title-wrap{min-width:0;display:flex;flex-direction:column;gap:4px;}
    .ago-news-title{margin:0;font-size:30px;line-height:1.15;font-weight:700;color:#0f172a;letter-spacing:-.02em;word-break:break-word;}
    .ago-news-subtitle{margin-top:0;color:#64748b;font-size:14px;line-height:1.5;}
    .ago-news-head-actions,.ago-news-panel-head-right{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
    .ago-news-close,.ago-news-ghost,.ago-news-primary,.ago-news-danger{border:1px solid rgba(148,163,184,.25);background:#fff;color:#334155;border-radius:12px;padding:10px 14px;font-weight:700;cursor:pointer;}
    .ago-news-close{width:40px;height:40px;padding:0;font-size:22px;line-height:1;}
    .ago-news-primary{background:linear-gradient(180deg,#2e6cf6,#1f5cd7);border-color:#1f5cd7;color:#fff;}
    .ago-news-danger{background:#fff1f2;border-color:#fecdd3;color:#be123c;}
    .ago-news-ghost.small,.ago-news-danger.small{padding:7px 10px;border-radius:10px;font-size:12px;}
    .ago-news-toolbar{display:flex;gap:10px;align-items:center;padding:12px 20px;border-bottom:1px solid rgba(148,163,184,.14);background:#fcfdff;}
    .ago-news-search{flex:1;min-width:0;border:1px solid rgba(148,163,184,.3);border-radius:14px;padding:12px 14px;font-size:14px;outline:none;}
    .ago-news-search:focus{border-color:rgba(37,99,235,.46);box-shadow:0 0 0 4px rgba(37,99,235,.09);}
    .ago-news-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px 20px 16px;overflow:hidden;min-height:300px;}
    .ago-news-panel{min-width:0;border:1px solid rgba(148,163,184,.2);border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(248,250,252,.96));box-shadow:0 12px 28px rgba(15,23,42,.06);display:flex;flex-direction:column;overflow:hidden;}
    .ago-news-panel-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:15px 16px;border-bottom:1px solid rgba(148,163,184,.14);font-size:15px;font-weight:800;color:#0f172a;background:rgba(255,255,255,.76);}
    .ago-news-count{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:28px;padding:0 10px;border-radius:999px;background:rgba(148,163,184,.12);font-size:12px;color:#64748b;}
    .ago-news-list{flex:1;overflow:auto;padding:10px;}
    .ago-news-list::-webkit-scrollbar{width:10px;height:10px;}
    .ago-news-list::-webkit-scrollbar-thumb{background:rgba(148,163,184,.36);border-radius:999px;border:2px solid transparent;background-clip:padding-box;}
    .ago-news-item{position:relative;width:100%;display:flex;align-items:center;justify-content:flex-start;gap:8px;padding:8px 10px;margin:0 0 6px;border-radius:12px;border:1px solid transparent;background:#fff;cursor:pointer;text-align:left;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease;color:#0f172a;min-height:44px;}
    .ago-news-item:hover{transform:translateY(-1px);background:#eef4ff;border-color:rgba(59,130,246,.18);box-shadow:0 12px 24px rgba(37,99,235,.10);}
    .ago-news-item-main{min-width:0;display:flex;align-items:center;gap:8px;flex:1;width:100%;}
    .ago-news-fav{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:0;background:transparent;color:#94a3b8;font-size:18px;cursor:pointer;border-radius:999px;flex:0 0 auto;padding:0;}
    .ago-news-fav:hover{background:rgba(245,158,11,.12);color:#f59e0b;}
    .ago-news-fav.is-on{color:#f59e0b;}
    .ago-news-icon-wrap{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex:0 0 auto;}
    .ago-news-icon{width:18px;height:18px;border-radius:4px;display:block;}
    .ago-news-icon-fallback{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;font-size:14px;}
    .ago-news-item-name{font-weight:600;line-height:1.25;min-width:0;font-size:14px;}
    .ago-news-floating-tooltip{position:fixed;left:0;top:0;z-index:2147483647;width:max-content;max-width:min(420px,calc(100vw - 24px));padding:12px 14px;border-radius:16px;background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(20,31,58,.98));color:#f8fafc;font-size:12px;line-height:1.58;box-shadow:0 20px 44px rgba(15,23,42,.24);border:1px solid rgba(148,163,184,.14);white-space:normal;pointer-events:none;}
    .ago-news-tooltip-title{display:block;margin-bottom:6px;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#bfdbfe;}
    .ago-news-tooltip-body{white-space:pre-line;color:#e2e8f0;font-size:12.5px;line-height:1.6;}
    .ago-news-tooltip-empty{color:#cbd5e1;font-style:italic;}
    .ago-news-empty{display:grid;place-items:center;height:100%;min-height:120px;padding:20px;text-align:center;color:#64748b;}
    .ago-news-inline-card{padding:10px 10px 8px;border:1px solid rgba(148,163,184,.18);border-radius:14px;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.04);margin-bottom:10px;}
    .ago-news-inline-top{display:flex;gap:10px;align-items:end;margin-bottom:8px;}
    .ago-news-inline-name{flex:1;display:flex;flex-direction:column;gap:4px;}
    .ago-news-inline-name span,.ago-news-inline-field span{font-size:11px;font-weight:700;color:#64748b;}
    .ago-news-inline-field{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;}
    .ago-news-inline-card input,.ago-news-inline-card textarea{width:100%;border:1px solid rgba(148,163,184,.28);border-radius:10px;padding:8px 10px;font:13px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Arial;outline:none;resize:vertical;background:#fff;}
    .ago-news-inline-card input:focus,.ago-news-inline-card textarea:focus{border-color:rgba(37,99,235,.46);box-shadow:0 0 0 3px rgba(37,99,235,.08);}
    .ago-news-inline-fav{white-space:nowrap;color:#475569;font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;padding-bottom:8px;}
    .ago-news-inline-actions{display:flex;justify-content:flex-end;gap:8px;}
    .ago-news-modal.is-editing .ago-news-search{opacity:.6;}
    @media (max-width: 860px){.ago-news-dialog{width:min(96vw,920px);max-height:min(calc(100vh - 48px),92vh);}.ago-news-header{padding:16px 16px 14px;}.ago-news-header-main{gap:12px;}.ago-news-header-main::before{width:36px;height:36px;flex-basis:36px;border-radius:12px;}.ago-news-title{font-size:24px;}.ago-news-columns{grid-template-columns:1fr;}.ago-news-floating-tooltip{max-width:min(420px,calc(100vw - 24px));}}
  `);

const ACTIONS = [
  { id:'center',   icon: ICON_ALIGN_CENTER, label:'CENTER',   hotkey:'F2',      accent:'red',    run: () => { const x=safeActiveEditor(); if (x) f2_toggle(x.ed); } },
  { id:'format',   icon:'✨',               label:'FORMAT', hotkey:'',        accent:'red',    run: () => { const x=safeActiveEditor(); if (x) format_run(x.ed, x.CK); } },
  { id:'backlink', icon:'<span class="cke_button_icon cke_button__link_icon" style="background-image:url(https://crmag.baoangiang.com.vn/fckeditor2/ckeditor/plugins/icons.png?t=E3OD);background-position:0 -1248px;background-size:auto;display:inline-block;width:16px;height:16px;">&nbsp;</span>', label:'BACKLINK', hotkey:'F3', accent:'violet', run: function (btn) { toggleBacklinkPanel((btn && btn.querySelector('.tm-act-arrow')) || btn); } },
  { id:'author',   icon:'✍️',               label:'AUTHOR',   hotkey:'F4',      accent:'slate',  run: () => { const x=safeActiveEditor(); if (x) author_finalize(x.ed, x.CK); } },
  { id:'blue',     icon:'🟦',               label:'BLUE',     hotkey:'F6',      accent:'blue',   run: () => { const x=safeActiveEditor(); if (x) blue_run(x.ed, x.CK); } },
  { id:'box',      icon:'🟨',               label:'BOX',      hotkey:'F9',      accent:'yellow', run: function (btn) { toggleBoxMenu(btn); } },
  { id:'spellcheck', icon:'🔍',             label:'KIỂM TRA', hotkey:'',        accent:'cyan',   run: () => { window.dispatchEvent(new CustomEvent('ago-spellcheck-run')); } },
  { id:'count',    icon:'🔢',              label:'COUNT', hotkey:'',        accent:'pink',   run: function (btn) { toggleCountPanel(btn); } },
  { id:'truc',     icon:'📅',               label:'TRỰC',     hotkey:'F8',      accent:'black',  run: () => { openLichTrucModal(); } },
  { id:'news',     icon:'📰',               label:'BÁO',      hotkey:'',        accent:'blue',   run: () => { openAgoNewsModal(); } },
];
  const map = {};
  ACTIONS.forEach(a => map[a.id] = a);
  const defaultIds = ACTIONS.map(a => a.id);
  bindCustomShortcutHandlers(ACTIONS, defaultIds);

  // ========= create toolbar =========
  const bar = document.createElement('div');
  bar.className = 'tm-bar';
  bar.id = 'tm-ckeditor-bar';

  const GEAR_SVG = `
    <span class="tm-gear" aria-hidden="true">⚙️</span>
  `;

  const toggleInBar = document.createElement('div');
  toggleInBar.className = 'tm-toggle';
  toggleInBar.title = 'Tùy chỉnh toolbar';
  toggleInBar.innerHTML = GEAR_SVG;

 const actionsWrap = document.createElement('div');
  actionsWrap.className = 'tm-actions';

  bar.appendChild(toggleInBar);
  bar.appendChild(actionsWrap);

  __tmAppendWhenReady(bar);

  // saber border
  addSaberStroke(bar);

  function addSaberStroke(barEl){
    if (barEl.querySelector('.tm-saber')) return;

    const saber = document.createElement('div');
    saber.className = 'tm-saber';
    saber.innerHTML = `<svg aria-hidden="true"><rect pathLength="1000"></rect></svg>`;
    barEl.insertBefore(saber, barEl.firstChild);

    const svg  = saber.querySelector('svg');
    const rect = saber.querySelector('rect');

    function sync(){
      const sw = 1.1;
      const r = barEl.getBoundingClientRect();
      const w = Math.max(10, r.width);
      const h = Math.max(10, r.height);
      const br = parseFloat(getComputedStyle(barEl).borderRadius) || 18;

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      svg.setAttribute('preserveAspectRatio', 'none');

      rect.setAttribute('x', (sw/2).toFixed(2));
      rect.setAttribute('y', (sw/2).toFixed(2));
      rect.setAttribute('width',  (w - sw).toFixed(2));
      rect.setAttribute('height', (h - sw).toFixed(2));
      rect.setAttribute('rx', Math.max(0, br - sw/2).toFixed(2));
      rect.setAttribute('ry', Math.max(0, br - sw/2).toFixed(2));
    }

sync();
const ro = new ResizeObserver(sync);
ro.observe(barEl);
window.addEventListener('resize', sync);

// ===== SABER RAINBOW RANDOM =====
// ===== SABER HSL RANDOM (0..360) =====
if (!barEl._tmSaberColorTimer) {
  let hue = Math.floor(Math.random() * 360);

  function setRandomSaberHue() {
    // nhảy hue một đoạn để tránh màu quá gần nhau
    const step = 25 + Math.floor(Math.random() * 85); // 25..109
    hue = (hue + step) % 360;

    barEl.style.setProperty('--saber-h', String(hue));
  }

  setRandomSaberHue(); // màu đầu tiên
  barEl._tmSaberColorTimer = setInterval(setRandomSaberHue, 750); // đổi màu ~0.75s
}
  }

  // particles
(function addParticles(barEl){
  const layer = document.createElement('div');
  layer.className = 'tm-particles';

  // 7 màu (RGB triplets)
  const P_COLORS = [
    '244, 67, 54',   // đỏ
    '255, 152, 0',   // cam
    '255, 235, 59',  // vàng
    '76, 175, 80',   // xanh lá
    '0, 188, 212',   // cyan
    '33, 150, 243',  // xanh dương
    '156, 39, 176'   // tím
  ];

  const N = 18;
  for (let i = 0; i < N; i++) {
    const s = document.createElement('span');

    // đảm bảo có đủ 7 màu (lặp vòng)
const rgb = P_COLORS[Math.floor(Math.random() * P_COLORS.length)];
    s.style.setProperty('--pcol-rgb', rgb);

    const size = (4 + Math.random() * 3.2);
    s.style.width = s.style.height = size.toFixed(1) + 'px';
    s.style.left = (Math.random() * 100).toFixed(1) + '%';
    s.style.animationDuration = (3.2 + Math.random() * 5.2).toFixed(2) + 's';
    s.style.animationDelay = (-Math.random() * 6).toFixed(2) + 's';
    s.style.opacity = (0.25 + Math.random() * 0.65).toFixed(2);

    layer.appendChild(s);
  }

  barEl.insertBefore(layer, barEl.firstChild);
})(bar);

  const fabToggle = document.createElement('div');
  fabToggle.className = 'tm-toggle fab';
  fabToggle.title = 'Tùy chỉnh toolbar';
  fabToggle.innerHTML = GEAR_SVG;
  fabToggle.style.display = 'none';
  __tmAppendWhenReady(fabToggle);

  let draggingEl = null;

  function getAfterElement(container, x, y) {
    const els = [].slice.call(container.querySelectorAll('.tm-act:not(.dragging)'));
    let closest = { score: Number.POSITIVE_INFINITY, element: null };
    els.forEach(function (child) {
      const box = child.getBoundingClientRect();
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
      const dx = centerX - x;
      const dy = centerY - y;
      const score = Math.abs(dx) + Math.abs(dy) * 1.5;
      if (x <= centerX && score < closest.score) closest = { score, element: child };
    });
    return closest.element;
  }

  actionsWrap.addEventListener('dragover', function (e) {
    if (!reorderMode) return;
    e.preventDefault();
    if (!draggingEl) return;
    const afterEl = getAfterElement(actionsWrap, e.clientX, e.clientY);
    if (afterEl == null) actionsWrap.appendChild(draggingEl);
    else actionsWrap.insertBefore(draggingEl, afterEl);
  });

  actionsWrap.addEventListener('drop', function (e) {
    if (!reorderMode) return;
    e.preventDefault();
    if (!draggingEl) return;
    saveOrderFromDOM(actionsWrap);
  });

  function attachDrag(btn) {
    btn.addEventListener('dragstart', function (e) {
      if (!reorderMode) {
        e.preventDefault();
        return;
      }
      closeBoxMenu();
      closeTriangleMenu();
      if (settingsMenuEl) closeSettingsMenu({ keepReorder: true });
      draggingEl = btn;
      btn.classList.add('dragging');
      try { e.dataTransfer.setData('text/plain', btn.dataset.actionId || ''); } catch (_) {}
      try { e.dataTransfer.effectAllowed = 'move'; } catch (_) {}
    });

    btn.addEventListener('dragend', function () {
      if (draggingEl) draggingEl.classList.remove('dragging');
      draggingEl = null;
      saveOrderFromDOM(actionsWrap);
    });
  }

  function makeBtn(a) {
    const btn = document.createElement('div');
    btn.className = 'tm-act tm-act-' + a.id + (a.id === 'backlink' ? ' tm-act-split' : '');
    btn.draggable = reorderMode;
    btn.dataset.actionId = a.id;
    const shortcuts = getEffectiveShortcutMap(ACTIONS, defaultIds);
    var titleText = shortcuts[a.id] ? (a.label + ' • ' + shortcuts[a.id]) : a.label;
    if (a.id === 'backlink') {
      titleText = 'BACKLINK • ' + backlink_getSelectedUrl() + ' • ' + (shortcuts[a.id] || 'F3');
      btn.innerHTML =
        '<span class="tm-act-main"><span class="tm-act-icon">' + (a.icon || '') + '</span><span>' + a.label + '</span></span>' +
        '<button class="tm-act-arrow" type="button" aria-label="Mở danh sách backlink">▼</button>' +
        '<span class="tm-handle">⋮⋮</span>';
      var arrow = btn.querySelector('.tm-act-arrow');
      if (arrow) {
        arrow.draggable = false;
        ['pointerdown', 'mousedown'].forEach(function (evtName) {
          arrow.addEventListener(evtName, function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          }, true);
        });
        arrow.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          if (reorderMode) {
            toast('↕️ Đang ở chế độ sắp xếp (tắt trong ⚙️ để dùng nút)');
            return;
          }
          toggleBacklinkPanel(arrow);
        }, true);
      }
    } else {
      btn.innerHTML =
        '<span class="tm-act-icon">' + (a.icon || '') + '</span>' +
        '<span>' + a.label + '</span>' +
        '<span class="tm-handle">⋮⋮</span>';
    }
    btn.title = titleText;

    if (a.id === 'backlink') {
      ['pointerdown', 'mousedown'].forEach(function (evtName) {
        btn.addEventListener(evtName, function () { backlink_capturePanelContext(); }, true);
      });
    }

    btn.addEventListener('click', function (e) {
      if (a.id === 'backlink' && e.target && e.target.closest('.tm-act-arrow')) {
        return;
      }

      e.preventDefault(); e.stopPropagation();

      if (reorderMode) {
        toast('↕️ Đang ở chế độ sắp xếp (tắt trong ⚙️ để dùng nút)');
        return;
      }

      Promise.resolve().then(() => a.run && a.run(btn, e)).catch(err => {
        console.error(err);
        toast('⚠️ Lỗi action');
      });
    }, true);

    attachDrag(btn);
    return btn;
  }

  function render() {
    actionsWrap.innerHTML = '';
    const order = loadOrder(defaultIds);
    const hiddenIds = new Set(loadHiddenActionIds(defaultIds));

    order.forEach(id => {
      if (map[id] && !hiddenIds.has(id)) {
        actionsWrap.appendChild(makeBtn(map[id]));
      }
    });

    setReorderMode(reorderMode, true);
  }

function setHidden(hidden) {
  saveHidden(hidden);

  closeTriangleMenu();
  closeBoxMenu();
  closeBacklinkPanel();
  closeSettingsMenu();

  if (hidden) {
    bar.classList.add('hidden');
    fabToggle.style.display = 'grid';
    document.documentElement.classList.remove('tm-pad-bottom');
    __tmBodyRemoveClass('tm-pad-bottom');
  } else {
    bar.classList.remove('hidden');
    fabToggle.style.display = 'none';
    document.documentElement.classList.add('tm-pad-bottom');
    __tmBodyAddClass('tm-pad-bottom');
  }
}

function bindTriangleToggleButton(btn) {
  let clickTimer = null;
  const DBL_MS = 220; // phân biệt click vs double-click

  // Click thường => mở menu tam giác
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    if (clickTimer) return; // click thứ 2 của dblclick

    clickTimer = setTimeout(function () {
      clickTimer = null;
      toggleTriangleMenu(btn, ACTIONS, defaultIds, render);
    }, DBL_MS);
  }, true);

  // Double-click => ẩn/hiện nhanh toolbar
  btn.addEventListener('dblclick', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }

    setHidden(!loadHidden());
  }, true);

  // Right-click => mở thẳng Settings
  btn.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // chặn menu chuột phải mặc định
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();

    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
    }

    // đóng menu khác trước khi mở settings
    closeTriangleMenu();
    closeBoxMenu();
  closeSettingsMenu();

    // mở settings ngay tại vị trí nút tam giác / floating
    toggleSettingsMenu(btn, ACTIONS, defaultIds, render);
  }, true);
}
    bindTriangleToggleButton(toggleInBar);
bindTriangleToggleButton(fabToggle);

  render();
  setHidden(loadHidden());
  scheduleCountEditorBinding();
}
    /***********************
 * LỊCH TRỰC MODULE
 ***********************/
const LS_LICH_KEY = 'tm_lichtruc_html_v1';
function resetLichTrucFile() {
  try { localStorage.removeItem(LS_LICH_KEY); } catch (_) {}
  toast('🗑️ Đã xóa lịch trực');
}
    function lich_updateSafeInsetVars() {
  const root = document.documentElement;
  let safeTop = 86;      // fallback
  let safeBottom = 82;   // fallback

  // Dò header / thanh trên của site (bỏ qua UI tm-* của script)
  document.querySelectorAll('body *').forEach(el => {
    if (!el || !el.getBoundingClientRect) return;
    if (el.id === 'tm-ckeditor-bar') return;

    const cls = (el.className || '').toString();
    if (cls.includes('tm-')) return;

    const cs = getComputedStyle(el);
    if (!['fixed', 'sticky'].includes(cs.position)) return;
    if (cs.display === 'none' || cs.visibility === 'hidden') return;

    const r = el.getBoundingClientRect();
    if (r.width < window.innerWidth * 0.55 || r.height < 38) return;

    if (r.top <= 4 && r.bottom > 0) {
      safeTop = Math.max(safeTop, Math.ceil(r.bottom) + 8);
    }
  });

  // Toolbar dưới của script
  const bar = document.getElementById('tm-ckeditor-bar');
  const fab = document.querySelector('.tm-toggle.fab');

  if (bar && !bar.classList.contains('hidden')) {
    const r = bar.getBoundingClientRect();
    safeBottom = Math.max(safeBottom, Math.ceil(window.innerHeight - r.top) + 8);
  } else if (fab && getComputedStyle(fab).display !== 'none') {
    const r = fab.getBoundingClientRect();
    safeBottom = Math.max(safeBottom, Math.ceil(window.innerHeight - r.top) + 8);
  }

  root.style.setProperty('--tm-safe-top', safeTop + 'px');
  root.style.setProperty('--tm-safe-bottom', safeBottom + 'px');
}

function uploadLichTrucFile(onDone) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.docx';

  input.onchange = async function () {
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
      try {
        const arrayBuffer = e.target.result;

        if (!window.mammoth) {
          alert('Thiếu thư viện mammoth.js');
          return;
        }

        const result = await window.mammoth.convertToHtml({ arrayBuffer });
        const htmlRaw = result.value;
        const htmlStyled = buildLichTrucHtml(htmlRaw);

          localStorage.setItem(LS_LICH_KEY, htmlStyled);

        toast('✅ Đã cập nhật lịch trực mới');

        if (typeof onDone === 'function') {
          onDone({ fileName: file.name, html: htmlStyled });
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi đọc file lịch trực');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  input.click();
}
function buildLichTrucHtml(rawHtml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // ===== helpers =====
  function norm(s) {
    return (s || '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }
    function normalizeThuRaw(s) {
  let x = (s || '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!x) return '';

  // Nếu không có ngoặc mà chỉ là CN -> thêm ngoặc
  if (/^cn$/i.test(x)) x = '(CN)';

  // Đổi (CN) -> (Chủ Nhật)
  if (/^\(\s*cn\s*\)$/i.test(x)) return '(Chủ Nhật)';

  return x;
}

  function cellLines(td) {
    if (!td) return [];

    const out = [];
    const ps = td.querySelectorAll('p');

    if (ps.length) {
      ps.forEach(p => {
        const t = (p.textContent || '').replace(/\u00A0/g, ' ').trim();
        if (t) out.push(t);
      });
    } else {
      const txt = (td.textContent || '').replace(/\u00A0/g, ' ');
      txt.split(/\r?\n/).forEach(x => {
        x = x.trim();
        if (x) out.push(x);
      });
    }

    return out;
  }

  // Expand table -> grid (xử lý rowspan/colspan)
  function tableToGrid(table) {
    const grid = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach((tr, r) => {
      if (!grid[r]) grid[r] = [];
      let c = 0;

      const cells = [...tr.children].filter(el => /^(TD|TH)$/i.test(el.tagName));
      cells.forEach(cell => {
        while (grid[r][c]) c++;

        const rs = Math.max(1, parseInt(cell.getAttribute('rowspan') || '1', 10) || 1);
        const cs = Math.max(1, parseInt(cell.getAttribute('colspan') || '1', 10) || 1);

        for (let rr = 0; rr < rs; rr++) {
          if (!grid[r + rr]) grid[r + rr] = [];
          for (let cc = 0; cc < cs; cc++) {
            grid[r + rr][c + cc] = cell; // fill span
          }
        }

        c += cs;
      });
    });

    return grid;
  }

  function findScheduleTable() {
    const tables = [...doc.querySelectorAll('table')];

    for (const tb of tables) {
      const grid = tableToGrid(tb);
      if (!grid.length) continue;

      // thử tìm header trong vài dòng đầu
      for (let hr = 0; hr < Math.min(3, grid.length); hr++) {
        const headers = (grid[hr] || []).map(td => norm(cellLines(td).join(' ')));

        const idxNgay = headers.findIndex(h => h.includes('ngày'));
        const idxXB   = headers.findIndex(h => h.includes('trực xuất bản'));
        const idxBT   = headers.findIndex(h => h.includes('trực biên tập'));
        const idxKT   = headers.findIndex(h => h.includes('trực kỹ thuật'));

        if (idxNgay >= 0 && idxXB >= 0 && idxBT >= 0 && idxKT >= 0) {
          return { grid, headerRow: hr, idxNgay, idxXB, idxBT, idxKT };
        }
      }
    }

    return null;
  }

  const found = findScheduleTable();
  if (!found) return '<p>Không tìm thấy bảng lịch trực</p>';

  const { grid, headerRow, idxNgay, idxXB, idxBT, idxKT } = found;
  const data = [];

  for (let r = headerRow + 1; r < grid.length; r++) {
    const row = grid[r] || [];

    const ngayCell = row[idxNgay];
    const xbCell   = row[idxXB];
    const btCell   = row[idxBT];
    const ktCell   = row[idxKT];

    const ngayLines = cellLines(ngayCell);
    const xbLines   = cellLines(xbCell);
    const btLines   = cellLines(btCell);
    const ktLines   = cellLines(ktCell);

    // Skip row ghi chú / row merge khác
    let ngayRaw = '';
    let thuRaw = '';

    for (const line of ngayLines) {
      if (!ngayRaw && /^\d{1,2}\/\d{1,2}$/.test(line)) {
        ngayRaw = line;
        continue;
      }
      if (!thuRaw && (/^\(.+\)$/.test(line) || /^cn$/i.test(line))) {
  thuRaw = line;
}
    }

    // fallback nếu cùng 1 dòng kiểu "12/2 (Thứ 5)"
    if (!ngayRaw) {
      const joined = ngayLines.join(' ');
      const mDate = joined.match(/\b(\d{1,2}\/\d{1,2})\b/);
      const mThu  = joined.match(/(\([^)]+\))/);
      if (mDate) ngayRaw = mDate[1];
      if (mThu) thuRaw = mThu[1];
    }
      thuRaw = normalizeThuRaw(thuRaw);

    if (!ngayRaw) continue; // không phải dòng lịch

    const xuatban = (xbLines[0] || '').trim();

    const bientap = btLines
      .map(x => x.replace(/^-+\s*/, '').trim())
      .filter(Boolean)
      .join('<br>');

    const kythuat = (ktLines[0] || '').trim();

    data.push({
      ngayRaw,
      thuRaw: thuRaw || '',
      xuatban,
      bientap,
      kythuat
    });
  }

  if (!data.length) return '<p>Không parse được dữ liệu</p>';

  // Build HTML mới (4 cột: bỏ Tuần + Ghi chú)
  let html = `
    <div class="tm-lich-wrap">
      <table class="tm-lich-table">
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Trực xuất bản</th>
            <th>Trực biên tập</th>
            <th>Trực kỹ thuật</th>
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach(row => {
    const isSun = /\(\s*(cn|chủ\s*nhật)\s*\)/i.test(row.thuRaw || '');
    const isSat = /Thứ\s*7/i.test(row.thuRaw || '');

    html += `
      <tr>
        <td class="tm-date-col">
          <div class="tm-date-cell ${isSun ? 'is-sun' : ''} ${isSat ? 'is-sat' : ''}">
            <span class="tm-date-main">${row.ngayRaw}</span>
            <span class="tm-date-sub">${row.thuRaw || ''}</span>
          </div>
        </td>
        <td>${row.xuatban || ''}</td>
        <td>${row.bientap || ''}</td>
        <td>${row.kythuat || ''}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}

let __tmLichModal = null;

function closeLichTrucModal() {
  const modal = __tmLichModal;
  if (!modal) return;

  // cleanup frozen header nếu có
  try {
    const fh = modal.querySelector('.tm-lich-freeze-head');
    if (fh && fh._tmCleanup) fh._tmCleanup();
  } catch (_) {}

  // remove resize listener (nếu đã gắn)
  try {
    if (modal._tmOnResize) window.removeEventListener('resize', modal._tmOnResize);
  } catch (_) {}

  // remove ESC listener (nếu đã gắn)
  try {
    if (modal._tmOnEsc) document.removeEventListener('keydown', modal._tmOnEsc, true);
  } catch (_) {}

  try { modal.remove(); } catch (_) {}
  __tmLichModal = null;
}
    function openLichTrucModal() {
        if (__tmLichModal && document.body && document.body.contains(__tmLichModal)) {
    closeLichTrucModal();
    return;
  }
  lich_updateSafeInsetVars();

  const html = localStorage.getItem(LS_LICH_KEY);
  const hasLich = !!html;
  const htmlContent = hasLich
    ? html
    : `
      <div class="tm-lich-empty" style="
        padding:32px 20px;
        text-align:center;
        color:#64748b;
        font:600 14px/1.6 system-ui,-apple-system,Segoe UI,Roboto,Arial;
      ">
        <div style="font-size:18px;font-weight:800;color:#334155;margin-bottom:8px;">
          Chưa thêm lịch trực
        </div>
        <div>
          Bấm <b>“Thêm lịch trực”</b> ở góc phải để tải file .docx lên.
        </div>
      </div>
    `;

  let modal = document.getElementById('tm-lich-modal');
  if (modal) modal.remove();

  modal = document.createElement('div');
  modal.id = 'tm-lich-modal';
modal.innerHTML = `
  <div class="tm-lich-overlay"></div>
  <div class="tm-lich-modal">
    <div class="tm-lich-content">
      <div class="tm-lich-topbar">
  <div class="tm-lich-brand">
    <div class="tm-lich-brand-title">AGO - An Giang Online</div>
  </div>

<div class="tm-lich-top-actions">
  <button type="button" class="tm-lich-top-btn add" data-lich-action="add">
    ➕ Thêm lịch trực
  </button>

  <button
    type="button"
    class="tm-lich-top-btn delete"
    data-lich-action="reset"
    title="Xóa lịch trực"
    aria-label="Xóa lịch trực"
  >
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M9 3h6l1 2h4M5 5h14M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12M10 10v7M14 10v7"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"/>
    </svg>
  </button>
</div>
</div>

      ${htmlContent}
    </div>
  </div>
`;

  __tmAppendWhenReady(modal);
        __tmLichModal = modal;
    const onResizeLich = () => lich_updateSafeInsetVars();
window.addEventListener('resize', onResizeLich);
function closeLichModal() {
  const fh = modal.querySelector('.tm-lich-freeze-head');
  if (fh && fh._tmCleanup) fh._tmCleanup();

  window.removeEventListener('resize', onResizeLich);
  modal.remove();
}
modal.addEventListener('click', function (e) {
  const btn = e.target.closest('[data-lich-action]');
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const action = btn.getAttribute('data-lich-action');

  // xử lý nút xóa
  if (action === 'reset') {
    if (!confirm("Xóa file lịch trực hiện tại?")) return;

    resetLichTrucFile();

    setTimeout(() => {
      try { closeLichModal(); } catch(e){}
      openLichTrucModal();
    },120);

    return;
  }

  // xử lý nút thêm
  if (action === 'add') {
    uploadLichTrucFile(function () {
      try { closeLichModal(); } catch (_) {}
      setTimeout(() => openLichTrucModal(), 80);
    });
    return;
  }

}, true);
 const box = modal.querySelector('.tm-lich-modal');

setTimeout(() => {
  box.classList.add('show');
}, 10);

  lich_processToday(modal);
    lich_mountFrozenHeader(modal);
    lich_enableRowMagnify(modal);

modal.querySelector('.tm-lich-overlay')
  .addEventListener('click', () => closeLichTrucModal());
  // ESC để đóng
modal._tmOnEsc = function (e) {
  if (e.key === 'Escape') closeLichTrucModal();
};
document.addEventListener('keydown', modal._tmOnEsc, true);
}

  /***********************
 * TODAY HIGHLIGHT + WIDGET
 ***********************/
function lich_getTodayString() {
  const t = new Date();
  const d = t.getDate();
  const m = t.getMonth() + 1;
  return d + '/' + m;
}
    function lich_getFullDateTime() {
  const now = new Date();

  const dd = String(now.getDate()).padStart(2,'0');
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const yyyy = now.getFullYear();

  const hh = String(now.getHours()).padStart(2,'0');
  const mi = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');

  return {
    date: `${dd}/${mm}/${yyyy}`,
    time: `${hh}:${mi}:${ss}`
  };
}
// ===== CONFIG GIỜ LÀM VIỆC =====
const WORK_1_START = 7 * 60;    // 07:00
const WORK_1_END   = 11 * 60;   // 11:00
const WORK_2_START = 13 * 60;   // 13:00
const WORK_2_END   = 17 * 60;   // 17:00
const WARN_BEFORE  = 30;        // báo gần hết giờ trước 30 phút

function newsroom_getStatus() {
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();

  // 07:00 - 11:00
  if (total >= WORK_1_START && total < WORK_1_END) {
    if (total >= WORK_1_END - WARN_BEFORE) {
      return { text: '⚠️ GẦN HẾT GIỜ', class: 'tm-status-warning' };
    }
    return { text: '🟢 ĐANG GIỜ HÀNH CHÍNH', class: 'tm-status-work' };
  }

  // 13:00 - 17:00
  if (total >= WORK_2_START && total < WORK_2_END) {
    if (total >= WORK_2_END - WARN_BEFORE) {
      return { text: '⚠️ GẦN HẾT GIỜ', class: 'tm-status-warning' };
    }
    return { text: '🟢 ĐANG GIỜ HÀNH CHÍNH', class: 'tm-status-work' };
  }

  // còn lại: ngoài giờ
  return { text: '🔴 NGOÀI GIỜ HÀNH CHÍNH', class: 'tm-status-after' };
}

function newsroom_countdown() {
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();

  let target = new Date(now);
  let label = '';

  if (total < WORK_1_START) {
    target.setHours(7, 0, 0, 0);
    label = '07:00';
  } else if (total < WORK_1_END) {
    target.setHours(11, 0, 0, 0);
    label = '11:00';
  } else if (total < WORK_2_START) {
    target.setHours(13, 0, 0, 0);
    label = '13:00';
  } else if (total < WORK_2_END) {
    target.setHours(17, 0, 0, 0);
    label = '17:00';
  } else {
    return 'Đã qua 17:00';
  }

  const diff = target - now;
  if (diff <= 0) return `Đã tới ${label}`;

  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return `Còn ${h}h ${m}m ${s}s tới ${label}`;
}

function newsroom_progress() {
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();

  let start = 0, end = 0;

  if (total < WORK_1_START) {
    return 0; // trước 07:00
  } else if (total < WORK_1_END) {
    start = WORK_1_START; end = WORK_1_END;       // 07-11
  } else if (total < WORK_2_START) {
    start = WORK_1_END;   end = WORK_2_START;     // 11-13 (ngoài giờ nhưng đếm tới 13:00)
  } else if (total < WORK_2_END) {
    start = WORK_2_START; end = WORK_2_END;       // 13-17
  } else {
    return 100; // sau 17:00
  }

  const pct = ((total - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, Math.floor(pct)));
}



    function lich_getWeekday() {
  const days = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy'
  ];
  return days[new Date().getDay()];
}



// Âm lịch đơn giản (dùng Intl nếu browser hỗ trợ)
function lich_getLunar() {
  try {
    const fmt = new Intl.DateTimeFormat('vi-VN-u-ca-chinese', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    const parts = fmt.formatToParts(new Date());
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'relatedYear')?.value
              || parts.find(p => p.type === 'year')?.value
              || '';

    if (!day || !month) return '';
    return year ? `${day}/${month} (${year})` : `${day}/${month}`;
  } catch (e) {
    return '';
  }
}

function lich_processToday(modalEl) {
  const todayStr = lich_getTodayString();
  const rows = [...modalEl.querySelectorAll('.tm-lich-table tbody tr')];
  if (!rows.length) return;

  let foundRow = null;

  // Tìm dòng hôm nay theo cột ngày (tm-date-main) nếu có
  rows.forEach(row => {
    const dateMain = row.querySelector('.tm-date-main');
    const dateCell = row.querySelector('td');
    const txt = (dateMain?.innerText || dateCell?.innerText || '').trim();

    // chỉ so phần ngày, tránh dính "Thứ ..."
    // ví dụ "25/2" hoặc "25/2\n(Thứ 4)"
    if (txt.startsWith(todayStr)) foundRow = row;
  });

  // Nếu không có hôm nay trong file (vd đang xem lịch tháng sau), dùng dòng đầu tiên
  const targetRow = foundRow || rows[0];

  // Chỉ highlight + scroll khi có đúng ngày hôm nay
  if (foundRow) {
    foundRow.classList.add('tm-lich-today');
    setTimeout(() => {
      foundRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  // Lấy dữ liệu từ targetRow để render banner
  const cells = targetRow.querySelectorAll('td');
  const xuatban = cells[1] ? cells[1].innerText.trim() : '';
  const bientap = cells[2] ? cells[2].innerText.trim() : '';
  const kythuat = cells[3] ? cells[3].innerText.trim() : '';

  const banner = document.createElement('div');
  banner.className = 'tm-lich-banner';

  const dt = lich_getFullDateTime();
  const weekday = lich_getWeekday();
  const status = newsroom_getStatus();
  const countdown = newsroom_countdown();
  const progress = newsroom_progress();
  const lunar = lich_getLunar();

  banner.innerHTML = `
    <div class="tm-news-status ${status.class}">
      <span class="tm-status-dot"></span>
      <span class="tm-status-label">
        ${status.text.replace(/^🟢|^🟡|^⚠️|^🔴/,'').trim()}
      </span>
    </div>

    <div class="tm-role-card">
      <div class="tm-role-icon tm-role-publish">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 6.5h12.5a1.5 1.5 0 0 1 1.5 1.5v8.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/>
          <path d="M7.5 9.5h8"/><path d="M7.5 12.5h8"/><path d="M7.5 15.5h5"/>
        </svg>
      </div>
      <div>
        <div class="tm-role-title">Xuất bản</div>
        <div class="tm-role-name">${xuatban || '-'}</div>
      </div>
    </div>

    <div class="tm-role-card">
      <div class="tm-role-icon tm-role-edit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"/>
          <path d="M13.5 6.5l3 3"/>
        </svg>
      </div>
      <div>
        <div class="tm-role-title">Biên tập</div>
        <div class="tm-role-name">${bientap || '-'}</div>
      </div>
    </div>

    <div class="tm-role-card">
      <div class="tm-role-icon tm-role-tech">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2.8"></circle>
          <path d="M19 12a7 7 0 0 0-.08-1l2.02-1.57-1.9-3.28-2.45.8a7.2 7.2 0 0 0-1.73-1L14.5 3h-5l-.36 2.95c-.62.24-1.2.58-1.73 1l-2.45-.8-1.9 3.28L5.08 11a7 7 0 0 0 0 2l-2.02 1.57 1.9 3.28 2.45-.8c.53.42 1.11.76 1.73 1L9.5 21h5l.36-2.95c.62-.24 1.2-.58 1.73-1l2.45.8 1.9-3.28L18.92 13c.05-.33.08-.66.08-1z"/>
        </svg>
      </div>
      <div>
        <div class="tm-role-title">Kỹ thuật</div>
        <div class="tm-role-name">${kythuat || '-'}</div>
      </div>
    </div>

    <div class="tm-clock-panel">
      <div>${weekday}</div>
      <div>${dt.date}</div>
      <div class="tm-clock-time">${dt.time}</div>
      <div class="tm-clock-lunar">${lunar ? 'Âm lịch: ' + lunar : ''}</div>
      <div class="tm-clock-countdown">${countdown}</div>
      <div class="tm-progress">
        <div class="tm-progress-bar" style="width:${progress}%"></div>
      </div>
    </div>
  `;

  // Chèn banner lên trên
const content = modalEl.querySelector('.tm-lich-content');
const wrap = content.querySelector('.tm-lich-wrap'); // bảng lịch
if (wrap) content.insertBefore(banner, wrap);
else content.appendChild(banner);

  // Nếu muốn báo là file hiện tại không có "hôm nay"
  if (!foundRow) {
    const label = banner.querySelector('.tm-status-label');
    if (label) label.textContent += ' • (Không có ngày hôm nay trong file đang xem)';
  }

  // Đồng hồ chạy
  const timer = setInterval(() => {
    // modal đã đóng thì dừng timer
    if (!document.body || !document.body.contains(modalEl)) {
      clearInterval(timer);
      return;
    }

    const dt = lich_getFullDateTime();
    const status = newsroom_getStatus();
    const countdown = newsroom_countdown();
    const lunar = lich_getLunar();

    const clock = banner.querySelector('.tm-clock-panel');
    const statusBox = banner.querySelector('.tm-news-status');

    if (clock) {
      const timeEl = clock.querySelector('.tm-clock-time');
      const cdEl = clock.querySelector('.tm-clock-countdown');
      const lunarEl = clock.querySelector('.tm-clock-lunar');
      if (timeEl) timeEl.innerText = dt.time;
      if (cdEl) cdEl.innerText = countdown;
      if (lunarEl) lunarEl.innerText = lunar ? ('Âm lịch: ' + lunar) : '';
    }

    const progressBar = banner.querySelector('.tm-progress-bar');
    if (progressBar) progressBar.style.width = newsroom_progress() + '%';

    if (statusBox) {
      statusBox.className = 'tm-news-status ' + status.class;
      const label = statusBox.querySelector('.tm-status-label');
      if (label) {
        const base = status.text.replace(/^🟢|^🟡|^⚠️|^🔴/, '').trim();
        label.textContent = !foundRow ? (base + ' • (Không có ngày hôm nay trong file đang xem)') : base;
      }
    }
  }, 1000);
}
function lich_enableRowMagnify(modalEl) {
  const wrap = modalEl.querySelector('.tm-lich-wrap');
  const rows = [...modalEl.querySelectorAll('.tm-lich-table tbody tr')];
  if (!wrap || !rows.length || wrap._tmMagnifyBound) return;

  wrap._tmMagnifyBound = 1;

  // ===== BEST COMBO =====
  const SCALE_Y = 1.05;   // zoom dọc nhẹ, đủ thấy
  const SCALE_X = 1.004;  // zoom ngang cực nhẹ, tránh tràn/cắt chữ
  const LIFT = 5;         // nổi lên vừa phải

  let activeRow = null;

  function resetRow(row) {
    if (!row) return;
    row.style.setProperty('--mag', '1');
    row.style.setProperty('--magx', '1');
    row.style.setProperty('--lift', '0px');
    row.classList.remove('is-magnify');
  }

  function activateRow(row) {
    if (activeRow === row) return;

    resetRow(activeRow);
    activeRow = row;

    if (!activeRow) return;

    activeRow.style.setProperty('--mag', String(SCALE_Y));
    activeRow.style.setProperty('--magx', String(SCALE_X));
    activeRow.style.setProperty('--lift', LIFT + 'px');
    activeRow.classList.add('is-magnify');
  }

  wrap.addEventListener('mousemove', function (e) {
    const row = e.target.closest('.tm-lich-table tbody tr');
    if (!row || !wrap.contains(row)) {
      activateRow(null);
      return;
    }
    activateRow(row);
  }, { passive: true });

  wrap.addEventListener('mouseleave', function () {
    activateRow(null);
  }, { passive: true });

  wrap.addEventListener('scroll', function () {
    activateRow(null);
  }, { passive: true });
}

    function lich_mountFrozenHeader(modalEl) {
  const wrap = modalEl.querySelector('.tm-lich-wrap');
  const table = wrap && wrap.querySelector('.tm-lich-table');
  const thead = table && table.querySelector('thead');
  if (!wrap || !table || !thead) return;

  // Xóa header clone cũ nếu có
  const old = wrap.querySelector('.tm-lich-freeze-head');
  if (old) old.remove();

  // Đánh dấu bảng chính để CSS chỉ ẩn thead của bảng này
  table.classList.add('tm-lich-table-main');

  // Tạo header clone
  const freeze = document.createElement('div');
  freeze.className = 'tm-lich-freeze-head';

  const cloneTable = document.createElement('table');
  cloneTable.className = 'tm-lich-table';
  cloneTable.innerHTML = '<thead>' + thead.innerHTML + '</thead>';

  freeze.appendChild(cloneTable);

  // Chèn lên trên bảng (trong vùng scroll)
  wrap.insertBefore(freeze, table);

const sync = () => {
  const dstThs = cloneTable.querySelectorAll('th');
  if (!dstThs.length) return;

  // Ưu tiên đo theo hàng dữ liệu đầu tiên (chuẩn hơn đo theo th)
  const firstRowTds = table.querySelectorAll('tbody tr:first-child td');
  const srcCells = (firstRowTds && firstRowTds.length === dstThs.length)
    ? firstRowTds
    : thead.querySelectorAll('th');

  if (!srcCells.length || srcCells.length !== dstThs.length) return;

  // Width cột
  srcCells.forEach((cell, i) => {
    const w = cell.getBoundingClientRect().width;
    dstThs[i].style.width = w + 'px';
    dstThs[i].style.minWidth = w + 'px';
    dstThs[i].style.maxWidth = w + 'px';
  });

  // Bù phần scrollbar dọc để header clone khớp hẳn
  const scrollbarW = wrap.offsetWidth - wrap.clientWidth;
  freeze.style.paddingRight = (scrollbarW > 0 ? scrollbarW : 0) + 'px';

  // Đồng bộ ngang
  cloneTable.style.width = table.getBoundingClientRect().width + 'px';
  cloneTable.style.transform = `translateX(${-wrap.scrollLeft}px)`;
};

// Sync lần đầu
sync();
requestAnimationFrame(sync);
setTimeout(sync, 60);

// Sync khi scroll
const onScroll = () => {
  cloneTable.style.transform = `translateX(${-wrap.scrollLeft}px)`;
};
  wrap.addEventListener('scroll', onScroll, { passive: true });

  // Sync khi resize / font render xong
  const ro = new ResizeObserver(sync);
  ro.observe(wrap);
  ro.observe(table);

  // Lưu cleanup nếu modal đóng
  freeze._tmCleanup = () => {
    try { wrap.removeEventListener('scroll', onScroll); } catch(e){}
    try { ro.disconnect(); } catch(e){}
  };
}

  /***********************
   * 12) Init
   ***********************/
  bindHotkeys(isCRM ? pasteLinkFromClipboard : null);

  if (isToolbarHost) {
    mountCRMToolbar();

    const t = setInterval(function () {
      if (initCKBindings()) clearInterval(t);
    }, 300);

  }

  /***********************
   * F7 - CLEAN BOX
   ***********************/
  var KEY_F7 = 118;
  window.addEventListener('keydown', function (e) {
    if (!isToolbarHost) return;
    if (e.key === 'F7' || e.keyCode === KEY_F7) {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      toggleCleanBox();
    }
  }, true);

})();

// ===============================
// POPUP LỊCH TRỰC - IOS GLASS LIVE
// ===============================
(function () {
  const TM_REMINDER_MINUTES = [
    { hour: 10, minute: 45, key: 'lunch', subtitle: 'Sắp đến giờ nghỉ trưa' },
    { hour: 16, minute: 45, key: 'afternoon', subtitle: 'Sắp đến giờ kết thúc buổi chiều' }
  ];

  function fmtToday() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  function getLunarText() {
    try {
      return typeof lich_getLunar === 'function' ? (lich_getLunar() || '') : '';
    } catch (_) {
      return '';
    }
  }

  function splitDisplayName(name) {
    if (!name) return "<div>-</div>";
    const normalized = String(name).replace(/\s+/g, ' ').trim();
    if (!normalized.includes(' - ') && !normalized.includes('-')) {
      return `<div>${escapeHtml(normalized)}</div>`;
    }

    return normalized
      .split(/\s*-\s*/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `<div>${escapeHtml(s)}</div>`)
      .join("");
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function removeOldPopup() {
    const old = document.getElementById("tm-duty-ios-popup");
    if (old) old.remove();
  }

  function ensureStyle() {
    if (document.getElementById("tm-duty-ios-popup-style")) return;

    const style = document.createElement("style");
    style.id = "tm-duty-ios-popup-style";
    style.textContent = `
      @keyframes tmBellShake {
        0% { transform: rotate(0deg); }
        20% { transform: rotate(16deg); }
        40% { transform: rotate(-12deg); }
        60% { transform: rotate(10deg); }
        80% { transform: rotate(-6deg); }
        100% { transform: rotate(0deg); }
      }

      @keyframes tmPopupIn {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      #tm-duty-ios-popup * {
        box-sizing: border-box;
        font-family: "Segoe UI", Tahoma, Arial, "Noto Sans", sans-serif;
      }

      #tm-duty-ios-popup .tm-overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(15, 23, 42, 0.12);
        backdrop-filter: blur(7px);
        -webkit-backdrop-filter: blur(7px);
      }

      #tm-duty-ios-popup .tm-modal {
        position: relative;
        width: min(1020px, 96vw);
        border-radius: 30px;
        padding: 18px 20px 18px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.80) 0%, rgba(255,247,248,0.72) 100%);
        border: 1px solid rgba(255,255,255,0.65);
        box-shadow:
          0 20px 60px rgba(15, 23, 42, 0.14),
          inset 0 1px 0 rgba(255,255,255,0.8);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        animation: tmPopupIn 0.18s ease-out;
      }

      #tm-duty-ios-popup .tm-bell-wrap {
        position: absolute;
        left: 20px;
        top: 18px;
      }

      #tm-duty-ios-popup .tm-close-wrap {
        position: absolute;
        right: 20px;
        top: 18px;
      }

      #tm-duty-ios-popup .tm-bell,
      #tm-duty-ios-popup .tm-close {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.64) 100%);
        border: 1px solid rgba(255,255,255,0.72);
        box-shadow:
          0 8px 24px rgba(15, 23, 42, 0.10),
          inset 0 1px 0 rgba(255,255,255,0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      #tm-duty-ios-popup .tm-bell {
        color: #f59e0b;
        font-size: 24px;
        animation: tmBellShake 1s ease 2;
      }

      #tm-duty-ios-popup .tm-close {
        color: #ef4444;
        cursor: pointer;
        font-size: 18px;
        font-weight: 900;
      }

      #tm-duty-ios-popup .tm-badge-row {
        display: flex;
        justify-content: center;
        margin-bottom: 8px;
      }

      #tm-duty-ios-popup .tm-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        padding: 8px 16px;
        border-radius: 999px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.62) 100%);
        border: 1px solid rgba(255,255,255,0.72);
        box-shadow:
          0 8px 24px rgba(15, 23, 42, 0.08),
          inset 0 1px 0 rgba(255,255,255,0.92);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #5b6475;
        font-size: 14px;
        font-weight: 800;
        letter-spacing: 0.1px;
        white-space: nowrap;
      }

      #tm-duty-ios-popup .tm-sub {
        text-align: center;
        color: #758195;
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 12px;
      }

      #tm-duty-ios-popup .tm-cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }

      #tm-duty-ios-popup .tm-card {
        min-width: 0;
        height: 98px;
        border-radius: 24px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        background:
          linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(255,255,255,0.56) 100%);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        box-shadow:
          0 10px 26px rgba(15, 23, 42, 0.06),
          inset 0 1px 0 rgba(255,255,255,0.72);
      }

      #tm-duty-ios-popup .tm-card.red {
        border: 1px solid rgba(239, 68, 68, 0.24);
        background:
          linear-gradient(180deg, rgba(255,246,246,0.92) 0%, rgba(255,240,240,0.74) 100%);
      }

      #tm-duty-ios-popup .tm-card.pink {
        border: 1px solid rgba(236, 72, 153, 0.24);
        background:
          linear-gradient(180deg, rgba(253,244,248,0.92) 0%, rgba(252,231,243,0.74) 100%);
      }

      #tm-duty-ios-popup .tm-card.blue {
        border: 1px solid rgba(59, 130, 246, 0.24);
        background:
          linear-gradient(180deg, rgba(243,248,255,0.92) 0%, rgba(219,234,254,0.74) 100%);
      }

      #tm-duty-ios-popup .tm-icon {
        width: 46px;
        height: 46px;
        min-width: 46px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        box-shadow: 0 8px 18px rgba(15, 23, 42, 0.14);
      }

      #tm-duty-ios-popup .tm-icon.red { background: linear-gradient(180deg, #fb7185 0%, #ef4444 100%); }
      #tm-duty-ios-popup .tm-icon.pink { background: linear-gradient(180deg, #f472b6 0%, #ec4899 100%); }
      #tm-duty-ios-popup .tm-icon.blue { background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%); }

      #tm-duty-ios-popup .tm-text {
        min-width: 0;
        flex: 1;
      }

      #tm-duty-ios-popup .tm-role {
        color: #667085;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 0.7px;
        line-height: 1.15;
        text-transform: uppercase;
        margin-bottom: 7px;
      }

      #tm-duty-ios-popup .tm-name {
        font-size: 15px;
        font-weight: 900;
        line-height: 1.35;
      }

      #tm-duty-ios-popup .tm-name.red { color: #ef4444; }
      #tm-duty-ios-popup .tm-name.pink { color: #ec4899; }
      #tm-duty-ios-popup .tm-name.blue { color: #3b82f6; }

      #tm-duty-ios-popup .tm-name > div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      @media (max-width: 900px) {
        #tm-duty-ios-popup .tm-modal {
          width: min(560px, 96vw);
        }

        #tm-duty-ios-popup .tm-cards {
          grid-template-columns: 1fr;
        }

        #tm-duty-ios-popup .tm-card {
          height: auto;
          min-height: 94px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function makeCard({ role, name, tone, iconSvg }) {
    const card = document.createElement("div");
    card.className = `tm-card ${tone}`;

    const icon = document.createElement("div");
    icon.className = `tm-icon ${tone}`;
    icon.innerHTML = iconSvg;

    const text = document.createElement("div");
    text.className = "tm-text";

    const roleEl = document.createElement("div");
    roleEl.className = "tm-role";
    roleEl.textContent = role;

    const nameEl = document.createElement("div");
    nameEl.className = `tm-name ${tone}`;
    nameEl.innerHTML = splitDisplayName(name);

    text.appendChild(roleEl);
    text.appendChild(nameEl);

    card.appendChild(icon);
    card.appendChild(text);

    return card;
  }

  function getTodayDutyData() {
    const todayStr = typeof lich_getTodayString === 'function'
      ? lich_getTodayString()
      : `${new Date().getDate()}/${new Date().getMonth() + 1}`;

    function findInRoot(root) {
      if (!root) return null;
      const rows = root.querySelectorAll('.tm-lich-table tbody tr');
      for (const row of rows) {
        const firstCell = row.querySelector('td');
        const dateMain = row.querySelector('.tm-date-main');
        const txt = (dateMain?.innerText || firstCell?.innerText || '').trim();
        if (!txt) continue;
        const dateOnly = txt.split('\n')[0].trim();
        if (dateOnly !== todayStr) continue;

        const cells = row.querySelectorAll('td');
        return {
          xuatBan: cells[1] ? cells[1].innerText.trim() : '',
          bienTap: cells[2] ? cells[2].innerText.trim() : '',
          kyThuat: cells[3] ? cells[3].innerText.trim() : ''
        };
      }
      return null;
    }

    const live = findInRoot(document);
    if (live) return live;

    try {
      const html = localStorage.getItem(LS_LICH_KEY);
      if (!html) return null;
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return findInRoot(doc);
    } catch (e) {
      console.error('Không đọc được dữ liệu lịch trực:', e);
      return null;
    }
  }

  function showPopup(data, subtitleText) {
    removeOldPopup();
    ensureStyle();

    const publishIcon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="2" stroke="white" stroke-width="2"/>
        <path d="M8 9H16" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 12H16" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 15H13" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const editIcon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 20L8.5 19L18 9.5L14.5 6L5 15.5L4 20Z" stroke="white" stroke-width="2" stroke-linejoin="round"/>
        <path d="M13.5 7L17 10.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const techIcon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8.2A3.8 3.8 0 1 0 12 15.8A3.8 3.8 0 1 0 12 8.2Z" stroke="white" stroke-width="2"/>
        <path d="M19.4 15A1.7 1.7 0 0 0 19.74 16.87L19.8 16.94A2 2 0 1 1 16.97 19.77L16.9 19.71A1.7 1.7 0 0 0 15.03 19.37A1.7 1.7 0 0 0 14 20.93V21A2 2 0 1 1 10 21V20.89A1.7 1.7 0 0 0 8.89 19.33A1.7 1.7 0 0 0 7.03 19.67L6.94 19.74A2 2 0 1 1 4.11 16.91L4.18 16.84A1.7 1.7 0 0 0 4.52 14.97A1.7 1.7 0 0 0 3 14H2.89A2 2 0 1 1 2.89 10H3A1.7 1.7 0 0 0 4.52 9.03A1.7 1.7 0 0 0 4.18 7.16L4.11 7.09A2 2 0 1 1 6.94 4.26L7.01 4.33A1.7 1.7 0 0 0 8.88 4.67H8.97A1.7 1.7 0 0 0 10 3.11V3A2 2 0 1 1 14 3V3.11A1.7 1.7 0 0 0 15.11 4.67A1.7 1.7 0 0 0 16.97 4.33L17.06 4.26A2 2 0 1 1 19.89 7.09L19.82 7.16A1.7 1.7 0 0 0 19.48 9.03V9.12A1.7 1.7 0 0 0 21 10H21.11A2 2 0 1 1 21.11 14H21A1.7 1.7 0 0 0 19.4 15Z" stroke="white" stroke-width="1.6" stroke-linejoin="round"/>
      </svg>
    `;

    const lunarText = getLunarText();

    const root = document.createElement("div");
    root.id = "tm-duty-ios-popup";
    root.innerHTML = `
      <div class="tm-overlay">
        <div class="tm-modal">
          <div class="tm-bell-wrap">
            <div class="tm-bell">🔔</div>
          </div>

          <div class="tm-close-wrap">
            <div class="tm-close">✕</div>
          </div>

          <div class="tm-badge-row">
            <div class="tm-badge">🗓️ LỊCH TRỰC HÔM NAY • ${fmtToday()}${lunarText ? ` • 🌙 ${escapeHtml(lunarText)}` : ''}</div>
          </div>

          <div class="tm-sub">${escapeHtml(subtitleText || 'Sắp đến giờ nghỉ trưa')}</div>

          <div class="tm-cards"></div>
        </div>
      </div>
    `;

    const cards = root.querySelector(".tm-cards");
    cards.appendChild(
      makeCard({
        role: "XUẤT BẢN",
        name: data.xuatBan,
        tone: "red",
        iconSvg: publishIcon
      })
    );
    cards.appendChild(
      makeCard({
        role: "BIÊN TẬP",
        name: data.bienTap,
        tone: "pink",
        iconSvg: editIcon
      })
    );
    cards.appendChild(
      makeCard({
        role: "KỸ THUẬT",
        name: data.kyThuat,
        tone: "blue",
        iconSvg: techIcon
      })
    );

    const overlay = root.querySelector(".tm-overlay");
    const close = root.querySelector(".tm-close");

    close.addEventListener("click", () => root.remove());
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) root.remove();
    });

    __tmAppendWhenReady(root);

    setTimeout(() => {
      if (root.parentNode) root.remove();
    }, 10000);
  }

  function getReminderSlot(now = new Date()) {
    return TM_REMINDER_MINUTES.find(
      slot => slot.hour === now.getHours() && slot.minute === now.getMinutes()
    ) || null;
  }

  function getReminderSeenKey(slot, now = new Date()) {
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `tm_duty_popup_seen_${yyyy}-${mm}-${dd}_${slot.key}`;
  }

  function shouldShowReminder(slot, now = new Date()) {
    const key = getReminderSeenKey(slot, now);
    try {
      return sessionStorage.getItem(key) !== '1';
    } catch (_) {
      return true;
    }
  }

  function markReminderShown(slot, now = new Date()) {
    const key = getReminderSeenKey(slot, now);
    try {
      sessionStorage.setItem(key, '1');
    } catch (_) {}
  }

  function runDutyReminderCheck() {
    const now = new Date();
    const slot = getReminderSlot(now);
    if (!slot) return;
    if (!shouldShowReminder(slot, now)) return;

    const dutyData = getTodayDutyData();
    if (!dutyData) {
      console.warn('Không tìm thấy dữ liệu lịch trực hôm nay để hiển thị popup.');
      return;
    }

    showPopup(dutyData, slot.subtitle);
    markReminderShown(slot, now);
  }

  setTimeout(runDutyReminderCheck, 1200);
  setInterval(runDutyReminderCheck, 15000);

  window.tmTestDutyPopup = function (subtitleText) {
    const dutyData = getTodayDutyData();
    if (!dutyData) {
      alert('Không tìm thấy dữ liệu lịch trực. Hãy upload file lịch trực trước.');
      return;
    }
    showPopup(dutyData, subtitleText || 'Test popup lịch trực');
  };
})();

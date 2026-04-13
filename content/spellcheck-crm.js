(function () {
  'use strict';

  const TOAST_ID = 'ago-spellcheck-toast';
  const STYLE_ID = 'ago-spellcheck-style';
  let isEnabled = false;
  let hideTimer = null;

  function ensureStyle(doc) {
    const root = doc || document;
    if (root.getElementById(STYLE_ID)) return;
    const s = root.createElement('style');
    s.id = STYLE_ID;
    s.textContent = [
      '.ago-spell-toast{position:fixed;left:50%;bottom:86px;z-index:2147483647;max-width:min(520px,calc(100vw - 48px));padding:14px 20px;border-radius:22px;background:rgba(0,0,0,.92);color:#fff;box-shadow:0 16px 36px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.08);font:800 14px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;letter-spacing:.45px;text-transform:uppercase;text-align:center;pointer-events:none;opacity:0;transform:translate(-50%,10px) scale(.98);transition:opacity .2s ease,transform .2s ease;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);white-space:nowrap;}',
      '.ago-spell-toast.show{opacity:1;transform:translate(-50%,0) scale(1);}',
      '@media (max-width: 900px){.ago-spell-toast{bottom:96px;max-width:calc(100vw - 32px);padding:13px 18px;font-size:13px;white-space:normal;}}',
      '.ago-spell-native-marker{outline:0;}'
    ].join('');
    (root.head || root.documentElement).appendChild(s);
  }

  function getCKEditor() {
    try {
      return window.CKEDITOR || (window.unsafeWindow && window.unsafeWindow.CKEDITOR) || null;
    } catch (e) {
      return null;
    }
  }

  function getInstances() {
    const CK = getCKEditor();
    if (!CK || !CK.instances) return [];
    return Object.keys(CK.instances).map(function (k) { return CK.instances[k]; }).filter(Boolean);
  }

  function setSpellAttrs(doc, enabled) {
    try {
      if (!doc || !doc.body) return false;
      const html = doc.documentElement;
      const body = doc.body;
      if (html) html.setAttribute('lang', 'vi');
      body.setAttribute('spellcheck', enabled ? 'true' : 'false');
      body.spellcheck = !!enabled;
      body.setAttribute('lang', 'vi');
      body.classList.add('ago-spell-native-marker');
      body.querySelectorAll('[contenteditable], textarea, input[type="text"], input:not([type])').forEach(function (el) {
        el.setAttribute('spellcheck', enabled ? 'true' : 'false');
        el.spellcheck = !!enabled;
        el.setAttribute('lang', 'vi');
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  function applyToInstance(ed, enabled) {
    if (!ed) return false;
    let ok = false;
    try {
      if (ed.config) ed.config.disableNativeSpellChecker = !enabled;
    } catch (e) {}
    try {
      if (typeof ed.on === 'function' && !ed.__agoSpellHooked) {
        ed.__agoSpellHooked = true;
        ['contentDom', 'mode', 'instanceReady'].forEach(function (evt) {
          ed.on(evt, function () {
            if (!isEnabled) return;
            try {
              if (ed.document && ed.document.$) setSpellAttrs(ed.document.$, true);
            } catch (e) {}
          });
        });
      }
    } catch (e) {}
    try {
      if (ed.document && ed.document.$) ok = setSpellAttrs(ed.document.$, enabled) || ok;
    } catch (e) {}
    try {
      if (typeof ed.editable === 'function') {
        const editable = ed.editable();
        const node = editable && editable.$;
        if (node) {
          node.setAttribute('spellcheck', enabled ? 'true' : 'false');
          node.spellcheck = !!enabled;
          node.setAttribute('lang', 'vi');
          ok = true;
        }
      }
    } catch (e) {}
    return ok;
  }

  function setNativeSpellcheck(enabled) {
    let count = 0;

    getInstances().forEach(function (ed) {
      if (applyToInstance(ed, enabled)) count += 1;
    });

    Array.from(document.querySelectorAll('iframe')).forEach(function (iframe) {
      try {
        if (setSpellAttrs(iframe.contentDocument, enabled)) count += 1;
      } catch (e) {}
    });

    Array.from(document.querySelectorAll('[contenteditable="true"], textarea, input[type="text"], input:not([type])')).forEach(function (el) {
      try {
        el.setAttribute('spellcheck', enabled ? 'true' : 'false');
        el.spellcheck = !!enabled;
        el.setAttribute('lang', 'vi');
        count += 1;
      } catch (e) {}
    });

    return count;
  }

  function getOrCreateToast() {
    ensureStyle(document);
    let toast = document.getElementById(TOAST_ID);
    if (!toast) {
      toast = document.createElement('div');
      toast.id = TOAST_ID;
      toast.className = 'ago-spell-toast';
      document.body.appendChild(toast);
    }
    return toast;
  }

  function showToast(message) {
    const toast = getOrCreateToast();
    toast.textContent = message;
    toast.classList.add('show');
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 5000);
  }

  function focusEditor() {
    let done = false;
    getInstances().some(function (ed) {
      try {
        if (typeof ed.focus === 'function') {
          ed.focus();
          done = true;
          return true;
        }
      } catch (e) {}
      return false;
    });
    if (done) return;
    const iframe = document.querySelector('iframe');
    if (!iframe) return;
    try {
      iframe.focus();
      if (iframe.contentWindow) iframe.contentWindow.focus();
      if (iframe.contentDocument && iframe.contentDocument.body) iframe.contentDocument.body.focus();
    } catch (e) {}
  }

  function installObservers() {
    const CK = getCKEditor();
    if (CK && typeof CK.on === 'function' && !CK.__agoSpellGlobalHooked) {
      CK.__agoSpellGlobalHooked = true;
      try {
        CK.on('instanceReady', function (evt) {
          if (!isEnabled) return;
          try { applyToInstance(evt.editor, true); } catch (e) {}
        });
      } catch (e) {}
    }

    if (!window.__AGO_SPELL_OBSERVER__) {
      const mo = new MutationObserver(function () {
        if (!isEnabled) return;
        setNativeSpellcheck(true);
      });
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
      window.__AGO_SPELL_OBSERVER__ = mo;
    }
  }

  function run() {
    isEnabled = !isEnabled;
    setNativeSpellcheck(isEnabled);
    if (isEnabled) focusEditor();
    showToast(isEnabled ? 'ĐÃ BẬT KIỂM TRA CHÍNH TẢ' : 'ĐÃ TẮT KIỂM TRA CHÍNH TẢ');
  }

  function bindEvents() {
    ensureStyle(document);
    installObservers();
    window.addEventListener('ago-spellcheck-run', run);
    window.__AGO_SPELLCHECK__ = {
      run: run,
      setNativeSpellcheck: setNativeSpellcheck,
      focusEditor: focusEditor,
      get enabled() { return isEnabled; }
    };
  }

  bindEvents();
})();

(function () {
  'use strict';

  const DEFAULT_SETTINGS = {
    featureToolbar: true,
    featureAutoFill: true,
    featureAutoProvince: true,
    featureImportLinks: true,
    getlink: true,
    pastelink: true,
    autoFillKeyword: true,
    autoProvince: true,
    toolbarCRM: true,
    toolbarBaoAnGiang: true,
    mammothLoader: true,
    featureSpellcheck: true,
    spellcheckCRM: true,
    featureAuthorQuick: true,
    authorQuick: true
  };

  function normalizeSettings(raw) {
    const data = { ...DEFAULT_SETTINGS, ...(raw || {}) };
    return {
      ...data,
      featureToolbar: data.featureToolbar ?? (data.toolbarCRM || data.toolbarBaoAnGiang || data.mammothLoader),
      featureAutoFill: data.featureAutoFill ?? data.autoFillKeyword,
      featureAutoProvince: data.featureAutoProvince ?? data.autoProvince,
      featureImportLinks: data.featureImportLinks ?? (data.getlink || data.pastelink),
      featureSpellcheck: data.featureSpellcheck ?? data.spellcheckCRM ?? true,
      spellcheckCRM: data.spellcheckCRM ?? data.featureSpellcheck ?? true,
      featureAuthorQuick: data.featureAuthorQuick ?? data.authorQuick ?? true,
      authorQuick: data.authorQuick ?? data.featureAuthorQuick ?? true
    };
  }

  function getSettings(callback) {
    try {
      if (!chrome?.storage?.local) {
        callback(normalizeSettings(DEFAULT_SETTINGS));
        return;
      }
      chrome.storage.local.get(null, (settings) => {
        callback(normalizeSettings(settings));
      });
    } catch (err) {
      console.warn('[AGO Support] Cannot read settings, using defaults.', err);
      callback(normalizeSettings(DEFAULT_SETTINGS));
    }
  }

  function injectScript(path) {
    const id = 'crmag-injected-' + path.replace(/[^a-z0-9_-]+/gi, '-');
    if (document.getElementById(id)) return;
    const s = document.createElement('script');
    s.id = id;
    s.src = chrome.runtime.getURL(path);
    s.async = false;
    s.dataset.crmagInjected = '1';
    (document.head || document.documentElement).appendChild(s);
  }

  window.__CRMAG_BOOT__ = { getSettings, injectScript };
})();

(function () {
  'use strict';

  const boot = window.__CRMAG_BOOT__;
  if (!boot) return;

  boot.getSettings((settings) => {
    if (settings.featureToolbar) {
      if (settings.mammothLoader) {
        boot.injectScript('vendor/mammoth.browser.min.js');
      }
      boot.injectScript('content/toolbar.js');
    }

    if (settings.featureImportLinks && settings.pastelink) {
      boot.injectScript('content/pastelink.js');
    }

    if (settings.featureAutoFill && settings.autoFillKeyword) {
      boot.injectScript('content/auto-fill-keyword.js');
    }

    if (settings.featureAutoProvince && settings.autoProvince) {
      boot.injectScript('content/auto-province.js');
    }

    if (settings.featureSpellcheck && settings.spellcheckCRM) {
      // Only inject the runtime. Heavy data is loaded lazily on first click.
      boot.injectScript('content/spellcheck-crm.js');
    }

    if (settings.featureAuthorQuick && settings.authorQuick) {
      boot.injectScript('content/author-quick.js');
    }

    window.dispatchEvent(new CustomEvent('ago-crm-boot-ready'));
  });
})();

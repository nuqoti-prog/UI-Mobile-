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
    mammothLoader: true
  };

  function normalizeSettings(raw) {
    const data = { ...DEFAULT_SETTINGS, ...(raw || {}) };
    return {
      ...data,
      featureImportLinks: data.featureImportLinks ?? (data.getlink || data.pastelink)
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
    if (settings.featureImportLinks) {
      boot.injectScript('content/getlink.js');
    }
  });
})();

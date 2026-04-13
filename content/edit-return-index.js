(function () {
  'use strict';

  const LIST_URL = 'https://crmag.baoangiang.com.vn/news/index?lang=vi';
  const BUTTON_LABELS = new Set(['Lưu', 'Chờ biên tập', 'Kỹ thuật', 'Đã BT B1', 'Đã BT B2']);
  const RETURN_FLAG_KEY = 'agoReturnToIndexPending';

  function safeUrl(urlLike) {
    try {
      return new URL(urlLike || window.location.href, window.location.origin);
    } catch (e) {
      return null;
    }
  }

  function isCrmagPage(urlLike) {
    const url = safeUrl(urlLike);
    return !!url && /(^|\.)crmag\.baoangiang\.com\.vn$/i.test(url.hostname);
  }

  function isEditPage(urlLike) {
    const url = safeUrl(urlLike);
    return !!url && isCrmagPage(url.href) && String(url.pathname || '').toLowerCase().includes('/news/edit');
  }

  function isListPage(urlLike) {
    const url = safeUrl(urlLike);
    return !!url && isCrmagPage(url.href) && String(url.pathname || '').toLowerCase().includes('/news/index');
  }

  function safeSessionGet(key) {
    try { return sessionStorage.getItem(key) || ''; } catch (e) { return ''; }
  }

  function safeSessionSet(key, value) {
    try { sessionStorage.setItem(key, String(value || '1')); } catch (e) {}
  }

  function safeSessionRemove(key) {
    try { sessionStorage.removeItem(key); } catch (e) {}
  }

  function notifyBackground(type, reason) {
    try {
      chrome.runtime.sendMessage({ type, reason: String(reason || '') }, () => {
        void chrome.runtime?.lastError;
      });
    } catch (e) {}
  }

  function redirectToList(reason) {
    safeSessionRemove(RETURN_FLAG_KEY);
    notifyBackground('AGO_CLEAR_RETURN_TO_INDEX', reason || 'redirect');
    try {
      window.location.replace(LIST_URL);
    } catch (e) {
      window.location.assign(LIST_URL);
    }
  }

  function markPendingReturn(reason) {
    safeSessionSet(RETURN_FLAG_KEY, reason || '1');
    notifyBackground('AGO_MARK_RETURN_TO_INDEX', reason || 'content');
  }

  function getButtonLabel(el) {
    if (!el) return '';
    if (el instanceof HTMLInputElement) return String(el.value || '').trim();
    return String(el.textContent || '').trim();
  }

  function isTrackedActionButton(el) {
    if (!el) return false;
    const label = getButtonLabel(el);
    if (BUTTON_LABELS.has(label)) return true;
    const onclickText = String(el.getAttribute?.('onclick') || '');
    return /checkAdd\(\s*['"]edit['"]\s*,/i.test(onclickText);
  }

  function installActionButtonWatcher() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('input[type="button"], button');
      if (!button || !isTrackedActionButton(button)) return;
      markPendingReturn(getButtonLabel(button) || 'action-button');
    }, true);
  }

  if (!isCrmagPage(window.location.href)) return;

  if (safeSessionGet(RETURN_FLAG_KEY)) {
    if (isListPage(window.location.href)) {
      safeSessionRemove(RETURN_FLAG_KEY);
      notifyBackground('AGO_CLEAR_RETURN_TO_INDEX', 'list-page');
    } else if (!isEditPage(window.location.href)) {
      redirectToList('pending-return-document-start');
      return;
    }
  }

  if (isListPage(window.location.href)) {
    safeSessionRemove(RETURN_FLAG_KEY);
    notifyBackground('AGO_CLEAR_RETURN_TO_INDEX', 'list-page');
    return;
  }

  if (!isEditPage(window.location.href)) return;

  installActionButtonWatcher();
})();

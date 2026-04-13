(function () {
  if (window.__AGO_GLOBAL_STATUS_TOAST_V1__) return;
  window.__AGO_GLOBAL_STATUS_TOAST_V1__ = true;

  const ITEMS_KEY = 'ago_crm_status_items_v10';
  const NOTIFY_KEY = 'ago_widget_notify_enabled_v1';
  const TOAST_ROOT_ID = 'ago-crm-toast-root-v15';
  const TOAST_STYLE_ID = 'ago-crm-toast-style-v15';
  const TOAST_LIFETIME_MS = 5000;
  const MAX_EVENT_TOASTS = 8;
  const TOAST_EVENT_DEDUP_MS = 0;
  const TOAST_REGISTRY_TTL_MS = 0;

  const STATUS_LABELS = {
    choBienTap: 'CHỜ BIÊN TẬP',
    kyThuat: 'KỸ THUẬT',
    daBienTapB1: 'BƯỚC 1',
    daBienTapB2: 'BƯỚC 2',
    daDuyet: 'ĐÃ DUYỆT',
    xuatBan: 'XUẤT BẢN',
    haTin: 'HẠ TIN',
    xoaTam: 'XOÁ TẠM',
    nhap: 'NHÁP',
    khongDuyet: 'KHÔNG DUYỆT'
  };

  const STATUS_THEME = {
    choBienTap: {
      accent: '#f44336',
      bg: 'linear-gradient(180deg, rgba(244,67,54,.26), rgba(244,67,54,.12))',
      border: 'rgba(244,67,54,.40)',
      shadow: 'rgba(244,67,54,.18)',
      text: '#7c1313'
    },
    kyThuat: {
      accent: '#2196f3',
      bg: 'linear-gradient(180deg, rgba(33,150,243,.24), rgba(33,150,243,.11))',
      border: 'rgba(33,150,243,.40)',
      shadow: 'rgba(33,150,243,.18)',
      text: '#0b4678'
    },
    daBienTapB1: {
      accent: '#4caf50',
      bg: 'linear-gradient(180deg, rgba(76,175,80,.26), rgba(76,175,80,.12))',
      border: 'rgba(76,175,80,.42)',
      shadow: 'rgba(76,175,80,.18)',
      text: '#14511f'
    },
    daBienTapB2: {
      accent: '#ec4899',
      bg: 'linear-gradient(180deg, rgba(236,72,153,.24), rgba(236,72,153,.11))',
      border: 'rgba(236,72,153,.38)',
      shadow: 'rgba(236,72,153,.18)',
      text: '#841b58'
    },
    xuatBan: {
      accent: '#4b5563',
      bg: 'linear-gradient(180deg, rgba(75,85,99,.26), rgba(75,85,99,.12))',
      border: 'rgba(75,85,99,.40)',
      shadow: 'rgba(75,85,99,.18)',
      text: '#f9fafb'
    },
    haTin: {
      accent: '#ef4444',
      bg: 'linear-gradient(180deg, rgba(239,68,68,.22), rgba(239,68,68,.10))',
      border: 'rgba(239,68,68,.38)',
      shadow: 'rgba(239,68,68,.16)',
      text: '#7f1d1d'
    },
    xoaTam: {
      accent: '#f97316',
      bg: 'linear-gradient(180deg, rgba(249,115,22,.22), rgba(249,115,22,.10))',
      border: 'rgba(249,115,22,.38)',
      shadow: 'rgba(249,115,22,.16)',
      text: '#7c2d12'
    },
    nhap: {
      accent: '#6b7280',
      bg: 'linear-gradient(180deg, rgba(107,114,128,.22), rgba(107,114,128,.10))',
      border: 'rgba(107,114,128,.36)',
      shadow: 'rgba(107,114,128,.16)',
      text: '#374151'
    }
  };

  function formatToastUsername(raw) {
    let value = String(raw || '').trim();
    if (!value) return '';
    value = value.replace(/^@+/, '').replace(/[|•·]+$/g, '').trim();
    if (/^[^\s@]+@[^\s@]+$/.test(value)) value = value.split('@')[0];
    value = value
      .replace(/(?:[_\-.]?(?:baoag|baoangiang|cms|admin))+$/i, '')
      .replace(/[_\-.]+$/g, '')
      .trim();
    return value;
  }

  let notifyEnabled = true;
  let toastSeq = 0;
  const recentToastEvents = new Map();
  const latestScheduledToastTokenByNewsId = new Map();
  const SHOWN_TOAST_STORAGE_KEY = 'ago_shown_toast_events_v1';
  const SHOWN_TOAST_MAX_ENTRIES = 400;
  const shownToastEvents = new Set();

  function normalizeText(text) {
    return String(text || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function loadShownToastEvents() {
    try {
      const raw = sessionStorage.getItem(SHOWN_TOAST_STORAGE_KEY);
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!Array.isArray(list)) return;
      list.filter(Boolean).slice(-SHOWN_TOAST_MAX_ENTRIES).forEach((key) => shownToastEvents.add(String(key)));
    } catch (e) {}
  }

  function persistShownToastEvents() {
    try {
      const list = Array.from(shownToastEvents).slice(-SHOWN_TOAST_MAX_ENTRIES);
      sessionStorage.setItem(SHOWN_TOAST_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function storageGet(keys) {
    return new Promise((resolve) => {
      try { chrome.storage.local.get(keys, resolve); }
      catch (e) { resolve({}); }
    });
  }

  async function refreshNotifyState() {
    try {
      const state = await storageGet([NOTIFY_KEY]);
      notifyEnabled = state[NOTIFY_KEY] !== false;
    } catch (e) {
      notifyEnabled = true;
    }
    return notifyEnabled;
  }

  function buildChangeEvents(prevItems, nextItems) {
    const prev = prevItems || {};
    const next = nextItems || {};
    const events = [];

    Object.keys(next).forEach((id) => {
      const current = next[id];
      const previous = prev[id];
      if (!current) return;

      if (!previous) {
        events.push({
          type: 'new',
          id,
          statusKey: current.statusKey,
          fromStatusKey: '',
          toStatusKey: current.statusKey,
          title: current.title,
          author: current.author,
          changerUsername: current.changerUsername || '',
          editUrl: current.editUrl,
          reviewUrl: current.reviewUrl,
          sortTime: current.sortTime || 0
        });
        return;
      }

      if (previous.statusKey !== current.statusKey) {
        events.push({
          type: 'status-change',
          id,
          statusKey: current.statusKey,
          fromStatusKey: previous.statusKey,
          toStatusKey: current.statusKey,
          title: current.title || previous.title,
          author: current.author || previous.author,
          changerUsername: current.changerUsername || '',
          editUrl: current.editUrl || previous.editUrl,
          reviewUrl: current.reviewUrl || previous.reviewUrl,
          sortTime: Math.max(current.sortTime || 0, previous.sortTime || 0)
        });
      }
    });

    return events.sort((a, b) => {
      if ((b.sortTime || 0) !== (a.sortTime || 0)) return (b.sortTime || 0) - (a.sortTime || 0);
      return Number(b.id || 0) - Number(a.id || 0);
    });
  }

  function eventFingerprint(event) {
    const id = normalizeText(event?.id || '');
    const fromStatus = normalizeText(event?.fromStatusKey || '') || 'none';
    const toStatus = normalizeText(event?.toStatusKey || event?.statusKey || '');
    const type = normalizeText(event?.type || '');
    return `${id}|${fromStatus}->${toStatus}|${type}`;
  }

  
  function eventNewsId(event) {
    return normalizeText(event?.id || event?.newsId || '');
  }

  function eventStatusKey(event) {
    return normalizeText(event?.toStatusKey || event?.statusKey || '');
  }

  function markLatestScheduledToastEvent(event) {
    const newsId = eventNewsId(event);
    if (!newsId) return '';
    const token = `${eventStatusKey(event)}|${Date.now()}|${Math.random().toString(36).slice(2, 8)}`;
    latestScheduledToastTokenByNewsId.set(newsId, token);
    return token;
  }

  function isStaleScheduledToastEvent(event, token) {
    const newsId = eventNewsId(event);
    if (!newsId || !token) return false;
    return latestScheduledToastTokenByNewsId.get(newsId) !== token;
  }

  function removeSupersededToasts(root, event) {
    try {
      const newsId = eventNewsId(event);
      if (!root || !newsId) return;
      const targetStatus = eventStatusKey(event);
      const cards = Array.from(root.querySelectorAll('.ago-mini-toast'));
      for (const card of cards) {
        const cardNewsId = normalizeText(card.getAttribute('data-event-id') || '');
        const cardStatus = normalizeText(card.getAttribute('data-status-key') || '');
        if (!cardNewsId || cardNewsId !== newsId) continue;
        if (targetStatus && cardStatus === targetStatus) continue;
        if (card.parentNode) card.parentNode.removeChild(card);
      }
    } catch (e) {}
  }

function pruneRecentToastEvents(now = Date.now()) {
    return;
  }

  function wasToastShownRecently(event) {
    return false;
  }

  function rememberToastEvent(event) {
    return;
  }

  function applyChangerUsernameToToast(toast, username) {
    try {
      if (!toast || !username) return;
      const tag = toast.querySelector('.ago-mini-toast__changerTag');
      if (!tag) return;
      tag.textContent = formatToastUsername(username);
      tag.hidden = false;
      tag.style.display = 'inline-flex';
    } catch (e) {}
  }

  function hydrateExistingToastFromEvent(event) {
    try {
      if (!event || !formatToastUsername(event.changerUsername)) return false;
      const root = document.getElementById(TOAST_ROOT_ID);
      if (!root) return false;
      const targetId = normalizeText(event?.id || '');
      const targetStatus = normalizeText(event?.toStatusKey || event?.statusKey || '');
      const targetTitle = foldText(event?.title || '');
      const cards = Array.from(root.querySelectorAll('.ago-mini-toast'));
      for (const card of cards) {
        const cardId = normalizeText(card.getAttribute('data-event-id') || '');
        const cardStatus = normalizeText(card.getAttribute('data-status-key') || '');
        if (targetId && cardId && cardId === targetId && (!targetStatus || !cardStatus || cardStatus === targetStatus)) {
          applyChangerUsernameToToast(card, formatToastUsername(event.changerUsername));
          return true;
        }
      }
      for (const card of cards) {
        const cardStatus = normalizeText(card.getAttribute('data-status-key') || '');
        const cardTitle = normalizeText(card.getAttribute('data-title-key') || '');
        if (targetStatus && cardStatus === targetStatus && targetTitle && cardTitle === normalizeText(targetTitle)) {
          applyChangerUsernameToToast(card, formatToastUsername(event.changerUsername));
          return true;
        }
      }
    } catch (e) {}
    return false;
  }


  function isPageVisibleForToast() {
    try {
      if (document.visibilityState && document.visibilityState !== 'visible') return false;
      // Avoid strict hasFocus gating. Some real status transitions momentarily lose focus
      // and the toast would be skipped even though the tab is still visible to the user.
    } catch (e) {}
    return true;
  }

  function claimToastDisplay(event) {
    return new Promise((resolve) => {
      const dedupeKey = eventFingerprint(event);
      if (!dedupeKey) return resolve(false);
      try {
        chrome.runtime.sendMessage({
          type: 'AGO_CLAIM_NOTIFICATION_DISPLAY',
          channel: 'toast',
          dedupeKey,
          ttlMs: TOAST_REGISTRY_TTL_MS
        }, (response) => {
          try { void chrome.runtime.lastError; } catch (e) {}
          resolve(!!response?.claimed);
        });
      } catch (e) {
        resolve(false);
      }
    });
  }


  async function prepareToastEventForDisplay(event) {
    const baseEvent = event && typeof event === 'object' ? { ...event } : null;
    if (!baseEvent) return null;
    const existing = formatToastUsername(baseEvent?.changerUsername || '');
    if (existing) {
      baseEvent.changerUsername = existing;
      return baseEvent;
    }
    if (String(baseEvent?.type || '').trim() !== 'status-change') return baseEvent;
    try {
      const response = await new Promise((resolve) => {
        try {
          chrome.runtime.sendMessage({ type: 'AGO_ENRICH_TOAST_EVENT', event: baseEvent }, (payload) => {
            try { void chrome.runtime.lastError; } catch (e) {}
            resolve(payload || null);
          });
        } catch (e) {
          resolve(null);
        }
      });
      const username = formatToastUsername(response?.changerUsername || response?.event?.changerUsername || '');
      if (!username) return null;
      return { ...baseEvent, ...(response?.event || {}), changerUsername: username };
    } catch (e) {
      return null;
    }
  }

  async function scheduleEventToast(event) {
    if (!notifyEnabled || !event) return false;
    if (wasToastShownRecently(event)) {
      hydrateExistingToastFromEvent(event);
      return false;
    }
    const displayEvent = await prepareToastEventForDisplay(event);
    if (!displayEvent) return false;
    showEventToast(displayEvent);
    return true;
  }

  function ensureToastStyle() {
    if (document.getElementById(TOAST_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = TOAST_STYLE_ID;
    style.textContent = `
#${TOAST_ROOT_ID}{position:fixed;top:10px;right:10px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none}
#${TOAST_ROOT_ID} .ago-mini-toast{width:min(360px,calc(100vw - 18px));position:relative;overflow:visible;pointer-events:auto;border-radius:16px;padding:0;background:transparent;box-shadow:none;color:var(--ago-toast-text,#374151);backdrop-filter:none;-webkit-backdrop-filter:none;opacity:0;transform:translateY(-8px) scale(.985);transition:opacity .14s ease,transform .14s ease}
#${TOAST_ROOT_ID} .ago-mini-toast.show{opacity:1;transform:translateY(0) scale(1)}
#${TOAST_ROOT_ID} .ago-mini-toast.hide{opacity:0;transform:translateY(-8px) scale(.985)}
#${TOAST_ROOT_ID} .ago-mini-toast__frame{position:relative;overflow:hidden;border-radius:16px;padding:8px 10px 9px;border:1px solid var(--ago-toast-border,rgba(255,255,255,.4));background:var(--ago-toast-bg,rgba(255,255,255,.72));box-shadow:0 6px 14px rgba(15,23,42,.07), inset 0 1px 0 rgba(255,255,255,.44), 0 2px 10px var(--ago-toast-shadow,rgba(15,23,42,.06));backdrop-filter:blur(12px) saturate(1.08);-webkit-backdrop-filter:blur(12px) saturate(1.08)}
#${TOAST_ROOT_ID} .ago-mini-toast__frame::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.03))}
#${TOAST_ROOT_ID} .ago-mini-toast__top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
#${TOAST_ROOT_ID} .ago-mini-toast__left{display:flex;align-items:center;gap:8px;min-width:0;max-width:calc(100% - 24px)}
#${TOAST_ROOT_ID} .ago-mini-toast__tags{display:flex;align-items:center;gap:6px;min-width:0;max-width:100%;white-space:nowrap;flex-wrap:nowrap}
#${TOAST_ROOT_ID} .ago-mini-toast__bell{font-size:22px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.14));transform-origin:top center;animation:agoBellShake .75s ease-in-out infinite}
#${TOAST_ROOT_ID} .ago-mini-toast__authorTag{display:inline-flex;align-items:center;max-width:100%;padding:3px 10px;border:1px solid rgba(17,24,39,.24);border-radius:999px;font:700 10px/1.1 Arial,sans-serif;letter-spacing:.01em;color:var(--ago-toast-text,#5b5566);background:rgba(255,255,255,.28);text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:inset 0 1px 0 rgba(255,255,255,.45)}
#${TOAST_ROOT_ID} .ago-mini-toast__changerTag{display:inline-flex;align-items:center;max-width:100%;padding:3px 10px;border:1px solid rgba(148,163,184,.35);border-radius:999px;font:700 10px/1.1 Arial,sans-serif;letter-spacing:.01em;color:#6b7280;background:rgba(255,255,255,.68);text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:inset 0 1px 0 rgba(255,255,255,.75)}
#${TOAST_ROOT_ID} .ago-mini-toast__changerTag[hidden]{display:none !important}
#${TOAST_ROOT_ID} .ago-mini-toast__close{position:relative;z-index:1;appearance:none;border:none;background:transparent;color:#ef4444;font:700 14px/1 Arial,sans-serif;cursor:pointer;padding:0 2px;opacity:.95;text-shadow:none}
#${TOAST_ROOT_ID} .ago-mini-toast__close:hover{transform:scale(1.08)}
#${TOAST_ROOT_ID} .ago-mini-toast__content{position:relative;z-index:1;display:block;min-height:0;padding:4px 6px 2px;font:700 12px/1.35 Arial,sans-serif;color:var(--ago-toast-text,#5a5561);text-align:center;word-break:break-word}
@keyframes agoBellShake{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-16deg)}40%{transform:rotate(14deg)}60%{transform:rotate(-10deg)}80%{transform:rotate(8deg)}}
@media (max-width:640px){#${TOAST_ROOT_ID}{top:6px;right:6px;left:auto}#${TOAST_ROOT_ID} .ago-mini-toast{width:min(264px,calc(100vw - 12px))}}`;
    (document.head || document.documentElement).appendChild(style);
  }

  function ensureToastRoot() {
    ensureToastStyle();
    let root = document.getElementById(TOAST_ROOT_ID);
    if (root) return root;
    root = document.createElement('div');
    root.id = TOAST_ROOT_ID;
    (document.body || document.documentElement).appendChild(root);
    return root;
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function foldText(value) {
    try {
      return normalizeText(String(value || ''))
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();
    } catch (e) {
      return normalizeText(String(value || '')).toLowerCase();
    }
  }

  function isGenericCmsTitle(value) {
    const folded = foldText(value);
    return !folded || folded === 'bao an giang cms' || folded === 'cms status';
  }

  function buildReadableToastTexts(event) {
    const rawAuthor = normalizeText(event?.author || '');
    const rawChanger = formatToastUsername(event?.changerUsername || '');
    const rawTitle = normalizeText(event?.title || '');
    const statusLabel = STATUS_LABELS[event?.toStatusKey || event?.statusKey] || 'CẬP NHẬT';
    const authorText = rawAuthor || statusLabel;
    const changerText = rawChanger || '';
    let titleText = rawTitle;
    if (isGenericCmsTitle(titleText)) titleText = '';
    titleText = normalizeText(titleText);
    return { authorText, changerText, titleText };
  }

  function showEventToast(event) {
    if (!notifyEnabled || !event || wasToastShownRecently(event)) return;
    const { authorText, changerText, titleText } = buildReadableToastTexts(event);
    if (!titleText) {
      return;
    }
    if (event?.type === 'status-change' && !normalizeText(event?.author || '') && isGenericCmsTitle(event?.title || '')) {
      return;
    }
    rememberToastEvent(event);
    const root = ensureToastRoot();
    removeSupersededToasts(root, event);
    const eventKey = eventFingerprint(event);
    if (eventKey && root.querySelector(`[data-ago-toast-key="${CSS.escape(eventKey)}"]`)) return;
    const toast = document.createElement('div');
    const theme = STATUS_THEME[event.toStatusKey || event.statusKey] || STATUS_THEME.choBienTap;
    const toastId = `ago-toast-${Date.now()}-${++toastSeq}`;

    toast.className = 'ago-mini-toast';
    if (eventKey) toast.dataset.agoToastKey = eventKey;
    toast.id = toastId;
    toast.setAttribute('data-event-id', normalizeText(event?.id || ''));
    toast.setAttribute('data-status-key', normalizeText(event?.toStatusKey || event?.statusKey || ''));
    toast.setAttribute('data-title-key', normalizeText(foldText(event?.title || '')));
    toast.style.setProperty('--ago-toast-bg', theme.bg || 'rgba(255,255,255,.72)');
    toast.style.setProperty('--ago-toast-border', theme.border || `${theme.accent}55`);
    toast.style.setProperty('--ago-toast-shadow', theme.shadow || 'rgba(15,23,42,.06)');
    toast.style.setProperty('--ago-toast-text', theme.text || '#374151');
    toast.innerHTML = `
      <div class="ago-mini-toast__frame">
        <div class="ago-mini-toast__top">
          <div class="ago-mini-toast__left">
            <div class="ago-mini-toast__bell" aria-hidden="true">🔔</div>
            <div class="ago-mini-toast__tags">
              <div class="ago-mini-toast__authorTag">${escapeHtml(authorText)}</div>
              <div class="ago-mini-toast__changerTag" ${changerText ? '' : 'hidden'}>${escapeHtml(changerText || '')}</div>
            </div>
          </div>
          <button type="button" class="ago-mini-toast__close" aria-label="Đóng">❌</button>
        </div>
        <div class="ago-mini-toast__content">${escapeHtml(titleText)}</div>
      </div>
    `;

    const removeToast = () => {
      if (!toast.isConnected) return;
      toast.classList.remove('show');
      toast.classList.add('hide');
      window.setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 220);
    };

    const timer = window.setTimeout(removeToast, TOAST_LIFETIME_MS);
    toast.querySelector('.ago-mini-toast__close')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.clearTimeout(timer);
      removeToast();
    });

    root.appendChild(toast);
    while (root.children.length > MAX_EVENT_TOASTS) {
      root.removeChild(root.firstElementChild);
    }
    requestAnimationFrame(() => toast.classList.add('show'));
  }


  function broadcastRealtimeToastEvent(event, options = {}) {
    return false;
  }

  function bindRealtimeToastEvents() {
    try {
      chrome.runtime.onMessage.addListener((message) => {
        if (!message || message.type !== 'AGO_PUSH_TOAST_EVENT' || !message.event) return;
        void scheduleEventToast(message.event, {
          allowNonLeader: true,
          bypassGlobalClaim: true
        });
      });
    } catch (e) {}
  }

  function bindStorageDrivenNotifications() {
    return;
  }


  function init() {
    loadShownToastEvents();
    refreshNotifyState();
    bindStorageDrivenNotifications();
    bindRealtimeToastEvents();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

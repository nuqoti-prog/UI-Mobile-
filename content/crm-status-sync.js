(function () {
  if (window.__AGO_CRM_SYNC_V23__) return;
  window.__AGO_CRM_SYNC_V23__ = true;

  const STORAGE_KEY = 'ago_crm_status_counts_v10';
  const META_KEY = 'ago_crm_status_meta_v10';
  const SNAPSHOT_KEY = 'ago_crm_status_snapshot_v1';
  const ITEMS_KEY = 'ago_crm_status_items_v10';
  const POLL_MS = 2500;
  const FAST_REFRESH_DEBOUNCE_MS = 120;
  const FAST_REFRESH_COOLDOWN_MS = 700;
  const PAGE_SIGNAL_EVENT = 'AGO_CRM_PAGE_SIGNAL_V1';
  const FETCH_BATCH_SIZE = 3;
  const MANUAL_LOCK_MS = 30000;
  const MISSING_ITEM_GRACE_MS = 12000;
  const MAX_PAGES = 10;
  const LIST_URL = 'https://crmag.baoangiang.com.vn/news?page=1&lang=vi';
  const CANONICAL_LIST_DEFAULTS = { c1:'all', c2:'all', s:'10', search:'', h:'10', f:'10', cn:'0', en:'0', t:'10', k:'10', ho:'10', lang:'vi', u:'', td:'10', v:'10', tdsub:'10', vsub:'10', fsub:'10', au:'10', strID:'', a:'10', view:'' };
  const NOTIFY_KEY = 'ago_widget_notify_enabled_v1';
  const TOAST_ROOT_ID = 'ago-crm-toast-root-v19';
  const TOAST_STYLE_ID = 'ago-crm-toast-style-v19';
  const TOAST_LIFETIME_MS = 5000;
  const MAX_EVENT_TOASTS = 8;
  const TOAST_EVENT_DEDUP_MS = 15000;
  const PENDING_TOAST_MAX_WAIT_MS = 5000;
  const LEADER_KEY = 'ago_crm_sync_leader_v1';
  const LEADER_TTL_MS = 4500;
  const LEADER_HEARTBEAT_MS = 1500;
  const LEADER_CLAIM_RETRY_MS = 1000;
  const TOAST_REGISTRY_TTL_MS = 15000;
  const LOCAL_STORAGE_TOAST_SUPPRESS_MS = 12000;

  const STATUS_LABELS = {
    choBienTap: 'TIN CHỜ',
    kyThuat: 'KỸ THUẬT',
    daBienTapB1: 'BƯỚC 1',
    daBienTapB2: 'BƯỚC 2',
    xuatBan: 'XUẤT BẢN',
    daDuyet: 'ĐÃ DUYỆT',
    nhap: 'NHÁP',
    haTin: 'HẠ TIN',
    xoaTam: 'XOÁ TẠM',
    xoaTam: 'XOÁ TẠM',
    khongDuyet: 'KHÔNG DUYỆT'
  };

  const STATUS_CODE_TO_KEY = {
    '0': null,
    '1': 'choBienTap',
    '9': 'kyThuat',
    '2': 'daBienTapB1',
    '3': 'daBienTapB2',
    '4': 'daDuyet',
    '6': 'xuatBan',
    '7': 'haTin',
    '8': 'xoaTam'
  };

  const STATUS_ORDER = {
    choBienTap: 1,
    kyThuat: 2,
    daBienTapB1: 3,
    daBienTapB2: 4,
    daDuyet: 5,
    xuatBan: 6,
    haTin: 7,
    xoaTam: 8,
    khongDuyet: 9
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
}
  };

  let refreshing = false;
  let queued = false;
  let notifyEnabled = true;
  let toastSeq = 0;
  let lastImmediateSignal = { newsId: '', statusKey: '', at: 0 };
  let recentUserAction = { newsId: '', statusKey: '', at: 0, source: '' };
  let fastRefreshTimer = 0;
  let lastFastRefreshAt = 0;
  const recentToastEvents = new Map();
  const latestScheduledToastTokenByNewsId = new Map();
  const SHOWN_TOAST_STORAGE_KEY = 'ago_shown_toast_events_v1';
  const SHOWN_TOAST_MAX_ENTRIES = 400;
  const shownToastEvents = new Set();
  const pendingToastJobs = new Map();
  let recentLocalToastContext = { newsId: '', statusKey: '', until: 0 };
  const leaderOwnerId = `crm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let isLeader = false;
  let leaderHeartbeatTimer = 0;
  let leaderClaimTimer = 0;


  const historyHtmlCache = new Map();

  function formatUsername(raw) {
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

  function looksLikeTimestampCell(text) {
    return /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.test(String(text || '').trim());
  }

  function looksLikeHistoryUsernameCandidate(raw) {
    const text = normalizeText(raw);
    if (!text) return false;
    if (looksLikeTimestampCell(text)) return false;
    if (/^\/s\s*=\s*\d+$/i.test(text)) return false;
    if (/^news_[a-z0-9_]+$/i.test(text)) return false;
    if (/^[A-Z_]{6,}$/.test(text)) return false;
    const folded = foldHistoryText(text).replace(/[^a-z0-9]+/g, ' ').trim();
    if (!folded) return false;
    if (/^(cho bien tap|ky thuat|buoc 1|buoc 2|xuat ban|ha tin|xoa tam|nhap|da duyet|khong duyet|xem log noi dung)$/.test(folded)) return false;
    return /[a-z0-9]/i.test(text);
  }

  function extractHistoryUsernameCell(row) {
    const cells = Array.from(row?.children || []);
    if (!cells.length) return '';
    const preferredIndexes = [4, 3, 2, 1, 0];
    for (const idx of preferredIndexes) {
      const value = normalizeText(cells[idx]?.textContent || '');
      if (looksLikeHistoryUsernameCandidate(value)) return value;
    }
    for (const cell of cells) {
      const value = normalizeText(cell?.textContent || '');
      if (looksLikeHistoryUsernameCandidate(value)) return value;
    }
    return '';
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  async function fetchHistoryHtml(newsId, forceFresh = false) {
    const key = String(newsId || '');
    if (!key) return '';
    if (forceFresh) historyHtmlCache.delete(key);
    if (historyHtmlCache.has(key)) return historyHtmlCache.get(key) || '';
    try {
      const res = await fetch(`${location.origin}/news/gethistory`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: `news_id=${encodeURIComponent(key)}`
      });
      if (!res.ok) return '';
      const html = await res.text();
      historyHtmlCache.set(key, html || '');
      window.setTimeout(() => historyHtmlCache.delete(key), 1600);
      return html || '';
    } catch (e) {
      return '';
    }
  }

  function parseHistoryTimestamp(raw) {
    const text = String(raw || '').trim();
    const match = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
    if (!match) return 0;
    const [, dd, mm, yyyy, hh, min] = match;
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), 0, 0).getTime() || 0;
  }

  function parseHistoryRowMeta(row) {
    const action = normalizeText(row?.children?.[0]?.textContent || '').toUpperCase();
    const statusText = normalizeText(row?.children?.[1]?.textContent || '');
    const rawContent = String(row?.children?.[3]?.textContent || '').trim();
    const username = extractHistoryUsernameCell(row);
    const timestamp = parseHistoryTimestamp(row?.children?.[5]?.textContent || '');
    const normalizedStatus = normalizeText(statusText || '').toLowerCase();
    const normalizedContent = normalizeText(rawContent || '').toUpperCase();
    const sMatch = rawContent.match(/\/s\s*=\s*(\d+)/i);
    const sValue = sMatch ? Number(sMatch[1]) : null;
    return { action, statusText, rawContent, username, timestamp, normalizedStatus, normalizedContent, sValue };
  }

  function foldHistoryText(text) {
    return normalizeText(text)
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();
  }

  function isFakeHistoryUsername(raw) {
    const formatted = formatUsername(raw);
    const value = foldHistoryText(formatted).replace(/[^a-z0-9]+/g, ' ').trim();
    if (!value) return true;
    const blockedExact = new Set([
      'cho bien tap',
      'tin cho',
      'ky thuat',
      'buoc 1',
      'buoc 2',
      'xuat ban',
      'ha tin',
      'xoa tam',
      'nhap',
      'da duyet',
      'khong duyet',
      'xem log noi dung'
    ]);
    if (blockedExact.has(value)) return true;
    if (/^news_[a-z0-9_]+$/i.test(String(raw || '').trim())) return true;
    if (/^\/s\s*=\s*\d+$/i.test(String(raw || '').trim())) return true;
    return false;
  }

  function isNoiseHistoryAction(action) {
    const value = String(action || '').trim().toUpperCase();
    return value === 'PREVIEW_NEW' || value === 'NEWS_FEATURE' || value === 'NEWS_FEATURE_SUBCATE';
  }

  function isExplicitHistoryTransition(meta, wantedStatusKey) {
    if (!meta || !wantedStatusKey) return false;
    if (isNoiseHistoryAction(meta.action)) return false;
    if (wantedStatusKey === 'choBienTap') {
      return meta.action === 'NEWS_EDIT_CHOBIENTAP' ||
        meta.normalizedContent.includes('NEWS_EDIT_CHOBIENTAP') ||
        meta.normalizedContent.includes('NEWS_ADD_CHOBIENTAP') ||
        (meta.action === 'NEWS_ADD' && meta.normalizedStatus.includes('chờ biên tập'));
    }
    if (wantedStatusKey === 'kyThuat') {
      return meta.action === 'NEWS_EDIT' && (meta.sValue === 9 || meta.normalizedContent.includes('/S=9'));
    }
    if ((STATUS_CODE_TO_KEY[String(meta.sValue)] || '') === wantedStatusKey) return true;
    if (wantedStatusKey === 'daBienTapB1') {
      return meta.action === 'NEWS_EDIT_DABIENTAP' || meta.normalizedContent.includes('NEWS_EDIT_DABIENTAP');
    }
    if (wantedStatusKey === 'daBienTapB2') {
      return meta.action === 'NEWS_WAITTING_B2' || meta.normalizedContent.includes('NEWS_WAITTING_B2');
    }
    if (wantedStatusKey === 'nhap') {
      return meta.action === 'NEWS_EDIT_NHAP' || meta.normalizedContent.includes('NEWS_EDIT_NHAP') || meta.normalizedContent.includes('NEWS_ADD_NHAP');
    }
    if (wantedStatusKey === 'xuatBan') return meta.action === 'NEWS_ACTIVE';
    if (wantedStatusKey === 'haTin') return meta.action === 'NEWS_INACTIVE';
    if (wantedStatusKey === 'xoaTam') return meta.action === 'NEWS_XOATAM';
    return false;
  }

  function parseHistoryStatusKey(row) {
    const meta = parseHistoryRowMeta(row);
    const { action, username, timestamp, normalizedStatus, normalizedContent, sValue } = meta;
    if (!username || isFakeHistoryUsername(username) || isNoiseHistoryAction(action)) {
      return { statusKey: '', username: '', timestamp: 0, score: 0 };
    }
    const candidates = [];
    const addCandidate = (statusKey, score) => {
      if (!statusKey) return;
      const safeScore = Number(score || 0);
      const existing = candidates.find((item) => item.statusKey === statusKey);
      if (!existing) {
        candidates.push({ statusKey, score: safeScore });
        return;
      }
      if (safeScore > existing.score) existing.score = safeScore;
    };

    if (action === 'NEWS_ACTIVE') addCandidate('xuatBan', 140);
    if (action === 'NEWS_INACTIVE') addCandidate('haTin', 140);
    if (action === 'NEWS_XOATAM') addCandidate('xoaTam', 140);

    if (action === 'NEWS_EDIT_NHAP') addCandidate('nhap', 135);
    if (action === 'NEWS_EDIT_CHOBIENTAP') addCandidate('choBienTap', 140);
    if (action === 'NEWS_EDIT_DABIENTAP') addCandidate('daBienTapB1', 135);
    if (action === 'NEWS_WAITTING_B2') addCandidate('daBienTapB2', 135);
    if (action === 'NEWS_EDIT' && sValue === 9) addCandidate('kyThuat', 140);
    if (action === 'NEWS_ADD') {
      if (normalizedContent.includes('NEWS_ADD_NHAP') || normalizedStatus.includes('nháp')) addCandidate('nhap', 130);
      if (normalizedContent.includes('NEWS_ADD_CHOBIENTAP')) addCandidate('choBienTap', 140);
      else if (normalizedStatus.includes('chờ biên tập')) addCandidate('choBienTap', 118);
    }

    if (action.startsWith('NEWS_EDIT') && sValue !== null) {
      addCandidate(STATUS_CODE_TO_KEY[String(sValue)] || '', 130);
    }

    if (normalizedStatus.includes('kỹ thuật')) addCandidate('kyThuat', 80);
    if (normalizedStatus.includes('chờ biên tập')) addCandidate('choBienTap', 70);
    if (normalizedStatus.includes('xuất bản')) addCandidate('xuatBan', 75);
    if (normalizedStatus.includes('nháp')) addCandidate('nhap', 75);
    if (normalizedStatus.includes('hạ tin')) addCandidate('haTin', 75);
    if (normalizedStatus.includes('xoá tạm') || normalizedStatus.includes('xóa tạm')) addCandidate('xoaTam', 75);

    if (normalizedContent.includes('NEWS_EDIT_NHAP') || normalizedContent.includes('/S=0')) {
      addCandidate('nhap', 120);
    }
    if (normalizedContent.includes('NEWS_EDIT_CHOBIENTAP')) {
      addCandidate('choBienTap', 138);
    } else if (normalizedContent.includes('NEWS_ADD_CHOBIENTAP')) {
      addCandidate('choBienTap', 136);
    } else if (normalizedContent.includes('/S=1')) {
      addCandidate('choBienTap', 112);
    }
    if (normalizedContent.includes('NEWS_EDIT_DABIENTAP') || normalizedContent.includes('/S=2')) {
      addCandidate('daBienTapB1', 120);
    }
    if (normalizedContent.includes('NEWS_WAITTING_B2') || normalizedContent.includes('/S=3')) {
      addCandidate('daBienTapB2', 120);
    }
    if (action === 'NEWS_EDIT' && normalizedContent.includes('/S=9')) {
      addCandidate('kyThuat', 138);
    } else if (normalizedContent.includes('/S=9')) {
      addCandidate('kyThuat', 108);
    }
    if (normalizedContent.includes('/S=6')) {
      addCandidate('xuatBan', 110);
    }
    if (normalizedContent.includes('/S=7')) {
      addCandidate('haTin', 110);
    }
    if (normalizedContent.includes('/S=8')) {
      addCandidate('xoaTam', 110);
    }

    if (!candidates.length) return { statusKey: '', username: '', timestamp, score: 0 };
    candidates.sort((a, b) => (b.score - a.score) || ((b.statusKey || '').length - (a.statusKey || '').length));
    return { statusKey: candidates[0].statusKey || '', username, timestamp, score: candidates[0].score || 0 };
  }

  function extractChangerUsernameFromHistoryHtml(html, wantedStatusKey) {
    if (!html || !wantedStatusKey) return '';
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = Array.from(doc.querySelectorAll('tbody tr'));
      const matches = [];
      for (const row of rows) {
        const meta = parseHistoryRowMeta(row);
        const parsed = parseHistoryStatusKey(row);
        if (parsed.statusKey !== wantedStatusKey || !parsed.username) continue;
        matches.push({
          ...parsed,
          isExplicit: isExplicitHistoryTransition(meta, wantedStatusKey),
          isFakeUser: isFakeHistoryUsername(parsed.username),
          action: meta.action || ''
        });
      }
      if (!matches.length) return '';
      matches.sort((a, b) => {
        if (Number(b.isExplicit) !== Number(a.isExplicit)) return Number(b.isExplicit) - Number(a.isExplicit);
        if (Number(a.isFakeUser) !== Number(b.isFakeUser)) return Number(a.isFakeUser) - Number(b.isFakeUser);
        if ((b.timestamp || 0) !== (a.timestamp || 0)) return (b.timestamp || 0) - (a.timestamp || 0);
        return (b.score || 0) - (a.score || 0);
      });
      return matches[0]?.username || '';
    } catch (e) {}
    return '';
  }


  function extractLatestStatusKeyFromHistoryHtml(html) {
    if (!html) return '';
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const rows = Array.from(doc.querySelectorAll('tbody tr'));
      for (const row of rows) {
        const parsed = parseHistoryStatusKey(row);
        if (parsed.statusKey) return parsed.statusKey;
      }
    } catch (e) {}
    return '';
  }

  async function resolveCurrentStatusFromHistory(newsId) {
    const id = String(newsId || '').trim();
    if (!id) return '';
    try {
      const html = await fetchHistoryHtml(id, true);
      return extractLatestStatusKeyFromHistoryHtml(html);
    } catch (e) {
      return '';
    }
  }

  async function resolveCurrentStatusFromHistoryWithTimeout(newsId, timeoutMs = 450) {
    const timeout = Math.max(120, Number(timeoutMs || 0));
    try {
      return await Promise.race([
        resolveCurrentStatusFromHistory(newsId),
        new Promise((resolve) => window.setTimeout(() => resolve(''), timeout))
      ]);
    } catch (e) {
      return '';
    }
  }

  async function resolveChangerUsername(event, mode = 'long') {
    try {
      if (!event) return '';
      if (event.changerUsername) return formatUsername(event.changerUsername);
      const newsId = event.id || event.newsId || '';
      const wantedStatusKey = event.toStatusKey || event.statusKey || '';
      if (!newsId || !wantedStatusKey) return '';
      let retryDelays = [0, 120, 320, 700, 1200, 1800, 2600];
      if (mode === 'single') retryDelays = [0];
      else if (mode === 'short') retryDelays = [0, 120, 320, 700, 1200, 1800];
      else if (mode === 'pending') retryDelays = [0, 200, 500, 1000, 1500, 1800];
      for (let i = 0; i < retryDelays.length; i += 1) {
        const delay = retryDelays[i];
        if (delay) await sleep(delay);
        const html = await fetchHistoryHtml(newsId, i > 0);
        const username = extractChangerUsernameFromHistoryHtml(html, wantedStatusKey);
        if (username) return formatUsername(username);
      }
    } catch (e) {}
    return '';
  }

  async function prepareToastEventForDisplay(event, options = {}) {
    const baseEvent = event && typeof event === 'object' ? { ...event } : null;
    if (!baseEvent) return null;
    const requireChanger = options.requireChanger !== false && String(baseEvent.type || '').trim() === 'status-change';
    const existing = formatUsername(baseEvent.changerUsername || '');
    if (existing) {
      baseEvent.changerUsername = existing;
      return baseEvent;
    }
    const resolved = formatUsername(await resolveChangerUsername(baseEvent, options.mode || 'short'));
    if (resolved) {
      baseEvent.changerUsername = resolved;
      try {
        const newsId = String(baseEvent.id || baseEvent.newsId || '').trim();
        if (newsId) {
          const state = await storageGet([ITEMS_KEY]);
          const items = state[ITEMS_KEY] && typeof state[ITEMS_KEY] === 'object' ? { ...state[ITEMS_KEY] } : {};
          if (items[newsId] && items[newsId].changerUsername !== resolved) {
            items[newsId] = {
              ...items[newsId],
              changerUsername: resolved
            };
            await storageSet({ [ITEMS_KEY]: items });
          }
        }
      } catch (e) {}
      return baseEvent;
    }
    return requireChanger ? null : baseEvent;
  }

  function applyChangerUsernameToToast(toast, username) {
    try {
      if (!toast || !username) return;
      const tag = toast.querySelector('.ago-mini-toast__changerTag');
      if (!tag) return;
      tag.textContent = username;
      tag.hidden = false;
      tag.style.display = 'inline-flex';
    } catch (e) {}
  }

  function hydrateExistingToastFromEvent(event) {
    try {
      if (!event || !event.changerUsername) return false;
      const root = document.getElementById(TOAST_ROOT_ID);
      if (!root) return false;
      const targetId = String(event.id || '');
      if (!targetId) return false;
      const cards = Array.from(root.querySelectorAll('.ago-mini-toast'));
      for (const card of cards) {
        const cardId = String(card.getAttribute('data-event-id') || '');
        if (cardId && cardId === targetId) {
          applyChangerUsernameToToast(card, formatUsername(event.changerUsername));
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function hydrateToastChangerUsername(toast, event) {
    try {
      if (!toast || !event) return;
      const existing = formatUsername(event?.changerUsername || '');
      if (existing) {
        applyChangerUsernameToToast(toast, existing);
        return;
      }
      void (async () => {
        const username = await resolveChangerUsername(event, 'short');
        if (!username || !toast.isConnected) return;
        event.changerUsername = username;
        applyChangerUsernameToToast(toast, username);
        try {
          const newsId = String(event.id || event.newsId || '').trim();
          if (newsId) {
            const state = await storageGet([ITEMS_KEY]);
            const items = state[ITEMS_KEY] && typeof state[ITEMS_KEY] === 'object' ? { ...state[ITEMS_KEY] } : {};
            if (items[newsId] && items[newsId].changerUsername !== username) {
              items[newsId] = {
                ...items[newsId],
                changerUsername: username
              };
              await storageSet({ [ITEMS_KEY]: items });
            }
          }
        } catch (e) {}
      })();
    } catch (e) {}
  }

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

  function foldText(text) {
    return normalizeText(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function mapStatus(rawText) {
    const t = foldText(rawText)
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
    if (!t) return null;
    if (t.includes('cho bien tap')) return 'choBienTap';
    if (t.includes('ky thuat')) return 'kyThuat';
    if (t.includes('da bien tap b1') || t.includes('da bt b1') || t.includes('bien tap buoc 1') || t.includes('bien tap b1')) return 'daBienTapB1';
    if (t.includes('da bien tap b2') || t.includes('da bt b2') || t.includes('bien tap buoc 2') || t.includes('bien tap b2')) return 'daBienTapB2';
    if (t.includes('da duyet')) return 'daDuyet';
    if (t.includes('xuat ban')) return 'xuatBan';
    if (t.includes('nhap')) return 'nhap';
    if (t.includes('ha tin')) return 'haTin';
    if (t.includes('xoa tam')) return 'xoaTam';
    if (t.includes('khong duyet')) return 'khongDuyet';
    return null;
  }

  function isQcRow(row, idCell, titleCell) {
    const idText = normalizeText(idCell?.textContent || idCell?.innerText || '');
    const titleText = normalizeText(titleCell?.textContent || titleCell?.innerText || '');
    const rowText = normalizeText(row?.textContent || row?.innerText || '');
    const qcBadge = row?.querySelector?.('td:nth-child(2) b, td:nth-child(2) strong');
    const qcBadgeText = normalizeText(qcBadge?.textContent || qcBadge?.innerText || '');
    return /\bqc\b/i.test(qcBadgeText) || /\bqc\b/i.test(idText) || /\bqc\b/i.test(titleText) || /\bqc\b/i.test(rowText);
  }

  function extractDateLikeText(value) {
    const text = normalizeText(value);
    if (!text) return '';
    const match = text.match(/\b(\d{2}-\d{2}-\d{2,4}(?:\s+\d{2}:\d{2}(?::\d{2})?)?)\b/);
    return match ? normalizeText(match[1]) : '';
  }

  function isDateLikeText(value) {
    return !!extractDateLikeText(value);
  }

  function firstDateLikeValue(list) {
    for (const value of list || []) {
      const text = extractDateLikeText(value);
      if (text) return text;
    }
    return '';
  }

  function extractRowId(row, fallbackCell) {
    const checkboxValue = normalizeText(row?.querySelector?.('input[type="checkbox"][name="uid"]')?.value || '');
    if (/^\d+$/.test(checkboxValue)) return checkboxValue;
    const idText = normalizeText(fallbackCell?.textContent || fallbackCell?.innerText || '');
    const match = idText.match(/\b(\d{3,})\b/);
    return match ? match[1] : '';
  }

  function resolveRowStatusKey(row, statusCell) {
    const statusText = statusCell?.textContent || statusCell?.innerText || '';
    const direct = mapStatus(statusText);
    if (direct) return direct;
    return null;
  }

  function extractQcRowMeta(row) {
    const cells = Array.from(row?.querySelectorAll('td') || []);
    if (cells.length < 3) return null;

    const idCell = cells[1] || null;
    const titleCell = cells[2] || null;
    const explicitId = extractRowId(row, idCell);

    const directDateCandidates = [];
    const directActiveCandidates = [];
    const statusCandidates = [];
    cells.forEach((cell) => {
      const cellText = normalizeText(cell?.textContent || cell?.innerText || '');
      const inputValue = normalizeText(cell?.querySelector?.('input')?.value || '');
      if (cellText) directDateCandidates.push(cellText);
      if (inputValue) directActiveCandidates.push(inputValue);
      if (cellText || inputValue) statusCandidates.push(cellText || inputValue);
    });

    const authorCell = cells.find((cell, idx) => idx >= 14 && !!pickAuthor(cell)) || cells[14] || null;

    return {
      idText: explicitId,
      title: pickTitle(titleCell),
      dateText: firstDateLikeValue(directDateCandidates),
      activeDateText: firstDateLikeValue(directActiveCandidates) || firstDateLikeValue(directDateCandidates.slice().reverse()),
      statusKey: null,
      author: pickAuthor(authorCell),
      idCell,
      titleCell
    };
  }

  function emptyCounts() {
    return { choBienTap: 0, kyThuat: 0, daBienTapB1: 0, daBienTapB2: 0 };
  }

  function countsFromItems(items) {
    const counts = emptyCounts();
    Object.values(items || {}).forEach((entry) => {
      if (entry && entry.statusKey && counts[entry.statusKey] != null) counts[entry.statusKey] += 1;
    });
    return counts;
  }

  function sameCounts(a, b) {
    return (a?.choBienTap || 0) === (b?.choBienTap || 0) &&
      (a?.kyThuat || 0) === (b?.kyThuat || 0) &&
      (a?.daBienTapB1 || 0) === (b?.daBienTapB1 || 0) &&
      (a?.daBienTapB2 || 0) === (b?.daBienTapB2 || 0);
  }

  function statusOrder(statusKey) {
    return Number(STATUS_ORDER[statusKey] ?? -1);
  }

  function preferLockedStatus(lockedStatusKey, fetchedStatusKey) {
    if (!lockedStatusKey) return fetchedStatusKey || '';
    if (!fetchedStatusKey) return lockedStatusKey;
    const toggleStatusKeys = new Set(['xuatBan', 'haTin']);
    if (toggleStatusKeys.has(lockedStatusKey) && toggleStatusKeys.has(fetchedStatusKey) && lockedStatusKey !== fetchedStatusKey) {
      return lockedStatusKey;
    }
    return statusOrder(fetchedStatusKey) >= statusOrder(lockedStatusKey) ? fetchedStatusKey : lockedStatusKey;
  }


  function normalizeSnapshotPayload(payload) {
    const counts = payload && typeof payload.counts === 'object' ? payload.counts : payload || {};
    const items = payload && typeof payload.items === 'object' ? payload.items : {};
    return {
      counts: {
        choBienTap: Number(counts?.choBienTap || 0),
        kyThuat: Number(counts?.kyThuat || 0),
        daBienTapB1: Number(counts?.daBienTapB1 || 0),
        daBienTapB2: Number(counts?.daBienTapB2 || 0),
        updatedAt: Number(counts?.updatedAt || 0),
        ok: counts?.ok !== false,
        source: String(counts?.source || ''),
        lastError: String(counts?.lastError || '')
      },
      items: items && typeof items === 'object' ? { ...items } : {},
      emittedAt: Number(payload?.emittedAt || counts?.updatedAt || Date.now())
    };
  }

  function buildSnapshotPayload(counts, items) {
    return normalizeSnapshotPayload({ counts, items, emittedAt: Number(counts?.updatedAt || Date.now()) });
  }

  function storageGet(keys) {
    return new Promise((resolve) => {
      try { chrome.storage.local.get(keys, resolve); }
      catch (e) { resolve({}); }
    });
  }

  function storageSet(obj) {
    return new Promise((resolve) => {
      try { chrome.storage.local.set(obj, resolve); }
      catch (e) { resolve(); }
    });
  }

  async function canNotify() {
    try {
      const state = await storageGet([NOTIFY_KEY]);
      notifyEnabled = state[NOTIFY_KEY] !== false;
    } catch (e) {
      notifyEnabled = true;
    }
    return notifyEnabled;
  }



  function clearTimer(handle) {
    if (handle) window.clearInterval(handle);
    return 0;
  }

  function leaderPayload(now = Date.now()) {
    return {
      ownerId: leaderOwnerId,
      url: location.href,
      title: document.title || '',
      updatedAt: now,
      expiresAt: now + LEADER_TTL_MS
    };
  }

  function isLeaderEntryFresh(entry, now = Date.now()) {
    return !!(entry && entry.ownerId && Number(entry.expiresAt || 0) > now);
  }

  async function claimLeader(force = false) {
    const now = Date.now();
    const state = await storageGet([LEADER_KEY]);
    const current = state[LEADER_KEY] || null;
    const mine = current && current.ownerId === leaderOwnerId;
    if (!force && isLeaderEntryFresh(current, now) && !mine) {
      isLeader = false;
      return false;
    }
    await storageSet({ [LEADER_KEY]: leaderPayload(now) });
    isLeader = true;
    return true;
  }

  function ensureLeaderTimers() {
    if (!leaderHeartbeatTimer) {
      leaderHeartbeatTimer = window.setInterval(() => {
        claimLeader(true).catch(() => { isLeader = false; });
      }, LEADER_HEARTBEAT_MS);
    }
    if (!leaderClaimTimer) {
      leaderClaimTimer = window.setInterval(() => {
        if (!isLeader) claimLeader(false).catch(() => {});
      }, LEADER_CLAIM_RETRY_MS);
    }
  }

  async function releaseLeader() {
    leaderHeartbeatTimer = clearTimer(leaderHeartbeatTimer);
    leaderClaimTimer = clearTimer(leaderClaimTimer);
    if (!isLeader) return;
    isLeader = false;
    try {
      const state = await storageGet([LEADER_KEY]);
      const current = state[LEADER_KEY] || null;
      if (current && current.ownerId === leaderOwnerId) {
        await storageSet({ [LEADER_KEY]: { ...current, expiresAt: Date.now() - 1 } });
      }
    } catch (e) {}
  }

  function requestLeaderRefresh(reason) {
    try {
      chrome.runtime.sendMessage({ type: 'AGO_REQUEST_BACKGROUND_REFRESH_FAST', reason: String(reason || 'crm-fast') }, () => {
        try { void chrome.runtime.lastError; } catch (e) {}
      });
    } catch (e) {}
  }

  function todayYMD() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function todayPrefix() {
    const ymd = todayYMD();
    return `${ymd.slice(8, 10)}-${ymd.slice(5, 7)}-${ymd.slice(2, 4)}`;
  }

  function isFutureDateTime(value) {
    const ts = parseSortTime(value);
    if (!ts) return false;
    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
    return ts > endOfToday;
  }

  function extractAutoScheduleMeta(cell) {
    const result = { enabled: false, dateText: '' };
    if (!cell) return result;

    const candidates = [];
    const textValue = normalizeText(cell.textContent || cell.innerText || '');
    if (textValue) candidates.push(textValue);

    const hasYesIcon = !!cell.querySelector('img[title="Yes"], img[title*="Yes" i]');

    Array.from(cell.querySelectorAll('*')).forEach((el) => {
      const text = normalizeText(el.textContent || el.innerText || '');
      if (text) candidates.push(text);
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        const liveValue = normalizeText(el.value || '');
        const attrValue = normalizeText(el.getAttribute('value') || '');
        if (liveValue) candidates.push(liveValue);
        if (attrValue) candidates.push(attrValue);
      }
      const title = normalizeText(el.getAttribute?.('title') || '');
      const dataValue = normalizeText(el.getAttribute?.('data-value') || '');
      if (title) candidates.push(title);
      if (dataValue) candidates.push(dataValue);
    });

    result.dateText = firstDateLikeValue(candidates);
    result.enabled = hasYesIcon || !!result.dateText;
    return result;
  }

  function shouldSkipScheduledRow(autoMeta, targetPrefix) {
    if (!autoMeta?.enabled) return false;
    return true;
  }

  function resolveAutoScheduleCell(cells, found) {
    const list = Array.isArray(cells) ? cells : [];
    if (!list.length) return null;
    const candidates = [];
    const explicitIndex = Number(found?.autoIndex);
    if (Number.isInteger(explicitIndex) && explicitIndex >= 0) candidates.push(explicitIndex);
    candidates.push(10, 9, 11);
    for (const index of candidates) {
      const cell = list[index] || null;
      if (cell) return cell;
    }
    return null;
  }

  function getCurrentListPageNumber(urlLike) {
    try {
      const url = new URL(String(urlLike || location.href), location.origin);
      const raw = Number(url.searchParams.get('page') || '1');
      if (Number.isFinite(raw) && raw > 0) return Math.max(1, Math.floor(raw));
    } catch (e) {}
    return 1;
  }

  function isNewsListPath(pathname) {
    const p = String(pathname || '').toLowerCase();
    return p === '/news' || p === '/news/' || p === '/news/index' || p === '/news/index/';
  }

  function getActiveListUrl() {
    const url = new URL(LIST_URL);
    Object.entries(CANONICAL_LIST_DEFAULTS).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    const ymd = todayYMD();
    url.pathname = '/news';
    url.searchParams.set('page', '1');
    url.searchParams.set('sd', ymd);
    url.searchParams.set('ed', ymd);
    url.searchParams.set('lang', 'vi');
    return url;
  }

  function buildPageUrl(page, baseUrl) {
    const url = new URL(String(baseUrl || getActiveListUrl()));
    url.pathname = '/news';
    url.searchParams.set('page', String(page));
    if (!url.searchParams.get('sd')) url.searchParams.set('sd', todayYMD());
    if (!url.searchParams.get('ed')) url.searchParams.set('ed', todayYMD());
    if (!url.searchParams.get('lang')) url.searchParams.set('lang', 'vi');
    url.searchParams.delete('_ago_ts');
    url.searchParams.set('_ago_ts', String(Date.now()));
    return url.toString();
  }

  function detectTargetDatePrefix() {
    return todayPrefix();
  }

  function findHeaderInfoInTable(table) {
    const rows = Array.from(table.querySelectorAll('tr'));
    for (let r = 0; r < Math.min(rows.length, 8); r += 1) {
      const cells = Array.from(rows[r].querySelectorAll('th, td'));
      if (!cells.length) continue;

      let idIndex = -1;
      let titleIndex = -1;
      let dateIndex = -1;
      let statusIndex = -1;
      let authorIndex = -1;
      let autoIndex = -1;
      let activeDateIndex = -1;

      cells.forEach((cell, i) => {
        const text = foldText(cell.textContent || cell.innerText || '');
        if (idIndex < 0 && text === 'id') idIndex = i;
        if (titleIndex < 0 && (text === 'ten' || text.startsWith('ten '))) titleIndex = i;
        if (dateIndex < 0 && text.includes('ngay tao')) dateIndex = i;
        if (activeDateIndex < 0 && text.includes('ngay ha/duyet')) activeDateIndex = i;
        if (statusIndex < 0 && text.includes('trang thai')) statusIndex = i;
        if (autoIndex < 0 && text.includes('hen gio')) autoIndex = i;
        if (authorIndex < 0 && text.includes('nhuan but')) authorIndex = i;
      });

      if (idIndex >= 0 && titleIndex >= 0 && dateIndex >= 0 && statusIndex >= 0 && authorIndex >= 0) {
        return { headerRowIndex: r, idIndex, titleIndex, dateIndex, activeDateIndex, statusIndex, autoIndex, authorIndex };
      }
    }
    return null;
  }

  function pickTitle(cell) {
    if (!cell) return '';
    const clone = cell.cloneNode(true);
    clone.querySelectorAll('a').forEach((a) => {
      const t = String(a.textContent || a.innerText || '').trim();
      if (/link\s*fb/i.test(t)) a.remove();
    });

    return normalizeText(String(clone.innerText || clone.textContent || '')
      .replace(/\blink\s*fb\b/gi, ' ')
      .replace(/\r/g, ' ')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' '));
  }

  function lookupCurrentDomMetaById(itemId) {
    const targetId = normalizeText(itemId);
    if (!targetId) return { title: '', author: '', editUrl: '', reviewUrl: '', isQc: false, scheduledEnabled: false, scheduledDateText: '', row: null };
    const checkbox = document.querySelector(`input[type="checkbox"][name="uid"][value="${CSS.escape(targetId)}"]`);
    const row = checkbox?.closest?.('tr') || null;
    if (!row) return { title: '', author: '', editUrl: '', reviewUrl: '', isQc: false, scheduledEnabled: false, scheduledDateText: '', row: null };
    const cells = Array.from(row.querySelectorAll('td'));
    const idCell = cells[1] || null;
    const titleCell = cells[2] || null;
    const authorCell = cells[14] || cells[cells.length - 4] || null;
    const autoCell = cells[10] || null;
    const autoMeta = extractAutoScheduleMeta(autoCell);
    const rowUrls = pickRowUrls(row, targetId);
    return {
      title: pickTitle(titleCell),
      author: pickAuthor(authorCell),
      editUrl: rowUrls.editUrl,
      reviewUrl: rowUrls.reviewUrl,
      isQc: isQcRow(row, idCell, titleCell),
      scheduledEnabled: Boolean(autoMeta?.enabled),
      scheduledDateText: normalizeText(autoMeta?.dateText || ''),
      row
    };
  }

  function pickAuthor(cell) {
    if (!cell) return '';
    const candidates = [];
    const raw = String(cell.innerText || cell.textContent || '');
    if (raw) candidates.push(...raw.split(/\n+/));

    const valueSelectors = 'input, textarea, select, option, button, span, div, p, a, label';
    Array.from(cell.querySelectorAll(valueSelectors)).forEach((el) => {
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        if (el.value) candidates.push(el.value);
        if (el.getAttribute('value')) candidates.push(el.getAttribute('value'));
        if (el.placeholder) candidates.push(el.placeholder);
      } else if (el instanceof HTMLSelectElement) {
        const selected = el.options?.[el.selectedIndex];
        if (selected?.textContent) candidates.push(selected.textContent);
        Array.from(el.options || []).forEach((opt) => {
          if (opt.selected && opt.textContent) candidates.push(opt.textContent);
        });
      } else {
        if (el.textContent) candidates.push(el.textContent);
      }
      if (el.getAttribute?.('title')) candidates.push(el.getAttribute('title'));
      if (el.getAttribute?.('value')) candidates.push(el.getAttribute('value'));
    });

    const seen = new Set();
    for (const item of candidates) {
      const line = normalizeText(item);
      const folded = foldText(line);
      if (!line || seen.has(folded)) continue;
      seen.add(folded);
      if (!folded) continue;
      if (folded.startsWith('tac gia')) continue;
      if (folded.startsWith('cap nhat')) continue;
      if (folded.startsWith('ghi chu')) continue;
      if (folded.includes('nhuan but')) continue;
      if (folded === '0' || folded === 'all') continue;
      if (/^\d+$/.test(line)) continue;
      return line;
    }
    return '';
  }

  function parseSortTime(value) {
    const text = normalizeText(value);
    const m = text.match(/^(\d{2})-(\d{2})-(\d{2,4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!m) return 0;
    let year = Number(m[3]);
    if (year < 100) year += 2000;
    return new Date(year, Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0), Number(m[6] || 0)).getTime();
  }

  function tryMakeAbsoluteUrl(raw) {
    const href = normalizeText(raw || '');
    if (!href) return '';
    try { return new URL(href, LIST_URL).href; }
    catch (e) { return ''; }
  }

  function extractIntResultLike(value) {
    const text = normalizeText(value || '');
    if (!text) return '';
    const patterns = [
      /(?:[?&#]|&)intResult=(\d+)/i,
      /(?:[?&#]|&)id=(\d+)/i,
      /\bintResult\s*[:=]\s*(\d+)/i,
      /\bid\s*[:=]\s*(\d+)/i,
      /\((?:\s*['"])?(\d{3,})(?:['"])?\)/
    ];
    for (const re of patterns) {
      const match = text.match(re);
      if (match && match[1]) return match[1];
    }
    return '';
  }

  function buildNewsEditUrl(itemId) {
    const targetId = normalizeText(itemId);
    if (!/^\d+$/.test(targetId)) return '';
    return `https://crmag.baoangiang.com.vn/news/edit?id=${encodeURIComponent(targetId)}&lang=vi`;
  }

  function pickRowUrls(row, itemId) {
    const links = Array.from(row.querySelectorAll('a[href], a[onclick]'));
    let editUrl = buildNewsEditUrl(itemId);
    let reviewUrl = '';

    for (const link of links) {
      const href = normalizeText(link.getAttribute('href') || '');
      const onclick = normalizeText(link.getAttribute('onclick') || '');
      const title = normalizeText(link.getAttribute('title') || '');
      const alt = normalizeText(link.querySelector('img')?.getAttribute('alt') || '');
      const text = normalizeText(link.textContent || '');
      const haystack = foldText([href, onclick, title, alt, text].filter(Boolean).join(' '));
      const absoluteHref = href && !/^javascript:/i.test(href) ? tryMakeAbsoluteUrl(href) : '';
      const matchedId = extractIntResultLike(href) || extractIntResultLike(absoluteHref) || extractIntResultLike(onclick) || itemId;
      if (matchedId !== itemId) continue;

      if ((title && /edit/i.test(title)) || haystack.includes('edit')) {
        editUrl = buildNewsEditUrl(itemId);
      }

      if (alt.toLowerCase() === 'xem' || haystack.includes('preview-icon') || haystack.includes('mahoatin') || title.toLowerCase() === 'xem') {
        if (absoluteHref) reviewUrl = absoluteHref;
      }
    }

    return { editUrl, reviewUrl: reviewUrl || '' };
  }

  function mergeSpecialQcRows(rows, found, items, targetPrefix, excludedIds) {
    rows.forEach((row) => {
      const rowText = normalizeText(row?.textContent || row?.innerText || '');
      if (!/\bqc\b/i.test(rowText)) return;
      const cells = Array.from(row.querySelectorAll('td'));
      if (!cells.length) return;
      const meta = extractQcRowMeta(row) || {};
      const idCell = meta.idCell || cells[found.idIndex] || cells[1] || null;
      const titleCell = meta.titleCell || cells[found.titleIndex] || cells[2] || null;
      const idText = meta.idText || extractRowId(row, idCell) || normalizeText(idCell?.textContent || idCell?.innerText || '').split(/\s+/)[0];
      const dateText = meta.dateText || normalizeText(cells[found.dateIndex]?.textContent || cells[found.dateIndex]?.innerText || '');
      const activeDateText = meta.activeDateText || (found.activeDateIndex >= 0 ? normalizeText(cells[found.activeDateIndex]?.textContent || cells[found.activeDateIndex]?.innerText || cells[found.activeDateIndex]?.querySelector('input')?.value || '') : '');
      const autoMeta = extractAutoScheduleMeta(resolveAutoScheduleCell(cells, found));
      const statusKey = meta.statusKey || resolveRowStatusKey(row, cells[found.statusIndex] || null);
      if (!/^\d+$/.test(idText)) return;
      if (!dateText.startsWith(targetPrefix)) return;
      if (!statusKey) return;
      if (isFutureDateTime(activeDateText)) return;
      if (shouldSkipScheduledRow(autoMeta, targetPrefix)) {
        if (excludedIds && /^\d+$/.test(idText)) excludedIds.add(String(idText));
        return;
      }
      const rowUrls = pickRowUrls(row, idText);
      items[idText] = {
        id: idText,
        createdAt: dateText,
        activeAt: activeDateText,
        statusKey,
        title: meta.title || pickTitle(titleCell),
        author: meta.author || pickAuthor(cells[found.authorIndex] || null),
        isQc: true,
        editUrl: rowUrls.editUrl,
        reviewUrl: rowUrls.reviewUrl,
        scheduledEnabled: Boolean(autoMeta?.enabled),
        scheduledDateText: normalizeText(autoMeta?.dateText || ''),
        sortTime: parseSortTime(dateText)
      };
    });
  }

  function parsePage(doc, baseUrl) {
    const tables = Array.from(doc.querySelectorAll('table'));
    const targetPrefix = detectTargetDatePrefix();
    let best = null;

    tables.forEach((table) => {
      const found = findHeaderInfoInTable(table);
      if (!found) return;
      const rows = Array.from(table.querySelectorAll('tr'));
      const items = {};
      const excludedIds = new Set();
      let rowCount = 0;

      for (let i = found.headerRowIndex + 1; i < rows.length; i += 1) {
        const row = rows[i];
        const cells = Array.from(row.querySelectorAll('td'));
        if (!cells.length) continue;
        rowCount += 1;

        const idCell = cells[found.idIndex];
        const titleCell = cells[found.titleIndex];
        const isQc = isQcRow(row, idCell, titleCell);
        const qcMeta = isQc ? (extractQcRowMeta(row) || {}) : {};
        const idText = qcMeta.idText || extractRowId(row, idCell) || normalizeText(idCell?.textContent || idCell?.innerText || '').split(/\s+/)[0];
        const title = qcMeta.title || pickTitle(qcMeta.titleCell || titleCell);
        const dateText = qcMeta.dateText || normalizeText(cells[found.dateIndex]?.textContent || cells[found.dateIndex]?.innerText || '');
        const activeDateText = qcMeta.activeDateText || (found.activeDateIndex >= 0 ? normalizeText(cells[found.activeDateIndex]?.textContent || cells[found.activeDateIndex]?.innerText || cells[found.activeDateIndex]?.querySelector('input')?.value || '') : '');
        const autoMeta = extractAutoScheduleMeta(resolveAutoScheduleCell(cells, found));
        const statusKey = qcMeta.statusKey || resolveRowStatusKey(row, cells[found.statusIndex]);
        const author = qcMeta.author || pickAuthor(cells[found.authorIndex]);

        if (!/^\d+$/.test(idText)) continue;
        if (!dateText.startsWith(targetPrefix)) continue;
        if (!statusKey) continue;
        if (isFutureDateTime(activeDateText)) continue;
        if (shouldSkipScheduledRow(autoMeta, targetPrefix)) {
          excludedIds.add(String(idText));
          continue;
        }

        const rowUrls = pickRowUrls(row, idText);
        items[idText] = {
          id: idText,
          createdAt: dateText,
          activeAt: activeDateText,
          statusKey,
          title,
          author,
          isQc,
          editUrl: rowUrls.editUrl,
          reviewUrl: rowUrls.reviewUrl,
          scheduledEnabled: Boolean(autoMeta?.enabled),
          scheduledDateText: normalizeText(autoMeta?.dateText || ''),
          sortTime: parseSortTime(dateText)
        };
      }

      mergeSpecialQcRows(rows.slice(found.headerRowIndex + 1), found, items, targetPrefix, excludedIds);

      const candidate = { ok: true, items, excludedIds: Array.from(excludedIds), rowCount };
      if (!best) {
        best = candidate;
      } else {
        const bestCount = Object.keys(best.items || {}).length;
        const candCount = Object.keys(candidate.items || {}).length;
        if (candCount > bestCount || (candCount === bestCount && candidate.rowCount > best.rowCount)) best = candidate;
      }
    });

    return best || { ok: false, error: 'Khong tim thay cot ID / Ten / Ngay tao / Trang Thai / Nhuan But' };
  }

  function extractLastPageFromDoc(doc) {
    let maxPage = 1;
    Array.from(doc.querySelectorAll('.pagination a[href], a.number[href]')).forEach((a) => {
      const href = a.getAttribute('href') || '';
      const abs = tryMakeAbsoluteUrl(href);
      const candidate = abs || href;
      const m = String(candidate).match(/[?&]page=(\d+)/i);
      if (m) maxPage = Math.max(maxPage, Number(m[1] || 1));
    });
    const text = normalizeText(doc.querySelector('.pagination')?.textContent || '');
    const countMatch = text.match(/trong\s+(\d+)/i);
    if (countMatch) {
      const total = Number(countMatch[1] || 0);
      if (total > 0) maxPage = Math.max(maxPage, Math.ceil(total / 20));
    }
    return Math.max(1, Math.min(MAX_PAGES, maxPage));
  }

  async function fetchPage(page, baseUrl) {
    const res = await fetch(buildPageUrl(page, baseUrl), { credentials: 'include', cache: 'no-store' });
    const text = await res.text();
    if (/dang nhap|login|mat phien/i.test(text) && !/table/i.test(text)) {
      return { ok: false, error: 'Trang CRM dang yeu cau dang nhap hoac da het phien.' };
    }
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return parsePage(doc, baseUrl || buildPageUrl(page));
  }

  async function collectTodayItems() {
    const allItems = {};
    const excludedIds = new Set();
    let pagesRead = 0;
    const baseUrl = getActiveListUrl();
    let lastPage = 1;
    const currentListPage = isNewsListPath(location.pathname) ? getCurrentListPageNumber(location.href) : 0;

    const mergeParsedPage = (parsed) => {
      if (!parsed?.ok) return;
      Object.assign(allItems, parsed.items || {});
      (parsed.excludedIds || []).forEach((id) => {
        const cleanId = normalizeText(id);
        if (cleanId) excludedIds.add(cleanId);
      });
      pagesRead += 1;
    };

    let firstParsed = currentListPage === 1 ? parsePage(document, location.href || baseUrl) : await fetchPage(1, baseUrl);
    if (!firstParsed.ok && isNewsListPath(location.pathname)) {
      firstParsed = parsePage(document, baseUrl);
    }
    if (!firstParsed.ok) return firstParsed;
    mergeParsedPage(firstParsed);

    try {
      if (currentListPage === 1) lastPage = extractLastPageFromDoc(document);
      else {
        const res = await fetch(buildPageUrl(1, baseUrl), { credentials: 'include', cache: 'no-store' });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        lastPage = extractLastPageFromDoc(doc);
      }
    } catch (e) {
      if (isNewsListPath(location.pathname)) lastPage = extractLastPageFromDoc(document);
      else lastPage = 1;
    }

    for (let page = 2; page <= lastPage; page += 1) {
      const parsed = currentListPage === page ? parsePage(document, location.href || buildPageUrl(page, baseUrl)) : await fetchPage(page, baseUrl);
      if (!parsed.ok) return parsed;
      mergeParsedPage(parsed);
    }

    excludedIds.forEach((id) => {
      if (id && Object.prototype.hasOwnProperty.call(allItems, id)) delete allItems[id];
    });

    return { ok: true, items: allItems, excludedIds: Array.from(excludedIds), pagesRead, lastPage };
  }

  function buildInitialEvents(nextItems) {
    const next = nextItems || {};
    return Object.keys(next)
      .map((id) => {
        const current = next[id];
        if (!current) return null;
        return {
          type: 'initial',
          id,
          statusKey: current.statusKey,
          fromStatusKey: '',
          toStatusKey: current.statusKey,
          title: current.title || lookupCurrentDomMetaById(id).title || '',
          author: current.author || lookupCurrentDomMetaById(id).author || '',
          changerUsername: current.changerUsername || '',
          editUrl: current.editUrl,
          reviewUrl: current.reviewUrl,
          sortTime: current.sortTime || 0
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if ((b.sortTime || 0) !== (a.sortTime || 0)) return (b.sortTime || 0) - (a.sortTime || 0);
        return Number(b.id || 0) - Number(a.id || 0);
      });
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
          type: 'status-change',
          id,
          statusKey: current.statusKey,
          fromStatusKey: '',
          toStatusKey: current.statusKey,
          title: current.title || lookupCurrentDomMetaById(id).title || '',
          author: current.author || lookupCurrentDomMetaById(id).author || '',
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
          title: current.title || previous.title || lookupCurrentDomMetaById(id).title || '',
          author: current.author || previous.author || lookupCurrentDomMetaById(id).author || '',
          // Do not carry over the previous status owner's username into a new status-change event.
          // The changer username must be resolved for the current target status only.
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
    try {
      recentToastEvents.forEach((expiry, key) => {
        if (!expiry || expiry <= now) recentToastEvents.delete(key);
      });
      while (shownToastEvents.size > SHOWN_TOAST_MAX_ENTRIES) {
        const firstKey = shownToastEvents.values().next().value;
        if (!firstKey) break;
        shownToastEvents.delete(firstKey);
      }
    } catch (e) {}
  }

  function wasToastShownRecently(event) {
    const key = eventFingerprint(event);
    if (!key) return false;
    const now = Date.now();
    pruneRecentToastEvents(now);
    if (shownToastEvents.has(key)) return true;
    const expiry = Number(recentToastEvents.get(key) || 0);
    return !!(expiry && expiry > now);
  }

  function rememberToastEvent(event) {
    const key = eventFingerprint(event);
    if (!key) return;
    const expiry = Date.now() + Math.max(1000, TOAST_EVENT_DEDUP_MS || 0);
    recentToastEvents.set(key, expiry);
    shownToastEvents.add(key);
    persistShownToastEvents();
    pruneRecentToastEvents();
  }


  function isPageVisibleForToast() {
    try {
      if (document.visibilityState && document.visibilityState !== 'visible') return false;
      // Do not require document.hasFocus() here.
      // CMS dialogs, bridge requests, or quick focus shifts can temporarily report false
      // and cause legitimate local status toasts to be dropped entirely.
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

  function markToastDisplay(event) {
    return new Promise((resolve) => {
      const dedupeKey = eventFingerprint(event);
      if (!dedupeKey) return resolve(false);
      try {
        chrome.runtime.sendMessage({
          type: 'AGO_MARK_NOTIFICATION_DISPLAY',
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


  async function resolveCompletedToastEvent(event, scheduleToken) {
    const startedAt = Date.now();
    const displayEvent = await prepareToastEventForDisplay(event, { requireChanger: true, mode: 'pending' });
    if (!displayEvent) return null;
    if (!displayEvent.changerUsername) return null;
    if (Date.now() - startedAt > PENDING_TOAST_MAX_WAIT_MS) return null;
    if (isStaleScheduledToastEvent(displayEvent, scheduleToken)) return null;
    return displayEvent;
  }

  async function scheduleEventToast(event, options = {}) {
    if (!notifyEnabled || !event) return false;
    if (!options.allowNonLeader && !isLeader) return false;
    const eventKey = eventFingerprint(event);
    const scheduleToken = markLatestScheduledToastEvent(event);
    if (wasToastShownRecently(event)) {
      hydrateExistingToastFromEvent(event);
      return false;
    }
    if (eventKey && pendingToastJobs.has(eventKey)) return pendingToastJobs.get(eventKey);

    const job = (async () => {
      const displayEvent = await resolveCompletedToastEvent(event, scheduleToken);
      if (!displayEvent) return false;
      if (wasToastShownRecently(displayEvent)) {
        hydrateExistingToastFromEvent(displayEvent);
        return false;
      }
      if (!isPageVisibleForToast()) return false;
      const claimed = await claimToastDisplay(displayEvent);
      if (!claimed) {
        hydrateExistingToastFromEvent(displayEvent);
        return false;
      }
      if (isStaleScheduledToastEvent(displayEvent, scheduleToken)) return false;
      showEventToast(displayEvent);
      rememberToastEvent(displayEvent);
      await markToastDisplay(displayEvent);
      return true;
    })().finally(() => {
      if (eventKey) pendingToastJobs.delete(eventKey);
    });

    if (eventKey) pendingToastJobs.set(eventKey, job);
    return job;
  }

  function ensureToastStyle() {
    if (document.getElementById(TOAST_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = TOAST_STYLE_ID;
    style.textContent = `
#${TOAST_ROOT_ID}{position:fixed;top:10px;right:10px;z-index:2147483647;display:flex;flex-direction:column;align-items:flex-end;gap:6px;pointer-events:none}
#${TOAST_ROOT_ID} .ago-mini-toast{width:min(282px,calc(100vw - 18px));position:relative;overflow:visible;pointer-events:auto;border-radius:16px;padding:0;background:transparent;box-shadow:none;color:var(--ago-toast-text,#374151);backdrop-filter:none;-webkit-backdrop-filter:none;opacity:0;transform:translateY(-8px) scale(.985);transition:opacity .14s ease,transform .14s ease}
#${TOAST_ROOT_ID} .ago-mini-toast.show{opacity:1;transform:translateY(0) scale(1)}
#${TOAST_ROOT_ID} .ago-mini-toast.hide{opacity:0;transform:translateY(-8px) scale(.985)}
#${TOAST_ROOT_ID} .ago-mini-toast__frame{position:relative;overflow:hidden;border-radius:16px;padding:8px 10px 9px;border:1px solid var(--ago-toast-border,rgba(255,255,255,.4));background:var(--ago-toast-bg,rgba(255,255,255,.72));box-shadow:0 6px 14px rgba(15,23,42,.07), inset 0 1px 0 rgba(255,255,255,.44), 0 2px 10px var(--ago-toast-shadow,rgba(15,23,42,.06));backdrop-filter:blur(12px) saturate(1.08);-webkit-backdrop-filter:blur(12px) saturate(1.08)}
#${TOAST_ROOT_ID} .ago-mini-toast__frame::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.03))}
#${TOAST_ROOT_ID} .ago-mini-toast__top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
#${TOAST_ROOT_ID} .ago-mini-toast__left{display:flex;align-items:center;gap:8px;min-width:0;max-width:calc(100% - 24px);white-space:nowrap}
#${TOAST_ROOT_ID} .ago-mini-toast__tags{display:flex;align-items:center;gap:6px;min-width:0;max-width:100%;white-space:nowrap;flex-wrap:nowrap}
#${TOAST_ROOT_ID} .ago-mini-toast__bell{font-size:22px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,.14));transform-origin:top center;animation:agoBellShake .75s ease-in-out infinite}
#${TOAST_ROOT_ID} .ago-mini-toast__authorTag{display:inline-flex;align-items:center;max-width:100%;padding:3px 10px;border:1px solid rgba(17,24,39,.24);border-radius:999px;font:700 10px/1.1 Arial,sans-serif;letter-spacing:.01em;color:var(--ago-toast-text,#5b5566);background:rgba(255,255,255,.28);text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:inset 0 1px 0 rgba(255,255,255,.45);gap:5px}
#${TOAST_ROOT_ID} .ago-mini-toast__changerTag{display:inline-flex;align-items:center;max-width:100%;padding:3px 10px;border:1px solid rgba(148,163,184,.35);border-radius:999px;font:700 10px/1.1 Arial,sans-serif;letter-spacing:.01em;color:#6b7280;background:rgba(255,255,255,.68);text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:inset 0 1px 0 rgba(255,255,255,.75);gap:5px}
#${TOAST_ROOT_ID} .ago-mini-toast__changerTag[hidden]{display:none !important}
#${TOAST_ROOT_ID} .ago-mini-toast__authorTag::before{content:"🖊️";display:inline-block;animation:agoSwingLR 1.6s ease-in-out infinite;transform-origin:50% 50%}
#${TOAST_ROOT_ID} .ago-mini-toast__changerTag::before{content:"👤";display:inline-block;animation:agoSwingLR 1.2s ease-in-out infinite;transform-origin:50% 50%}
@keyframes agoSwingLR{0%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}100%{transform:rotate(-12deg)}}
#${TOAST_ROOT_ID} .ago-mini-toast__close{position:relative;z-index:1;appearance:none;border:none;background:transparent;color:#ef4444;font:700 14px/1 Arial,sans-serif;cursor:pointer;padding:0 2px;opacity:.95;text-shadow:none;margin-left:6px}
#${TOAST_ROOT_ID} .ago-mini-toast__close:hover{transform:scale(1.08)}
#${TOAST_ROOT_ID} .ago-mini-toast__content{position:relative;z-index:1;display:block;min-height:0;padding:4px 6px 2px;font:700 12px/1.35 Arial,sans-serif;color:var(--ago-toast-text,#5a5561);text-align:center;word-break:break-word}
@keyframes agoBellShake{0%,100%{transform:rotate(0deg)}20%{transform:rotate(-16deg)}40%{transform:rotate(14deg)}60%{transform:rotate(-10deg)}80%{transform:rotate(8deg)}}
@media (max-width:640px){#${TOAST_ROOT_ID}{top:6px;right:6px;left:auto}#${TOAST_ROOT_ID} .ago-mini-toast{width:min(264px,calc(100vw - 12px))}}    `;
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


  function isGenericCmsTitle(value) {
    const folded = foldText(value);
    return !folded || folded === 'bao an giang cms' || folded === 'cms status';
  }

  function buildReadableToastTexts(event) {
    const rawAuthor = normalizeText(event?.author || '');
    const rawChanger = formatUsername(event?.changerUsername || '');
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
    hydrateToastChangerUsername(toast, event);
    while (root.children.length > MAX_EVENT_TOASTS) {
      root.removeChild(root.firstElementChild);
    }
    requestAnimationFrame(() => toast.classList.add('show'));
  }

  async function writeSnapshot(result, source) {
    const now = Date.now();
    const state = await storageGet([STORAGE_KEY, META_KEY, ITEMS_KEY]);
    const prevCounts = state[STORAGE_KEY] || null;
    const prevItems = state[ITEMS_KEY] || {};
    const meta = state[META_KEY] || {};

    if (!result.ok) {
      const payload = {
        ...(prevCounts || emptyCounts()),
        updatedAt: now,
        ok: false,
        source,
        lastError: result.error || 'Khong lay duoc du lieu'
      };
      await storageSet({ [STORAGE_KEY]: payload, [SNAPSHOT_KEY]: buildSnapshotPayload(payload, prevItems || {}) });
      return;
    }

    const nextItems = { ...(result.items || {}) };
    const excludedIds = new Set(Array.isArray(result.excludedIds) ? result.excludedIds.map((id) => String(id || '').trim()).filter(Boolean) : []);
    const manualLocks = { ...((meta && meta.manualLocks) || {}) };
    const missingGrace = { ...((meta && meta.missingGrace) || {}) };

    Object.keys(nextItems).forEach((id) => {
      const current = nextItems[id] || {};
      const previous = prevItems[id] || {};
      let mergedStatusKey = current.statusKey || previous.statusKey || '';
      const prevMetaLock = (meta?.manualLocks || {})[id] || null;
      if (prevMetaLock && Number(prevMetaLock.until || 0) > now) {
        mergedStatusKey = preferLockedStatus(prevMetaLock.statusKey || previous.statusKey || '', mergedStatusKey);
      }
      const nextStatusKey = String(mergedStatusKey || '').trim();
      const prevStatusKey = String(previous.statusKey || '').trim();
      const statusChanged = !!(nextStatusKey && prevStatusKey && nextStatusKey !== prevStatusKey);
      const currentChanger = normalizeText(current.changerUsername || '');
      const previousChanger = normalizeText(previous.changerUsername || '');
      nextItems[id] = {
        ...previous,
        ...current,
        id,
        title: current.title || previous.title || '',
        author: current.author || previous.author || '',
        editUrl: current.editUrl || previous.editUrl || '',
        reviewUrl: current.reviewUrl || previous.reviewUrl || '',
        createdAt: current.createdAt || previous.createdAt || '',
        activeAt: current.activeAt || previous.activeAt || '',
        statusKey: nextStatusKey,
        changerUsername: currentChanger || (statusChanged ? '' : previousChanger),
        isQc: Boolean(current.isQc || previous.isQc),
        scheduledEnabled: current.scheduledEnabled === true ? true : (current.scheduledEnabled === false ? false : Boolean(previous.scheduledEnabled)),
        scheduledDateText: current.scheduledDateText != null ? normalizeText(current.scheduledDateText || '') : normalizeText(previous.scheduledDateText || ''),
        sortTime: Math.max(Number(current.sortTime || 0), Number(previous.sortTime || 0))
      };
    });

    Object.keys(nextItems).forEach((id) => {
      if (excludedIds.has(String(id))) delete nextItems[id];
    });

    Object.keys(manualLocks).forEach((id) => {
      const lock = manualLocks[id];
      if (excludedIds.has(String(id))) {
        delete manualLocks[id];
        return;
      }
      if (!lock || Number(lock.until || 0) <= now) delete manualLocks[id];
    });
    Object.keys(missingGrace).forEach((id) => {
      const grace = missingGrace[id];
      if (excludedIds.has(String(id))) {
        delete missingGrace[id];
        return;
      }
      if (!grace || Number(grace.until || 0) <= now) delete missingGrace[id];
    });

    const missingVerifyIds = Object.keys(prevItems).filter((id) => {
      if (excludedIds.has(String(id))) return false;
      if (nextItems[id]) return false;
      const previous = prevItems[id];
      return !!(previous && ['choBienTap', 'kyThuat', 'daBienTapB1', 'daBienTapB2'].includes(previous.statusKey));
    });

    const missingVerifyResults = new Map(
      await Promise.all(
        missingVerifyIds.map(async (id) => {
          const resolvedStatusKey = await resolveCurrentStatusFromHistoryWithTimeout(id, 450);
          return [id, resolvedStatusKey || ''];
        })
      )
    );

    for (const id of Object.keys(prevItems)) {
      if (excludedIds.has(String(id))) {
        delete missingGrace[id];
        delete manualLocks[id];
        continue;
      }
      if (nextItems[id]) {
        delete missingGrace[id];
        continue;
      }
      const previous = prevItems[id];
      if (!previous || !['choBienTap', 'kyThuat', 'daBienTapB1', 'daBienTapB2', 'xuatBan', 'haTin', 'xoaTam'].includes(previous.statusKey)) continue;

      const existingGrace = missingGrace[id] || null;
      const graceUntil = Number(existingGrace?.until || 0);
      const shouldVerifyMissing = ['choBienTap', 'kyThuat', 'daBienTapB1', 'daBienTapB2'].includes(previous.statusKey);
      const resolvedStatusKey = shouldVerifyMissing ? String(missingVerifyResults.get(id) || '') : '';

      if (resolvedStatusKey && resolvedStatusKey !== previous.statusKey) {
        const lock = manualLocks[id] || null;
        const lockAlive = !!(lock && Number(lock.until || 0) > now);
        const lockedStatusKey = String(lock?.statusKey || previous.statusKey || '').trim();
        const stableStatusKey = preferLockedStatus(lockedStatusKey, resolvedStatusKey);

        if (lockAlive) {
          nextItems[id] = {
            ...previous,
            statusKey: stableStatusKey || lockedStatusKey || resolvedStatusKey,
            sortTime: Math.max(Number(previous.sortTime || 0), now - 1)
          };
          if (stableStatusKey && stableStatusKey !== lockedStatusKey) {
            manualLocks[id] = { ...lock, statusKey: stableStatusKey };
          }
          delete missingGrace[id];
          continue;
        }

        if (emptyCounts()[resolvedStatusKey] != null) {
          nextItems[id] = {
            ...previous,
            statusKey: resolvedStatusKey,
            sortTime: Math.max(Number(previous.sortTime || 0), now - 1)
          };
          delete missingGrace[id];
          continue;
        }

        delete missingGrace[id];
        delete manualLocks[id];
        continue;
      }

      if (graceUntil > now) {
        nextItems[id] = {
          ...(existingGrace?.item || previous),
          sortTime: Math.max(Number((existingGrace?.item || previous)?.sortTime || 0), now - 1)
        };
        continue;
      }

      if (!existingGrace) {
        missingGrace[id] = { until: now + MISSING_ITEM_GRACE_MS, item: { ...previous } };
        nextItems[id] = { ...previous, sortTime: Math.max(Number(previous.sortTime || 0), now - 1) };
        continue;
      }

      delete missingGrace[id];
    }

    Object.keys(manualLocks).forEach((id) => {
      const lock = manualLocks[id];
      if (!lock) return;
      const previous = prevItems[id] || {};
      const current = nextItems[id] || previous;
      if (!current) return;
      const mergedStatusKey = preferLockedStatus(lock.statusKey || previous.statusKey || '', current.statusKey || previous.statusKey || '');
      nextItems[id] = {
        ...previous,
        ...current,
        id,
        title: current.title || previous.title || '',
        author: current.author || previous.author || '',
        editUrl: current.editUrl || previous.editUrl || '',
        reviewUrl: current.reviewUrl || previous.reviewUrl || '',
        createdAt: current.createdAt || previous.createdAt || '',
        activeAt: current.activeAt || previous.activeAt || '',
        statusKey: mergedStatusKey,
        isQc: Boolean(current.isQc || previous.isQc),
        sortTime: Math.max(Number(current.sortTime || 0), Number(previous.sortTime || 0), now)
      };
    });

    Object.keys(nextItems).forEach((id) => {
      const item = nextItems[id];
      if (!item || typeof item !== 'object') return;
      if (!shouldSkipScheduledRow({
        enabled: Boolean(item.scheduledEnabled),
        dateText: normalizeText(item.scheduledDateText || '')
      }, todayPrefix())) return;
      delete nextItems[id];
      delete manualLocks[id];
      delete missingGrace[id];
    });

    const finalCounts = countsFromItems(nextItems);

    const payload = {
      ...finalCounts,
      updatedAt: now,
      ok: true,
      source,
      lastError: ''
    };

    await storageSet({ [STORAGE_KEY]: payload, [ITEMS_KEY]: nextItems, [SNAPSHOT_KEY]: buildSnapshotPayload(payload, nextItems), [META_KEY]: { ...(meta || {}), lockUntil: Math.max(Number(meta.lockUntil || 0), now), manualLocks, missingGrace } });

  }

  async function refreshNow(reason) {
    if (!isLeader) return;
    if (refreshing) {
      queued = true;
      return;
    }
    refreshing = true;
    try {
      const result = await collectTodayItems();
      await writeSnapshot(result, `daily-pages:${reason || 'poll'}`);
    } catch (e) {
      await writeSnapshot({ ok: false, error: e.message || String(e) }, `daily-pages:${reason || 'poll'}`);
    } finally {
      refreshing = false;
      if (queued) {
        queued = false;
        refreshNow('queued');
      }
    }
  }

  function scheduleRefresh(delay, reason) {
    window.setTimeout(() => refreshNow(reason), delay);
  }

  function rememberRecentUserAction(newsId, statusKey, source) {
    recentUserAction = {
      newsId: String(newsId || ''),
      statusKey: String(statusKey || ''),
      at: Date.now(),
      source: String(source || '')
    };
  }

  function reconcileRecentUserAction(newsId, statusKey) {
    const id = String(newsId || '');
    const key = String(statusKey || '');
    if (!id || !key) return key;
    const recent = recentUserAction || {};
    const age = Date.now() - Number(recent.at || 0);
    if (!recent.newsId || recent.newsId !== id || age > 1800) return key;
    const toggleStatusKeys = new Set(['xuatBan', 'haTin']);
    if (toggleStatusKeys.has(key) && toggleStatusKeys.has(String(recent.statusKey || '')) && String(recent.statusKey || '') !== key) {
      return String(recent.statusKey || key);
    }
    return key;
  }

  function markImmediateSignal(newsId, statusKey) {
    lastImmediateSignal = { newsId: String(newsId || ''), statusKey: String(statusKey || ''), at: Date.now() };
  }

  function shouldSkipImmediateSignal(newsId, statusKey) {
    const key = String(statusKey || '');
    const id = String(newsId || '');
    if (!key) return true;
    return lastImmediateSignal.newsId === id && lastImmediateSignal.statusKey === key && (Date.now() - Number(lastImmediateSignal.at || 0)) < 1200;
  }

  function scheduleFastRefresh(reason, delay = FAST_REFRESH_DEBOUNCE_MS) {
    const now = Date.now();
    const remainingCooldown = Math.max(0, FAST_REFRESH_COOLDOWN_MS - (now - lastFastRefreshAt));
    const finalDelay = Math.max(delay, remainingCooldown);
    if (fastRefreshTimer) window.clearTimeout(fastRefreshTimer);
    fastRefreshTimer = window.setTimeout(() => {
      fastRefreshTimer = 0;
      lastFastRefreshAt = Date.now();
      if (isLeader) refreshNow(reason || 'fast-signal');
      else requestLeaderRefresh(reason || 'fast-signal');
    }, finalDelay);
  }

  function installDomObserver() {
    const start = () => {
      const target = document.body || document.documentElement;
      if (!target || target.__agoDomObserved) return;
      target.__agoDomObserved = true;
      try {
        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              if ((mutation.addedNodes && mutation.addedNodes.length) || (mutation.removedNodes && mutation.removedNodes.length)) {
                scheduleFastRefresh('dom-mutation', 80);
                return;
              }
            }
            if (mutation.type === 'attributes') {
              scheduleFastRefresh('dom-attr', 80);
              return;
            }
          }
        });
        observer.observe(target, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style', 'value', 'data-status', 'data-id']
        });
      } catch (e) {}
    };

    if (document.body) start();
    else window.addEventListener('DOMContentLoaded', start, { once: true });
  }

  function installPageRequestBridge() {
    if (window.__AGO_CRM_BRIDGE_INSTALLED__) return;
    window.__AGO_CRM_BRIDGE_INSTALLED__ = true;

    window.addEventListener('message', (event) => {
      try {
        if (event.source !== window) return;
        const data = event.data || {};
        if (data.type !== PAGE_SIGNAL_EVENT) return;
        scheduleFastRefresh(`page:${data.reason || 'request'}`, 50);
      } catch (e) {}
    });

    try {
      if (!document.querySelector('script[data-ago-crm-bridge="1"]')) {
        const script = document.createElement('script');
        script.dataset.agoCrmBridge = '1';
        script.src = chrome.runtime.getURL('content/crm-page-request-bridge.js');
        script.async = false;
        (document.documentElement || document.head).appendChild(script);
      }
    } catch (e) {}
  }

  function bindRealtimeSignals() {
    installDomObserver();
    installPageRequestBridge();
    window.addEventListener('focus', () => scheduleFastRefresh('window-focus', 30), true);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') scheduleFastRefresh('tab-visible', 30);
    }, true);
    document.addEventListener('click', () => scheduleFastRefresh('user-click', 90), true);
    document.addEventListener('submit', () => scheduleFastRefresh('form-submit', 30), true);
  }

  function getCurrentPageTitle() {
    const selectors = [
      '#strTitle',
      'input[name="strTitle"]',
      '#title',
      'input[name="title"]',
      'input[name="news_title"]',
      '#txtTitle',
      'input[name="txtTitle"]',
      'textarea[name="txtTitle"]',
      'textarea[name="strTitle"]'
    ];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const value = normalizeText(el && 'value' in el ? el.value : el?.textContent || '');
      if (value) return value;
    }
    const pageTitle = normalizeText(document.title || '');
    return isGenericCmsTitle(pageTitle) ? '' : pageTitle;
  }

  function getCurrentPageAuthor() {
    const selectors = [
      '#news_authornb',
      'input[name="news_authornb"]',
      'input[name^="news_authornb"]',
      '#author',
      'input[name="author"]',
      'input[name="txtAuthor"]'
    ];
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      const value = normalizeText(el && 'value' in el ? el.value : el?.textContent || '');
      if (value) return value;
    }
    return '';
  }

  function getReviewUrlForItem(itemId, knownItem) {
    if (knownItem?.reviewUrl) return knownItem.reviewUrl;
    const previewLink = document.querySelector('a[href*="mahoatin"], a[target="_blank"] img[alt="Xem"]')?.closest?.('a');
    const href = previewLink?.getAttribute('href') || '';
    const abs = tryMakeAbsoluteUrl(href);
    if (abs) return abs;
    if (/^\d+$/.test(String(itemId || ''))) {
      return `https://crmag.baoangiang.com.vn/weblink/mahoatin?id=${encodeURIComponent(String(itemId))}`;
    }
    return '';
  }

  function markRecentLocalToastContext(newsId, statusKey) {
    recentLocalToastContext = {
      newsId: normalizeText(newsId || ''),
      statusKey: normalizeText(statusKey || ''),
      until: Date.now() + LOCAL_STORAGE_TOAST_SUPPRESS_MS
    };
  }

  function shouldSuppressStorageToastEvent(event) {
    const now = Date.now();
    if (!recentLocalToastContext.until || recentLocalToastContext.until <= now) return false;
    const eventId = normalizeText(event?.id || '');
    const eventStatusKey = normalizeText(event?.toStatusKey || event?.statusKey || '');
    if (!eventId) return true;
    if (eventId === recentLocalToastContext.newsId) return true;
    if (eventStatusKey && eventStatusKey === recentLocalToastContext.statusKey) return true;
    return true;
  }

  async function emitImmediateStatusToast(statusKey, explicitNewsId, metaOverride, previousStatusKey = '') {
    if (!statusKey) return;
    if (!notifyEnabled && !(await canNotify())) return;
    const newsId = explicitNewsId || currentNewsId() || `tmp-${Date.now()}`;
    markImmediateSignal(newsId, statusKey);
    try { historyHtmlCache.delete(String(newsId || '')); } catch (e) {}
    const domMeta = { ...lookupCurrentDomMetaById(newsId), ...(metaOverride || {}) };
    const event = {
      type: 'status-change',
      id: newsId,
      statusKey,
      fromStatusKey: normalizeText(previousStatusKey || ''),
      toStatusKey: statusKey,
      title: domMeta.title || getCurrentPageTitle() || '',
      author: domMeta.author || getCurrentPageAuthor() || '',
      editUrl: domMeta.editUrl || (currentNewsId() ? location.href : ''),
      reviewUrl: domMeta.reviewUrl || '',
      sortTime: Date.now(),
      changerUsername: normalizeText(domMeta.changerUsername || '')
    };

    if (!isPageVisibleForToast()) return;
    await scheduleEventToast(event, {
      allowNonLeader: true
    });
  }


  function statusKeyFromText(value) {
    const text = foldText(value || '');
    if (!text) return null;
    if (text.includes('cho bien tap') || text === 'luu') return 'choBienTap';
    if (text.includes('ky thuat')) return 'kyThuat';
    if (text.includes('da bien tap b1') || text.includes('da bt b1') || text.includes('bien tap buoc 1') || text.includes('bien tap b1')) return 'daBienTapB1';
    if (text.includes('da bien tap b2') || text.includes('da bt b2') || text.includes('bien tap buoc 2') || text.includes('bien tap b2')) return 'daBienTapB2';
    if (text.includes('da duyet')) return 'daDuyet';
    if (text.includes('xuat ban')) return 'xuatBan';
    if (text.includes('nhap')) return 'nhap';
    if (text.includes('ha tin')) return 'haTin';
    if (text.includes('xoa tam')) return 'xoaTam';
    if (text.includes('khong duyet')) return 'khongDuyet';
    return null;
  }

  function parseStatusActionFromOnclick(onclick, fallbackNewsId) {
    const raw = normalizeText(onclick || '');
    const fallbackId = String(fallbackNewsId || '');
    if (!raw) return { newsId: fallbackId, statusKey: null };

    let match = raw.match(/updatestatus\s*\(\s*\d+\s*,\s*(\d+)\s*,\s*(\d+)\b/i);
    if (match) {
      return {
        newsId: String(match[1] || fallbackId),
        statusKey: STATUS_CODE_TO_KEY[String(match[2] || '')] || null
      };
    }

    match = raw.match(/checkAdd\s*\(\s*['"]edit['"]\s*,\s*(\d+)\s*\)/i);
    if (match) {
      return {
        newsId: fallbackId,
        statusKey: STATUS_CODE_TO_KEY[String(match[1] || '')] || null
      };
    }

    const numberTokens = Array.from(raw.matchAll(/\b(\d+)\b/g)).map((entry) => String(entry[1] || ''));
    const numericId = numberTokens.find((value) => /^\d{3,}$/.test(value)) || fallbackId;
    for (let i = numberTokens.length - 1; i >= 0; i -= 1) {
      const mapped = STATUS_CODE_TO_KEY[numberTokens[i]] || null;
      if (mapped) return { newsId: String(numericId || fallbackId), statusKey: mapped };
    }

    return { newsId: String(numericId || fallbackId), statusKey: null };
  }

  function statusKeyFromButton(btn) {
    if (!btn) return null;

    const onclick = normalizeText(btn.getAttribute('onclick') || '');
    const parsedOnclick = parseStatusActionFromOnclick(onclick, currentNewsId(btn));
    if (parsedOnclick.statusKey) return parsedOnclick.statusKey;

    const textCandidates = [
      btn.textContent || '',
      btn.value || '',
      btn.getAttribute('title') || '',
      btn.getAttribute('aria-label') || '',
      btn.getAttribute('data-original-title') || '',
      btn.querySelector?.('img')?.getAttribute?.('alt') || ''
    ];
    for (const candidate of textCandidates) {
      const byText = statusKeyFromText(candidate);
      if (byText) return byText;
    }

    return null;
  }

  function currentNewsId(btn) {
    try {
      const trigger = btn && btn.closest ? btn.closest('tr') : null;
      const rowId = trigger?.querySelector('input[type="checkbox"][name="uid"]')?.value || '';
      if (/^\d+$/.test(String(rowId || ''))) return String(rowId);
    } catch (e) {}
    try {
      const url = new URL(location.href);
      return url.searchParams.get('intResult') || url.searchParams.get('id') || null;
    } catch (e) {
      return null;
    }
  }

  function extractActionStatusFromButton(btn) {
    const fallbackNewsId = currentNewsId(btn);
    if (!btn) return { newsId: fallbackNewsId, statusKey: null };
    const onclick = normalizeText(btn.getAttribute('onclick') || '');
    const parsedOnclick = parseStatusActionFromOnclick(onclick, fallbackNewsId);
    if (parsedOnclick.statusKey) return parsedOnclick;
    return {
      newsId: parsedOnclick.newsId || fallbackNewsId,
      statusKey: statusKeyFromButton(btn)
    };
  }



  async function applyOptimisticStatus(statusKey, explicitNewsId, metaOverride) {
    const newsId = explicitNewsId || currentNewsId();
    if (!newsId || !statusKey) return null;
    const now = Date.now();
    const state = await storageGet([STORAGE_KEY, META_KEY, ITEMS_KEY]);
    const items = { ...(state[ITEMS_KEY] || {}) };
    const counts = state[STORAGE_KEY] || emptyCounts();
    const domMeta = { ...lookupCurrentDomMetaById(newsId), ...(metaOverride || {}) };
    const existing = items[newsId] || {
      id: newsId,
      createdAt: '',
      title: domMeta.title || getCurrentPageTitle(),
      author: domMeta.author || getCurrentPageAuthor(),
      editUrl: domMeta.editUrl || location.href,
      reviewUrl: domMeta.reviewUrl || getReviewUrlForItem(newsId, null),
      sortTime: now,
      statusKey: '',
      isQc: Boolean(domMeta.isQc),
      scheduledEnabled: Boolean(domMeta.scheduledEnabled),
      scheduledDateText: normalizeText(domMeta.scheduledDateText || '')
    };
    if (existing.statusKey === statusKey) {
      return {
        newsId,
        previousStatusKey: normalizeText(existing.statusKey || ''),
        item: existing,
        changed: false
      };
    }
    items[newsId] = {
      ...existing,
      title: domMeta.title || getCurrentPageTitle() || existing.title || '',
      author: domMeta.author || getCurrentPageAuthor() || existing.author || '',
      editUrl: domMeta.editUrl || existing.editUrl || location.href,
      reviewUrl: domMeta.reviewUrl || existing.reviewUrl || getReviewUrlForItem(newsId, existing),
      sortTime: now,
      statusKey,
      isQc: Boolean(domMeta.isQc || existing.isQc),
      scheduledEnabled: domMeta.scheduledEnabled === true ? true : (domMeta.scheduledEnabled === false ? false : Boolean(existing.scheduledEnabled)),
      scheduledDateText: domMeta.scheduledDateText != null ? normalizeText(domMeta.scheduledDateText || '') : normalizeText(existing.scheduledDateText || '')
    };
    const nextCounts = countsFromItems(items);
    const payload = {
      ...nextCounts,
      updatedAt: now,
      ok: true,
      source: 'optimistic-click',
      lastError: ''
    };
    const nextMeta = { ...(state[META_KEY] || {}) };
    const manualLocks = { ...(nextMeta.manualLocks || {}) };
    manualLocks[newsId] = { statusKey, until: now + MANUAL_LOCK_MS };
    nextMeta.lockUntil = now + MANUAL_LOCK_MS;
    nextMeta.manualLocks = manualLocks;
    await storageSet({ [ITEMS_KEY]: items, [STORAGE_KEY]: payload, [SNAPSHOT_KEY]: buildSnapshotPayload(payload, items), [META_KEY]: nextMeta });
    return {
      newsId,
      previousStatusKey: normalizeText(existing.statusKey || ''),
      item: items[newsId],
      changed: true
    };
  }


  async function handleImmediateStatus(statusKey, explicitNewsId, metaOverride) {
    const newsId = explicitNewsId || currentNewsId();
    const resolvedStatusKey = reconcileRecentUserAction(newsId, statusKey);
    if (!resolvedStatusKey || shouldSkipImmediateSignal(newsId, resolvedStatusKey)) return;
    let optimisticResult = null;
    try {
      optimisticResult = await applyOptimisticStatus(resolvedStatusKey, newsId, metaOverride);
    } catch (e) {}
    markImmediateSignal(newsId, resolvedStatusKey);
    markRecentLocalToastContext(newsId, resolvedStatusKey);
    try {
      await emitImmediateStatusToast(
        resolvedStatusKey,
        newsId,
        {
          ...(metaOverride || {}),
          ...(optimisticResult?.item || {})
        },
        optimisticResult?.previousStatusKey || ''
      );
    } catch (e) {}
    requestLeaderRefresh(`status-click:${resolvedStatusKey}`);
    [250, 1200].forEach((ms) => scheduleRefresh(ms, 'status-click'));
  }

  function bindUpdateStatusHook() {
    const install = () => {
      const original = window.updatestatus;
      if (typeof original !== 'function' || original.__agoWrapped) return false;
      const wrapped = function() {
        let derivedNewsId = currentNewsId();
        let derivedStatusKey = null;
        try {
          const args = Array.from(arguments || []);
          const numericArgs = args.map((value) => normalizeText(value)).filter((value) => /^\d+$/.test(value));
          const idCandidate = numericArgs.find((value) => /^\d{3,}$/.test(value));
          if (idCandidate) derivedNewsId = idCandidate;
          for (let i = numericArgs.length - 1; i >= 0; i -= 1) {
            const mapped = STATUS_CODE_TO_KEY[numericArgs[i]] || null;
            if (mapped) {
              derivedStatusKey = mapped;
              break;
            }
          }
        } catch (e) {}

        const result = original.apply(this, arguments);

        try {
          if (derivedStatusKey) {
            derivedStatusKey = reconcileRecentUserAction(derivedNewsId, derivedStatusKey);
            void handleImmediateStatus(derivedStatusKey, derivedNewsId);
          } else {
            requestLeaderRefresh('status-click:updatestatus');
            [250, 1200].forEach((ms) => scheduleRefresh(ms, 'status-click'));
          }
        } catch (e) {}

        return result;
      };
      wrapped.__agoWrapped = true;
      wrapped.__agoOriginal = original;
      window.updatestatus = wrapped;
      return true;
    };

    if (install()) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (install() || tries > 40) window.clearInterval(timer);
    }, 500);
  }

  function bindCheckAddHook() {
    const install = () => {
      const original = window.checkAdd;
      if (typeof original !== 'function' || original.__agoWrapped) return false;
      const wrapped = function() {
        try {
          if (arguments[0] === 'edit') {
            const code = String(arguments[1] ?? '');
            const statusKey = STATUS_CODE_TO_KEY[code] || null;
            const newsId = currentNewsId();
            const reconciledStatusKey = reconcileRecentUserAction(newsId, statusKey);
            if (reconciledStatusKey) handleImmediateStatus(reconciledStatusKey, newsId);
          }
        } catch (e) {}
        return original.apply(this, arguments);
      };
      wrapped.__agoWrapped = true;
      wrapped.__agoOriginal = original;
      window.checkAdd = wrapped;
      return true;
    };

    if (install()) return;
    let tries = 0;
    const timer = window.setInterval(() => {
      tries += 1;
      if (install() || tries > 40) window.clearInterval(timer);
    }, 500);
  }

  function bindButtonRefresh() {
    document.addEventListener('click', async (e) => {
      const btn = e.target && e.target.closest ? e.target.closest('a,button,input[type="button"],input[type="submit"]') : null;
      if (!btn) return;
      const action = extractActionStatusFromButton(btn);
      const rawStatusKey = action.statusKey || statusKeyFromButton(btn);
      if (!rawStatusKey) return;
      const newsId = action.newsId || currentNewsId(btn);
      rememberRecentUserAction(newsId, rawStatusKey, 'button-click');
      const statusKey = reconcileRecentUserAction(newsId, rawStatusKey);
      const domMeta = newsId ? lookupCurrentDomMetaById(newsId) : {};
      await handleImmediateStatus(statusKey, newsId, domMeta);
    }, true);
  }





  async function sanitizeScheduledItemsFromVisibleRows(reason = "dom-sanitize") {
    if (!isNewsListPath(location.pathname)) return false;
    const rows = Array.from(document.querySelectorAll('input[type="checkbox"][name="uid"][value]')).map((el) => el.closest?.('tr')).filter(Boolean);
    if (!rows.length) return false;

    const state = await storageGet([STORAGE_KEY, ITEMS_KEY, META_KEY]);
    const items = { ...(state[ITEMS_KEY] || {}) };
    let changed = false;
    const targetPrefix = todayPrefix();
    const excludedIds = new Set();

    rows.forEach((row) => {
      const id = normalizeText(row?.querySelector?.('input[type="checkbox"][name="uid"]')?.value || '');
      if (!id) return;
      const cells = Array.from(row.querySelectorAll('td'));
      const autoMeta = extractAutoScheduleMeta(cells[10] || null);

      if (shouldSkipScheduledRow(autoMeta, targetPrefix)) {
        excludedIds.add(id);
        if (items[id]) {
          delete items[id];
          changed = true;
        }
        return;
      }

      if (!items[id]) return;
      const nextEnabled = Boolean(autoMeta?.enabled);
      const nextDateText = normalizeText(autoMeta?.dateText || '');
      if (items[id].scheduledEnabled !== nextEnabled || normalizeText(items[id].scheduledDateText || '') !== nextDateText) {
        items[id] = {
          ...items[id],
          scheduledEnabled: nextEnabled,
          scheduledDateText: nextDateText
        };
        changed = true;
      }
    });

    Object.keys(items).forEach((id) => {
      if (!excludedIds.has(id)) return;
      delete items[id];
      changed = true;
    });

    if (!changed) return false;

    const counts = countsFromItems(items);
    const prevMeta = state[META_KEY] || {};
    const nextMeta = { ...prevMeta };
    if (nextMeta.manualLocks && typeof nextMeta.manualLocks === 'object') {
      Object.keys(nextMeta.manualLocks).forEach((id) => { if (!items[id]) delete nextMeta.manualLocks[id]; });
    }
    if (nextMeta.missingGrace && typeof nextMeta.missingGrace === 'object') {
      Object.keys(nextMeta.missingGrace).forEach((id) => { if (!items[id]) delete nextMeta.missingGrace[id]; });
    }
    await storageSet({
      [ITEMS_KEY]: items,
      [STORAGE_KEY]: {
        ...emptyCounts(),
        ...(state[STORAGE_KEY] || {}),
        ...counts,
        updatedAt: Date.now(),
        ok: true,
        source: reason,
        lastError: ''
      },
      [META_KEY]: nextMeta
    });
    return true;
  }

  function broadcastRealtimeToastEvent(event, options = {}) {
    return false;
  }

  function bindRealtimeToastEvents() {
    try {
      chrome.runtime.onMessage.addListener((message) => {
        if (!message || message.type !== 'AGO_PUSH_TOAST_EVENT' || !message.event) return;
        void scheduleEventToast(message.event, {
          allowNonLeader: true
        });
      });
    } catch (e) {}
  }

  function bindStorageDrivenNotifications() {
    return;
  }


  function init() {
    loadShownToastEvents();
    bindCheckAddHook();
    bindUpdateStatusHook();
    bindButtonRefresh();
    bindStorageDrivenNotifications();
    bindRealtimeToastEvents();
    bindRealtimeSignals();
    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local') return;
        if (Object.prototype.hasOwnProperty.call(changes, NOTIFY_KEY)) {
          notifyEnabled = changes[NOTIFY_KEY].newValue !== false;
        }
        if (Object.prototype.hasOwnProperty.call(changes, LEADER_KEY)) {
          const nextLeader = changes[LEADER_KEY]?.newValue || null;
          const mine = nextLeader && nextLeader.ownerId === leaderOwnerId;
          if (!mine && isLeader && nextLeader && nextLeader.ownerId) {
            isLeader = false;
          }
        }
      });
    } catch (e) {}

    ensureLeaderTimers();
    claimLeader(false).finally(() => {
      canNotify().finally(() => {
        if (isLeader) refreshNow('init');
        window.setTimeout(() => { void sanitizeScheduledItemsFromVisibleRows('dom-sanitize:init'); }, 250);
        window.setTimeout(() => { void sanitizeScheduledItemsFromVisibleRows('dom-sanitize:init-late'); }, 1500);
      });
    });
    window.setInterval(() => {
      if (isLeader) refreshNow('poll');
      void sanitizeScheduledItemsFromVisibleRows('dom-sanitize:poll');
    }, POLL_MS);
    try {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (!message) return;
        if (message.type === 'AGO_REQUEST_CRM_REFRESH') {
          if (isLeader) refreshNow('external-request');
          return;
        }
        if (message.type === 'AGO_RESOLVE_TOAST_USERNAME') {
          void (async () => {
            try {
              const event = message.event && typeof message.event === 'object' ? { ...message.event } : null;
              if (!event) return sendResponse({ ok: false, changerUsername: '' });
              const existing = formatUsername(event.changerUsername || '');
              if (existing) return sendResponse({ ok: true, changerUsername: existing, event: { ...event, changerUsername: existing } });
              const username = await resolveChangerUsername(event, 'short');
              const normalizedUsername = formatUsername(username || '');
              if (normalizedUsername) {
                event.changerUsername = normalizedUsername;
                try {
                  const newsId = String(event.id || event.newsId || '').trim();
                  if (newsId) {
                    const state = await storageGet([ITEMS_KEY]);
                    const items = state[ITEMS_KEY] && typeof state[ITEMS_KEY] === 'object' ? { ...state[ITEMS_KEY] } : {};
                    if (items[newsId] && items[newsId].changerUsername !== normalizedUsername) {
                      items[newsId] = {
                        ...items[newsId],
                        changerUsername: normalizedUsername
                      };
                      await storageSet({ [ITEMS_KEY]: items });
                    }
                  }
                } catch (e) {}
              }
              sendResponse({ ok: true, changerUsername: normalizedUsername, event });
            } catch (e) {
              sendResponse({ ok: false, changerUsername: '', error: e?.message || String(e || 'resolve_failed') });
            }
          })();
          return true;
        }
      });
    } catch (e) {}
    if (isNewsListPath(location.pathname)) {
      let sanitizeTimer = 0;
      const observer = new MutationObserver(() => {
        if (sanitizeTimer) window.clearTimeout(sanitizeTimer);
        sanitizeTimer = window.setTimeout(() => {
          sanitizeTimer = 0;
          void sanitizeScheduledItemsFromVisibleRows('dom-sanitize:mutation');
        }, 180);
      });
      try { observer.observe(document.documentElement || document.body, { childList: true, subtree: true }); } catch (e) {}
      window.addEventListener('pagehide', () => { try { observer.disconnect(); } catch (e) {} }, { once: true });
    }
    window.addEventListener('pagehide', () => { releaseLeader().catch(() => {}); }, { once: true });
    window.addEventListener('beforeunload', () => { releaseLeader().catch(() => {}); }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

const STORAGE_KEY = 'ago_crm_status_counts_v10';
const ITEMS_KEY = 'ago_crm_status_items_v10';
const META_KEY = 'ago_crm_status_meta_v10';
const SNAPSHOT_KEY = 'ago_crm_status_snapshot_v1';
const NOTIFY_KEY = 'ago_widget_notify_enabled_v1';
const NOTIFICATION_REGISTRY_KEY = 'ago_notification_registry_v1';

const AGO_OPEN_DEDUP_MS = 1200;
const AGO_NEWS_INDEX_URL = 'https://crmag.baoangiang.com.vn/news/index?lang=vi';
const AGO_PENDING_RETURN_MS = 15000;
const AGO_NOTIFY_DEDUP_MS = 120000;
const AGO_NOTIFY_REGISTRY_TTL_MS = 15000;
const AGO_NOTIFY_PRUNE_MS = AGO_NOTIFY_DEDUP_MS * 3;
const AGO_NOTIFY_REGISTRY_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const STATUS_LABELS = {
  choBienTap: 'TIN CHO',
  kyThuat: 'KY THUAT',
  daBienTapB1: 'BUOC 1',
  daBienTapB2: 'BUOC 2'
};
const agoRecentNotificationKeys = new Map();
let agoLastSmartOpen = { url: '', senderTabId: -1, at: 0 };
const agoPendingReturnTabs = new Map();
const agoPendingStatusConfirms = new Map();

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

function normalizeNotificationRegistry(registry) {
  return registry && typeof registry === 'object' ? registry : {};
}

function pruneNotificationRegistryEntries(registry, now = Date.now()) {
  const normalized = normalizeNotificationRegistry(registry);
  let mutated = false;
  Object.keys(normalized).forEach((key) => {
    const entry = normalized[key] || {};
    const expiresAt = Number(entry.expiresAt || 0);
    const touchedAt = Number(entry.markedAt || entry.createdAt || 0);
    if ((expiresAt && expiresAt <= now) || (!expiresAt && touchedAt && (now - touchedAt) > AGO_NOTIFY_REGISTRY_RETENTION_MS)) {
      delete normalized[key];
      mutated = true;
    }
  });
  return { registry: normalized, mutated };
}

async function getNotificationRegistry() {
  try {
    const state = await getStore([NOTIFICATION_REGISTRY_KEY]);
    return normalizeNotificationRegistry(state[NOTIFICATION_REGISTRY_KEY]);
  } catch (e) {
    return {};
  }
}

async function saveNotificationRegistry(registry) {
  try {
    await setStore({ [NOTIFICATION_REGISTRY_KEY]: normalizeNotificationRegistry(registry) });
  } catch (e) {}
}

async function claimNotificationRegistryEntry(channel, dedupeKey, ttlMs, options = {}) {
  const normalizedChannel = String(channel || '').trim();
  const normalizedKey = String(dedupeKey || '').trim();
  const forceMark = options && options.forceMark === true;
  const ttlValue = Number(ttlMs || 0);
  const ttl = ttlValue > 0 ? Math.max(1000, ttlValue) : 0;
  if (!normalizedChannel || !normalizedKey) return { claimed: false, reason: 'missing_key' };
  const compositeKey = `${normalizedChannel}:${normalizedKey}`;
  const now = Date.now();
  const pruned = pruneNotificationRegistryEntries(await getNotificationRegistry(), now);
  const registry = pruned.registry;
  const current = registry[compositeKey];
  const isActive = !!(current && (!current.expiresAt || Number(current.expiresAt) > now));
  if (isActive && !forceMark) {
    if (pruned.mutated) await saveNotificationRegistry(registry);
    return { claimed: false, reason: 'duplicate', key: compositeKey, entry: current };
  }
  registry[compositeKey] = {
    channel: normalizedChannel,
    dedupeKey: normalizedKey,
    createdAt: Number(current?.createdAt || now),
    markedAt: now,
    expiresAt: ttl ? (now + ttl) : 0
  };
  await saveNotificationRegistry(registry);
  return { claimed: true, key: compositeKey, entry: registry[compositeKey], forced: forceMark };
}

async function markNotificationRegistryEntry(channel, dedupeKey, ttlMs) {
  return claimNotificationRegistryEntry(channel, dedupeKey, ttlMs, { forceMark: true });
}

function parseUrl(candidate, base) {
  try { return new URL(candidate, base); }
  catch (e) { return null; }
}

function isCrmUrl(candidate) {
  const url = parseUrl(candidate);
  return !!(url && /(^|\.)crmag\.baoangiang\.com\.vn$/i.test(url.hostname));
}

function normalizeCrmTargetUrl(candidate, base) {
  const url = parseUrl(candidate, base || 'https://crmag.baoangiang.com.vn/');
  if (!url || !/(^|\.)crmag\.baoangiang\.com\.vn$/i.test(url.hostname)) return '';

  const path = (url.pathname || '').toLowerCase();
  const id = String(url.searchParams.get('id') || url.searchParams.get('intResult') || '').trim();
  if (!/^\d+$/.test(id)) return '';

  if (path.includes('/news/edit') || path.includes('/updatenews/add') || path.includes('/updatenews/index') || path.includes('/news/')) {
    return `https://crmag.baoangiang.com.vn/news/edit?id=${encodeURIComponent(id)}&lang=vi`;
  }
  return '';
}

function getCrmTabKind(tabUrl) {
  const url = parseUrl(tabUrl);
  if (!url || !/(^|\.)crmag\.baoangiang\.com\.vn$/i.test(url.hostname)) return 'other';
  const path = (url.pathname || '').toLowerCase();
  if (path.includes('/news/edit')) return 'edit';
  if (path.includes('/updatenews/add')) return 'update-add';
  if (path.includes('/updatenews/index')) return 'update-index';
  if (path.includes('/news/index')) return 'news-index';
  if (path.includes('/homenews/index')) return 'home-index';
  return 'other';
}

function getCrmTabScore(tab, targetUrl) {
  const canonicalTarget = normalizeCrmTargetUrl(targetUrl);
  const canonicalTab = normalizeCrmTargetUrl(tab?.url || '');
  if (canonicalTarget && canonicalTab && canonicalTarget === canonicalTab) return 1000;

  switch (getCrmTabKind(tab?.url || '')) {
    case 'edit': return 700;
    case 'update-add': return 680;
    case 'update-index': return 520;
    case 'news-index': return 420;
    case 'home-index': return 100;
    default: return 250;
  }
}

function pickBestCrmTab(tabs, targetUrl) {
  const list = Array.isArray(tabs) ? tabs.filter((tab) => tab && tab.id >= 0) : [];
  if (!list.length) return null;
  return list
    .map((tab, index) => ({ tab, index, score: getCrmTabScore(tab, targetUrl) }))
    .sort((a, b) => (b.score - a.score) || ((b.tab.active ? 1 : 0) - (a.tab.active ? 1 : 0)) || (a.index - b.index))[0]?.tab || null;
}

function isDuplicateSmartOpen(url, senderTabId) {
  const now = Date.now();
  if (agoLastSmartOpen.url === String(url || '') && agoLastSmartOpen.senderTabId === Number(senderTabId ?? -1) && (now - agoLastSmartOpen.at) < AGO_OPEN_DEDUP_MS) {
    return true;
  }
  agoLastSmartOpen = { url: String(url || ''), senderTabId: Number(senderTabId ?? -1), at: now };
  return false;
}

function buildCrmBridgeUrl(targetUrl) {
  const canonicalTarget = normalizeCrmTargetUrl(targetUrl);
  if (!canonicalTarget) return '';
  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return chrome.runtime.getURL(`crm-bridge.html?target=${encodeURIComponent(canonicalTarget)}&token=${encodeURIComponent(token)}`);
}

function markTabPendingReturn(tabId, reason) {
  const id = Number(tabId);
  if (!(id >= 0)) return;
  agoPendingReturnTabs.set(id, { at: Date.now(), reason: String(reason || '') });
}

function clearTabPendingReturn(tabId) {
  agoPendingReturnTabs.delete(Number(tabId));
}

function hasFreshPendingReturn(tabId) {
  const entry = agoPendingReturnTabs.get(Number(tabId));
  if (!entry) return false;
  if ((Date.now() - Number(entry.at || 0)) > AGO_PENDING_RETURN_MS) {
    agoPendingReturnTabs.delete(Number(tabId));
    return false;
  }
  return true;
}

function waitForTabLoadThenNavigate(tabId, expectedPrefix, finalUrl, timeoutMs = 8000) {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok) => {
      if (done) return;
      done = true;
      try { chrome.tabs.onUpdated.removeListener(onUpdated); } catch (e) {}
      clearTimeout(timer);
      resolve(!!ok);
    };

    const onUpdated = (updatedTabId, changeInfo, tab) => {
      if (updatedTabId !== tabId) return;
      const tabUrl = String(changeInfo.url || tab?.url || '');
      const status = String(changeInfo.status || '');
      if (expectedPrefix && tabUrl && !tabUrl.startsWith(expectedPrefix)) return;
      if (status && status !== 'complete') return;
      updateTab(tabId, { url: finalUrl, active: true }).then(() => finish(true)).catch(() => finish(false));
    };

    const timer = setTimeout(() => {
      updateTab(tabId, { url: finalUrl, active: true }).then(() => finish(true)).catch(() => finish(false));
    }, timeoutMs);

    try { chrome.tabs.onUpdated.addListener(onUpdated); } catch (e) {
      clearTimeout(timer);
      resolve(false);
    }
  });
}

function queryTabs(queryInfo) {
  return new Promise((resolve) => {
    try { chrome.tabs.query(queryInfo, (tabs) => resolve(Array.isArray(tabs) ? tabs : [])); }
    catch (e) { resolve([]); }
  });
}

function updateTab(tabId, updateProperties) {
  return new Promise((resolve, reject) => {
    try { chrome.tabs.update(tabId, updateProperties, (tab) => {
      const err = chrome.runtime.lastError;
      if (err) reject(err);
      else resolve(tab || null);
    }); } catch (e) { reject(e); }
  });
}

function createTab(createProperties) {
  return new Promise((resolve, reject) => {
    try { chrome.tabs.create(createProperties, (tab) => {
      const err = chrome.runtime.lastError;
      if (err) reject(err);
      else resolve(tab || null);
    }); } catch (e) { reject(e); }
  });
}

function updateWindow(windowId, updateInfo) {
  return new Promise((resolve) => {
    if (windowId == null || !chrome.windows?.update) return resolve(null);
    try { chrome.windows.update(windowId, updateInfo, (win) => resolve(win || null)); }
    catch (e) { resolve(null); }
  });
}

async function smartOpenUrlFromMessage(message, sender) {
  const rawUrl = String(message?.url || '').trim();
  if (!rawUrl) return { ok: false, error: 'missing_url' };

  const senderResolvedUrl = sender?.url || sender?.tab?.url || undefined;
  const resolved = parseUrl(rawUrl, senderResolvedUrl);
  if (!resolved) return { ok: false, error: 'invalid_url' };

  let targetUrl = resolved.href;
  const canonicalTarget = normalizeCrmTargetUrl(targetUrl, senderResolvedUrl);
  if (canonicalTarget) targetUrl = canonicalTarget;

  const senderTabId = sender?.tab?.id ?? -1;
  if (isDuplicateSmartOpen(targetUrl, senderTabId)) return { ok: true, deduped: true, url: targetUrl };

  const senderIsCrm = isCrmUrl(senderResolvedUrl || '');
  const targetIsCrm = isCrmUrl(targetUrl);

  try {
    if (targetIsCrm) {
      const created = await createTab({ url: AGO_NEWS_INDEX_URL, active: true, openerTabId: senderTabId >= 0 ? senderTabId : undefined });
      if (created?.windowId != null) await updateWindow(created.windowId, { focused: true });
      if (created?.id >= 0) {
        await waitForTabLoadThenNavigate(created.id, AGO_NEWS_INDEX_URL, targetUrl, 6000);
      }
      return { ok: true, mode: 'crm-new-tab-created-via-history-seed', url: targetUrl, seedUrl: AGO_NEWS_INDEX_URL, tabId: created?.id ?? null };
    }

    if (senderTabId >= 0 && !senderIsCrm) {
      await updateTab(senderTabId, { url: targetUrl, active: true });
      if (sender?.tab?.windowId != null) await updateWindow(sender.tab.windowId, { focused: true });
      return { ok: true, mode: 'sender-tab-updated', url: targetUrl };
    }

    const created = await createTab({ url: targetUrl, active: true });
    if (created?.windowId != null) await updateWindow(created.windowId, { focused: true });
    return { ok: true, mode: 'new-tab-created', url: targetUrl, tabId: created?.id ?? null };
  } catch (e) {
    return { ok: false, error: e?.message || String(e || 'open_failed'), url: targetUrl };
  }
}


function pruneRecentNotificationKeys(now = Date.now()) {
  for (const [key, at] of agoRecentNotificationKeys.entries()) {
    if ((now - at) > AGO_NOTIFY_PRUNE_MS) agoRecentNotificationKeys.delete(key);
  }
}

function shouldSkipDuplicateNotification(key) {
  const normalized = String(key || '').trim();
  if (!normalized) return false;
  const now = Date.now();
  pruneRecentNotificationKeys(now);
  const lastAt = agoRecentNotificationKeys.get(normalized) || 0;
  if (lastAt && (now - lastAt) < AGO_NOTIFY_DEDUP_MS) return true;
  agoRecentNotificationKeys.set(normalized, now);
  return false;
}

function buildNewItemsNotificationKey(items) {
  const list = Array.isArray(items) ? items : [];
  const parts = list.slice(0, 3).map((item) => {
    const id = String(item?.id || '').trim();
    const status = String(item?.toStatusKey || item?.statusKey || '').trim();
    const type = String(item?.type || '').trim();
    return `${id}|${status}|${type}`;
  }).filter(Boolean);
  return parts.length ? `new:${parts.join(',')}` : '';
}

function buildStatusChangeNotificationKey(items) {
  const list = Array.isArray(items) ? items : [];
  const parts = list.slice(0, 5).map((item) => {
    const label = String(item?.label || '').trim();
    const fromValue = String(item?.from ?? '').trim();
    const toValue = String(item?.to ?? '').trim();
    return `${label}:${fromValue}->${toValue}`;
  }).filter(Boolean);
  return parts.length ? `status:${parts.join('|')}` : '';
}


function buildNotificationEvents(prevItems, nextItems) {
  const prev = prevItems && typeof prevItems === 'object' ? prevItems : {};
  const next = nextItems && typeof nextItems === 'object' ? nextItems : {};
  const events = [];

  Object.keys(next).forEach((id) => {
    const current = next[id];
    const previous = prev[id];
    if (!current || typeof current !== 'object' || !previous || typeof previous !== 'object') return;
    if (String(previous.statusKey || '').trim() === String(current.statusKey || '').trim()) return;
    events.push({
      type: 'status-change',
      id,
      title: current.title || previous.title || '',
      author: current.author || previous.author || '',
      fromStatusKey: previous.statusKey || '',
      toStatusKey: current.statusKey || '',
      sortTime: Math.max(Number(current.sortTime || 0), Number(previous.sortTime || 0))
    });
  });

  return events.sort((a, b) => (Number(b.sortTime || 0) - Number(a.sortTime || 0)) || (Number(b.id || 0) - Number(a.id || 0)));
}

function buildEventCandidateKey(event) {
  if (!event || typeof event !== 'object') return '';
  const type = String(event.type || '').trim();
  const id = String(event.id || '').trim();
  const fromStatus = String(event.fromStatusKey || '').trim() || 'none';
  const toStatus = String(event.toStatusKey || event.statusKey || '').trim();
  return [type, id, fromStatus, toStatus].filter(Boolean).join('|');
}

function clearPendingStatusConfirm(id) {
  const key = String(id || '').trim();
  if (!key) return;
  const pending = agoPendingStatusConfirms.get(key);
  if (pending && pending.timer) clearTimeout(pending.timer);
  agoPendingStatusConfirms.delete(key);
}

function getActiveManualLock(meta, id) {
  const key = String(id || '').trim();
  if (!key || !meta || typeof meta !== 'object') return null;
  const manualLocks = meta.manualLocks && typeof meta.manualLocks === 'object' ? meta.manualLocks : {};
  const lock = manualLocks[key] || null;
  if (!lock) return null;
  const until = Number(lock.until || 0);
  if (!until || until <= Date.now()) return null;
  return lock;
}

async function verifyAndEmitConfirmedEvent(event) {
  const id = String(event?.id || '').trim();
  if (!id) return { ok: false, reason: 'missing_id' };

  const state = await getStore([ITEMS_KEY, META_KEY]);
  const items = state[ITEMS_KEY] && typeof state[ITEMS_KEY] === 'object' ? state[ITEMS_KEY] : {};
  const current = items[id] && typeof items[id] === 'object' ? items[id] : null;
  const targetStatus = String(event?.toStatusKey || event?.statusKey || '').trim();
  const activeManualLock = getActiveManualLock(state[META_KEY], id);
  if (activeManualLock && String(activeManualLock.statusKey || '').trim() && String(activeManualLock.statusKey || '').trim() !== targetStatus) {
    return { ok: true, skipped: true, reason: 'stale_locked_transition' };
  }

  if (event.type === 'new') {
    if (!current || !String(current.statusKey || '').trim()) return { ok: true, skipped: true, reason: 'not_present' };
  } else {
    if (!current || String(current.statusKey || '').trim() !== targetStatus) {
      return { ok: true, skipped: true, reason: 'not_confirmed' };
    }
  }

  const confirmedEvent = {
    ...event,
    statusKey: targetStatus || String(current?.statusKey || '').trim(),
    toStatusKey: targetStatus || String(current?.statusKey || '').trim(),
    title: String(current?.title || event?.title || '').trim(),
    author: String(current?.author || event?.author || '').trim(),
    changerUsername: formatToastUsername(current?.changerUsername || event?.changerUsername || ''),
    editUrl: String(current?.editUrl || event?.editUrl || '').trim(),
    reviewUrl: String(current?.reviewUrl || event?.reviewUrl || '').trim(),
    sortTime: Number(current?.sortTime || event?.sortTime || Date.now())
  };

  const confirmKey = buildEventCandidateKey(confirmedEvent);
  const claim = await claimNotificationRegistryEntry('confirmed', confirmKey, AGO_NOTIFY_DEDUP_MS);
  if (!claim.claimed) return { ok: true, skipped: true, reason: 'duplicate_confirmed', dedupeKey: confirmKey };

  await broadcastToastEvent(confirmedEvent, { force: false }).catch(() => {});
  const payload = buildNotificationPayload(confirmedEvent);
  if (payload && !shouldSkipDuplicateNotification(payload.dedupeKey)) {
    const sysClaim = await claimNotificationRegistryEntry('system', payload.dedupeKey, AGO_NOTIFY_REGISTRY_TTL_MS);
    if (sysClaim.claimed) await createNotification(payload.title, payload.message);
  }
  return { ok: true, emitted: true, dedupeKey: confirmKey };
}

function scheduleStatusConfirmation(event) {
  const id = String(event?.id || '').trim();
  if (!id) return;
  clearPendingStatusConfirm(id);
  const snapshot = { ...(event || {}), id };
  const token = { cancelled: false };
  agoPendingStatusConfirms.set(id, { event: snapshot, timer: token, at: Date.now() });
  Promise.resolve()
    .then(() => verifyAndEmitConfirmedEvent(snapshot))
    .catch(() => {})
    .finally(() => {
      const current = agoPendingStatusConfirms.get(id);
      if (current && current.timer === token) agoPendingStatusConfirms.delete(id);
    });
}

function buildNotificationPayload(event) {
  if (!event || typeof event !== 'object') return null;
  if (event.type === 'new') {
    return {
      dedupeKey: `new:${String(event.id || '').trim()}`,
      title: String(event.title || '').trim() || 'Co tin moi',
      message: event.author ? `Tac gia: ${String(event.author).trim()}` : 'Tac gia: Dang cap nhat'
    };
  }

  if (event.type === 'status-change') {
    const rawFromKey = String(event.fromStatusKey || '').trim();
    const fromLabel = STATUS_LABELS[rawFromKey] || rawFromKey || '';
    const toLabel = STATUS_LABELS[String(event.toStatusKey || '').trim()] || String(event.toStatusKey || '').trim() || 'unknown';
    const title = String(event.title || '').trim() || `Tin ID ${String(event.id || '').trim()}`;
    const transitionLabel = fromLabel ? `${fromLabel} -> ${toLabel}` : `-> ${toLabel}`;
    return {
      dedupeKey: `status:${String(event.id || '').trim()}:${rawFromKey || 'none'}->${String(event.toStatusKey || '').trim()}`,
      title: 'CRM trang thai tin cap nhat',
      message: `${title}: ${transitionLabel}`
    };
  }

  return null;
}


function buildToastEventKey(event) {
  if (!event || typeof event !== 'object') return '';
  const id = String(event.id || '').trim();
  const fromStatus = String(event.fromStatusKey || '').trim() || 'none';
  const toStatus = String(event.toStatusKey || event.statusKey || '').trim();
  const type = String(event.type || '').trim();
  return [id, `${fromStatus}->${toStatus}`, type].filter(Boolean).join('|');
}

async function enrichToastEventFromCrm(event) {
  const baseEvent = event && typeof event === 'object' ? { ...event } : null;
  if (!baseEvent) return baseEvent;
  if (formatToastUsername(baseEvent.changerUsername || '')) {
    baseEvent.changerUsername = formatToastUsername(baseEvent.changerUsername || '');
    return baseEvent;
  }
  const id = String(baseEvent.id || '').trim();
  if (!id) return baseEvent;

  try {
    const tabs = await queryTabs({ url: 'https://crmag.baoangiang.com.vn/*' });
    const targetTab = pickBestCrmTab(tabs, baseEvent.editUrl || baseEvent.reviewUrl || '');
    if (!targetTab || typeof targetTab.id !== 'number') return baseEvent;

    const response = await new Promise((resolve) => {
      try {
        chrome.tabs.sendMessage(targetTab.id, { type: 'AGO_RESOLVE_TOAST_USERNAME', event: baseEvent }, (payload) => {
          try { void chrome.runtime.lastError; } catch (e) {}
          resolve(payload || null);
        });
      } catch (e) {
        resolve(null);
      }
    });

    const username = formatToastUsername(response?.changerUsername || response?.event?.changerUsername || '');
    if (!username) return baseEvent;

    const enrichedEvent = { ...baseEvent, changerUsername: username };
    try {
      const state = await getStore([ITEMS_KEY, META_KEY]);
      const items = state[ITEMS_KEY] && typeof state[ITEMS_KEY] === 'object' ? { ...state[ITEMS_KEY] } : {};
      if (items[id] && String(items[id].changerUsername || '').trim() !== username) {
        items[id] = { ...items[id], changerUsername: username };
        const latestState = await getStore([STORAGE_KEY]);
        await setStore({ [ITEMS_KEY]: items, [SNAPSHOT_KEY]: buildSnapshotPayload(latestState[STORAGE_KEY] || {}, items) });
      }
    } catch (e) {}

    return enrichedEvent;
  } catch (e) {
    return baseEvent;
  }
}

async function broadcastToastEvent(event, options = {}) {
  const resolvedEvent = await enrichToastEventFromCrm(event);
  const toastEvent = resolvedEvent && typeof resolvedEvent === 'object' ? {
    type: String(resolvedEvent.type || '').trim(),
    id: String(resolvedEvent.id || '').trim(),
    statusKey: String(resolvedEvent.statusKey || resolvedEvent.toStatusKey || '').trim(),
    fromStatusKey: String(resolvedEvent.fromStatusKey || '').trim(),
    toStatusKey: String(resolvedEvent.toStatusKey || resolvedEvent.statusKey || '').trim(),
    title: String(resolvedEvent.title || '').trim(),
    author: String(resolvedEvent.author || '').trim(),
    changerUsername: formatToastUsername(resolvedEvent.changerUsername || ''),
    statusLabel: String(resolvedEvent.statusLabel || '').trim(),
    editUrl: String(resolvedEvent.editUrl || '').trim(),
    reviewUrl: String(resolvedEvent.reviewUrl || '').trim(),
    sortTime: Number(resolvedEvent.sortTime || Date.now())
  } : null;
  if (!toastEvent || !toastEvent.id) return { ok: false, error: 'missing_event' };

  const dedupeKey = buildToastEventKey(toastEvent);
  if (!dedupeKey) return { ok: false, error: 'missing_key' };

  if (!options.force) {
    const claim = await claimNotificationRegistryEntry('realtime', dedupeKey, AGO_NOTIFY_DEDUP_MS);
    if (!claim.claimed) return { ok: true, skipped: true, reason: 'duplicate', dedupeKey };
  } else {
    await markNotificationRegistryEntry('realtime', dedupeKey, AGO_NOTIFY_DEDUP_MS);
  }

  const tabs = await queryTabs({});
  const excludeTabId = Number(options.excludeTabId);
  const targets = (tabs || []).filter((tab) => tab && typeof tab.id === 'number' && tab.id >= 0 && !(excludeTabId >= 0 && tab.id === excludeTabId));
  if (!targets.length) return { ok: true, sent: 0, dedupeKey, skipped: true, reason: 'no_target_tabs' };
  let sent = 0;
  await Promise.all(targets.map((targetTab) => new Promise((resolve) => {
    try {
      chrome.tabs.sendMessage(targetTab.id, { type: 'AGO_PUSH_TOAST_EVENT', event: toastEvent }, () => {
        try { void chrome.runtime.lastError; } catch (e) {}
        sent += 1;
        resolve();
      });
    } catch (e) {
      resolve();
    }
  })));
  return { ok: true, sent, dedupeKey, tabIds: targets.map((tab) => tab.id) };
}

async function handleItemsStorageChange(oldItems, newItems) {
  const state = await getStore([META_KEY]);
  const meta = state[META_KEY] && typeof state[META_KEY] === 'object' ? state[META_KEY] : {};
  const events = buildNotificationEvents(oldItems, newItems)
    .filter((event) => String(event?.type || '').trim() === 'status-change')
    .filter((event) => {
      const lock = getActiveManualLock(meta, event?.id);
      if (!lock) return true;
      const lockedStatus = String(lock.statusKey || '').trim();
      const targetStatus = String(event?.toStatusKey || event?.statusKey || '').trim();
      if (!lockedStatus || !targetStatus) return true;
      if (lockedStatus !== targetStatus) return false;
      if (String(event?.fromStatusKey || '').trim() === lockedStatus) return false;
      return true;
    })
    .slice(0, 5);
  events.forEach((event) => scheduleStatusConfirmation(event));
}

function getStore(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function setStore(obj) {
  return new Promise((resolve) => chrome.storage.local.set(obj, resolve));
}

async function createNotification(title, message) {
  if (!chrome.notifications) return;
  try {
    const state = await getStore([NOTIFY_KEY]);
    if (state[NOTIFY_KEY] === false) return;
  } catch (e) {}
  const safeTitle = String(title || '').trim() || 'AGO Support';
  const safeMessage = String(message || '').trim() || 'Co cap nhat moi';
  const id = `ago-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: safeTitle,
    message: safeMessage
  }, () => {
    setTimeout(() => {
      try { chrome.notifications.clear(id, () => {}); } catch (e) {}
    }, 5000);
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const res = await getStore([STORAGE_KEY]);
  if (!res[STORAGE_KEY]) {
    await setStore({
      [STORAGE_KEY]: {
        choBienTap: 0,
        kyThuat: 0,
        daBienTapB1: 0,
        daBienTapB2: 0,
        updatedAt: 0,
        ok: false,
        source: 'background',
        lastError: 'Dang cho tab CRM dong bo du lieu'
      },
      [SNAPSHOT_KEY]: buildSnapshotPayload({
        choBienTap: 0, kyThuat: 0, daBienTapB1: 0, daBienTapB2: 0, updatedAt: 0, ok: false, source: 'background', lastError: 'Dang cho tab CRM dong bo du lieu'
      }, {}),
      [NOTIFY_KEY]: true
    });
  }
});

async function requestCrmRefresh(reason) {
  const tabs = await chrome.tabs.query({ url: 'https://crmag.baoangiang.com.vn/*' });
  let sent = 0;
  await Promise.all((tabs || []).map((tab) => new Promise((resolve) => {
    if (!tab || typeof tab.id !== 'number') return resolve();
    chrome.tabs.sendMessage(tab.id, { type: 'AGO_REQUEST_CRM_REFRESH', reason: String(reason || 'background') }, () => {
      try { void chrome.runtime.lastError; } catch (e) {}
      sent += 1;
      resolve();
    });
  })));
  return { ok: sent > 0, sent };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || typeof message !== 'object') return;

  if (message.type === 'AGO_GET_COUNTS') {
    getStore([STORAGE_KEY]).then((res) => sendResponse({ ok: true, data: res[STORAGE_KEY] || null }));
    return true;
  }

  if (message.type === 'AGO_FORCE_REFRESH') {
    requestCrmRefresh('force-refresh').then((result) => sendResponse(result));
    return true;
  }

  if (message.type === 'AGO_MARK_RETURN_TO_INDEX') {
    const tabId = sender?.tab?.id;
    if (tabId >= 0) markTabPendingReturn(tabId, message.reason || 'content');
    sendResponse({ ok: true, tabId: tabId ?? null });
    return true;
  }

  if (message.type === 'AGO_CLEAR_RETURN_TO_INDEX') {
    const tabId = sender?.tab?.id;
    if (tabId >= 0) clearTabPendingReturn(tabId);
    sendResponse({ ok: true, tabId: tabId ?? null });
    return true;
  }

  if (message.type === 'AGO_REQUEST_BACKGROUND_REFRESH_FAST') {
    requestCrmRefresh(message.reason || 'background-fast').then((result) => sendResponse(result));
    return true;
  }

  if (message.type === 'AGO_PUSH_TOAST_EVENT') {
    sendResponse({ ok: false, skipped: true, reason: 'toast_broadcast_disabled_in_content' });
    return false;
  }

  if (message.type === 'AGO_ENRICH_TOAST_EVENT') {
    enrichToastEventFromCrm(message.event).then((enriched) => {
      const changerUsername = formatToastUsername(enriched?.changerUsername || '');
      sendResponse({ ok: !!changerUsername, event: enriched || message.event || null, changerUsername });
    }).catch((error) => sendResponse({ ok: false, event: message.event || null, changerUsername: '', error: error?.message || String(error || 'toast_enrich_failed') }));
    return true;
  }

  if (message.type === 'AGO_CLAIM_NOTIFICATION_DISPLAY') {
    claimNotificationRegistryEntry(message.channel, message.dedupeKey, message.ttlMs, { forceMark: message.forceMark === true }).then((result) => sendResponse({ ok: true, ...result })).catch((error) => sendResponse({ ok: false, claimed: false, error: error?.message || String(error || 'claim_failed') }));
    return true;
  }

  if (message.type === 'AGO_MARK_NOTIFICATION_DISPLAY') {
    markNotificationRegistryEntry(message.channel, message.dedupeKey, message.ttlMs).then((result) => sendResponse({ ok: true, ...result })).catch((error) => sendResponse({ ok: false, claimed: false, error: error?.message || String(error || 'mark_failed') }));
    return true;
  }

  if (message.type === 'AGO_SMART_OPEN_URL') {
    smartOpenUrlFromMessage(message, sender).then(sendResponse);
    return true;
  }

});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes) return;
  if (Object.prototype.hasOwnProperty.call(changes, SNAPSHOT_KEY)) {
    const oldItems = changes[SNAPSHOT_KEY]?.oldValue?.items || {};
    const newItems = changes[SNAPSHOT_KEY]?.newValue?.items || {};
    handleItemsStorageChange(oldItems, newItems).catch(() => {});
    return;
  }
  if (!Object.prototype.hasOwnProperty.call(changes, ITEMS_KEY)) return;
  const oldItems = changes[ITEMS_KEY]?.oldValue || {};
  const newItems = changes[ITEMS_KEY]?.newValue || {};
  handleItemsStorageChange(oldItems, newItems).catch(() => {});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!hasFreshPendingReturn(tabId)) return;
  const currentUrl = String(changeInfo.url || tab?.url || '');
  if (!currentUrl || !isCrmUrl(currentUrl)) return;
  const kind = getCrmTabKind(currentUrl);
  if (kind === 'news-index') {
    clearTabPendingReturn(tabId);
    return;
  }
  if (kind === 'edit') return;
  clearTabPendingReturn(tabId);
  updateTab(tabId, { url: AGO_NEWS_INDEX_URL, active: true }).catch(() => {});
});

chrome.tabs.onRemoved.addListener((tabId) => {
  clearTabPendingReturn(tabId);
});

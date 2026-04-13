const STORAGE_KEY = 'ago_crm_status_counts_v10';

function formatUpdatedAt(ts) {
  if (!ts) return 'Đang chờ dữ liệu realtime...';
  try {
    return `Cập nhật: ${new Date(ts).toLocaleString('vi-VN')}`;
  } catch (e) {
    return 'Đang chờ dữ liệu realtime...';
  }
}

function renderLiveCounts(data) {
  const d = data || {};
  ['choBienTap', 'kyThuat', 'daBienTapB1', 'daBienTapB2'].forEach((key) => {
    const el = document.getElementById(`live-${key}`);
    if (el) el.textContent = String(Number(d[key] || 0));
  });

  const updatedEl = document.getElementById('live-updated');
  if (updatedEl) {
    updatedEl.textContent = d.ok === false && d.lastError
      ? `${formatUpdatedAt(d.updatedAt)} — ${d.lastError}`
      : formatUpdatedAt(d.updatedAt);
  }
}

function loadLiveCounts() {
  chrome.storage.local.get([STORAGE_KEY], (res) => {
    renderLiveCounts(res ? res[STORAGE_KEY] : null);
  });
}

const DEFAULT_SETTINGS = {
  featureCMSStatus: true,
  featureToolbar: true,
  featureAutoFill: true,
  featureAutoProvince: true,
  featureImportLinks: true,
  featureSpellcheck: true,
  featureAuthorQuick: true
};

const IDS = Object.keys(DEFAULT_SETTINGS);
const statusEl = document.getElementById('status');

function setStatus(message, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#c62828' : '#0b8f4d';
}

function applyToForm(settings) {
  IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(settings[id]);
  });
}

function readForm() {
  const data = {};
  IDS.forEach((id) => {
    data[id] = Boolean(document.getElementById(id)?.checked);
  });
  return data;
}

function normalizeSettings(raw) {
  const data = { ...(raw || {}) };
  return {
    featureCMSStatus: data.featureCMSStatus ?? DEFAULT_SETTINGS.featureCMSStatus,
    featureToolbar: data.featureToolbar ?? (Boolean(data.toolbarCRM) || Boolean(data.toolbarBaoAnGiang) || Boolean(data.mammothLoader) || DEFAULT_SETTINGS.featureToolbar),
    featureAutoFill: data.featureAutoFill ?? (data.autoFillKeyword ?? DEFAULT_SETTINGS.featureAutoFill),
    featureAutoProvince: data.featureAutoProvince ?? (data.autoProvince ?? DEFAULT_SETTINGS.featureAutoProvince),
    featureImportLinks: data.featureImportLinks ?? ((Boolean(data.getlink) || Boolean(data.pastelink)) || DEFAULT_SETTINGS.featureImportLinks),
    featureSpellcheck: data.featureSpellcheck ?? data.spellcheckCRM ?? DEFAULT_SETTINGS.featureSpellcheck,
    featureAuthorQuick: data.featureAuthorQuick ?? data.authorQuick ?? DEFAULT_SETTINGS.featureAuthorQuick
  };
}

function expandSettings(simple) {
  return {
    featureCMSStatus: Boolean(simple.featureCMSStatus),
    featureToolbar: Boolean(simple.featureToolbar),
    featureAutoFill: Boolean(simple.featureAutoFill),
    featureAutoProvince: Boolean(simple.featureAutoProvince),
    featureImportLinks: Boolean(simple.featureImportLinks),
    featureSpellcheck: Boolean(simple.featureSpellcheck),
    featureAuthorQuick: Boolean(simple.featureAuthorQuick),
    toolbarCRM: Boolean(simple.featureToolbar),
    toolbarBaoAnGiang: Boolean(simple.featureToolbar),
    mammothLoader: Boolean(simple.featureToolbar),
    autoFillKeyword: Boolean(simple.featureAutoFill),
    autoProvince: Boolean(simple.featureAutoProvince),
    getlink: Boolean(simple.featureImportLinks),
    pastelink: Boolean(simple.featureImportLinks),
    spellcheckCRM: Boolean(simple.featureSpellcheck),
    authorQuick: Boolean(simple.featureAuthorQuick)
  };
}

function loadSettings() {
  chrome.storage.local.get(null, (settings) => {
    applyToForm(normalizeSettings(settings));
  });
}

document.getElementById('saveBtn').addEventListener('click', () => {
  const simple = readForm();
  chrome.storage.local.set(expandSettings(simple), () => {
    if (chrome.runtime.lastError) {
      setStatus('Không lưu được cấu hình.', true);
      return;
    }
    setStatus('Đã lưu. Hãy tải lại tab đang mở.');
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  applyToForm(DEFAULT_SETTINGS);
  chrome.storage.local.set(expandSettings(DEFAULT_SETTINGS), () => {
    if (chrome.runtime.lastError) {
      setStatus('Không khôi phục được mặc định.', true);
      return;
    }
    setStatus('Đã khôi phục mặc định. Hãy tải lại tab.');
  });
});

loadSettings();


try {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes[STORAGE_KEY]) return;
    renderLiveCounts(changes[STORAGE_KEY].newValue || null);
  });
} catch (e) {}

loadLiveCounts();

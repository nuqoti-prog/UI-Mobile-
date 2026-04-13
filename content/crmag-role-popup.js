(function () {
  if (window.__AGO_WIDGET_V7__) return;
  window.__AGO_WIDGET_V7__ = true;

  const STORAGE_KEY = "ago_crm_status_counts_v10";
  const ITEMS_KEY = "ago_crm_status_items_v10";
  const SNAPSHOT_KEY = "ago_crm_status_snapshot_v1";
  const POS_KEY = "ago_widget_pos_free_v1";
  const MODE_KEY = "ago_widget_mode_v15";
  const NOTIFY_KEY = "ago_widget_notify_enabled_v1";
  const FEATURE_STATUS_KEY = "featureCMSStatus";
  const PREVIEW_LIMIT = 5;

  const DEFAULT = {
    choBienTap: 0,
    kyThuat: 0,
    daBienTapB1: 0,
    daBienTapB2: 0,
    updatedAt: 0,
    ok: false,
    lastError: ""
  };

  const MODES = {
    full: "full",
    horizontal: "horizontal"
  };

  const STATUS_META = {
    choBienTap: { label: "TIN CHỜ", cardId: "ago-card-cbt", valueId: "ago-cbt", icon: "🕒", theme: "theme-red" },
    kyThuat: { label: "KỸ THUẬT", cardId: "ago-card-kt", valueId: "ago-kt", icon: "🛠️", theme: "theme-blue" },
    daBienTapB1: { label: "BƯỚC 1", cardId: "ago-card-b1", valueId: "ago-b1", icon: "✍️", theme: "theme-green" },
    daBienTapB2: { label: "BƯỚC 2", cardId: "ago-card-b2", valueId: "ago-b2", icon: "✔️", theme: "theme-pink" }
  };

  function getDetailSide() {
    const rect = widget?.getBoundingClientRect?.();
    if (!rect) return "right";
    return rect.left > (window.innerWidth / 2) ? "left" : "right";
  }

  let currentMode = MODES.full;
  let lastData = { ...DEFAULT };
  let lastItems = {};
  let dragState = null;
  let dragFrame = 0;
  let activeStatusKey = "";
  let expandedPanel = false;
  let modeTransitionTimer = null;
  let lastOpenRequest = { itemId: "", url: "", at: 0 };
  let notifyEnabled = true;
  let widgetEnabled = true;

  const SETTINGS_ICON = "⚙️";
  const EYE_OPEN_ICON = "👁️";
  const EYE_CLOSED_ICON = "🙈";
  const BELL_ON_SVG = "🔔";
  const BELL_OFF_SVG = "🔕";

  function storageGet(keyOrKeys) {
    return new Promise((resolve) => {
      try {
        if (!chrome?.storage?.local) return resolve(Array.isArray(keyOrKeys) ? {} : null);
        chrome.storage.local.get(keyOrKeys, (res) => {
          if (Array.isArray(keyOrKeys)) resolve(res || {});
          else resolve(res ? res[keyOrKeys] : null);
        });
      } catch (e) {
        resolve(Array.isArray(keyOrKeys) ? {} : null);
      }
    });
  }

  function storageSet(obj) {
    try {
      if (!chrome?.storage?.local) return;
      chrome.storage.local.set(obj);
    } catch (e) {}
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(text) {
    return String(text || "").replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
  }

  function cleanItemTitle(text) {
    return normalizeText(String(text || "").replace(/\blink\s*fb\b/gi, " "));
  }

  function cleanAuthorName(text) {
    return normalizeText(text || "");
  }

  function foldText(text) {
    return normalizeText(text)
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
  }

  function todayPrefix() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(2);
    return `${dd}-${mm}-${yy}`;
  }

  function extractDateLikeText(value) {
    const text = normalizeText(value);
    if (!text) return "";
    const match = text.match(/\b(\d{2}-\d{2}-\d{2,4}(?:\s+\d{2}:\d{2}(?::\d{2})?)?)\b/);
    return match ? normalizeText(match[1]) : "";
  }

  function isDateLikeText(value) {
    return !!extractDateLikeText(value);
  }

  function firstDateLikeValue(list) {
    for (const value of list || []) {
      const text = extractDateLikeText(value);
      if (text) return text;
    }
    return "";
  }

  function extractAutoMetaFromRow(row) {
    const result = { enabled: false, dateText: "" };
    if (!row) return result;
    const cells = Array.from(row.querySelectorAll("td"));
    if (!cells.length) return result;
    const autoCell = cells[10] || cells[9] || cells[11] || null;
    if (!autoCell) return result;

    const candidates = [];
    const cellText = normalizeText(autoCell.textContent || autoCell.innerText || "");
    if (cellText) candidates.push(cellText);

    const hasYesIcon = !!autoCell.querySelector('img[title="Yes"], img[title*="Yes" i]');

    Array.from(autoCell.querySelectorAll("*")).forEach((el) => {
      const text = normalizeText(el.textContent || el.innerText || "");
      if (text) candidates.push(text);
      const title = normalizeText(el.getAttribute?.("title") || "");
      const value = normalizeText(el.getAttribute?.("value") || "");
      const dataValue = normalizeText(el.getAttribute?.("data-value") || "");
      if (title) candidates.push(title);
      if (value) candidates.push(value);
      if (dataValue) candidates.push(dataValue);
      if (typeof el.value === "string" && normalizeText(el.value)) candidates.push(normalizeText(el.value));
    });

    result.dateText = firstDateLikeValue(candidates);
    result.enabled = hasYesIcon || !!result.dateText;
    return result;
  }

  function getVisibleScheduledExclusionIds() {
    const excluded = new Set();
    if (!document || !document.querySelectorAll) return excluded;
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"][name="uid"][value]'));
    checkboxes.forEach((box) => {
      const id = normalizeText(box?.value || '');
      if (!id) return;
      const row = box.closest?.('tr');
      if (!row) return;
      const autoMeta = extractAutoMetaFromRow(row);
      if (!autoMeta.enabled) return;
      excluded.add(id);
    });
    return excluded;
  }

  function isTodayCreatedItem(item) {
    if (!item || typeof item !== "object") return false;
    const createdAt = normalizeText(item.createdAt || "");
    return !!createdAt && createdAt.startsWith(todayPrefix());
  }

  function shouldHideScheduledItem(item, visibleExcludedIds) {
    if (!item || typeof item !== "object") return false;
    const itemId = normalizeText(item.id || "");
    if (itemId && visibleExcludedIds && visibleExcludedIds.has(itemId)) return true;

    let enabled = item.scheduledEnabled === true;

    let row = null;
    if (itemId) {
      const safeId = String(itemId).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const selector = `input[type="checkbox"][name="uid"][value="${safeId}"]`;
      row = document.querySelector(selector)?.closest?.("tr") || null;
    }
    if (row) {
      const autoMeta = extractAutoMetaFromRow(row);
      if (autoMeta.enabled) enabled = true;
    }

    return enabled;
  }

  function getFilteredItemsMap(items) {
    const map = {};
    const visibleExcludedIds = getVisibleScheduledExclusionIds();
    Object.entries(items || {}).forEach(([id, item]) => {
      if (!item) return;
      if (!isTodayCreatedItem(item)) return;
      if (shouldHideScheduledItem(item, visibleExcludedIds)) return;
      map[id] = item;
    });
    return map;
  }

  function countsFromItems(items) {
    const counts = { choBienTap: 0, kyThuat: 0, daBienTapB1: 0, daBienTapB2: 0 };
    Object.values(items || {}).forEach((item) => {
      const key = String(item?.statusKey || "");
      if (Object.prototype.hasOwnProperty.call(counts, key)) counts[key] += 1;
    });
    return counts;
  }


  function injectCSS() {
    if (document.getElementById("ago-widget-v7-style")) return;

    const s = document.createElement("style");
    s.id = "ago-widget-v7-style";
    s.textContent = `
#ago-widget-v7{
  position:fixed;
  overflow:visible;
  bottom:20px;
  right:20px;
  z-index:999999;
  font-family:Roboto,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  min-width:0;
  user-select:none;
}
#ago-widget-v7 *{box-sizing:border-box}
.ago-panel{
  position:relative;
  width:max-content;
  overflow:visible;
  display:flex;
  flex-direction:column;
  border-radius:16px;
  color:#0f172a;
  background:
    radial-gradient(145% 120% at 0% 0%, rgba(255,255,255,.78) 0%, rgba(255,255,255,.22) 34%, rgba(255,255,255,.08) 100%),
    radial-gradient(120% 95% at 100% 0%, rgba(255,255,255,.34) 0%, transparent 50%),
    linear-gradient(180deg, rgba(255,255,255,.30), rgba(255,255,255,.10));
  backdrop-filter: blur(26px) saturate(185%);
  -webkit-backdrop-filter: blur(26px) saturate(185%);
  border:1px solid rgba(255,255,255,.52);
  box-shadow:
    0 16px 40px rgba(15,23,42,.14),
    inset 0 1px 0 rgba(255,255,255,.82),
    inset 0 -1px 0 rgba(255,255,255,.18);
}
.ago-panel::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  pointer-events:none;
  background:
    linear-gradient(128deg, rgba(255,255,255,.38), transparent 26%, transparent 68%, rgba(255,255,255,.14)),
    radial-gradient(58% 34% at 15% 0%, rgba(255,255,255,.46), transparent 72%),
    radial-gradient(52% 34% at 88% 100%, rgba(255,255,255,.12), transparent 68%);
}
.ago-panel::after{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  pointer-events:none;
  background-image: radial-gradient(rgba(255,255,255,.18) .7px, transparent .7px);
  background-size: 12px 12px;
  opacity:.14;
  mix-blend-mode:soft-light;
}
.ago-head{
  display:flex;
  align-items:center;
  gap:10px;
  padding:7px 10px 5px;
  border-bottom:1px solid rgba(255,255,255,.22);
  cursor:grab;
  min-height:34px;
}
.ago-dragging .ago-head,
.ago-dragging .ago-body,
.ago-dragging .ago-grid,
.ago-dragging .ago-card{cursor:grabbing}
.ago-title{
  display:flex;
  align-items:center;
  gap:8px;
  min-width:0;
}
.ago-title-text{
  display:flex;
  align-items:center;
  gap:0;
  min-width:0;
  font-size:11px;
  font-weight:850;
  color:#111827;
  letter-spacing:.01em;
  white-space:nowrap;
}
.ago-title-main{
  display:inline-block;
  white-space:nowrap;
}
.ago-title-sub{display:none}
.ago-title-main{display:inline}
.ago-title-sub{display:inline}
.ago-live-dot{
  position:relative;
  width:9px;
  height:9px;
  border-radius:50%;
  background:#ff2d55;
  flex:0 0 auto;
  animation:agoLiveDot 1.4s ease-in-out infinite;
  box-shadow:0 0 0 2px rgba(255,45,85,.12), 0 0 12px rgba(255,45,85,.38);
}
.ago-live-dot::before,
.ago-live-dot::after{
  content:"";
  position:absolute;
  inset:-4px;
  border-radius:999px;
  border:1px solid rgba(255,45,85,.45);
  animation:agoLiveRing 1.8s ease-out infinite;
}
.ago-live-dot::after{animation-delay:.9s}
@keyframes agoLiveDot{
  0%,100%{transform:scale(.92); box-shadow:0 0 0 2px rgba(255,45,85,.12), 0 0 10px rgba(255,45,85,.28)}
  50%{transform:scale(1.12); box-shadow:0 0 0 3px rgba(255,45,85,.16), 0 0 18px rgba(255,45,85,.48)}
}
@keyframes agoLiveRing{
  0%{transform:scale(.8); opacity:.75}
  70%{transform:scale(1.95); opacity:0}
  100%{transform:scale(2.1); opacity:0}
}
.ago-head-right{
  position:absolute;
  top:7px;
  right:8px;
  display:flex;
  align-items:center;
  gap:8px;
  z-index:6;
}
.ago-icon-btn{
  border:none;
  background:transparent;
  color:#111827;
  border-radius:10px;
  height:28px;
  min-width:28px;
  padding:0;
  cursor:pointer;
  border:1px solid transparent;
  box-shadow:none;
  transition:transform .16s ease;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:15px;
  line-height:1;
}
.ago-icon-btn .ago-gear-spin{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  transform-origin:center;
  animation:agoGearSpin 2.4s linear infinite;
  will-change:transform;
}
.ago-icon-btn:hover{transform:translateY(-1px)}
.ago-icon-btn:active{transform:translateY(1px)}
@keyframes agoGearSpin{
  from{transform:rotate(0deg)}
  to{transform:rotate(360deg)}
}

.ago-menu{
  position:absolute;
  width:144px;
  padding:6px;
  border-radius:14px;
  background:
    radial-gradient(138% 112% at 0% 0%, rgba(255,255,255,.94) 0%, rgba(255,255,255,.82) 36%, rgba(255,255,255,.72) 100%),
    linear-gradient(180deg, rgba(255,255,255,.90), rgba(255,255,255,.78));
  backdrop-filter: blur(24px) saturate(170%);
  -webkit-backdrop-filter: blur(24px) saturate(170%);
  border:1px solid rgba(255,255,255,.62);
  box-shadow:0 12px 30px rgba(15,23,42,.14), inset 0 1px 0 rgba(255,255,255,.88);
  display:none;
  z-index:30;
}
.ago-menu.open{display:block}
.ago-menu-inline-label{
  display:flex;
  align-items:center;
  padding:0 2px 0 0;
  font-size:10px;
  font-weight:700;
  color:#94a3b8;
  white-space:nowrap;
}
.ago-menu-row{
  width:100%;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:8px;
}
.ago-menu-row + .ago-menu-row{margin-top:6px}
.ago-menu.ago-menu-min{
  width:auto;
  min-width:140px;
  padding:8px;
  display:none;
  gap:0;
  align-items:stretch;
  border-radius:12px;
}
.ago-menu.ago-menu-min.open{display:block}
.ago-menu-icon-item{
  border:none;
  width:32px;
  height:32px;
  border-radius:10px;
  background:transparent;
  color:#475569;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:transform .14s ease, background .14s ease, box-shadow .14s ease, color .14s ease;
}
.ago-menu-icon-item:hover{background:rgba(255,255,255,.60)}
.ago-menu-icon-item.is-active{
  background:linear-gradient(180deg, rgba(59,130,246,.16), rgba(59,130,246,.09));
  color:#1d4ed8;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.92), 0 0 0 1px rgba(59,130,246,.10);
}
.ago-menu-icon{font-size:16px; line-height:1; display:inline-flex; align-items:center; justify-content:center; min-width:16px;}
.ago-menu-icon svg{width:16px;height:16px;display:block;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ago-menu-icon-item.is-off{color:#9ca3af;background:rgba(255,255,255,.40)}
.ago-menu-icon-item.is-on{color:#2c3e50;background:#d8ecff;box-shadow:0 8px 18px rgba(102,166,255,.18), inset 0 1px 0 rgba(255,255,255,.76)}
.ago-menu.menu-below{top:36px;bottom:auto}
.ago-menu.menu-above{bottom:36px;top:auto}
.ago-menu.menu-right{left:100%;right:auto;top:-2px;margin-left:6px}
.ago-menu.menu-left{right:100%;left:auto;top:-2px;margin-right:6px}
.ago-menu.menu-full-below{top:calc(100% + 8px);bottom:auto;right:0;left:auto}
.ago-menu.menu-full-above{bottom:calc(100% + 8px);top:auto;right:0;left:auto}
.ago-menu-title{
  padding:2px 4px 5px;
  font-size:10px;
  font-weight:850;
  color:#64748b;
  letter-spacing:.03em;
  text-transform:uppercase;
  text-align:center;
}
.ago-menu-item{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:0;
  width:100%;
  border:none;
  border-radius:10px;
  background:transparent;
  padding:8px 8px;
  font-size:12px;
  font-weight:760;
  color:#0f172a;
  cursor:pointer;
  text-align:center;
  transition:transform .14s ease, background .14s ease, box-shadow .14s ease, color .14s ease;
}
.ago-menu-item:hover{background:rgba(255,255,255,.60)}
.ago-menu-item.is-active{
  background:linear-gradient(180deg, rgba(59,130,246,.16), rgba(59,130,246,.09));
  color:#1d4ed8;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.92), 0 0 0 1px rgba(59,130,246,.10);
}
.ago-menu-check{display:none}

.ago-body{padding:5px; cursor:grab}
.ago-grid{display:grid;grid-template-columns:repeat(2,max-content);gap:5px;justify-content:start;align-items:start; cursor:grab}
.ago-card{
  position:relative;
  min-height:48px;
  padding:7px 8px 6px;
  border-radius:14px;
  color:inherit;
  border:1px solid rgba(255,255,255,.30);
  box-shadow:0 6px 14px rgba(15,23,42,.07), inset 0 1px 0 rgba(255,255,255,.44);
  transition:transform .18s ease, box-shadow .18s ease, filter .18s ease, border-color .18s ease;
  cursor:pointer;
  display:grid;
grid-template-columns:18px max-content 22px;
  grid-template-areas:
    "icon label value"
    "hint hint value";
  column-gap:3px;
  row-gap:1px;
  align-items:center;
}
.ago-card:hover{transform:translateY(-1px)}
.ago-card::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:inherit;
  pointer-events:none;
  background:linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.03));
}
.ago-card.is-open{
  border-color:rgba(37,99,235,.55);
  box-shadow:0 14px 28px rgba(15,23,42,.12), inset 0 1px 0 rgba(255,255,255,.44), 0 0 0 2px rgba(255,255,255,.24);
}
.ago-card-top{
  position:relative;
  z-index:1;
  display:contents;
}
.ago-card-icon{
  grid-area:icon;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:20px;
  height:20px;
  border-radius:999px;
  background:rgba(255,255,255,.28);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.45);
  font-size:12px;
}
.ago-card-label{
  grid-area:label;
  min-width:0;
  font-size:10px;
  opacity:.96;
  font-weight:850;
  line-height:1.05;
  letter-spacing:.01em;
}
.ago-card-value{
  grid-area:value;
  position:relative;
  z-index:1;
  justify-self:end;
  align-self:center;
  font-size:28px;
  font-weight:900;
  line-height:1;
  letter-spacing:-.03em;
}
.ago-card-hint{
  grid-area:hint;
  position:relative;
  z-index:1;
  margin-top:0;
  font-size:9px;
  font-weight:800;
  opacity:.74;
  white-space:nowrap;
}
.ago-c1{
  background:linear-gradient(180deg, rgba(244,67,54,.26), rgba(244,67,54,.12));
  border-color:rgba(244,67,54,.40);
  color:#7c1313;
}
.ago-c2{
  background:linear-gradient(180deg, rgba(33,150,243,.24), rgba(33,150,243,.11));
  border-color:rgba(33,150,243,.40);
  color:#0b4678;
}
.ago-c3{
  background:linear-gradient(180deg, rgba(76,175,80,.26), rgba(76,175,80,.12));
  border-color:rgba(76,175,80,.42);
  color:#14511f;
}
.ago-c4{
  background:linear-gradient(180deg, rgba(236,72,153,.24), rgba(236,72,153,.11));
  border-color:rgba(236,72,153,.38);
  color:#841b58;
}
.ago-foot{display:none}
.ago-error{color:#b91c1c;font-weight:700;word-break:break-word}


.ago-detail{
  position:absolute;
  left:0;
  width:max-content;
  min-width:0;
  max-width:min(560px, calc(100vw - 20px));
  display:none;
  z-index:25;
  padding:3px;
  border-radius:14px;
  overflow:hidden;
  border:1px solid rgba(120,150,140,.24);
  background:linear-gradient(180deg, #edf8ee 0%, #e6f4e8 100%);
  box-shadow:0 6px 18px rgba(0,0,0,.10);
  backdrop-filter:none;
  -webkit-backdrop-filter:none;
}
.ago-detail.open{display:block}
.ago-detail.placement-below{top:calc(100% + 6px); bottom:auto}
.ago-detail.placement-above{bottom:calc(100% + 6px); top:auto}
.ago-detail.placement-right{left:0; right:auto; transform-origin:top left}
.ago-detail.placement-left{left:auto; right:0; transform-origin:top right}
.ago-detail-body{padding:0}
.ago-detail.theme-red{background:linear-gradient(180deg, #fff0f0 0%, #ffe9e9 100%); border-color:rgba(220,118,118,.30)}
.ago-detail.theme-blue{background:linear-gradient(180deg, #edf5ff 0%, #e4f0ff 100%); border-color:rgba(110,158,226,.32)}
.ago-detail.theme-green{background:linear-gradient(180deg, #edf8ee 0%, #e6f4e8 100%); border-color:rgba(117,180,121,.32)}
.ago-detail.theme-pink{background:linear-gradient(180deg, #fff0f7 0%, #fee9f4 100%); border-color:rgba(221,126,183,.30)}
.ago-detail-list{
  width:max-content;
  max-width:min(520px, calc(100vw - 32px));
  background:rgba(255,255,255,.96);
  border:1px solid rgba(205,214,224,.88);
  border-radius:12px;
  padding:4px 8px;
  display:flex;
  flex-direction:column;
  gap:0;
  max-height:180px;
  overflow:auto;
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
}
.ago-detail-list.is-expanded{max-height:260px; overflow:auto}
.ago-detail-list::-webkit-scrollbar{width:4px}
.ago-detail-list::-webkit-scrollbar-track{background:transparent}
.ago-detail-list::-webkit-scrollbar-thumb{background:rgba(100,116,139,.28); border-radius:999px}
.ago-detail-item{
  position:relative;
  display:grid;
  grid-template-columns:minmax(0,max-content) auto;
  align-items:center;
  justify-content:start;
  gap:8px;
  min-height:24px;
  padding:4px 0;
  background:transparent;
  border:none;
  border-radius:0;
  box-shadow:none;
}
.ago-detail-item::before{display:none}
.ago-detail.theme-red .ago-detail-item::before{display:none}
.ago-detail.theme-blue .ago-detail-item::before{display:none}
.ago-detail.theme-green .ago-detail-item::before{display:none}
.ago-detail.theme-pink .ago-detail-item::before{display:none}
.ago-detail-item:nth-child(odd){background:transparent}
.ago-detail-item:nth-child(even){background:transparent}
.ago-detail-item + .ago-detail-item{border-top:1px solid rgba(222,228,235,.95)}
.ago-detail-item-link{
  border:none;
  padding:0;
  margin:0;
  background:transparent;
  color:#586273;
  font:inherit;
  font-size:10px;
  line-height:1.3;
  font-weight:600;
  text-align:left;
  cursor:pointer;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  max-width:min(420px, calc(100vw - 120px));
}
.ago-detail-item-link:hover{color:#374151; text-decoration:none}
.ago-detail-item-link:active{transform:translateY(1px)}
.ago-detail-meta{
  display:flex;
  align-items:center;
  gap:4px;
  flex:0 0 auto;
  max-width:max-content;
  min-width:auto;
  justify-content:flex-end;
  white-space:nowrap;
  margin-left:6px;
}
.ago-detail-author{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  max-width:100%;
  min-width:0;
  min-height:16px;
  padding:5px 9px;
  border-radius:999px;
  background:#f7f9fb;
  border:1px solid #cfd8e3;
  box-shadow:none;
  font-size:9px;
  letter-spacing:.01em;
  font-weight:600;
  color:#6b7280;
  overflow:hidden;
  text-overflow:ellipsis;
}
.ago-detail-time{display:none}
.ago-detail-empty{
  padding:10px;
  text-align:center;
  color:#64748b;
  font-size:11px;
  font-weight:650;
}
.ago-detail-more{
  margin-top:5px;
  width:100%;
  height:26px;
  border:none;
  border-radius:10px;
  background:rgba(255,255,255,.78);
  color:#0f172a;
  font-size:11px;
  font-weight:800;
  cursor:pointer;
  border:1px solid rgba(226,232,240,.96);
}
.ago-detail-more:hover{background:rgba(255,255,255,.92)}
.ago-widget-row-highlight{
  outline:2px solid rgba(37,99,235,.7);
  outline-offset:-2px;
  animation:agoRowBlink 1.4s ease-in-out 1;
}
@keyframes agoRowBlink{
  0%,100%{background-color:transparent}
  30%{background-color:rgba(59,130,246,.14)}
  60%{background-color:rgba(59,130,246,.08)}
}

#ago-widget-v7.mode-full{width:max-content;min-width:0;max-width:none}
#ago-widget-v7.mode-horizontal{width:max-content;min-width:0;max-width:none}
#ago-widget-v7.mode-horizontal .ago-panel{flex-direction:row;align-items:center;padding:7px 10px;gap:8px;border-radius:18px}
#ago-widget-v7.mode-horizontal .ago-head{order:1;border-bottom:none;padding:0;min-height:auto;flex:0 0 auto}
#ago-widget-v7.mode-horizontal .ago-title-text{display:none}
#ago-widget-v7.mode-horizontal .ago-title{gap:0}
#ago-widget-v7.mode-horizontal .ago-title-sub{display:none}
#ago-widget-v7.mode-horizontal .ago-body{order:2;padding:0;flex:1 1 auto}
#ago-widget-v7.mode-horizontal .ago-grid{grid-template-columns:repeat(4, minmax(0,1fr));gap:6px}
#ago-widget-v7.mode-horizontal .ago-card{min-height:38px;height:38px;padding:5px 6px;display:flex;align-items:center;justify-content:center;border-radius:12px}
#ago-widget-v7.mode-horizontal .ago-card-top{margin:0;gap:4px;justify-content:center}
#ago-widget-v7.mode-horizontal .ago-card-icon{width:18px;height:18px;font-size:10px}
#ago-widget-v7.mode-horizontal .ago-card-label{display:none}
#ago-widget-v7.mode-horizontal .ago-card-value{font-size:16px}
#ago-widget-v7.mode-horizontal .ago-card-hint{display:none}
#ago-widget-v7.mode-horizontal .ago-head-right{order:3;position:static;flex:0 0 auto}
#ago-widget-v7.mode-horizontal .ago-icon-btn{width:28px;height:28px;min-width:28px;border-radius:10px;font-size:15px}

#ago-widget-v7.mode-horizontal .ago-detail{width:min(312px, calc(100vw - 20px));max-width:min(312px, calc(100vw - 20px));}
#ago-widget-v7.mode-horizontal .ago-detail.placement-above{bottom:calc(100% + 8px);top:auto}
#ago-widget-v7.mode-horizontal .ago-detail.placement-below{top:calc(100% + 8px);bottom:auto}
#ago-widget-v7.mode-horizontal .ago-foot{display:none}
#ago-widget-v7.mode-horizontal .ago-updated-short{display:none}
#ago-widget-v7.mode-horizontal .ago-updated-full{display:none}
#ago-widget-v7.mode-horizontal .ago-error{display:none}
#ago-widget-v7.mode-horizontal .ago-detail{position:absolute;top:100%;margin-top:8px}
#ago-widget-v7.mode-horizontal .ago-menu.menu-above{
  bottom:calc(100% + 6px);
  top:auto;
  right:0;
  left:auto;
}
#ago-widget-v7.mode-horizontal .ago-menu.menu-below{
  top:calc(100% + 6px);
  bottom:auto;
  right:0;
  left:auto;
}

#ago-widget-v7.mode-full .ago-updated-short{display:none}
#ago-widget-v7.mode-full .ago-updated-full{display:block}

@keyframes agoCardPulse {
  0% { transform: translateX(0) rotate(0deg); box-shadow:0 8px 18px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.44), 0 0 0 rgba(255,255,255,0); }
  8% { transform: translateX(-1px) rotate(-0.5deg); }
  16% { transform: translateX(1.5px) rotate(0.6deg); }
  24% { transform: translateX(-1.5px) rotate(-0.5deg); }
  32% { transform: translateX(1px) rotate(0.4deg); }
  40% { transform: translateX(0) rotate(0deg); }
  50% { box-shadow:0 12px 22px rgba(15,23,42,.14), inset 0 1px 0 rgba(255,255,255,.46), 0 0 26px var(--ago-glow, rgba(255,255,255,.45)); }
  100% { transform: translateX(0) rotate(0deg); box-shadow:0 8px 18px rgba(15,23,42,.08), inset 0 1px 0 rgba(255,255,255,.44), 0 0 0 rgba(255,255,255,0); }
}
.ago-card.ago-attention{
  animation: agoCardPulse 1.2s ease-in-out 0s 6 both;
  filter:saturate(1.06) brightness(1.03);
}
.ago-card.ago-red{--ago-glow: rgba(244,67,54,.45)}
.ago-card.ago-blue{--ago-glow: rgba(33,150,243,.45)}
.ago-card.ago-green{--ago-glow: rgba(76,175,80,.45)}
.ago-card.ago-pink{--ago-glow: rgba(236,72,153,.42)}
    `;
    document.head.appendChild(s);
  }

  function applyWidgetVisibility() {
    const widget = document.getElementById("ago-widget-v7");
    if (!widget) return;
    widget.style.display = widgetEnabled ? "" : "none";
    if (!widgetEnabled) {
      toggleMenu(false);
      closeDetailPanel();
    }
  }

  function createUI() {
    injectCSS();

    const wrap = document.createElement("div");
    wrap.id = "ago-widget-v7";
    wrap.className = "mode-full";
    wrap.innerHTML = `<div class="ago-panel" id="ago-panel">
  <div class="ago-head" id="ago-head">
    <div class="ago-title">
      <span class="ago-live-dot" id="ago-status-dot"></span>
      <span class="ago-title-text"><span class="ago-title-main" id="ago-live-title">AGO · 01/01/2026 · 00:00</span><span class="ago-title-sub"></span></span>
    </div>
  </div>
  <div class="ago-body" id="ago-body">
    <div class="ago-grid">
      <div class="ago-card ago-c1 ago-red" id="ago-card-cbt" title="TIN CHỜ" data-status-key="choBienTap">
        <div class="ago-card-top">
          <span class="ago-card-icon">🕒</span>
          <div class="ago-card-label">TIN CHỜ</div>
        </div>
        <div class="ago-card-value" id="ago-cbt">0</div>
        <div class="ago-card-hint">Bấm để xem tin</div>
      </div>
      <div class="ago-card ago-c2 ago-blue" id="ago-card-kt" title="KỸ THUẬT" data-status-key="kyThuat">
        <div class="ago-card-top">
          <span class="ago-card-icon">🛠️</span>
          <div class="ago-card-label">KỸ THUẬT</div>
        </div>
        <div class="ago-card-value" id="ago-kt">0</div>
        <div class="ago-card-hint">Bấm để xem tin</div>
      </div>
      <div class="ago-card ago-c3 ago-green" id="ago-card-b1" title="BƯỚC 1" data-status-key="daBienTapB1">
        <div class="ago-card-top">
          <span class="ago-card-icon">✍️</span>
          <div class="ago-card-label">BƯỚC 1</div>
        </div>
        <div class="ago-card-value" id="ago-b1">0</div>
        <div class="ago-card-hint">Bấm để xem tin</div>
      </div>
      <div class="ago-card ago-c4 ago-pink" id="ago-card-b2" title="BƯỚC 2" data-status-key="daBienTapB2">
        <div class="ago-card-top">
          <span class="ago-card-icon">✔️</span>
          <div class="ago-card-label">BƯỚC 2</div>
        </div>
        <div class="ago-card-value" id="ago-b2">0</div>
        <div class="ago-card-hint">Bấm để xem tin</div>
      </div>
    </div>
  </div>
  <div class="ago-head-right">
    <button class="ago-icon-btn" id="ago-gear-btn" title="Ẩn / Hiện"><span class="ago-gear-spin">${SETTINGS_ICON}</span></button>
    <div class="ago-menu ago-menu-min" id="ago-gear-menu">
      <div class="ago-menu-row">
        <div class="ago-menu-inline-label">Ẩn / hiện</div>
        <button class="ago-menu-icon-item" id="ago-toggle-mode-btn" title="Đổi chế độ hiển thị" aria-label="Đổi chế độ hiển thị">
          <span class="ago-menu-icon" id="ago-toggle-mode-icon">${EYE_OPEN_ICON}</span>
        </button>
      </div>
      <div class="ago-menu-row">
        <div class="ago-menu-inline-label">Thông báo</div>
        <button class="ago-menu-icon-item is-on" id="ago-toggle-notify-btn" title="Bật hoặc tắt thông báo" aria-label="Bật hoặc tắt thông báo">
          <span class="ago-menu-icon" id="ago-toggle-notify-icon">${BELL_ON_SVG}</span>
        </button>
      </div>
    </div>
  </div>
  <div class="ago-foot">
    <div id="ago-updated"><span class="ago-updated-full">Cập nhật: Chưa có dữ liệu</span><span class="ago-updated-short">CN: --</span></div>
    <div id="ago-error" class="ago-error"></div>
  </div>
</div>
<div class="ago-detail" id="ago-detail-panel"></div>`;

    document.body.appendChild(wrap);

    initControls();
    initCardClicks();
    enableDrag();
    loadSettings();
    listenStorage();
    startAgoWidgetHeaderClock();
    bindOutsideCloseForIframes();
  }


  let agoWidgetHeaderTimer = 0;

  function formatAgoWidgetHeader() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `AGO · ${dd}/${mm}/${yyyy} · ${hh}:${min}`;
  }

  function updateAgoWidgetHeader() {
    const el = document.getElementById("ago-live-title");
    if (!el) return;
    el.textContent = formatAgoWidgetHeader();
  }

  function startAgoWidgetHeaderClock() {
    updateAgoWidgetHeader();
    if (agoWidgetHeaderTimer) {
      window.clearInterval(agoWidgetHeaderTimer);
    }
    agoWidgetHeaderTimer = window.setInterval(updateAgoWidgetHeader, 60000);
  }

  function formatTime(ts, shortMode) {
    if (!ts) return shortMode ? "--" : "Chưa có dữ liệu";
    try {
      const d = new Date(ts);
      return shortMode ? d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : d.toLocaleString("vi-VN");
    } catch (e) {
      return shortMode ? "--" : "Chưa có dữ liệu";
    }
  }

  function parseItemTime(item) {
    if (item && Number(item.sortTime)) return Number(item.sortTime);
    const text = normalizeText(item?.createdAt || "");
    const m = text.match(/^(\d{2})-(\d{2})-(\d{2,4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!m) return 0;
    let year = Number(m[3]);
    if (year < 100) year += 2000;
    return new Date(year, Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0), Number(m[6] || 0)).getTime();
  }



  let lastRenderSignature = "";
  function snapshotSignature(data, items) {
    const d = Object.assign({}, DEFAULT, data || {});
    const activeItems = items && typeof items === "object" ? items : {};
    const filteredMap = getFilteredItemsMap(activeItems);
    const resolvedCounts = Object.keys(activeItems).length > 0 ? countsFromItems(filteredMap) : {
      choBienTap: Number(d.choBienTap || 0),
      kyThuat: Number(d.kyThuat || 0),
      daBienTapB1: Number(d.daBienTapB1 || 0),
      daBienTapB2: Number(d.daBienTapB2 || 0)
    };
    const itemSig = Object.values(filteredMap)
      .map((item) => [
        String(item?.id || ""),
        String(item?.statusKey || ""),
        String(item?.createdAt || ""),
        String(item?.sortTime || "")
      ].join("|"))
      .sort()
      .join("~~");
    return [
      resolvedCounts.choBienTap,
      resolvedCounts.kyThuat,
      resolvedCounts.daBienTapB1,
      resolvedCounts.daBienTapB2,
      Number(d.updatedAt || 0),
      d.ok === false ? 0 : 1,
      String(d.lastError || ""),
      itemSig,
      String(activeStatusKey || ""),
      expandedPanel ? 1 : 0
    ].join("::");
  }
  function getItemsByStatus(statusKey) {
    return Object.values(getFilteredItemsMap(lastItems) || {})
      .filter((item) => item && item.statusKey === statusKey)
      .sort((a, b) => {
        const diff = parseItemTime(b) - parseItemTime(a);
        if (diff) return diff;
        return Number(b?.id || 0) - Number(a?.id || 0);
      });
  }

  function flashCards(prev, next) {
    if (!prev) return;
    [
      ["choBienTap", "ago-card-cbt"],
      ["kyThuat", "ago-card-kt"],
      ["daBienTapB1", "ago-card-b1"],
      ["daBienTapB2", "ago-card-b2"]
    ].forEach(([key, id]) => {
      const before = Number(prev[key] || 0);
      const after = Number(next[key] || 0);
      if (after > before) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove("ago-attention");
        void el.offsetWidth;
        el.classList.add("ago-attention");
        clearTimeout(el.__agoAnimTimer);
        el.__agoAnimTimer = setTimeout(() => el.classList.remove("ago-attention"), 7200);
      }
    });
  }

  function updateUI(data, itemsOverride) {
    const d = Object.assign({}, DEFAULT, data || {});
    const activeItems = itemsOverride && typeof itemsOverride === "object" ? itemsOverride : lastItems;
    const nextSignature = snapshotSignature(d, activeItems);
    if (nextSignature === lastRenderSignature) return;
    lastRenderSignature = nextSignature;

    const cbt = document.getElementById("ago-cbt");
    const kt = document.getElementById("ago-kt");
    const b1 = document.getElementById("ago-b1");
    const b2 = document.getElementById("ago-b2");
    const updated = document.getElementById("ago-updated");
    const error = document.getElementById("ago-error");

    const filteredMap = getFilteredItemsMap(activeItems);
    const hasItemSnapshot = Object.keys(activeItems || {}).length > 0;
    const filteredCounts = countsFromItems(filteredMap);
    const resolvedCounts = hasItemSnapshot ? filteredCounts : {
      choBienTap: Number(d.choBienTap || 0),
      kyThuat: Number(d.kyThuat || 0),
      daBienTapB1: Number(d.daBienTapB1 || 0),
      daBienTapB2: Number(d.daBienTapB2 || 0)
    };
    if (cbt) cbt.textContent = resolvedCounts.choBienTap;
    if (kt) kt.textContent = resolvedCounts.kyThuat;
    if (b1) b1.textContent = resolvedCounts.daBienTapB1;
    if (b2) b2.textContent = resolvedCounts.daBienTapB2;

    if (updated) {
      const full = updated.querySelector(".ago-updated-full");
      const short = updated.querySelector(".ago-updated-short");
      if (full) full.textContent = `Cập nhật: ${formatTime(d.updatedAt, false)}`;
      if (short) short.textContent = `CN: ${formatTime(d.updatedAt, true)}`;
    }
    if (error) error.textContent = d.ok ? "" : (d.lastError || "Không lấy được dữ liệu");

    flashCards(lastData, { ...d, ...resolvedCounts });
    lastData = { ...d, ...resolvedCounts };
    lastItems = activeItems || {};
    if (activeStatusKey) renderDetailPanel(activeStatusKey, expandedPanel);
  }

  let snapshotReadTimer = 0;
  function scheduleSnapshotRender(delay = 90) {
    if (snapshotReadTimer) window.clearTimeout(snapshotReadTimer);
    snapshotReadTimer = window.setTimeout(async () => {
      snapshotReadTimer = 0;
      const state = await storageGet([SNAPSHOT_KEY, STORAGE_KEY, ITEMS_KEY]);
      const snapshot = state[SNAPSHOT_KEY] || null;
      if (snapshot && typeof snapshot === "object") {
        updateUI(snapshot.counts || state[STORAGE_KEY] || DEFAULT, snapshot.items || state[ITEMS_KEY] || {});
        return;
      }
      updateUI(state[STORAGE_KEY] || DEFAULT, state[ITEMS_KEY] || {});
    }, Math.max(40, Number(delay || 0)));
  }

  function listenStorage() {
    try {
      if (!chrome?.storage?.onChanged) return;
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        if (changes[SNAPSHOT_KEY] || changes[STORAGE_KEY] || changes[ITEMS_KEY]) scheduleSnapshotRender(100);
        if (Object.prototype.hasOwnProperty.call(changes, NOTIFY_KEY)) {
          notifyEnabled = changes[NOTIFY_KEY].newValue !== false;
          updateNotifyUI();
        }
        if (Object.prototype.hasOwnProperty.call(changes, FEATURE_STATUS_KEY)) {
          widgetEnabled = changes[FEATURE_STATUS_KEY].newValue !== false;
          applyWidgetVisibility();
        }
      });
    } catch (e) {}
  }

  
  function getWidgetDragBounds() {
    const widget = document.getElementById("ago-widget-v7");
    const panel = document.getElementById("ago-panel");
    const target = panel || widget;
    if (!widget || !target) return null;

    const widgetRect = widget.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return {
      width: Math.ceil(targetRect.width || target.offsetWidth || widget.offsetWidth || 0),
      height: Math.ceil(targetRect.height || target.offsetHeight || widget.offsetHeight || 0),
      offsetLeft: targetRect.left - widgetRect.left,
      offsetTop: targetRect.top - widgetRect.top
    };
  }


  function getWidgetRect() {
    const widget = document.getElementById("ago-widget-v7");
    if (!widget) return null;
    return widget.getBoundingClientRect();
  }

  function getEdgeAffinity() {
    const rect = getWidgetRect();
    if (!rect) return { horizontal: "right", vertical: "bottom" };
    const inset = getViewportSafeInsets();
    const distances = {
      left: Math.abs(rect.left - inset.left),
      right: Math.abs((window.innerWidth - inset.right) - rect.right),
      top: Math.abs(rect.top - inset.top),
      bottom: Math.abs((window.innerHeight - inset.bottom) - rect.bottom)
    };

    return {
      horizontal: distances.left <= distances.right ? "left" : "right",
      vertical: distances.top <= distances.bottom ? "top" : "bottom"
    };
  }

  function getPositionFromAffinity(affinity) {
    const bounds = getWidgetDragBounds();
    const inset = getViewportSafeInsets();
    if (!bounds) return { left: inset.left, top: inset.top };

    const left = affinity?.horizontal === "left"
      ? inset.left - bounds.offsetLeft
      : window.innerWidth - bounds.width - inset.right - bounds.offsetLeft;

    const top = affinity?.vertical === "top"
      ? inset.top - bounds.offsetTop
      : window.innerHeight - bounds.height - inset.bottom - bounds.offsetTop;

    return clampWidgetPosition(left, top);
  }

  function stabilizeWidgetAfterLayout(options = {}) {
    const widget = document.getElementById("ago-widget-v7");
    if (!widget) return;

    const { preserveAffinity = false, useSnap = false } = options;
    const affinity = preserveAffinity ? getEdgeAffinity() : null;

    const apply = () => {
      const finalPos = preserveAffinity ? getPositionFromAffinity(affinity) : (useSnap ? getSnapWidgetPosition(parseFloat(widget.style.left) || widget.getBoundingClientRect().left || 20, parseFloat(widget.style.top) || widget.getBoundingClientRect().top || 20) : clampWidgetPosition(parseFloat(widget.style.left) || widget.getBoundingClientRect().left || 20, parseFloat(widget.style.top) || widget.getBoundingClientRect().top || 20));
      widget.style.left = `${finalPos.left}px`;
      widget.style.top = `${finalPos.top}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
      saveFreePosition(finalPos.left, finalPos.top);
      if (activeStatusKey) updateDetailPlacement();
      positionMenu();
    };

    apply();
    requestAnimationFrame(apply);
    clearTimeout(modeTransitionTimer);
    modeTransitionTimer = setTimeout(apply, 120);
  }

  function getViewportSafeInsets() {
    const docEl = document.documentElement;
    const scrollbarRight = Math.max(0, window.innerWidth - (docEl?.clientWidth || window.innerWidth));
    const scrollbarBottom = Math.max(0, window.innerHeight - (docEl?.clientHeight || window.innerHeight));
    return {
      left: 6,
      top: 6,
      right: 6 + scrollbarRight,
      bottom: 6 + scrollbarBottom
    };
  }

  function clampWidgetPosition(left, top) {
    const bounds = getWidgetDragBounds();
    const inset = getViewportSafeInsets();
    if (!bounds) {
      return { left: Math.max(inset.left, left || 0), top: Math.max(inset.top, top || 0) };
    }

    const minLeft = inset.left - bounds.offsetLeft;
    const maxLeft = window.innerWidth - bounds.width - inset.right - bounds.offsetLeft;
    const minTop = inset.top - bounds.offsetTop;
    const maxTop = window.innerHeight - bounds.height - inset.bottom - bounds.offsetTop;

    return {
      left: Math.min(Math.max(minLeft, left), Math.max(minLeft, maxLeft)),
      top: Math.min(Math.max(minTop, top), Math.max(minTop, maxTop))
    };
  }


  function rectsOverlap(a, b, gap = 12) {
    if (!a || !b) return false;
    return !(a.right + gap <= b.left || a.left >= b.right + gap || a.bottom + gap <= b.top || a.top >= b.bottom + gap);
  }

  function resolveFloatingOverlap(movingId = "widget") {
    const widgetEl = document.getElementById("ago-widget-v7");
    const buttonEl = document.getElementById("crmag-paste-link-btn");
    if (!widgetEl || !buttonEl) return;

    const widgetRect = widgetEl.getBoundingClientRect();
    const buttonRect = buttonEl.getBoundingClientRect();
    if (!rectsOverlap(widgetRect, buttonRect, 10)) return;

    const gap = 14;
    const targetEl = movingId === "widget" ? buttonEl : widgetEl;
    const targetRect = movingId === "widget" ? buttonRect : widgetRect;
    const moverRect = movingId === "widget" ? widgetRect : buttonRect;

    const candidates = [
      { left: moverRect.left, top: moverRect.top - targetRect.height - gap },
      { left: moverRect.left, top: moverRect.bottom + gap },
      { left: moverRect.left - targetRect.width - gap, top: moverRect.top },
      { left: moverRect.right + gap, top: moverRect.top },
      { left: moverRect.right + gap, top: moverRect.bottom + gap },
      { left: moverRect.left - targetRect.width - gap, top: moverRect.top - targetRect.height - gap }
    ];

    const clampForTarget = (left, top) => {
      if (movingId === "widget") {
        const maxLeft = window.innerWidth - targetEl.offsetWidth - 8;
        const maxTop = window.innerHeight - targetEl.offsetHeight - 8;
        return {
          left: Math.max(8, Math.min(maxLeft, left)),
          top: Math.max(8, Math.min(maxTop, top))
        };
      }
      return clampWidgetPosition(left, top);
    };

    let best = null;
    for (const candidate of candidates) {
      const pos = clampForTarget(candidate.left, candidate.top);
      const nextRect = {
        left: pos.left,
        top: pos.top,
        right: pos.left + targetRect.width,
        bottom: pos.top + targetRect.height
      };
      if (rectsOverlap(moverRect, nextRect, 10)) continue;
      const distance = Math.hypot(pos.left - targetRect.left, pos.top - targetRect.top);
      if (!best || distance < best.distance) best = { ...pos, distance };
    }

    if (!best) {
      const fallback = clampForTarget(targetRect.left, moverRect.bottom + gap);
      best = { ...fallback };
    }

    targetEl.style.left = `${best.left}px`;
    targetEl.style.top = `${best.top}px`;
    targetEl.style.right = "auto";
    targetEl.style.bottom = "auto";

    if (movingId === "widget") {
      try {
        window.dispatchEvent(new CustomEvent("ago-floating-position-sync", {
          detail: { source: "widget", target: "paste", left: best.left, top: best.top }
        }));
      } catch (e) {}
    } else {
      saveFreePosition(best.left, best.top);
      try {
        window.dispatchEvent(new CustomEvent("ago-floating-position-sync", {
          detail: { source: "paste", target: "widget", left: best.left, top: best.top }
        }));
      } catch (e) {}
    }
  }

  const SNAP_THRESHOLD = 52;

  function getSnapWidgetPosition(left, top) {
    const bounds = getWidgetDragBounds();
    const clamped = clampWidgetPosition(left, top);
    if (!bounds) return clamped;

    const inset = getViewportSafeInsets();
    const threshold = SNAP_THRESHOLD;

    const edges = {
      left: inset.left - bounds.offsetLeft,
      right: window.innerWidth - bounds.width - inset.right - bounds.offsetLeft,
      top: inset.top - bounds.offsetTop,
      bottom: window.innerHeight - bounds.height - inset.bottom - bounds.offsetTop
    };

    let nextLeft = clamped.left;
    let nextTop = clamped.top;

    if (Math.abs(clamped.left - edges.left) <= threshold) nextLeft = edges.left;
    else if (Math.abs(clamped.left - edges.right) <= threshold) nextLeft = edges.right;

    if (Math.abs(clamped.top - edges.top) <= threshold) nextTop = edges.top;
    else if (Math.abs(clamped.top - edges.bottom) <= threshold) nextTop = edges.bottom;

    return clampWidgetPosition(nextLeft, nextTop);
  }

  function normalizeWidgetPosition(useSnap = true) {
    const widget = document.getElementById("ago-widget-v7");
    if (!widget) return;

    const rect = widget.getBoundingClientRect();
    let left = Number.isFinite(rect.left) ? rect.left : 20;
    let top = Number.isFinite(rect.top) ? rect.top : 20;
    const finalPos = useSnap ? getSnapWidgetPosition(left, top) : clampWidgetPosition(left, top);

    widget.style.left = `${finalPos.left}px`;
    widget.style.top = `${finalPos.top}px`;
    widget.style.right = "auto";
    widget.style.bottom = "auto";

    saveFreePosition(finalPos.left, finalPos.top);
  }

function updateModeUI(options = {}) {
    const widget = document.getElementById("ago-widget-v7");
    if (!widget) return;
    widget.classList.remove("mode-full", "mode-vertical", "mode-horizontal");
    widget.classList.add(`mode-${currentMode}`);

    updateDetailPlacement();
    positionMenu();
    const toggleModeIcon = document.getElementById("ago-toggle-mode-icon");
    const toggleModeBtn = document.getElementById("ago-toggle-mode-btn");
    if (toggleModeIcon) toggleModeIcon.textContent = currentMode === MODES.full ? EYE_OPEN_ICON : EYE_CLOSED_ICON;
    if (toggleModeBtn) toggleModeBtn.classList.add("is-active");
    updateNotifyUI();

    if (options.reposition !== false) {
      requestAnimationFrame(() => stabilizeWidgetAfterLayout({ preserveAffinity: true }));
    }
  }

  
  function updateNotifyUI() {
    const btn = document.getElementById("ago-toggle-notify-btn");
    const icon = document.getElementById("ago-toggle-notify-icon");
    if (!btn || !icon) return;
    btn.classList.toggle("is-on", !!notifyEnabled);
    btn.classList.toggle("is-off", !notifyEnabled);
    icon.innerHTML = notifyEnabled ? BELL_ON_SVG : BELL_OFF_SVG;
  }

  function positionMenu() {
    const widget = document.getElementById("ago-widget-v7");
    const menu = document.getElementById("ago-gear-menu");
    if (!widget || !menu) return;

    const rect = widget.getBoundingClientRect();
    const menuH = Math.max(menu.offsetHeight || 0, 52);
    const spaceTop = rect.top - 8;
    const spaceBottom = window.innerHeight - rect.bottom - 8;

    menu.classList.remove("menu-left", "menu-right", "menu-above", "menu-below", "menu-full-above", "menu-full-below");

    if (currentMode === MODES.full) {
      const preferBelow = spaceBottom >= menuH || spaceBottom >= spaceTop;
      menu.classList.add(preferBelow ? "menu-full-below" : "menu-full-above");
      return;
    }

    if (spaceBottom >= menuH || spaceBottom >= spaceTop) menu.classList.add("menu-below");
    else menu.classList.add("menu-above");
  }

function toggleMenu(force) {
    const menu = document.getElementById("ago-gear-menu");
    if (!menu) return;
    const open = typeof force === "boolean" ? force : !menu.classList.contains("open");
    if (open) positionMenu();
    menu.classList.toggle("open", open);
  }

  function isActionLikeLink(link) {
    const haystack = normalizeText([
      link?.getAttribute?.("href"),
      link?.getAttribute?.("title"),
      link?.getAttribute?.("aria-label"),
      link?.textContent,
      link?.innerText,
      link?.querySelector?.("img")?.getAttribute?.("alt"),
      link?.querySelector?.("img")?.getAttribute?.("title")
    ].filter(Boolean).join(" ")).toLowerCase();

    return /(sua|edit|cap nhat|update|chi tiet|detail|view|open|tin)/.test(haystack);
  }

  function scrollToRow(row) {
    try {
      row.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      row.classList.add("ago-widget-row-highlight");
      clearTimeout(row.__agoHighlightTimer);
      row.__agoHighlightTimer = setTimeout(() => row.classList.remove("ago-widget-row-highlight"), 2200);
    } catch (e) {}
  }

  function buildCrmEditUrl(itemId) {
    const targetId = normalizeText(itemId);
    if (!targetId) return "";
    return `https://crmag.baoangiang.com.vn/news/edit?id=${encodeURIComponent(targetId)}&lang=vi`;
  }

  function sanitizeCrmOpenUrl(candidate) {
    const raw = normalizeText(candidate || "");
    if (!raw) return "";
    try {
      const url = new URL(raw, "https://crmag.baoangiang.com.vn/");
      if (!/(^|\.)crmag\.baoangiang\.com\.vn$/i.test(url.hostname)) return "";
      const path = (url.pathname || "").toLowerCase();
      const id = normalizeText(url.searchParams.get("id") || url.searchParams.get("intResult") || "");
      if (!/^\d+$/.test(id)) return "";
      if (path.includes("/news/edit")) {
        url.searchParams.set("id", id);
        if (!url.searchParams.get("lang")) url.searchParams.set("lang", "vi");
        return url.href;
      }
      if (path.includes("/updatenews/add") || path.includes("/updatenews/index")) {
        return buildCrmEditUrl(id);
      }
      if (path.includes("/news/")) {
        return buildCrmEditUrl(id);
      }
    } catch (e) {}
    return "";
  }


  function maybeConsumeCrmBridgeRedirect() {
    try {
      const here = new URL(window.location.href);
      const path = (here.pathname || "").toLowerCase();
      const hash = String(here.hash || "");
      if (!/(^|\.)crmag\.baoangiang\.com\.vn$/i.test(here.hostname)) return;
      if (!path.includes('/news/index')) return;
      if (!hash.startsWith('#ago-open=')) return;

      const targetRaw = decodeURIComponent(hash.slice('#ago-open='.length));
      const targetUrl = sanitizeCrmOpenUrl(targetRaw);
      const cleanUrl = `${here.origin}${here.pathname}${here.search || ''}`;
      const bridgeKey = 'agoCrmBridgeConsumed';
      const bridgeToken = `${hash}`;
      let consumedToken = '';
      try { consumedToken = sessionStorage.getItem(bridgeKey) || ''; } catch (e) {}

      if (!targetUrl) {
        try { history.replaceState(null, '', cleanUrl); } catch (e) {}
        return;
      }

      if (consumedToken === bridgeToken) {
        try { sessionStorage.removeItem(bridgeKey); } catch (e) {}
        try { history.replaceState(null, '', cleanUrl); } catch (e) {}
        return;
      }

      try { sessionStorage.setItem(bridgeKey, bridgeToken); } catch (e) {}
      setTimeout(() => {
        try { window.location.assign(targetUrl); } catch (e) {}
      }, 30);
    } catch (e) {}
  }

  maybeConsumeCrmBridgeRedirect();

  function getItemOpenUrl(itemId) {
    const targetId = normalizeText(itemId);
    if (!targetId) return "";
    const item = lastItems?.[targetId];
    return sanitizeCrmOpenUrl(item?.openUrl || item?.editUrl || "") || buildCrmEditUrl(targetId);
  }

  function isDuplicateOpenRequest(itemId, url) {
    const now = Date.now();
    const sameItem = itemId && lastOpenRequest.itemId === itemId;
    const sameUrl = url && lastOpenRequest.url === url;
    if ((sameItem || sameUrl) && now - lastOpenRequest.at < 1500) {
      return true;
    }
    lastOpenRequest = { itemId: itemId || "", url: url || "", at: now };
    return false;
  }

  function requestSmartOpenUrl(url, itemId) {
    const absoluteUrl = sanitizeCrmOpenUrl(url) || url;
    if (!absoluteUrl) return Promise.resolve(false);
    if (isDuplicateOpenRequest(itemId, absoluteUrl)) return Promise.resolve(true);

    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ type: "AGO_SMART_OPEN_URL", url: absoluteUrl }, (response) => {
          if (chrome.runtime.lastError) {
            resolve(false);
            return;
          }
          resolve(!!response?.ok);
        });
      } catch (e) {
        resolve(false);
      }
    });
  }

  function openItemInCRM(itemId) {
    const targetId = normalizeText(itemId);
    if (!targetId) return Promise.resolve(false);

    const editUrl = getItemOpenUrl(targetId) || buildCrmEditUrl(targetId);
    return requestSmartOpenUrl(editUrl, targetId);
  }

  
  function updateDetailPlacement() {
    const widget = document.getElementById("ago-widget-v7");
    const panel = document.getElementById("ago-detail-panel");
    if (!widget || !panel) return;

    const rect = widget.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const panelHeight = Math.min(Math.max(panelRect.height || panel.offsetHeight || 0, 96), 320);
    const panelWidth = Math.min(Math.max(panelRect.width || panel.offsetWidth || 0, 220), window.innerWidth - 20);
    const spaceAbove = rect.top - 8;
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceLeft = rect.right - 8;
    const spaceRight = window.innerWidth - rect.left - 8;
    const widgetCenterX = rect.left + (rect.width / 2);
    let preferExpandLeft = widgetCenterX >= (window.innerWidth / 2);
    if (preferExpandLeft && spaceLeft < panelWidth && spaceRight > spaceLeft) preferExpandLeft = false;
    if (!preferExpandLeft && spaceRight < panelWidth && spaceLeft > spaceRight) preferExpandLeft = true;

    panel.classList.remove("placement-above", "placement-below", "placement-left", "placement-right");

    const preferAbove = spaceBelow < panelHeight && spaceAbove > spaceBelow;
    panel.classList.add(preferAbove ? "placement-above" : "placement-below");
    panel.classList.add(preferExpandLeft ? "placement-left" : "placement-right");
  }

function renderDetailPanel(statusKey, expandAll) {
    const panel = document.getElementById("ago-detail-panel");
    if (!panel) return;
    const meta = STATUS_META[statusKey];
    if (!meta) {
      panel.classList.remove("open");
      panel.innerHTML = "";
      return;
    }

    const items = getItemsByStatus(statusKey);
    const previewItems = expandAll ? items : items.slice(0, PREVIEW_LIMIT);
    const hasMore = items.length > PREVIEW_LIMIT;
    const listClass = expandAll ? "ago-detail-list is-expanded" : "ago-detail-list";

    const listHtml = previewItems.length ? previewItems.map((item) => `
      <div class="ago-detail-item">
        <button class="ago-detail-item-link" type="button" data-item-id="${escapeHtml(item.id || "")}">${escapeHtml(item.title || `Tin #${item.id || ""}`)}</button>
        <div class="ago-detail-meta">
          <span class="ago-detail-author">${escapeHtml(item.author || "—")}</span>
        </div>
      </div>
    `).join("") : `<div class="ago-detail-empty">Chưa có tin ở trạng thái này.</div>`;

    panel.className = `ago-detail ${meta.theme || ""}`.trim();
    panel.innerHTML = `
      <div class="ago-detail-body">
        <div class="${listClass}">${listHtml}</div>
        ${hasMore ? `<button class="ago-detail-more" id="ago-detail-more">${expandAll ? 'Thu gọn' : 'Xem thêm'}</button>` : ''}
      </div>
    `;
    updateDetailPlacement();
    panel.classList.add("open");
    requestAnimationFrame(() => updateDetailPlacement());

    const moreBtn = document.getElementById("ago-detail-more");
    moreBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      expandedPanel = !expandedPanel;
      renderDetailPanel(statusKey, expandedPanel);
    });


    panel.querySelectorAll(".ago-detail-item-link").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const itemId = btn.getAttribute("data-item-id") || "";
        openItemInCRM(itemId).then((opened) => {
          if (!opened) {
            btn.title = "Không mở được liên kết";
          }
        });
      });
    });

    Object.entries(STATUS_META).forEach(([key, value]) => {
      const card = document.getElementById(value.cardId);
      if (card) card.classList.toggle("is-open", key === statusKey);
    });
  }

  function closeDetailPanel() {
    activeStatusKey = "";
    expandedPanel = false;
    const panel = document.getElementById("ago-detail-panel");
    if (panel) {
      panel.classList.remove("open");
      panel.innerHTML = "";
    }
    Object.values(STATUS_META).forEach((meta) => {
      const card = document.getElementById(meta.cardId);
      if (card) card.classList.remove("is-open");
    });
  }

  function initCardClicks() {
    Object.entries(STATUS_META).forEach(([statusKey, meta]) => {
      const card = document.getElementById(meta.cardId);
      card?.addEventListener("click", (e) => {
        if (dragState) return;
        if (e.target.closest(".ago-icon-btn") || e.target.closest(".ago-menu")) return;
        e.preventDefault();
        e.stopPropagation();
        if (activeStatusKey === statusKey) {
          closeDetailPanel();
          return;
        }
        activeStatusKey = statusKey;
        expandedPanel = false;
        renderDetailPanel(statusKey, false);
      });
    });
  }

  function initControls() {
    const gearBtn = document.getElementById("ago-gear-btn");
    const toggleModeBtn = document.getElementById("ago-toggle-mode-btn");
    const toggleNotifyBtn = document.getElementById("ago-toggle-notify-btn");

    gearBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    toggleModeBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentMode = currentMode === MODES.full ? MODES.horizontal : MODES.full;
      storageSet({ [MODE_KEY]: currentMode });
      updateModeUI({ reposition: true });
      toggleMenu(false);
    });

    toggleNotifyBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      notifyEnabled = !notifyEnabled;
      storageSet({ [NOTIFY_KEY]: notifyEnabled });
      updateNotifyUI();
      toggleMenu(false);
    });

    document.addEventListener("click", (e) => {
      const headRight = document.querySelector(".ago-head-right");
      if (!headRight?.contains(e.target)) toggleMenu(false);
      closeDetailPanelFromOutsideTarget(e.target);
    });
  }


  function closeDetailPanelFromOutsideTarget(target) {
    const widget = document.getElementById("ago-widget-v7");
    if (!activeStatusKey || !widget) return;
    if (target && widget.contains(target)) return;
    closeDetailPanel();
  }

  function bindOutsideCloseForIframes() {
    const wireFrame = (frame) => {
      if (!frame || frame.__agoOutsideCloseBound) return;
      frame.__agoOutsideCloseBound = true;

      const onFrameInteract = () => {
        window.setTimeout(() => closeDetailPanelFromOutsideTarget(frame), 0);
      };

      frame.addEventListener("pointerdown", onFrameInteract, true);
      frame.addEventListener("mousedown", onFrameInteract, true);
      frame.addEventListener("focus", onFrameInteract, true);

      const bindInnerDoc = () => {
        try {
          const innerDoc = frame.contentDocument || frame.contentWindow?.document;
          if (!innerDoc || innerDoc.__agoOutsideCloseBound) return;
          innerDoc.__agoOutsideCloseBound = true;
          innerDoc.addEventListener("pointerdown", onFrameInteract, true);
          innerDoc.addEventListener("mousedown", onFrameInteract, true);
          innerDoc.addEventListener("focusin", onFrameInteract, true);
          innerDoc.addEventListener("click", onFrameInteract, true);
        } catch (e) {}
      };

      frame.addEventListener("load", bindInnerDoc, true);
      bindInnerDoc();
    };

    const scanFrames = () => {
      try {
        document.querySelectorAll("iframe").forEach((frame) => {
          const widget = document.getElementById("ago-widget-v7");
          if (widget && widget.contains(frame)) return;
          wireFrame(frame);
        });
      } catch (e) {}
    };

    scanFrames();

    if (window.MutationObserver) {
      const mo = new MutationObserver(() => scanFrames());
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }

    window.addEventListener("blur", () => {
      window.setTimeout(() => {
        const activeEl = document.activeElement;
        if (activeEl && activeEl.tagName === "IFRAME") {
          closeDetailPanelFromOutsideTarget(activeEl);
        }
      }, 0);
    });
  }

  function saveFreePosition(left, top) {
    storageSet({ [POS_KEY]: { left, top } });
  }

  function applyFreePosition(pos) {
    const w = document.getElementById("ago-widget-v7");
    if (!w || !pos) return;
    const finalPos = getSnapWidgetPosition(Number(pos.left) || 20, Number(pos.top) || 20);
    w.style.left = `${finalPos.left}px`;
    w.style.top = `${finalPos.top}px`;
    w.style.right = "auto";
    w.style.bottom = "auto";
  }

  function enableDrag() {
    const widget = document.getElementById("ago-widget-v7");
    const panel = document.getElementById("ago-panel");
    if (!widget || !panel) return;

    const getPoint = (e) => ({ x: e.clientX, y: e.clientY });

    const applyDragPosition = () => {
      dragFrame = 0;
      if (!dragState) return;
      const clamped = clampWidgetPosition(dragState.nextLeft, dragState.nextTop);
      widget.style.left = `${clamped.left}px`;
      widget.style.top = `${clamped.top}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
      resolveFloatingOverlap("widget");
      if (activeStatusKey) updateDetailPlacement();
      positionMenu();
    };

    const queueApplyDragPosition = () => {
      if (dragFrame) return;
      dragFrame = requestAnimationFrame(applyDragPosition);
    };

    const onMove = (e) => {
      if (!dragState) return;
      const point = getPoint(e);
      const dx = point.x - dragState.startX;
      const dy = point.y - dragState.startY;

      if (!dragState.moved) {
        if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
        dragState.moved = true;
        widget.classList.add("ago-dragging");
      }

      dragState.nextLeft = dragState.originLeft + dx;
      dragState.nextTop = dragState.originTop + dy;
      if (e.cancelable) e.preventDefault();
      queueApplyDragPosition();
    };

    const endDrag = (e) => {
      if (!dragState) return;
      const pointerId = dragState.pointerId;
      const wasMoved = dragState.moved;
      dragState = null;
      widget.classList.remove("ago-dragging");
      if (dragFrame) {
        cancelAnimationFrame(dragFrame);
        dragFrame = 0;
      }
      if (wasMoved) {
        normalizeWidgetPosition(true);
        resolveFloatingOverlap("widget");
        saveFreePosition(parseFloat(widget.style.left) || 20, parseFloat(widget.style.top) || 20);
      }
      try { panel.releasePointerCapture(pointerId); } catch (_) {}
      if (e?.cancelable) e.preventDefault();
    };

    const startDrag = (e) => {
      const target = e.target;
      if (target.closest(".ago-icon-btn") || target.closest(".ago-menu") || target.closest(".ago-detail") || target.closest(".ago-card")) return;
      if (e.button != null && e.button !== 0) return;
      const rect = widget.getBoundingClientRect();
      const point = getPoint(e);
      dragState = {
        pointerId: e.pointerId,
        startX: point.x,
        startY: point.y,
        originLeft: rect.left,
        originTop: rect.top,
        nextLeft: rect.left,
        nextTop: rect.top,
        moved: false
      };
      widget.style.left = `${rect.left}px`;
      widget.style.top = `${rect.top}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
      try { panel.setPointerCapture(e.pointerId); } catch (_) {}
      if (e.cancelable) e.preventDefault();
    };

    panel.style.touchAction = "none";
    panel.addEventListener("pointerdown", startDrag);
    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerup", endDrag);
    panel.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", () => { normalizeWidgetPosition(false); resolveFloatingOverlap("widget"); if (activeStatusKey) updateDetailPlacement(); positionMenu(); }, { passive: true });
    window.addEventListener("ago-floating-position-sync", (event) => {
      const detail = event?.detail || {};
      if (detail.target !== "widget") return;
      const pos = clampWidgetPosition(Number(detail.left) || 20, Number(detail.top) || 20);
      widget.style.left = `${pos.left}px`;
      widget.style.top = `${pos.top}px`;
      widget.style.right = "auto";
      widget.style.bottom = "auto";
      saveFreePosition(pos.left, pos.top);
      if (activeStatusKey) updateDetailPlacement();
      positionMenu();
    });

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => {
        if (dragState) return;
        stabilizeWidgetAfterLayout({ preserveAffinity: true });
        resolveFloatingOverlap("widget");
      });
      ro.observe(widget);
      ro.observe(panel);
    }
  }

  async function loadSettings() {
    const state = await storageGet([POS_KEY, MODE_KEY, NOTIFY_KEY, FEATURE_STATUS_KEY, SNAPSHOT_KEY, STORAGE_KEY, ITEMS_KEY]);
    const pos = state[POS_KEY];
    const mode = state[MODE_KEY];
    if (mode && Object.values(MODES).includes(mode)) currentMode = mode;
    else currentMode = MODES.full;
    notifyEnabled = state[NOTIFY_KEY] !== false;
    widgetEnabled = state[FEATURE_STATUS_KEY] !== false;
    updateModeUI({ reposition: false });
    if (pos) applyFreePosition(pos);
    else stabilizeWidgetAfterLayout({ preserveAffinity: true });
    requestAnimationFrame(() => resolveFloatingOverlap("widget"));
    const snapshot = state[SNAPSHOT_KEY] || null;
    if (snapshot && typeof snapshot === "object") updateUI(snapshot.counts || state[STORAGE_KEY] || DEFAULT, snapshot.items || state[ITEMS_KEY] || {});
    else updateUI(state[STORAGE_KEY] || DEFAULT, state[ITEMS_KEY] || {});
    applyWidgetVisibility();
  }

  createUI();
})();


/* layout fix injected */
const __AGO_LAYOUT_FIX_STYLE__ = `
.ago-detail-item{display:flex;align-items:center;gap:6px}
.ago-detail-title{flex:1 1 auto;text-align:left;color:#4a4a4a;font-weight:600;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ago-detail-meta{margin-left:auto}
.ago-detail-author{text-align:right}
`;
try{
  const s=document.createElement('style');
  s.textContent=__AGO_LAYOUT_FIX_STYLE__;
  document.documentElement.appendChild(s);
}catch(e){}

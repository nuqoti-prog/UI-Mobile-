(function () {
  'use strict';

  const TITLE_SEL = '#news_title';
  const SAPO_SEL = '#news_subcontent';
  const CHAPEAU_SEL = '#news_headline';
  const PROVINCE_SEL = '#province';
  const CONTENT_IFRAME_SEL = 'iframe.cke_wysiwyg_frame';

  function debounce(fn, wait) {
    let t = null;
    return function () {
      const ctx = this;
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait || 220);
    };
  }

  function prepareExactText(str) {
    if (!str) return '';
    return String(str)
      .replace(/[\u00A0\u200B-\u200D\uFEFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function makeBoundaryRegex(phrase) {
    const p = escapeRegExp(phrase);
    return new RegExp('(^|[^\\p{L}\\p{N}])' + p + '(?=$|[^\\p{L}\\p{N}])', 'gu');
  }

  function ensureStyles() {
    if (document.getElementById('tm-province-style')) return;

    const css = [
      '#tm-province-suggest-wrap{display:inline-block;position:relative;margin-left:4px;vertical-align:middle;font-size:12px;}',
      '#tm-province-suggest-btn{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:3px;height:26px;padding:0 8px;border:1px solid rgba(124,58,237,.22);background:#fbf7ff;color:#6d28d9;border-radius:999px;cursor:pointer;line-height:1;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:none;transition:all .15s ease;outline:none;}',
      '#tm-province-suggest-btn:hover{background:#f4ecff;border-color:rgba(124,58,237,.30);}',
      '#tm-province-suggest-btn.has-items::after{content:"▼";font-size:8px;opacity:.72;}',
      '#tm-province-suggest-btn.tm-shake{animation:tmSuggestShake 3.8s ease-in-out infinite;}',
      '@keyframes tmSuggestShake{0%,100%{transform:translateX(0)}2%{transform:translateX(-1px) rotate(-.35deg)}4%{transform:translateX(1px) rotate(.35deg)}6%{transform:translateX(-1px) rotate(-.25deg)}8%{transform:translateX(1px) rotate(.25deg)}10%{transform:translateX(0)}}',
      '#tm-province-suggest-panel{display:none;position:absolute;top:30px;left:0;width:max-content;min-width:0;max-width:205px;max-height:300px;overflow-y:auto;background:#fff;border:1px solid rgba(124,58,237,.16);border-radius:12px;box-shadow:0 10px 22px rgba(76,29,149,.10);z-index:99999;padding:5px;}',
      '#tm-province-suggest-panel.show{display:block;animation:tmSuggestPop .18s ease-out;}',
      '@keyframes tmSuggestPop{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '.tm-province-suggest-list{display:flex;flex-direction:column;gap:4px;}',
      '.tm-province-suggest-item{display:flex;align-items:center;gap:7px;width:100%;margin:0;padding:6px 8px;box-sizing:border-box;border:1px solid rgba(124,58,237,.08);background:#fff;text-align:left;cursor:pointer;font-size:12px;color:#452661;border-radius:10px;transition:all .15s ease;}',
      '.tm-province-suggest-item:hover{transform:translateY(-1px);border-color:rgba(124,58,237,.22);box-shadow:0 6px 12px rgba(76,29,149,.08);background:#faf7ff;}',
      '.tm-province-suggest-item.tm-active{border-color:rgba(124,58,237,.28);background:#f7f1ff;box-shadow:0 6px 14px rgba(76,29,149,.08);}',
      '.tm-province-suggest-rank{flex:0 0 auto;min-width:20px;height:20px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;box-shadow:none;}',
      '.tm-rank-1{background:#e85d4f;}',
      '.tm-rank-2{background:#3b82f6;}',
      '.tm-rank-3{background:#f59e0b;}',
      '.tm-rank-empty{background:#eef0f4;color:#b8bec9;box-shadow:none;}',
      '.tm-province-suggest-main{min-width:0;display:flex;flex-direction:column;gap:0;}',
      '.tm-province-suggest-label{font-weight:700;color:#5b2b90;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;}',
      '.tm-province-suggest-meta{font-size:10px;color:#8a789d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;margin-top:1px;}',
      '.tm-province-gold-pill{display:none;}',
      '.tm-province-suggest-empty{padding:8px 10px;color:#7a6b92;font-size:11px;white-space:nowrap;}',
      '#tm-province-suggest-panel::-webkit-scrollbar{width:8px;}',
      '#tm-province-suggest-panel::-webkit-scrollbar-track{background:transparent;}',
      '#tm-province-suggest-panel::-webkit-scrollbar-thumb{background:rgba(174,112,255,.24);border-radius:999px;}'
    ].join('');

    const style = document.createElement('style');
    style.id = 'tm-province-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function ensureSuggestUI(provinceEl) {
    let wrap = document.getElementById('tm-province-suggest-wrap');
    let btn = document.getElementById('tm-province-suggest-btn');
    let panel = document.getElementById('tm-province-suggest-panel');

    if (wrap && btn && panel) {
      if (!wrap.isConnected || wrap.previousElementSibling !== provinceEl) {
        provinceEl.insertAdjacentElement('afterend', wrap);
      }
      return { wrap: wrap, btn: btn, panel: panel };
    }

    wrap = document.createElement('span');
    wrap.id = 'tm-province-suggest-wrap';

    btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'tm-province-suggest-btn';
    btn.textContent = 'Gợi ý';

    panel = document.createElement('div');
    panel.id = 'tm-province-suggest-panel';

    wrap.appendChild(btn);
    wrap.appendChild(panel);
    provinceEl.insertAdjacentElement('afterend', wrap);

    return { wrap: wrap, btn: btn, panel: panel };
  }

  function readFieldValue(el) {
    if (!el) return '';
    if (typeof el.value === 'string' && el.value) return el.value;
    return el.textContent || '';
  }

  function htmlToText(html) {
    const div = document.createElement('div');
    div.innerHTML = String(html || '');
    return (div.innerText || div.textContent || '').trim();
  }

  function isElementVisible(el) {
    if (!el || !el.isConnected) return false;
    try {
      const style = window.getComputedStyle(el);
      if (!style) return true;
      if (style.display === 'none' || style.visibility === 'hidden') return false;
    } catch (e) {}
    return true;
  }

  function getEditorFrame() {
    const frames = Array.from(document.querySelectorAll(CONTENT_IFRAME_SEL));
    for (let i = 0; i < frames.length; i++) {
      if (isElementVisible(frames[i])) return frames[i];
    }
    return frames[0] || null;
  }

  function getEditorBody() {
    try {
      const frame = getEditorFrame();
      if (!frame) return null;
      const doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      return doc && doc.body ? doc.body : null;
    } catch (e) {
      return null;
    }
  }

  function getActiveCKEditorInstance() {
    try {
      if (!(window.CKEDITOR && CKEDITOR.instances)) return null;

      const preferred = CKEDITOR.instances.news_content;
      if (preferred) {
        const container = typeof preferred.container === 'object' && preferred.container ? preferred.container.$ : null;
        const iframe = typeof preferred.window === 'object' && preferred.window && preferred.window.$ ? preferred.window.$.frameElement : null;
        if ((container && isElementVisible(container)) || (iframe && isElementVisible(iframe))) {
          return preferred;
        }
      }

      const names = Object.keys(CKEDITOR.instances || {});
      for (let i = 0; i < names.length; i++) {
        const inst = CKEDITOR.instances[names[i]];
        if (!inst) continue;
        const container = typeof inst.container === 'object' && inst.container ? inst.container.$ : null;
        const iframe = typeof inst.window === 'object' && inst.window && inst.window.$ ? inst.window.$.frameElement : null;
        if ((container && isElementVisible(container)) || (iframe && isElementVisible(iframe))) {
          return inst;
        }
      }
    } catch (e) {}
    return null;
  }

  function getEditorText() {
    try {
      const active = getActiveCKEditorInstance();
      if (active && typeof active.getData === 'function') {
        const text = htmlToText(active.getData());
        if (text) return text;
      }
    } catch (e) {}

    const body = getEditorBody();
    if (body) {
      const text = (body.innerText || body.textContent || '').trim();
      if (text) return text;
    }

    const raw = document.querySelector('#news_content, textarea[name="news_content"], textarea#news_content');
    if (raw) {
      return htmlToText(raw.value || raw.textContent || '');
    }
    return '';
  }

  function init() {
    const titleEl = document.querySelector(TITLE_SEL);
    const sapoEl = document.querySelector(SAPO_SEL);
    const chapeauEl = document.querySelector(CHAPEAU_SEL);
    const provinceEl = document.querySelector(PROVINCE_SEL);

    if (!titleEl || !sapoEl || !chapeauEl || !provinceEl) return false;
    if (provinceEl.__tmProvinceInitBound) return true;
    provinceEl.__tmProvinceInitBound = true;

    ensureStyles();

    const suggestUI = ensureSuggestUI(provinceEl);
    const suggestWrap = suggestUI.wrap;
    const suggestBtn = suggestUI.btn;
    const suggestPanel = suggestUI.panel;

    function getProvinceOptions() {
      return Array.from(provinceEl.options)
        .filter(function (o) {
          const value = String(o.value || '').trim();
          const label = (o.textContent || '').trim();
          const exactLabel = prepareExactText(label);
          if (!value || value === '0') return false;
          if (!exactLabel) return false;
          if (/^--\s*Chọn địa điểm\s*--$/.test(exactLabel)) return false;
          return true;
        })
        .map(function (o) {
          const label = (o.textContent || '').trim();
          const exactLabel = prepareExactText(label);
          return {
            value: String(o.value),
            label: label,
            aliases: exactLabel ? [exactLabel] : []
          };
        });
    }

    function computeOptionsSignature() {
      return Array.from(provinceEl.options).map(function (o) {
        return [String(o.value || ''), prepareExactText(o.textContent || ''), o.disabled ? '1' : '0'].join('|');
      }).join('||');
    }

    function hasProvinceValue(value) {
      const desired = String(value || '');
      if (!desired) return false;
      return Array.from(provinceEl.options).some(function (o) {
        return String(o.value || '') === desired;
      });
    }

    let userOverridden = false;
    let isProgramChange = false;
    let lastAutoValue = '';
    let lastSignature = '';
    let lastOptionsSignature = '';
    let currentState = null;
    let optionsReadyTimer = null;
    let delayedApplyTimers = [];
    let lastEmptyState = false;

    function clearDelayedApplyTimers() {
      delayedApplyTimers.forEach(function (t) { clearTimeout(t); });
      delayedApplyTimers = [];
    }

    function resetAutoState(shouldClearProvince) {
      clearDelayedApplyTimers();
      lastAutoValue = '';
      currentState = null;
      userOverridden = false;
      if (shouldClearProvince && String(provinceEl.value || '') !== '0') {
        isProgramChange = true;
        provinceEl.value = '0';
        Array.from(provinceEl.options).forEach(function (o) {
          o.selected = String(o.value || '') === '0';
        });
        provinceEl.dispatchEvent(new Event('input', { bubbles: true }));
        provinceEl.dispatchEvent(new Event('change', { bubbles: true }));
        isProgramChange = false;
      }
    }

    function scheduleProvinceReadyProcess() {
      clearTimeout(optionsReadyTimer);
      optionsReadyTimer = setTimeout(function () {
        process();
      }, 260);
    }

    provinceEl.addEventListener('change', function () {
      if (isProgramChange) return;
      const currentValue = String(provinceEl.value || '');
      userOverridden = currentValue !== String(lastAutoValue || '');
      process();
    });

    function setProvinceValue(value) {
      if (!value) return;
      const desired = String(value);
      lastAutoValue = desired;
      clearDelayedApplyTimers();

      if (!hasProvinceValue(desired)) {
        [180, 500, 1000, 1800].forEach(function (ms) {
          delayedApplyTimers.push(setTimeout(function () { process(); }, ms));
        });
        return;
      }

      if (String(provinceEl.value || '') === desired) return;

      function applyOnce() {
        isProgramChange = true;
        provinceEl.value = desired;
        Array.from(provinceEl.options).forEach(function (o) {
          o.selected = String(o.value || '') === desired;
        });
        provinceEl.dispatchEvent(new Event('input', { bubbles: true }));
        provinceEl.dispatchEvent(new Event('change', { bubbles: true }));
        isProgramChange = false;
      }

      applyOnce();
      [80, 220, 500, 1000, 1800].forEach(function (ms) {
        delayedApplyTimers.push(setTimeout(function () {
          if (userOverridden) return;
          if (String(provinceEl.value || '') !== desired && hasProvinceValue(desired)) applyOnce();
        }, ms));
      });
    }

    function hideSuggestPanel() {
      suggestPanel.classList.remove('show');
    }

    function getSources() {
      return {
        title: readFieldValue(titleEl),
        sapo: readFieldValue(sapoEl),
        chapeau: readFieldValue(chapeauEl),
        content: getEditorText()
      };
    }

    function collectMatchesForOption(textNorm, option) {
      if (!textNorm) return [];
      const occurrences = [];
      option.aliases.forEach(function (alias) {
        if (!alias) return;
        const re = makeBoundaryRegex(alias);
        let m;
        while ((m = re.exec(textNorm)) !== null) {
          const idx = m.index + (m[1] ? m[1].length : 0);
          occurrences.push({ index: idx, len: alias.length });
        }
      });
      occurrences.sort(function (a, b) {
        if (a.index !== b.index) return a.index - b.index;
        return b.len - a.len;
      });
      const dedup = [];
      const seen = new Set();
      occurrences.forEach(function (occ) {
        const key = occ.index + '|' + occ.len;
        if (seen.has(key)) return;
        seen.add(key);
        dedup.push(occ);
      });
      return dedup;
    }

    function analyzeText(text, options) {
      const textNorm = prepareExactText(text);
      const matches = [];
      if (!textNorm) return { textNorm: '', matches: matches };

      options.forEach(function (opt) {
        const occurrences = collectMatchesForOption(textNorm, opt);
        if (!occurrences.length) return;
        matches.push({
          value: opt.value,
          label: opt.label,
          count: occurrences.length,
          firstIndex: occurrences[0].index,
          occurrences: occurrences
        });
      });

      matches.sort(function (a, b) {
        if (a.firstIndex !== b.firstIndex) return a.firstIndex - b.firstIndex;
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label, 'vi');
      });

      return { textNorm: textNorm, matches: matches };
    }

    function getByValue(list, value) {
      return list.find(function (item) { return item.value === value; }) || null;
    }

    function pickFirstUnique(list, excluded) {
      const exclude = excluded || new Set();
      for (let i = 0; i < list.length; i++) {
        if (!exclude.has(list[i].value)) return list[i];
      }
      return null;
    }

    function pickMostFrequent(list, excluded) {
      const exclude = excluded || new Set();
      const filtered = list.filter(function (item) { return !exclude.has(item.value); });
      if (!filtered.length) return null;
      filtered.sort(function (a, b) {
        if (b.count !== a.count) return b.count - a.count;
        if (a.firstIndex !== b.firstIndex) return a.firstIndex - b.firstIndex;
        return a.label.localeCompare(b.label, 'vi');
      });
      return filtered[0];
    }

    function sortMostFrequent(list) {
      return list.slice().sort(function (a, b) {
        if (b.count !== a.count) return b.count - a.count;
        if (a.firstIndex !== b.firstIndex) return a.firstIndex - b.firstIndex;
        return a.label.localeCompare(b.label, 'vi');
      });
    }

    function sortFirstSeen(list) {
      return list.slice().sort(function (a, b) {
        if (a.firstIndex !== b.firstIndex) return a.firstIndex - b.firstIndex;
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label, 'vi');
      });
    }

    function pickFromOrdered(list, excluded) {
      const exclude = excluded || new Set();
      for (let i = 0; i < list.length; i++) {
        if (!exclude.has(list[i].value)) return list[i];
      }
      return null;
    }

    function allUniqueCandidates(lists) {
      const ordered = [];
      const seen = new Set();
      lists.forEach(function (list) {
        sortFirstSeen(list || []).forEach(function (item) {
          if (seen.has(item.value)) return;
          seen.add(item.value);
          ordered.push(item);
        });
      });
      return ordered;
    }

    function detectFallbackReason(item, titleInfo, sapoInfo, chapeauInfo, contentInfo) {
      if (contentInfo.matches.some(function (m) { return m.value === item.value; })) return 'Nội dung';
      if (sapoInfo.matches.some(function (m) { return m.value === item.value; })) return 'Sapo';
      if (chapeauInfo.matches.some(function (m) { return m.value === item.value; })) return 'Sapo';
      if (titleInfo.matches.some(function (m) { return m.value === item.value; })) return 'Tiêu đề';
      return 'Nội dung';
    }

    function buildDetectionState() {
      const options = getProvinceOptions();
      const sources = getSources();
      const titleInfo = analyzeText(sources.title, options);
      const sapoInfo = analyzeText(sources.sapo, options);
      const chapeauInfo = analyzeText(sources.chapeau, options);
      const sapoChapeauInfo = analyzeText((sources.sapo || '') + ' ' + (sources.chapeau || ''), options);
      const contentInfo = analyzeText(sources.content, options);

      const map = new Map();
      options.forEach(function (opt) {
        map.set(opt.value, {
          value: opt.value,
          label: opt.label,
          contentCount: 0,
          bestSourceLevel: 99,
          bestIndex: 999999,
          sourceFlags: [],
          rank: null,
          rankReason: '',
          isGold: false
        });
      });

      function touchFromList(list, sourceName, level, countKey) {
        list.forEach(function (item) {
          const meta = map.get(item.value);
          if (!meta) return;
          if (meta.sourceFlags.indexOf(sourceName) < 0) meta.sourceFlags.push(sourceName);
          if (level < meta.bestSourceLevel) meta.bestSourceLevel = level;
          if (item.firstIndex < meta.bestIndex) meta.bestIndex = item.firstIndex;
          if (countKey === 'contentCount') meta.contentCount = item.count;
        });
      }

      touchFromList(titleInfo.matches, 'title', 1, null);
      touchFromList(sapoInfo.matches, 'sapo', 2, null);
      touchFromList(chapeauInfo.matches, 'chapeau', 2, null);
      touchFromList(contentInfo.matches, 'nội dung', 3, 'contentCount');

      let gold = null;
      if (titleInfo.matches.length) {
        gold = titleInfo.matches[0];
      } else if (sapoChapeauInfo.matches.length) {
        gold = sapoChapeauInfo.matches[0];
      } else if (contentInfo.matches.length) {
        gold = pickMostFrequent(contentInfo.matches, new Set());
      }

      const overallFallback = allUniqueCandidates([
        titleInfo.matches,
        sapoInfo.matches,
        chapeauInfo.matches,
        contentInfo.matches
      ]);

      const ranked = [];
      const used = new Set();
      if (gold) used.add(gold.value);

      const rankConfigs = [
        { rank: 1, primary: sortMostFrequent(contentInfo.matches), reason: 'Xuất hiện nhiều nhất' },
        { rank: 2, primary: sortFirstSeen(sapoInfo.matches.length ? sapoInfo.matches : chapeauInfo.matches), reason: 'Sapo' },
        { rank: 3, primary: sortFirstSeen(contentInfo.matches), reason: 'Nội dung' }
      ];

      rankConfigs.forEach(function (cfg) {
        let chosen = pickFromOrdered(cfg.primary, used);
        let fallbackUsed = false;
        if (!chosen) {
          chosen = pickFromOrdered(overallFallback, used);
          fallbackUsed = !!chosen;
        }
        if (chosen) {
          ranked.push({ rank: cfg.rank, item: chosen, reason: fallbackUsed ? detectFallbackReason(chosen, titleInfo, sapoInfo, chapeauInfo, contentInfo) : cfg.reason });
          used.add(chosen.value);
        }
      });

      const allDetected = Array.from(map.values()).filter(function (meta) {
        return meta.sourceFlags.length > 0;
      });

      if (gold) {
        const goldMeta = map.get(gold.value);
        if (goldMeta) goldMeta.isGold = true;
      }
      ranked.forEach(function (entry) {
        const meta = map.get(entry.item.value);
        if (!meta) return;
        meta.rank = entry.rank;
        meta.rankReason = entry.reason || '';
      });

      const priorityOrder = [];
      ranked.forEach(function (entry) { priorityOrder.push(entry.item.value); });

      allDetected.sort(function (a, b) {
        const ar = a.rank || 99;
        const br = b.rank || 99;
        if (ar !== br) return ar - br;
        if (a.isGold !== b.isGold) return a.isGold ? -1 : 1;
        if (a.bestSourceLevel !== b.bestSourceLevel) return a.bestSourceLevel - b.bestSourceLevel;
        if (a.contentCount !== b.contentCount) return b.contentCount - a.contentCount;
        if (a.bestIndex !== b.bestIndex) return a.bestIndex - b.bestIndex;
        return a.label.localeCompare(b.label, 'vi');
      });

      return {
        gold: gold,
        ranked: ranked,
        allDetected: allDetected,
        priorityOrder: priorityOrder,
        byValue: map
      };
    }

    function describeMeta(meta) {
      if (meta.rankReason) return meta.rankReason;
      if (meta.sourceFlags.indexOf('title') >= 0) return 'Tiêu đề';
      if (meta.sourceFlags.indexOf('sapo') >= 0 || meta.sourceFlags.indexOf('chapeau') >= 0) return 'Sapo';
      if (meta.sourceFlags.indexOf('nội dung') >= 0) return 'Nội dung';
      return '';
    }

    function renderSuggestUI(state, selectedValue) {
      currentState = state;
      suggestPanel.innerHTML = '';

      if (!state || !state.allDetected.length) {
        suggestBtn.textContent = 'Gợi ý';
        suggestBtn.classList.remove('has-items', 'tm-shake');
        suggestPanel.innerHTML = '<div class="tm-province-suggest-empty">Không có gợi ý</div>';
        return;
      }

      suggestBtn.textContent = 'Gợi ý ' + state.allDetected.length;
      suggestBtn.classList.add('has-items', 'tm-shake');


      const list = document.createElement('div');
      list.className = 'tm-province-suggest-list';

      state.allDetected.forEach(function (meta) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'tm-province-suggest-item' + (String(meta.value) === String(selectedValue) ? ' tm-active' : '');
        item.title = 'Chọn ' + meta.label;

        const rank = document.createElement('span');
        rank.className = 'tm-province-suggest-rank ' + (meta.rank ? ('tm-rank-' + meta.rank) : 'tm-rank-empty');
        rank.textContent = meta.rank ? String(meta.rank) : ''; 

        const main = document.createElement('span');
        main.className = 'tm-province-suggest-main';

        const labelRow = document.createElement('span');
        labelRow.className = 'tm-province-suggest-label';
        labelRow.textContent = meta.label;


        const sub = document.createElement('span');
        sub.className = 'tm-province-suggest-meta';
        sub.textContent = describeMeta(meta);

        main.appendChild(labelRow);
        main.appendChild(sub);
        item.appendChild(rank);
        item.appendChild(main);

        item.addEventListener('click', function () {
          userOverridden = true;
          setProvinceValue(meta.value);
          renderSuggestUI(state, meta.value);
          hideSuggestPanel();
        });

        list.appendChild(item);
      });

      suggestPanel.appendChild(list);
    }

    function process() {
      const state = buildDetectionState();
      const currentValue = String(provinceEl.value || '');
      const fieldsAreEmpty = !readFieldValue(titleEl).trim() && !readFieldValue(sapoEl).trim() && !readFieldValue(chapeauEl).trim() && !getEditorText().trim();

      if (fieldsAreEmpty) {
        if (!lastEmptyState) resetAutoState(currentValue === String(lastAutoValue || '') || currentValue === '' || currentValue === '0');
        lastEmptyState = true;
        renderSuggestUI({ gold: null, ranked: [], allDetected: [], priorityOrder: [], byValue: new Map() }, String(provinceEl.value || '0'));
        hideSuggestPanel();
        return;
      }
      lastEmptyState = false;

      if (!state.gold) {
        lastAutoValue = '';
        renderSuggestUI(state, currentValue);
        hideSuggestPanel();
        return;
      }

      const shouldAutoApply = !userOverridden && (
        currentValue === '' ||
        currentValue === '0' ||
        currentValue === String(lastAutoValue || '') ||
        !lastAutoValue
      );

      if (shouldAutoApply) setProvinceValue(state.gold.value);
      renderSuggestUI(state, String(provinceEl.value || state.gold.value));
    }

    function computeTextSignature() {
      return [
        readFieldValue(titleEl),
        readFieldValue(sapoEl),
        readFieldValue(chapeauEl),
        getEditorText()
      ].join('\n@@\n');
    }

    function forceProcess() { process(); }

    const onTextChanged = debounce(function () {
      const newSignature = computeTextSignature();
      if (newSignature === lastSignature) {
        process();
        return;
      }
      lastSignature = newSignature;
      userOverridden = false;
      process();
    }, 220);

    const onTextChangedSecondPass = debounce(function () {
      process();
    }, 420);

    [titleEl, sapoEl, chapeauEl].forEach(function (el) {
      el.addEventListener('input', function () { onTextChanged(); onTextChangedSecondPass(); });
      el.addEventListener('change', function () { onTextChanged(); onTextChangedSecondPass(); });
      el.addEventListener('keyup', function () { onTextChanged(); onTextChangedSecondPass(); });
      el.addEventListener('blur', function () { onTextChanged(); onTextChangedSecondPass(); });
    });

    Array.from(document.querySelectorAll('select')).forEach(function (el) {
      if (el === provinceEl) return;
      if (el.__tmProvinceWatchBound) return;
      el.__tmProvinceWatchBound = true;
      el.addEventListener('change', function () {
        scheduleProvinceReadyProcess();
        setTimeout(function () { process(); }, 500);
        setTimeout(function () { process(); }, 1000);
      });
    });

    function attachEditorListeners() {
      try {
        const editorBody = getEditorBody();
        if (editorBody && !editorBody.__tmProvinceBound) {
          editorBody.__tmProvinceBound = true;
          editorBody.addEventListener('input', function () { onTextChanged(); onTextChangedSecondPass(); });
          editorBody.addEventListener('keyup', function () { onTextChanged(); onTextChangedSecondPass(); });
          editorBody.addEventListener('paste', function () { onTextChanged(); onTextChangedSecondPass(); });
          editorBody.addEventListener('blur', function () { onTextChanged(); onTextChangedSecondPass(); });
        }
      } catch (e) {}

      try {
        if (window.CKEDITOR && CKEDITOR.instances) {
          for (const key in CKEDITOR.instances) {
            const inst = CKEDITOR.instances[key];
            if (!inst || inst.__tmProvinceBound) continue;
            inst.__tmProvinceBound = true;
            if (typeof inst.on === 'function') {
              inst.on('change', function () { onTextChanged(); onTextChangedSecondPass(); });
              inst.on('key', function () { onTextChanged(); onTextChangedSecondPass(); });
              inst.on('blur', function () { onTextChanged(); onTextChangedSecondPass(); });
              inst.on('afterCommandExec', function () { onTextChanged(); onTextChangedSecondPass(); });
            }
          }
        }
      } catch (e) {}
    }

    attachEditorListeners();

    const observer = new MutationObserver(function () {
      attachEditorListeners();
      const nextOptionsSignature = computeOptionsSignature();
      if (nextOptionsSignature !== lastOptionsSignature) {
        lastOptionsSignature = nextOptionsSignature;
        scheduleProvinceReadyProcess();
        setTimeout(function () { process(); }, 120);
        setTimeout(function () { process(); }, 500);
      }
      onTextChanged();
      onTextChangedSecondPass();
    });

    [titleEl, sapoEl, chapeauEl].forEach(function (el) {
      observer.observe(el, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['value']
      });
    });

    observer.observe(provinceEl, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true
    });

    const editorFrame = getEditorFrame();
    if (editorFrame) {
      observer.observe(editorFrame, {
        subtree: false,
        childList: false,
        characterData: false,
        attributes: true
      });
      const editorBody = getEditorBody();
      if (editorBody) {
        observer.observe(editorBody, {
          subtree: true,
          childList: true,
          characterData: true
        });
      }
    }

    const heartbeat = setInterval(function () {
      if (!document.contains(provinceEl)) {
        try { provinceEl.__tmProvinceInitBound = false; } catch (e) {}
        clearDelayedApplyTimers();
        clearTimeout(optionsReadyTimer);
        clearInterval(heartbeat);
        observer.disconnect();
        return;
      }
      attachEditorListeners();
      const nextOptionsSignature = computeOptionsSignature();
      if (nextOptionsSignature !== lastOptionsSignature) {
        lastOptionsSignature = nextOptionsSignature;
        scheduleProvinceReadyProcess();
      }
      forceProcess();
      onTextChangedSecondPass();
    }, 1000);

    suggestBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!currentState || !currentState.allDetected.length) return;
      suggestPanel.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
      if (!suggestWrap.contains(e.target)) hideSuggestPanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideSuggestPanel();
    });

    function bindEditorHideHandlers() {
      document.querySelectorAll(CONTENT_IFRAME_SEL).forEach(function (iframe) {
        if (iframe.dataset.tmProvinceHideBound === '1') return;
        iframe.dataset.tmProvinceHideBound = '1';

        function bindFrameDoc() {
          try {
            const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
            if (!doc) return;
            ['mousedown', 'pointerdown', 'click', 'focusin', 'keydown'].forEach(function (type) {
              doc.addEventListener(type, function () { hideSuggestPanel(); }, true);
            });
          } catch (e) {}
        }

        iframe.addEventListener('load', bindFrameDoc, true);
        bindFrameDoc();
      });
    }

    bindEditorHideHandlers();

    const hideObserver = new MutationObserver(function () {
      bindEditorHideHandlers();
    });
    hideObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });


    lastSignature = computeTextSignature();
    lastOptionsSignature = computeOptionsSignature();
    process();
    setTimeout(forceProcess, 120);
    setTimeout(forceProcess, 500);
    setTimeout(forceProcess, 1200);
    return true;
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    init();
    setInterval(function () {
      try { init(); } catch (e) {}
    }, 800);
  });
})();

(function(){
  'use strict';
  const LIST_URL = 'https://crmag.baoangiang.com.vn/news/index?lang=vi';
  const KEY_PREFIX = 'agoCrmExtBridge:';

  function safeUrl(v){ try { return new URL(v, location.href); } catch (e) { return null; } }
  function isAllowedTarget(v){
    const u = safeUrl(v);
    if (!u) return false;
    if (!/(^|\.)crmag\.baoangiang\.com\.vn$/i.test(u.hostname)) return false;
    return /\/news\/edit/i.test(u.pathname || '');
  }

  const here = safeUrl(location.href);
  const target = here?.searchParams.get('target') || '';
  const token = here?.searchParams.get('token') || String(Date.now());
  const storageKey = KEY_PREFIX + token;

  if (!isAllowedTarget(target)) {
    location.replace(LIST_URL);
    return;
  }

  let phase = '';
  try { phase = sessionStorage.getItem(storageKey) || ''; } catch (e) {}

  if (phase === 'opened') {
    try { sessionStorage.removeItem(storageKey); } catch (e) {}
    location.replace(LIST_URL);
    return;
  }

  try { sessionStorage.setItem(storageKey, 'opened'); } catch (e) {}
  location.assign(target);
})();

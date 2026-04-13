(() => {
  if (window.__AGO_CRM_PAGE_SIGNAL_V1__) return;
  window.__AGO_CRM_PAGE_SIGNAL_V1__ = true;
  const EVENT = 'AGO_CRM_PAGE_SIGNAL_V1';
  const shouldSignal = (value) => {
    try {
      const text = String(value || '');
      if (!text) return false;
      return /crmag\.baoangiang\.com\.vn\/.*(news|weblink|index|edit|save|update|status)/i.test(text) || /\/news(\/|\?|$)/i.test(text);
    } catch (e) { return false; }
  };
  const signal = (reason, url) => { try { window.postMessage({ type: EVENT, reason, url: String(url || '') }, '*'); } catch (e) {} };
  if (typeof window.fetch === 'function' && !window.fetch.__agoWrapped) {
    const original = window.fetch.bind(window);
    const wrapped = function(...args) {
      const url = args && args[0] && (typeof args[0] === 'string' ? args[0] : args[0].url);
      return original(...args).then((res) => {
        if (shouldSignal(url) || shouldSignal(res && res.url)) signal('fetch', (res && res.url) || url);
        return res;
      });
    };
    wrapped.__agoWrapped = true;
    window.fetch = wrapped;
  }
  const proto = window.XMLHttpRequest && window.XMLHttpRequest.prototype;
  if (proto && !proto.__agoWrapped) {
    const open = proto.open;
    const send = proto.send;
    proto.open = function(method, url, ...rest) { this.__agoUrl = url; return open.call(this, method, url, ...rest); };
    proto.send = function(...args) {
      this.addEventListener('loadend', () => {
        const finalUrl = this.responseURL || this.__agoUrl || '';
        if (shouldSignal(finalUrl)) signal('xhr', finalUrl);
      }, { once: true });
      return send.apply(this, args);
    };
    proto.__agoWrapped = true;
  }
})();

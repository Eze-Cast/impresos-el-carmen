(() => {
  const year = document.querySelector('[data-legal-year]');
  if (year) year.textContent = String(new Date().getFullYear());
  const key = 'carmen.cookie-notice';
  const version = '2026-10-15';
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const notice = document.querySelector('#cookie-notice');
  if (!notice) return;
  const dismiss = notice.querySelector('[data-cookie-dismiss]');
  let previousFocus;
  const updateHeight = () => document.documentElement.style.setProperty('--cookie-height', `${notice.offsetHeight}px`);
  const show = (focus = false) => {
    notice.hidden = false; document.body.classList.add('has-cookie-notice'); updateHeight();
    if (focus) { previousFocus = document.activeElement; dismiss.focus({ preventScroll: true }); }
  };
  const hide = () => {
    notice.hidden = true; document.body.classList.remove('has-cookie-notice');
    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    previousFocus = null;
  };
  let acknowledged = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    acknowledged = saved?.version === version && typeof saved.expiresAt === 'number' && saved.expiresAt > Date.now();
    if (saved && !acknowledged) localStorage.removeItem(key);
  } catch {}
  if (!acknowledged) show();
  dismiss.addEventListener('click', () => {
    try { localStorage.setItem(key, JSON.stringify({ version, expiresAt: Date.now() + lifetime })); } catch {}
    hide();
  });
  document.querySelectorAll('[data-cookie-open]').forEach(button => button.addEventListener('click', () => show(true)));
  if ('ResizeObserver' in window) new ResizeObserver(updateHeight).observe(notice);
})();

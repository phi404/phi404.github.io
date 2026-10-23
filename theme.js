// Resolve the saved or system theme before first paint.
(() => {
  const key = 'fai-theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {}
  let button;
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#101114' : '#f7f7f7');
    if (button) {
      const label = theme === 'dark' ? 'ライトモードに切り替える' : 'ダークモードに切り替える';
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  };
  const preferred = () => preference || (media.matches ? 'dark' : 'light');
  apply(preferred());
  media.addEventListener('change', () => { if (!preference) apply(preferred()); });
  window.addEventListener('storage', (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
    apply(preferred());
  });
  document.addEventListener('DOMContentLoaded', () => {
    button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    button.hidden = false;
    apply(preferred());
    button.addEventListener('click', () => {
      preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch {}
      apply(preference);
    });
  }, { once: true });
})();

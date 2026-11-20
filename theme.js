(() => {
  const button = document.getElementById('theme-toggle');
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  function apply(theme, remember = false) {
    document.documentElement.dataset.theme = theme;
    const dark = theme === 'dark';
    if (button) {
      button.textContent = dark ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      button.setAttribute('aria-pressed', String(dark));
    }
    document.querySelectorAll('img[data-dark-src]').forEach(image => {
      image.src = dark ? image.dataset.darkSrc : image.dataset.lightSrc;
    });
    if (remember) {
      try { localStorage.setItem('portfolio-theme', theme); } catch (_) {}
    }
  }
  apply(document.documentElement.dataset.theme || (system.matches ? 'dark' : 'light'));
  button?.addEventListener('click', () => {
    apply(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });
  system.addEventListener('change', event => {
    let saved;
    try { saved = localStorage.getItem('portfolio-theme'); } catch (_) {}
    if (saved !== 'dark' && saved !== 'light') apply(event.matches ? 'dark' : 'light');
  });
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-theme') {
      apply(event.newValue === 'dark' || event.newValue === 'light' ? event.newValue : (system.matches ? 'dark' : 'light'));
    }
  });
})();

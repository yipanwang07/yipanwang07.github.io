(() => {
  let preference;
  try { preference = localStorage.getItem('portfolio-theme'); } catch (_) {}
  const theme = preference === 'dark' || preference === 'light'
    ? preference
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
})();

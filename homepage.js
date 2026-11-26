(() => {
  const explorers = document.querySelectorAll('[data-explorer]');
  explorers.forEach(explorer => {
    const buttons = [...explorer.querySelectorAll('[data-part]')];
    const panels = [...explorer.querySelectorAll('[data-part-panel]')];
    const prompt = explorer.querySelector('[data-part-prompt]');
    const status = explorer.querySelector('[data-explorer-status]');
    let selected = null;

    function select(button) {
      const opening = selected !== button;
      selected = opening ? button : null;
      buttons.forEach(item => item.setAttribute('aria-expanded', String(item === selected)));
      panels.forEach(panel => { panel.hidden = !selected || panel.dataset.partPanel !== selected.dataset.part; });
      prompt.hidden = Boolean(selected);
      status.textContent = selected ? `${selected.querySelector('.part-label').textContent} project displayed.` : 'Project details closed.';
    }

    buttons.forEach(button => button.addEventListener('click', () => select(button)));
    explorer.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !selected) return;
      event.preventDefault();
      const previous = selected;
      select(previous);
      previous.focus();
    });
  });

  // Open the category when following a shared fragment, including after load.
  function revealFragment() {
    const id = location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target?.matches('details.project-category')) target.open = true;
  }
  revealFragment();
  window.addEventListener('hashchange', revealFragment);
})();

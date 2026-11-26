(() => {
  const nav = document.querySelector('.site-nav');
  const root = nav?.querySelector('.menu-root');
  if (!nav || !root) return;
  const flyoutMedia = window.matchMedia('(min-width: 1101px) and (min-height: 501px) and (hover: hover) and (pointer: fine)');
  const branches = [...nav.querySelectorAll('.menu-branch')];
  const toggleFor = branch => branch.querySelector(':scope > .branch-head > .branch-toggle');
  const panelFor = branch => document.getElementById(toggleFor(branch).getAttribute('aria-controls'));
  const rootPanel = panelFor(root);
  const hoverOpened = new Set();
  let input = 'pointer';
  let pointerType = 'mouse';
  let lastOpened = root;
  let resizeFrame = null;
  const isOpen = branch => toggleFor(branch).getAttribute('aria-expanded') === 'true';
  const within = (branch, node) => Boolean(node && (branch.contains(node) || panelFor(branch).contains(node)));
  const parentBranch = branch => branch === root ? null : (branch.parentElement.closest('.menu-branch') || root);
  const siblings = branch => branches.filter(item => item !== branch && parentBranch(item) === parentBranch(branch));

  function setOpen(branch, open) {
    branch.classList.toggle('is-open', open);
    toggleFor(branch).setAttribute('aria-expanded', String(open));
    panelFor(branch).hidden = !open;
    if (!open) hoverOpened.delete(branch);
  }
  function closeBranch(branch) {
    [branch, ...panelFor(branch).querySelectorAll('.menu-branch')].forEach(item => setOpen(item, false));
  }
  function positionPanels() {
    if (!flyoutMedia.matches || !isOpen(root)) return;
    const navBox = nav.getBoundingClientRect();
    const rootBox = root.getBoundingClientRect();
    nav.style.setProperty('--projects-left', `${Math.max(0, rootBox.left - navBox.left)}px`);
    nav.style.setProperty('--projects-top', `${rootBox.bottom - navBox.top}px`);
    branches.filter(branch => branch !== root && isOpen(branch)).forEach(branch => {
      const panel = panelFor(branch);
      const box = branch.getBoundingClientRect();
      const top = Math.max(8 - box.top, Math.min(-8, window.innerHeight - 12 - box.top - panel.offsetHeight));
      panel.style.setProperty('--submenu-top', `${top}px`);
    });
  }
  function openBranch(branch, source = 'click') {
    const parent = parentBranch(branch);
    if (parent && !isOpen(parent)) openBranch(parent, source);
    // Mobile siblings stay open, avoiding reflow between touchstart and click.
    if (flyoutMedia.matches) siblings(branch).forEach(closeBranch);
    setOpen(branch, true);
    source === 'hover' ? hoverOpened.add(branch) : hoverOpened.delete(branch);
    lastOpened = branch;
    positionPanels();
  }
  function canHover(event) {
    return flyoutMedia.matches && event.pointerType === 'mouse';
  }
  function leaveBranch(branch, event) {
    if (!canHover(event) || within(branch, event.relatedTarget)) return;
    if (input === 'keyboard' && within(branch, document.activeElement)) return;
    closeBranch(branch);
  }

  branches.forEach(branch => {
    const button = toggleFor(branch);
    button.addEventListener('click', event => {
      // pointerenter may already have opened the menu before a mouse click.
      if (flyoutMedia.matches && event.detail > 0 && pointerType === 'mouse' && hoverOpened.has(branch)) {
        hoverOpened.delete(branch);
        return;
      }
      isOpen(branch) ? closeBranch(branch) : openBranch(branch);
    });
    button.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowRight', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      openBranch(branch, 'keyboard');
      const items = [...panelFor(branch).querySelectorAll(':scope > li > a, :scope > li > .branch-head > button')];
      (event.key === 'ArrowUp' ? items.at(-1) : items[0])?.focus();
    });
    branch.addEventListener('pointerenter', event => {
      if (canHover(event)) openBranch(branch, 'hover');
    });
    branch.addEventListener('pointerleave', event => leaveBranch(branch, event));
  });
  rootPanel.addEventListener('pointerenter', event => {
    if (canHover(event)) openBranch(root, 'hover');
  });
  rootPanel.addEventListener('pointerleave', event => leaveBranch(root, event));
  document.addEventListener('pointerdown', event => {
    input = 'pointer';
    pointerType = event.pointerType;
  }, true);
  document.addEventListener('keydown', event => {
    input = 'keyboard';
    if (!['Escape', 'ArrowLeft'].includes(event.key) || !isOpen(root)) return;
    const focused = document.activeElement;
    if (event.key === 'ArrowLeft' && !nav.contains(focused)) return;
    let branch = nav.contains(focused) ? (focused.closest('.menu-branch') || root) : root;
    if (!isOpen(branch)) branch = parentBranch(branch) || root;
    event.preventDefault();
    closeBranch(branch);
    if (nav.contains(focused)) toggleFor(branch).focus();
  });
  nav.addEventListener('focusout', () => {
    // Touch browsers may blur before click, with relatedTarget=null. Only
    // keyboard focus leaving the whole navigation should dismiss it here.
    if (input !== 'keyboard') return;
    window.requestAnimationFrame(() => {
      if (input === 'keyboard' && !nav.contains(document.activeElement)) closeBranch(root);
    });
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) closeBranch(root);
  });
  function layoutChanged() {
    if (flyoutMedia.matches && isOpen(root)) {
      const focused = document.activeElement?.closest('.menu-branch');
      let keep = focused && isOpen(focused) ? focused : lastOpened;
      if (!isOpen(keep)) keep = root;
      const path = new Set();
      for (let branch = keep; branch; branch = parentBranch(branch)) path.add(branch);
      branches.filter(branch => !path.has(branch)).forEach(branch => setOpen(branch, false));
    }
    positionPanels();
  }
  if (flyoutMedia.addEventListener) flyoutMedia.addEventListener('change', layoutChanged);
  else flyoutMedia.addListener(layoutChanged);
  window.addEventListener('resize', () => {
    // Mobile browser chrome and keyboards resize the viewport: do not close.
    if (resizeFrame !== null) return;
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;
      positionPanels();
    });
  });
})();

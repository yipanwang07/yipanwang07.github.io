const branches = [...document.querySelectorAll('.menu-branch')];
const root = document.querySelector('.menu-root');
const desktopHover = () => matchMedia('(min-width: 1101px) and (hover: hover)').matches;
const toggleFor = branch => branch.querySelector(':scope > .branch-head > .branch-toggle');
function closeBranch(branch) {
  [branch, ...branch.querySelectorAll('.menu-branch')].forEach(item => {
    item.classList.remove('is-open');
    toggleFor(item).setAttribute('aria-expanded', 'false');
  });
}
function openBranch(branch) {
  [...branch.parentElement.children].filter(item => item !== branch && item.classList.contains('menu-branch')).forEach(closeBranch);
  branch.classList.add('is-open');
  toggleFor(branch).setAttribute('aria-expanded', 'true');
}
branches.forEach(branch => {
  const toggle = toggleFor(branch);
  toggle.addEventListener('click', () => {
    branch.classList.contains('is-open') ? closeBranch(branch) : openBranch(branch);
  });
  branch.addEventListener('pointerenter', () => {
    if (desktopHover()) openBranch(branch);
  });
  branch.addEventListener('pointerleave', () => {
    if (desktopHover() && !branch.contains(document.activeElement)) closeBranch(branch);
  });
  branch.addEventListener('focusout', event => {
    if (!branch.contains(event.relatedTarget)) closeBranch(branch);
  });
  toggle.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      openBranch(branch);
      branch.querySelector(':scope > .nav-panel a')?.focus();
    }
  });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const current = document.activeElement.closest('.menu-branch');
  const open = current?.classList.contains('is-open') ? current : current?.parentElement.closest('.menu-branch.is-open');
  if (open) {
    event.preventDefault();
    closeBranch(open);
    toggleFor(open).focus();
  }
});
document.addEventListener('click', event => {
  if (root && !root.contains(event.target)) closeBranch(root);
});
window.addEventListener('resize', () => { if (root) closeBranch(root); });

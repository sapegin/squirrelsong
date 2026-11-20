/* Shared chrome for squirrelsong.html, squirrelsong-ui.html, and
 * squirrelsong-cli.html. Load synchronously as the first child of <body>
 * so the stored scheme applies before the rest of the page paints. */

const THEME_KEY = 'squirrelsong-preview-theme';

function getStoredTheme() {
  const theme = sessionStorage.getItem(THEME_KEY);
  return theme === 'light' || theme === 'dark' ? theme : null;
}

function currentTheme() {
  return document.body.classList.contains('dark') ? 'dark' : 'light';
}

function applyBodyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  document.body.classList.toggle('dark', theme === 'dark');
  sessionStorage.setItem(THEME_KEY, theme);
  document.dispatchEvent(
    new CustomEvent('squirrelsong:themechange', { detail: { theme } })
  );
}

function setTheme(theme) {
  applyBodyTheme(theme);
}

const bootTheme = getStoredTheme() ?? currentTheme();
applyBodyTheme(bootTheme);

function initPreviewChrome() {
  document
    .querySelector('#theme-light')
    ?.addEventListener('click', () => setTheme('light'));
  document
    .querySelector('#theme-dark')
    ?.addEventListener('click', () => setTheme('dark'));

  const sidebarItems = document.querySelectorAll(
    '.layout > .sidebar > .sidebar-item'
  );
  const defaultSection =
    document.body.dataset.defaultSection ??
    sidebarItems[0]?.getAttribute('href')?.replace(/^#/, '') ??
    '';

  function setActiveSidebarItem(hash) {
    const sectionId = hash.replace(/^#/, '');
    const id = sectionId === '' ? defaultSection : sectionId;
    for (const item of sidebarItems) {
      const href = item.getAttribute('href') ?? '';
      item.classList.toggle('active', href === `#${id}`);
    }
  }

  globalThis.addEventListener('hashchange', () => {
    setActiveSidebarItem(globalThis.location.hash);
  });
  setActiveSidebarItem(globalThis.location.hash);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPreviewChrome);
} else {
  initPreviewChrome();
}

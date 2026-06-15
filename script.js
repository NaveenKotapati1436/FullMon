// const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
// const basePath = isLocalhost ? "" : "/FullMon";
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const isGitHubPages = location.hostname.includes("github.io");
const basePath = isLocalhost
  ? ""
  : isGitHubPages
    ? "/FullMon"
    : ""; // For custom domain
    
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#nav-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

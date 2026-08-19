const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const navLinks = [...document.querySelectorAll('.main-nav a')];

const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menu.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}));

document.querySelectorAll('[data-accordion] button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.accordion-item');
    const accordion = item.parentElement;
    accordion.querySelectorAll('.accordion-item').forEach((candidate) => {
      const isTarget = candidate === item;
      const nextOpen = isTarget ? !candidate.classList.contains('is-open') : false;
      candidate.classList.toggle('is-open', nextOpen);
      candidate.querySelector('button').setAttribute('aria-expanded', String(nextOpen));
    });
  });
});

const sections = [...document.querySelectorAll('main section[id]')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach((section) => sectionObserver.observe(section));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

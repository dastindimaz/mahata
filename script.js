const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button], [data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const navLinks = [...document.querySelectorAll('.main-nav a')];

const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  if (open) {
    closeMenu();
    return;
  }

  menuButton.setAttribute('aria-expanded', 'true');
  menu.classList.add('is-open');
  document.body.classList.add('menu-open');
});

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

window.addEventListener('hashchange', closeMenu);
window.addEventListener('pageshow', closeMenu);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

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
// Popup galeri portfolio: tombol, keyboard, dan swipe di perangkat sentuh.
const portfolioLightbox = document.querySelector("[data-lightbox]");

if (portfolioLightbox) {
  const lightboxImage = portfolioLightbox.querySelector("[data-lightbox-image]");
  const lightboxTitle = portfolioLightbox.querySelector("[data-lightbox-title]");
  const lightboxCount = portfolioLightbox.querySelector("[data-lightbox-count]");
  const closeButton = portfolioLightbox.querySelector("[data-lightbox-close]");
  const previousButton = portfolioLightbox.querySelector("[data-lightbox-prev]");
  const nextButton = portfolioLightbox.querySelector("[data-lightbox-next]");
  let activeItems = [];
  let activeIndex = 0;
  let previousFocus = null;
  let touchStartX = 0;

  const showPhoto = (index) => {
    activeIndex = (index + activeItems.length) % activeItems.length;
    const item = activeItems[activeIndex];
    const sourceImage = item.querySelector("img");
    const projectCard = item.closest(".portfolio-project-card");
    const projectSection = item.closest(".project-gallery-section");
    lightboxImage.src = item.dataset.fullsrc || item.href;
    lightboxImage.alt = sourceImage.alt;
    lightboxTitle.textContent = projectCard
      ? projectCard.querySelector("h3").textContent
      : projectSection.querySelector("h2").textContent;
    lightboxCount.textContent = `${activeIndex + 1} / ${activeItems.length}`;
  };

  const openLightbox = (item) => {
    const gallery = item.closest(".portfolio-project-grid") || item.closest(".project-gallery-section");
    activeItems = Array.from(gallery.querySelectorAll(".gallery-item"));
    previousFocus = item;
    portfolioLightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    showPhoto(activeItems.indexOf(item));
    closeButton.focus();
  };

  const closeLightbox = () => {
    portfolioLightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (previousFocus) previousFocus.focus();
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(item);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showPhoto(activeIndex - 1));
  nextButton.addEventListener("click", () => showPhoto(activeIndex + 1));
  portfolioLightbox.addEventListener("click", (event) => {
    if (event.target === portfolioLightbox) closeLightbox();
  });

  portfolioLightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  portfolioLightbox.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 45) return;
    showPhoto(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (portfolioLightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(activeIndex - 1);
    if (event.key === "ArrowRight") showPhoto(activeIndex + 1);
  });
}

// Hambatan dasar untuk penyimpanan gambar melalui klik kanan atau drag.
document.querySelectorAll(".portfolio-project-grid img, [data-lightbox-image]").forEach((image) => {
  image.draggable = false;
  image.addEventListener("dragstart", (event) => event.preventDefault());
  image.addEventListener("contextmenu", (event) => event.preventDefault());
});

document.querySelector(".portfolio-project-grid")?.addEventListener("contextmenu", (event) => {
  if (event.target.closest(".gallery-item")) event.preventDefault();
});

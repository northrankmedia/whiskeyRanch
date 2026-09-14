// Whiskey Ranch, shared site behavior (nav toggle + gallery lightbox)

document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  function closeNav() {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var lastTrigger = null;

    function openLightbox(item, img) {
      lastTrigger = item;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.classList.add('lightbox-locked');
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.classList.remove('lightbox-locked');
      if (lastTrigger) lastTrigger.focus();
    }

    document.querySelectorAll('.gallery-item').forEach(function (item) {
      var img = item.querySelector('img');
      if (!img) return;
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', 'View larger image: ' + (img.alt || 'gallery photo'));
      item.addEventListener('click', function () { openLightbox(item, img); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item, img);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'Tab' && closeBtn) {
        // Only one focusable control in the lightbox: keep focus trapped on it.
        e.preventDefault();
        closeBtn.focus();
      }
    });
  }

  // Scroll reveal. Safe by construction: default CSS state is fully visible,
  // this only ever ADDS the hidden starting state, and a timeout guarantees
  // every element is force-shown even if IntersectionObserver never fires.
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reveal-armed');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });

    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }, 2500);
  }
});

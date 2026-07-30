// No Broadcast — site interactions
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('nav');
  var toggle = document.querySelector('.nav-toggle');

  // 1. Sticky header background after scrolling
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. Mobile nav toggle
  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  // 3. Scrollspy — mark nav link for the section in view
  var spyLinks = document.querySelectorAll('[data-scrollspy]');
  if (spyLinks.length && 'IntersectionObserver' in window) {
    var linkFor = {};
    spyLinks.forEach(function (link) {
      linkFor[link.getAttribute('data-scrollspy')] = link;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          spyLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
          link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  // 4. Reveal-on-scroll
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { revealer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // 5. One audio player at a time
  var players = document.querySelectorAll('audio');
  players.forEach(function (player) {
    player.addEventListener('play', function () {
      players.forEach(function (other) {
        if (other !== player) other.pause();
      });
    });
  });
})();

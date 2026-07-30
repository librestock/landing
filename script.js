// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
  const setMenuOpen = (open, { focusMenu = false, restoreFocus = false } = {}) => {
    navLinks.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu',
    );

    if (open && focusMenu) {
      navLinks.querySelector('a')?.focus();
    } else if (!open && restoreFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', (event) => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(open, { focusMenu: open && event.detail === 0 });
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      toggle.getAttribute('aria-expanded') === 'true'
    ) {
      setMenuOpen(false, { restoreFocus: true });
    }
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}

// Theme toggle — flips html[data-theme] and persists choice
const themeToggle = document.querySelector('.theme-toggle');
const root = document.documentElement;

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('stocket-theme', next);
  });
}

// Follow system theme when user hasn't chosen explicitly
const media = window.matchMedia('(prefers-color-scheme: dark)');
media.addEventListener('change', (event) => {
  if (!localStorage.getItem('stocket-theme')) {
    root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
  }
});

// Shrink header on scroll
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
}, { passive: true });

// Animate elements on scroll into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.feature-card, .tech-item, .step, .workflow-card, .stat').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Inject fade-in styles (kept inline to stay self-contained)
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .fade-in {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;
document.head.appendChild(style);

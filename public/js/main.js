/**
 * Main JavaScript for DevX360 Multi-Page Website
 * Clean, minimal vanilla JS with modern ES6+ syntax
 */

// =============================================================================
// Theme Toggle
// =============================================================================
const ThemeManager = {
  STORAGE_KEY: 'theme-preference',
  
  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },
  
  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }
};

// =============================================================================
// Page Transitions
// =============================================================================
const PageTransitions = {
  TRANSITION_DURATION: 200,

  init() {
    // Ensure page is visible on initial load (remove any stale fade-out)
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');

    // Handle internal link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || !this.isInternalLink(link)) return;

      e.preventDefault();
      this.navigateTo(link.href);
    });

    // Handle browser back/forward navigation (popstate event)
    window.addEventListener('popstate', () => this.handlePopState());

    // Handle page show event (fires when page is restored from bfcache)
    window.addEventListener('pageshow', (e) => this.handlePageShow(e));
  },

  isInternalLink(link) {
    return link.href &&
           link.href.startsWith(window.location.origin) &&
           !link.href.includes('#') &&
           !link.hasAttribute('data-no-transition');
  },

  navigateTo(url) {
    document.body.classList.add('fade-out');
    setTimeout(() => window.location.href = url, this.TRANSITION_DURATION);
  },

  handlePopState() {
    // When user navigates with back/forward, ensure page is visible
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');
  },

  handlePageShow(event) {
    // event.persisted is true if page is restored from bfcache (back-forward cache)
    if (event.persisted) {
      document.body.classList.remove('fade-out');
      document.body.classList.add('fade-in');
    }
  }
};

// =============================================================================
// Scroll Progress Indicator
// =============================================================================
const ScrollProgress = {
  init() {
    this.progressBar = document.querySelector('.scroll-progress');
    if (!this.progressBar) return;
    
    window.addEventListener('scroll', () => this.update(), { passive: true });
    this.update();
  },
  
  update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    this.progressBar.style.width = `${progress}%`;
  }
};

// =============================================================================
// Mobile Navigation
// =============================================================================
const MobileNav = {
  init() {
    this.toggle = document.querySelector('.hamburger');
    this.menu = document.querySelector('.mobile-menu');
    if (!this.toggle || !this.menu) return;

    this.toggle.addEventListener('click', () => this.toggleMenu());

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close on link click
    this.menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  },

  toggleMenu() {
    this.menu.classList.toggle('active');
    this.toggle.classList.toggle('active');
    this.toggle.setAttribute('aria-expanded', this.menu.classList.contains('active'));
  },

  closeMenu() {
    this.menu.classList.remove('active');
    this.toggle?.classList.remove('active');
    this.toggle?.setAttribute('aria-expanded', 'false');
  }
};

// =============================================================================
// FAQ Accordion
// =============================================================================
const FAQAccordion = {
  init() {
    // Handle original .faq-item elements
    this.items = document.querySelectorAll('.faq-item');
    this.items.forEach(item => {
      const question = item.querySelector('.faq-question');
      question?.addEventListener('click', () => this.toggle(item, this.items));
    });

    // Handle new .faq-card elements (hybrid design)
    this.cards = document.querySelectorAll('.faq-card');
    this.cards.forEach(card => {
      const question = card.querySelector('.faq-card-question');
      question?.addEventListener('click', () => this.toggle(card, this.cards));
    });
  },

  toggle(item, collection) {
    const isOpen = item.classList.contains('active');

    // Close all items in the same collection first (only one open at a time)
    collection.forEach(i => i.classList.remove('active'));

    // Open clicked item if it wasn't already open
    if (!isOpen) {
      item.classList.add('active');
    }
  }
};

// =============================================================================
// Smooth Scroll for Anchor Links
// =============================================================================
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
};

// =============================================================================
// Scroll-Triggered Animations
// =============================================================================
const ScrollAnimations = {
  init() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    elements.forEach(el => observer.observe(el));
  }
};

// =============================================================================
// Initialize All Modules
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  PageTransitions.init();
  ScrollProgress.init();
  MobileNav.init();
  FAQAccordion.init();
  SmoothScroll.init();
  ScrollAnimations.init();

  // Theme toggle button
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => ThemeManager.toggle());
  }

  // Update theme icons based on current theme
  updateThemeIcons();
});

// Update theme icons visibility
function updateThemeIcons() {
  const theme = document.documentElement.getAttribute('data-theme');
  const sunIcon = document.querySelector('.icon-sun');
  const moonIcon = document.querySelector('.icon-moon');

  if (sunIcon && moonIcon) {
    sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
    moonIcon.style.display = theme === 'light' ? 'block' : 'none';
  }
}

// Override setTheme to also update icons
const originalSetTheme = ThemeManager.setTheme.bind(ThemeManager);
ThemeManager.setTheme = function(theme) {
  originalSetTheme(theme);
  updateThemeIcons();
};

// Expose theme toggle for external use (e.g., button onclick)
window.toggleTheme = () => ThemeManager.toggle();


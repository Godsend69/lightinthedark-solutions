/* ═══════════════════════════════════════════════════════
   LIGHT IN THE DARK SOLUTIONS — Main JavaScript
   © Cyrus Nash · Athens, Greece
═══════════════════════════════════════════════════════ */

// ─── NAV SCROLL ───
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ─── HAMBURGER ───
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

// ─── ACTIVE NAV LINK ───
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a, .mobile-nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ─── SCROLL REVEAL ───
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });
reveals.forEach(el => revealObserver.observe(el));

// ─── PARTICLES HERO ───
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.18;
    this.speedY = (Math.random() - 0.5) * 0.18;
    this.opacity = Math.random() * 0.55 + 0.1;
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.gold = Math.random() > 0.72;
  }

  Particle.prototype.update = function() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.twinkle += this.twinkleSpeed;
    if (this.x < 0) this.x = W;
    if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H;
    if (this.y > H) this.y = 0;
  };

  Particle.prototype.draw = function() {
    const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.twinkle));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.gold
      ? `rgba(200,146,58,${alpha})`
      : `rgba(240,230,210,${alpha * 0.6})`;
    ctx.fill();
  };

  function init() {
    resize();
    const count = Math.floor((W * H) / 8000);
    particles = Array.from({ length: Math.min(count, 180) }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  animate();
}

// ─── PRICING TOGGLE ───
const toggleInput = document.getElementById('billing-toggle');
if (toggleInput) {
  const monthlyPrices = document.querySelectorAll('[data-monthly]');
  const annualPrices = document.querySelectorAll('[data-annual]');
  const periodLabels = document.querySelectorAll('.price-period');
  const monthlyLabel = document.querySelector('.label-monthly');
  const annualLabel = document.querySelector('.label-annual');
  const saveBadges = document.querySelectorAll('.save-badge');

  toggleInput.addEventListener('change', () => {
    const isAnnual = toggleInput.checked;
    monthlyPrices.forEach(el => { el.style.display = isAnnual ? 'none' : 'block'; });
    annualPrices.forEach(el => { el.style.display = isAnnual ? 'block' : 'none'; });
    periodLabels.forEach(el => { el.textContent = isAnnual ? 'per year · billed annually' : 'per month · cancel anytime'; });
    saveBadges.forEach(el => { el.style.display = isAnnual ? 'inline-block' : 'none'; });
    if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
    if (annualLabel) annualLabel.classList.toggle('active', isAnnual);
  });

  // Set initial state
  monthlyLabel && monthlyLabel.classList.add('active');
}

// ─── FAQ ACCORDION ───
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
    }
  });
});

// ─── CONTACT FORM ───
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const formspreeAction = this.getAttribute('action');
    if (!formspreeAction || formspreeAction.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      const success = document.getElementById('form-success');
      if (success) {
        success.style.display = 'block';
        this.reset();
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    }
  });
}

// ─── STRIPE CHECKOUT ───
function openStripeCheckout(planKey) {
  const links = window.STRIPE_LINKS || {};
  const url = links[planKey];
  if (url && !url.includes('YOUR_STRIPE')) {
    window.open(url, '_blank');
  } else {
    alert('Stripe payment processing will be activated shortly.\n\nPlease contact us directly to get started:\nEmail: contact@lightinthedark.solutions');
  }
}

// ─── SMOOTH ANCHOR ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

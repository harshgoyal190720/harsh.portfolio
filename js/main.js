/**
 * HARSH GOYAL — PREMIUM SOFTWARE ENGINEER PORTFOLIO
 * High-performance interactive script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCustomCursor();
  initMagneticElements();
  initProjectTiltAndSpotlight();
  initHeroCanvas();
  initContactForm();
  initCopyButtons();
  initModals();
  initArduinoSimToggle();
});

/* --------------------------------------------------------------------------
   1. Navbar & ScrollSpy
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileClose = document.querySelector('.mobile-drawer-close');

  // Sticky blur on scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  const toggleMobileNav = (open) => {
    mobileOverlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => toggleMobileNav(true));
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => toggleMobileNav(false));
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) toggleMobileNav(false);
    });
  }

  // Close mobile nav on click of any link
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });
}

/* --------------------------------------------------------------------------
   2. Custom Cursor System
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (isTouch || prefersReducedMotion) return;

  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  const label = document.querySelector('.custom-cursor-label');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }, { passive: true });

  // Smooth lerp loop for the trailing ring
  const renderCursor = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Interactive Cursor States
  const interactiveElements = document.querySelectorAll('[data-cursor]');
  
  interactiveElements.forEach(el => {
    const cursorType = el.getAttribute('data-cursor');
    
    el.addEventListener('mouseenter', () => {
      if (cursorType && cursorType !== 'hover') {
        document.body.classList.add('cursor-badge');
        if (label) label.textContent = cursorType;
      } else {
        document.body.classList.add('cursor-hover');
      }
    });

    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-badge');
      if (label) label.textContent = '';
    });
  });

  // Default interactive tags (links, buttons)
  document.querySelectorAll('a:not([data-cursor]), button:not([data-cursor])').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* --------------------------------------------------------------------------
   3. Magnetic Button Interaction
   -------------------------------------------------------------------------- */
function initMagneticElements() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  const magnetics = document.querySelectorAll('.btn-magnetic, .btn-primary, .btn-secondary');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   4. Project Card 3D Tilt & Cursor Spotlight
   -------------------------------------------------------------------------- */
function initProjectTiltAndSpotlight() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for radial spotlight
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (!isTouch) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* --------------------------------------------------------------------------
   5. Hero Animated Background Grid & Particles
   -------------------------------------------------------------------------- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let width, height;
  const particles = [];
  const particleCount = 42;

  const resize = () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const animate = () => {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 120) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationId = requestAnimationFrame(animate);
  };

  animate();
}

/* --------------------------------------------------------------------------
   6. Contact Form Validation & State
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim();
    const email = form.elements['email']?.value.trim();
    const subject = form.elements['subject']?.value.trim();
    const message = form.elements['message']?.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name || !email || !subject || !message) {
      showAlert('Please fill in all required fields.', 'error');
      return;
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address.', 'error');
      return;
    }

    // Submission simulation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Sending...
    `;

    setTimeout(() => {
      showAlert("Thanks for reaching out. I'll get back to you soon.", 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 800);
  });

  function showAlert(msg, type) {
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `form-status-alert ${type}`;
    alertBox.style.display = 'flex';
  }
}

/* --------------------------------------------------------------------------
   7. Copy to Clipboard Utility
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalTitle = btn.getAttribute('title') || 'Copy';
        btn.setAttribute('title', 'Copied!');
        
        // Visual feedback
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.style.transform = 'scale(1.25)';
          svg.style.color = 'var(--accent-cyan)';
          setTimeout(() => {
            svg.style.transform = '';
            svg.style.color = '';
            btn.setAttribute('title', originalTitle);
          }, 1500);
        }
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Certificate & Resume Modals
   -------------------------------------------------------------------------- */
function initModals() {
  const modalOverlay = document.getElementById('globalModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalCloseBtn');

  if (!modalOverlay || !modalClose) return;

  const openModal = (title, content) => {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Certificate Modal Handlers
  const certData = {
    'python': {
      title: 'Programming Fundamentals using Python - Part 2',
      issuer: 'Infosys Springboard',
      date: 'July 30, 2026',
      verifyUrl: 'https://verify.onwingspan.com',
      desc: 'Advanced Python programming constructs, recursion, data structures, modular software development, object-oriented concepts, and computational problem solving certified by Infosys Limited.'
    },
    'design-thinking': {
      title: 'Design Thinking and Innovation',
      issuer: 'IIT Bombay via Coursera',
      date: 'July 14, 2026',
      verifyUrl: 'https://coursera.org/verify/YTSDE176LDG5',
      verifyCode: 'YTSDE176LDG5',
      desc: 'Human-centered design methodology, iterative problem solving, rapid prototyping, and user-centric solution architecture authorized by IIT Bombay.'
    },
    'c-prog': {
      title: 'Computer Programming in C',
      issuer: 'NeoColab • iamneo & LPU',
      date: 'May 21, 2026',
      desc: '150-hour comprehensive course covering core programming, dynamic memory, pointers, control logic, arrays, and problem-solving.'
    },
    'esl': {
      title: 'ESL002: Intermediate English as a Second Language',
      issuer: 'Saylor Academy',
      date: 'January 31, 2026',
      desc: '15-hour credential covering intermediate English communication, technical comprehension, and grammar proficiency with a final grade of 81.48%.'
    }
  };

  document.querySelectorAll('[data-cert-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certId = btn.getAttribute('data-cert-modal');
      const cert = certData[certId];
      if (!cert) return;

      let contentHtml = '';

      if (certId === 'python') {
        contentHtml = `
          <div style="text-align: center;">
            <div style="background: #ffffff; padding: 0.5rem; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.25rem; overflow: hidden;">
              <img 
                src="assets/cert-python.jpg" 
                alt="Programming Fundamentals using Python - Part 2 Certificate — Harsh Goyal" 
                style="width: 100%; max-width: 780px; height: auto; display: block; margin: 0 auto; border-radius: 4px; object-fit: contain;"
              >
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; background: rgba(8,12,20,0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem 1.25rem;">
              <div style="text-align: left; font-size: 0.85rem;">
                <div style="color: var(--text-primary); font-weight: 700;">Infosys Springboard Verified Credential</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">Issued on Thursday, July 30, 2026 • Recipient: Harsh Goyal</div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <a href="https://verify.onwingspan.com" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" data-cursor="Verify">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Verify on Wingspan</span>
                </a>
                <a href="assets/cert-python.jpg" target="_blank" class="btn btn-secondary btn-sm" data-cursor="View">
                  <span>Open Full Image</span>
                </a>
                <button class="btn btn-secondary btn-sm" onclick="window.print()">Print / Save PDF</button>
              </div>
            </div>
          </div>
        `;
      } else if (certId === 'design-thinking') {
        contentHtml = `
          <div style="text-align: center;">
            <div style="background: #ffffff; padding: 0.5rem; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.25rem; overflow: hidden;">
              <img 
                src="assets/cert-design-thinking.jpg" 
                alt="Design Thinking and Innovation Certificate — Harsh Goyal — IIT Bombay & Coursera" 
                style="width: 100%; max-width: 780px; height: auto; display: block; margin: 0 auto; border-radius: 4px; object-fit: contain;"
              >
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; background: rgba(8,12,20,0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem 1.25rem;">
              <div style="text-align: left; font-size: 0.85rem;">
                <div style="color: var(--text-primary); font-weight: 700;">IIT Bombay & Coursera Verified Credential</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">Verification Code: <strong>YTSDE176LDG5</strong> • Jul 14, 2026</div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <a href="https://coursera.org/verify/YTSDE176LDG5" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" data-cursor="Verify">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Verify on Coursera</span>
                </a>
                <a href="assets/cert-design-thinking.jpg" target="_blank" class="btn btn-secondary btn-sm" data-cursor="View">
                  <span>Open Full Image</span>
                </a>
                <button class="btn btn-secondary btn-sm" onclick="window.print()">Print / Save PDF</button>
              </div>
            </div>
          </div>
        `;
      } else if (certId === 'c-prog') {
        contentHtml = `
          <div style="text-align: center;">
            <div style="background: #ffffff; padding: 0.5rem; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.25rem; overflow: hidden;">
              <img 
                src="assets/cert-c.jpg" 
                alt="Computer Programming in C Certificate of Appreciation — Harsh Goyal — NeoColab & iamneo" 
                style="width: 100%; max-width: 780px; height: auto; display: block; margin: 0 auto; border-radius: 4px; object-fit: contain;"
              >
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; background: rgba(8,12,20,0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem 1.25rem;">
              <div style="text-align: left; font-size: 0.85rem;">
                <div style="color: var(--text-primary); font-weight: 700;">iamneo & Lovely Professional University Credential</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">Issue Date: <strong>21-May-2026</strong> • Duration: 150 Hours (18-Jan-2026 to 20-May-2026)</div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <a href="assets/cert-c.jpg" target="_blank" class="btn btn-primary btn-sm" data-cursor="View">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Open Full Image</span>
                </a>
                <button class="btn btn-secondary btn-sm" onclick="window.print()">Print / Save PDF</button>
              </div>
            </div>
          </div>
        `;
      } else if (certId === 'esl') {
        contentHtml = `
          <div style="text-align: center;">
            <div style="background: #ffffff; padding: 0.5rem; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.25rem; overflow: hidden;">
              <img 
                src="assets/cert-esl.jpg" 
                alt="ESL002: Intermediate English as a Second Language Certificate — Harsh Goyal — Saylor Academy" 
                style="width: 100%; max-width: 780px; height: auto; display: block; margin: 0 auto; border-radius: 4px; object-fit: contain;"
              >
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; background: rgba(8,12,20,0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.85rem 1.25rem;">
              <div style="text-align: left; font-size: 0.85rem;">
                <div style="color: var(--text-primary); font-weight: 700;">Saylor Academy Verified Credential</div>
                <div style="color: var(--text-muted); font-size: 0.75rem;">Certificate ID: <strong>4071105612HG</strong> • Grade: <strong>81.48%</strong> (15 Hours / 1.5 CEU) • Jan 31, 2026</div>
              </div>

              <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
                <a href="assets/cert-esl.jpg" target="_blank" class="btn btn-primary btn-sm" data-cursor="View">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Open Full Image</span>
                </a>
                <button class="btn btn-secondary btn-sm" onclick="window.print()">Print / Save PDF</button>
              </div>
            </div>
          </div>
        `;
      } else {
        contentHtml = `
          <div style="text-align:center; padding: 1.5rem 0;">
            <div style="width: 70px; height: 70px; margin: 0 auto 1.25rem auto; border-radius: 50%; background: rgba(99,102,241,0.12); display: flex; align-items: center; justify-content: center; color: var(--accent-indigo);">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 15l-2 5l9-13h-7l2-5l-9 13h7z"/>
              </svg>
            </div>
            <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--text-primary);">${cert.title}</h4>
            <p style="color: var(--accent-cyan); font-weight: 600; font-size: 0.95rem; margin-bottom: 0.5rem;">${cert.issuer} • ${cert.date}</p>
            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem; max-width: 480px; margin-left: auto; margin-right: auto;">${cert.desc}</p>
            <div style="background: rgba(8,12,20,0.6); border: 1px dashed var(--border-light); border-radius: var(--radius-md); padding: 1.25rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
              [Official Certificate Verification: ${certId.toUpperCase()}-VERIFIED]
            </div>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('globalModal').classList.remove('open'); document.body.style.overflow='';" style="width: auto;">Close Preview</button>
          </div>
        `;
      }

      openModal('Certificate Credential — ' + cert.title, contentHtml);
    });
  });

  // Resume Download / Preview Handler
  document.querySelectorAll('[data-resume-download]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const resumeHtml = `
        <div style="padding: 1rem 0;">
          <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
            <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">Harsh Goyal</h3>
            <p style="color: var(--accent-cyan); font-weight: 600;">B.Tech Computer Science & Engineering • 2nd Year • CGPA 9.31</p>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">Lovely Professional University • harshgoyal190720@gmail.com • +91 94642188078</p>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.75rem;">
            <div>
              <h5 style="color: var(--text-primary); font-weight: 700; margin-bottom: 0.25rem;">Key Highlights:</h5>
              <ul style="padding-left: 1.25rem; line-height: 1.6;">
                <li>Academic Excellence: 9.31 CGPA at Lovely Professional University (10th: 90.6%, 12th: 75.8%).</li>
                <li>Projects (5+ Projects): PlaceIQ (AI Career Readiness), 3-Year Placement Roadmap for B.Tech CSE, TGPA Calculator (React.js, Google Auth), Arduino Surveillance System (IoT/Embedded), AuraBand (Fall Detection).</li>
                <li>Educator: Harsh Codes YouTube Channel, Python 21-Day Bootcamp, and B.Tech CSE Placement Roadmaps.</li>
                <li>Skills: C, C++, Python, JavaScript, React.js, DSA, OOP, Systems Programming, IoT, Git, AI/ML.</li>
              </ul>
            </div>
          </div>

          <div style="display: flex; gap: 0.8rem; justify-content: flex-end; flex-wrap: wrap;">
            <a href="assets/Harsh_Goyal_Resume.docx" download="Harsh_Goyal_Resume.docx" class="btn btn-primary btn-sm" data-cursor="Download">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download .DOCX Resume</span>
            </a>
            <button class="btn btn-secondary btn-sm" onclick="window.print()">Print / Save PDF</button>
            <a href="mailto:harshgoyal190720@gmail.com?subject=Resume%20Inquiry%20-%20Harsh%20Goyal" class="btn btn-secondary btn-sm">Contact Harsh</a>
          </div>
        </div>
      `;
      openModal('Resume — Harsh Goyal', resumeHtml);
    });
  });
}

/* --------------------------------------------------------------------------
   9. Arduino Surveillance Live Simulation Interactive Toggle
   -------------------------------------------------------------------------- */
function initArduinoSimToggle() {
  const toggleBtn = document.getElementById('arduinoSimToggle');
  const lcdDisplay = document.getElementById('arduinoLcd');
  const lcdLine1 = document.getElementById('lcdLine1');
  const lcdLine2 = document.getElementById('lcdLine2');
  const buzzerStatus = document.getElementById('buzzerStatus');
  const simStateBadge = document.getElementById('simStateBadge');

  if (!toggleBtn || !lcdDisplay) return;

  let isAlertMode = false;

  toggleBtn.addEventListener('click', () => {
    isAlertMode = !isAlertMode;

    if (isAlertMode) {
      toggleBtn.classList.add('alert-mode');
      toggleBtn.innerHTML = `
        <span style="display:flex; align-items:center; gap:0.4rem;">
          <span style="width:8px; height:8px; background:#ef4444; border-radius:50%; box-shadow:0 0 8px #ef4444;"></span>
          🔴 ALERT MODE — Object Detected (&lt;20cm)
        </span>
        <span style="font-size:0.75rem; text-decoration:underline;">Click to Reset</span>
      `;
      lcdDisplay.classList.add('alert-active');
      if (lcdLine1) lcdLine1.textContent = 'D: 12cm [ALERT!]';
      if (lcdLine2) lcdLine2.textContent = 'T: 26°C  H: 58%';
      if (buzzerStatus) {
        buzzerStatus.innerHTML = '<span style="color:#ef4444; font-weight:700;">BUZZER ON (ACTIVE)</span>';
      }
      if (simStateBadge) {
        simStateBadge.style.background = 'rgba(239,68,68,0.2)';
        simStateBadge.style.color = '#f87171';
        simStateBadge.textContent = 'PROXIMITY BREACH';
      }
    } else {
      toggleBtn.classList.remove('alert-mode');
      toggleBtn.innerHTML = `
        <span style="display:flex; align-items:center; gap:0.4rem;">
          <span style="width:8px; height:8px; background:#10b981; border-radius:50%; box-shadow:0 0 8px #10b981;"></span>
          🟢 STANDBY MODE — Monitoring...
        </span>
        <span style="font-size:0.75rem; text-decoration:underline;">Click to Toggle Alert</span>
      `;
      lcdDisplay.classList.remove('alert-active');
      if (lcdLine1) lcdLine1.textContent = 'SYSTEM_ONLINE';
      if (lcdLine2) lcdLine2.textContent = 'T: 24°C  H: 52%';
      if (buzzerStatus) {
        buzzerStatus.innerHTML = '<span style="color:#10b981; font-weight:700;">BUZZER OFF (SILENT)</span>';
      }
      if (simStateBadge) {
        simStateBadge.style.background = 'rgba(16,185,129,0.15)';
        simStateBadge.style.color = '#10b981';
        simStateBadge.textContent = 'STANDBY NORMAL';
      }
    }
  });
}


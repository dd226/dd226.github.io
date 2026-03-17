/* ═══════════════════════════════════════════════════════════
   Darko Dorsett Portfolio — Interactive Features
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── SCROLL PROGRESS BAR ──────────────────────────────── */
    const progressBar = document.getElementById('scrollProgress');

    function updateProgress() {
        const scrollTop  = window.scrollY;
        const docHeight  = document.body.scrollHeight - window.innerHeight;
        const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    }

    /* ─── NAVIGATION ───────────────────────────────────────── */
    const nav        = document.getElementById('mainNav');
    const navToggle  = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks   = document.querySelectorAll('.nav-links a');
    const sections   = document.querySelectorAll('section[id]');

    function updateNav() {
        const scrollTop = window.scrollY;

        // Show / hide nav
        if (scrollTop > 80) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            if (scrollTop >= section.offsetTop - 120) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }

    // Hamburger toggle
    navToggle.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
        mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
        });
    });

    /* ─── SMOOTH SCROLL ────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ─── TYPEWRITER EFFECT ────────────────────────────────── */
    const typewriterEl = document.getElementById('typewriter');
    const titles = [
        'Systems Administrator',
        'IT Leader',
        'Technology Strategist',
        'Infrastructure Expert',
        'Security Advocate',
    ];

    let titleIndex = 0;
    let charIndex  = 0;
    let isDeleting = false;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typewriterEl.textContent = current.slice(0, charIndex);

        let delay = isDeleting ? 45 : 95;

        if (!isDeleting && charIndex === current.length) {
            delay      = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting  = false;
            titleIndex  = (titleIndex + 1) % titles.length;
            delay       = 350;
        }

        setTimeout(type, delay);
    }

    // Start typewriter after initial hero animation settles
    setTimeout(type, 900);

    /* ─── SCROLL-REVEAL ANIMATIONS ─────────────────────────── */
    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el    = entry.target;
                    const delay = parseInt(el.dataset.delay || 0, 10);
                    setTimeout(() => el.classList.add('revealed'), delay);
                    revealObserver.unobserve(el);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* ─── COUNTER ANIMATION ────────────────────────────────── */
    const counterObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el       = entry.target;
                const target   = parseInt(el.dataset.target, 10);
                const duration = 1400;
                const start    = performance.now();

                function tick(now) {
                    const elapsed  = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic
                    const eased    = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);

                    if (progress < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        },
        { threshold: 0.6 }
    );

    document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

    /* ─── UNIFIED SCROLL HANDLER ───────────────────────────── */
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                updateNav();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial call
    updateProgress();
    updateNav();

    /* ─── PRINT HANDLER ────────────────────────────────────── */
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('is-printing');
        document.title = 'Darko_Dorsett_Resume';
        // Freeze typewriter to first title for print
        if (typewriterEl) typewriterEl.textContent = titles[0];
        // Force reveal all hidden elements for print
        document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => {
            el.classList.add('revealed');
        });
    });

    window.addEventListener('afterprint', () => {
        document.body.classList.remove('is-printing');
        document.title = 'Darko Dorsett — IT Systems Administrator';
    });

})();

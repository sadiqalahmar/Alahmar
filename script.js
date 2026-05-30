document.addEventListener('DOMContentLoaded', () => {
    // 1. LOADER LOGIC
    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    setTimeout(() => {
        if (loaderBar) loaderBar.style.width = '100%';
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
        }, 1000);
    }, 500);

    // 2. CUSTOM CURSOR
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    if (!isTouchDevice && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Smooth cursor
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

            // Smooth follower with trailing glow
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            if (cursorFollower) {
                cursorFollower.style.transform = `translate3d(${followerX - 16}px, ${followerY - 16}px, 0)`;
                cursorFollower.style.boxShadow = `0 0 20px var(--primary-glow)`;
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .magnetic');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursorFollower) {
                    cursorFollower.style.width = '80px';
                    cursorFollower.style.height = '80px';
                    cursorFollower.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
                    cursorFollower.style.border = '1px solid var(--primary)';
                }
                if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(0.5)`;
            });
            el.addEventListener('mouseleave', () => {
                if (cursorFollower) {
                    cursorFollower.style.width = '40px';
                    cursorFollower.style.height = '40px';
                    cursorFollower.style.backgroundColor = 'transparent';
                    cursorFollower.style.border = '2px solid var(--primary)';
                }
                if (cursor) cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) scale(1)`;
            });
        });
    } else {
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
    }

    // 3. THEME TOGGLE
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themes = ['dark-mode', 'light-mode', 'team-mode'];

    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        let currentThemeIndex = themes.indexOf(localStorage.getItem('theme') || 'dark-mode');
        if (currentThemeIndex === -1) currentThemeIndex = 0;
        
        body.className = themes[currentThemeIndex];
        updateThemeIcon();

        themeBtn.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            body.className = themes[currentThemeIndex];
            localStorage.setItem('theme', themes[currentThemeIndex]);
            updateThemeIcon();
        });

        function updateThemeIcon() {
            if (theme === 'dark-mode') {
                icon.className = 'fas fa-moon';
            } else if (theme === 'light-mode') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-users';
            }
        }
    }

    // 4. TYPING ANIMATION
    const typingText = document.querySelector('.typing-text');
    const roles = ['Frontend Developer', 'UI/UX Designer', 'Full-Stack Architect', 'Visionary Creator'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    if (typingText) {
        function type() {
            const currentRole = roles[roleIndex];
            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // 4.1 HERO DRIFTING SYMBOLS
    const hero = document.getElementById('hero');
    if (hero) {
        const symbolsContainer = document.createElement('div');
        symbolsContainer.className = 'hero-symbols';
        hero.appendChild(symbolsContainer);

        const syms = ['</>', '{ }', '[ ]', '( )', '=>', '&&', '||', ';', '!'];
        for (let i = 0; i < 15; i++) {
            const span = document.createElement('span');
            span.className = 'symbol';
            span.textContent = syms[Math.floor(Math.random() * syms.length)];
            span.style.left = `${Math.random() * 100}%`;
            span.style.animationDelay = `${Math.random() * 15}s`;
            span.style.fontSize = `${Math.random() * 2 + 1}rem`;
            symbolsContainer.appendChild(span);
        }
    }

    // 5. REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal, .reveal-text');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. MAGNETIC BUTTONS
    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // 7. 3D TILT EFFECT FOR CARDS
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 8. SCROLL EFFECTS
    const progressBar = document.querySelector('.scroll-progress');
    const nav = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.pageYOffset / totalScroll) * 100;
        if (progressBar) progressBar.style.height = `${progress}%`;

        if (window.scrollY > 100) {
            nav.classList.add('sticky');
            nav.style.padding = '0.8rem 0';
        } else {
            nav.classList.remove('sticky');
            nav.style.padding = '1.5rem 0';
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 10. MOBILE MENU TOGGLE
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksMobile = document.querySelectorAll('.nav-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });

    // 11. FORM SUBMISSION
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const myWhatsappNumber = '905363101322';
            const whatsappMsg = `Hello Sadiq! %0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Message:* ${message}`;
            window.open(`https://wa.me/${myWhatsappNumber}?text=${whatsappMsg}`, '_blank');
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'OPENING WHATSAPP...';
            btn.style.background = '#25D366';
            contactForm.reset();
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--primary)';
            }, 3000);
        });
    }

    // 12. ADVANCED TECH BACKGROUND & AURORA
    const canvas = document.getElementById('tech-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let shapes = [];
        const symbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '!', ';', '&&', '||', '=>', '0', '1'];
        
        class Particle {
            constructor() { this.init(); }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 12 + 8;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 20) + 1;
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.color = Math.random() > 0.5 ? 'rgba(168, 85, 247, 0.3)' : 'rgba(6, 182, 212, 0.2)';
                this.velocity = { x: (Math.random() - 0.5) * 0.3, y: (Math.random() - 0.5) * 0.3 };
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.font = `${this.size}px monospace`;
                ctx.fillText(this.symbol, this.x, this.y);
            }
            update() {
                this.baseX += this.velocity.x;
                this.baseY += this.velocity.y;
                if (this.baseX > canvas.width) this.baseX = 0;
                if (this.baseX < 0) this.baseX = canvas.width;
                if (this.baseY > canvas.height) this.baseY = 0;
                if (this.baseY < 0) this.baseY = canvas.height;

                let dx = mouseX - this.x;
                let dy = mouseY - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    let force = (150 - distance) / 150;
                    this.x -= (dx / distance) * force * this.density;
                    this.y -= (dy / distance) * force * this.density;
                } else {
                    this.x += (this.baseX - this.x) * 0.1;
                    this.y += (this.baseY - this.y) * 0.1;
                }
            }
        }

        class FloatingShape {
            constructor(side) {
                this.side = side;
                this.init();
            }
            init() {
                this.x = this.side === 'left' ? Math.random() * 200 : canvas.width - Math.random() * 200;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 100 + 50;
                this.angle = Math.random() * Math.PI * 2;
                this.rotation = Math.random() * 0.01;
                this.speed = Math.random() * 0.5 + 0.1;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.strokeStyle = 'rgba(168, 85, 247, 0.1)';
                ctx.lineWidth = 2;
                ctx.strokeRect(-this.size/2, -this.size/2, this.size, this.size);
                ctx.restore();
            }
            update() {
                this.angle += this.rotation;
                this.y -= this.speed;
                if (this.y < -this.size) this.y = canvas.height + this.size;
            }
        }

        function drawAurora() {
            const time = Date.now() * 0.001;
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, 'rgba(10, 10, 15, 1)');
            gradient.addColorStop(0.5, `rgba(26, 10, 46, ${0.5 + Math.sin(time) * 0.1})`);
            gradient.addColorStop(1, 'rgba(10, 10, 15, 1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Soft Aurora Waves
            ctx.globalCompositeOperation = 'screen';
            for (let i = 0; i < 3; i++) {
                const shift = time * (0.5 + i * 0.2);
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.7);
                for (let x = 0; x < canvas.width; x += 50) {
                    const y = canvas.height * 0.7 + Math.sin(x * 0.001 + shift) * 100 * Math.cos(shift * 0.5);
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                const waveGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
                waveGradient.addColorStop(0, 'transparent');
                waveGradient.addColorStop(0.5, i === 0 ? 'rgba(168, 85, 247, 0.1)' : i === 1 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(59, 130, 246, 0.1)');
                waveGradient.addColorStop(1, 'transparent');
                ctx.fillStyle = waveGradient;
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = Array.from({ length: 80 }, () => new Particle());
            shapes = [new FloatingShape('left'), new FloatingShape('right'), new FloatingShape('left'), new FloatingShape('right')];
        }

        function animate() {
            drawAurora();
            particles.forEach(p => { p.update(); p.draw(); });
            shapes.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(animate);
        }

        init();
        animate();
        window.addEventListener('resize', init);
    }
});

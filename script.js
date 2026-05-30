document.addEventListener('DOMContentLoaded', () => {
    // 1. LOADER LOGIC
    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    const forceHideLoader = setTimeout(() => {
        if (loader) loader.classList.add('hidden');
    }, 5000);

    setTimeout(() => {
        if (loaderBar) loaderBar.style.width = '100%';
        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
                clearTimeout(forceHideLoader);
                document.querySelectorAll('#hero .reveal-text, #hero .reveal').forEach(el => el.classList.add('active'));
            }
        }, 1000);
    }, 500);

    // 3. THEME TOGGLE
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeBtn) {
        const icon = themeBtn.querySelector('i');
        let currentTheme = localStorage.getItem('theme') || 'dark-mode';
        
        body.classList.add(currentTheme);
        updateThemeIcon(currentTheme);

        themeBtn.addEventListener('click', () => {
            const nextTheme = body.classList.contains('dark-mode') ? 'light-mode' : 'dark-mode';
            body.classList.remove('dark-mode', 'light-mode');
            body.classList.add(nextTheme);
            localStorage.setItem('theme', nextTheme);
            updateThemeIcon(nextTheme);
        });

        function updateThemeIcon(theme) {
            icon.className = theme === 'dark-mode' ? 'fas fa-moon' : 'fas fa-sun';
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
            typingText.textContent = isDeleting ? currentRole.substring(0, charIndex - 1) : currentRole.substring(0, charIndex + 1);
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

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

    // 5. REVEAL ANIMATIONS
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-text').forEach(el => revealObserver.observe(el));

    // 6. MAGNETIC BUTTONS (Throttled)
    const magneticBtns = document.querySelectorAll('.magnetic');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
            btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }, { passive: true });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate3d(0, 0, 0)';
        });
    });

    // 7. 3D TILT EFFECT FOR CARDS (Throttled)
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = (y - rect.height / 2) / 10;
            const rotateY = (rect.width / 2 - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        }, { passive: true });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 8. SCROLL EFFECTS (Throttled)
    const progressBar = document.querySelector('.scroll-progress');
    const nav = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            requestAnimationFrame(() => {
                const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
                const currentScroll = window.scrollY;
                const progress = (currentScroll / totalScroll) * 100;
                if (progressBar) progressBar.style.height = `${progress}%`;

                if (currentScroll > 100) {
                    nav.classList.add('sticky');
                } else {
                    nav.classList.remove('sticky');
                }

                // Active Link Update
                let current = '';
                sections.forEach(section => {
                    if (currentScroll >= section.offsetTop - 250) {
                        current = section.getAttribute('id');
                    }
                });
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href').slice(1) === current);
                });
                scrollTimeout = null;
            });
            scrollTimeout = true;
        }
    }, { passive: true });

    // 12. OPTIMIZED TECH BACKGROUND & AURORA
    const canvas = document.getElementById('tech-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        let particles = [];
        let shapes = [];
        const symbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '!', ';', '&&', '||', '=>', '0', '1'];
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        
        class Particle {
            constructor() { this.init(); }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 10 + 5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 15) + 1;
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.color = Math.random() > 0.5 ? 'rgba(139, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.2)';
                this.velocity = { x: (Math.random() - 0.5) * 0.2, y: (Math.random() - 0.5) * 0.2 };
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

                this.x += (this.baseX - this.x) * 0.05;
                this.y += (this.baseY - this.y) * 0.05;
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
                this.rotation = Math.random() * 0.005;
                this.speed = Math.random() * 0.3 + 0.1;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.strokeStyle = 'rgba(139, 0, 0, 0.15)';
                ctx.lineWidth = 1;
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
            const time = Date.now() * 0.0005;
            const isDark = body.classList.contains('dark-mode');
            ctx.fillStyle = isDark ? '#000000' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';
            for (let i = 0; i < 2; i++) {
                const shift = time * (0.3 + i * 0.1);
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.8);
                for (let x = 0; x < canvas.width; x += 100) {
                    const y = canvas.height * 0.8 + Math.sin(x * 0.001 + shift) * 60;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                const waveGradient = ctx.createLinearGradient(0, canvas.height * 0.5, 0, canvas.height);
                waveGradient.addColorStop(0, 'transparent');
                waveGradient.addColorStop(1, isDark ? 'rgba(139, 0, 0, 0.2)' : 'rgba(139, 0, 0, 0.08)');
                ctx.fillStyle = waveGradient;
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = Array.from({ length: particleCount }, () => new Particle());
            shapes = [new FloatingShape('left'), new FloatingShape('right'), new FloatingShape('left')];
        }

        function animate() {
            drawAurora();
            particles.forEach(p => { p.update(); p.draw(); });
            shapes.forEach(s => { s.update(); s.draw(); });
            requestAnimationFrame(animate);
        }

        init();
        animate();
        window.addEventListener('resize', () => {
            clearTimeout(window.resizeTimer);
            window.resizeTimeout = setTimeout(init, 200);
        }, { passive: true });
    }
});

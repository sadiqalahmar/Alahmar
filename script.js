document.addEventListener('DOMContentLoaded', () => {
    // 1. LOADER LOGIC
    const loader = document.querySelector('.loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    setTimeout(() => {
        loaderBar.style.width = '100%';
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    }, 500);

    // 2. CUSTOM CURSOR
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth cursor
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        // Smooth follower
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.transform = `translate3d(${followerX - 16}px, ${followerY - 16}px, 0)`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .tilt, .magnetic');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = `translate3d(${followerX - 16}px, ${followerY - 16}px, 0) scale(1.5)`;
            cursorFollower.style.backgroundColor = 'rgba(255, 44, 44, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = `translate3d(${followerX - 16}px, ${followerY - 16}px, 0) scale(1)`;
            cursorFollower.style.backgroundColor = 'transparent';
        });
    });

    // 3. THEME TOGGLE (Cycles through: Dark -> Light -> Team)
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeBtn.querySelector('i');
    const themes = ['dark-mode', 'light-mode', 'team-mode'];

    // Load saved theme
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
        const theme = themes[currentThemeIndex];
        if (theme === 'dark-mode') {
            icon.className = 'fas fa-moon';
        } else if (theme === 'light-mode') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-users'; // Icon for Team Mode
        }
    }

    // 4. TYPING ANIMATION
    const typingText = document.querySelector('.typing-text');
    const roles = ['Frontend Developer', 'UI/UX Designer', 'Full-Stack Architect', 'Visionary Creator'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

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

    // 5. REVEAL ANIMATIONS (Intersection Observer)
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

    // 9. NAVBAR SCROLL EFFECT & ACTIVE LINK
    const nav = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Nav Shadow/Blur
        if (window.scrollY > 50) {
            nav.style.padding = '1rem 0';
            nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else {
            nav.style.padding = '1.5rem 0';
            nav.style.boxShadow = 'none';
        }

        // Active Link Update
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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
    
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // 11. FORM SUBMISSION (WhatsApp Redirect)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Your WhatsApp Number
            const myWhatsappNumber = '905363101322';
            
            // Construct the WhatsApp Message
            const whatsappMsg = `Hello Sadiq! %0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Message:* ${message}`;
            
            // Redirect to WhatsApp
            window.open(`https://wa.me/${myWhatsappNumber}?text=${whatsappMsg}`, '_blank');
            
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'OPENING WHATSAPP...';
            btn.style.background = '#25D366'; // WhatsApp Green
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = 'var(--primary)';
            }, 3000);
        });
    }

    // 12. TECH BACKGROUND ANIMATION
    const canvas = document.getElementById('tech-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const symbols = ['{', '}', '[', ']', '(', ')', '<', '>', '/', '!', ';', '&&', '||', '=>', '0', '1'];
        const particleCount = window.innerWidth < 768 ? 40 : 80;

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 14 + 10;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.color = Math.random() > 0.5 ? 'rgba(255, 44, 44, 0.4)' : 'rgba(255, 255, 255, 0.1)';
                this.velocity = {
                    x: (Math.random() - 0.5) * 0.5,
                    y: (Math.random() - 0.5) * 0.5
                };
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.font = `${this.size}px monospace`;
                ctx.fillText(this.symbol, this.x, this.y);
            }

            update() {
                // Floating movement
                this.baseX += this.velocity.x;
                this.baseY += this.velocity.y;

                // Screen Wrap
                if (this.baseX > canvas.width) this.baseX = 0;
                if (this.baseX < 0) this.baseX = canvas.width;
                if (this.baseY > canvas.height) this.baseY = 0;
                if (this.baseY < 0) this.baseY = canvas.height;

                // Mouse interaction
                let dx = mouseX - this.x;
                let dy = mouseY - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let maxDistance = 150;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Return to base position smoothly
                    if (this.x !== this.baseX) {
                        let dx = this.x - this.baseX;
                        this.x -= dx / 20;
                    }
                    if (this.y !== this.baseY) {
                        let dy = this.y - this.baseY;
                        this.y -= dy / 20;
                    }
                }
            }
        }

        function initParticles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].draw();
                particles[i].update();
            }
            requestAnimationFrame(animate);
        }

        initParticles();
        animate();

        window.addEventListener('resize', () => {
            initParticles();
        });
    }
});


// Replace the existing DOMContentLoaded event listener with this enhanced version
document.addEventListener('DOMContentLoaded', () => {
    // Enable smooth scrolling with momentum
    document.documentElement.style.scrollBehavior = 'auto'; // Disable native smooth scroll
    document.body.style.overscrollBehavior = 'none'; // Prevent pull-to-refresh
    
    // Navbar Toggle with smoother animation
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.overlay');

    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Add smooth transition for mobile menu
        if (navLinks.classList.contains('active')) {
            gsap.from('.nav-links li', {
                opacity: 0,
                y: 20,
                duration: 0.4,
                stagger: 0.1,
                ease: 'power2.out'
            });
        }
    });

    overlay.addEventListener('click', () => {
        navbarToggle.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Theme Toggle with smoother transition
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        gsap.to(body, {
            duration: 0.6,
            ease: 'power2.inOut',
            '--gradient': body.classList.contains('dark-mode') 
                ? 'linear-gradient(45deg, #ff6b6b, #4a90e2)' 
                : 'linear-gradient(45deg, #4a90e2, #ff6b6b)',
            onComplete: () => {
                body.classList.toggle('dark-mode');
                body.classList.toggle('light-mode');
                themeToggle.innerHTML = body.classList.contains('dark-mode')
                    ? '<i class="fas fa-moon"></i>'
                    : '<i class="fas fa-sun"></i>';
            }
        });
    });

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Enhanced smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1.4,
                    scrollTo: {
                        y: target,
                        autoKill: true,
                        offsetY: 80
                    },
                    ease: 'expo.inOut'
                });
            }
        });
    });

    // Hero Section Animation with more fluid motion
    const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    heroTl
        .from('.hero-content h1', {
            opacity: 0,
            y: -40,
            duration: 1.4,
            ease: 'elastic.out(1, 0.5)'
        })
        .from('.hero-content p', {
            opacity: 0,
            y: 40,
            duration: 1.2
        }, '-=1.0')
        .from('.hero-description', {
            opacity: 0,
            y: 20,
            duration: 1.0
        }, '-=0.8')
        .from('.hero-buttons', {
            opacity: 0,
            y: 30,
            duration: 1.0,
            ease: 'back.out(1.7)'
        }, '-=0.6');

    // Section Animations with smoother entrance
    gsap.utils.toArray(['.about', '.committee', '.events', '.gallery-preview', '.contact']).forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 100,
            duration: 1.4,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
                markers: false
            }
        });
    });

    // Card Animations with smoother stagger
    gsap.utils.toArray('.member-card, .event-card, .gallery-item').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: i * 0.08,
            ease: 'back.out(1.4)',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                duration: 0.3,
                y: -8,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.4,
                y: 0,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    // Enhanced Particles Animation with more organic movement
    const particlesContainer = document.querySelector('.hero-particles');
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    particlesContainer.appendChild(canvas);
    
    const resizeCanvas = () => {
        canvas.width = particlesContainer.offsetWidth;
        canvas.height = particlesContainer.offsetHeight;
    };
    resizeCanvas();

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.reset(true);
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 10;
            this.angle = Math.random() * Math.PI * 2;
            this.velocity = Math.random() * 0.2 + 0.05;
        }

        reset(initial = false) {
            this.x = initial ? Math.random() * canvas.width : Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : -10;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 + 0.8;
            this.opacity = Math.random() * 0.4 + 0.2;
        }

        update() {
            // Organic floating movement with circular motion
            this.angle += this.velocity;
            const dx = Math.cos(this.angle) * 0.5;
            const dy = Math.sin(this.angle) * 0.5;
            
            this.x += (this.speedX + dx) * 0.3;
            this.y += (this.speedY + dy) * 0.3;

            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = `rgba(74, 144, 226, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create a subtle gradient for depth
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(13, 13, 13, 0.1)');
        gradient.addColorStop(1, 'rgba(13, 13, 13, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Handle window resize with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            // Reposition particles after resize
            particles.forEach(p => p.reset(true));
        }, 250);
    });

    // Enhanced parallax effect
    const hero = document.querySelector('.hero');
    if (hero) {
        gsap.to(hero, {
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            y: 150,
            ease: 'none'
        });
    }
});
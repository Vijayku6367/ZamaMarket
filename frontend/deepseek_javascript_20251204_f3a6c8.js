// Advanced Animation System for DarkMarket FHE
class AnimationManager {
    constructor() {
        this.scrollController = null;
        this.parallaxItems = [];
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallax();
        this.setupNavigationAnimations();
        this.setupEncryptionAnimations();
        this.setupHoverEffects();
        this.setupPageTransitions();
    }

    setupScrollAnimations() {
        // GSAP ScrollTrigger setup
        if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
            gsap.registerPlugin(ScrollTrigger);
            
            // Hero section entrance
            gsap.from('.hero-content', {
                duration: 1,
                y: 50,
                opacity: 0,
                ease: 'power3.out'
            });

            // Product card staggered animation
            gsap.from('.product-card', {
                scrollTrigger: {
                    trigger: '.marketplace-section',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                duration: 0.8,
                y: 50,
                opacity: 0,
                stagger: 0.1,
                ease: 'back.out(1.7)'
            });

            // Encryption section fade in
            gsap.from('.encryption-panel', {
                scrollTrigger: {
                    trigger: '.encryption-section',
                    start: 'top 70%'
                },
                duration: 1,
                x: -50,
                opacity: 0,
                ease: 'power3.out'
            });

            gsap.from('.bid-panel', {
                scrollTrigger: {
                    trigger: '.encryption-section',
                    start: 'top 70%'
                },
                duration: 1,
                x: 50,
                opacity: 0,
                ease: 'power3.out'
            });
        }
    }

    setupParallax() {
        // Parallax effect for background elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            // Navbar effect
            const navbar = document.querySelector('.glass-nav');
            if (scrolled > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupNavigationAnimations() {
        const navLinks = document.querySelectorAll('.nav-link');
        const navIndicator = document.querySelector('.nav-indicator');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (navIndicator) {
                    gsap.to(navIndicator, {
                        left: rect.left + window.scrollX,
                        width: rect.width,
                        duration: 0.3,
                        ease: 'power3.out'
                    });
                }
                
                // Glow effect
                gsap.to(e.currentTarget, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: 'power2.out'
                });
            });
            
            link.addEventListener('mouseleave', (e) => {
                gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.in'
                });
            });
        });
    }

    setupEncryptionAnimations() {
        const encryptBtn = document.getElementById('encryptBtn');
        const encryptedValue = document.getElementById('encryptedValue');
        
        if (encryptBtn) {
            encryptBtn.addEventListener('click', () => {
                this.animateEncryptionProcess();
            });
        }
    }

    animateEncryptionProcess() {
        const encryptedValue = document.getElementById('encryptedValue');
        const plainBar = document.querySelector('.plain-bar');
        const encryptedBar = document.querySelector('.encrypted-bar');
        
        // Reset
        encryptedValue.innerHTML = '<span class="placeholder">Encrypting...</span>';
        gsap.set([plainBar, encryptedBar], { scaleX: 0 });
        
        // Animation sequence
        const tl = gsap.timeline();
        
        // Plain text fade out
        tl.to('.input-with-action', {
            opacity: 0.5,
            duration: 0.5,
            ease: 'power2.in'
        })
        
        // Encryption bar animation
        tl.to(plainBar, {
            scaleX: 1,
            duration: 1,
            ease: 'power2.inOut'
        }, '-=0.3')
        
        // Ciphertext generation
        tl.to(encryptedBar, {
            scaleX: 1,
            duration: 1.5,
            ease: 'power3.inOut',
            onComplete: () => {
                this.generateCiphertextAnimation();
            }
        })
        
        // Restore input
        tl.to('.input-with-action', {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    generateCiphertextAnimation() {
        const encryptedValue = document.getElementById('encryptedValue');
        const ciphertext = this.generateRandomCiphertext();
        
        // Typewriter effect
        let i = 0;
        const speed = 10;
        encryptedValue.innerHTML = '';
        
        const typeWriter = () => {
            if (i < ciphertext.length) {
                const char = ciphertext.charAt(i);
                const span = document.createElement('span');
                span.textContent = char;
                span.style.color = i % 2 === 0 ? '#00d9ff' : '#ff00ff';
                span.style.opacity = '0';
                
                encryptedValue.appendChild(span);
                
                gsap.to(span, {
                    opacity: 1,
                    duration: 0.05,
                    ease: 'power1.out'
                });
                
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        typeWriter();
    }

    generateRandomCiphertext() {
        const chars = '0123456789ABCDEF';
        let result = '0x';
        for (let i = 0; i < 64; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    setupHoverEffects() {
        // 3D tilt effect for cards
        const cards = document.querySelectorAll('.product-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });
    }

    setupPageTransitions() {
        // Smooth page transitions for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Add transition class
                    document.body.classList.add('page-transition');
                    
                    // Scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Remove transition class
                    setTimeout(() => {
                        document.body.classList.remove('page-transition');
                    }, 1000);
                }
            });
        });
    }

    // Particle system for background
    initParticleSystem() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = Math.random() > 0.5 ? '#00d9ff' : '#ff00ff';
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }
        }
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
                
                // Connect particles with lines
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = 0.1 * (1 - distance / 100);
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Animate encrypted numbers
    animateEncryptedNumbers() {
        const numbers = document.querySelectorAll('.encrypted-number');
        
        numbers.forEach(element => {
            const target = parseInt(element.dataset.value);
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            let step = 0;
            
            const timer = setInterval(() => {
                step++;
                current = Math.min(increment * step, target);
                
                // Add encryption effect
                if (step < steps) {
                    element.textContent = this.getRandomEncryptedNumber();
                } else {
                    element.textContent = target;
                    clearInterval(timer);
                }
            }, duration / steps);
        });
    }

    getRandomEncryptedNumber() {
        const length = 3;
        let result = '';
        const chars = '🔒⚡🌀✨🔑';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    animationManager.initParticleSystem();
    animationManager.animateEncryptedNumbers();
});
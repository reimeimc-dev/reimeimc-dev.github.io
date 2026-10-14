        /* --------------------------------------------------
         * Theme Toggle Logic
         * -------------------------------------------------- */
        const html = document.documentElement;
        const themeToggleBtn = document.getElementById('theme-toggle');
        const iconDark = document.getElementById('theme-icon-dark');
        const iconLight = document.getElementById('theme-icon-light');

        // Check stored theme or preference
        const currentTheme = localStorage.getItem('theme') || 'dark';

        function updateThemeUI(theme) {
            if (theme === 'dark') {
                html.classList.add('dark');
                html.classList.remove('light');
                iconDark.classList.add('hidden');
                iconLight.classList.remove('hidden');
            } else {
                html.classList.remove('dark');
                html.classList.add('light');
                iconLight.classList.add('hidden');
                iconDark.classList.remove('hidden');
            }
        }

        updateThemeUI(currentTheme);

        themeToggleBtn.addEventListener('click', () => {
            const isDark = html.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });

        /* --------------------------------------------------
         * Copy To Clipboard Function
         * -------------------------------------------------- */
        function copyToClipboard(text, message) {
            // Using execCommand for maximum compatibility in frame environments
            const tempInput = document.createElement('input');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            
            try {
                document.execCommand('copy');
                showToast(message || 'Copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            } finally {
                document.body.removeChild(tempInput);
            }
        }

        /* --------------------------------------------------
         * Toast Notification Helper
         * -------------------------------------------------- */
        let toastTimeout;
        function showToast(msg) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-message');
            
            toastMsg.textContent = msg;
            toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            toast.classList.add('opacity-100', 'translate-y-0');

            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('opacity-100', 'translate-y-0');
                toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
            }, 3000);
        }

        /* --------------------------------------------------
         * Scroll To Top Button Logic
         * -------------------------------------------------- */
        const backToTopBtn = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 250) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        /* --------------------------------------------------
         * Canvas Particle Effect (Minimal floating particles)
         * -------------------------------------------------- */
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.8 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = -Math.random() * 0.4 - 0.1; // Float upward
                this.alpha = Math.random() * 0.5 + 0.1;
                // Mostly subtle grey, occasionally accent red
                this.color = Math.random() > 0.85 ? '244, 63, 94' : '148, 163, 184';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.y < 0 || this.x < 0 || this.x > width) {
                    this.reset();
                    this.y = height;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let particles = [];
        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor(width * 0.05), 50); // Responsive particle count
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            // Render only if particle is enabled
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        }

        window.onload = function() {
            initParticles();
            animateParticles();
        };
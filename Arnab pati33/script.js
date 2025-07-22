// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading overlay after page loads
    setTimeout(function() {
        document.getElementById('loadingOverlay').style.opacity = '0';
        setTimeout(function() {
            document.getElementById('loadingOverlay').style.display = 'none';
            // Start typewriter effect after page loads
            startTypewriter();
            // Initialize scroll animations
            initScrollAnimations();
            // Update time and date
            updateTimeAndDate();
            // Load stats from localStorage
            loadStats();
        }, 500);
    }, 1000);

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    html.setAttribute('data-theme', savedTheme);

    // Update icon based on current theme
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const currentTheme = html.getAttribute('data-theme');
        themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('nav');

    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.innerHTML = nav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form Submission with EmailJS
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Hide any previous messages
            formSuccess.style.display = 'none';
            formError.style.display = 'none';

            // Validate form fields
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                formError.textContent = 'Please fill in all fields';
                formError.style.display = 'block';
                return;
            }

            // Validate email format
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                formError.textContent = 'Please enter a valid email address';
                formError.style.display = 'block';
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Send email using EmailJS
            emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            })
            .then(function(response) {
                // Show success message
                formSuccess.style.display = 'block';
                contactForm.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }, function(error) {
                // Show error message
                formError.textContent = 'Oops! Something went wrong. Please try again later.';
                formError.style.display = 'block';
                console.error('EmailJS Error:', error);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // CV Modal and Download Tracking
    const modal = document.getElementById('cvModal');
    const viewCvBtn = document.getElementById('viewCv');
    const downloadCvBtn = document.getElementById('downloadCv');
    const span = document.getElementsByClassName('close')[0];

    if (viewCvBtn) {
        viewCvBtn.onclick = function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            // Set iframe src to your actual CV URL
            document.querySelector('#cvModal iframe').src = 'Arnab_Pati_Resume.pdf';
            
            // Track CV view
            incrementStat('cvViews');
        }
    }

    if (downloadCvBtn) {
        downloadCvBtn.onclick = function(e) {
            e.preventDefault();
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = 'Arnab_Pati_Resume.pdf'; // Replace with your actual CV file path
            link.download = 'Arnab_Pati_Resume.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Track CV download
            incrementStat('cvDownloads');
        }
    }

    if (span) {
        span.onclick = function() {
            modal.style.display = 'none';
            document.querySelector('#cvModal iframe').src = '';
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.querySelector('#cvModal iframe').src = '';
        }
    }

    // Initialize Intersection Observer for scroll animations
    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Update Time and Date in Header
    function updateTimeAndDate() {
        const headerTime = document.getElementById('headerTime');
        
        if (!headerTime) return;
        
        function update() {
            const now = new Date();
            
            // Format time
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
            const formattedTime = now.toLocaleTimeString(undefined, timeOptions);
            
            // Format date
            const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = now.toLocaleDateString(undefined, dateOptions);
            
            headerTime.textContent = `${formattedDate} • ${formattedTime}`;
        }
        
        // Update immediately and then every second
        update();
        setInterval(update, 1000);
    }

    // Simplified Typewriter Effect
    function startTypewriter() {
        const typewriterText = document.getElementById('typewriterText');
        if (!typewriterText) return;

        const titles = ["Frontend Developer", "UI/UX Designer", "Web Enthusiast"];
        let currentTitleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            const currentTitle = titles[currentTitleIndex];
            const speed = isDeleting ? 50 : 150;

            typewriterText.textContent = currentTitle.substring(0, charIndex);

            if (!isDeleting && charIndex === currentTitle.length) {
                setTimeout(() => isDeleting = true, 1000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            }

            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
            setTimeout(typeWriter, speed);
        }

        setTimeout(typeWriter, 1000);
    }

    // Stats Counter Functions
    function loadStats() {
        // Track profile view
        incrementStat('profileViews');
        
        // Load saved stats from localStorage
        const cvViews = localStorage.getItem('cvViews') || 0;
        const cvDownloads = localStorage.getItem('cvDownloads') || 0;
        const profileViews = localStorage.getItem('profileViews') || 0;
        
        // Animate numbers
        animateCounter('cvViews', cvViews);
        animateCounter('cvDownloads', cvDownloads);
        animateCounter('profileViews', profileViews);
    }

    function incrementStat(statName) {
        let currentValue = parseInt(localStorage.getItem(statName)) || 0;
        currentValue++;
        localStorage.setItem(statName, currentValue);
        animateCounter(statName, currentValue);
    }

    function animateCounter(elementId, targetNumber) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const duration = 2000; // Animation duration in ms
        const startNumber = 0;
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentNumber = Math.floor(progress * (targetNumber - startNumber) + startNumber);
            
            element.textContent = currentNumber.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = targetNumber.toLocaleString();
            }
        }
        
        requestAnimationFrame(updateNumber);
    }
});
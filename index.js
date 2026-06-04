/**
 * Stackly - Main Application Script
 */
document.addEventListener("DOMContentLoaded", () => {

    // ===== Core Selectors =====
    const applicationSections = document.querySelectorAll(".app-section");
    const navigationAnchorLinks = document.querySelectorAll(".desktop-nav .nav-link");
    const mobileMenuTriggerBtn = document.getElementById("menu-btn");
    const mobileOverlayDrawerMenu = document.getElementById("mobile-menu");
    const errorModal = document.getElementById("error-modal");
    const errorCloseBtn = document.getElementById("error-close-btn");
    const errorHomeBtn = document.getElementById("error-home-btn");
    const particlesContainer = document.getElementById("error-particles");

    // ===== 404 Error Modal System =====
    // Collect all links/buttons that should trigger 404
    const errorTriggerLinks = document.querySelectorAll('[data-page="features"], [data-page="why-us"], [data-page="services"], [data-page="contact"], [data-page="about"], [data-page="login"], [data-page="social"]');
    const preloader = document.getElementById('preloader');

    function show404Modal(e) {
        e.preventDefault();
        e.stopPropagation();

        // Close mobile menu if open
        if (mobileOverlayDrawerMenu) {
            mobileOverlayDrawerMenu.classList.add("hidden");
        }

        // Show preloader transition
        if (preloader) {
            preloader.classList.remove("hidden");
        }

        // Redirect to full-page 404 after 1 second preloading transition
        setTimeout(() => {
            window.location.href = "404.html";
        }, 1000);
    }

    function close404Modal() {
        if (errorModal) {
            errorModal.classList.add("hidden");
            document.body.classList.remove("no-scroll");
            document.documentElement.classList.remove("no-scroll");
            clearParticles();
        }
    }

    function spawnParticles() {
        if (!particlesContainer) return;
        particlesContainer.innerHTML = "";
        const count = 18;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement("div");
            particle.classList.add("error-particle");
            
            const size = Math.random() * 24 + 6; // sizes between 6px and 30px
            const left = Math.random() * 100; // random percentage position
            const delay = Math.random() * 4; // staggered entry up to 4s
            const duration = Math.random() * 5 + 5; // animation float-up duration 5s to 10s
            const drift = Math.random() * 60 - 30; // drift offset -30px to 30px
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.setProperty("--drift", `${drift}px`);
            
            particlesContainer.appendChild(particle);
        }
    }

    function clearParticles() {
        if (particlesContainer) {
            particlesContainer.innerHTML = "";
        }
    }

    // Attach 404 trigger to all relevant links
    errorTriggerLinks.forEach((link) => {
        link.addEventListener("click", show404Modal);
    });



    // Close modal handlers
    if (errorCloseBtn) {
        errorCloseBtn.addEventListener("click", close404Modal);
    }

    if (errorHomeBtn) {
        errorHomeBtn.addEventListener("click", () => {
            close404Modal();
            // Smooth scroll to hero
            const heroSection = document.getElementById("hero");
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // Close modal on overlay click (outside card)
    if (errorModal) {
        errorModal.addEventListener("click", (e) => {
            if (e.target === errorModal) {
                close404Modal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            close404Modal();
        }
    });

    // ===== Mobile Navigation Drawer Toggle =====
    if (mobileMenuTriggerBtn && mobileOverlayDrawerMenu) {
        mobileMenuTriggerBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            mobileOverlayDrawerMenu.classList.toggle("hidden");

            // Toggle icon between bars and xmark
            const icon = mobileMenuTriggerBtn.querySelector("i");
            if (icon) {
                if (mobileOverlayDrawerMenu.classList.contains("hidden")) {
                    icon.className = "fa-solid fa-bars";
                    document.body.style.overflow = "";
                } else {
                    icon.className = "fa-solid fa-xmark";
                    document.body.style.overflow = "hidden";
                }
            }
        });

        // Close drawer when clicking any link/button inside
        const mobileLinks = mobileOverlayDrawerMenu.querySelectorAll("a, button");
        mobileLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mobileOverlayDrawerMenu.classList.add("hidden");
                document.body.style.overflow = "";
                const icon = mobileMenuTriggerBtn.querySelector("i");
                if (icon) icon.className = "fa-solid fa-bars";
            });
        });

        // Close drawer on outside click
        document.addEventListener("click", (e) => {
            if (!mobileOverlayDrawerMenu.contains(e.target) && !mobileMenuTriggerBtn.contains(e.target)) {
                if (!mobileOverlayDrawerMenu.classList.contains("hidden")) {
                    mobileOverlayDrawerMenu.classList.add("hidden");
                    document.body.style.overflow = "";
                    const icon = mobileMenuTriggerBtn.querySelector("i");
                    if (icon) icon.className = "fa-solid fa-bars";
                }
            }
        });
    }

    // ===== Active Navigation Link Tracker =====
    function updateActiveNavigationLinkState() {
        let currentActiveSectionId = "";

        applicationSections.forEach((section) => {
            const elementTopOffset = section.offsetTop;
            if (window.scrollY >= (elementTopOffset - 300)) {
                currentActiveSectionId = section.getAttribute("id");
            }
        });

        navigationAnchorLinks.forEach((link) => {
            link.classList.remove("active");
            const targetHrefAttr = link.getAttribute("href");
            if (targetHrefAttr === `#${currentActiveSectionId}`) {
                link.classList.add("active");
            }
        });
    }

    // ===== AOS Animation System =====
    function initializeAosAnimations() {
        // Dynamically add data-aos attributes to maintain compatibility with custom classes
        document.querySelectorAll(".reveal-fade-up").forEach((el) => {
            el.setAttribute("data-aos", "fade-up");
        });
        document.querySelectorAll(".reveal-zoom-in").forEach((el) => {
            el.setAttribute("data-aos", "zoom-in");
        });

        // Add staggered fade-up to footer columns
        const footerColumns = document.querySelectorAll(".footer-grid > div");
        footerColumns.forEach((col, index) => {
            col.setAttribute("data-aos", "fade-up");
            col.setAttribute("data-aos-delay", (index * 100).toString());
        });

        // Initialize AOS library
        if (typeof AOS !== "undefined") {
            AOS.init({
                duration: 800,
                easing: "ease-in-out",
                once: false,
                mirror: true,
                offset: 50
            });
        }
    }

    // ===== Metric Counter Animation =====
    function initializeMetricsCounters() {
        const numbersTargetNodeList = document.querySelectorAll(".counter");
        const statisticsSectionAnchor = document.getElementById("stats");

        if (!statisticsSectionAnchor) return;

        const metricsObserverInstance = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                numbersTargetNodeList.forEach((counter) => {
                    const maximumNumericalTarget = parseInt(counter.getAttribute("data-target"), 10);
                    const totalDuration = 2000;
                    const stepInterval = Math.floor(totalDuration / maximumNumericalTarget);
                    let currentValue = 0;

                    const incrementalIntervalLoop = setInterval(() => {
                        currentValue++;
                        counter.innerText = currentValue;
                        if (currentValue >= maximumNumericalTarget) {
                            counter.innerText = maximumNumericalTarget;
                            clearInterval(incrementalIntervalLoop);
                        }
                    }, Math.max(stepInterval, 10));
                });
                observer.unobserve(statisticsSectionAnchor);
            }
        }, { threshold: 0.2 });

        metricsObserverInstance.observe(statisticsSectionAnchor);
    }

    // ===== Header Background on Scroll =====
    function handleHeaderScroll() {
        const header = document.querySelector(".main-header");
        if (!header) return;

        if (window.scrollY > 50) {
            header.style.background = "rgba(2, 6, 23, 0.96)";
            header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
        } else {
            header.style.background = "rgba(2, 6, 23, 0.88)";
            header.style.boxShadow = "none";
        }
    }

    // ===== Hero Background Slideshow System =====
    function initializeHeroSlideshow() {
        const heroSlides = document.querySelectorAll(".hero-slide");
        if (heroSlides.length === 0) return;
        
        let currentSlideIndex = 0;
        const slideIntervalTime = 5000; // 5 seconds

        function nextHeroSlide() {
            heroSlides[currentSlideIndex].classList.remove("active");
            currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
            heroSlides[currentSlideIndex].classList.add("active");
        }

        setInterval(nextHeroSlide, slideIntervalTime);
    }

    // ===== Initialize All Systems =====
    window.addEventListener("scroll", () => {
        updateActiveNavigationLinkState();
        handleHeaderScroll();
    });

    initializeAosAnimations();
    initializeMetricsCounters();
    initializeHeroSlideshow();
    updateActiveNavigationLinkState();
    handleHeaderScroll();

    // Hide preloader after full page load
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden');
        }
    });
});
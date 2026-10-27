document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealOnScroll.observe(el));


    /* ==========================================================================
       2. SCROLL SPY (HIGHLIGHT SIDEBAR LINKS)
       ========================================================================== */
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    const spyOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Triggers when section is near the top
        threshold: 0
    };

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => {
        spyObserver.observe(section);
    });


    /* ==========================================================================
       3. CONTACT FORM HANDLING
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.form-submit');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            formStatus.textContent = '';
            formStatus.className = 'form-status';

            const formAction = this.getAttribute('action');

            // Check if the Formspree ID has been replaced
            if (formAction.includes('YOUR_FORMSPREE_ID')) {
                setTimeout(() => {
                    formStatus.textContent = 'Setup required: Please add a Formspree ID to the HTML.';
                    formStatus.classList.add('error');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 1000);
                return;
            }

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.textContent = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.classList.add('error');
                    });
                }
            })
            .catch(() => {
                formStatus.textContent = 'Network error. Please try again.';
                formStatus.classList.add('error');
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }


    /* ==========================================================================
       4. CURRENT YEAR IN FOOTER
       ========================================================================== */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       5. CUSTOM CURSOR (Optional - only runs on desktop)
       ========================================================================== */
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .skill-item, .tagline-item');
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-active'));
        });
    }

});
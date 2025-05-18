(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        center: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 45,
        dots: false,
        loop: true,
        autoplay: true,
        smartSpeed: 1000,
        autoplayTimeout: 2000,
        autoplaySpeed: 500,
        responsive: {
            0: {
                items: 2
            },
            576: {
                items: 2
            },
            768: {
                items: 4
            },
            992: {
                items: 6
            }
        }
    });

    // Utility function to load an HTML fragment
    function loadFragment(url, containerId) {
        return fetch(url)
            .then(res => res.text())
            .then(html => {
                document.getElementById(containerId).innerHTML = html;
            })
            .catch(err => console.error(`Failed to load ${url}:`, err));
    }

    // Function to highlight the active nav link
    function highlightCurrentPage() {
        const path = window.location.pathname;
        const currentPage = path.split("/").pop().replace(".html", "") || 'index';

        const links = document.querySelectorAll('.nav-item.nav-link');
        links.forEach(link => {
            const page = link.getAttribute('data-page');
            if (page === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // Load header and footer, then highlight nav
    Promise.all([
        loadFragment('header.html', 'header-container'),
        loadFragment('footer.html', 'footer-container')
    ]).then(() => {
        highlightCurrentPage();
    });


    //Service Gallery 
    document.addEventListener("DOMContentLoaded", function () {
        const modalImage = document.getElementById("modalImage");

        document.querySelectorAll('[data-bs-target="#imageModal"]').forEach(img => {
            img.addEventListener("click", function () {
                modalImage.src = this.getAttribute("data-bs-image");
            });
        });
    });

})(jQuery);

document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('header-carousel');
    if (!carousel) return;

    // 1. Initialize carousel with optimized configuration
    const carouselInstance = new bootstrap.Carousel(carousel, {
        interval: 5000,
        wrap: true,
        pause: 'hover',
        keyboard: false,
        touch: true
    });

    // 2. Enhanced Animation Manager with position tracking
    const animationManager = {
        currentSlide: null,
        animateSlide: function (slide) {
            // Skip if this is already the active slide
            if (slide === this.currentSlide) return;
            this.currentSlide = slide;

            const innerText = slide.querySelector('.inner-text');
            const buttons = slide.querySelector('.buttons');

            if (!innerText || !buttons) return;

            // Reset state with transform to ensure consistent starting position
            innerText.style.transform = 'translateX(-20px)';
            buttons.style.transform = 'translateY(30px)';

            innerText.classList.remove('animate__animated', 'animate__slideInLeft');
            buttons.classList.remove('animate__animated', 'animate__slideInUp');
            innerText.classList.add('invisible');
            buttons.classList.add('invisible');

            // Animation sequence with forced reflow
            void innerText.offsetHeight; // Trigger reflow

            setTimeout(() => {
                innerText.classList.remove('invisible');
                innerText.classList.add('animate__animated', 'animate__slideInLeft');

                innerText.addEventListener('animationend', () => {
                    buttons.classList.remove('invisible');
                    buttons.classList.add('animate__animated', 'animate__slideInUp');
                }, { once: true });
            }, 50);
        },
        resetSlide: function (slide) {
            const innerText = slide?.querySelector('.inner-text');
            const buttons = slide?.querySelector('.buttons');

            if (innerText) {
                innerText.style.removeProperty('transform');
                innerText.classList.remove(
                    'animate__animated',
                    'animate__slideInLeft',
                    'invisible'
                );
            }
            if (buttons) {
                buttons.style.removeProperty('transform');
                buttons.classList.remove(
                    'animate__animated',
                    'animate__slideInUp',
                    'invisible'
                );
            }
        }
    };

    // 3. Optimized Event Handling
    const handleSlideChange = (event) => {
        // Reset previous slide
        animationManager.resetSlide(animationManager.currentSlide);

        // Animate new slide
        requestAnimationFrame(() => {
            animationManager.animateSlide(event.relatedTarget);
        });
    };

    // 4. Initialize with proper cleanup
    const initializeCarousel = () => {
        // Initial slide animation
        const firstSlide = carousel.querySelector('.carousel-item.active');
        if (firstSlide) {
            setTimeout(() => animationManager.animateSlide(firstSlide), 100);
        }

        // Event listeners
        carousel.addEventListener('slid.bs.carousel', handleSlideChange);
    };

    // 5. Initialize when ready
    if (document.readyState === 'complete') {
        initializeCarousel();
    } else {
        window.addEventListener('load', initializeCarousel);
    }
});

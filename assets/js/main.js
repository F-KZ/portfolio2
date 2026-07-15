/* =====================================================
   Resume section tabs and tab contents
===================================================== */
const resumeTabs = document.querySelector(".resume-tabs");
if (resumeTabs) {
   const resumePortfolioTabBtns = resumeTabs.querySelectorAll(".tab-btn");
   const resumeTabContents = document.querySelectorAll(".resume-tab-content");

   var resumeTabNav = function(resumeTabClick){
      resumeTabContents.forEach((resumeTabContent) => {
         resumeTabContent.style.display = "none";
         resumeTabContent.classList.remove("active");
      });

      resumePortfolioTabBtns.forEach((resumePortfolioTabBtn) => {
         resumePortfolioTabBtn.classList.remove("active");
      });

      resumeTabContents[resumeTabClick].style.display = "flex";

      setTimeout(() => {
         resumeTabContents[resumeTabClick].classList.add("active");
      }, 100);

      resumePortfolioTabBtns[resumeTabClick].classList.add("active");
   }

   resumePortfolioTabBtns.forEach((resumePortfolioTabBtn, i) => {
      resumePortfolioTabBtn.addEventListener("click", () => {
         resumeTabNav(i);
      });
   });
}

/* =====================================================
   Service modal open/close function
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
   const serviceCardWithModals = document.querySelectorAll(".service-container .card-with-modal");

   serviceCardWithModals.forEach((serviceCardWithModal) => {
      const serviceCard = serviceCardWithModal.querySelector(".service-card");
      const serviceBackDrop = serviceCardWithModal.querySelector(".service-modal-backdrop");
      const serviceModal = serviceCardWithModal.querySelector(".service-modal");
      const modalCloseBtn = serviceCardWithModal.querySelector(".modal-close-btn");

      serviceCard.addEventListener("click", () => {
         serviceBackDrop.style.display = "flex";

         setTimeout(() => {
            serviceBackDrop.classList.add("active");
         }, 100);

         setTimeout(() => {
            serviceModal.classList.add("active");
         }, 300);
      });

      modalCloseBtn.addEventListener("click", () => {
         setTimeout(() => {
            serviceBackDrop.style.display = "none";
         }, 500);

         setTimeout(() => {
            serviceBackDrop.classList.remove("active");
            serviceModal.classList.remove("active");
         }, 100);
      });
   });
});

/* =====================================================
   Portfolio modals, tabs and cards
===================================================== */

// Filter portfolio cards according to portfolio tabs.
document.addEventListener("DOMContentLoaded", () => {
   const portfolioTabs = document.querySelector(".portfolio-tabs");
   if (!portfolioTabs) return;
   const portfolioTabBtns = portfolioTabs.querySelectorAll(".tab-btn");
   const cardsWithModals = document.querySelectorAll(".portfolio-container .card-with-modal");

   portfolioTabBtns.forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
         const filter = tabBtn.getAttribute("data-filter");

         cardsWithModals.forEach((cardWithModal) => {
            if(filter === "all" || cardWithModal.classList.contains(filter)){
               cardWithModal.classList.remove("hidden");

               setTimeout(() => {
                  cardWithModal.style.opacity = "1";
                  cardWithModal.style.transition = ".5s ease";
               }, 1);
            }
            else{
               cardWithModal.classList.add("hidden");

               setTimeout(() => {
                  cardWithModal.style.opacity = "0";
                  cardWithModal.style.transition = ".5s ease";
               }, 1);
            }
         });
         // Add active class to the clicked tab button.
         portfolioTabBtns.forEach((tabBtn) => tabBtn.classList.remove("active"));
         tabBtn.classList.add("active");
      });
   });
});

// Open/Close Portfolio modals.
const portfolioCardsWithModals = document.querySelectorAll(".portfolio-container .card-with-modal");

portfolioCardsWithModals.forEach((portfolioCardWithModal) => {
   const portfolioCard = portfolioCardWithModal.querySelector(".portfolio-card");
   const portfolioBackdrop = portfolioCardWithModal.querySelector(".portfolio-modal-backdrop");
   const portfolioModal = portfolioCardWithModal.querySelector(".portfolio-modal");
   const modalCloseBtn = portfolioCardWithModal.querySelector(".modal-close-btn");

   portfolioCard.addEventListener("click", () => {
      portfolioBackdrop.style.display = "flex";

      setTimeout(() => {
         portfolioBackdrop.classList.add("active");
      }, 300);
      
      setTimeout(() => {
         portfolioModal.classList.add("active");
      }, 300);
   });

   
});

/* =====================================================
   Testimonial Swiper
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
   var swiper = new Swiper(".sue-client-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
   });
});

/* =====================================================
   Send/Receive emails from contact form - EmailJS
===================================================== */
(function() {
   emailjs.init({
      publicKey: "v_uAluIeQUUcMHhqP",
   });
})();

const sueContactForm = document.getElementById("sue-contact-form");
const sueContactFormAlert = document.querySelector(".contact-form-alert");

if (sueContactForm) {
// Récupérez vos IDs EmailJS
    const serviceID = 'service_twkldo4';
    const templateID = 'template_ikocaf8';

sueContactForm.addEventListener('submit', function(event) {
   event.preventDefault();

   // Validation du formulaire
   if (!sueContactForm.checkValidity()) {
      sueContactFormAlert.innerHTML = "<span>Please fill out all required fields.</span>";
      return;
   }

   // Message de chargement
   sueContactFormAlert.innerHTML = "<span>Sending your message...</span>";

   emailjs.sendForm(serviceID, templateID, sueContactForm)
      .then(() => {
         window.dataLayer = window.dataLayer || [];
         window.dataLayer.push({
            event: 'lead_submitted',
            lead_subject: sueContactForm.elements['subject'].value,
         });
         sueContactFormAlert.innerHTML = "<span> Message envoyé avec succés!</span> <i class='ri-checkbox-circle-fill'></i>";
         sueContactForm.reset();
         setTimeout(() => {
            sueContactFormAlert.innerHTML = "";
         }, 5000);
      })
      .catch((error) => {
         sueContactFormAlert.innerHTML = "<span> Message non envoyé, merci de réessayer plus tard.</span> <i class='ri-error-warning-fill'></i>";
         console.error('FAILED...', error);
      });
});
} // end if (sueContactForm)


/* =====================================================
   Shrink the height of the header on scroll
===================================================== */
window.addEventListener("scroll", () => {
   const sueHeader = document.querySelector(".sue-header");

   sueHeader.classList.toggle("shrink", window.scrollY > 0);
});

/* =====================================================
   Bottom navigation menu
===================================================== */

// Each bottom navigation menu items active on page scroll.
window.addEventListener("scroll", () => {
   const navMenuSections = document.querySelectorAll(".nav-menu-section");
   const scrollY = window.pageYOffset;

   navMenuSections.forEach((navMenuSection) => {
      let sectionHeight = navMenuSection.offsetHeight;
      let sectionTop = navMenuSection.offsetTop - 50;
      let id = navMenuSection.getAttribute("id");

      if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
         document.querySelector(".bottom-nav .menu li a[href*=" + id + "]").classList.add("current");
      }else{
         document.querySelector(".bottom-nav .menu li a[href*=" + id + "]").classList.remove("current");
      }
   });
});

// Javascript to show bottom navigation menu on home(page load).
window.addEventListener("DOMContentLoaded", () => {
   const bottomNav = document.querySelector(".bottom-nav");

   bottomNav.classList.toggle("active", window.scrollY < 10);
});

// Javascript to show/hide bottom navigation menu on home(scroll).
const bottomNav = document.querySelector(".bottom-nav");
const menuHideBtn = document.querySelector(".menu-hide-btn");
const menuShowBtn = document.querySelector(".menu-show-btn");
var navTimeout;

if (bottomNav && menuHideBtn && menuShowBtn) {
   window.addEventListener("scroll", () => {
      bottomNav.classList.add("active");
      menuShowBtn.classList.remove("active");

      if(window.scrollY < 10){
         menuHideBtn.classList.remove("active");
         clearTimeout(navTimeout);
         navTimeout = setTimeout(() => bottomNav.classList.add("active"), 2500);
      }

      if(window.scrollY > 10){
         menuHideBtn.classList.add("active");
         clearTimeout(navTimeout);
         navTimeout = setTimeout(() => {
            bottomNav.classList.remove("active");
            menuShowBtn.classList.add("active");
         }, 2500);
      }
   });

   menuHideBtn.addEventListener("click", () => {
      bottomNav.classList.toggle("active");
      menuHideBtn.classList.toggle("active");
      menuShowBtn.classList.toggle("active");
   });

   menuShowBtn.addEventListener("click", () => {
      bottomNav.classList.toggle("active");
      menuHideBtn.classList.add("active");
      menuShowBtn.classList.toggle("active");
   });
}

/* =====================================================
   To-top-button with scroll indicator bar
===================================================== */
window.addEventListener("scroll", () => {
   const toTopBtn = document.querySelector(".to-top-btn");
   if (toTopBtn) toTopBtn.classList.toggle("active", window.scrollY > 0);

   const scrollIndicatorBar = document.querySelector(".scroll-indicator-bar");
   if (scrollIndicatorBar) {
      const pageScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      scrollIndicatorBar.style.height = ((pageScroll / height) * 100) + "%";
   }
});

/* =====================================================
   Customized cursor on mousemove
===================================================== */
const cursor = document.querySelector(".cursor");
if (cursor) {
   const cursorDot = cursor.querySelector(".cursor-dot");
   const cursorCircle = cursor.querySelector(".cursor-circle");

   document.addEventListener("mousemove", (e) => {
      cursorDot.style.top = e.clientY + "px";
      cursorDot.style.left = e.clientX + "px";
      cursorCircle.style.top = e.clientY + "px";
      cursorCircle.style.left = e.clientX + "px";
   });

   const cursorHoverlinks = document.querySelectorAll("body a, .theme-btn, .sue-main-btn, .portfolio-card, .swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet, .service-card, .contact-social-links li, .contact-form .submit-btn, .menu-show-btn, .menu-hide-btn");
   cursorHoverlinks.forEach((link) => {
      link.addEventListener("mouseover", () => { cursorDot.classList.add("large"); cursorCircle.style.display = "none"; });
      link.addEventListener("mouseout",  () => { cursorDot.classList.remove("large"); cursorCircle.style.display = "block"; });
   });
}

/* =====================================================
   Website dark/light theme
===================================================== */

// Change theme and save current theme on click the theme button.
const themeBtn = document.querySelector(".theme-btn");
const savedIcon = localStorage.getItem("sue-saved-icon");
const savedTheme = localStorage.getItem("sue-saved-theme");

if (themeBtn) {
   themeBtn.addEventListener("click", () => {
      themeBtn.classList.toggle("active-sun-icon");
      document.body.classList.toggle("light-theme");
      localStorage.setItem("sue-saved-icon", themeBtn.classList.contains("active-sun-icon") ? "sun" : "moon");
      localStorage.setItem("sue-saved-theme", document.body.classList.contains("light-theme") ? "light" : "dark");
   });

   document.addEventListener("DOMContentLoaded", () => {
      themeBtn.classList[savedIcon === "sun" ? "add" : "remove"]("active-sun-icon");
      document.body.classList[savedTheme === "light" ? "add" : "remove"]("light-theme");
   });
}

/* =====================================================
   ScrollReveal JS animations
===================================================== */

// Common reveal options to create reveal animations.
ScrollReveal({
   // reset: true,
   distance: '60px',
   duration: 2500,
   delay: 400
});

// Target elements and specify options to create reveal animations.
ScrollReveal().reveal('.avatar-img', { delay: 100, origin: 'top' });
ScrollReveal().reveal('.avatar-info, .section-title', { delay: 300, origin: 'top' });
ScrollReveal().reveal('.home-social, .home-scroll-btn, .copy-right', { delay: 600, origin: 'bottom' });
ScrollReveal().reveal('.about-img', { delay: 700, origin: 'top' });
ScrollReveal().reveal('.about-info, .sue-footer .sue-logo', { delay: 300, origin: 'bottom' });
ScrollReveal().reveal('.pro-card, .about-buttons .sue-main-btn, .resume-tabs .tab-btn, .portfolio-tabs .tab-btn', { delay: 500, origin: 'right', interval: 200 });
ScrollReveal().reveal('#resume .section-content', { delay: 700, origin: 'bottom' });
ScrollReveal().reveal('.service-card, .portfolio-card, .contact-item, .contact-social-links li, .footer-menu .menu-item', { delay: 300, origin: 'bottom', interval: 300 });
ScrollReveal().reveal('.sue-client-swiper, .contact-form-body', { delay: 700, origin: 'right' });
ScrollReveal().reveal('.contact-info h3', { delay: 100, origin: 'bottom', interval: 300 });

/* =====================================================
   Splash Screen
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
   const splashScreen = document.querySelector(".splash-screen");
   if (!splashScreen) return;
   window.addEventListener("load", () => {
      setTimeout(() => {
         splashScreen.classList.add("fade-out");
         setTimeout(() => splashScreen.remove(), 500);
      }, 2000);
   });
});

/* =====================================================
  carousel portfolio main page
===================================================== */
const track = document.getElementById('track');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const dotsEl = document.getElementById('dots');

if (track && prevBtn && nextBtn && dotsEl) {
const cards = track.querySelectorAll('.card');
const total = cards.length;
let visible = 3;
let current = 0;

function getVisible() {
  if (window.innerWidth <= 600) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function maxIndex() {
  return Math.max(0, total - visible);
}

function buildDots() {
  dotsEl.innerHTML = '';
  const count = maxIndex() + 1;
  for (let i = 0; i < count; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === current ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }
}

function goTo(index) {
  visible = getVisible();
  current = Math.max(0, Math.min(index, maxIndex()));
  const cardWidth = cards[0].getBoundingClientRect().width;
  const gap = 16;
  track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

window.addEventListener('resize', () => {
  visible = getVisible();
  buildDots();
  goTo(current);
});

let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
}, { passive: true });

visible = getVisible();
buildDots();
goTo(0);
} // end if (track)

/* =====================================================
   Consentement cookies (RGPD) + chargement du Pixel Meta
   Le stub fbq est posé dans le <head> de chaque page ;
   fbevents.js n'est chargé qu'après consentement, la file
   d'attente (PageView, ViewContent, Lead...) part à ce moment-là.
===================================================== */
(function () {
   var PIXEL_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

   function loadFbPixel() {
      if (document.querySelector('script[src="' + PIXEL_SRC + '"]')) return;
      var t = document.createElement('script');
      t.async = true;
      t.src = PIXEL_SRC;
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(t, s);
   }

   var consent = localStorage.getItem('fk_cookie_consent');
   if (consent === 'accepted') { loadFbPixel(); return; }
   if (consent === 'refused') { return; }

   var banner = document.createElement('div');
   banner.id = 'cookie-banner';
   banner.style.cssText = 'display:flex;position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#1a1a2e;color:#e2e8f0;padding:16px 24px;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;box-shadow:0 -4px 20px rgba(0,0,0,0.4);font-size:14px;';
   banner.innerHTML =
      '<p style="margin:0;flex:1;min-width:200px;">Ce site utilise des cookies pour mesurer l\'audience et améliorer votre expérience. <a href="https://www.facebook.com/policy/cookies/" target="_blank" rel="noopener" style="color:#818cf8;text-decoration:underline;">En savoir plus</a></p>' +
      '<div style="display:flex;gap:10px;flex-shrink:0;">' +
      '<button id="cookie-refuse" style="padding:8px 18px;border:1px solid #475569;background:transparent;color:#94a3b8;border-radius:6px;cursor:pointer;font-size:14px;">Refuser</button>' +
      '<button id="cookie-accept" style="padding:8px 18px;border:none;background:#6366f1;color:#fff;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;">Accepter</button>' +
      '</div>';
   document.body.appendChild(banner);

   document.getElementById('cookie-accept').addEventListener('click', function () {
      localStorage.setItem('fk_cookie_consent', 'accepted');
      banner.remove();
      loadFbPixel();
   });
   document.getElementById('cookie-refuse').addEventListener('click', function () {
      localStorage.setItem('fk_cookie_consent', 'refused');
      banner.remove();
   });
})();

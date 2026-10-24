document.addEventListener("DOMContentLoaded", () => {
  // ================= SCROLL ANIMATION =================

  document.documentElement.classList.add("js");

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .fm-card"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -20px 0px",
      }
    );

    revealElements.forEach((element, index) => {
      if (element.classList.contains("fm-card")) {
        element.style.setProperty("--d", `${index * 0.2}s`);
      }

      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // ================= PF GALLERY CAROUSEL =================

  const gallery = document.querySelector("#pf-gallery");

  if (gallery) {
    const track = gallery.querySelector(".pf-track");
    const slides = gallery.querySelectorAll(".pf-slide");
    const dotsContainer = gallery.querySelector(".pf-dots");
    const view = gallery.querySelector(".pf-view");
    const prevButton = gallery.querySelector(".pf-prev");
    const nextButton = gallery.querySelector(".pf-next");

    if (
      track &&
      slides.length > 0 &&
      dotsContainer &&
      view &&
      prevButton &&
      nextButton
    ) {
      let currentIndex = 0;
      let touchStartX = null;
      let autoPlay;

      // Nuqtalarni yaratish
      slides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "pf-dot";
        dot.setAttribute("aria-label", `${index + 1}-rasm`);

        dot.addEventListener("click", () => {
          goToSlide(index);
        });

        dotsContainer.appendChild(dot);
      });

      const dots = dotsContainer.querySelectorAll(".pf-dot");

      // Karuselni boshqarish
      function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("on", slideIndex === currentIndex);
          dots[slideIndex].classList.toggle(
            "on",
            slideIndex === currentIndex
          );
        });

        startAutoPlay();
      }

      // Avtomatik aylantirish
      function stopAutoPlay() {
        clearInterval(autoPlay);
      }

      function startAutoPlay() {
        stopAutoPlay();

        autoPlay = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 6000);
      }

      prevButton.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
      });

      nextButton.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
      });

      // Telefon ekranida surish
      view.addEventListener(
        "touchstart",
        (event) => {
          touchStartX = event.touches[0].clientX;
          stopAutoPlay();
        },
        { passive: true }
      );

      view.addEventListener(
        "touchend",
        (event) => {
          if (touchStartX === null) return;

          const touchEndX = event.changedTouches[0].clientX;
          const difference = touchEndX - touchStartX;

          if (Math.abs(difference) > 40) {
            goToSlide(currentIndex + (difference < 0 ? 1 : -1));
          } else {
            startAutoPlay();
          }

          touchStartX = null;
        },
        { passive: true }
      );

      // Sichqoncha bilan ustiga kelganda to'xtatish
      gallery.addEventListener("mouseenter", stopAutoPlay);
      gallery.addEventListener("mouseleave", startAutoPlay);

      goToSlide(0);
    }
  }

  // ================= GX GROUP CAROUSEL =================

  const gxTrack = document.querySelector("#gxTrack");

  if (gxTrack) {
    const gxSlides = [...gxTrack.querySelectorAll(".gx__slide")];
    const gxPrev = document.querySelector("#gxPrev");
    const gxNext = document.querySelector("#gxNext");
    const gxDots = document.querySelector("#gxDots");
    const gxCurrent = document.querySelector("#gxCurrent");
    const gxTotal = document.querySelector("#gxTotal");

    if (
      gxSlides.length > 0 &&
      gxPrev &&
      gxNext &&
      gxDots
    ) {
      let currentIndex = 0;
      let autoPlay;
      let scrollTimeout;

      // Jami slaydlar soni
      if (gxTotal) {
        gxTotal.textContent = String(gxSlides.length).padStart(2, "0");
      }

      // Nuqtalarni yaratish
      gxSlides.forEach((slide, index) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "gx__dot";
        dot.setAttribute("aria-label", `${index + 1}-rasm`);

        dot.addEventListener("click", () => {
          goToSlide(index);
        });

        gxDots.appendChild(dot);
      });

      const dots = [...gxDots.querySelectorAll(".gx__dot")];

      // Raqamlar va nuqtalarni yangilash
      function updateCarousel() {
        if (gxCurrent) {
          gxCurrent.textContent = String(currentIndex + 1).padStart(
            2,
            "0"
          );
        }

        dots.forEach((dot, index) => {
          dot.classList.toggle("active", index === currentIndex);
          dot.classList.toggle("on", index === currentIndex);

          if (index === currentIndex) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });
      }

      // Kerakli slaydga o'tish
      function goToSlide(index) {
        currentIndex =
          (index + gxSlides.length) % gxSlides.length;

        gxSlides[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });

        updateCarousel();
        startAutoPlay();
      }

      // Avtomatik aylantirish
      function stopAutoPlay() {
        clearInterval(autoPlay);
      }

      function startAutoPlay() {
        stopAutoPlay();

        autoPlay = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 4000);
      }

      // Oldingi va keyingi tugmalar
      gxPrev.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
      });

      gxNext.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
      });

      // Klaviatura orqali boshqarish
      gxTrack.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          goToSlide(currentIndex + 1);
        }

        if (event.key === "ArrowLeft") {
          goToSlide(currentIndex - 1);
        }
      });

      // Qo'lda surilganda raqamlarni yangilash
      gxTrack.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          const trackStart = gxTrack.getBoundingClientRect().left;

          let closestIndex = 0;
          let closestDistance = Infinity;

          gxSlides.forEach((slide, index) => {
            const distance = Math.abs(
              slide.getBoundingClientRect().left - trackStart
            );

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });

          currentIndex = closestIndex;
          updateCarousel();
        }, 100);
      });

      // Karusel ustiga kelganda avtomatik aylanishni to'xtatish
      gxTrack.addEventListener("mouseenter", stopAutoPlay);
      gxTrack.addEventListener("mouseleave", startAutoPlay);

      // Telefonda surish
      gxTrack.addEventListener("touchstart", stopAutoPlay, {
        passive: true,
      });

      gxTrack.addEventListener("touchend", startAutoPlay, {
        passive: true,
      });

      // Boshlang'ich holat
      updateCarousel();
      startAutoPlay();
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // ================= SCROLL ANIMATION =================

  document.documentElement.classList.add("js");

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .fm-card",
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
      },
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
    const slides = [...gallery.querySelectorAll(".pf-slide")];
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
      let index = 0;
      let timer;
      let touchStartX = null;

      dotsContainer.innerHTML = "";

      slides.forEach((_, i) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "pf-dot";
        dot.setAttribute("aria-label", `${i + 1}-rasm`);

        dot.addEventListener("click", () => {
          showSlide(i);
        });

        dotsContainer.appendChild(dot);
      });

      const dots = [...dotsContainer.querySelectorAll(".pf-dot")];

      function stopTimer() {
        clearInterval(timer);
      }

      function startTimer() {
        stopTimer();

        timer = setInterval(() => {
          showSlide(index + 1);
        }, 6000);
      }

      function showSlide(newIndex) {
        index = (newIndex + slides.length) % slides.length;

        track.style.transform = `translateX(-${index * 100}%)`;

        slides.forEach((slide, i) => {
          slide.classList.toggle("on", i === index);
          dots[i].classList.toggle("on", i === index);
        });

        startTimer();
      }

      prevButton.addEventListener("click", () => {
        showSlide(index - 1);
      });

      nextButton.addEventListener("click", () => {
        showSlide(index + 1);
      });

      view.addEventListener(
        "touchstart",
        (event) => {
          touchStartX = event.touches[0].clientX;
          stopTimer();
        },
        { passive: true },
      );

      view.addEventListener(
        "touchend",
        (event) => {
          if (touchStartX === null) return;

          const difference = event.changedTouches[0].clientX - touchStartX;

          if (Math.abs(difference) > 40) {
            showSlide(index + (difference < 0 ? 1 : -1));
          } else {
            startTimer();
          }

          touchStartX = null;
        },
        { passive: true },
      );

      gallery.addEventListener("mouseenter", stopTimer);
      gallery.addEventListener("mouseleave", startTimer);

      showSlide(0);
    }
  }

  // ================= GX GROUP CAROUSEL =================

  const gxTrack = document.querySelector("#gxTrack");

  if (gxTrack) {
    const slides = [...gxTrack.querySelectorAll(".gx__slide")];
    const prevButton = document.querySelector("#gxPrev");
    const nextButton = document.querySelector("#gxNext");
    const dotsContainer = document.querySelector("#gxDots");
    const currentCounter = document.querySelector("#gxCurrent");
    const totalCounter = document.querySelector("#gxTotal");

    if (slides.length > 0 && prevButton && nextButton && dotsContainer) {
      let index = 0;
      let scrollTimer;

      dotsContainer.innerHTML = "";

      if (totalCounter) {
        totalCounter.textContent = String(slides.length).padStart(2, "0");
      }

      // Nuqtalarni yaratish
      slides.forEach((_, i) => {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "gx__dot";
        dot.setAttribute("aria-label", `${i + 1}-rasm`);

        dot.addEventListener("click", () => {
          goToSlide(i);
        });

        dotsContainer.appendChild(dot);
      });

      const dots = [...dotsContainer.querySelectorAll(".gx__dot")];

      // Raqamlar va nuqtalarni yangilash
      function updateControls() {
        if (currentCounter) {
          currentCounter.textContent = String(index + 1).padStart(2, "0");
        }

        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
          dot.classList.toggle("on", i === index);

          if (i === index) {
            dot.setAttribute("aria-current", "true");
          } else {
            dot.removeAttribute("aria-current");
          }
        });
      }

      // Faqat karuselni surish, butun sahifani emas
      function goToSlide(newIndex) {
        index = (newIndex + slides.length) % slides.length;

        const trackRect = gxTrack.getBoundingClientRect();
        const slideRect = slides[index].getBoundingClientRect();

        const targetLeft = gxTrack.scrollLeft + slideRect.left - trackRect.left;

        gxTrack.scrollTo({
          left: targetLeft,
          behavior: "smooth",
        });

        updateControls();
      }

      prevButton.addEventListener("click", () => {
        goToSlide(index - 1);
      });

      nextButton.addEventListener("click", () => {
        goToSlide(index + 1);
      });

      // Klaviatura bilan boshqarish
      gxTrack.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goToSlide(index + 1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goToSlide(index - 1);
        }
      });

      // Qo'lda surilganda raqam va nuqtalarni yangilash
      gxTrack.addEventListener("scroll", () => {
        clearTimeout(scrollTimer);

        scrollTimer = setTimeout(() => {
          const trackLeft = gxTrack.getBoundingClientRect().left;

          let closestIndex = 0;
          let closestDistance = Infinity;

          slides.forEach((slide, i) => {
            const distance = Math.abs(
              slide.getBoundingClientRect().left - trackLeft,
            );

            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = i;
            }
          });

          index = closestIndex;
          updateControls();
        }, 100);
      });

      // Dastlabki holat — avtomatik aylanish yo'q
      updateControls();
    }
  }
});

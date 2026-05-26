(() => {
  const root = document.documentElement;
  const revealPanel = document.getElementById("pageReveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const markIntroSeen = () => {
    try {
      sessionStorage.setItem("easyfitIntroSeen", "true");
    } catch {
      // Some privacy modes block sessionStorage. The page should still reveal normally.
    }
  };

  if (root.classList.contains("has-intro") && !reducedMotion && revealPanel) {
    window.setTimeout(() => {
      root.classList.add("intro-revealing");
      window.setTimeout(() => {
        markIntroSeen();
        root.classList.remove("has-intro", "intro-revealing");
        root.classList.add("intro-done");
        revealPanel.remove();
      }, 980);
    }, 560);
  } else {
    revealPanel?.remove();
    root.classList.add("intro-done");
  }

  const modal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const modalTitle = document.getElementById("modalTitle");
  const closeButton = modal?.querySelector(".modal-close");
  let lastFocusedElement = null;

  const resetVideo = () => {
    if (!modalVideo) {
      return;
    }

    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.removeAttribute("src");
    modalVideo.load();
  };

  const closeModal = () => {
    if (modal?.open) {
      modal.close();
    }
  };

  document.querySelectorAll(".video-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!modal || !modalVideo || !modalTitle) {
        return;
      }

      const videoSrc = card.dataset.video;
      const title = card.dataset.title || "Easy Fit Alexandria";

      if (!videoSrc) {
        return;
      }

      lastFocusedElement = document.activeElement;
      resetVideo();
      modalTitle.textContent = title;
      modalVideo.src = videoSrc;
      modalVideo.setAttribute("aria-label", title);
      modal.showModal();
      document.body.classList.add("modal-open");
      closeButton?.focus();

      const playRequest = modalVideo.play();
      if (playRequest) {
        playRequest.catch(() => {
          modalVideo.controls = true;
        });
      }
    });
  });

  closeButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  modal?.addEventListener("close", () => {
    resetVideo();
    document.body.classList.remove("modal-open");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  });
})();

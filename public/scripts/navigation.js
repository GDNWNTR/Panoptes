// Enhanced Navigation with smooth scrolling and better performance
class NavigationController {
  constructor() {
    this.topnav = null;
    this.stickyThreshold = 50;
    this.isSticky = false;
    this.ticking = false;

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.topnav = document.querySelector(".topnav");
    if (!this.topnav) return;

    // Add scroll listener with throttling for better performance
    window.addEventListener("scroll", () => this.handleScroll(), {
      passive: true,
    });

    // Add click handlers for smooth scrolling (if needed)
    this.addSmoothScrolling();

    // Set active nav item based on current page
    this.setActiveNavItem();
  }

  handleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateStickyState();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  updateStickyState() {
    const shouldBeSticky = window.pageYOffset >= this.stickyThreshold;

    if (shouldBeSticky !== this.isSticky) {
      this.isSticky = shouldBeSticky;

      if (this.isSticky) {
        this.topnav.classList.add("sticky");
        // Add a subtle animation when becoming sticky
        this.topnav.style.transform = "translateY(-10px)";
        setTimeout(() => {
          this.topnav.style.transform = "translateY(0)";
        }, 50);
      } else {
        this.topnav.classList.remove("sticky");
      }
    }
  }

  addSmoothScrolling() {
    const navLinks = this.topnav.querySelectorAll('a[href^="#"]');

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Calculate offset to account for sticky nav
          const navHeight = this.topnav.offsetHeight;
          const targetPosition = targetElement.offsetTop - navHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }

  setActiveNavItem() {
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const navLinks = this.topnav.querySelectorAll("a");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const linkHref = link.getAttribute("href");
      if (
        linkHref === `./${currentPage}` ||
        (currentPage === "" && linkHref === "./index.html") ||
        (currentPage === "index.html" && linkHref === "./index.html")
      ) {
        link.classList.add("active");
      }
    });
  }

  // Method to programmatically set active nav item
  setActive(index) {
    const navLinks = this.topnav.querySelectorAll("a");
    navLinks.forEach((link, i) => {
      link.classList.toggle("active", i === index);
    });
  }
}

// Enhanced card loading animations
class CardAnimationController {
  constructor() {
    this.cards = [];
    this.observer = null;

    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.cards = document.querySelectorAll(".container");

    // Use Intersection Observer for better performance
    if ("IntersectionObserver" in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      this.animateAllCards();
    }
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: "50px",
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateCard(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    this.cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      this.observer.observe(card);
    });
  }

  animateCard(card) {
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }

  animateAllCards() {
    this.cards.forEach((card, index) => {
      setTimeout(() => {
        this.animateCard(card);
      }, index * 100);
    });
  }
}

// Utility functions
const Utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },

  // Add loading state to elements
  addLoadingState(element) {
    element.style.opacity = "0.7";
    element.style.pointerEvents = "none";
  },

  removeLoadingState(element) {
    element.style.opacity = "1";
    element.style.pointerEvents = "auto";
  },
};

// Initialize everything when script loads
let navigation, cardAnimations;

// Check if reduced motion is preferred and adjust accordingly
if (!Utils.prefersReducedMotion()) {
  navigation = new NavigationController();
  cardAnimations = new CardAnimationController();
} else {
  // Simplified version for users who prefer reduced motion
  navigation = new NavigationController();
  // Skip card animations
}

// Export for use in other scripts if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = { NavigationController, CardAnimationController, Utils };
}

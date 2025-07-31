// const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
// const basePath = isLocalhost ? "" : "/FullMon";

const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const isGitHubPages = location.hostname.includes("github.io");

const basePath = isLocalhost
  ? ""
  : isGitHubPages
    ? "/FullMon"
    : ""; // For custom domain

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  loadFooter();

  const path = getPageFromPath(location.pathname);
  loadPage(path, false);

  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("[data-page]");
    if (target) {
      e.preventDefault();
      const page = target.getAttribute("data-page");
      loadPage(page, true);
    }
  });

  document.body.addEventListener("click", (e) => {
    const clickedCard = e.target.closest(".flip-card");

    // If tap is outside any card, close all
    if (!clickedCard) {
      document
        .querySelectorAll(".flip-card.flipped")
        .forEach((c) => c.classList.remove("flipped"));
      return;
    }

    // If this card is already flipped, unflip it
    if (clickedCard.classList.contains("flipped")) {
      clickedCard.classList.remove("flipped");
    } else {
      // Otherwise, unflip others and flip this one
      document
        .querySelectorAll(".flip-card.flipped")
        .forEach((c) => c.classList.remove("flipped"));
      clickedCard.classList.add("flipped");
    }
  });

  window.addEventListener("popstate", () => {
    const path = getPageFromPath(location.pathname);
    loadPage(path, false);
  });

  setupDropdownToggle();
  setupServiceModal();
});

// Scroll Show/Hide Navbar
// ----------------------
function setupNavbarScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let currentOffset = 0;
  const maxOffset = nav.offsetHeight; // amount to hide
  let ticking = false;

  function onScroll() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    currentOffset += delta;

    // Clamp offset between 0 and maxOffset
    currentOffset = Math.max(0, Math.min(maxOffset, currentOffset));

    // Apply transform
    nav.style.transform = `translateY(-${currentOffset}px)`;

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
}

function getPageFromPath(pathname) {
  return pathname.replace(`${basePath}/`, "") || "home";
}

function loadNavbar() {
  return fetch(`${basePath}/navbar.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;

      const hamburger = document.getElementById("hamburger");
      const navLinks = document.getElementById("nav-links");
      const overlay = document.getElementById("overlay");

      hamburger?.addEventListener("click", () => {
        navLinks?.classList.toggle("show");
        overlay?.classList.toggle("show");
      });

      navLinks?.addEventListener("click", (e) => {
        if (e.target.matches("a[data-page]")) {
          navLinks.classList.remove("show");
          overlay?.classList.remove("show");
        }
      });

      overlay?.addEventListener("click", () => {
        navLinks?.classList.remove("show");
        overlay?.classList.remove("show");
      });

      setupNavbarScroll(); 
    })
    .catch((err) => console.error("Navbar load error:", err));
}

function loadFooter() {
  fetch(`${basePath}/footer.html`)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("footer-container").innerHTML = html;
    })
    .catch((err) => console.error("Footer load error:", err));
}

function loadPage(page, addToHistory = true) {
  fetch(`${basePath}/pages/${page}.html`)
    .then((res) => {
      if (!res.ok) throw new Error(`Page not found: ${page}`);
      return res.text();
    })
    .then((html) => {
      document.getElementById("main-content").innerHTML = html;

      if (addToHistory) {
        history.pushState(null, "", `${basePath}/${page}`);
      }

      requestAnimationFrame(() => {
        if (page === "contact") setupContactForm();
        if (page === "home") {
          setupServiceModal();
          loadApproachCards(page);
        }
        if (page === "dynatrace") {
          loadDynatraceFeatures(page);
        }
        if (page === "newrelic") {
          loadNewRelicFeatures(page);
        }
      });
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("main-content").innerHTML = `
        <h2>Page Not Found</h2>
        <p>The requested page <strong>${page}</strong> does not exist.</p>
      `;
    });
}

function setupContactForm() {
  const checkboxes = document.querySelectorAll('input[name="services[]"]');
  const previewContainer = document.getElementById("service-tags-preview");
  if (!previewContainer) return;

  function updateSelectedTags() {
    const selected = Array.from(checkboxes)
      .filter((cb) => cb.checked)
      .map((cb) => `<span class="tag">${cb.value}</span>`)
      .join(" ");
    previewContainer.innerHTML = selected || "None";
  }

  checkboxes.forEach((cb) => cb.addEventListener("change", updateSelectedTags));
  updateSelectedTags();
}

function setupDropdownToggle() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".dropdown-toggle");
    if (toggle) {
      e.preventDefault();
      const dropdown = toggle.closest(".dropdown");
      const menu = dropdown?.querySelector(".dropdown-menu");

      document.querySelectorAll(".dropdown-menu.show").forEach((m) => {
        if (m !== menu) m.classList.remove("show");
      });

      menu?.classList.toggle("show");
    } else {
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    }
  });
}

function setupServiceModal() {
  const modal = document.getElementById("services-modal");
  const openBtn = document.getElementById("explore-services-btn");
  const closeBtn = modal?.querySelector(".close");
  const serviceButtons = modal?.querySelectorAll("button[data-page]");

  if (!modal || !openBtn) return;

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  serviceButtons?.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("data-page");
      modal.style.display = "none";
      loadPage(page, true);
    });
  });
}

function loadApproachCards(category = "home") {
  const container = document.getElementById("card-container");
  if (!container) return;

  fetch(`${basePath}/json/cards.json`)
    .then((res) => res.json())
    .then((cards) => {
      const filtered = cards.filter((card) => card.category === category);
      if (filtered.length === 0) {
        container.innerHTML = `<p>No cards found for ${category}.</p>`;
        return;
      }

      // Duplicate cards for smooth infinite scroll effect
      const allCards = [...filtered, ...filtered];

      container.innerHTML = allCards
        .map(
          (card) => `
        <div class="flip-card">
          <div class="flip-inner">
            <div class="flip-front" style="background-image: url('${card.image}');">
              <h3>${card.title}</h3>
            </div>
            <div class="flip-back">
              <p>${card.description}</p>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      setupSwipeOnMobile(container);
    })
    .catch((err) => {
      console.error("Failed to load cards:", err);
      container.innerHTML = `<p style="color:red;">Could not load services.</p>`;
    });
}

function setupSwipeOnMobile(container) {
  if (window.innerWidth >= 768) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX;
    const walk = startX - x; // Negative = swipe right, Positive = swipe left
    container.scrollLeft = scrollLeft + walk;
  });

  container.addEventListener("touchend", () => {
    isDown = false;
  });
}

function loadDynatraceFeatures(category = "dynatrace") {
  const container = document.getElementById("dynatrace-features");
  if (!container) {
    console.warn("#dynatrace-features not found");
    return;
  }

  fetch(`${basePath}/json/dynatrace.json`)
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter((item) => item.category === category);
      if (filtered.length === 0) {
        container.innerHTML = `<p>No features found for ${category}.</p>`;
        return;
      }

      container.innerHTML = filtered
        .map(
          (item) => `
        <div class="feature-card">
          <img src="${item.image}" alt="${item.title}">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `
        )
        .join("");

      // To enable flip cards instead of feature-card, uncomment below:
      // container.innerHTML = filtered.map(item => `
      //   <div class="flip-card">
      //     <div class="flip-inner">
      //       <div class="flip-front" style="background-image: url('${item.image}');">
      //         <h3>${item.title}</h3>
      //       </div>
      //       <div class="flip-back">
      //         <p>${item.description}</p>
      //       </div>
      //     </div>
      //   </div>
      // `).join("");
    })
    .catch((err) => {
      console.error("Failed to load Dynatrace features:", err);
      container.innerHTML = `<p style="color:red;">Could not load Dynatrace features.</p>`;
    });
}

function loadNewRelicFeatures(category = "newrelic") {
  const container = document.getElementById("newrelic-features");
  if (!container) {
    console.warn("#newrelic-features not found");
    return;
  }

  fetch(`${basePath}/json/newrelic.json`)
    .then((res) => res.json())
    .then((data) => {
      const filtered = data.filter((item) => item.category === category);
      if (filtered.length === 0) {
        container.innerHTML = `<p>No features found for ${category}.</p>`;
        return;
      }

      container.innerHTML = filtered
        .map(
          (item) => `
        <div class="feature-card">
          <img src="${item.image}" alt="${item.title}">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `
        )
        .join("");

      // To enable flip cards instead of feature-card, uncomment below:
      // container.innerHTML = filtered.map(item => `
      //   <div class="flip-card">
      //     <div class="flip-inner">
      //       <div class="flip-front" style="background-image: url('${item.image}');">
      //         <h3>${item.title}</h3>
      //       </div>
      //       <div class="flip-back">
      //         <p>${item.description}</p>
      //       </div>
      //     </div>
      //   </div>
      // `).join("");
    })
    .catch((err) => {
      console.error("Failed to load New Relic features:", err);
      container.innerHTML = `<p style="color:red;">Could not load New Relic features.</p>`;
    });
}

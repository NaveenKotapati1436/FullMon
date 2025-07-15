// 🔁 Automatically detect basePath
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const basePath = isLocalhost ? "" : "/FullMon"; // Change this to your repo/folder name

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  loadFooter();

  const path = getPageFromPath(location.pathname);
  loadPage(path, false);

  // Internal navigation
  document.body.addEventListener("click", (e) => {
    const target = e.target.closest("[data-page]");
    if (target) {
      e.preventDefault();
      const page = target.getAttribute("data-page");
      loadPage(page, true);
    }
  });

  // Handle browser navigation
  window.addEventListener("popstate", () => {
    const path = getPageFromPath(location.pathname);
    loadPage(path, false);
  });

  setupDropdownToggle();
  setupServiceModal(); // Call even if modal is not on every page
});

// 🔍 Get logical page name from URL
function getPageFromPath(pathname) {
  return pathname.replace(`${basePath}/`, "") || "home";
}

// 🌐 Load Navbar
function loadNavbar() {
  fetch("navbar.html")
    .then(res => res.text())
    .then(html => {
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
    })
    .catch(err => console.error("Navbar load error:", err));
}

// 🌐 Load Footer
function loadFooter() {
  fetch("footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-container").innerHTML = html;
    })
    .catch(err => console.error("Footer load error:", err));
}

// 📄 Load Main Content Page
function loadPage(page, addToHistory = true) {
  fetch(`pages/${page}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`Page not found: ${page}`);
      return res.text();
    })
    .then(html => {
      document.getElementById("main-content").innerHTML = html;

      if (addToHistory) {
        history.pushState(null, "", `${basePath}/${page}`);
      }

      // Trigger page-specific logic
      if (page === "contact") setupContactForm();
      if (page === "home") setupServiceModal();
    })
    .catch(err => {
      console.error(err);
      document.getElementById("main-content").innerHTML = `
        <h2>Page Not Found</h2>
        <p>The requested page <strong>${page}</strong> does not exist.</p>
      `;
    });
}

// 📬 Contact Form Enhancer
function setupContactForm() {
  const checkboxes = document.querySelectorAll('input[name="services[]"]');
  const previewContainer = document.getElementById("service-tags-preview");

  if (!previewContainer) return;

  function updateSelectedTags() {
    const selected = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => `<span class="tag">${cb.value}</span>`)
      .join(" ");
    previewContainer.innerHTML = selected || "None";
  }

  checkboxes.forEach(cb => cb.addEventListener("change", updateSelectedTags));
  updateSelectedTags();
}

// 🔽 Dropdown toggle (e.g., for nav Services)
function setupDropdownToggle() {
  document.addEventListener("click", (e) => {
    const toggle = e.target.closest(".dropdown-toggle");

    if (toggle) {
      e.preventDefault();
      const dropdown = toggle.closest(".dropdown");
      const menu = dropdown?.querySelector(".dropdown-menu");

      // Close all others
      document.querySelectorAll(".dropdown-menu.show").forEach(m => {
        if (m !== menu) m.classList.remove("show");
      });

      menu?.classList.toggle("show");
    } else {
      // Clicked outside
      document.querySelectorAll(".dropdown-menu.show").forEach(menu => {
        menu.classList.remove("show");
      });
    }
  });
}

// 🪟 Modal for services (homepage only)
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

  serviceButtons?.forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("data-page");
      modal.style.display = "none";
      loadPage(page, true);
    });
  });
}

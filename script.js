// // 🔁 Automatically detect basePath
// const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
// const basePath = isLocalhost ? "" : "/FullMon"; // Change 'FullMon' to your GitHub repo name if needed

// document.addEventListener("DOMContentLoaded", () => {
//   loadNavbar();
//   loadFooter();

//   // Load initial page based on path
//   const path = location.pathname.replace(basePath + "/", "") || "home";
//   loadPage(path, false);

//   // Intercept navigation link clicks
//   document.body.addEventListener("click", function (e) {
//     if (e.target.matches("[data-page]")) {
//       e.preventDefault();
//       const page = e.target.getAttribute("data-page");
//       loadPage(page, true);
//     }
//   });

//   // Handle browser navigation (back/forward)
//   window.addEventListener("popstate", function () {
//     const path = location.pathname.replace(basePath + "/", "") || "home";
//     loadPage(path, false);
//   });
// });

// function loadNavbar() {
//   fetch("navbar.html")
//     .then((res) => res.text())
//     .then((html) => {
//       document.getElementById("navbar-container").innerHTML = html;

//       const hamburger = document.getElementById("hamburger");
//       const navLinks = document.getElementById("nav-links");
//       const overlay = document.getElementById("overlay");

//       if (hamburger && navLinks) {
//         hamburger.addEventListener("click", () => {
//           navLinks.classList.toggle("show");
//           overlay?.classList.toggle("show");
//         });

//         navLinks.addEventListener("click", (e) => {
//           if (e.target.matches("a[data-page]")) {
//             navLinks.classList.remove("show");
//             overlay?.classList.remove("show");
//           }
//         });

//         overlay?.addEventListener("click", () => {
//           navLinks.classList.remove("show");
//           overlay.classList.remove("show");
//         });
//       }
//     });
// }

// function loadFooter() {
//   fetch("footer.html")
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("footer-container").innerHTML = html;
//     });
// }

// function loadPage(page, addToHistory = true) {
//   fetch(`pages/${page}.html`)
//     .then(res => {
//       if (!res.ok) throw new Error("Page not found");
//       return res.text();
//     })
//     .then(html => {
//       document.getElementById("main-content").innerHTML = html;

//       if (addToHistory) {
//         history.pushState(null, "", `${basePath}/${page}`);
//       }

//       // Optional: setup for specific pages
//       if (page === "contact") {
//         requestAnimationFrame(setupContactForm);
//       }
//     })
//     .catch((err) => {
//       console.error("Error loading page:", err);
//       document.getElementById("main-content").innerHTML =
//         "<h2>Page not found</h2><p>The page you requested does not exist.</p>";
//     });
// }

// function setupContactForm() {
//   const checkboxes = document.querySelectorAll('input[name="services[]"]');
//   const previewContainer = document.getElementById("service-tags-preview");

//   function updateSelectedTags() {
//     const selected = Array.from(checkboxes)
//       .filter(cb => cb.checked)
//       .map(cb => `<span class="tag">${cb.value}</span>`)
//       .join(" ");
//     previewContainer.innerHTML = selected || "None";
//   }

//   checkboxes.forEach(cb => cb.addEventListener("change", updateSelectedTags));
//   updateSelectedTags();
// }

// 🔁 Automatically detect basePath
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const basePath = isLocalhost ? "" : "/FullMon"; // Change this to your GitHub repo name if needed

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  loadFooter();

  // Load initial page based on path
  const path = location.pathname.replace(basePath + "/", "") || "home";
  loadPage(path, false);

  // Intercept internal navigation
  document.body.addEventListener("click", function (e) {
    if (e.target.matches("[data-page]")) {
      e.preventDefault();
      const page = e.target.getAttribute("data-page");
      loadPage(page, true);
    }
  });

  // Handle browser back/forward
  window.addEventListener("popstate", function () {
    const path = location.pathname.replace(basePath + "/", "") || "home";
    loadPage(path, false);
  });

  // 🔽 Setup modal if it's present
  setupServiceModal();
  setupDropdownToggle();
});

function loadNavbar() {
  fetch("navbar.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("navbar-container").innerHTML = html;

      const hamburger = document.getElementById("hamburger");
      const navLinks = document.getElementById("nav-links");
      const overlay = document.getElementById("overlay");

      if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
          navLinks.classList.toggle("show");
          overlay?.classList.toggle("show");
        });

        navLinks.addEventListener("click", (e) => {
          if (e.target.matches("a[data-page]")) {
            navLinks.classList.remove("show");
            overlay?.classList.remove("show");
          }
        });

        overlay?.addEventListener("click", () => {
          navLinks.classList.remove("show");
          overlay.classList.remove("show");
        });
      }
    });
}

function loadFooter() {
  fetch("footer.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("footer-container").innerHTML = html;
    });
}

function loadPage(page, addToHistory = true) {
  fetch(`pages/${page}.html`)
    .then(res => {
      if (!res.ok) throw new Error("Page not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("main-content").innerHTML = html;

      if (addToHistory) {
        history.pushState(null, "", `${basePath}/${page}`);
      }

      // Run page-specific scripts
      if (page === "contact") {
        requestAnimationFrame(setupContactForm);
      }

      if (page === "home") {
        requestAnimationFrame(setupServiceModal);
      }
    })
    .catch((err) => {
      console.error("Error loading page:", err);
      document.getElementById("main-content").innerHTML =
        "<h2>Page not found</h2><p>The page you requested does not exist.</p>";
    });
}

function setupContactForm() {
  const checkboxes = document.querySelectorAll('input[name="services[]"]');
  const previewContainer = document.getElementById("service-tags-preview");

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

// 🆕 Modal setup for service selection (runs on homepage)
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

function setupDropdownToggle() {
  document.addEventListener("click", (e) => {
    // Handle Services dropdown toggle only
    if (e.target.matches(".dropdown-toggle")) {
      e.preventDefault();

      const dropdown = e.target.closest(".dropdown");
      const menu = dropdown.querySelector(".dropdown-menu");

      // Close any open dropdowns
      document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== dropdown.querySelector(".dropdown-menu")) {
          menu.classList.remove("show");
        }
      });

      menu.classList.toggle("show");
    } else {
      // Clicked outside dropdown — close all
      document.querySelectorAll(".dropdown-menu").forEach(menu => {
        menu.classList.remove("show");
      });
    }
  });
}


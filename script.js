// document.addEventListener("DOMContentLoaded", () => {
//   loadNavbar();

//   const initialPage = location.pathname.replace("/", "") || "home";
//   loadPage(initialPage, false);
//   loadPage(path, false);

//   document.body.addEventListener("click", function (e) {
//     if (e.target.matches("[data-page]")) {
//       e.preventDefault();
//       const page = e.target.getAttribute("data-page");
//       loadPage(page, true);
//     }
//   });

//   window.addEventListener("popstate", function () {
//     const page = location.pathname.replace("/", "") || "home";
//     loadPage(page, false);
//   });
// });

// function loadNavbar() {
//   fetch("navbar.html")
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("navbar-container").innerHTML = html;

//       const hamburger = document.getElementById("hamburger");
//       const navLinks = document.getElementById("nav-links");

//       if (hamburger && navLinks) {
//         hamburger.addEventListener("click", () => {
//           navLinks.classList.toggle("show");
//         });
//       }
//     });
// }

// function loadPage(page, addToHistory = true) {
//   fetch(`pages/${page}.html`)
//     .then(res => {
//       if (!res.ok) throw new Error("Page not found");
//       return res.text();
//     })
//     .then(html => {
//       const content = document.getElementById("main-content");
//       content.innerHTML = html;

//       if (addToHistory) {
//         history.pushState(null, "", `/${page}`);
//       }

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

const basePath = "/FullMon"; // ← Change to your actual repo name (no trailing slash)

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();

  // Get initial path and load corresponding page
  const path = location.pathname.replace(basePath + "/", "") || "home";
  loadPage(path, false);

  // Intercept all internal link clicks
  document.body.addEventListener("click", function (e) {
    if (e.target.matches("[data-page]")) {
      e.preventDefault();
      const page = e.target.getAttribute("data-page");
      loadPage(page, true);
    }
  });

  // Handle browser back/forward navigation
  window.addEventListener("popstate", function () {
    const path = location.pathname.replace(basePath + "/", "") || "home";
    loadPage(path, false);
  });
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
        // Toggle menu and overlay on hamburger click
        hamburger.addEventListener("click", () => {
          navLinks.classList.toggle("show");
          overlay?.classList.toggle("show");
        });

        // Close menu and overlay when a nav link is clicked
        navLinks.addEventListener("click", (e) => {
          if (e.target.matches("a[data-page]")) {
            navLinks.classList.remove("show");
            overlay?.classList.remove("show");
          }
        });

        // Close menu and overlay when clicking outside (on overlay)
        overlay?.addEventListener("click", () => {
          navLinks.classList.remove("show");
          overlay.classList.remove("show");
        });
      }
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

      // Call page-specific setup
      if (page === "contact") {
        requestAnimationFrame(setupContactForm);
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

/* =========================================================
   PORTFOLIO WEBSITE — MAIN JAVASCRIPT
   Fixed navigation, tabs, gallery, lightbox and mobile menu.
========================================================= */

"use strict";

let portfolioData = {};
let currentPublication = "journals";
let currentAlbum = [];
let galleryTimers = [];
let lightboxTimer = null;

document.addEventListener("DOMContentLoaded", initPortfolio);

async function initPortfolio() {
  try {
    const response = await fetch("data.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`Unable to load data.json (${response.status})`);
    portfolioData = await response.json();

    loadProfile();
    loadAbout();
    loadEducation();
    loadExperience();
    loadResearch();
    loadPublications(currentPublication);
    loadGallery();
    loadOther();
    loadContact();

    initNavigation();
    initTabs();
    initMobileMenu();
    initLightbox();
    initScrollTop();
    setText("currentYear", new Date().getFullYear());
  } catch (error) {
    console.error("Portfolio initialization failed:", error);
    showLoadError();
  }
}

/* ---------- Helpers ---------- */

const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value ?? "";
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeURL(value) {
  if (!value) return "#";
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}

function setExternalHref(id, url) {
  const element = document.getElementById(id);
  if (!element) return;
  element.href = safeURL(url);
  element.target = "_blank";
  element.rel = "noopener noreferrer";
}

/* =========================================================
   HOME
========================================================= */

function loadProfile() {
  const profile = portfolioData.profile || {};

  setText("heroName", profile.name);
  setText("heroDepartment", profile.department);
  setText("heroInstitution", profile.institution);

  const description = Array.isArray(profile.shortBio)
    ? profile.shortBio.join(" ")
    : profile.shortBio;
  setText("heroDescription", description);

  const image = document.getElementById("profileImage");
  if (image && profile.profileImage) image.src = profile.profileImage;

  const tags = safeArray(profile.interests).slice(0, 8);
  const tagContainer = document.getElementById("interestTags");
  if (tagContainer) {
    tagContainer.innerHTML = tags
      .map(tag => `<span>${escapeHTML(tag)}</span>`)
      .join("");
  }
}

/* =========================================================
   ABOUT
========================================================= */

function loadAbout() {
  const about = portfolioData.about || {};
  const profile = portfolioData.profile || {};
  const bioContainer = document.getElementById("aboutBio");

  if (bioContainer) {
    const bio = safeArray(about.bio);
    bioContainer.innerHTML = bio.length
      ? bio.map(text => `
          <div class="bio-item">
            <div class="bio-icon"><i class="fa-solid fa-microchip"></i></div>
            <p>${escapeHTML(text)}</p>
          </div>
        `).join("")
      : `<p class="empty-state">Biography will be updated soon.</p>`;
  }

  setText("glancePosition", profile.designation);
  setText("glanceInstitution", profile.institution);
  setText("glanceDepartment", profile.department);
  setText("glanceLocation", profile.location);
}

/* =========================================================
   EDUCATION & EXPERIENCE
========================================================= */

function loadEducation() {
  const container = document.getElementById("educationTimeline");
  if (!container) return;

  const items = safeArray(portfolioData.about?.education);
  container.innerHTML = items.length
    ? items.map(item => `
        <article class="timeline-item">
          <div class="timeline-year">${escapeHTML(item.period)}</div>
          <div>
            <h3>${escapeHTML(item.degree)}</h3>
            <h4>${escapeHTML(item.institution)}</h4>
            <p>${escapeHTML(item.field)}</p>
            ${item.thesis ? `<p><strong>Thesis:</strong> ${escapeHTML(item.thesis)}</p>` : ""}
          </div>
        </article>
      `).join("")
    : `<p class="empty-state">Education details will be updated soon.</p>`;
}

function loadExperience() {
  const container = document.getElementById("experienceTimeline");
  if (!container) return;

  const items = safeArray(portfolioData.experience);
  container.innerHTML = items.length
    ? items.map(item => `
        <article class="timeline-item">
          <div class="timeline-year">${escapeHTML(item.period)}</div>
          <div>
            <h3>${escapeHTML(item.role)}</h3>
            <h4>${escapeHTML(item.organization)}</h4>
            <p>${escapeHTML(item.description)}</p>
          </div>
        </article>
      `).join("")
    : `<p class="empty-state">Experience will be updated soon.</p>`;
}

/* =========================================================
   RESEARCH
========================================================= */

function loadResearch() {
  const container = document.getElementById("researchGrid");
  if (!container) return;

  const items = safeArray(portfolioData.research);
  container.innerHTML = items.length
    ? items.map((item, index) => `
        <article class="research-card">
          <span class="research-label">Research ${String(index + 1).padStart(2, "0")}</span>
          <h3>
            <a href="${safeURL(item.link)}" target="_blank" rel="noopener noreferrer">
              ${escapeHTML(item.title)}
            </a>
          </h3>
          <h4>${escapeHTML(item.fullTitle)}</h4>
          <p>${escapeHTML(item.description)}</p>
        </article>
      `).join("")
    : `<p class="empty-state">Research projects will be updated soon.</p>`;
}

/* =========================================================
   PUBLICATIONS
========================================================= */

function loadPublications(type = "journals") {
  const container = document.getElementById("publicationList");
  if (!container) return;

  const items = safeArray(portfolioData.publications?.[type]);
  container.innerHTML = items.length
    ? items.map(item => `
        <article class="publication-card">
          <div class="publication-year">${escapeHTML(item.year || "")}</div>
          <div>
            <h3 class="publication-title">
              ${item.link
                ? `<a href="${safeURL(item.link)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.title)}</a>`
                : escapeHTML(item.title)}
            </h3>
            ${item.authors ? `<p class="publication-authors">${escapeHTML(item.authors)}</p>` : ""}
            ${item.venue ? `<p class="publication-venue">${escapeHTML(item.venue)}${item.location ? " · " + escapeHTML(item.location) : ""}</p>` : ""}
            ${item.date ? `<div class="publication-date">${escapeHTML(item.date)}</div>` : ""}
          </div>
        </article>
      `).join("")
    : `<p class="empty-state">No ${escapeHTML(type)} listed yet.</p>`;
}

/* =========================================================
   GALLERY
========================================================= */

function loadGallery() {
  stopGalleryTimers();
  renderGallery("events", document.getElementById("eventsGrid"));
  renderGallery("tapeout", document.getElementById("tapeoutGrid"));
}

function renderGallery(type, container) {
  if (!container) return;

  const albums = safeArray(portfolioData.gallery?.[type]);

  if (!albums.length) {
    container.innerHTML = `<p class="empty-state">Gallery items will be updated soon.</p>`;
    return;
  }

  container.innerHTML = albums.map((album, index) => {
    const photos = safeArray(album.photos);
    return `
      <article class="gallery-card"
               tabindex="0"
               role="button"
               data-gallery-type="${escapeHTML(type)}"
               data-gallery-index="${index}"
               aria-label="Open ${escapeHTML(album.title)}">
        <div class="gallery-image">
          <img src="${escapeHTML(photos[0] || "")}"
               id="${type}-${index}"
               alt="${escapeHTML(album.title)}"
               loading="lazy">
        </div>
        <div class="gallery-info">
          <h3>${escapeHTML(album.title)}</h3>
          <p>${escapeHTML(album.location || "")}</p>
          <span>${photos.length} ${photos.length === 1 ? "Photo" : "Photos"}</span>
        </div>
      </article>
    `;
  }).join("");

  albums.forEach((album, index) => {
    const photos = safeArray(album.photos);
    if (photos.length < 2) return;

    let photoIndex = 0;
    const timer = setInterval(() => {
      photoIndex = (photoIndex + 1) % photos.length;
      const image = document.getElementById(`${type}-${index}`);
      if (image) image.src = photos[photoIndex];
    }, 3000);

    galleryTimers.push(timer);
  });
}

function stopGalleryTimers() {
  galleryTimers.forEach(timer => clearInterval(timer));
  galleryTimers = [];
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const closeButton = document.getElementById("lightboxClose");

  document.addEventListener("click", event => {
    const card = event.target.closest(".gallery-card");
    if (card) openAlbum(card.dataset.galleryType, Number(card.dataset.galleryIndex));
  });

  document.addEventListener("keydown", event => {
    const card = event.target.closest(".gallery-card");

    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openAlbum(card.dataset.galleryType, Number(card.dataset.galleryIndex));
    }

    if (event.key === "Escape" && lightbox?.classList.contains("active")) {
      closeLightbox();
    }
  });

  closeButton?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });
}

function openAlbum(type, index) {
  const album = safeArray(portfolioData.gallery?.[type])[index];
  const photos = safeArray(album?.photos);
  if (!photos.length) return;

  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");
  if (!lightbox || !image) return;

  currentAlbum = photos;
  let photoIndex = 0;

  image.src = currentAlbum[0];
  image.alt = album.title || "Gallery image";
  if (caption) caption.textContent = album.title || "";

  lightbox.style.display = "flex";
  lightbox.classList.add("active");
  document.body.classList.add("lightbox-open");

  clearInterval(lightboxTimer);

  if (currentAlbum.length > 1) {
    lightboxTimer = setInterval(() => {
      photoIndex = (photoIndex + 1) % currentAlbum.length;
      image.src = currentAlbum[photoIndex];
    }, 3000);
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  clearInterval(lightboxTimer);
  lightboxTimer = null;

  if (lightbox) {
    lightbox.style.display = "none";
    lightbox.classList.remove("active");
  }

  document.body.classList.remove("lightbox-open");
}

/* =========================================================
   CONTACT
========================================================= */

function loadContact() {
  const contact = portfolioData.contact || {};

  setText("contactEmail", contact.email);
  const email = document.getElementById("contactEmail");
  if (email) email.href = contact.email ? `mailto:${contact.email}` : "#";

  setText("contactPhone", contact.phone);
  const phone = document.getElementById("contactPhone");
  if (phone) phone.href = contact.phone ? `tel:${String(contact.phone).replace(/\s+/g, "")}` : "#";

  setText("contactLocation", contact.location);

  setExternalHref("linkedinLink", contact.linkedin);
  setExternalHref("scholarLink", contact.googleScholar);
  setExternalHref("footerLinkedin", contact.linkedin);
  setExternalHref("footerScholar", contact.googleScholar);

  const gmail = document.getElementById("gmailLink");
  if (gmail) gmail.href = contact.email ? `mailto:${contact.email}` : "#";

  const footerGmail = document.getElementById("footerGmail");
  if (footerGmail) footerGmail.href = contact.email ? `mailto:${contact.email}` : "#";
}

/* =========================================================
   OTHER
========================================================= */

function loadOther() {
  const types = ["projects", "achievements", "activities"];

  types.forEach(type => {
    const container = document.getElementById(`${type}Grid`);
    if (!container) return;

    const items = safeArray(portfolioData[type]);
    container.innerHTML = items.length
      ? items.map(item => `
          <article class="activity-card">
            <h4>${escapeHTML(item.title || item.name || "Item")}</h4>
            ${item.description ? `<p>${escapeHTML(item.description)}</p>` : ""}
            ${item.date ? `<p class="activity-date">${escapeHTML(item.date)}</p>` : ""}
          </article>
        `).join("")
      : `<p class="empty-state">No ${escapeHTML(type)} added yet.</p>`;
  });
}

/* =========================================================
   NAVIGATION
========================================================= */

function showSection(id) {
  const section = document.getElementById(id);
  if (!section) return false;

  $$(".page-section").forEach(item => item.classList.remove("active"));
  section.classList.add("active");

  $$(".nav-link").forEach(item => item.classList.remove("active"));
  $(`.nav-link[href="#${CSS.escape(id)}"]`)?.classList.add("active");

  closeMobileMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
  return true;
}

function initNavigation() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id)) return;

      event.preventDefault();
      showSection(id);

      if (link.dataset.tab) activateEETab(link.dataset.tab);
      if (link.dataset.publication) activatePublicationTab(link.dataset.publication);
      if (link.dataset.other) activateOtherTab(link.dataset.other);
      if (link.dataset.gallery) activateGalleryTab(link.dataset.gallery);
    });
  });
}

/* =========================================================
   TABS
========================================================= */

function initTabs() {
  $$(".ee-tab").forEach(button => {
    button.addEventListener("click", () => activateEETab(button.dataset.ee));
  });

  $$(".publication-tab").forEach(button => {
    button.addEventListener("click", () => activatePublicationTab(button.dataset.pub));
  });

  $$(".gallery-tab").forEach(button => {
    button.addEventListener("click", () => activateGalleryTab(button.dataset.gallery));
  });

  $$(".other-tab").forEach(button => {
    button.addEventListener("click", () => activateOtherTab(button.dataset.other));
  });
}

function activateEETab(type = "education") {
  $$(".ee-tab").forEach(button => button.classList.toggle("active", button.dataset.ee === type));
  $$(".ee-panel").forEach(panel => panel.classList.toggle("active", panel.id === `${type}Panel`));
}

function activatePublicationTab(type = "journals") {
  currentPublication = type;
  $$(".publication-tab").forEach(button => button.classList.toggle("active", button.dataset.pub === type));
  loadPublications(type);
}

function activateGalleryTab(type = "events") {
  $$(".gallery-tab").forEach(button => button.classList.toggle("active", button.dataset.gallery === type));
  $$(".gallery-panel").forEach(panel => panel.classList.toggle("active", panel.id === `${type}Gallery`));
}

function activateOtherTab(type = "projects") {
  $$(".other-tab").forEach(button => button.classList.toggle("active", button.dataset.other === type));
  $$(".other-panel").forEach(panel => panel.classList.toggle("active", panel.id === `${type}Panel`));
}

/* =========================================================
   MOBILE MENU
========================================================= */

function initMobileMenu() {
  const button = document.getElementById("menuBtn");
  const nav = document.getElementById("navLinks");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("mobile-open");
    button.setAttribute("aria-expanded", String(open));
  });
}

function closeMobileMenu() {
  const nav = document.getElementById("navLinks");
  const button = document.getElementById("menuBtn");
  nav?.classList.remove("mobile-open");
  button?.setAttribute("aria-expanded", "false");
}

/* =========================================================
   SCROLL TOP
========================================================= */

function initScrollTop() {
  const button = document.getElementById("scrollTop");
  if (!button) return;

  window.addEventListener("scroll", () => {
    button.style.display = window.scrollY > 300 ? "flex" : "none";
  }, { passive: true });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function showLoadError() {
  ["aboutBio", "educationTimeline", "experienceTimeline", "researchGrid",
   "publicationList", "eventsGrid", "tapeoutGrid", "projectsGrid",
   "achievementsGrid", "activitiesGrid"].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = `<p class="empty-state">Portfolio data could not be loaded. Please run the website using a local web server.</p>`;
    }
  });
}

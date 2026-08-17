/* =========================================================
   LOAD DATA
========================================================= */

let portfolioData = {};
let currentPublication = "journals";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("data.json");
  portfolioData = await res.json();

  loadProfile();
  loadAbout();
  loadEducation();
  loadExperience();
  loadResearch();
  loadPublications(currentPublication);
  loadContact();

  initNavigation();
  initTabs();
  initScrollTop();

  document.getElementById("currentYear").textContent =
    new Date().getFullYear();
});

/* =========================================================
   HOME
========================================================= */

function loadProfile() {
  const p = portfolioData.profile;

  heroName.textContent = p.name;
  heroDepartment.textContent = p.department;
  heroInstitution.textContent = p.institution;
  heroDescription.textContent = p.shortBio;
  profileImage.src = p.profileImage;

  interestTags.innerHTML = p.interests
    .slice(0, 6)
    .map(tag => `<span>${tag}</span>`)
    .join("");
}

/* =========================================================
   ABOUT
========================================================= */

function loadAbout() {
  aboutBio.innerHTML = portfolioData.about.bio
    .map(
      t => `
      <div class="bio-item">
        <div class="bio-icon"><i class="fa-solid fa-microchip"></i></div>
        <p>${t}</p>
      </div>`
    )
    .join("");

  glancePosition.textContent = portfolioData.profile.designation;
  glanceInstitution.textContent = portfolioData.profile.institution;
  glanceDepartment.textContent = portfolioData.profile.department;
  glanceLocation.textContent = portfolioData.profile.location;
}

/* =========================================================
   EDUCATION
========================================================= */

function loadEducation() {
  educationTimeline.innerHTML = portfolioData.about.education
    .map(
      e => `
      <article class="timeline-item">
        <div class="timeline-year">${e.period}</div>
        <div>
          <h3>${e.degree}</h3>
          <h4>${e.institution}</h4>
          <p>${e.field}</p>
          <p>${e.thesis}</p>
        </div>
      </article>`
    )
    .join("");
}

/* =========================================================
   EXPERIENCE
========================================================= */

function loadExperience() {
  const exp = portfolioData.experience || [];

  experienceTimeline.innerHTML = exp.length
    ? exp
        .map(
          e => `
      <article class="timeline-item">
        <div class="timeline-year">${e.period}</div>
        <div>
          <h3>${e.role}</h3>
          <h4>${e.organization}</h4>
          <p>${e.description}</p>
        </div>
      </article>`
        )
        .join("")
    : `<p style="text-align:center;color:#64748B;">Experience will be updated soon.</p>`;
}

/* =========================================================
   RESEARCH
========================================================= */

function loadResearch() {
  researchGrid.innerHTML = portfolioData.research
    .map(
      (r, i) => `
      <article class="research-card">
        <span class="research-label">Research ${String(i + 1).padStart(2, "0")}</span>

        <h3>
          <a href="${r.link}" target="_blank">${r.title}</a>
        </h3>

        <h4>${r.fullTitle}</h4>

        <p>${r.description}</p>
      </article>`
    )
    .join("");
}

/* =========================================================
   PUBLICATIONS
========================================================= */

function loadPublications(type) {
  const list = portfolioData.publications[type] || [];

  publicationList.innerHTML = list.length
    ? list
        .map(
          p => `
      <article class="publication-card">

        <div class="publication-year">
          ${p.year || ""}
        </div>

        <div>

          <h3 class="publication-title">
            ${
              p.link
                ? `<a href="${p.link}" target="_blank">${p.title}</a>`
                : p.title
            }
          </h3>

          ${
            p.authors
              ? `<p class="publication-authors">${p.authors}</p>`
              : ""
          }

          ${
            p.venue
              ? `<p class="publication-venue">${p.venue}${
                  p.location ? " · " + p.location : ""
                }</p>`
              : ""
          }

          ${p.date ? `<div class="publication-date">${p.date}</div>` : ""}

        </div>

      </article>`
        )
        .join("")
    : `<p style="text-align:center;color:#64748B;">Coming Soon</p>`;
}

/* =========================================================
   CONTACT
========================================================= */

function loadContact() {
  const c = portfolioData.contact;

  contactEmail.textContent = c.email;
  contactEmail.href = `mailto:${c.email}`;

  contactPhone.textContent = c.phone;
  contactPhone.href = `tel:${c.phone}`;

  contactLocation.textContent = c.location;

  linkedinLink.href = c.linkedin;
  gmailLink.href = `mailto:${c.email}`;
  scholarLink.href = c.googleScholar;

  footerLinkedin.href = c.linkedin;
  footerGmail.href = `mailto:${c.email}`;
  footerScholar.href = c.googleScholar;
}

/* =========================================================
   PAGE NAVIGATION
========================================================= */

function initNavigation(){

  const links=document.querySelectorAll("a[href^='#']");

  links.forEach(link=>{

    link.addEventListener("click",e=>{

      const id=link.getAttribute("href").substring(1);
      const section=document.getElementById(id);
      if(!section) return;

      e.preventDefault();

      /* Change page */
      document.querySelectorAll(".page-section")
        .forEach(s=>s.classList.remove("active"));
      section.classList.add("active");

      /* Active navbar */
      document.querySelectorAll(".nav-link")
        .forEach(n=>n.classList.remove("active"));
      document.querySelector(`.nav-link[href="#${id}"]`)
        ?.classList.add("active");

      /* Education / Experience */
      if(link.dataset.tab){
        document.querySelectorAll(".ee-tab").forEach(b=>b.classList.remove("active"));
        document.querySelectorAll(".ee-panel").forEach(p=>p.classList.remove("active"));

        document.querySelector(`.ee-tab[data-ee="${link.dataset.tab}"]`)?.classList.add("active");
        document.getElementById(link.dataset.tab+"Panel")?.classList.add("active");
      }

      /* Publications */
      if(link.dataset.publication){
        document.querySelectorAll(".publication-tab").forEach(b=>b.classList.remove("active"));
        document.querySelector(`.publication-tab[data-pub="${link.dataset.publication}"]`)?.classList.add("active");

        currentPublication=link.dataset.publication;
        loadPublications(currentPublication);
      }

      /* Other */
      if(link.dataset.other){
        document.querySelectorAll(".other-tab").forEach(b=>b.classList.remove("active"));
        document.querySelectorAll(".other-panel").forEach(p=>p.classList.remove("active"));

        document.querySelector(`.other-tab[data-other="${link.dataset.other}"]`)?.classList.add("active");
        document.getElementById(link.dataset.other+"Panel")?.classList.add("active");
      }

      /* Gallery */
      if(link.dataset.gallery){
        document.querySelectorAll(".gallery-tab").forEach(b=>b.classList.remove("active"));
        document.querySelectorAll(".gallery-panel").forEach(p=>p.classList.remove("active"));

        document.querySelector(`.gallery-tab[data-gallery="${link.dataset.gallery}"]`)?.classList.add("active");
        document.getElementById(link.dataset.gallery+"Gallery")?.classList.add("active");
      }

      window.scrollTo({top:0,behavior:"smooth"});

    });

  });

}
/* =========================================================
   TABS
========================================================= */
function initTabs() {

  /* Education & Experience */
  document.querySelectorAll(".ee-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".ee-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".ee-panel").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.ee + "Panel").classList.add("active");
    };
  });

  /* Publications */
  document.querySelectorAll(".publication-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".publication-tab").forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      currentPublication = btn.dataset.pub;
      loadPublications(currentPublication);
    };
  });

  /* Gallery */
  document.querySelectorAll(".gallery-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".gallery-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".gallery-panel").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");

      if (btn.dataset.gallery === "events") {
        document.getElementById("eventsGallery").classList.add("active");
      } else {
        document.getElementById("tapeoutGallery").classList.add("active");
      }
    };
  });

  // Load gallery images for events and tapeouts
  function loadGallery(){

  renderGallery("events",eventsGrid);

  renderGallery("tapeout",tapeoutGrid);

}

function renderGallery(type,container){

  const albums=portfolioData.gallery[type]||[];

  container.innerHTML=albums.map((album,i)=>`

    <article class="gallery-card" onclick="openAlbum('${type}',${i})">

      <div class="gallery-image">
        <img
          src="${album.photos[0]}"
          id="${type}-${i}"
          alt="${album.title}">
      </div>

      <div class="gallery-info">
        <h3>${album.title}</h3>
        <p>${album.location}</p>
        <span>${album.photos.length} Photos</span>
      </div>

    </article>

  `).join("");

  albums.forEach((album,i)=>{

    let index=0;

    setInterval(()=>{

      index=(index+1)%album.photos.length;

      const img=document.getElementById(`${type}-${i}`);

      if(img) img.src=album.photos[index];

    },2000);

  });

}
loadGallery();

let currentAlbum=[];

function openAlbum(type,index){

  currentAlbum=portfolioData.gallery[type][index].photos;

  let i=0;

  lightbox.style.display="flex";
  lightboxImage.src=currentAlbum[0];

  const slide=setInterval(()=>{

    if(lightbox.style.display==="none"){
      clearInterval(slide);
      return;
    }

    i=(i+1)%currentAlbum.length;
    lightboxImage.src=currentAlbum[i];

  },2000);

}

lightboxClose.onclick=()=>{
  lightbox.style.display="none";
};

  /* Other */
  document.querySelectorAll(".other-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".other-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".other-panel").forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(btn.dataset.other + "Panel").classList.add("active");
    };
  });

}

/* =========================================================
   SCROLL TOP
========================================================= */

function initScrollTop() {
  const btn = document.getElementById("scrollTop");

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  btn.onclick = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
}

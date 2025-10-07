document.addEventListener("DOMContentLoaded", () => {
  // Chatbox
  const chatForm = document.getElementById('chatbox-form');
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('chatbox-input');
      const messages = document.getElementById('chatbox-messages');
      if (!input || !messages) return;
      const userMsg = input.value.trim();
      if (!userMsg) return;
      messages.innerHTML += `<div><b>You:</b> ${userMsg}</div>`;
      input.value = '';

      const aiResponses = [
        "Sorry, I'm just a demo AI chat box!",
        "Gabriel made me! though I'm not very smart yet.",
        "I am made for the sole purpose of demonstrating a chat box."
      ];
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      setTimeout(() => {
        messages.innerHTML += `<div><b>AI:</b> ${randomResponse}</div>`;
        messages.scrollTop = messages.scrollHeight;
      }, 700);
      messages.scrollTop = messages.scrollHeight;
    });

    const chatClose = document.getElementById('chatbox-close');
    const chatOpen = document.getElementById('chatbox-open');
    if (chatClose) {
      chatClose.addEventListener('click', () => {
        const chat = document.getElementById('chatbox');
        if (chat) chat.style.display = 'none';
        if (chatOpen) chatOpen.style.display = 'flex';
      });
    }
    if (chatOpen) {
      chatOpen.addEventListener('click', function () {
        const chat = document.getElementById('chatbox');
        if (chat) chat.style.display = 'flex';
        this.style.display = 'none';
      });
    }
  }

  const loadingOverlay = document.getElementById('loading-overlay');
  document.querySelectorAll('a').forEach(link => {
    // Only intercept local links (not anchors or external)
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('javascript:') &&
        !link.hasAttribute('target')
      ) {
        e.preventDefault();
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        setTimeout(() => {
          window.location.href = href;
        }, 700); // Show loading for 0.7s
      }
    });
  });

  // Search
  const services = [
    { title: "Digital Signature", url: "./webpages/services.html", keywords: "digital signature sign document" },
    { title: "Document Verification", url: "./webpages/services.html", keywords: "verification check document" },
    { title: "Cloud Storage", url: "./webpages/services.html", keywords: "cloud storage save document" }
  ];

  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (searchInput && searchResults) {
    function renderSuggestions(list) {
      searchResults.innerHTML = "";
      list.forEach(service => {
        const item = document.createElement("a");
        item.href = service.url;
        item.textContent = service.title;
        item.classList.add("search-item");
        searchResults.appendChild(item);
      });
      searchResults.classList.add("show");
    }

    searchInput.addEventListener("focus", () => renderSuggestions(services));

    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      if (!query) {
        renderSuggestions(services);
        return;
      }
      const matches = services.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.keywords.toLowerCase().includes(query)
      );
      if (matches.length > 0) renderSuggestions(matches);
      else {
        searchResults.innerHTML = "";
        const noResult = document.createElement("div");
        noResult.textContent = "No results found";
        noResult.classList.add("no-results");
        noResult.onclick = () => window.location.href = "./webpages/404.html";
        searchResults.appendChild(noResult);
        searchResults.classList.add("show");
      }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = searchInput.value.toLowerCase().trim();
        const match = services.find(s =>
          s.title.toLowerCase().includes(query) ||
          s.keywords.toLowerCase().includes(query)
        );
        window.location.href = match ? match.url : "./webpages/404.html";
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove("show");
      }
    });
  }
  const isInWebpages = window.location.pathname.toLowerCase().includes('/webpages/');
  // Dark mode
  const toggleBtn = document.getElementById("dark-toggle");
  const body = document.body;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  const footerLogo = document.querySelector('.footer-logo');
  const darkLogo = isInWebpages ? '../img/dark-mode-logo.png' : './img/dark-mode-logo.png';
  const lightLogo = isInWebpages ? '../img/logo.png' : './img/logo.png';


  function updateFooterLogo() {
    if (!footerLogo) return;
    if (document.body.classList.contains('dark-mode')) {
      footerLogo.src = darkLogo;
    } else {
      footerLogo.src = lightLogo;
    }
  }


  updateFooterLogo();

  if (saved === "dark" || (saved === null && prefersDark)) {
    body.classList.add("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "☀️";
  } else {
    body.classList.remove("dark-mode");
    if (toggleBtn) toggleBtn.textContent = "🌙";
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isDark = body.classList.toggle("dark-mode");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      toggleBtn.textContent = isDark ? "☀️" : "🌙";
    });
    toggleBtn.addEventListener("click", updateFooterLogo);
  }

  // Pricing Plans
  const planBtns = document.querySelectorAll('.plan-btn');
  let currentSubSaved = localStorage.getItem("currentPlan");

  if (!currentSubSaved) {
    currentSubSaved = "Basic";
    localStorage.setItem("currentPlan", "Basic");
  }


  planBtns.forEach(btn => {
    const planName = btn.getAttribute('data-plan');
    btn.textContent = `Choose ${planName}`;
    btn.disabled = false;
    btn.classList.remove('disabled', 'current-plan-btn');
  });

  planBtns.forEach(btn => {
    const planName = btn.getAttribute('data-plan');
    if (planName === currentSubSaved) {
      btn.textContent = `Current Plan`;
      btn.disabled = true;
      btn.classList.add('disabled', 'current-plan-btn');
    } else {
      btn.addEventListener('click', () => {
        localStorage.setItem("currentPlan", planName);
        if (planName === "Mystery") {
          const modal = document.getElementById('mystery-modal');
          if (modal) {
            modal.style.display = 'flex';
            const content = modal.querySelector('.modal-content');
            if (content) {
              content.classList.remove('jumpscare');
              void content.offsetWidth;
              content.classList.add('jumpscare');
            }
          }
        } else if (planName === "God") {
          const modal = document.getElementById('god-modal');
          if (modal) {
            modal.style.display = 'flex';
            const content = modal.querySelector('.modal-content');
            if (content) {
              content.classList.remove('jumpscare');
              void content.offsetWidth;
              content.classList.add('jumpscare');
            }
          }
        } else if (planName === "Noob") {
          const modal = document.getElementById('noob-modal');
          if (modal) {
            modal.style.display = 'flex';
            const content = modal.querySelector('.modal-content');
            if (content) {
              content.classList.remove('jumpscare');
              void content.offsetWidth;
              content.classList.add('jumpscare');
            }
          }
        } else {
          alert(`You have selected the ${planName} plan!`);
          window.location.reload();
        }
      });
    }
  });


  const mysteryModal = document.getElementById('mystery-modal');
  const mysteryModalClose = document.getElementById('mystery-modal-close');
  if (mysteryModal && mysteryModalClose) {
    mysteryModalClose.onclick = () => {
      mysteryModal.style.display = 'none';
      window.location.reload();
    };
    window.addEventListener('click', (event) => {
      if (event.target === mysteryModal) {
        mysteryModal.style.display = 'none';
        window.location.reload();
      }
    });
  }


  const godModal = document.getElementById('god-modal');
  const godModalClose = document.getElementById('god-modal-close');
  if (godModal && godModalClose) {
    godModalClose.onclick = () => {
      godModal.style.display = 'none';
      window.location.reload();
    };
    window.addEventListener('click', (event) => {
      if (event.target === godModal) {
        godModal.style.display = 'none';
        window.location.reload();
      }
    });
  }
  //ADVERT
  const basicAdvert = document.getElementById('basic-advert');
  const advertClose = document.getElementById('advert-close');
  const advertImg = document.getElementById('advert-img');
  let currentPlan = localStorage.getItem("currentPlan");



  const advertImages = isInWebpages
    ? [
      "../advertImg/letssub.png",
      "../advertImg/noobvsmystery.jpg",
      "../advertImg/notsub.png",
      "../advertImg/whyishe.png",
      "../advertImg/whynot.png"
    ]
    : [
      "./advertImg/letssub.png",
      "./advertImg/noobvsmystery.jpg",
      "./advertImg/notsub.png",
      "./advertImg/whyishe.png",
      "./advertImg/whynot.png"
    ];

  if (basicAdvert && currentPlan === "Basic") {
    if (advertImg) {
      const idx = Math.floor(Math.random() * advertImages.length);
      advertImg.src = advertImages[idx];
    }
    basicAdvert.style.display = "block";
    if (advertClose) {
      advertClose.onclick = () => {
        basicAdvert.style.display = "none";
      };
    }
  }



  // Service Modal
  const cards = document.querySelectorAll('.service-card');
  if (cards && cards.length) {
    const modernModal = document.getElementById('serviceModal');
    const modernTitle = modernModal ? modernModal.querySelector('#modalTitle') : null;
    const modernText = modernModal ? modernModal.querySelector('#modalText') : null;

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const h = card.querySelector('h3');
        const title = h ? h.textContent.trim() : 'Service';
        const p = card.querySelector('p');
        const content = p ? `<p>${p.textContent}</p>` : '<p>No details available.</p>';

        if (modernModal && modernTitle && modernText) {
          modernTitle.innerHTML = title;
          modernText.innerHTML = content;
          modernModal.classList.add('show');
        } else {
          window.location.href = './webpages/services.html';
        }
      });
    });

    if (modernModal) {
      const modernClose = modernModal.querySelector('.close-btn');
      if (modernClose) modernClose.addEventListener('click', () => modernModal.classList.remove('show'));
      modernModal.addEventListener('click', (e) => {
        if (e.target === modernModal) modernModal.classList.remove('show');
      });
    }
  }
});
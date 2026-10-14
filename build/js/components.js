(function () {
  const base = document.body.dataset.base || "/";
  const ADOBE_FONTS_URL = "https://use.typekit.net/rmg3cin.css";

  if (!document.querySelector('link[href*="typekit.net"]')) {
    const fonts = document.createElement("link");
    fonts.rel = "stylesheet";
    fonts.href = ADOBE_FONTS_URL;
    document.head.appendChild(fonts);
  }

  const navLinks = [
    { href: "index.html", label: "Home" },
    { href: "about/", label: "About Us" },
    { href: "team/", label: "Meet The Team" },
    { href: "our-work/", label: "Our Work" },
    { href: "services/", label: "Our Services" },
    { href: "location/", label: "Locations" },
    { href: "contact/", label: "Contact" },
  ];

  const locationLinks = [
    { href: "location/abandoned/", label: "Abandoned" },
    { href: "location/beaches/", label: "Beaches" },
    { href: "location/city-urban/", label: "City Urban" },
    { href: "location/homes-hotels/", label: "Homes & Hotels" },
    { href: "location/rivers-waterfalls/", label: "Rivers & Waterfalls" },
    { href: "location/rural-countryside/", label: "Rural Countryside" },
  ];

  function resolve(path) {
    if (path === "index.html") return base;
    return base + path;
  }

  function renderHeader() {
    const mount = document.getElementById("site-header");
    if (!mount) return;

    mount.outerHTML = `
      <header class="site-header">
        <a href="${resolve("index.html")}" class="site-header__brand" aria-label="Costa Rica Production Company home">
          <img
            class="site-header__logo site-header__logo--desktop"
            src="${base}assets/costa-rica-logo-stnd.png?v=3"
            alt="Costa Rica Production Company"
          >
          <img
            class="site-header__logo site-header__logo--mobile"
            src="${base}assets/costa-rica-logo-mbl.png?v=3"
            alt="Costa Rica Production Company"
          >
        </a>

        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
          <img
            class="nav-toggle__icon"
            src="${base}assets/GPH-Menu-Hamburger.png?v=3"
            alt=""
            width="52"
            height="52"
          >
        </button>
      </header>

      <nav class="site-nav" id="site-nav" aria-label="Main navigation">
        <ul class="site-nav__list">
          ${navLinks
            .map((link) => `<li><a href="${resolve(link.href)}">${link.label}</a></li>`)
            .join("")}
        </ul>
      </nav>
    `;
  }

  function renderFooter() {
    const mount = document.getElementById("site-footer");
    if (!mount) return;

    mount.outerHTML = `
      <footer class="site-footer" id="contact">
        <div class="site-footer__grid">
          <div class="site-footer__brand">
            <img src="${base}assets/costa-rica-logo-stnd.png?v=3" alt="Costa Rica Production Company">
            <p data-cms-footer="tagline">Boutique photoshoot production company based in Costa Rica.</p>
          </div>

          <div class="site-footer__col">
            <h2 class="site-footer__heading">Explore</h2>
            <ul>
              ${navLinks
                .slice(1)
                .map((link) => `<li><a href="${resolve(link.href)}">${link.label}</a></li>`)
                .join("")}
            </ul>
          </div>

          <div class="site-footer__col">
            <h2 class="site-footer__heading">Contact</h2>
            <p>Costa Rica</p>
            <p><a data-cms-footer="email" href="mailto:hola@costaricaproductioncompany.com">hola@costaricaproductioncompany.com</a></p>
            <p><a data-cms-footer="instagram" href="https://www.instagram.com/costaricaproductioncompany" target="_blank" rel="noopener noreferrer">Instagram</a></p>
            <p class="site-footer__locations">
              ${locationLinks
                .map((link) => `<a href="${resolve(link.href)}">${link.label}</a>`)
                .join("<br>")}
            </p>
          </div>
        </div>

        <div class="site-footer__bottom">
          <p>&copy; 2026 Costa Rica Production Company. All rights reserved.</p>
          <p class="site-footer__credit">
            Website designed, built and maintained by
            <a href="https://paradigmstudio.net/" target="_blank" rel="noopener noreferrer">Paradigm Studio</a>
          </p>
        </div>
      </footer>
    `;
  }

  renderHeader();
  renderFooter();
})();

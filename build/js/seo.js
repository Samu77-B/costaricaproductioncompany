(function () {
  const ORIGIN = "https://www.costaricaproductioncompany.com";
  const DEFAULT_IMAGE =
    ORIGIN + "/assets/HomePage/home%20page%20main%20hero%20image.png";

  function pageUrl() {
    const path = location.pathname.replace(/index\.html$/, "");
    if (!path || path === "/") return ORIGIN + "/";
    return ORIGIN + (path.endsWith("/") ? path : path + "/");
  }

  function ensureMeta(attr, key, value) {
    if (!value) return;
    let el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  function ensureCanonical(url) {
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.rel = "canonical";
      document.head.appendChild(el);
    }
    el.href = url;
  }

  function ogImage() {
    const hero = document.querySelector(
      ".page-hero__media img, .hero__slide--active img, .page-section__media--about-photo img"
    );
    if (hero && hero.src) return hero.src;
    return DEFAULT_IMAGE;
  }

  function apply() {
    const url = pageUrl();
    const title = document.title;
    const desc =
      (document.querySelector('meta[name="description"]') || {}).content || "";
    const image = ogImage();

    ensureCanonical(url);
    ensureMeta("property", "og:type", "website");
    ensureMeta("property", "og:site_name", "Costa Rica Production Company");
    ensureMeta("property", "og:locale", "en_GB");
    ensureMeta("property", "og:title", title);
    ensureMeta("property", "og:description", desc);
    ensureMeta("property", "og:url", url);
    ensureMeta("property", "og:image", image);
    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", title);
    ensureMeta("name", "twitter:description", desc);
    ensureMeta("name", "twitter:image", image);
  }

  function ensureJsonLd() {
    if (document.body.dataset.page !== "home") return;
    if (document.getElementById("gph-jsonld")) return;

    const desc =
      (document.querySelector('meta[name="description"]') || {}).content || "";
    const data = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Costa Rica Production Company",
      url: ORIGIN + "/",
      image: DEFAULT_IMAGE,
      description: desc,
      email: "enquiries@costaricaproductioncompany.com",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CR",
      },
      areaServed: ["Costa Rica"],
      sameAs: ["https://www.instagram.com/costaricaproductioncompany"],
    };

    const script = document.createElement("script");
    script.id = "gph-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  apply();
  ensureJsonLd();
  window.addEventListener("gph:cms-updated", apply);
})();

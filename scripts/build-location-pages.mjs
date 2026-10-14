import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const assets = join(root, "build", "assets");
const locRoot = join(root, "build", "location");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const HASH_DUP = /-[a-f0-9]{32}\./i;

function getImages(folder) {
  return readdirSync(join(assets, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXT.has(extname(name).toLowerCase()))
    .filter((name) => !HASH_DUP.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function encodeSrc(folder, name) {
  return `/assets/${folder}/${encodeURIComponent(name).replace(/%2F/g, "/")}`;
}

function altFromName(name) {
  return basename(name, extname(name)).replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const locations = [
  {
    slug: "abandoned",
    title: "Abandoned",
    folder: "abandoned",
    hero: "ABANDONED1.png",
    lede: "Disused buildings, weathered interiors, and offbeat structures for editorial and fashion work.",
    intro:
      "From empty houses to forgotten industrial corners, these spaces give campaigns a raw, cinematic edge. We know which sites are shoot-ready and how to get you in.",
  },
  {
    slug: "beaches",
    title: "Beaches",
    folder: "Beaches",
    hero: "TAMARINDO1.png",
    lede: "Pacific and Caribbean coastline, from Tamarindo and Conchal to Manuel Antonio.",
    intro:
      "Costa Rica's coasts shift fast: pale sand, black volcanic shore, jungle meeting the sea. We pick beaches for the light, the tide, and the look you need.",
  },
  {
    slug: "city-urban",
    title: "City Urban",
    folder: "City_Urban",
    hero: "amon1.jpg",
    lede: "San Jose streets, markets, and lived-in neighbourhoods across the Central Valley.",
    intro:
      "Colour, texture, and everyday life: Barrio Amon, markets, and city streets that read as fashion and commercial backdrops without looking staged.",
  },
  {
    slug: "homes-hotels",
    title: "Homes & Hotels",
    folder: "location_homes_hotels",
    hero: "NAYARA1.png",
    lede: "Houses, lodges, and hotels, from jungle treehouses to boutique resorts.",
    intro:
      "Interiors and grounds with a point of view: rainforest lodges, coastal houses, and hotels we can book, permit, and run as a full production base.",
  },
  {
    slug: "rivers-waterfalls",
    title: "Rivers & Waterfalls",
    folder: "rivers_waterfalls",
    hero: "rio celeste.jpeg",
    lede: "Rivers, waterfalls, and rainforest water: Rio Celeste, Pacuare, and beyond.",
    intro:
      "Moving water, jungle canopy, and that particular Costa Rican green. These locations need local knowledge for access, timing, and weather. We handle it.",
  },
  {
    slug: "rural-countryside",
    title: "Rural Countryside",
    folder: "rural_country",
    hero: "arenal.png",
    lede: "Fincas, highland valleys, and open countryside across Costa Rica.",
    intro:
      "Volcano views, working farms, and quiet rural roads. A different pace and a different palette, often only a short drive from the coast or the city.",
  },
];

function locationPage(loc, images, heroName, sideName) {
  const heroSrc = encodeSrc(loc.folder, heroName);
  const sideSrc = encodeSrc(loc.folder, sideName);
  const gallery = images
    .map(
      (name) =>
        `        <img src="${encodeSrc(loc.folder, name)}" alt="${escapeHtml(altFromName(name))}">`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(loc.title)} — Costa Rica Production Company</title>
  <meta name="description" content="${escapeHtml(loc.lede)}">
  <link rel="canonical" href="https://www.costaricaproductioncompany.com/location/${loc.slug}/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Costa Rica Production Company">
  <meta property="og:title" content="${escapeHtml(loc.title)} — Costa Rica Production Company">
  <meta property="og:description" content="${escapeHtml(loc.lede)}">
  <meta property="og:url" content="https://www.costaricaproductioncompany.com/location/${loc.slug}/">
  <meta property="og:image" content="https://www.costaricaproductioncompany.com${heroSrc}">
  <link rel="icon" href="/assets/costa-rica-logo-mbl.png?v=3" type="image/png">
  <link rel="stylesheet" href="/css/styles.css?v=45">
</head>
<body data-base="/" data-page="location" data-location="${loc.slug}">
  <div id="site-header"></div>

  <section class="page-hero">
    <div class="page-hero__media">
      <img src="${heroSrc}" alt="${escapeHtml(loc.title)}">
    </div>
    <div class="page-hero__overlay" aria-hidden="true"></div>
    <div class="page-hero__content">
      <p class="page-hero__eyebrow">Locations</p>
      <h1 class="page-hero__title">${escapeHtml(loc.title)}</h1>
      <p class="page-hero__lede">${escapeHtml(loc.lede)}</p>
    </div>
  </section>

  <section class="page-section">
    <div class="page-section__inner">
      <p class="location-back-wrap">
        <a class="location-back" href="../">&larr; Back to locations</a>
      </p>
      <div class="page-section__grid page-section__grid--location">
        <div class="location-intro">
          <p class="page-section__text">
            ${escapeHtml(loc.intro)}
          </p>
        </div>
        <div class="page-section__media">
          <img src="${sideSrc}" alt="${escapeHtml(loc.title)}">
        </div>
      </div>

      <h3 class="page-section__subhead">Location gallery</h3>
      <div class="location-gallery">
${gallery}
      </div>
    </div>
  </section>

  <div id="site-footer"></div>
  <script src="/js/cms-config.js?v=4"></script>
  <script src="/js/components.js?v=15"></script>
  <script src="/js/cms.js?v=6"></script>
  <script src="/js/seo.js?v=3"></script>
  <script src="/js/forms.js?v=22"></script>
  <script src="/js/main.js?v=20"></script>
</body>
</html>
`;
}

const cardParts = [];

for (const loc of locations) {
  const images = getImages(loc.folder);
  if (!images.length) throw new Error(`No images in ${loc.folder}`);

  const heroName = images.includes(loc.hero) ? loc.hero : images[0];
  const sideName = images.find((name) => name !== heroName) || heroName;
  const heroSrc = encodeSrc(loc.folder, heroName);

  mkdirSync(join(locRoot, loc.slug), { recursive: true });
  writeFileSync(join(locRoot, loc.slug, "index.html"), locationPage(loc, images, heroName, sideName));

  cardParts.push(`        <a class="page-card" href="${loc.slug}/">
          <div class="page-card__image">
            <img src="${heroSrc}" alt="${escapeHtml(loc.title)}">
          </div>
          <h3 class="page-card__title">${escapeHtml(loc.title)}</h3>
          <p class="page-card__text">${escapeHtml(loc.lede)}</p>
        </a>`);

  console.log(`Wrote ${loc.slug} (${images.length} images)`);
}

const indexHero = encodeSrc("Beaches", "MANUEL ANTONIO1.png");
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Locations — Costa Rica Production Company</title>
  <meta name="description" content="Explore curated shoot locations across Costa Rica: abandoned spaces, beaches, city streets, homes and hotels, rivers and waterfalls, and rural countryside.">
  <link rel="canonical" href="https://www.costaricaproductioncompany.com/location/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Costa Rica Production Company">
  <meta property="og:title" content="Locations — Costa Rica Production Company">
  <meta property="og:description" content="Explore curated shoot locations across Costa Rica: abandoned spaces, beaches, city streets, homes and hotels, rivers and waterfalls, and rural countryside.">
  <meta property="og:url" content="https://www.costaricaproductioncompany.com/location/">
  <meta property="og:image" content="https://www.costaricaproductioncompany.com${indexHero}">
  <link rel="icon" href="/assets/costa-rica-logo-mbl.png?v=3" type="image/png">
  <link rel="stylesheet" href="/css/styles.css?v=45">
</head>
<body data-base="/" data-page="locations">
  <div id="site-header"></div>

  <section class="page-hero">
    <div class="page-hero__media">
      <img src="${indexHero}" alt="Costa Rica landscape for location shoots">
    </div>
    <div class="page-hero__overlay" aria-hidden="true"></div>
    <div class="page-hero__content">
      <p class="page-hero__eyebrow">Locations</p>
      <h1 class="page-hero__title">Costa Rica is our backyard</h1>
    </div>
  </section>

  <section class="page-section">
    <div class="page-section__inner">
      <p class="page-section__text">
        Looking to capture some amazing images in Costa Rica? Look no further! We're the go-to production company in the area, and we've got all the inside scoop to make your shoot unforgettable. If you want a place that instantly gets your creative brain buzzing, Costa Rica is one of those countries.
      </p>
      <p class="page-section__text">
        It's honestly wild how much visual variety you get in such a small area. One minute you're shooting in rainforest canopy and misted ridgelines, the next you're surrounded by volcanic highlands, palm-lined coasts, and lived-in city streets. You barely have to move, but every frame looks completely different. The light here is a dream. Soft, golden, flattering — especially in the mornings and around sunset. If you love working with natural light, Costa Rica really shows up for you.
      </p>
      <p class="page-section__text">
        We've got a knack for finding unique and quirky backdrops as well as breathtaking scenic spots. From hidden gems to iconic locations, we'll suggest the perfect locations to make your content pop!
      </p>
      <p class="page-section__text">
        But that's not all — we'll take care of all the nitty-gritty details too. Permits? No problem. Accommodation? We've got you covered. Equipment? Ready to hire! We'll ensure your team has everything they need to focus on creating stunning work.
      </p>
      <p class="page-section__text">
        And here's the best part: we'll let you in on the local secrets. So, let's make your shoot in Costa Rica absolutely unforgettable. Get in touch with us today and let's capture some magic together!
      </p>

      <div class="page-cards">
${cardParts.join("\n\n")}
      </div>
    </div>
  </section>

  <div id="site-footer"></div>
  <script src="/js/cms-config.js?v=4"></script>
  <script src="/js/components.js?v=15"></script>
  <script src="/js/cms.js?v=6"></script>
  <script src="/js/seo.js?v=3"></script>
  <script src="/js/main.js?v=20"></script>
</body>
</html>
`;

writeFileSync(join(locRoot, "index.html"), indexHtml);
console.log("Wrote location index");

const workImages = getImages("our_work");
const workHero = workImages.includes("HELLO FASHION.jpg") ? "HELLO FASHION.jpg" : workImages[0];
const workHeroSrc = encodeSrc("our_work", workHero);
const workGrid = workImages
  .map(
    (name) => `        <figure class="work-grid__item">
          <img src="${encodeSrc("our_work", name)}" alt="${escapeHtml(altFromName(name))}">
        </figure>`
  )
  .join("\n");

const workHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Work — Costa Rica Production Company</title>
  <meta name="description" content="Selected fashion, commercial and editorial work produced by Costa Rica Production Company.">
  <link rel="canonical" href="https://www.costaricaproductioncompany.com/our-work/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Costa Rica Production Company">
  <meta property="og:title" content="Our Work — Costa Rica Production Company">
  <meta property="og:description" content="Selected fashion, commercial and editorial work produced by Costa Rica Production Company.">
  <meta property="og:url" content="https://www.costaricaproductioncompany.com/our-work/">
  <meta property="og:image" content="https://www.costaricaproductioncompany.com${workHeroSrc}">
  <link rel="icon" href="/assets/costa-rica-logo-mbl.png?v=3" type="image/png">
  <link rel="stylesheet" href="/css/styles.css?v=45">
</head>
<body data-base="/" data-page="our-work">
  <div id="site-header"></div>

  <section class="page-hero">
    <div class="page-hero__media">
      <img src="${workHeroSrc}" alt="Selected production work">
    </div>
    <div class="page-hero__overlay" aria-hidden="true"></div>
    <div class="page-hero__content">
      <p class="page-hero__eyebrow">Our Work</p>
      <h1 class="page-hero__title">Selected productions</h1>
      <p class="page-hero__lede">A look at recent fashion, commercial and editorial work produced across Costa Rica and the surrounding landscape.</p>
    </div>
  </section>

  <section class="page-section">
    <div class="page-section__inner">
      <h2 class="page-section__headline">Campaigns shaped by light, place, and craft.</h2>
      <p class="page-section__text">
        From coastal fashion stories to city editorials, our production work is built around locations that give each campaign a clear visual identity — and logistics that keep the day calm and considered.
      </p>

      <div class="work-grid">
${workGrid}
      </div>
    </div>
  </section>

  <div id="site-footer"></div>
  <script src="/js/cms-config.js?v=4"></script>
  <script src="/js/components.js?v=15"></script>
  <script src="/js/cms.js?v=6"></script>
  <script src="/js/seo.js?v=3"></script>
  <script src="/js/main.js?v=20"></script>
</body>
</html>
`;

writeFileSync(join(root, "build", "our-work", "index.html"), workHtml);
console.log(`Wrote our-work (${workImages.length} images)`);

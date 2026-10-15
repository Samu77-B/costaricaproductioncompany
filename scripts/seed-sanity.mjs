import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(join(rootDir, ".env"));

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || projectId === "your_project_id" || projectId === "your-project-id") {
  console.error("Set SANITY_PROJECT_ID in .env");
  process.exit(1);
}

if (!token) {
  console.error("Set SANITY_WRITE_TOKEN in .env (Editor token from Sanity → API → Tokens).");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

function block(text, key, marks = []) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s`, text, marks }],
  };
}

function blockWithLink(before, href, label, after, key) {
  const markKey = `${key}l`;
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [{ _type: "link", _key: markKey, href }],
    children: [
      { _type: "span", _key: `${key}a`, text: before, marks: [] },
      { _type: "span", _key: `${key}b`, text: label, marks: [markKey] },
      { _type: "span", _key: `${key}c`, text: after, marks: [] },
    ],
  };
}

function slug(current) {
  return { _type: "slug", current };
}

const documents = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    siteTitle: "Costa Rica Production Company",
    defaultMetaDescription:
      "A boutique photoshoot production company based in Costa Rica, specialising in fashion, commercial, editorial and advertising print shoots, film production and events.",
    contactEmail: "hola@costaricaproductioncompany.com",
    enquiryEmail: "hola@costaricaproductioncompany.com",
    phone: "",
    instagramUrl: "https://www.instagram.com/costaricaproductioncompany",
    footerTagline: "Boutique photoshoot production company based in Costa Rica.",
  },
  {
    _id: "homePage",
    _type: "homePage",
    heroCopy:
      "A Boutique photoshoot production company, based in Costa Rica, specialising in fashion, commercial, editorial & advertising print shoots, film production and events.",
    aboutHeadline: "Hey There!",
    aboutBlocks: [
      {
        _key: "intro1",
        body: "Looking to bring your creative vision to life in the stunning landscapes of Costa Rica? Look no further! Costa Rica Production Company is here to make it happen.",
      },
      {
        _key: "intro2",
        body: "We're a boutique photoshoot production company based in Costa Rica, specialising in fashion, commercial, editorial and advertising print shoots, film production and events.",
      },
      {
        _key: "intro3",
        body: "We're here to help you bring your creative vision to life in the stunning landscapes of Costa Rica.",
      },
      {
        _key: "landscape",
        subhead: "The landscape",
        body: "Costa Rica is our backyard. We offer a curated portfolio of locations to provide the perfect light and landscape for your next campaign.",
      },
      {
        _key: "craft",
        subhead: "The Craft.",
        body: "Specialised consultancy for print and production. With thirty years in the industry, we ensure the technical integrity of your project from the first shot to the final ink on paper.",
      },
    ],
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    metaTitle: "About Us — Costa Rica Production Company",
    metaDescription:
      "Costa Rica Production Company — a sister-led production company with over 30 years of experience in fashion, editorial, and print production across Costa Rica.",
    heroEyebrow: "About Us",
    heroTitle: "A Legacy of Sight, Style & Storytelling",
    body: [
      block(
        "At Costa Rica Production Company, production is in our DNA. Founded by two sisters with over 30 years of combined experience in fashion, editorial, and print production, we blend international production standards with the beauty and soul of Costa Rica.",
        "a1"
      ),
      block(
        "Based in Costa Rica, we help brands, photographers, and agencies bring their creative visions to life through unforgettable locations, seamless coordination, and local expertise. From hidden gems and iconic backdrops to permits, accommodations, equipment rentals, and production support — we handle every detail so your team can focus on creating exceptional work.",
        "a2"
      ),
      block(
        "As a sister-led company, we bring a shared creative eye, strong industry experience, and a personal approach to every project.",
        "a3"
      ),
      block("Locally rooted. Globally minded. Let's create something unforgettable together.", "a4"),
    ],
  },
  {
    _id: "teamPage",
    _type: "teamPage",
    metaTitle: "Meet The Team — Costa Rica Production Company",
    metaDescription:
      "Meet the Costa Rica Production Company team — producers, casting directors, and production specialists based in Costa Rica and London.",
    heroEyebrow: "Meet The Team",
    heroTitle: "People behind the frame",
  },
  {
    _id: "contactPage",
    _type: "contactPage",
    metaTitle: "Contact — Costa Rica Production Company",
    metaDescription: "Contact Costa Rica Production Company to start your next creative project in Costa Rica.",
    heroEyebrow: "Contact",
    heroTitle: "Looking to start your project?",
    introText: [
      block(
        "If you're interested in working on a creative project with us, simply pop us a call or fill out the contact form below and one of the team will be in touch within 24 hours! From here, we'll either quote on the spot or arrange a video call to discuss the project further before quoting and booking.",
        "c1"
      ),
      blockWithLink(
        "For non-project enquiries, please email us at ",
        "mailto:hola@costaricaproductioncompany.com",
        "hola@costaricaproductioncompany.com",
        ".",
        "c2"
      ),
    ],
  },
  {
    _id: "servicesPage",
    _type: "servicesPage",
    metaTitle: "Our Services — Costa Rica Production Company",
    metaDescription:
      "Complete 360° production support from Costa Rica Production Company — location scouting, logistics, permits, crew, casting, and equipment.",
    heroEyebrow: "Our Services",
    heroTitle: "We LOVE what we do — and we do it exceptionally well.",
    heroLede:
      "From pre-production planning to on-the-ground coordination, we provide complete 360° production support tailored to your project needs.",
    services: [
      { _key: "s1", title: "Curated location scouting", description: "Tailored to your creative vision." },
      {
        _key: "s2",
        title: "Travel logistics",
        description: "Coordinating travel logistics, accommodation, and visa support.",
      },
      {
        _key: "s3",
        title: "Permits & clearances",
        description: "Working closely with local government authorities to secure permits and filming clearances.",
      },
      {
        _key: "s4",
        title: "Carnets & customs",
        description: "Organising carnets and customs documentation.",
      },
      {
        _key: "s5",
        title: "Insurance & risk",
        description: "Managing insurance coordination and risk assessments.",
      },
      {
        _key: "s6",
        title: "Transport",
        description: "Booking transport, including location vehicles, car hire, and professional drivers.",
      },
      {
        _key: "s7",
        title: "Crew & equipment",
        description: "Hiring experienced local crews, trusted service providers, and production equipment.",
      },
      { _key: "s8", title: "Casting coordination", description: "Model and talent casting coordination." },
      {
        _key: "s9",
        title: "Accommodation partnerships",
        description: "Contracting and managing hotel and accommodation partnerships.",
      },
    ],
  },
  {
    _id: "ourWorkPage",
    _type: "ourWorkPage",
    metaTitle: "Our Work — Costa Rica Production Company",
    metaDescription: "Selected fashion, commercial and editorial work produced by Costa Rica Production Company.",
    heroEyebrow: "Our Work",
    heroTitle: "Selected productions",
    heroLede:
      "A look at recent fashion, commercial and editorial work produced across Costa Rica and the surrounding landscape.",
    introHeadline: "Campaigns shaped by light, place, and craft.",
    intro:
      "From coastal fashion stories to city editorials, our production work is built around locations that give each campaign a clear visual identity — and logistics that keep the day calm and considered.",
  },
  {
    _id: "locationsIndexPage",
    _type: "locationsIndexPage",
    metaTitle: "Locations — Costa Rica Production Company",
    metaDescription:
      "Explore curated shoot locations across Costa Rica: abandoned spaces, beaches, city streets, homes and hotels, rivers and waterfalls, and rural countryside.",
    heroEyebrow: "Locations",
    heroTitle: "Costa Rica is our backyard",
    bodyParagraphs: [
      "Looking to capture some amazing images in Costa Rica? Look no further! We're the go-to production company in the area, and we've got all the inside scoop to make your shoot unforgettable. If you want a place that instantly gets your creative brain buzzing, Costa Rica is one of those countries.",
      "It's honestly wild how much visual variety you get in such a small area. One minute you're shooting in rainforest canopy and misted ridgelines, the next you're surrounded by volcanic highlands, palm-lined coasts, and lived-in city streets. You barely have to move, but every frame looks completely different. The light here is a dream. Soft, golden, flattering — especially in the mornings and around sunset. If you love working with natural light, Costa Rica really shows up for you.",
      "We've got a knack for finding unique and quirky backdrops as well as breathtaking scenic spots. From hidden gems to iconic locations, we'll suggest the perfect locations to make your content pop!",
      "But that's not all — we'll take care of all the nitty-gritty details too. Permits? No problem. Accommodation? We've got you covered. Equipment? Ready to hire! We'll ensure your team has everything they need to focus on creating stunning work.",
      "And here's the best part: we'll let you in on the local secrets. So, let's make your shoot in Costa Rica absolutely unforgettable. Get in touch with us today and let's capture some magic together!",
    ],
  },
  {
    _id: "location-abandoned",
    _type: "location",
    title: "Abandoned",
    slug: slug("abandoned"),
    formLocationKey: "abandoned",
    sortOrder: 1,
    cardDescription:
      "Disused buildings, weathered interiors, and offbeat structures for editorial and fashion work.",
    metaTitle: "Abandoned — Costa Rica Production Company",
    metaDescription:
      "Disused buildings, weathered interiors, and offbeat structures for editorial and fashion work.",
    heroEyebrow: "Locations",
    heroTitle: "Abandoned",
    heroLede:
      "Disused buildings, weathered interiors, and offbeat structures for editorial and fashion work.",
    introText:
      "From empty houses to forgotten industrial corners, these spaces give campaigns a raw, cinematic edge. We know which sites are shoot-ready and how to get you in.",
    enquiryIntro: "Share a few details and one of the team will be in touch within 48 hours.",
  },
  {
    _id: "location-beaches",
    _type: "location",
    title: "Beaches",
    slug: slug("beaches"),
    formLocationKey: "beaches",
    sortOrder: 2,
    cardDescription: "Pacific and Caribbean coastline, from Tamarindo and Conchal to Manuel Antonio.",
    metaTitle: "Beaches — Costa Rica Production Company",
    metaDescription: "Pacific and Caribbean coastline, from Tamarindo and Conchal to Manuel Antonio.",
    heroEyebrow: "Locations",
    heroTitle: "Beaches",
    heroLede: "Pacific and Caribbean coastline, from Tamarindo and Conchal to Manuel Antonio.",
    introText:
      "Costa Rica's coasts shift fast: pale sand, black volcanic shore, jungle meeting the sea. We pick beaches for the light, the tide, and the look you need.",
    enquiryIntro: "Share a few details and one of the team will be in touch within 48 hours.",
  },
  {
    _id: "location-city-urban",
    _type: "location",
    title: "City Urban",
    slug: slug("city-urban"),
    formLocationKey: "city-urban",
    sortOrder: 3,
    cardDescription: "San Jose streets, markets, and lived-in neighbourhoods across the Central Valley.",
    metaTitle: "City Urban — Costa Rica Production Company",
    metaDescription: "San Jose streets, markets, and lived-in neighbourhoods across the Central Valley.",
    heroEyebrow: "Locations",
    heroTitle: "City Urban",
    heroLede: "San Jose streets, markets, and lived-in neighbourhoods across the Central Valley.",
    introText:
      "Colour, texture, and everyday life: Barrio Amon, markets, and city streets that read as fashion and commercial backdrops without looking staged.",
    enquiryIntro: "Share a few details and one of the team will be in touch within 48 hours.",
  },
  {
    _id: "location-homes-hotels",
    _type: "location",
    title: "Homes & Hotels",
    slug: slug("homes-hotels"),
    formLocationKey: "homes-hotels",
    sortOrder: 4,
    cardDescription: "Houses, lodges, and hotels, from jungle treehouses to boutique resorts.",
    metaTitle: "Homes & Hotels — Costa Rica Production Company",
    metaDescription: "Houses, lodges, and hotels, from jungle treehouses to boutique resorts.",
    heroEyebrow: "Locations",
    heroTitle: "Homes & Hotels",
    heroLede: "Houses, lodges, and hotels, from jungle treehouses to boutique resorts.",
    introText:
      "Interiors and grounds with a point of view: rainforest lodges, coastal houses, and hotels we can book, permit, and run as a full production base.",
    enquiryIntro: "Share a few details and one of the team will be in touch within 48 hours.",
  },
  {
    _id: "location-rivers-waterfalls",
    _type: "location",
    title: "Rivers & Waterfalls",
    slug: slug("rivers-waterfalls"),
    formLocationKey: "rivers-waterfalls",
    sortOrder: 5,
    cardDescription: "Rivers, waterfalls, and rainforest water: Rio Celeste, Pacuare, and beyond.",
    metaTitle: "Rivers & Waterfalls — Costa Rica Production Company",
    metaDescription: "Rivers, waterfalls, and rainforest water: Rio Celeste, Pacuare, and beyond.",
    heroEyebrow: "Locations",
    heroTitle: "Rivers & Waterfalls",
    heroLede: "Rivers, waterfalls, and rainforest water: Rio Celeste, Pacuare, and beyond.",
    introText:
      "Moving water, jungle canopy, and that particular Costa Rican green. These locations need local knowledge for access, timing, and weather. We handle it.",
    enquiryIntro: "Share a few details and one of the team will be in touch within 48 hours.",
  },
  {
    _id: "location-rural-countryside",
    _type: "location",
    title: "Rural Countryside",
    slug: slug("rural-countryside"),
    formLocationKey: "rural-countryside",
    sortOrder: 6,
    cardDescription: "Fincas, highland valleys, and open countryside across Costa Rica.",
    metaTitle: "Rural Countryside — Costa Rica Production Company",
    metaDescription: "Fincas, highland valleys, and open countryside across Costa Rica.",
    heroEyebrow: "Locations",
    heroTitle: "Rural Countryside",
    heroLede: "Fincas, highland valleys, and open countryside across Costa Rica.",
    introText:
      "Volcano views, working farms, and quiet rural roads. A different pace and a different palette, often only a short drive from the coast or the city.",
    enquiryIntro: "Share a few details and one of the team will be in touch within 48 hours.",
  },
  {
    _id: "team-myra",
    _type: "teamMember",
    name: "Myra Gonzalez",
    role: "Creative Producer, Casting Director, Co-founder",
    sortOrder: 1,
    email: "myra@costaricaproductioncompany.com",
    bio: "Based between London and Costa Rica, Myra brings over 20 years of extensive experience coordinating high-end fashion, commercial, and editorial photo shoots across international locations. Skilled in overseeing every stage of production, from concept development and location scouting to talent coordination, scheduling, logistics, and on-set management, ensuring each project runs seamlessly from start to finish. Myra has a strong background in casting and delivers projects on time and within budget. As an international shoot producer, she has worked with global brands and specialises in partnerships and strategic collaborations. Myra is passionate about storytelling through imagery and creating collaborative, efficient, and inspiring shoot experiences for brands, photographers, models, and creative teams worldwide, delivering visually compelling campaigns while managing budgets, client relationships, and fast-paced production environments with professionalism and precision.",
  },
  {
    _id: "team-didra",
    _type: "teamMember",
    name: "Didra Gonzalez",
    role: "Executive Producer, Co-founder",
    sortOrder: 2,
    email: "Didra@costaricaproductioncompany.com",
    bio: "With over 10 years of experience in the fashion industry, Didra specialises in fashion production, model scouting, event production, and fashion marketing. Her work is rooted in a deep understanding of both the creative and logistical sides of production, allowing her to bring concepts to life with precision and intention.",
  },
  {
    _id: "team-bella",
    _type: "teamMember",
    name: "Bella Lawrence Mills",
    role: "Art Director, Creative Producer",
    sortOrder: 3,
    email: "bella@costaricaproductioncompany.com",
    bio: "Bella Lawrence Mills is a freelance Art Director and Creative Producer based in London. A graduate of London College of Fashion, Bella combines expertise in art direction, creative production, and styling to create visually compelling and thoughtfully crafted brand stories. Her work is inspired by nature, feminine aesthetics, and bold, vibrant colour palettes, drawing influence from organic forms, seasonal landscapes, and the beauty found in everyday details. With a strong eye for composition, styling, and visual storytelling, Bella develops creative concepts and imagery that feel both distinctive and engaging, balancing artistic vision with commercial impact. Bella has extensive experience directing and producing shoots in Costa Rica and is considered a valuable asset and creative contributor to any team shooting in Costa Rica, especially ours.",
  },
  {
    _id: "team-jarl",
    _type: "teamMember",
    name: "Jarl Allard",
    role: "Production Assistant",
    sortOrder: 4,
    email: "jarl@costaricaproductioncompany.com",
    bio: "Jarl is a detail-driven photoshoot production assistant with a knack for smooth, on-set logistics and clear communication. From prop sourcing and last-minute problem solving, Jarl keeps shoots on schedule and teams aligned. Comfortable across studio and location settings, Jarl supports photographers and producers with calm efficiency, a collaborative spirit, and a sharp eye for continuity. When the pressure's on, Jarl is the steady hand that helps deliver clean, on-brief results.",
  },
  {
    _id: "team-kenny",
    _type: "teamMember",
    name: "Kenneth Martiatu",
    role: "Production Assistant",
    sortOrder: 5,
    email: "kenny@costaricaproductioncompany.com",
    bio: "Kenny is a dedicated and highly organised Production Assistant, supporting creative teams and ensuring photoshoots run smoothly from start to finish. With a proactive attitude, strong attention to detail, and excellent problem-solving skills, Kenny assists with all aspects of production, including logistics, equipment coordination, talent support, location preparation, transportation, and on-set operations. Kenny's reliability, professionalism, and ability to remain calm in fast-paced environments makes him a valuable member of any production team.",
  },
];

const obsoleteIds = [
  "location-lorem-valley",
  "location-ipsum-coast",
  "location-dolor-highlands",
  "location-amet-city",
  "location-consectetur-rainforest",
];

async function main() {
  const transaction = client.transaction();
  for (const doc of documents) {
    transaction.createOrReplace(doc);
  }
  for (const id of obsoleteIds) {
    transaction.delete(id);
    transaction.delete(`drafts.${id}`);
  }
  await transaction.commit();
  console.log(`Seeded ${documents.length} documents into ${projectId}/${dataset}.`);
  console.log("Next: npm run content:import-images, then open Studio and Publish.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

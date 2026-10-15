/**
 * One-time import of the site's hard-coded images into Sanity.
 *
 * Non-destructive: a field is only filled when it is still empty in Sanity, so
 * anything the client has already uploaded is left alone. Pass --force to
 * overwrite, or --dry to preview without writing.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const buildDir = join(rootDir, "build");
const assetsDir = join(buildDir, "assets");

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

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry");

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN in .env");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token,
  useCdn: false,
});

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const HASH_DUP = /-[a-f0-9]{32}\./i;

/** image: [relative path under build/, alt text] */
const img = (path, alt) => ({ path, alt });
/** gallery entry: [relative path, alt, optional caption] */
const gal = (path, alt, caption) => ({ path, alt, caption });

function altFromName(name) {
  return basename(name, extname(name)).replace(/\s+/g, " ").trim();
}

function folderImages(folder) {
  const dir = join(assetsDir, folder);
  return readdirSync(dir)
    .filter((name) => IMAGE_EXT.has(extname(name).toLowerCase()))
    .filter((name) => !HASH_DUP.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

function locationEntry(loc) {
  const names = folderImages(loc.folder);
  if (!names.length) throw new Error(`No images in assets/${loc.folder}`);
  const heroName = names.includes(loc.hero) ? loc.hero : names[0];
  const sideName = names.find((name) => name !== heroName) || heroName;
  return {
    id: `location-${loc.slug}`,
    label: `Location — ${loc.title}`,
    single: {
      heroImage: img(`assets/${loc.folder}/${heroName}`, loc.title),
      sideImage: img(`assets/${loc.folder}/${sideName}`, loc.title),
    },
    arrays: {
      gallery: {
        field: "image",
        items: names.map((name) => gal(`assets/${loc.folder}/${name}`, altFromName(name))),
      },
    },
  };
}

const locations = [
  { slug: "abandoned", title: "Abandoned", folder: "abandoned", hero: "ABANDONED1.png" },
  { slug: "beaches", title: "Beaches", folder: "Beaches", hero: "TAMARINDO1.png" },
  { slug: "city-urban", title: "City Urban", folder: "City_Urban", hero: "amon1.jpg" },
  { slug: "homes-hotels", title: "Homes & Hotels", folder: "location_homes_hotels", hero: "NAYARA1.png" },
  { slug: "rivers-waterfalls", title: "Rivers & Waterfalls", folder: "rivers_waterfalls", hero: "rio celeste.jpeg" },
  { slug: "rural-countryside", title: "Rural Countryside", folder: "rural_country", hero: "arenal.png" },
];

const workImages = folderImages("our_work");
const workHero = workImages.includes("HELLO FASHION.jpg") ? "HELLO FASHION.jpg" : workImages[0];

const plan = [
  {
    id: "homePage",
    label: "Home page",
    single: {
      aboutImage: img("assets/costa_rica_tree.png", "Costa Rica landscape illustration"),
    },
  },
  {
    id: "aboutPage",
    label: "About",
    single: {
      heroImage: img("team/team-hero.png", "Costa Rica Production Company founders in Costa Rica"),
    },
  },
  {
    id: "contactPage",
    label: "Contact",
    single: {
      heroImage: img("assets/HomePage/Homepage loop1.png", "Costa Rica location"),
    },
  },
  {
    id: "teamPage",
    label: "Meet the team",
    single: {
      heroImage: img(
        "team/meet-the-team-hero.png",
        "Costa Rica Production Company team collaborating in the studio"
      ),
    },
  },
  {
    id: "servicesPage",
    label: "Our services",
    single: {
      heroImage: img(
        "services/OUR_SERVICES_MAIN_PAGE_IMAGE.png",
        "Director reviewing a tablet on set with camera crew and production team"
      ),
      sideImage: img("services/Our-services-images.JPG", "Fashion swimwear shoot on the coast"),
    },
  },
  {
    id: "ourWorkPage",
    label: "Our work",
    single: {
      heroImage: img(`assets/our_work/${workHero}`, "Selected production work"),
    },
    arrays: {
      gallery: {
        field: "image",
        items: workImages.map((name) => gal(`assets/our_work/${name}`, altFromName(name))),
      },
    },
  },
  {
    id: "locationsIndexPage",
    label: "Locations index",
    single: {
      heroImage: img("assets/Beaches/MANUEL ANTONIO1.png", "Costa Rica landscape for location shoots"),
    },
  },
  ...locations.map(locationEntry),
  {
    id: "team-myra",
    label: "Team — Myra Gonzalez",
    single: { photo: img("team/MYRA-BIOIMAGE.png", "Myra Gonzalez") },
  },
  {
    id: "team-didra",
    label: "Team — Didra Gonzalez",
    single: { photo: img("team/Didra.png", "Didra Gonzalez") },
  },
  {
    id: "team-bella",
    label: "Team — Bella Lawrence Mills",
    single: { photo: img("team/Bella.png", "Bella Lawrence Mills") },
  },
  {
    id: "team-jarl",
    label: "Team — Jarl Allard",
    single: { photo: img("team/Jarl.png", "Jarl Allard") },
  },
  {
    id: "team-kenny",
    label: "Team — Kenneth Martiatu",
    single: { photo: img("team/Kenny.png", "Kenneth Martiatu") },
  },
];

function verifyFiles() {
  const missing = [];
  for (const entry of plan) {
    for (const image of Object.values(entry.single || {})) {
      if (!existsSync(join(buildDir, image.path))) missing.push(image.path);
    }
    for (const array of Object.values(entry.arrays || {})) {
      for (const item of array.items) {
        if (!existsSync(join(buildDir, item.path))) missing.push(item.path);
      }
    }
  }
  return missing;
}

const uploadCache = new Map();

async function uploadImage(relPath) {
  if (uploadCache.has(relPath)) return uploadCache.get(relPath);

  const absPath = join(buildDir, relPath);
  const promise = client.assets
    .upload("image", createReadStream(absPath), { filename: basename(relPath) })
    .then((asset) => asset._id);

  uploadCache.set(relPath, promise);
  return promise;
}

function imageValue(assetId, alt) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    ...(alt ? { alt } : {}),
  };
}

function keyFor(relPath, index) {
  const slug = relPath.replace(/[^a-zA-Z0-9]/g, "").slice(-24);
  return `imp${index}${slug}`;
}

async function run() {
  const missing = verifyFiles();
  if (missing.length) {
    console.error("Missing image files:\n" + missing.map((p) => `  - ${p}`).join("\n"));
    process.exit(1);
  }
  console.log("All referenced image files found.\n");

  const ids = plan.map((entry) => entry.id);
  const existing = await client.fetch(`*[_id in $ids]{ _id, ... }`, { ids });
  const byId = new Map(existing.map((doc) => [doc._id, doc]));

  const summary = [];

  for (const entry of plan) {
    const doc = byId.get(entry.id);
    if (!doc) {
      summary.push(`SKIP  ${entry.label} — document not found`);
      continue;
    }

    const patch = {};

    for (const [field, image] of Object.entries(entry.single || {})) {
      const current = doc[field];
      if (current && current.asset && !force) {
        summary.push(`keep  ${entry.label} → ${field} (already set)`);
        continue;
      }
      if (dryRun) {
        summary.push(`WOULD ${entry.label} → ${field} = ${image.path}`);
        continue;
      }
      const assetId = await uploadImage(image.path);
      patch[field] = imageValue(assetId, image.alt);
      summary.push(`SET   ${entry.label} → ${field} = ${basename(image.path)}`);
    }

    for (const [field, array] of Object.entries(entry.arrays || {})) {
      const current = doc[field];
      if (Array.isArray(current) && current.length && !force) {
        summary.push(`keep  ${entry.label} → ${field} (${current.length} items already)`);
        continue;
      }
      if (dryRun) {
        summary.push(`WOULD ${entry.label} → ${field} = ${array.items.length} images`);
        continue;
      }

      const values = [];
      for (const [index, item] of array.items.entries()) {
        const assetId = await uploadImage(item.path);
        values.push({
          _type: "object",
          _key: keyFor(item.path, index),
          [array.field]: imageValue(assetId),
          alt: item.alt || "",
          ...(item.caption ? { caption: item.caption } : {}),
        });
      }
      patch[field] = values;
      summary.push(`SET   ${entry.label} → ${field} = ${values.length} images`);
    }

    if (Object.keys(patch).length) {
      await client.patch(entry.id).set(patch).commit();
    }
  }

  console.log(summary.join("\n"));
  console.log(
    dryRun
      ? "\nDry run — nothing was written."
      : `\nDone. Uploaded ${uploadCache.size} unique image files.`
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

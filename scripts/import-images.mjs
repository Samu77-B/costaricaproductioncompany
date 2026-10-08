/**
 * One-time import of the site's hard-coded images into Sanity.
 *
 * Non-destructive: a field is only filled when it is still empty in Sanity, so
 * anything the client has already uploaded is left alone. Pass --force to
 * overwrite, or --dry to preview without writing.
 */
import { createClient } from "@sanity/client";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const buildDir = join(rootDir, "build");

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

/** image: [relative path under build/, alt text] */
const img = (path, alt) => ({ path, alt });
/** gallery entry: [relative path, alt, optional caption] */
const gal = (path, alt, caption) => ({ path, alt, caption });

const plan = [
  {
    id: "homePage",
    label: "Home page",
    single: {
      aboutImage: img("assets/HomePage/GPH-Tree.png", "Costa Rica landscape illustration"),
    },
    arrays: {
      heroSlides: {
        field: "image",
        items: [
          gal("assets/HomePage/home page main hero image.png", "Fashion shoot in Costa Rica"),
          gal("assets/HomePage/Homepage loop1.png", "Editorial production in Costa Rica"),
          gal("assets/HomePage/homepage loop image 2.png", "Beach fashion production"),
          gal("assets/HomePage/homepage loop image 3.png", "Commercial shoot in Costa Rica"),
          gal("assets/HomePage/homepage  Loop image 4.png", "Swimwear campaign on the coast"),
        ],
      },
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
    id: "locationsIndexPage",
    label: "Locations index",
    single: {
      heroImage: img("location/Locations-01.png", "Costa Rica landscape for location shoots"),
    },
  },
  {
    id: "location-lorem-valley",
    label: "Location — Lorem Valley",
    single: {
      heroImage: img(
        "location/lorem-valley/Moorish-Architecture-01.jpeg",
        "Lorem Valley placeholder"
      ),
      sideImage: img(
        "location/lorem-valley/Moorish-Architecture-02.jpg",
        "Lorem Valley placeholder"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/lorem-valley/Moorish-Architecture-03.jpg", "Lorem Valley placeholder 1"),
          gal("location/lorem-valley/Moorish-Architecture-04.jpg", "Lorem Valley placeholder 2"),
          gal("location/lorem-valley/Moorish-Architecture-05.jpg", "Lorem Valley placeholder 3"),
          gal("location/lorem-valley/Moorish-Architecture-06.jpg", "Lorem Valley placeholder 4"),
          gal("location/lorem-valley/Moorish-Architecture-07.jpg", "Lorem Valley placeholder 5"),
          gal("location/lorem-valley/Moorish-Architecture-08.jpeg", "Lorem Valley placeholder"),
          gal("location/lorem-valley/Moorish-Architecture-09.jpeg", "Lorem Valley placeholder"),
          gal("location/lorem-valley/Moorish-Architecture-10.jpeg", "Ipsum Coast placeholder"),
          gal("location/lorem-valley/Moorish-Architecture-11.jpeg", "Placeholder location"),
          gal("location/lorem-valley/Moorish-Architecture-12.jpeg", "Lorem Valley placeholder 10"),
          gal("location/lorem-valley/Moorish-Architecture-13.png", "Lorem Valley placeholder 11"),
        ],
      },
    },
  },
  {
    id: "location-ipsum-coast",
    label: "Location — Ipsum Coast",
    single: {
      heroImage: img(
        "location/ipsum-coast/Historic-and-Traditional-01.jpeg",
        "Ipsum Coast placeholder"
      ),
      sideImage: img(
        "location/ipsum-coast/Historic-and-Traditional-02.jpeg",
        "Ipsum Coast placeholder"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/ipsum-coast/Historic-and-Traditional-02.jpeg", "Ipsum Coast placeholder"),
          gal("location/ipsum-coast/Historic-and-Traditional-03.jpeg", "Ipsum Coast placeholder 2"),
          gal("location/ipsum-coast/Historic-and-Traditional-04.jpeg", "Ipsum Coast placeholder 3"),
          gal("location/ipsum-coast/Historic-and-Traditional-05.jpeg", "Ipsum Coast placeholder 4"),
          gal("location/ipsum-coast/Historic-and-Traditional-06.jpeg", "Ipsum Coast placeholder 5"),
          gal("location/ipsum-coast/Historic-and-Traditional-07.jpeg", "Placeholder location"),
          gal("location/ipsum-coast/Historic-and-Traditional-08.jpeg", "Ipsum Coast placeholder 7"),
          gal("location/ipsum-coast/Historic-and-Traditional-09.jpeg", "Ipsum Coast placeholder 8"),
          gal("location/ipsum-coast/Historic-and-Traditional-10.jpeg", "Historic courtyard"),
          gal("location/ipsum-coast/Historic-and-Traditional-11.jpeg", "Ipsum Coast placeholder 10"),
          gal("location/ipsum-coast/Historic-and-Traditional-12.jpeg", "Ipsum Coast placeholder 11"),
          gal("location/ipsum-coast/Historic-and-Traditional-13.jpeg", "San Miguel Alto vista"),
          gal("location/ipsum-coast/Historic-and-Traditional-14.jpeg", "Sacromonte caves"),
        ],
      },
    },
  },
  {
    id: "location-dolor-highlands",
    label: "Location — Dolor Highlands",
    single: {
      heroImage: img(
        "location/dolor-highlands/mediterranean-coastlines-01.png",
        "Mediterranean coastline shoot location"
      ),
      sideImage: img(
        "location/dolor-highlands/mediterranean-coastlines-02.jpeg",
        "Costa Tropical coastline"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/dolor-highlands/mediterranean-coastlines-03.jpg", "Costa Tropical shoreline"),
          gal("location/dolor-highlands/mediterranean-coastlines-04.jpg", "Mediterranean coast view"),
          gal("location/dolor-highlands/mediterranean-coastlines-02.jpeg", "Costa Tropical coastline"),
          gal("location/dolor-highlands/mediterranean-coastlines-05.jpeg", "Mediterranean coastal cliffs"),
          gal("location/dolor-highlands/mediterranean-coastlines-06.png", "Costa Tropical beach"),
          gal("location/dolor-highlands/mediterranean-coastlines-07.jpeg", "Mediterranean sea view"),
          gal("location/dolor-highlands/mediterranean-coastlines-08.jpeg", "Coastal landscape"),
          gal("location/dolor-highlands/mediterranean-coastlines-09.jpeg", "Mediterranean coastline"),
          gal("location/dolor-highlands/mediterranean-coastlines-10.jpeg", "Coastal vista"),
          gal("location/dolor-highlands/mediterranean-coastlines-11.jpeg", "Mediterranean shore"),
          gal("location/dolor-highlands/mediterranean-coastlines-12.png", "Coastal fashion location"),
          gal("location/dolor-highlands/mediterranean-coastlines-13.png", "Mediterranean location shoot"),
        ],
      },
    },
  },
  {
    id: "location-amet-city",
    label: "Location — Amet City",
    single: {
      heroImage: img(
        "location/amet-city/Granada-City-Center-01.jpeg",
        "Amet City placeholder"
      ),
      sideImage: img(
        "location/amet-city/Granada-City-Center-02.jpg",
        "Urban architectural setting"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/amet-city/Granada-City-Center-02.jpg", "City location 1"),
          gal("location/amet-city/Granada-City-Center-03.jpg", "City location 2"),
          gal("location/amet-city/Granada-City-Center-04.jpeg", "City location 3"),
          gal("location/amet-city/Granada-City-Center-05.jpeg", "City location 4"),
          gal("location/amet-city/Granada-City-Center-06.jpeg", "City location 5"),
        ],
      },
    },
  },
  {
    id: "location-consectetur-rainforest",
    label: "Location — Consectetur Rainforest",
    single: {
      heroImage: img("location/consectetur-rainforest/Alpine-and-Vistas-01.jpg", "Consectetur Rainforest placeholder"),
      sideImage: img("location/consectetur-rainforest/Alpine-and-Vistas-02.jpg", "Alpine location"),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/consectetur-rainforest/Alpine-and-Vistas-02.jpg", "Alpine location 1"),
          gal("location/consectetur-rainforest/Alpine-and-Vistas-03.jpg", "Alpine location 2"),
          gal("location/consectetur-rainforest/Alpine-and-Vistas-04.jpeg", "San Miguel Alto view"),
          gal("location/consectetur-rainforest/Alpine-and-Vistas-05.png", "Mirador San Miguel"),
          gal("location/consectetur-rainforest/Alpine-and-Vistas-06.jpeg", "Mirador Placeta de Carvajales"),
          gal("location/consectetur-rainforest/Alpine-and-Vistas-07.jpeg", "Mirador de San Nicolás"),
          gal("location/consectetur-rainforest/Alpine-and-Vistas-08.jpeg", "Sacromonte hillside vista"),
        ],
      },
    },
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

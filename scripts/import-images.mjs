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
      aboutImage: img("assets/HomePage/GPH-Tree.png", "Granada landscape illustration"),
    },
    arrays: {
      heroSlides: {
        field: "image",
        items: [
          gal("assets/HomePage/home page main hero image.png", "Fashion shoot in Granada"),
          gal("assets/HomePage/Homepage loop1.png", "Editorial production in Granada"),
          gal("assets/HomePage/homepage loop image 2.png", "Beach fashion production"),
          gal("assets/HomePage/homepage loop image 3.png", "Commercial shoot in Granada"),
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
        "Granada Production House team collaborating in the studio"
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
      heroImage: img("location/Locations-01.png", "Granada landscape for location shoots"),
    },
  },
  {
    id: "location-moorish-architecture",
    label: "Location — Moorish Architecture",
    single: {
      heroImage: img(
        "location/moorish-architecture/Moorish-Architecture-01.jpeg",
        "Moorish architecture in Granada"
      ),
      sideImage: img(
        "location/moorish-architecture/Moorish-Architecture-02.jpg",
        "Moorish architectural detail"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/moorish-architecture/Moorish-Architecture-03.jpg", "Alhambra exterior"),
          gal("location/moorish-architecture/Moorish-Architecture-04.jpg", "Alhambra courtyard"),
          gal("location/moorish-architecture/Moorish-Architecture-05.jpg", "Granada Moorish skyline"),
          gal("location/moorish-architecture/Moorish-Architecture-06.jpg", "Historic Granada view"),
          gal("location/moorish-architecture/Moorish-Architecture-07.jpg", "Spanish historic architecture"),
          gal("location/moorish-architecture/Moorish-Architecture-08.jpeg", "Moorish location detail"),
          gal("location/moorish-architecture/Moorish-Architecture-09.jpeg", "Moorish location detail"),
          gal("location/moorish-architecture/Moorish-Architecture-10.jpeg", "Carrera del Darro"),
          gal("location/moorish-architecture/Moorish-Architecture-11.jpeg", "Carmen de los Martires"),
          gal("location/moorish-architecture/Moorish-Architecture-12.jpeg", "Historic Granada location"),
          gal("location/moorish-architecture/Moorish-Architecture-13.png", "Moorish souk alleyway"),
        ],
      },
    },
  },
  {
    id: "location-historic-and-traditional",
    label: "Location — Historic and Traditional",
    single: {
      heroImage: img(
        "location/historic-and-traditional/Historic-and-Traditional-01.jpeg",
        "Historic and traditional locations in Granada"
      ),
      sideImage: img(
        "location/historic-and-traditional/Historic-and-Traditional-02.jpeg",
        "Carrera del Darro"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/historic-and-traditional/Historic-and-Traditional-02.jpeg", "Carrera del Darro"),
          gal("location/historic-and-traditional/Historic-and-Traditional-03.jpeg", "Carrera del Darro street"),
          gal("location/historic-and-traditional/Historic-and-Traditional-04.jpeg", "Carrera del Darro view"),
          gal("location/historic-and-traditional/Historic-and-Traditional-05.jpeg", "Historic Granada street"),
          gal("location/historic-and-traditional/Historic-and-Traditional-06.jpeg", "Carrera del Darro riverside"),
          gal("location/historic-and-traditional/Historic-and-Traditional-07.jpeg", "Carmen de los Martires"),
          gal("location/historic-and-traditional/Historic-and-Traditional-08.jpeg", "Historic Granada gardens"),
          gal("location/historic-and-traditional/Historic-and-Traditional-09.jpeg", "Traditional Granada location"),
          gal("location/historic-and-traditional/Historic-and-Traditional-10.jpeg", "Historic courtyard"),
          gal("location/historic-and-traditional/Historic-and-Traditional-11.jpeg", "Historic Granada detail"),
          gal("location/historic-and-traditional/Historic-and-Traditional-12.jpeg", "Granada vista"),
          gal("location/historic-and-traditional/Historic-and-Traditional-13.jpeg", "San Miguel Alto vista"),
          gal("location/historic-and-traditional/Historic-and-Traditional-14.jpeg", "Sacromonte caves"),
        ],
      },
    },
  },
  {
    id: "location-mediterranean-coastlines",
    label: "Location — Mediterranean Coastlines",
    single: {
      heroImage: img(
        "location/mediterranean-coastlines/mediterranean-coastlines-01.png",
        "Mediterranean coastline shoot location"
      ),
      sideImage: img(
        "location/mediterranean-coastlines/mediterranean-coastlines-02.jpeg",
        "Costa Tropical coastline"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/mediterranean-coastlines/mediterranean-coastlines-03.jpg", "Costa Tropical shoreline"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-04.jpg", "Mediterranean coast view"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-02.jpeg", "Costa Tropical coastline"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-05.jpeg", "Mediterranean coastal cliffs"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-06.png", "Costa Tropical beach"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-07.jpeg", "Mediterranean sea view"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-08.jpeg", "Coastal landscape"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-09.jpeg", "Mediterranean coastline"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-10.jpeg", "Coastal vista"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-11.jpeg", "Mediterranean shore"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-12.png", "Coastal fashion location"),
          gal("location/mediterranean-coastlines/mediterranean-coastlines-13.png", "Mediterranean location shoot"),
        ],
      },
    },
  },
  {
    id: "location-granada-city-center",
    label: "Location — Granada City Center",
    single: {
      heroImage: img(
        "location/granada-city-center/Granada-City-Center-01.jpeg",
        "Granada city centre architecture"
      ),
      sideImage: img(
        "location/granada-city-center/Granada-City-Center-02.jpg",
        "Urban architectural setting"
      ),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/granada-city-center/Granada-City-Center-02.jpg", "City location 1"),
          gal("location/granada-city-center/Granada-City-Center-03.jpg", "City location 2"),
          gal("location/granada-city-center/Granada-City-Center-04.jpeg", "City location 3"),
          gal("location/granada-city-center/Granada-City-Center-05.jpeg", "City location 4"),
          gal("location/granada-city-center/Granada-City-Center-06.jpeg", "City location 5"),
        ],
      },
    },
  },
  {
    id: "location-alpine-and-vistas",
    label: "Location — Alpine and Vistas",
    single: {
      heroImage: img("location/alpine-and-vistas/Alpine-and-Vistas-01.jpg", "Alpine landscape near Granada"),
      sideImage: img("location/alpine-and-vistas/Alpine-and-Vistas-02.jpg", "Alpine location"),
    },
    arrays: {
      gallery: {
        field: "image",
        items: [
          gal("location/alpine-and-vistas/Alpine-and-Vistas-02.jpg", "Alpine location 1"),
          gal("location/alpine-and-vistas/Alpine-and-Vistas-03.jpg", "Alpine location 2"),
          gal("location/alpine-and-vistas/Alpine-and-Vistas-04.jpeg", "San Miguel Alto view"),
          gal("location/alpine-and-vistas/Alpine-and-Vistas-05.png", "Mirador San Miguel"),
          gal("location/alpine-and-vistas/Alpine-and-Vistas-06.jpeg", "Mirador Placeta de Carvajales"),
          gal("location/alpine-and-vistas/Alpine-and-Vistas-07.jpeg", "Mirador de San Nicolás"),
          gal("location/alpine-and-vistas/Alpine-and-Vistas-08.jpeg", "Sacromonte hillside vista"),
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

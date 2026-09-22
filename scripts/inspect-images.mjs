/**
 * Read-only report of what each page currently has in Sanity. Useful for
 * checking what the client has uploaded before running an import, and for
 * spotting fields still holding placeholder copy.
 */
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

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const data = await client.fetch(`{
  "home": *[_type == "homePage"][0]{
    "heroSlides": count(heroSlides),
    "aboutImage": aboutImage.asset->originalFilename
  },
  "about": *[_type == "aboutPage"][0]{ "heroImage": heroImage.asset->originalFilename },
  "teamPage": *[_type == "teamPage"][0]{ "heroImage": heroImage.asset->originalFilename },
  "services": *[_type == "servicesPage"][0]{
    "heroImage": heroImage.asset->originalFilename,
    "sideImage": sideImage.asset->originalFilename
  },
  "ourWork": *[_type == "ourWorkPage"][0]{
    "heroImage": heroImage.asset->originalFilename,
    "gallery": count(gallery)
  },
  "locationsIndex": *[_type == "locationsIndexPage"][0]{
    "heroImage": heroImage.asset->originalFilename
  },
  "locations": *[_type == "location"]|order(sortOrder asc){
    title,
    heroLede,
    introText,
    "heroImage": heroImage.asset->originalFilename,
    "sideImage": sideImage.asset->originalFilename,
    "gallery": count(gallery)
  },
  "members": *[_type == "teamMember"]|order(sortOrder asc){
    name,
    "photo": photo.asset->originalFilename
  },
  "drafts": count(*[_id in path("drafts.**")])
}`);

const PLACEHOLDER = /lorem ipsum|dolor sit amet|coming soon/i;

function show(label, value) {
  console.log(`  ${label}: ${value === null || value === undefined ? "EMPTY" : value}`);
}

console.log("Images per page\n");
show("Home hero slides", data.home?.heroSlides);
show("Home about image", data.home?.aboutImage);
show("About hero", data.about?.heroImage);
show("Team page hero", data.teamPage?.heroImage);
show("Services hero", data.services?.heroImage);
show("Services side", data.services?.sideImage);
show("Our work hero", data.ourWork?.heroImage);
show("Our work gallery", data.ourWork?.gallery);
show("Locations index hero", data.locationsIndex?.heroImage);

console.log("\nTeam photos\n");
for (const member of data.members || []) show(member.name, member.photo);

console.log("\nLocations\n");
for (const loc of data.locations || []) {
  console.log(`  ${loc.title}`);
  show("  hero", loc.heroImage);
  show("  side", loc.sideImage);
  show("  gallery", loc.gallery);
}

const flagged = [];
for (const loc of data.locations || []) {
  for (const field of ["heroLede", "introText"]) {
    if (PLACEHOLDER.test(String(loc[field] || ""))) {
      flagged.push(`${loc.title} → ${field}`);
    }
  }
}

console.log(
  flagged.length
    ? `\nPlaceholder copy still in Sanity:\n${flagged.map((f) => `  - ${f}`).join("\n")}`
    : "\nNo placeholder copy found in location text."
);

if (data.drafts) {
  console.log(`\n${data.drafts} unpublished draft(s) — these are not live yet.`);
}

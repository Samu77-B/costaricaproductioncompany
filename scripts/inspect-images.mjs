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

const query = `{
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
    "heroImage": heroImage.asset->originalFilename,
    "sideImage": sideImage.asset->originalFilename,
    "gallery": count(gallery)
  },
  "members": *[_type == "teamMember"]|order(sortOrder asc){
    name,
    "photo": photo.asset->originalFilename
  },
  "drafts": count(*[_id in path("drafts.**")])
}`;

const data = await client.fetch(query);
console.log(JSON.stringify(data, null, 2));

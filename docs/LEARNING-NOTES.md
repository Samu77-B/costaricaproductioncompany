# Learning notes — Formspree swap, SEO, and how this site is wired

This file lives in `docs/` on purpose. The live site **does not serve it**:
`.htaccess` returns 404 for `/docs/`, and `robots.txt` also disallows it.
So it is in git for you, not for visitors or Google.

---

## How the site is put together

The public website is **static HTML** in `build/`. Hostinger deploys the whole repo, then `.htaccess` at the root rewrites `/contact/` → `build/contact/index.html`.

Three JavaScript files do most of the work:

| File | Job | Safe to edit when… |
|------|-----|--------------------|
| `build/js/cms.js` | Fetches Sanity content and rewrites text/images | Changing CMS behaviour |
| `build/js/forms.js` | Enquiry forms (now Formspree) | Changing forms |
| `build/js/main.js` | Nav, hero carousel, lightbox | Changing UI behaviour |
| `build/js/seo.js` | Canonical + Open Graph after load | Changing SEO tags |
| `build/js/components.js` | Injects header + footer | Changing nav/footer |
| `build/js/cms-config.js` | Sanity project ID | Never unless the project changes |

**`cms.js` was not changed in this work.** Forms and SEO sit beside it, not inside it. That is how you avoid breaking the CMS connection.

Sanity still wins for copy and pictures: after `cms.js` finishes it fires `gph:cms-updated`. `main.js` (lightbox thumbs) and `seo.js` (share titles) listen for that event. Forms do not need to, because they are not CMS fields.

---

## Cache-busting `?v=`

Browsers cache CSS and JS aggressively. When you change a file, bump the number on **every HTML page that loads it**:

```html
<link rel="stylesheet" href="/css/styles.css?v=36">
<script src="/js/forms.js?v=19"></script>
<script src="/js/seo.js?v=1"></script>
```

- Changed CSS → bump `styles.css?v=`
- Changed `forms.js` → bump `forms.js?v=`
- Did **not** change `cms.js` → leave `cms.js?v=4` alone

If you forget, you will think the site is broken when you are just looking at the old cached file.

Repeatable steps:
1. Edit the CSS or JS file.
2. Search the repo for the old `?v=` number.
3. Increase it on every match.
4. Commit + push (Hostinger then deploys).

---

## What we replaced (Cognito → Formspree)

### Why Cognito went

Cognito was an **iframe**. The form lived on Cognito's servers. We had to:
- load `iframe.js`
- poke CSS into the iframe
- call `Cognito.prefill()` for Location Type / Place Name
- live with their "powered by" branding on the free plan

Formspree is a normal HTML `<form>` that POSTs to:

`https://formspree.io/f/xvkzkdav`

No iframe, no branding, no extra JS from them.

### Files that changed for the form

| File | What happened |
|------|----------------|
| `build/js/forms.js` | Rewritten. Builds/binds a native form, POSTs with `fetch`, prefills location fields |
| `build/contact/index.html` | Empty `#gph-cognito-form` div replaced with a real `<form id="gph-contact-form">` |
| `build/css/styles.css` | Cognito iframe rules removed; `.contact-form` styles the real fields |
| `build/css/cognito-form.css` | Deleted |
| `build/css/cognito-form-location.css` | Deleted |
| Location HTML pages | Only the `forms.js?v=` number changed — they never had a Cognito embed in the page. The form appears inside the lightbox |

`build/js/main.js` was **not** changed. It still does:

```js
window.GPHForms.mountLightboxEnquiry(enquiryForm, { locationSlug, imageRef });
```

We kept that public API so the lightbox did not need a rewrite.

### How prefill works now (the important pattern)

Cognito: `cognito.prefill({ LocationType: "…", PlaceName: "…" })` into iframe fields.

Formspree: the fields **are on our page**, so we just set `.value`.

When you click a location photo:

1. `main.js` reads `img.dataset.imageRef` (set by `cms.js` from Sanity's original filename) or falls back to the file name in the `src`.
2. It calls `GPHForms.mountLightboxEnquiry`.
3. `forms.js` puts **Location Type** and **Place Name** into readonly inputs so they submit with the email.

Readonly, not `disabled` — disabled fields are **not** sent. Readonly fields are.

If the visitor clicks the next photo, we **update those two fields** instead of wiping the form. Name, email and message stay. Cognito used to remount the whole iframe, which lost what they had typed.

### How the submit works

```js
fetch("https://formspree.io/f/xvkzkdav", {
  method: "POST",
  headers: { Accept: "application/json" },
  body: new FormData(form),
});
```

`Accept: application/json` tells Formspree "don't redirect to a thank-you page, reply with JSON". That keeps people inside the lightbox.

The `_gotcha` field is a honeypot (hidden with CSS). Bots fill it, humans don't. Formspree drops those submissions.

If JavaScript fails, the form still works: it is a normal POST to Formspree (`action` + `method="POST"` on the contact page).

### First-time Formspree catch

The first submit from a new domain often emails **you** a confirmation link. Until you click it, the client will not receive enquiries. After deploy, send one test from `/contact/` and confirm it.

Multiple destination addresses: Formspree's free plan is one inbox. Forwarding from that inbox (Hostinger alias) is the free way to copy others in.

---

## SEO / OG check (what I treated as "AGO + SEO")

I read this as **SEO plus Open Graph / answer-engine basics** (canonical URLs, share cards, structured data). Here is what was already fine, and what we added.

### Already in good shape

- Unique `<title>` and `<meta name="description">` on every page
- One `<h1>` per page
- `robots.txt` + `sitemap.xml` listing all public URLs
- HTTPS + www forced in `.htaccess`
- Sanity can override title + description via `metaTitle` / `metaDescription` (`cms.js` → `setTitle` / `setMetaDescription`)
- `lang="en"` on `<html>`

### Added this round

| Change | Why |
|--------|-----|
| `<link rel="canonical">` on every page | Stops Google treating `/about` and `/about/` as two pages |
| `og:title`, `og:description`, `og:url`, `og:image` | WhatsApp / Instagram / Facebook share cards. Those crawlers often **do not run JavaScript**, so the tags have to sit in the HTML `<head>` |
| `build/js/seo.js` | After Sanity publishes a new title, this updates the OG tags too (`gph:cms-updated`) |
| JSON-LD `ProfessionalService` on the homepage | Helps Google / AI overviews understand *what* the business is |
| Sitemap `lastmod` bumped to 2026-10-08 | Hint that pages changed |

### Still worth doing later (not done now)

- **Google Search Console** — homepage HTML even has a comment waiting for the verification meta
- Homepage H1 is the about headline, not the brand name. Fine, but a clearer brand H1 would help
- "complexed creative concepts" on the homepage is a copy typo (`complex` / `complex`) — do not fix in Sanity without the client
- Per-page OG images (each location hero) — `seo.js` already swaps to the on-page hero once the page has loaded; the static HTML still uses the homepage hero as a fallback for share crawlers

### Pattern: keep SEO in HTML, let CMS override

Hard-coded tags in each `index.html` are the fallback (and what share crawlers see). `cms.js` overwrites `document.title` and the description meta. `seo.js` copies those into OG. Do not put form code in `cms.js`, and do not put Sanity queries in `forms.js`.

---

## Repeatable "I changed a page" checklist

1. Edit the HTML / CSS / JS under `build/`.
2. If you changed a shared JS/CSS file, bump `?v=`.
3. Preview locally (`npx serve build`) — Sanity may not load on a random localhost port (CORS). That is normal; the hard-coded HTML is the fallback.
4. Check live after push: `https://www.granadaproductionhouse.com` (that origin *is* in Sanity CORS).
5. For forms: submit a test, check the Formspree inbox.
6. Commit + push — Hostinger Git deploy does the rest.

---

## Git / deploy

```bash
git add -A
git status                 # glance: no .env
git commit -m "…"
git push
```

Do **not** commit `.env` (Sanity write token). `docs/` is fine to commit; it is just not public on the website.

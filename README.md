# Srinivas Bandi — Portfolio

A self-contained portfolio site: `index.html` + `style.css` + `script.js`, no build step.
Just open `index.html` in a browser, or upload the whole folder to any static host
(GitHub Pages, Netlify, Vercel, etc.).

## What to replace before publishing

1. **Photo** — swap `assets/profile-photo.svg` for a real photo. Easiest option: name your
   photo `profile-photo.jpg` (or `.png`), drop it in `assets/`, then in `index.html` change:
   ```html
   <img src="assets/profile-photo.svg" alt="Portrait of Srinivas Bandi">
   ```
   to
   ```html
   <img src="assets/profile-photo.jpg" alt="Portrait of Srinivas Bandi">
   ```

2. **Project images** — same idea for `assets/project-facetrace.svg`,
   `assets/project-asphalt.svg`, and `assets/project-ship.svg`. A screenshot of the actual
   FaceTrace UI, a sample crack-classification image, or a satellite-detection output image
   would each work well — square or 16:9 images look best.

3. **Contact links** — search `index.html` for these placeholders and fill in the real URLs:
   - `your.email@example.com` (appears twice)
   - `github.com/yourhandle` → your GitHub profile URL
   - the three `href="#"` links under Contact and the rail → LinkedIn, GitHub, portfolio/other work
   - the phone number is already filled in from your resume; remove it if you'd rather not list it publicly

4. **Resume download** — the "Download resume" button points to
   `assets/Srinivas_Bandi_Resume.pdf`. Add a PDF of your resume with that exact filename in
   `assets/`, or change the `href` to wherever you're hosting it.

## Private documents ("Documents" page)

There's a password-gated `documents.html` page, linked from the bottom of the side rail
(and the mobile nav) as "Documents 🔒". It's for anything you don't want on the public
portfolio — full transcripts, certificates, an unredacted resume, etc.

**Read this before you rely on it.** This site has no server or database — it's just
static files. The password screen is JavaScript checking a password *in the visitor's
own browser*; it is not a real access-control system. Concretely:

- If you publish this folder on a typical static host (GitHub Pages, Netlify, Vercel's
  default settings, etc.), every file in `assets/private/` is still a public URL. The
  login screen stops someone from finding the link by *browsing* the site, but it does
  **not** stop someone who already has or guesses the direct file URL from opening it,
  with or without the password.
- It's genuinely useful for keeping casual visitors, search engines, and people just
  clicking around your site from stumbling onto those files. It is **not** enough for
  anything you'd be upset about a stranger reading.

**If you actually need real privacy for these files**, pick one of these instead of (or
alongside) the gate:
- Put the real documents in Google Drive / Dropbox, shared only with specific people or
  "anyone with the link" if that's an acceptable risk, and link out to that from the
  gate instead of hosting the files here.
- Password-protect the PDFs themselves (PDF encryption) so the file needs a password to
  *open*, not just to find — this holds up even if the raw URL leaks. Ask me and I can
  encrypt specific PDFs for you.
- Host on something with real server-side auth (a Netlify/Vercel function, Cloudflare
  Access, HTTP basic auth at the host level) instead of a client-side check.

### Setting your own password

The demo password is `changeme` — change it before publishing:

1. Open `generate-hash.html` in your browser (works fully offline).
2. Type your real password, click **Generate hash**, and copy the long hex string.
3. Open `documents.js` and replace the `PASSWORD_HASH` value with what you copied.
4. Delete `generate-hash.html` from the live site once you're done (keep a local copy if
   you want to change the password again later).

### Adding your files

Drop your PDFs into `assets/private/` using the filenames already referenced in
`documents.html` (`resume-full.pdf`, `certificate-10th.pdf`, `pc-btech.pdf`, and so on —
see `assets/private/PUT_YOUR_FILES_HERE.txt` for the full list), or edit the `.doc-row`
blocks in `documents.html` to add, rename, or remove entries.

**Adding documents without editing code:** on the unlocked Documents page, open
**"+ Add a document"** near the bottom of the list, type a name and the file name you'll
use, and it adds a row immediately — there's no limit, add as many as you need, whenever
a new document comes up. This only creates the row/link; put the actual PDF in
`assets/private/` yourself with that exact file name. These rows are remembered in that
one browser via `localStorage`, so they won't show up for you on a different device or
for anyone else who unlocks the page — for something everyone should see, add it
directly to `documents.html` instead.

## Structure

```
portfolio/
├── index.html        → all page content/sections (public)
├── documents.html     → password-gated private documents page
├── documents.js       → password check logic (see Private documents section above)
├── generate-hash.html → offline utility to set your own password
├── robots.txt         → tells search engines to skip the private page/folder
├── style.css          → design system (colors, type, layout — see :root tokens at the top)
├── script.js          → background graphic, scroll-tracking nav, animated metric bars, theme toggle
├── assets/            → images (replace these)
│   └── private/       → your private documents go here
└── README.md
```

## Notes on the design

- Dark, monitor/lab-inspired theme, tying into the computer-vision and forensic-recognition
  work: near-black background, amber "signal" accent for data readouts, cyan for links/accents.
- `Fraunces` (serif, headings), `Work Sans` (body), `IBM Plex Mono` (data values only) — loaded
  from Google Fonts via the `<link>` tags in `<head>`. If you need it to work fully offline,
  download those font files and reference them locally instead.
- All copy lives directly in `index.html` — edit text in place, no templating.
- Metric percentages (accuracy, F1, mAP) are read from each `.metric` element's `data-pct`
  attribute and animate in once when scrolled into view.

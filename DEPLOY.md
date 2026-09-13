# Deploy 1Sources

This folder is the complete website. Nothing outside it is needed.
No build step — it is already static HTML.

---

## Option A — Vercel CLI (fastest)

From inside this folder:

```
npx vercel --prod
```

First run asks you to log in and name the project. That's it.

---

## Option B — GitHub + Vercel (auto-deploys on every future change)

From inside this folder:

```
git init && git add -A && git commit -m "1Sources website"
```

Create an empty repo at https://github.com/new (no README, no .gitignore),
then:

```
git remote add origin https://github.com/YOUR_USERNAME/1sources.git
git branch -M main
git push -u origin main
```

Then at https://vercel.com/new import that repo and press Deploy.

**Leave every build setting empty / default.** Framework = Other,
Build Command = empty, Output Directory = empty. `vercel.json` in this folder
already configures the redirects, caching and headers.

---

## Option C — any other host

Upload the contents of this folder to your web root. It is plain static
HTML/CSS/JS and works anywhere. `.htaccess` is included for Apache
(redirects + caching + security headers); `_redirects` is included for
Netlify/Cloudflare Pages.

---

## Point the domain at it

Do this only after you have opened the preview URL and checked it.
Your current WordPress site keeps serving until you change DNS, so there is
no downtime risk and no rush.

Vercel → Project → Settings → Domains → add `1sources.com` and
`www.1sources.com`, then set the DNS records it shows you at your registrar.

---

## Two things to do before driving traffic

1. **Connect the contact form.** It validates and confirms in the browser but
   does not send anywhere yet. Open `contact-us/index.html`, find
   `<form class="form" data-validate novalidate action="#" method="post">`
   and change `action="#"` to your form endpoint (Formspree, Basin, your CRM).

2. **Submit the sitemap** at https://1sources.com/sitemap.xml in Google Search
   Console, and re-verify the property for the new host.

---

## What's in here

```
index.html                    Home
about-us/  services/          + 4 service pages
contact-us/  blog/            + 1 article
terms-conditions/  privacy-policy/
404.html                      branded 404
assets/css  assets/js         one stylesheet, one script
assets/img                    optimised WebP + JPEG fallbacks
assets/brand  assets/icons    logo, favicons, PWA icons, OG card
sitemap.xml  robots.txt  llms.txt  site.webmanifest  favicon.ico
vercel.json                   redirects, caching, security headers
.htaccess  _redirects         equivalents for Apache / Netlify
```

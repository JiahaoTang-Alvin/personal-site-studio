# Personal Site Studio

A visual personal homepage studio for building a bio page, portfolio, link hub, and lightweight project showcase with Next.js.

No traditional database is required. The public page renders your site, `/admin` edits it, and production content is stored in Vercel Blob.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

English | [中文](README.md)

---

## What It Is

Personal Site Studio is an open-source template for personal brands, portfolios, creator link pages, and lightweight project homepages. It includes a password-protected visual admin editor, so you can update your homepage by arranging content cards instead of editing code every time.

Good for:

- Personal bio pages, portfolios, and link hubs
- Indie developers, designers, creators, students, and freelancers
- Personal websites that should deploy quickly and remain easy to maintain
- Audience-specific public versions of the same homepage

Not ideal for:

- Complex CMS products, multi-user admin systems, or role-based permissions
- Sites that need to store private data
- Pure GitHub Pages static hosting

## Core Features

- Public personal homepage with avatar, bio, tags, social links, contact entry, and portfolio cards.
- Password-protected admin at `/admin/login` and visual editor at `/admin`.
- Desktop and mobile layout editing with separate card sizes per device.
- Card-based content blocks for projects, links, images, text, status updates, videos, and social links.
- Full-width text blocks for section-style headings and notes; they are blocks, not containers.
- Shared content ordering so cards can sit above, below, or between text blocks.
- Image upload and crop workflow with fixed and custom crop ratios, stored in Vercel Blob.
- Project settings for admin naming, public title, description, URL, SEO, theme, and appearance.
- Multilingual and multi-version content snapshots.
- Hidden audience versions such as `/u1`, persisted for a limited number of homepage visits through HTTP-only cookies.
- JSON config import/export from the admin editor.
- No traditional database; production config is stored in Vercel Blob.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- dnd-kit
- Vercel Blob
- bcryptjs
- Zod
- Lucide React
- Sonner

## Quick Start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The public page works without Vercel Blob. When Blob is not configured, the site falls back to `lib/default-site-config.ts`.

To test admin login, saving, and uploads locally, configure the environment variables below.

## Environment Variables

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=
ADMIN_PASSWORD_HASH=
SESSION_SECRET=
```

Required in production:

- `BLOB_READ_WRITE_TOKEN`: Vercel Blob read/write token for saving config and uploaded images.
- `ADMIN_PASSWORD_HASH`: bcrypt hash for the admin password.
- `SESSION_SECRET`: random session-signing secret with at least 32 characters.

Generate the admin password hash:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash(process.argv[1], 12).then(console.log)" "your-password"
```

Put the command output into `ADMIN_PASSWORD_HASH`. When logging in to the admin page, use the original plain password, meaning `your-password` from the command above, not the generated hash.

Generate a session secret:

```bash
openssl rand -base64 48
```

Never expose `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD_HASH`, or `SESSION_SECRET` with a `NEXT_PUBLIC_` prefix. They must stay server-only. Only `NEXT_PUBLIC_SITE_URL` is safe to expose to the browser.

## Three Deployment Options

### Option 1: Ask An AI Agent To Deploy It

If you use Codex, Claude Code, Cursor, or another coding agent, copy this prompt and let the agent guide the deployment.

```text
Please help me deploy this project:

GitHub repository: https://github.com/JiahaoTang-Alvin/personal-site-studio
Goal: deploy an editable personal homepage to Vercel.

Please do the following:
1. Fork or clone this repository into my GitHub account and install dependencies.
2. Confirm this is a Next.js App Router app that needs the Vercel runtime. Do not convert it to a GitHub Pages static export.
3. Prepare a Vercel project and enable Vercel Blob.
4. Ask me for an admin login password. Do not write the plain password into code or README files.
5. Generate the admin password hash with this command, then set the output as the Vercel environment variable ADMIN_PASSWORD_HASH:
   node -e "const bcrypt=require('bcryptjs'); bcrypt.hash(process.argv[1], 12).then(console.log)" "the-admin-password-I-provide"
6. Generate SESSION_SECRET with this command and set it as a Vercel environment variable:
   openssl rand -base64 48
7. Set these Vercel environment variables:
   NEXT_PUBLIC_SITE_URL=https://my-domain-or-vercel-domain
   BLOB_READ_WRITE_TOKEN=the Vercel Blob read/write token
   ADMIN_PASSWORD_HASH=the bcrypt hash generated above
   SESSION_SECRET=the random secret generated above
8. Deploy to Vercel.
9. After deployment, open /admin/login and confirm I can log in with the original plain password. Important: the login password is the original password, not ADMIN_PASSWORD_HASH.
10. After login, open Project Settings, fill in the site title, description, URL, SEO fields, versions, and languages, then save once to write the production config to Vercel Blob.

Before making changes, tell me which steps need my manual authorization, such as GitHub, Vercel login, or Blob creation.
```

This path is useful if you do not want to manually wire GitHub, Vercel, and environment variables. You still own the original admin password; the project stores only the bcrypt hash.

### Option 2: Deploy Directly To Vercel

1. Fork or copy this repository into your GitHub account.
2. Create a new Vercel project and choose that GitHub repository.
3. Enable Vercel Blob for the project.
4. Generate the admin password hash:

   ```bash
   node -e "const bcrypt=require('bcryptjs'); bcrypt.hash(process.argv[1], 12).then(console.log)" "your-password"
   ```

5. Generate the session secret:

   ```bash
   openssl rand -base64 48
   ```

6. In Vercel Project Settings -> Environment Variables, add:

   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-read-write-token
   ADMIN_PASSWORD_HASH=the-bcrypt-hash-output
   SESSION_SECRET=the-random-secret-output
   ```

7. Deploy the project.
8. Open `https://your-domain.com/admin/login` and log in with `your-password`. Do not enter the hash.
9. In the admin editor, open Project Settings and set the project name, public title, description, URL, SEO fields, versions, and languages.
10. Save once to persist the production config to Vercel Blob.

### Option 3: Publish To GitHub Manually, Then Connect Vercel

If you already have a local copy, create a GitHub repository and push the source:

```bash
git init
git add .
git commit -m "Initial personal site studio"
git branch -M main
git remote add origin https://github.com/your-name/your-repo.git
git push -u origin main
```

Then import that GitHub repository into Vercel and follow Option 2 to configure Blob and environment variables.

Important: the full app does not support pure GitHub Pages / static HTML hosting. It uses dynamic Next.js routes, cookies, admin API routes, login sessions, and Vercel Blob writes. GitHub is a good place to host the source code; Vercel remains the recommended runtime host.

## Routes

- `/`: public personal homepage
- `/admin/login`: admin login
- `/admin`: visual admin editor
- `/api/admin/config`: authenticated config read/write
- `/api/admin/upload`: authenticated image upload
- `/[accessCode]`: hidden version entry, such as `/u1`

## Data Model

The site is driven by one validated `SiteConfig` object:

- `profile`: avatar, name, bio, tags, social links, and profile module visibility.
- `sections`: legacy compatibility field; the current editor keeps it empty.
- `blocks`: project, link, image, text, social, video, and status cards, plus full-width `section` text blocks.
- `theme`: colors, radius, shadow, and font settings.
- `settings`: project name, public title, description, URL, SEO, languages, variants, and feature toggles.
- `contentVariants`: optional version/locale content snapshots keyed as `variantId:locale`.

Production config is saved to Vercel Blob at:

```text
config/site-config.json
```

Uploaded images are saved under:

```text
images/avatar
images/blocks
images/gallery
images/qrcode
```

Blob-hosted config and uploaded images are public-readable. Do not store secrets, private notes, unpublished credentials, or sensitive personal data in the config.

## Config Import And Export

The admin Project Settings panel can export the full `SiteConfig` as JSON. Importing JSON replaces only the current editor draft; click Save after reviewing it to write the imported config to Vercel Blob.

Use exports for backups, deployment migration, local-to-production handoff, or reusing a site structure across multiple deployments.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

## Documentation

- [Admin editor notes](docs/admin-editor-notes.md)
- [Project background for AI agents](docs/project-background.md)
- [Security and deployment notes](docs/security-and-deployment.md)

## Design Principles

- Content first: the first screen should show identity and featured work directly.
- Visual maintenance: routine content updates should happen in the admin editor, not through code edits.
- Small and reshapeable: the template stays lightweight so it can adapt to a personal brand.
- Public read, admin write: public pages do not write data; all saves and uploads require an authenticated admin session.
- Clear public-config boundary: Vercel Blob is for public display content, not secrets.

## Template Status

This is a usable template that is still evolving. The current focus is personal homepage content, portfolio cards, visual editing, multilingual/multi-version snapshots, and Vercel Blob persistence. Migration tooling, revision history, login rate limiting, and more complex permission systems are not built in yet.


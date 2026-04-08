# Deploy Frontend To Vercel

## 1) Push project to GitHub
- Create a repository.
- Push this project to `main` (or another branch).

## 2) Import in Vercel
- Open Vercel: `https://vercel.com/new`
- Choose `Import Git Repository`
- Select your project.

## 3) Build settings
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 4) Environment variables
- Add `VITE_API_BASE_URL` in Vercel Project Settings.
- Value for current backend: `https://kpfl.onrender.com`

Why this matters:
- The admin frontend uses `/admin/*` as browser routes.
- The backend also exposes `/admin/*` and `/auth/*` API paths.
- On Vercel, relative fetches like `/auth/login` would hit your Vercel deployment instead of Render, so the frontend must use the backend origin explicitly.

## 5) Deploy
- Click `Deploy`.
- After deploy, open:
  - `https://<your-project>.vercel.app/admin/login`

## 6) Backend/CORS check (important)
- On Render backend, allow CORS for your Vercel domain:
  - `https://<your-project>.vercel.app`

## 7) Admin credentials (current seed)
- Email: `admin@kpfl.local`
- Password: `admin`

## Notes
- `vercel.json` is already added for SPA rewrite:
  - Any route (including `/admin/*`) is rewritten to `index.html`.

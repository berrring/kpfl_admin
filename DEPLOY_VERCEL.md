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

## 4) Deploy
- Click `Deploy`.
- After deploy, open:
  - `https://<your-project>.vercel.app/admin/login`

## 5) Backend/CORS check (important)
- Backend base URL is already used in frontend: `https://kpfl.onrender.com`
- On Render backend, allow CORS for your Vercel domain:
  - `https://<your-project>.vercel.app`

## 6) Admin credentials (current seed)
- Email: `admin@kpfl.local`
- Password: `admin`

## Notes
- `vercel.json` is already added for SPA rewrite:
  - Any route (including `/admin/*`) is rewritten to `index.html`.

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
- Optional: add `VITE_API_BASE_URL` in Vercel Project Settings only if you need to override the default.
- Default project value is already `'/backend'`.

Why this matters:
- The admin frontend uses `/admin/*` as browser routes.
- The backend also exposes `/admin/*` and `/auth/*` API paths.
- The project now calls `/backend/*` on the same origin.
- Vercel rewrites `/backend/*` to `https://kpfl.onrender.com/*`, so browser CORS does not block admin requests.

## Local run
- `npm run dev` proxies `/backend/*` to Render.
- `npm run preview` now does the same, so local production preview can also reach the backend.
- If you open `dist/index.html` directly or serve `dist` from a plain static server without a `/backend` rewrite, API calls will fail.

## 5) Deploy
- Click `Deploy`.
- After deploy, open:
  - `https://<your-project>.vercel.app/admin/login`

## 6) Backend/CORS check
- Not required for the admin frontend when using the built-in `/backend/*` Vercel proxy.
- If you bypass the proxy and call Render directly from the browser, then Render must allow your frontend origin in CORS.

## 7) Admin credentials (current seed)
- Email: `admin@kpfl.local`
- Password: `admin`

## Notes
- `vercel.json` is already added for SPA rewrite:
  - Any route (including `/admin/*`) is rewritten to `index.html`.

# Deployment & Customization Guide

## 🚀 Running Locally

This project is built with **TanStack Start**, **React 19**, **Vite**, and **Tailwind CSS v4**.

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Create production build
npm run build

# Preview production build locally
npm run preview
```

---

## 🎨 Centralized Portfolio Content

You do **not** need to edit individual components. All your personal data, links, projects, and skills are centralized in:

📂 [`src/data/portfolio.ts`](src/data/portfolio.ts)

### Quick Settings in `src/data/portfolio.ts`:

- **Personal Details**: Name, tagline, description, location, status.
- **Photo**: Place your photo at `/public/images/ujwal.jpg` or adjust `src/assets/ujwal.jpg.asset.json`.
- **Social Links**: Update your LinkedIn, LeetCode, HackerRank, Instagram, and Discord URLs.
- **Projects**: Edit `projects` array with your real project titles, descriptions, tech tags, GitHub links, and live demo URLs.
- **Skills**: Add or adjust your skills under `Frontend`, `Backend`, `Database`, `Tools`, and `Exploring`.
- **Resume**: Drop your resume PDF into `/public/resume.pdf` and set `resumeUrl: "/resume.pdf"` in `personal`.

---

## 🌐 Deploying to Vercel (Step-by-Step)

### Step 1: Push your code to GitHub

Open your terminal or PowerShell and run the following commands:

```bash
# If you are inside the project folder:
git init
git add .
git commit -m "feat: portfolio updates, monochrome theme, live stats, and resume manager"
git branch -M main
git remote add origin https://github.com/vennu-ujwal-kumar/YOUR_REPO_NAME.git
git push -u origin main
```

*(If you push from the outer workspace folder, set the Vercel **Root Directory** to `ujwal-future-forge-main` during import)*.

---

### Step 2: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New..."** → **"Project"**.
2. Select and import your GitHub repository.
3. In the **Configure Project** screen:
   - **Framework Preset**: Select **Vite** or **Other**.
   - **Root Directory**: If your repo contains `ujwal-future-forge-main/`, click **Edit** and set it to `ujwal-future-forge-main`. If you pushed directly from inside that folder, leave it as `./`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `.output/public`
4. Click **Deploy**. Vercel will build and deploy your site in ~1 minute.

---

## 🔄 Will Live GitHub Stats & Projects Still Sync Automatically on Vercel?

**YES, 100% automatically!**

Here is why:
- GitHub statistics (public repos, stars, followers) and projects are fetched **client-side directly in the visitor's browser** via GitHub's public REST API (`https://api.github.com/users/vennu-ujwal-kumar/repos`).
- Every time a recruiter or visitor visits your Vercel URL, their browser queries the GitHub API directly.
- Whenever you push a new public project to GitHub or add a Vercel demo link to its description, it will **instantly appear in your portfolio without redeploying or touching any code**!

---

## 🔒 Private Admin Manager (Resume & Photo)

Only **you** can access and update your resume and profile photo anytime right from the live site:

1. **How to open**:
   - **Hero Portrait**: Hover over your photo in the Hero section and click the camera icon.
   - **Keyboard Shortcut**: Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> (or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd>) on any page.
   - **Interactive Terminal**: Type `photo`, `resume`, or `admin` in the terminal and press Enter.
   - **Footer Link**: Click the subtle `🔒 Admin Manager (Resume & Photo)` button at the bottom of the page.
2. **Security PIN**: Enter `2026` (you can customize this in `src/components/AdminPortal.tsx`).
3. **Updating Your Profile Photo**:
   - **Direct Image Upload**: Select any image (JPG, PNG, WebP). It is automatically optimized in-browser via canvas compression for ultra-fast loading.
   - **Cloud Image URL**: Paste a link from Google Drive, Imgur, Cloudinary, etc. Google Drive links are automatically converted to direct image previews.
   - **Reset Anytime**: Click "Reset Default" to revert back to `ujwal.jpg`.
   - **Git Fallback**: You can also replace `public/images/ujwal.jpg` directly in your repository.
4. **Updating Your Resume**:
   - **Cloud Link (Recommended for Vercel)**: Paste a Google Drive, Dropbox, or public cloud link to your resume PDF. Any Google Drive link will automatically be formatted into a direct view link. Whenever you update your resume on Google Drive, visitors will automatically get the latest version!
   - **Direct PDF Upload**: Choose a local `.pdf` file to store directly in the browser.
   - **Static File**: Drop `resume.pdf` into `/public/resume.pdf` in your repository.
5. **Live Synchronization**: Once a resume is set, the **"Resume"** button in your Navbar instantly becomes active for visitors to download or view.

---

## ⚡ Features Included

- **Dark-First Modern Aesthetics**: OKLCH color system, glassmorphism, dynamic glow effects.
- **Interactive Developer Terminal**: Typing animations, built-in commands (`whoami`, `role`, `skills`, `projects`, `sudo hire ujwal` Easter egg).
- **Constellation Graph**: Interactive visual topology showing the connection between frontend, backend, AI, and developer tooling.
- **Command Palette (`Ctrl + K` / `Cmd + K`)**: Quick keyboard navigation across sections and theme toggling.
- **Theme Switching**: Dark / Light mode toggle with smooth transitions and persistent state.
- **Project Showcase**: Expandable project details dialog with architecture, problem, and solution breakdowns.
- **Live GitHub Integration**: Dynamically loads public repositories, stars, and follower stats with static fallback.
- **SEO & Structured Data**: Built-in JSON-LD schema, Open Graph tags, and Twitter Cards.

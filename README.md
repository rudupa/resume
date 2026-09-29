# resume

Static résumé site for Ritesh Udupa. Plain HTML/CSS, no build step, no framework — appropriate for a single-page site.

## Local preview

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploying to GitHub Pages

This repo has no GitHub Actions workflow on purpose — a static page doesn't need one. Enable Pages once, and every push to `main` deploys automatically:

1. GitHub repo → **Settings → Pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)` → **Save**
4. Site will be live at `https://rudupa.github.io/resume/` within a minute or two

## Updating content

Edit `index.html` directly — the résumé content mirrors the PDF resume, reorganized into sections (Summary, Core Competencies, Experience, Education, Certifications). Styling lives in `assets/style.css`.

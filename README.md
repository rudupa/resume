# resume

Static résumé site for Ritesh Udupa. Plain HTML/CSS/JS, no build step, no framework — dark-mode-first with an electric-blue accent, Inter typeface, and a few small interactive touches (theme toggle, scroll reveal, project-card tilt).

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

## Structure

```
index.html
assets/css/style.css   # design tokens, layout, animations
assets/js/theme.js     # theme toggle, smooth scroll, scroll-reveal, card tilt
assets/img/            # avatar placeholder (SVG)
```

## Updating content

Edit `index.html` directly — sections are Hero, About, Skills, Experience, Projects, Education, Contact.

Two project cards, both drawn from the résumé: radar architecture and VLA/VLM safety layers.

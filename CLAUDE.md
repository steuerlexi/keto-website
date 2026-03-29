# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **KetoGuide**, a static HTML website about the ketogenic diet (ketogene Ernährung) in German. It provides guides, recipes, health information, and educational content.

## Architecture

This is a **static HTML website** with no build process, no package manager, and no framework.

### Directory Structure

```
/
├── index.html              # Homepage (German) - Apple-style design
├── assets/
│   ├── css/
│   │   └── base.css        # All styles - Apple-inspired design system
│   └── js/
│       └── main.js         # Mobile menu, smooth scroll, FAQ accordion, back-to-top, scroll animations
└── pages/
    ├── guides/             # How-to guides (starten.html, tracking.html, sport.html)
    ├── recipes/            # Recipe categories and individual recipes
    │   ├── *.html          # Category pages (fruehstueck.html, mittagessen.html, desserts.html, vegetarisch.html, snacks.html, abendessen.html, brot-gebaeck.html, feiertage.html, getraenke.html, mealprep.html)
    │   └── details/        # Individual recipe pages (avocado-ei-teller.html, keto-cheesecake.html, zoodle-lachs.html)
    ├── health/             # Health topics (gewicht.html, gehirn.html, herz.html, diabetes.html, entzuendung.html, hormone.html, schlaf.html)
    ├── supplements/        # Supplement guides (mct-oil.html, elektrolyte.html)
    ├── lifestyle/          # Lifestyle content (reisen.html)
    ├── topics/             # Various topics (alkohol.html, kaffee.html, suesstoffer.html, darm.html, alter.html, athletic-performance.html, psychische-gesundheit.html, schilddruese.html, sporternaehrung.html)
    └── ketopedia/          # Educational articles (001-was-ist-keto.html, 002-keto-flu.html)
```

### Asset Path Conventions

The most common error when adding pages is incorrect asset paths:

| Page Location | CSS Path | Root Index Link |
|--------------|----------|-----------------|
| `/index.html` | `assets/css/base.css` | `index.html` |
| `/pages/recipes/*.html` | `../../assets/css/base.css` | `../../index.html` |
| `/pages/recipes/details/*.html` | `../../../assets/css/base.css` | `../../../index.html` |
| `/pages/health/*.html` | `../../assets/css/base.css` | `../../index.html` |
| `/pages/guides/*.html` | `../../assets/css/base.css` | `../../index.html` |
| `/pages/topics/*.html` | `../../assets/css/base.css` | `../../index.html` |

### Design System - Apple Style

The site uses an **Apple-inspired design** defined in `assets/css/base.css`:

- **CSS Variables** in `:root` for colors, spacing, shadows, and typography
- **Color scheme**: Clean whites (`--apple-white: #ffffff`), soft grays (`--apple-gray-100: #f5f5f7`), blue accent (`--apple-blue: #0071e3`)
- **Typography**: SF Pro Display/Text fonts via system fonts (no external font loading)
- **Components**:
  - Cards (`.card`, `.recipe-card`)
  - Buttons (`.btn-primary`, `.btn-secondary`, `.btn-outline`)
  - Bento Grid (`.bento-grid`, `.bento-item`)
  - Recipe cards with meta info
- **Grid system**: `.grid-2`, `.grid-3`, `.grid-4` using CSS Grid
- **Responsive**: Mobile breakpoints at 1024px, 768px, and 480px

### Page Template Pattern

All pages follow this structure:

1. **Header**: Fixed navigation with glassmorphism effect (`.header` with `backdrop-filter`)
2. **Hero section**: `.page-header` with large typography, centered text
3. **Content sections**: `.content-section` with `.container` or `.container-narrow`
4. **Cards**: `.card` or `.recipe-card` with hover effects
5. **Footer**: `.footer` with navigation links

**Important**: Pages in subdirectories reference assets with `../../` paths (e.g., `../../assets/css/base.css`). Recipe detail pages in `pages/recipes/details/` use `../../../assets/css/base.css`.

### Navigation Structure

All pages have consistent navigation:
- Logo links to `index.html` (or `../../index.html` from subdirectories)
- Nav links: Warum Keto, Rezepte, Guides, Gesundheit, FAQ
- Active state indicated with `.active` class
- Mobile menu with hamburger icon
- Dropdown menus for Rezepte, Guides, and Gesundheit sections

### JavaScript Functionality

`assets/js/main.js` provides:

- Mobile menu toggle (`.mobile-menu-btn` + `.nav-menu`)
- Smooth scrolling for anchor links (`a[href^="#"]`)
- Active nav link highlighting based on scroll position
- FAQ accordion (`.faq-question` click toggles `.faq-answer`)
- Dynamic back-to-top button (`.back-to-top`)
- Scroll-triggered animations (IntersectionObserver for `.scroll-animate`)
- Header scroll effect (`.header-scrolled`)

## Development Workflow

### No Build Process

This is a static site - no npm, no build step, no compilation. Edit HTML/CSS/JS files directly.

### Local Development

Serve the site locally with any static file server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (if npx available)
npx serve .

# PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in a browser.

### Adding New Pages

**For category pages** (e.g., `/pages/recipes/fruehstueck.html`):
1. Create HTML file in appropriate `/pages/` subdirectory
2. Copy header/nav structure from existing page (use `../../` for assets)
3. Use `.page-header` for page title section
4. Use `.content-section` with `.container-narrow` for content
5. Link from index.html or relevant section pages
6. Add footer with navigation links

**For recipe detail pages** (in `/pages/recipes/details/`):
1. Use `../../../` for asset paths (three levels deep)
2. Include custom styles for `.recipe-detail`, `.recipe-section`, `.ingredients-list`, and `.instructions-list`
3. Link back to appropriate category page

### Content Guidelines

- **Language**: German (de)
- **Content focus**: Evidence-based keto information, recipes, health benefits
- **Tone**: Informative, encouraging, scientifically grounded
- **Medical disclaimer**: Include disclaimer that content is informational, not medical advice

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage with bento grid layout |
| `assets/css/base.css` | Complete Apple-style design system |
| `assets/js/main.js` | All interactive functionality |
| `pages/guides/starten.html` | Primary beginner guide |
| `pages/recipes/*.html` | Recipe category pages with recipe cards |
| `pages/recipes/details/*.html` | Individual recipe detail pages |
| `pages/health/*.html` | Health benefit articles |
| `pages/supplements/*.html` | Supplement guides |
| `pages/topics/*.html` | Special topics (alkohol, kaffee, etc.) |
| `pages/ketopedia/*.html` | Educational articles |

## Design Patterns

### Recipe Card
```html
<div class="recipe-card">
    <div class="recipe-image">🍳</div>
    <div class="recipe-content">
        <h3>Recipe Name</h3>
        <div class="recipe-meta">
            <span>⏱️ 15 Min</span>
            <span>🔥 450 kcal</span>
            <span>🥑 2g Netto-KH</span>
        </div>
        <p>Description...</p>
        <a href="details/recipe-name.html" class="btn-secondary">Zum Rezept</a>
    </div>
</div>
```

### Bento Grid Item
```html
<div class="bento-item">
    <div class="bento-content">
        <div class="bento-icon">🔥</div>
        <h3>Title</h3>
        <p>Description...</p>
    </div>
</div>
```

### FAQ Item
```html
<div class="faq-item">
    <div class="faq-question">
        <h3>Question?</h3>
        <span class="faq-toggle">+</span>
    </div>
    <div class="faq-answer">
        <p>Answer...</p>
    </div>
</div>
```

### Recipe Detail Page Structure
Recipe detail pages in `pages/recipes/details/` include inline styles for:
- `.recipe-detail` - container with max-width 800px
- `.recipe-section` - content sections with h3 headings
- `.ingredients-list` - checklist-style ingredient items with ✓ marker
- `.instructions-list` - numbered step-by-step instructions with circular step numbers
- `.recipe-meta-bar` - nutrition info bar at top

## Common Tasks

### Link to a new recipe detail page from a category page
```html
<a href="details/new-recipe.html" class="recipe-card-link">
    <div class="recipe-card">...</div>
</a>
```

### Add navigation link to a new section
Update the dropdown menu in all pages that contain the navigation:
- Root `index.html` - links to `pages/section/page.html`
- `/pages/*/*.html` - links to `../section/page.html`
- `/pages/recipes/details/*.html` - links to `../../section/page.html`

### Add a new CSS component style
Add to `assets/css/base.css` in the appropriate section (components, utilities, etc.). The file is organized with clear comment headers.

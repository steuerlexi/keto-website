# KetoGuide - Premium Keto Recipe & Guide Platform

A modern, static HTML website for ketogenic diet content with premium membership system.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Authentication System](#authentication-system)
- [Content Gating](#content-gating)
- [Admin Interface](#admin-interface)
- [Deployment](#deployment)
- [Local Development](#local-development)
- [File Conventions](#file-conventions)
- [Design System](#design-system)
- [Security](#security)

---

## Overview

**KetoGuide** is a premium content platform for ketogenic diet information, recipes, and health guides. The website uses a freemium model where basic content is free, but premium recipes and guides require a subscription.

**Language:** German (de)

**Type:** Static HTML/CSS/JavaScript (no build process, no framework)

---

## Features

### Public Features
- 🏠 Landing page with premium teaser
- 🔐 User registration and login
- 🔑 Password reset functionality
- 📱 Fully responsive design (Apple-inspired)
- ⚡ Fast loading with minimal JavaScript

### Premium Features (Members Only)
- 🍳 621+ exclusive keto recipes
- 📚 Scientific health guides
- 📊 Personal dashboard with stats
- 📅 Meal planner access
- 💬 Priority support
- 🎥 Video tutorials

### Admin Features
- 👥 User management (view, edit, delete)
- ⭐ Premium status management
- 📊 Revenue analytics (MRR, monthly, yearly)
- 📥 CSV user export

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        KetoGuide Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│  │   Landing    │     │     Auth     │     │    Admin     │   │
│  │    Page      │     │    Pages     │     │    Pages     │   │
│  │   (Public)   │     │   (Public)   │     │  (Protected) │   │
│  └──────────────┘     └──────────────┘     └──────────────┘   │
│         │                    │                    │             │
│         └────────────────────┼────────────────────┘             │
│                              │                                  │
│                     ┌────────▼────────┐                         │
│                     │  auth-check.js  │                         │
│                     │  (Early Guard)  │                         │
│                     └────────┬────────┘                         │
│                              │                                  │
│         ┌────────────────────┼────────────────────┐             │
│         │                    │                    │             │
│  ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐       │
│  │   Free      │     │   Premium   │     │   Members   │       │
│  │  Content    │     │   Content   │     │   Area      │       │
│  │             │     │  (Gated)    │     │ (Protected) │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    LocalStorage                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │ ketoguide_  │  │ ketoguide_  │  │ ketoguide_      │  │   │
│  │  │ auth        │  │ users       │  │ admin           │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| Design System | `assets/css/base.css` | Apple-inspired CSS variables, components |
| Main JS | `assets/js/main.js` | Menu, scroll, animations, FAQ |
| Auth System | `assets/js/auth.js` | Login, register, subscription API |
| Auth Check | `assets/js/auth-check.js` | Early content gating (before render) |
| Content Gate | `assets/js/content-gate.js` | Visual blur overlay for gated content |

---

## Directory Structure

```
keto-website/
├── index.html                          # Landing page (public, premium teaser)
├── README.md                           # This documentation
├── CLAUDE.md                           # Claude Code instructions
│
├── assets/
│   ├── css/
│   │   └── base.css                    # Complete design system
│   └── js/
│       ├── main.js                     # UI functionality
│       ├── auth.js                     # Authentication API
│       ├── auth-check.js               # Early auth guard
│       └── content-gate.js             # Visual content gating
│
├── pages/
│   ├── admin/                          # Admin interface (protected)
│   │   ├── users.html                  # User management
│   │   └── subscription.html           # Revenue analytics
│   │
│   ├── auth/                           # Authentication pages
│   │   ├── login.html                  # Login form
│   │   ├── register.html               # Registration form
│   │   ├── forgot-password.html        # Password reset
│   │   └── redirect.html               # Post-auth redirect
│   │
│   ├── members/                        # Members area (premium)
│   │   ├── dashboard.html              # User dashboard
│   │   ├── settings.html               # Profile settings
│   │   ├── subscription.html           # Subscription management
│   │   └── upgrade.html                # Upgrade prompt
│   │
│   ├── recipes/                        # Recipe content
│   │   ├── *.html                      # Category pages (free teaser)
│   │   └── details/                    # Individual recipes (621 files, premium)
│   │
│   ├── guides/                         # How-to guides (premium)
│   ├── health/                         # Health articles (premium)
│   ├── supplements/                    # Supplement guides (premium)
│   ├── topics/                         # Special topics (premium)
│   ├── ketopedia/                      # Educational articles (free)
│   ├── lifestyle/                      # Lifestyle content (premium)
│   └── legal/                          # Legal pages (free)
│       ├── impressum.html
│       ├── datenschutz.html
│       └── agb.html
│
└── .github/
    └── workflows/                      # GitHub Actions (optional)
```

---

## Authentication System

### LocalStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `ketoguide_auth` | Object | Current logged-in user session |
| `ketoguide_users` | Array | All registered users |
| `ketoguide_admin` | Boolean | Admin session flag |

### KetoAuth API

```javascript
// Initialize auth system
KetoAuth.init()

// Login
KetoAuth.login(email, password)
// Returns: { success: boolean, message: string }

// Register
KetoAuth.register(name, email, password)
// Returns: { success: boolean, message: string }

// Logout
KetoAuth.logout()

// Check auth status
KetoAuth.isLoggedIn()      // boolean
KetoAuth.isPremium()       // boolean
KetoAuth.getCurrentUser()  // User object

// Subscription
KetoAuth.subscribe()           // Upgrade to premium
KetoAuth.cancelSubscription()  // Cancel premium

// Profile
KetoAuth.updateProfile({ name })
KetoAuth.changePassword(current, new)
KetoAuth.resetPassword(email)

// Guards
KetoAuth.requireAuth(redirectUrl)
KetoAuth.requirePremium(redirectUrl)

// UI
KetoAuth.updateAuthUI()
```

### User Object Structure

```javascript
{
    name: "Max Mustermann",
    email: "max@example.com",
    password: "plaintext",  // Note: Not hashed (static site limitation)
    isPremium: false,
    createdAt: "2025-03-30T10:00:00.000Z",
    subscribedAt: "2025-03-30T12:00:00.000Z"  // Only if premium
}
```

---

## Content Gating

### Access Control Matrix

| Path Pattern | Auth Required | Premium Required |
|--------------|---------------|------------------|
| `/index.html` | ❌ | ❌ |
| `/pages/auth/*` | ❌ | ❌ |
| `/pages/legal/*` | ❌ | ❌ |
| `/pages/ketopedia/*` | ❌ | ❌ |
| `/pages/recipes/*.html` (categories) | ❌ | ❌ |
| `/pages/recipes/details/*` | ✅ | ✅ |
| `/pages/guides/*` | ✅ | ✅ |
| `/pages/health/*` | ✅ | ✅ |
| `/pages/supplements/*` | ✅ | ✅ |
| `/pages/topics/*` | ✅ | ✅ |
| `/pages/members/*` | ✅ | ✅ |
| `/pages/admin/*` | ✅ (Admin) | ❌ |

### How Auth-Check Works

```javascript
// Included in <head> of protected pages
<script src="../../assets/js/auth-check.js"></script>

// Executes BEFORE page renders:
// 1. Checks if path is in free list
// 2. Checks localStorage for valid session
// 3. Checks if premium content requires premium subscription
// 4. If unauthorized: blocks render and redirects
```

### Redirect Logic

```
Not logged in? ──────────────► Login page
                    │
                    ▼
            Logged in but Free? ───► Upgrade page
                    │
                    ▼
            Premium User? ─────────► Show content
```

---

## Admin Interface

### Access

- **URL:** `/pages/admin/users.html`
- **Password:** `admin2025`
- **Session:** Stored in `ketoguide_admin` localStorage

### Features

#### User Management
- View all registered users
- Search by name or email
- Filter by status (All / Premium / Free)
- Toggle premium status
- Delete users (with confirmation)
- Export to CSV

#### Subscription Analytics
- Monthly revenue estimate
- Yearly revenue estimate
- MRR (Monthly Recurring Revenue)
- Plan overview

### Admin Code Example

```javascript
// Access admin password
const ADMIN_PASSWORD = 'admin2025';

// Check admin auth
if (localStorage.getItem('ketoguide_admin') !== 'true') {
    // Show password prompt
}

// Access all users
const users = JSON.parse(localStorage.getItem('ketoguide_users'));

// Modify user
users[index].isPremium = true;
localStorage.setItem('ketoguide_users', JSON.stringify(users));
```

---

## Deployment

### GitHub Pages

```bash
# Current setup
Branch: pages
URL: https://steuerlexi.github.io/keto-website/

# Deploy
git checkout pages
git push origin pages
```

### Enable GitHub Pages

1. Go to Repository Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `pages` / root
4. Save

### Custom Domain (Optional)

1. Add `CNAME` file with domain name
2. Configure DNS records at registrar
3. Enable HTTPS in GitHub Pages settings

---

## Local Development

### Option 1: Python

```bash
python3 -m http.server 8000
# Open: http://localhost:8000
```

### Option 2: Node.js

```bash
npx serve .
# Open: http://localhost:3000
```

### Option 3: PHP

```bash
php -S localhost:8000
# Open: http://localhost:8000
```

### Option 4: VS Code Live Server

1. Install "Live Server" extension
2. Right-click `index.html`
3. "Open with Live Server"

---

## File Conventions

### Asset Paths

| Page Location | CSS Path | JS Path |
|--------------|----------|---------|
| `/index.html` | `assets/css/base.css` | `assets/js/*.js` |
| `/pages/auth/*.html` | `../../assets/css/base.css` | `../../assets/js/*.js` |
| `/pages/admin/*.html` | `../../assets/css/base.css` | `../../assets/js/*.js` |
| `/pages/members/*.html` | `../../assets/css/base.css` | `../../assets/js/*.js` |
| `/pages/recipes/details/*.html` | `../../../assets/css/base.css` | `../../../assets/js/*.js` |
| `/pages/guides/*.html` | `../../assets/css/base.css` | `../../assets/js/auth-check.js` |

### Required Scripts for Protected Pages

```html
<head>
    <!-- CSS first -->
    <link rel="stylesheet" href="../../assets/css/base.css">

    <!-- Auth-check MUST be before any content renders -->
    <script src="../../assets/js/auth-check.js"></script>
</head>
<body>
    <!-- Page content -->

    <!-- Other scripts at end -->
    <script src="../../assets/js/main.js"></script>
    <script src="../../assets/js/auth.js"></script>
</body>
```

---

## Design System

### CSS Variables

```css
:root {
    /* Colors */
    --apple-black: #000000;
    --apple-white: #ffffff;
    --apple-gray-100: #f5f5f7;
    --apple-gray-200: #e8e8ed;
    --apple-gray-300: #d2d2d7;
    --apple-gray-400: #86868b;
    --apple-gray-500: #6e6e73;
    --apple-blue: #0071e3;
    --apple-blue-hover: #0077ed;
    --apple-green: #34c759;
    --apple-red: #ff3b30;
    --apple-orange: #ff9500;
    --apple-purple: #af52de;

    /* Typography */
    --font-system: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;

    /* Spacing */
    --radius-sm: 12px;
    --radius-md: 18px;
    --radius-lg: 28px;
    --radius-xl: 40px;

    /* Transitions */
    --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    --transition-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Common Components

#### Recipe Card
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
        <a href="details/recipe.html" class="btn-secondary">Zum Rezept</a>
    </div>
</div>
```

#### Bento Grid Item
```html
<div class="bento-item">
    <div class="bento-content">
        <div class="bento-icon">🔥</div>
        <h3>Title</h3>
        <p>Description...</p>
    </div>
</div>
```

#### Buttons
```html
<a class="btn btn-primary">Primary</a>
<a class="btn btn-secondary">Secondary</a>
<a class="btn btn-outline">Outline</a>
```

---

## Security

### Current Implementation

| Aspect | Status | Notes |
|--------|--------|-------|
| Auth Storage | ⚠️ LocalStorage | Not secure for production |
| Passwords | ⚠️ Plaintext | Stored in localStorage |
| Content Gating | ✅ Client-side | Blocks direct URL access |
| Admin Protection | ⚠️ Simple password | Client-side check |

### Limitations (Static Site)

⚠️ **Important:** This is a **client-side only** authentication system. It provides:
- ✅ Basic access control for honest users
- ✅ Clean UX for members area
- ❌ **NOT secure against technical users**
- ❌ **NOT suitable for sensitive data**

### Recommendations for Production

1. **Move to backend auth** (Node.js, PHP, etc.)
2. **Use proper session management** (JWT, cookies)
3. **Hash passwords** (bcrypt, argon2)
4. **Add rate limiting** for login attempts
5. **Implement HTTPS** (required for production)
6. **Add CSRF protection**
7. **Use server-side content validation**

### What This System Protects Against

- ✅ Accidental access by non-members
- ✅ Direct URL sharing of premium content
- ✅ Basic user session management

### What This System Does NOT Protect Against

- ❌ Users inspecting localStorage
- ❌ Technical users bypassing JS checks
- ❌ Password extraction from localStorage
- ❌ Man-in-the-middle attacks (without HTTPS)

---

## Pricing Plans

### Free (€0/month)
- Access to selected recipes
- Basic keto information
- Community access

### Premium Monthly (€9.99/month)
- 621+ premium recipes
- All scientific guides
- Personal email support
- Exclusive video tutorials
- Meal planner & shopping lists
- Early access to new content

### Premium Annual (€99/year)
- All Premium Monthly features
- 1:1 consultation (30 min/month)
- Exclusive recipe database
- Priority support
- Bonus: E-book download
- VIP community access
- **Save 2 months**

---

## Demo Credentials

### Admin Access
- **Password:** `admin2025`
- **URL:** `/pages/admin/users.html`

### Demo User Account
- **Email:** `admin@ketoguide.com`
- **Password:** `admin123`
- **Status:** Premium (auto-created on first load)

---

## Contributing

### Adding New Content

1. **New Recipe:**
   - Copy existing recipe from `pages/recipes/details/`
   - Update title, description, ingredients, instructions
   - Add `auth-check.js` script in `<head>`
   - Link from category page

2. **New Guide:**
   - Copy existing guide from `pages/guides/`
   - Update content
   - Add `auth-check.js` script in `<head>`

3. **New Free Content:**
   - Add path to `FREE_PATHS` in `auth-check.js`

### Adding New Features

1. **New Auth Feature:**
   - Add to `assets/js/auth.js`
   - Update KetoAuth API
   - Document in CLAUDE.md

2. **New Admin Feature:**
   - Add to `pages/admin/`
   - Protect with admin auth check
   - Add to admin navigation

---

## License

© 2025 KetoGuide. All rights reserved.

---

## Support

For questions or issues:
- Check `CLAUDE.md` for development guidance
- Review `assets/js/auth.js` for authentication API
- Inspect localStorage for user data debugging

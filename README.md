# Student Portfolio Website

A sleek, modern, single-page portfolio website built with vanilla HTML, CSS, and JavaScript. Features a glassmorphic dark theme, 3D interactive elements, animated particles, and a fully editable content system — all without any framework dependencies.

![GitHub Pages Ready](https://img.shields.io/badge/GitHub_Pages-Ready-success)![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-No_Framework-blue)![License](https://img.shields.io/badge/License-MIT-green)

---

## Features

**Design & Visuals**

- Dark glassmorphic UI with animated gradient background

- Floating particle system

- 3D card tilt effects on hover

- 3D button press effects with mouse tracking

- Shimmer text animation on the hero name

- Glowing orbit rings and floating tech cubes

- Fully responsive — works on mobile, tablet, and desktop

- Smooth scroll navigation with active section highlighting

- Slide-up scroll reveal animations

**Customization & Theming**

- 8 built-in theme color presets (Violet, Blue, Emerald, Rose, Amber, Cyan, Pink, Indigo)

- Switch themes instantly from the palette button in the navbar

- Theme colors persist across sessions via local storage

**Editable Content (Edit Mode)**

- PIN-protected edit mode (default PIN: `1234`)

- Edit all text fields directly on the page (inline editing)

- Upload and change profile photo (persists locally or via `data.js`)

- Add, remove, and reorder skills with proficiency bars

- Add and remove tool/technology tags

- Add and delete project cards dynamically

- Edit social media and project links

- Contact form with toast notification

**Data Persistence**

- Content is driven by `data.js` — the single source of truth

- Edits auto-save to browser `localStorage` as a safety net

- Changes can be committed back to `data.js` for permanent deployment

- Clear structure makes it easy to hand-edit the data file

---

## Project Structure

```
├── index.html          # Main HTML structure and layout
├── styles.css          # All styling — glassmorphism, 3D effects, animations
├── script.js           # Core interactions — particles, clock, scroll, 3D effects
├── dynamic.js          # Edit mode, data persistence, skill/project management
├── data.js             # SITE_DATA — all editable content lives here
└── assets/
    ├── images/
    │   └── profile.jpg # Profile photo (replace with your own)
    └── projects/       # Project screenshots/thumbnails
```

---

## Quick Start

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

1. Open `data.js` and replace the `SITE_DATA` object with your own information (name, bio, skills, projects, links, etc. ).

1. Replace `assets/images/profile.jpg` with your own profile photo.

1. Open `index.html` in a browser — that's it!

   Or deploy to **GitHub Pages**: go to your repo settings → Pages → select the `main` branch and save.

---

## How to Customize Your Content

Edit the `data.js` file to change the default content that loads for every visitor. Key fields:

| Field | Description |
| --- | --- |
| `heroName` | Name displayed in the hero section |
| `heroTagline` | Subtitle below the hero name |
| `heroUni` | University and graduation year |
| `fullName` | Full name shown in the About section |
| `dob` | Date of birth |
| `nationality` | Nationality |
| `languages` | Spoken languages |
| `major` | Major / Department |
| `rollNo` | Student roll number |
| `bio` | Personal bio / story |
| `semester` | Current semester |
| `cgpa` | CGPA |
| `proj1title` – `proj3desc` | Project titles and descriptions |
| `homeAddress` | Home address |
| `email` | Email address |
| `phone` | Phone number |
| `uniAddress` | University address |
| `_skills` | Array of skill names and proficiency levels |
| `_tools` | Array of tool/technology names |
| `link__proj1-preview` – `link__social-x` | External links for projects and social profiles |

> **Tip:** After editing `data.js`, open the site in an incognito window to avoid your browser's cached `localStorage` overwriting your changes.

---

## How to Add Project Screenshots

1. Place an image in `assets/projects/`, e.g. `assets/projects/chatbot.png`.

1. In `index.html`, find the project card inside `#projectsGrid` and replace the icon block:

   ```html
   <!-- before -->
   <div class="h-40 overflow-hidden flex items-center justify-center" ...>
       <i data-lucide="message-square-code" ...></i>
   </div>
   
   <!-- after -->
   <div class="h-40 overflow-hidden">
       <img src="assets/projects/chatbot.png" class="w-full h-full object-cover">
   </div>
   ```

---

## Deploying to GitHub Pages

1. Push this repo to GitHub.

1. Go to **Settings** → **Pages**.

1. Under **Source**, select **Deploy from a branch**.

1. Choose the `main` branch and `/root` folder, then click **Save**.

1. Your portfolio will be live at `https://your-username.github.io/your-repo-name/`.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| HTML | Page structure |
| CSS | Glassmorphism, animations, responsive layout |
| JavaScript (Vanilla ) | Interactions, edit mode, data management |
| TailwindCSS (CDN) | Utility-first styling |
| Lucide Icons | Icon library |
| Inter Font | Typography |

---

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge). No build step or server required.

---

*Built with vanilla code and lots of coffee.*

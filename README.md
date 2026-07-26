# Ra — Rawnak's Portfolio

A static, data-driven portfolio site built with HTML, CSS, and JavaScript that can be deployed directly to GitHub Pages. The project features an optional **Admin Mode** that allows visually editing the entire site—including content, themes, colors, fonts, layout, images, and projects—with a live preview. Changes are published by securely committing updates directly to the repository.

## Features

### Public Portfolio Site

The public-facing site is entirely static and data-driven, rendering its content from a central `data.json` file.

- **Dynamic Rendering**: All sections (Hero, About, Skills, Projects, Contact, etc.) are populated directly from `data.json` using client-side JavaScript.

- **Modern UI/UX**: Features a glassmorphism design, animated background particles, 3D hover effects, and a responsive layout using Tailwind CSS.

- **Live Information**: Displays real-time data such as local time, date, and semester/CGPA updates.

- **Customizable**: Easily swap themes, fonts, and colors by modifying CSS variables or the admin panel.

### Admin Mode (Visual Editor)

Admin Mode provides a secure, browser-based interface for managing the portfolio without touching code.

- **Secure Authentication**: Uses GitHub OAuth to verify admin identity against a server-side allow-list, issuing an `httpOnly` session cookie.

- **Visual Editor**: A left-hand panel allows editing of all site content, from basic text fields to complex project entries.

- **Live Preview**: A right-hand iframe renders the site in real-time using the same codebase as the public site, ensuring perfect accuracy.

- **Draft Workflow**: Changes are kept in memory until published. Refreshing or leaving the page discards drafts, preventing accidental saves.

- **Secure Publishing**: Publishing changes sends the updated data to a separate Node.js backend, which securely commits the changes to the repository using a fine-grained Personal Access Token (PAT ).

## Project Structure

```
ra_project/
├── index.html          # Main page markup (containers filled by script.js)
├── script.js           # Renders data.json into the DOM; handles UI interactions
├── styles.css          # Main stylesheet, theme variables, and animations
├── data.json           # Central database for all editable site content
├── admin.html          # Admin editor interface and login gate
├── admin.js            # Admin editor logic and API communication
├── admin.css           # Styling for the admin interface
└── assets/             # Static assets (images, project thumbnails)
    ├── images/
    └── projects/

server/                 # Backend service for Admin Mode (requires separate deployment)
├── server.js           # Express backend handling auth and publishing
├── package.json        # Node.js dependencies
└── .env.example        # Required environment variables template
```

## Getting Started

### Running the Public Site

Since the portfolio is a static site, you can run it immediately:

1. Clone or download this repository.

1. Navigate to the `ra_project` directory.

1. Open `index.html` in your web browser, or deploy the contents of this folder to GitHub Pages.

### Setting Up Admin Mode

The Admin Mode requires a backend server to handle GitHub OAuth and secure repository commits.

1. **Create GitHub Credentials**:
  - Create a GitHub OAuth App for login.
  - Create a fine-grained Personal Access Token (PAT) with `Contents: Read and write` permissions for your repository.

1. **Deploy the Backend**:
  - Deploy the `server/` directory to a Node.js hosting provider (e.g., Render, Railway, Fly.io).
  - Configure the environment variables based on `.env.example`.

1. **Connect Frontend to Backend**:
  - Update the `BACKEND_URL` in `admin.js` to point to your deployed server.
  - Update the Authorization callback URL in your GitHub OAuth App.

*For detailed instructions, refer to the *[*Server README*](server/README.md)*.*

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript

- **Styling**: Tailwind CSS (via CDN), Custom CSS Variables for theming

- **Icons**: Lucide Icons

- **Backend**: Node.js, Express.js

- **Authentication**: GitHub OAuth, JSON Web Tokens (JWT)

- **Deployment**: GitHub Pages (Frontend), Node.js Host (Backend)

## Customizing Content

The entire website's content is controlled by the `data.json` file. You can modify the JSON directly or use the Admin Mode to update:

- Site title, theme colors, and fonts

- Hero section details (name, tagline, profile picture)

- Personal information (About section, skills, contact details)

- Project galleries and social links

## License

This project is open-source and available for personal and commercial use.

/* =====================================================================
   DATA.JS — Arara Portfolio persistent content store
   =====================================================================
   This file holds every piece of editable text, link, skill, and
   project on the site. It is the permanent, committed source of truth
   for the portfolio — this is what loads when the page (or the
   GitHub Pages-hosted site) first opens, in any browser, for anyone.

   HOW IT GETS UPDATED
   Open index.html, click "Edit" (PIN: 1234), and make your changes.
   Edits auto-save to this browser automatically. To make them
   permanent in this file, open the browser console and run
   copy(JSON.stringify(collectAllData())), then paste the result in
   place of the object below, or ask a developer to wire the
   connectDataFile()/downloadDataFile() helpers in dynamic.js back up
   to a button if you'd like one-click saving to disk again.

   HAND-EDITING THIS FILE
   You can also edit the values below directly — it is a plain
   JavaScript object. If you do, open the site afterward in a private/
   incognito window (or clear this site's local storage) so your
   browser does not overwrite your hand edits with an older cached
   copy.
   ===================================================================== */
window.SITE_DATA = {
  "heroName": "Arara",
  "heroTagline": "Computer Science Student · Aspiring Full-Stack Developer",
  "heroUni": "🎓 State University — Class of 2026",
  "fullName": "Arara",
  "dob": "March 15, 2003",
  "nationality": "American",
  "languages": "English, Spanish, French",
  "major": "B.Tech Computer Science &amp; Engineering",
  "rollNo": "CS-2023-0847",
  "bio": "I'm a passionate Computer Science student in my junior year, deeply interested in web development, machine learning, and cloud computing. I love building things that live on the internet. When I'm not coding, you'll find me reading about new tech trends, contributing to open-source projects, or playing basketball with friends.",
  "semester": "5th Sem",
  "cgpa": "8.7",
  "proj1title": "AI Mental Health Chatbot",
  "proj1desc": "A conversational assistant that offers students quick, judgement-free check-ins and coping resources. Built in 36 hours for a hackathon.",
  "proj2title": "Full-Stack E-Commerce App",
  "proj2desc": "A complete storefront with cart, checkout, and an admin dashboard for managing products and orders.",
  "proj3title": "Personal Finance Tracker",
  "proj3desc": "A dashboard that visualizes spending habits, sets budgets, and forecasts monthly balances using simple ML models.",
  "homeAddress": "1234 Oak Street, Apt 5B<br/>Springfield, IL 62704, USA",
  "email": "arara@university.edu",
  "phone": "+1 (555) 123-4567",
  "uniAddress": "State University, Department of CS<br/>University Drive, Campus Rd, IL 62701",
  "link__proj1-preview": "#",
  "link__proj1-github": "#",
  "link__proj2-preview": "#",
  "link__proj2-github": "#",
  "link__proj3-preview": "#",
  "link__proj3-github": "#",
  "link__social-discord": "#",
  "link__social-instagram": "#",
  "link__social-linkedin": "#",
  "link__social-x": "#",
  "_profilePic": "assets/images/profile.jpg",
  "_skills": [
    {
      "name": "Python",
      "level": "90"
    },
    {
      "name": "JavaScript / TypeScript",
      "level": "85"
    },
    {
      "name": "React / Next.js",
      "level": "80"
    },
    {
      "name": "Node.js / Express",
      "level": "75"
    },
    {
      "name": "SQL / Databases",
      "level": "82"
    },
    {
      "name": "Java / C++",
      "level": "70"
    }
  ],
  "_tools": [
    "Git & GitHub",
    "VS Code",
    "Docker",
    "AWS",
    "Firebase",
    "Figma",
    "Linux",
    "MongoDB",
    "PostgreSQL",
    "Tailwind CSS",
    "TensorFlow",
    "REST APIs"
  ],
  "_customProjects": [],
  "_hiddenDefaults": [],
  "_savedAt": 0
};

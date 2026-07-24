# Assets

All static images for the portfolio live here, separate from the code files.

```
assets/
├── images/
│   └── profile.jpg      ← your profile photo (shown in the hero section)
└── projects/            ← put project screenshots/thumbnails here
```

## Replacing your profile photo permanently
Uploading a photo through the site's "Edit" mode only saves it in your
browser's local storage on that one computer/browser. To make a photo the
permanent default for anyone visiting the site:

1. Drop your image into `assets/images/`, e.g. `assets/images/profile.jpg`
   (replacing the placeholder already there).
2. Make sure `index.html` still points to it:
   `<img id="profilePic" src="assets/images/profile.jpg" ...>`

## Adding project screenshots
1. Add an image to `assets/projects/`, e.g. `assets/projects/chatbot.png`.
2. In `index.html`, find the project's card inside `#projectsGrid` and swap
   the icon block for an `<img>`:
   ```html
   <!-- before -->
   <div class="h-40 ..."><i data-lucide="message-square-code" ...></i></div>

   <!-- after -->
   <div class="h-40 overflow-hidden"><img src="assets/projects/chatbot.png" class="w-full h-full object-cover"></div>
   ```

Keeping images here (instead of pasted as long base64 strings in the code)
keeps `index.html` clean and makes it easy to update a picture without
touching any code.

# The Courtney Reset

A mobile-friendly, interactive 8-week home fitness, meal and habit tracker.

## Features

- 8 weeks of daily workouts
- Walking-pad targets
- Sets, reps and exercise instructions
- Daily meal suggestions
- Water tracking
- Grocery and equipment checklists
- Weekly measurements and check-ins
- Progress percentages and streaks
- Automatic browser saving using `localStorage`
- Backup export and import
- Installable as a home-screen web app
- Offline support after the first visit

## Run it locally

You can open `index.html` directly, but install/offline features work best through a local web server.

### Using Python

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload every file from this folder to the repository root.
3. Open **Settings** → **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)`.
6. Save and wait for GitHub to publish the site.

GitHub will show the live URL when deployment is complete.

## Add it to an iPhone home screen

1. Open the published GitHub Pages URL in Safari.
2. Tap **Share**.
3. Tap **Add to Home Screen**.

## Saving and privacy

Progress is stored only in the browser on the device being used. It is not uploaded anywhere. Use **Export progress** in the app to create a backup before clearing browser data or changing devices.

## Project files

- `index.html` — app layout
- `styles.css` — visual design
- `app.js` — workouts, meals, tracking and saving
- `manifest.json` — installable app settings
- `sw.js` — offline caching
- `icon*.svg` — app icons

# COSBOS Professionals — Luxury Salon Science

Vite + React project — fully componentized for easy editing.

## Structure
```
cosbos-react-vite/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx        -> Entry
│   ├── App.jsx         -> Layout composition
│   ├── App.css
│   ├── index.css       -> Global tokens
│   └── components/
│       ├── Header.jsx + Header.css
│       ├── Hero.jsx + Hero.css
│       ├── About.jsx + About.css
│       ├── Philosophy.jsx + Philosophy.css
│       ├── SalonSystem.jsx + SalonSystem.css
│       ├── ProductShowcase.jsx + ProductShowcase.css
│       ├── Partners.jsx + Partners.css
│       ├── Lab.jsx + Lab.css
│       ├── Contact.jsx + Contact.css
│       └── Footer.jsx + Footer.css
```

## Quick Start
```bash
npm install
npm run dev   # http://localhost:5173
npm run build
npm run preview
```

## How to edit
- Each section is isolated: JSX for structure/logic, CSS for styling.
- Change text directly in the JSX file.
- Change colors/spacing/fonts in its CSS file.
- Global colors are in `src/index.css` :root variables.

## Notes from original HTML
- Rebuilt from your bundled HTML artifact
- Preserved content: Luxury Salon Science, 3-step protocol, Lumina, Partners, Lab batch etc.
- No Tailwind needed — pure CSS for manual control
- Fonts: Bodoni Moda (serif), Inter (sans), JetBrains Mono (mono) via Google Fonts

Enjoy editing!

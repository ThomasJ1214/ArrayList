# Java ArrayList Learning RPG (GitHub Pages Ready)

A minimalist, professional-looking retro RPG website that teaches Java `ArrayList` using map exploration and dedicated level pages.

## Directory format

```text
ArrayList/
├── index.html
├── game.html                  # World map / exploration screen
├── level.html                 # Dedicated full-screen level experience
├── css/
│   └── style.css
├── js/
│   ├── main.js                # Map movement + world interactions
│   └── level.js               # Level content logic and progression
├── data/
│   └── levels.js
├── assets/
│   ├── images/
│   │   ├── hero-banner.svg
│   │   ├── map-background.svg
│   │   └── README.md
│   └── characters/
│       ├── player-spritesheet.svg
│       ├── teacher-java.svg
│       ├── teacher-boss.svg
│       └── README.md
└── README.md
```

## Included gameplay systems
- Start menu and character setup
- Pixel world map with WASD movement
- Dedicated level webpage (prevents map movement conflicts)
- Drag-drop coding puzzles
- Mini-games, quizzes, and boss battles
- XP progression and save/load via localStorage
- NPC teacher guidance

## Deploy on GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Use **Deploy from branch** and select root (`/`).
4. Open the generated Pages URL.

## Architecture note
- World map and level gameplay are intentionally split (`game.html` -> `level.html`) to avoid keyboard/movement conflicts while solving level content.
- Save data is shared through localStorage so progress survives page transitions.

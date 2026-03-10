# ArrayList Academy (GitHub Pages Ready)

This is the refreshed version of the Java ArrayList learning game. Old placeholder content has been replaced with cleaner structure, updated level curriculum, and improved progression logic.

## Project structure

```text
ArrayList/
├── index.html
├── game.html
├── level.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   └── level.js
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

## What was replaced
- Updated branding/copy from old “adventure draft” text to **ArrayList Academy** language.
- Replaced old 5-level progression with a fuller 8-level curriculum (fundamentals -> final boss).
- Replaced repeatable XP exploits with per-level completion tracking (`code`, `puzzle`, `mini`, `quiz`, `boss`).
- Replaced old save handling with `V4` plus automatic migration from legacy keys.
- Replaced old UI wording and controls text for clearer flow.

## Key gameplay behavior
- Map page (`game.html`) handles movement and level entry only.
- Level page (`level.html`) handles learning content and challenges.
- Entering a level fully changes page, so map input conflicts are eliminated.

## Deploy
1. Push repository to GitHub.
2. Open **Settings → Pages**.
3. Select **Deploy from branch** and choose root (`/`).
4. Open your generated GitHub Pages URL.

# CodeKids Playground - Development Guide

## Project Overview

CodeKids Playground is a React-based educational platform for teaching children to code through interactive games. The project consists of a home page showcasing games and game implementations like the Memory Game.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3
- **Routing**: React Router v6
- **Language**: JavaScript (JSX)
- **Direction**: RTL (Hebrew support)

## Project Structure

```
src/
├── components/
│   ├── Header.jsx      - Navigation header
│   ├── Footer.jsx      - Footer component
│   ├── Home.jsx        - Landing page with hero and game selection
│   └── MemoryGame.jsx  - Memory matching game implementation
├── App.jsx             - Main app with routing
├── App.css             - App-specific styles
├── index.css           - Global styles and Tailwind setup
└── main.jsx            - Entry point

Config Files:
├── tailwind.config.js  - Tailwind CSS configuration
├── postcss.config.js   - PostCSS configuration
├── vite.config.js      - Vite configuration
└── package.json        - Dependencies
```

## Key Features

### Home Page
- Hero section with Bit the Robot character
- Game selection cards (Memory Game + future games)
- Achievement badges and statistics

### Memory Game
- Multi-level difficulty (Beginner, Easy, Medium, Hard)
- Hebrew/English word matching pairs
- Point-based scoring system
- Real-time feedback and hints
- Victory celebration screen

## Styling Guidelines

- **Theme Colors**: Uses Material Design color system defined in tailwind.config.js
- **Layout**: Responsive grid system with Tailwind
- **Typography**: Heebo (Hebrew), Plus Jakarta Sans (Headlines), Be Vietnam Pro (Body)
- **RTL Support**: All components use `dir="rtl"` for proper right-to-left display

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint (if configured)
```

## Component Communication

- **Routing**: Using React Router for page navigation
- **State Management**: Local component state with useState
- **Game Logic**: Encapsulated in MemoryGameEngine class within MemoryGame.jsx

## Adding New Games

1. Create a new component file in `src/components/`
2. Implement game logic within the component
3. Add route in `App.jsx`
4. Add game card to Home.jsx

## Important Notes

- All components use RTL layout (Hebrew support)
- Tailwind CSS handles responsive design
- Material Symbols Outlined icons are used throughout
- Game state is managed locally; no backend integration yet
- Images use Google CDN temporary placeholders (should be replaced)

## Future Enhancements

- User authentication and profiles
- Persistent score/achievement tracking
- Additional games (Typing, etc.)
- Multiplayer support
- Dark mode toggle
- Mobile app version (React Native)
- Backend API for user data

## Deployment

The app is ready to deploy using:
- Vercel
- Netlify
- GitHub Pages
- Traditional hosting services

Build the project with `npm run build` and serve the `dist` folder.

# Three.js - Template - Complex (TypeScript)

This is a Three.js application template built with TypeScript, Vite, and modern web development practices.

## Features
- ✅ TypeScript for type safety and better development experience
- ✅ Three.js for 3D graphics
- ✅ Vite for fast development and building
- ✅ ESLint-style architecture with modular components
- ✅ Event-driven architecture with custom EventEmitter
- ✅ Resource loading system with multiple format support
- ✅ Debug GUI integration with lil-gui
- ✅ Performance monitoring with stats.js

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run these commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:3000
npm run dev

# Build for production in the dist/ directory
npm run build

# Type check without emitting files
npm run type-check

# Type check in watch mode
npm run type-check:watch
```

## Project Structure
```
sources/
├── Experience/
│   ├── Utils/           # Utility classes (EventEmitter, Time, Sizes, etc.)
│   ├── Experience.ts    # Main application class
│   ├── Camera.ts        # Camera management with debug controls
│   ├── Renderer.ts      # WebGL renderer with post-processing
│   ├── Resources.ts     # Asset loading and management
│   ├── World.ts         # 3D world and scene objects
│   └── assets.ts        # Asset configuration
├── index.ts             # Application entry point
├── index.html           # HTML template
└── style.css            # Global styles
```

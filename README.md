# Mobile Cribbage Game

A mobile-first cribbage card game that uses Web Bluetooth API for peer-to-peer multiplayer gameplay.

## Features

- 🎴 Full cribbage game implementation with traditional scoring rules
- 📱 Mobile-optimized UI with touch-friendly cards
- 🔵 Bluetooth peer-to-peer multiplayer (2 players)
- 🎯 Manual score declaration with muggins rule
- 📊 Visual peg board score tracker
- 🎵 Sound effects and card animations
- 💾 Game state persistence with automatic reconnection

## Platform Support

**Supported:**
- Android 6+ with Chrome or Edge browsers

**NOT Supported:**
- iOS (Safari does not support Web Bluetooth API)
- Firefox (no Web Bluetooth support)

## Local Development

```bash
# Install dependencies
npm install

# Run development server (HTTPS required for Bluetooth)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

The dev server runs on `https://localhost:3000` with a self-signed SSL certificate (required for Web Bluetooth API).

## How to Play

1. **Start Game:** One player hosts, the other joins
2. **Discovery:** Guest player scans for nearby Bluetooth devices
3. **Connect:** Select the host's device to connect
4. **Crib Phase:** Each player chooses 2 cards for the crib
5. **Play Phase:** Alternate playing cards, counting points (15s, pairs, runs)
6. **Scoring Phase:** Manually declare points in your hand (opponent can claim missed points)
7. **Win:** First player to 121 points wins!

## Technology

- React 19.2.0 + Vite 7.3.1
- Web Bluetooth API for device communication
- Seedrandom for deterministic deck shuffling
- Vitest for unit testing
- CSS for styling (mobile-first responsive design)

## Deployment

The app is deployed to GitHub Pages at: `https://[username].github.io/Cribbage/`

Deployment happens automatically on push to `main` branch via GitHub Actions.

## License

MIT

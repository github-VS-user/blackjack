# Blackjack

A simple Blackjack game built with React, Vite, and Tailwind CSS.

## Features

- Play classic Blackjack against the dealer
- Responsive UI with modern styling (Tailwind CSS)
- Toast notifications for game events
- Client-side routing with React Router

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/blackjack.git
   cd blackjack
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```sh
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

### Deploying

You can deploy the `dist/` folder to any static hosting service (e.g., Netlify, Vercel).

#### Netlify SPA Routing

To support client-side routing, add a `_redirects` file in the `public/` folder with:
```
/*    /index.html   200
```

## Project Structure

```
src/
  components/      # React components (Card, GameControls, etc.)
  pages/           # Page components (Home, NotFound)
public/            # Static assets
styles.css         # Tailwind CSS styles
vite.config.ts     # Vite configuration
```

## License

MIT

---

Made by Dario wtih ❤️

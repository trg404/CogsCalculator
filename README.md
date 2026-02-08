# Pottery Studio COGS Calculator

A prototype Cost of Goods Sold (COGS) calculator designed for paint-your-own-pottery studios. This tool helps studio owners understand their per-piece profitability by calculating all costs associated with producing a finished pottery piece.

## Purpose

Running a paint-your-own-pottery studio involves many hidden costs beyond the bisque pieces themselves. This calculator aggregates:

- **Material costs** - Bisque (unglazed pottery) and glaze/supplies
- **Labor costs** - Staff time helping customers, broken down by role
- **Kiln costs** - Labor for loading, firing, and unloading kilns
- **Overhead costs** - Rent, utilities, insurance, and other business expenses

By understanding the true cost per piece, studio owners can make informed pricing decisions.

## Features

- **Bisque Catalog** - Maintain a catalog of pottery pieces with wholesale costs
- **Staff Configuration** - Define staff roles with hourly rates and time-per-customer metrics
- **Overhead Management** - Track fixed and variable overhead costs separately
- **Kiln Settings** - Configure firing batch sizes and labor time
- **Real-time Calculation** - See cost breakdowns update as you adjust settings
- **Local Storage** - Settings persist in your browser between sessions

## Tech Stack

- TypeScript
- React 19
- Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)

### Installation

```bash
# Install dependencies for the calculation library
npm install

# Install dependencies for the web app
cd web
npm install
```

### Running the Application

```bash
cd web
npm run dev
```

Open http://localhost:5173 in your browser.

### Running Tests

```bash
# Test the calculation library
npm test

# Test the web app
cd web
npm test
```

## Project Structure

```
CogsCalculator/
├── src/                 # Core calculation library (no UI dependencies)
│   ├── pottery.ts       # Pottery-specific COGS calculations
│   ├── utils.ts         # Helper functions (rounding, etc.)
│   └── index.ts         # CLI demo entry point
├── web/                 # React web application
│   └── src/
│       ├── components/  # UI components (forms, panels, etc.)
│       ├── hooks/       # Custom React hooks (useLocalStorage)
│       ├── types/       # Web-layer TypeScript interfaces
│       ├── utils/       # Shared UI utilities (formatCurrency)
│       └── App.tsx      # Main application
└── README.md
```

## Status

This is a **prototype** application for exploring COGS calculations in a pottery studio context. It demonstrates the core concepts but may need additional features for production use.

## License

MIT

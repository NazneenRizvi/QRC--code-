# QR Studio — Professional QR Code Generator

QR Studio is a highly polished, single-view, glassmorphic React + TypeScript web application built with Vite and Tailwind CSS. It allows you to design and generate high-fidelity, customized QR codes entirely in your browser with zero server latency or data uploads.

## Features

-   **Multi-Format QR Codes**: Generate custom QR codes for URLs, Raw Text, Wi-Fi networks (with encryption controls), vCard contacts, Phone calls, Emails, and SMS messages.
-   **High-End Glassmorphic UI**: Powered by visual styles with responsive layouts, ambient background gradients, and smooth state transitions.
-   **Color Presets & Sliders**: Choose from several beautiful color style presets or customize the foreground/background color codes individually.
-   **Brand Logo Overlay**: Drop in central logos (e.g., standard logos or your own uploaded brand PNG/JPG/SVG) with custom overlay scaling.
-   **Error Correction Control**: Manually scale error correction buffers (L, M, Q, H) to maximize scan reliability when overlays are used.
-   **Client-Side Compilation**: Fully compiled on the browser using high-performance Canvas APIs. Your data never leaves your device.
-   **Live Output & Action suite**: Instantly copy to clipboard, or download high-resolution PNG image assets.
-   **Browser Persistence History**: Tracks recent generation history in your local browser cache (`localStorage`) for quick configuration recovery.

---

## Technical Stack

-   **Frontend Framework**: React 18 (TypeScript)
-   **Build System**: Vite
-   **Styling Engine**: Tailwind CSS (with glassmorphic effects)
-   **Icons Pack**: Lucide React
-   **Animation Library**: Motion (from `motion/react`)

---

## Running Locally

To run this project locally in VS Code, follow these simple steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine (version 18+ is recommended).

### 1. Extract the ZIP Content
Unzip the downloaded project folder and open it in VS Code:
```bash
cd qr-studio
```

### 2. Install Dependencies
Run the package manager command to install all required dependencies:
```bash
npm install
```

### 3. Start Development Server
Boot up the Vite development server locally:
```bash
npm run dev
```

The server will run at `http://localhost:3000` (or another free port shown in the console). Open it in your web browser to view your QR Studio instance!

### 4. Build for Production
To bundle the static application assets for production deployment:
```bash
npm run build
```
This outputs compiled, optimized assets to the `dist/` directory.

---

## License & Copyright

&copy; 2026 QR Studio Inc. • All Rights Reserved Nazneen Rizvi

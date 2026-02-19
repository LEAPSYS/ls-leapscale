# AI Assistant Instructions for ls-leapscale

## Project Overview

**ls-leapscale** is an Electron + Vite + React desktop application that reads weight measurements from serial port devices (digital scales) and displays live and stabilized weight readings.

## Architecture

### Three-Process Electron Model

- **Main Process** (`src/main/index.js`): Manages serial port I/O with `serialport` library, stabilization algorithm, and IPC
- **Preload Bridge** (`src/preload/index.js`): Exposes limited API to renderer via context isolation
- **Renderer Process** (`src/renderer/src/App.jsx`): React UI for port selection and weight display

### Critical Data Flow

1. Serial device → Main process parses weight readings line-by-line using `ReadlineParser` (delimiter: `\r\n`)
2. Main emits `live-weight` events (raw) and `stable-weight` events (filtered) to renderer
3. Renderer updates UI via React state listeners on `window.api` events

### Weight Stabilization Algorithm

- Configured constants: `STABLE_COUNT=5` readings, `STABLE_RANGE=0.002` (2 grams tolerance)
- Logic in `checkStableWeight()`: Buffer last N readings, only emit when variance is within tolerance
- Buffer resets after each stable reading to avoid duplicate emissions

## Essential APIs & IPC Handlers

### Renderer → Main Communication

These are exposed via `window.api` (see preload):

- `listPorts()` - Returns array of available serial port paths
- `connectPort(port)` - Opens serial port with 9600 baud, 8 data bits, 1 stop bit, no parity
- `disconnectPort()` - Closes active port
- `onLiveWeight(callback)` - Listener for raw weight data
- `onStableWeight(callback)` - Listener for stabilized weight data

### Main IPC Handlers

- `list-ports`, `connect-port`, `disconnect-port`: Map to preload API
- Cannot add handlers without also exposing via preload for security

## Development Workflow

### Commands

```
npm run dev          # Hot reload development (uses electron-vite)
npm run build        # Compile (outputs to /out/)
npm run build:mac    # Build macOS app (requires building first)
npm run lint         # ESLint with cache
npm run format       # Prettier format
```

### Build Output

- Compiled code goes to `out/` directory (not committed)
- Production loads from `out/renderer/index.html`
- Development uses HMR via `ELECTRON_RENDERER_URL` env var

## Project-Specific Patterns

### Port Cleanup

- Serial port must close on app quit: handled in `app.on('before-quit')` and `app.on('window-all-closed')`
- Use `isClosing` flag to prevent duplicate close attempts (port closing is async)
- Always resolve/reject promises in port operations to avoid hanging connections

### React Conventions

- Uses **React 19** with hooks (useState, useEffect)
- No state management library (simple local state)
- Effect cleanup: Attach listeners on mount only (see App.jsx useEffect dependency array)

### Security

- Context isolation enabled (`contextBridge`, `contextIsolation: true`)
- Preload acts as middleware — **never expose serialport directly to renderer**
- External URLs open in default browser, not in app window

## Key Files to Know

- [src/main/index.js](src/main/index.js) - Serial logic, stabilization, IPC handlers
- [src/preload/index.js](src/preload/index.js) - Secure API bridge (expose IPC carefully)
- [src/renderer/src/App.jsx](src/renderer/src/App.jsx) - Port selection UI, weight display
- [electron.vite.config.mjs](electron.vite.config.mjs) - Build config (React plugin, alias)
- [electron-builder.yml](electron-builder.yml) - Distribution config (excludes src/ on package)

## Common Tasks

**Adding a new IPC event:**

1. Implement handler in `ipcMain.handle()` (src/main/index.js)
2. Add method to `api` object in preload (src/preload/index.js)
3. Call via `window.api.methodName()` in renderer

**Modifying stabilization behavior:** Edit `STABLE_COUNT` and `STABLE_RANGE` at top of src/main/index.js

**Serial port debugging:** Check baudRate (9600), delimiter (\r\n), and port config in `connectPort` handler

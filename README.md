# Zephyr Robinhood Chain Launcher

Local interface for deploying and managing the Zephyr token on Robinhood Chain.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

Open:

```text
http://127.0.0.1:5174/
```

## Build

```bash
npm run build
```

## Notes

- Robinhood Chain RPC is prefilled in the app.
- Router is prefilled in the app.
- The app exports fresh contract artifacts before running or building.
- Do not share private keys except on a machine you trust.

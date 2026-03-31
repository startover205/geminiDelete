# Delete Shortcut for Gemini™

Browser extension for quickly deleting Gemini conversations with a custom shortcut.

## Features

- Runs on `https://gemini.google.com/*`
- Lets you configure a shortcut from the popup UI
- Built with React, TypeScript, and Vite

## Development

Install dependencies:

```bash
yarn
```

Start Chrome development build:

```bash
yarn dev
```

Build production extension:

```bash
yarn build
```

## Load The Extension

1. Run `yarn dev` or `yarn build`
2. Open `chrome://extensions`
3. Enable Developer mode
4. Click `Load unpacked`
5. Select `/Users/mingtayang/Documents/Projects/geminiDelete/dist_chrome`

## Project Structure

- `src/pages/content`: content script injected into Gemini
- `src/pages/popup`: popup UI for shortcut settings
- `manifest.json`: extension manifest

## Notes

- Build output is generated in `dist_chrome/`
- `node_modules/` and build artifacts are ignored by Git

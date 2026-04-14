# Hashx — Online Hash Tool

A fast, privacy-first hash toolkit that runs entirely in your browser.  
No data is ever sent to a server — all computation happens locally on your device.

## Features

### Supported Algorithms

| Algorithm | Output | Notes |
|-----------|--------|-------|
| MD5 | 128 bit | Legacy; useful for checksums |
| SHA-1 | 160 bit | Legacy; avoid for security use |
| SHA-256 | 256 bit | Widely used; recommended |
| SHA-512 | 512 bit | Higher security variant |
| SHA-3 | 224 / 256 / 384 / 512 bit | Latest NIST standard; also Keccak-256 |
| BLAKE2b | 128–512 bit | Fast; configurable output length |
| BLAKE3 | 256 bit | Extremely fast; Merkle-tree based |
| RIPEMD-160 | 160 bit | Used in Bitcoin address derivation |
| HMAC | — | Message authentication using any of the above |

### Input Modes

- **Text** — paste or type any text, choose character encoding (UTF-8 / UTF-16LE / Latin-1)
- **File** — drag & drop or click to select a file (up to 100 MB)
- **Batch** — one value per line; results shown in a table with CSV export

### Output Options

- **Format** — Hex (lowercase), Hex (uppercase), Base64, Base64url (no padding)
- **Verify** — paste an expected hash to instantly check match / mismatch
- **History** — last 20 computations stored locally, each with a one-click copy button

### Additional Features

- 🌐 Internationalization — English, 简体中文, 日本語, Español, Français, Português
- 📱 PWA — installable on desktop and mobile, works fully offline after first load
- 🔒 Privacy — zero network requests for computation; 100% client-side via [@noble/hashes](https://github.com/paulmillr/noble-hashes)

## Tech Stack

| Layer | Library |
|-------|---------|
| UI framework | React 19 + TypeScript |
| Routing | React Router 7 |
| UI components | Material UI (MUI) 7 |
| State management | Jotai |
| Hash algorithms | @noble/hashes 2, @pnnh/atom |
| Build tool | Vite 7 |
| PWA | vite-plugin-pwa |
| Deployment | Cloudflare Workers / Pages |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:1420)
pnpm dev

# Type-check + production build
pnpm build

# Preview production build
pnpm preview
```

### Deploy to Cloudflare

```bash
pnpm deploy        # Cloudflare Workers
```

### Build as Tauri Desktop App

```bash
pnpm tauri         # Requires Rust + Tauri CLI
```

## Project Structure

```
src/
├── components/
│   ├── HashTool.tsx       # Shared hash tool UI (tabs, options, verify, history)
│   └── dropmenu.tsx       # Styled MUI dropdown menu
├── pages/
│   ├── md5/               # MD5 hash page
│   ├── sha1/              # SHA-1 hash page
│   ├── sha256/            # SHA-256 hash page
│   ├── sha512/            # SHA-512 hash page
│   ├── sha3/              # SHA-3 / Keccak page (variant selector)
│   ├── blake2b/           # BLAKE2b page (output length selector)
│   ├── blake3/            # BLAKE3 page
│   ├── ripemd160/         # RIPEMD-160 page
│   └── hmac/              # HMAC page (algorithm + key input)
├── layout/
│   ├── navbar.tsx         # Top navigation bar
│   ├── layout.tsx         # Page layout wrapper
│   ├── global.tsx         # MUI ThemeProvider + Jotai Provider
│   ├── language.tsx       # Language selector component
│   └── theme.tsx          # MUI light theme definition
├── locales/
│   ├── language.tsx       # Supported languages, URL helpers
│   ├── texts.ts           # All translation strings (6 languages)
│   └── normal.ts          # transKey() lookup function
└── utils/
    ├── hash.ts            # formatHashOutput, textToBytes, history helpers, CSV export
    ├── clipboard.ts       # copyToClipboard with fallback
    └── storage.ts         # localStorage helpers
```

## URL Scheme

```
/                        → MD5 (browser language auto-detected)
/:lang                   → MD5
/:lang/sha1              → SHA-1
/:lang/sha256            → SHA-256
/:lang/sha512            → SHA-512
/:lang/sha3              → SHA-3
/:lang/blake2b           → BLAKE2b
/:lang/blake3            → BLAKE3
/:lang/ripemd160         → RIPEMD-160
/:lang/hmac              → HMAC
```

Supported `lang` values: `en`, `zh`, `ja`, `es`, `fr`, `pt-PT`

## Privacy

All hash computations are performed locally using WebCrypto-grade libraries.  
No input text, file contents, or results are transmitted over the network.  
History is stored only in your browser's `localStorage` and never leaves your device.

## License

MIT

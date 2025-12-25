# Simagizer - Copilot Instructions

## Project Overview
Chrome Extension (Manifest V3) built with React 18 + Vite using `@crxjs/vite-plugin`. Summarizes web content, generates DALL-E 3 images, and transcribes/translates audio via OpenAI APIs.

## Architecture

### Entry Points
- **Popup UI**: `src/popup/` - Main React application shown when clicking the extension icon
- **Options Page**: `src/options/` - Settings configuration page (referenced in manifest, implement if missing)
- **Background**: `src/background/sw.js` - Service worker for background tasks
- **Content Script**: `src/content/content.js` - Runs on web pages for text extraction

### Data Flow
1. User signs in with OpenAI API key → validated via `validateApiKey()` → stored in `chrome.storage.local`
2. Text extraction: Selected text → YouTube transcript → Page paragraphs (fallback chain in `extractTextFromTab()`)
3. Long text chunked at 4000 chars, summarized per chunk, then combined summaries re-summarized

### Storage Strategy
```javascript
// Local storage (chrome.storage.local) - Per-device data:
api_key, summaries, speechTranscriptions, speechTranslations

// Sync storage (chrome.storage.sync) - User settings across devices:
prompt, temperature, max_tokens, top_p, frequency_penalty, presence_penalty, size, model
```

## Key Patterns

### Custom Hooks (`src/hooks/index.js`)
All state management through React hooks wrapping Chrome storage:
- `useAuth()` - API key authentication state
- `useSummaries()` - CRUD operations for summaries
- `useSettings()` - Read-only settings from sync storage
- `useSpeech()` - Transcription/translation management

### API Layer (`src/utils/api.js`)
- Chat models (`gpt-3.5-turbo`, `gpt-4`, `gpt-4-turbo`) use `/v1/chat/completions`
- Legacy models use `/v1/completions` - determined by `CHAT_MODELS` array
- All API calls require passing `apiKey` and `settings` as parameters
- Image generation hardcoded to `dall-e-3`

### Constants (`src/utils/constants.js`)
Add new models to both `CHAT_MODELS` (if chat-based) and `AVAILABLE_MODELS` arrays.

## Development

### Commands
```bash
npm run dev    # Start dev server with HMR
npm run build  # Build to /dist for Chrome loading
```

### Testing in Chrome
1. Run `npm run build`
2. Open `chrome://extensions`, enable Developer Mode
3. "Load unpacked" → select `/dist` folder

### Adding New Components
Place in `src/popup/components/` - components are imported directly (no barrel file). Follow existing pattern:
```jsx
// Component receives apiKey and settings as props from App.jsx
function NewFeature({ apiKey, settings }) { ... }
```

## CSS Conventions
- Single stylesheet: `src/popup/styles.css` with CSS custom properties
- CSS Variables: `--cyan: #00e5ff`, `--magenta: #e040fb`, `--pink: #ff4081`
- Dark theme: `--dark-bg: #0d1117`, `--dark-card: #161b22`, `--dark-border: #30363d`
- Gradient: `--gradient-primary: linear-gradient(135deg, var(--cyan) 0%, var(--magenta) 100%)`
- Button variants: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.btn-small`
- Fixed popup dimensions: min-width 380px, min-height 400px

## Common Gotchas
- Chrome APIs return promises but need wrapping (see `storage.js` patterns)
- `extractTextFromTab()` requires `activeTab` permission - only works on http/https URLs
- Settings use string values for numbers - always `parseFloat()`/`parseInt()` before API calls

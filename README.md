# Simagizer

A Chrome extension that summarizes web content using OpenAI GPT models and generates AI images from summaries using DALL-E 3.

![Simagizer](icons/icon128.png)

## Features

- **Web Page Summarization** - Extract and summarize content from any web page using GPT-4, GPT-4o, GPT-3.5-turbo, and more
- **AI Image Generation** - Generate images from summaries using DALL-E 3
- **Audio Transcription** - Transcribe audio files (mp3, wav, m4a) using OpenAI Whisper
- **Audio Translation** - Translate audio from any language to English
- **Save & Export** - Save summaries locally, download generated images
- **Social Sharing** - Share summaries to LinkedIn, X (Twitter), and Facebook

## Installation

### From Chrome Web Store
Coming soon...

### Manual Installation (Developer Mode)
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Open Chrome and go to `chrome://extensions`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` folder

## Usage

1. Click the Simagizer icon in your browser toolbar
2. Sign in with your OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
3. Navigate to any web page and click "Summarize"
4. Generate images from your summaries
5. Share or download your content

## Configuration

Access settings via the ⚙️ icon to configure:
- **Model** - Choose from GPT-4o, GPT-4, GPT-3.5-turbo, O3, O4-mini, and more
- **Temperature** - Control creativity (0-2)
- **Max Tokens** - Set response length limit
- **Image Size** - 1024x1024, 1024x1792, or 1792x1024

## Tech Stack

- React 18
- Vite
- @crxjs/vite-plugin (Chrome Extension bundling)
- OpenAI API (GPT, DALL-E 3, Whisper)
- Chrome Extension Manifest V3

## Privacy

This extension:
- Only accesses web pages when you click "Summarize"
- Stores data locally on your device
- Only communicates with OpenAI's API
- Does not collect or sell personal data

See our full [Privacy Policy](PRIVACY.md)

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

For issues or feature requests, please [open an issue](https://github.com/arazdev/simagizer/issues).

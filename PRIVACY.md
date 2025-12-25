# Privacy Policy for Simagizer

**Last Updated: December 24, 2025**

## Overview

Simagizer is a Chrome browser extension that summarizes web content and generates AI images using OpenAI's services. This privacy policy explains how we handle your data.

## Data Collection

### What We Collect

**Website Content (Temporarily)**
- When you click "Summarize", the extension reads text content from the current web page
- This content is sent to OpenAI's API for processing
- The extension does not store the original page content

**User-Generated Content (Locally Stored)**
- Generated summaries
- Generated images (stored as base64)
- Your OpenAI API key (stored locally, never transmitted except to OpenAI)
- Your preference settings (model, temperature, etc.)

### What We Do NOT Collect

- Personal identification information
- Browsing history
- Cookies or tracking data
- Location data
- Financial information
- Any data from pages you don't explicitly summarize

## Data Storage

All data is stored **locally on your device** using Chrome's storage API:
- `chrome.storage.local` - For summaries, images, and API key
- `chrome.storage.sync` - For settings (synced across your Chrome browsers)

**We do not have servers that store your data.**

## Data Transmission

Data is only transmitted to:

**OpenAI API (api.openai.com)**
- Page text content → For summarization
- Summary text → For image generation prompts
- Audio files → For transcription/translation
- Your API key → For authentication with OpenAI

We do not transmit data to any other third parties.

## Third-Party Services

### OpenAI
This extension uses OpenAI's API services. When you use Simagizer, your content is processed according to [OpenAI's Privacy Policy](https://openai.com/privacy/) and [Terms of Use](https://openai.com/terms/).

## Your Rights

You can:
- **Delete all data** using the "Delete All" button in the extension
- **Remove the extension** which removes all locally stored data
- **Revoke API access** by regenerating your OpenAI API key

## Permissions Explained

| Permission | Purpose |
|------------|---------|
| `activeTab` | Read content from the current page when you click Summarize |
| `scripting` | Inject script to extract text from web pages |
| `storage` | Save your summaries, settings, and API key locally |
| `downloads` | Allow downloading generated images |
| `host_permissions` (api.openai.com) | Communicate with OpenAI's API |

## Children's Privacy

This extension is not intended for children under 13. We do not knowingly collect data from children.

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be reflected in the "Last Updated" date above.

## Contact

For privacy concerns or questions, please open an issue on our GitHub repository:
https://github.com/yourusername/simagizer/issues

## Summary

- ✅ All data stored locally on your device
- ✅ No tracking or analytics
- ✅ No data sold to third parties
- ✅ Only communicates with OpenAI's API
- ✅ You control your data

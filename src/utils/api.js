import { ENDPOINTS, CHAT_MODELS } from './constants';

/**
 * Validate API key by checking against OpenAI models endpoint
 */
export const validateApiKey = async (apiKey) => {
  try {
    const response = await fetch(ENDPOINTS.MODELS, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('API key validation error:', error);
    return false;
  }
};

/**
 * Summarize text using OpenAI API
 */
export const summarizeText = async (text, apiKey, settings) => {
  const { model, prompt, temperature, max_tokens, top_p, frequency_penalty, presence_penalty } =
    settings;

  const isChatModel = CHAT_MODELS.includes(model);
  const endpoint = isChatModel ? ENDPOINTS.CHAT_COMPLETIONS : ENDPOINTS.COMPLETIONS;

  // Newer models use different parameters
  const isNewerModel = ['gpt-5.1', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'o3', 'o4-mini', 'gpt-4o', 'gpt-4o-realtime-preview'].includes(model);

  const body = isChatModel
    ? {
        model,
        messages: [{ role: 'user', content: `${prompt}: ${text}` }],
        temperature: parseFloat(temperature),
        ...(isNewerModel 
          ? { max_completion_tokens: parseInt(max_tokens) }
          : { 
              max_tokens: parseInt(max_tokens),
              frequency_penalty: parseFloat(frequency_penalty),
              presence_penalty: parseFloat(presence_penalty),
            }),
        top_p: parseFloat(top_p),
      }
    : {
        model,
        prompt: `${prompt}: ${text}`,
        temperature: parseFloat(temperature),
        max_tokens: parseInt(max_tokens),
        top_p: parseFloat(top_p),
        frequency_penalty: parseFloat(frequency_penalty),
        presence_penalty: parseFloat(presence_penalty),
      };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.error?.message || `API request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return isChatModel ? json.choices[0].message.content : json.choices[0].text;
};

/**
 * Generate image using DALL-E 3
 */
export const generateImage = async (prompt, apiKey, size = '1024x1024') => {
  // Ensure valid size
  const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
  const imageSize = validSizes.includes(size) ? size : '1024x1024';
  
  const response = await fetch(ENDPOINTS.IMAGES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: imageSize,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error('Image API error:', errorData);
    const errorMessage = errorData?.error?.message || `Image generation failed (${response.status})`;
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json.data[0].url;
};

/**
 * Transcribe audio using Whisper
 */
export const transcribeAudio = async (file, apiKey) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-1');

  const response = await fetch(ENDPOINTS.AUDIO_TRANSCRIPTIONS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Transcription failed.');
  }

  const json = await response.json();
  return json.text;
};

/**
 * Translate audio using Whisper
 */
export const translateAudio = async (file, apiKey) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-1');

  const response = await fetch(ENDPOINTS.AUDIO_TRANSLATIONS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Translation failed.');
  }

  const json = await response.json();
  return json.text;
};

/**
 * Extract text from current tab
 */
export const extractTextFromTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url?.startsWith('http')) {
    throw new Error('This extension can only be used on web pages.');
  }

  // Try to get selected text first
  let [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => window.getSelection().toString(),
  });

  if (result && result.length > 0) {
    return { text: result, url: tab.url };
  }

  // Try YouTube transcript
  [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const segments = document.querySelectorAll(
        '.segment-text.style-scope.ytd-transcript-segment-renderer'
      );
      return Array.from(segments)
        .map((s) => s.innerText)
        .join(' ')
        .trim();
    },
  });

  if (result && result.length > 0) {
    return { text: result, url: tab.url };
  }

  // Fall back to all paragraphs
  [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const paragraphs = document.getElementsByTagName('p');
      return Array.from(paragraphs)
        .map((p) => p.textContent.trim())
        .join(' ')
        .trim();
    },
  });

  if (!result || result.length === 0) {
    throw new Error('Unable to extract text from this page.');
  }

  return { text: result, url: tab.url };
};

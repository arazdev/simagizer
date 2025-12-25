// Chrome Storage helpers
import { DEFAULT_SETTINGS } from './constants';

/**
 * Get value from chrome.storage.local
 */
export const getLocal = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
};

/**
 * Set value in chrome.storage.local
 */
export const setLocal = (data) => {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, resolve);
  });
};

/**
 * Remove value from chrome.storage.local
 */
export const removeLocal = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.local.remove(keys, resolve);
  });
};

/**
 * Get value from chrome.storage.sync
 */
export const getSync = (keys) => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, resolve);
  });
};

/**
 * Set value in chrome.storage.sync
 */
export const setSync = (data) => {
  return new Promise((resolve) => {
    chrome.storage.sync.set(data, resolve);
  });
};

// Specific storage operations

export const getApiKey = async () => {
  const result = await getLocal(['api_key']);
  return result.api_key || null;
};

export const setApiKey = async (apiKey) => {
  await setLocal({ api_key: apiKey });
};

export const removeApiKey = async () => {
  await removeLocal(['api_key']);
};

export const getSummaries = async () => {
  const result = await getLocal(['summaries']);
  return result.summaries || [];
};

export const setSummaries = async (summaries) => {
  await setLocal({ summaries });
};

export const getSettings = async () => {
  const stored = await getSync([
    'prompt',
    'temperature',
    'max_tokens',
    'top_p',
    'frequency_penalty',
    'presence_penalty',
    'size',
    'model',
  ]);
  // Merge with defaults to ensure all settings have values
  return { ...DEFAULT_SETTINGS, ...stored };
};

export const setSettings = async (settings) => {
  await setSync(settings);
};

export const getSpeechTranscriptions = async () => {
  const result = await getLocal(['speechTranscriptions']);
  return result.speechTranscriptions || [];
};

export const setSpeechTranscriptions = async (transcriptions) => {
  await setLocal({ speechTranscriptions: transcriptions });
};

export const getSpeechTranslations = async () => {
  const result = await getLocal(['speechTranslations']);
  return result.speechTranslations || [];
};

export const setSpeechTranslations = async (translations) => {
  await setLocal({ speechTranslations: translations });
};

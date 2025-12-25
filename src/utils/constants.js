// OpenAI API endpoints
export const ENDPOINTS = {
  CHAT_COMPLETIONS: 'https://api.openai.com/v1/chat/completions',
  COMPLETIONS: 'https://api.openai.com/v1/completions',
  IMAGES: 'https://api.openai.com/v1/images/generations',
  AUDIO_TRANSCRIPTIONS: 'https://api.openai.com/v1/audio/transcriptions',
  AUDIO_TRANSLATIONS: 'https://api.openai.com/v1/audio/translations',
  MODELS: 'https://api.openai.com/v1/models',
};

// Default settings
export const DEFAULT_SETTINGS = {
  prompt: 'Summarize the article in maximum 300 characters',
  temperature: 0.3,
  max_tokens: 300,
  top_p: 0.7,
  frequency_penalty: 1,
  presence_penalty: 0.3,
  size: '1024x1024',
  model: 'gpt-4o',
};

// Chat models that use the chat completions endpoint
export const CHAT_MODELS = [
  'gpt-5.1',
  'gpt-5-mini',
  'gpt-5-nano',
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'o3',
  'o4-mini',
  'gpt-4o',
  'gpt-4o-realtime-preview',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo',
];

// Available models
export const AVAILABLE_MODELS = [
  { value: 'gpt-5.1', label: 'GPT-5.1' },
  { value: 'gpt-5-mini', label: 'GPT-5 Mini' },
  { value: 'gpt-5-nano', label: 'GPT-5 Nano' },
  { value: 'gpt-4.1', label: 'GPT-4.1' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
  { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano' },
  { value: 'o3', label: 'O3' },
  { value: 'o4-mini', label: 'O4 Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-realtime-preview', label: 'GPT-4o Realtime' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
];

// Image sizes for DALL-E 3
export const IMAGE_SIZES = [
  { value: '1024x1024', label: '1024x1024' },
  { value: '1792x1024', label: '1792x1024 (Wide)' },
  { value: '1024x1792', label: '1024x1792 (Tall)' },
];

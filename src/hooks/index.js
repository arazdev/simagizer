import { useState, useEffect, useCallback } from 'react';
import {
  getApiKey,
  setApiKey as storeApiKey,
  removeApiKey,
  getSummaries,
  setSummaries as storeSummaries,
  getSettings,
  getSpeechTranscriptions,
  setSpeechTranscriptions,
  getSpeechTranslations,
  setSpeechTranslations,
} from '../utils/storage';
import { validateApiKey } from '../utils/api';

/**
 * Hook for managing API key authentication
 */
export const useAuth = () => {
  const [apiKey, setApiKeyState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApiKey = async () => {
      const key = await getApiKey();
      setApiKeyState(key);
      setIsAuthenticated(!!key);
      setIsLoading(false);
    };
    loadApiKey();
  }, []);

  const signIn = async (key) => {
    const isValid = await validateApiKey(key);
    if (isValid) {
      await storeApiKey(key);
      setApiKeyState(key);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signOut = async () => {
    await removeApiKey();
    setApiKeyState(null);
    setIsAuthenticated(false);
  };

  return { apiKey, isAuthenticated, isLoading, signIn, signOut };
};

/**
 * Hook for managing summaries
 */
export const useSummaries = () => {
  const [summaries, setSummariesState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSummaries = useCallback(async () => {
    setIsLoading(true);
    const data = await getSummaries();
    setSummariesState(data);
    setIsLoading(false);
  }, []);

  const addSummary = async (summary) => {
    const newSummary = {
      ...summary,
      timestamp: new Date().toLocaleString(),
      id: Date.now(),
    };
    const updated = [...summaries, newSummary];
    await storeSummaries(updated);
    setSummariesState(updated);
    return newSummary;
  };

  const deleteSummary = async (id) => {
    const updated = summaries.filter((s) => s.id !== id);
    await storeSummaries(updated);
    setSummariesState(updated);
  };

  const deleteAllSummaries = async () => {
    await storeSummaries([]);
    setSummariesState([]);
  };

  const updateSummary = async (id, updates) => {
    const updated = summaries.map((s) => (s.id === id ? { ...s, ...updates } : s));
    await storeSummaries(updated);
    setSummariesState(updated);
  };

  return {
    summaries,
    isLoading,
    loadSummaries,
    addSummary,
    deleteSummary,
    deleteAllSummaries,
    updateSummary,
  };
};

/**
 * Hook for managing settings
 */
export const useSettings = () => {
  const [settings, setSettingsState] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getSettings();
      setSettingsState(data);
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  return { settings, isLoading };
};

/**
 * Hook for managing speech transcriptions/translations
 */
export const useSpeech = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSpeechData = async () => {
    setIsLoading(true);
    const [trans, transl] = await Promise.all([
      getSpeechTranscriptions(),
      getSpeechTranslations(),
    ]);
    setTranscriptions(trans);
    setTranslations(transl);
    setIsLoading(false);
  };

  const addTranscription = async (text) => {
    const updated = [...transcriptions, { text, id: Date.now() }];
    await setSpeechTranscriptions(updated);
    setTranscriptions(updated);
  };

  const addTranslation = async (text) => {
    const updated = [...translations, { text, id: Date.now() }];
    await setSpeechTranslations(updated);
    setTranslations(updated);
  };

  const deleteAllSpeech = async () => {
    await setSpeechTranscriptions([]);
    await setSpeechTranslations([]);
    setTranscriptions([]);
    setTranslations([]);
  };

  return {
    transcriptions,
    translations,
    isLoading,
    loadSpeechData,
    addTranscription,
    addTranslation,
    deleteAllSpeech,
  };
};

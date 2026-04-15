import React, { useState, useEffect } from 'react';
import { getSync, setSync } from '../utils/storage';
import { DEFAULT_SETTINGS, AVAILABLE_MODELS, IMAGE_SIZES } from '../utils/constants';

function Options({ onBack }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const stored = await getSync(Object.keys(DEFAULT_SETTINGS));
      setSettings({ ...DEFAULT_SETTINGS, ...stored });
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    await setSync(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'right', marginBottom: '8px' }}>
        <button 
          onClick={() => onBack ? onBack() : window.close()} 
          className="btn btn-small"
        >
          ← Back
        </button>
      </div>
      <header>
        <h1>Simagizer Settings</h1>
        <p className="subtitle">Configure your OpenAI preferences</p>
      </header>

      <div className="form-group">
        <label>Model</label>
        <select name="model" value={settings.model} onChange={handleChange} className="form-select">
          {AVAILABLE_MODELS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Prompt</label>
        <textarea
          name="prompt"
          value={settings.prompt}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Temperature ({settings.temperature})</label>
        <input
          type="range"
          name="temperature"
          min="0"
          max="2"
          step="0.1"
          value={settings.temperature}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Max Tokens</label>
        <input
          type="number"
          name="max_tokens"
          value={settings.max_tokens}
          onChange={handleChange}
          min="1"
          max="4096"
        />
      </div>

      <div className="form-group">
        <label>Top P ({settings.top_p})</label>
        <input
          type="range"
          name="top_p"
          min="0"
          max="1"
          step="0.1"
          value={settings.top_p}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Frequency Penalty ({settings.frequency_penalty})</label>
        <input
          type="range"
          name="frequency_penalty"
          min="0"
          max="2"
          step="0.1"
          value={settings.frequency_penalty}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Presence Penalty ({settings.presence_penalty})</label>
        <input
          type="range"
          name="presence_penalty"
          min="0"
          max="2"
          step="0.1"
          value={settings.presence_penalty}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Image Size</label>
        <select name="size" value={settings.size} onChange={handleChange} className="form-select">
          {IMAGE_SIZES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="form-actions" style={{ marginTop: '20px' }}>
        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}

export default Options;

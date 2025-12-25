import React, { useState } from 'react';
import { transcribeAudio, translateAudio, summarizeText } from '../../utils/api';

function SpeechToSummary({ apiKey, onSummarize, settings }) {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('transcribe'); // 'transcribe' or 'translate'

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      // First transcribe or translate
      const text = mode === 'transcribe'
        ? await transcribeAudio(file, apiKey)
        : await translateAudio(file, apiKey);

      // Then summarize
      const summary = await summarizeText(text, apiKey, settings);
      
      await onSummarize({
        textSummary: summary,
        url: `Audio: ${file.name}`,
        originalText: text,
      });

      setFile(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const RadioOption = ({ value, label }) => (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 14px',
        borderRadius: '8px',
        cursor: 'pointer',
        background: mode === value 
          ? 'linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(224,64,251,0.15) 100%)' 
          : 'rgba(22, 27, 34, 0.6)',
        border: mode === value 
          ? '1px solid rgba(0,229,255,0.4)' 
          : '1px solid #30363d',
        transition: 'all 0.2s',
      }}
    >
      <input
        type="radio"
        name="mode"
        value={value}
        checked={mode === value}
        onChange={(e) => setMode(e.target.value)}
        style={{ display: 'none' }}
      />
      <span style={{
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        border: mode === value ? '2px solid #00e5ff' : '2px solid #30363d',
        background: mode === value 
          ? 'linear-gradient(135deg, #00e5ff 0%, #e040fb 100%)' 
          : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        {mode === value && (
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#fff',
          }} />
        )}
      </span>
      <span style={{ fontSize: '0.85rem', color: '#f0f6fc' }}>
        {label}
      </span>
    </label>
  );

  return (
    <div style={{
      background: '#161b22',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #30363d',
    }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '0.8rem',
          color: '#8b949e',
          marginBottom: '8px',
        }}>
          Audio File
        </label>
        <div style={{
          position: 'relative',
          background: 'rgba(22, 27, 34, 0.8)',
          border: '1px dashed #30363d',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
            }}
          />
          {file ? (
            <div style={{ color: '#00e5ff', fontSize: '0.9rem' }}>
              {file.name}
            </div>
          ) : (
            <div>
              <div style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                Drop audio file or click to browse
              </div>
              <div style={{ color: '#6e7681', fontSize: '0.75rem', marginTop: '4px' }}>
                mp3, wav, m4a, webm, mp4
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '0.8rem',
          color: '#8b949e',
          marginBottom: '8px',
        }}>
          Mode
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <RadioOption 
            value="transcribe" 
            label="Transcribe (keep original language)" 
          />
          <RadioOption 
            value="translate" 
            label="Translate to English" 
          />
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleProcess}
        disabled={!file || isProcessing}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '0.9rem',
          opacity: (!file || isProcessing) ? 0.6 : 1,
        }}
      >
        {isProcessing ? 'Processing...' : 'Process & Summarize'}
      </button>
    </div>
  );
}

export default SpeechToSummary;

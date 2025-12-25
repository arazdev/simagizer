import React, { useState } from 'react';
import { useAuth, useSummaries, useSettings, useSpeech } from '../hooks';
import SignInForm from './components/SignInForm';
import SummaryList from './components/SummaryList';
import SummaryItem from './components/SummaryItem';
import TextToImage from './components/TextToImage';
import SpeechToSummary from './components/SpeechToSummary';
import { summarizeText, extractTextFromTab } from '../utils/api';

function App() {
  const { apiKey, isAuthenticated, isLoading: authLoading, signIn, signOut } = useAuth();
  const { summaries, loadSummaries, addSummary, deleteSummary, deleteAllSummaries, updateSummary } = useSummaries();
  const { settings } = useSettings();
  
  const [showSignIn, setShowSignIn] = useState(false);
  const [showTextToImage, setShowTextToImage] = useState(false);
  const [showSpeech, setShowSpeech] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [latestSummary, setLatestSummary] = useState(null);

  const handleSignIn = async (key) => {
    const success = await signIn(key);
    if (success) {
      setShowSignIn(false);
    } else {
      alert('Invalid API key. Please enter a valid key.');
    }
  };

  const handleSummarize = async () => {
    if (!apiKey) return;
    
    setIsSummarizing(true);
    setLatestSummary(null);
    try {
      const { text, url } = await extractTextFromTab();
      
      // Chunk text if too long (4000 char limit)
      const chunkSize = 4000;
      let summaryText;
      if (text.length <= chunkSize) {
        summaryText = await summarizeText(text, apiKey, settings);
      } else {
        // Handle long text with chunking
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
          chunks.push(text.substring(i, i + chunkSize));
        }
        
        summaryText = '';
        for (const chunk of chunks) {
          const chunkSummary = await summarizeText(chunk, apiKey, settings);
          summaryText += chunkSummary + ' ';
        }
        
        // Summarize the combined summaries if needed
        if (summaryText.length > chunkSize) {
          summaryText = await summarizeText(summaryText, apiKey, settings);
        }
        summaryText = summaryText.trim();
      }
      
      const newSummary = await addSummary({ textSummary: summaryText, url });
      setLatestSummary(newSummary);
      
      await loadSummaries();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSummarizing(false);
    }
  };

  if (authLoading) {
    return <div className="container loading">Loading...</div>;
  }

  return (
    <div className="container">
      <header>
        <a href="options.html" className="settings-icon" title="Settings">⚙️</a>
        <h1>Simagizer</h1>
        <p className="subtitle"></p>
      </header>

      {!isAuthenticated ? (
        <div className="auth-section">
          {!showSignIn ? (
            <button className="btn btn-primary" onClick={() => setShowSignIn(true)}>
              Sign In
            </button>
          ) : (
            <SignInForm
              onSubmit={handleSignIn}
              onCancel={() => setShowSignIn(false)}
            />
          )}
        </div>
      ) : (
        <div className="main-section">
          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={handleSummarize}
              disabled={isSummarizing}
            >
              {isSummarizing ? 'Summarizing...' : 'Summarize'}
            </button>
          </div>

          {/* Show latest summary immediately after summarizing */}
          {latestSummary && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#8b949e', 
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ 
                  background: 'linear-gradient(135deg, #00e5ff 0%, #e040fb 100%)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  color: '#000',
                  fontWeight: '600'
                }}>New</span>
                Latest Summary
              </div>
              <SummaryItem
                summary={latestSummary}
                onDelete={() => {
                  deleteSummary(latestSummary.id);
                  setLatestSummary(null);
                }}
                onUpdate={(updates) => updateSummary(latestSummary.id, updates)}
                apiKey={apiKey}
                settings={settings}
              />
            </div>
          )}

          <div className="button-group">
            <button className="btn" onClick={() => { loadSummaries(); setLatestSummary(null); }}>
              Load Saved
            </button>
            
            <button
              className="btn"
              onClick={() => setShowSpeech(!showSpeech)}
            >
              Speech to Summary
            </button>
            
            <button
              className="btn"
              onClick={() => setShowTextToImage(!showTextToImage)}
            >
              Text to Image
            </button>
          </div>

          {showSpeech && (
            <SpeechToSummary apiKey={apiKey} onSummarize={addSummary} settings={settings} />
          )}

          {showTextToImage && (
            <TextToImage apiKey={apiKey} settings={settings} />
          )}

          {summaries.length > 0 && (
            <>
              <div style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '8px' }}>
                Saved Summaries ({summaries.filter(s => !latestSummary || s.id !== latestSummary.id).length})
              </div>
              <SummaryList
                summaries={summaries.filter(s => !latestSummary || s.id !== latestSummary.id)}
                onDelete={deleteSummary}
                onUpdate={updateSummary}
                apiKey={apiKey}
                settings={settings}
              />
              <button className="btn btn-danger" onClick={() => { deleteAllSummaries(); setLatestSummary(null); }}>
                Delete All
              </button>
            </>
          )}

          <button className="btn btn-secondary" onClick={signOut}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

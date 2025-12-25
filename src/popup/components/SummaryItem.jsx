import React, { useState } from 'react';
import { generateImage } from '../../utils/api';

// Convert image URL to base64 data URL for permanent storage
const urlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function SummaryItem({ summary, onDelete, onUpdate, apiKey, settings }) {
  const [imageUrl, setImageUrl] = useState(summary.imageUrl || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const url = await generateImage(summary.textSummary, apiKey, settings.size);
      // Convert to base64 for permanent storage (DALL-E URLs expire after ~1 hour)
      const base64Url = await urlToBase64(url);
      setImageUrl(base64Url);
      // Save the base64 image to storage
      if (onUpdate) {
        await onUpdate({ imageUrl: base64Url });
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `simagizer-${summary.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open in new tab
      window.open(imageUrl, '_blank');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary.textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share to social media - opens share URL directly
  const handleShare = (platform) => {
    const text = summary.textSummary;
    const url = summary.url || '';
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url || 'https://simagizer.app')}`,
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text.slice(0, 280))}${url ? `&url=${encodeURIComponent(url)}` : ''}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url || 'https://simagizer.app')}&quote=${encodeURIComponent(text)}`,
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const ShareButton = ({ platform, children, title }) => (
    <button
      onClick={() => handleShare(platform)}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        background: 'rgba(22, 27, 34, 0.8)',
        color: '#f0f6fc',
        border: '1px solid #30363d',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s',
      }}
      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(224, 64, 251, 0.2)'; e.currentTarget.style.borderColor = '#e040fb'; }}
      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(22, 27, 34, 0.8)'; e.currentTarget.style.borderColor = '#30363d'; }}
    >
      {children}
    </button>
  );

  return (
    <div className="summary-item" style={{ 
      background: '#161b22', 
      borderRadius: '12px', 
      padding: '16px', 
      marginBottom: '12px',
      border: '1px solid #30363d',
      transition: 'border-color 0.2s'
    }}>
      <div className="summary-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span className="summary-time" style={{ 
          fontSize: '0.75rem', 
          color: '#8b949e',
          background: 'linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(224,64,251,0.15) 100%)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid rgba(0,229,255,0.2)'
        }}>{summary.timestamp}</span>
        <button 
          className="btn btn-small btn-danger" 
          onClick={onDelete}
          style={{ 
            padding: '4px 10px', 
            fontSize: '0.9rem',
            borderRadius: '6px',
            minWidth: 'auto'
          }}
        >×</button>
      </div>
      
      <p className="summary-text" style={{ 
        fontSize: '0.95rem', 
        lineHeight: '1.5',
        color: '#f0f6fc',
        marginBottom: '12px'
      }}>{summary.textSummary}</p>
      
      {summary.url && (
        <a 
          href={summary.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="summary-url"
          style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            color: '#00e5ff',
            textDecoration: 'none',
            marginBottom: '12px',
            opacity: 0.9
          }}
        >
          {new URL(summary.url).hostname}
        </a>
      )}

      <div className="summary-actions" style={{ 
        display: 'flex', 
        gap: '8px',
        marginTop: '8px'
      }}>
        <button
          className="btn btn-small"
          onClick={handleGenerateImage}
          disabled={isGenerating}
          style={{ 
            flex: 1,
            padding: '8px 12px',
            fontSize: '0.85rem',
            borderRadius: '6px'
          }}
        >
          {isGenerating ? 'Generating...' : imageUrl ? 'Regenerate' : 'Generate Image'}
        </button>
        
        {imageUrl && (
          <button 
            className="btn btn-small btn-primary" 
            onClick={handleDownload}
            style={{ 
              padding: '8px 12px',
              fontSize: '0.85rem',
              borderRadius: '6px'
            }}
          >
            Download
          </button>
        )}
      </div>

      {/* Share Icons */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginTop: '12px',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.8rem', color: '#8b949e', marginRight: '4px' }}>Share:</span>
        <ShareButton platform="linkedin" title="Share on LinkedIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </ShareButton>
        <ShareButton platform="x" title="Share on X">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </ShareButton>
        <ShareButton platform="facebook" title="Share on Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
        </ShareButton>
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: copied ? 'linear-gradient(135deg, rgba(0,229,255,0.3) 0%, rgba(224,64,251,0.3) 100%)' : 'rgba(22, 27, 34, 0.8)',
            color: '#f0f6fc',
            border: copied ? '1px solid #00e5ff' : '1px solid #30363d',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓' : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          )}
        </button>
      </div>

      {imageUrl && (
        <div className="summary-image" style={{ marginTop: '12px' }}>
          <img 
            src={imageUrl} 
            alt="Generated" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '8px',
              border: '1px solid #30363d',
              boxShadow: '0 4px 20px rgba(224, 64, 251, 0.15)'
            }} 
          />
        </div>
      )}
    </div>
  );
}

export default SummaryItem;

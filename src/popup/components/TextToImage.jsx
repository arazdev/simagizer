import React, { useState } from 'react';
import { generateImage } from '../../utils/api';

function TextToImage({ apiKey, settings }) {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const url = await generateImage(prompt, apiKey, settings.size);
      setImageUrl(url);
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
      a.download = `simagizer-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="text-to-image">
      <div className="form-group">
        <label>Image Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={3}
        />
      </div>
      
      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </button>

      {imageUrl && (
        <div className="generated-image" style={{ textAlign: 'center' }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginTop: '12px' }} />
          <button className="btn btn-small btn-primary" onClick={handleDownload} style={{ marginTop: '12px' }}>
            ⬇️ Download
          </button>
        </div>
      )}
    </div>
  );
}

export default TextToImage;

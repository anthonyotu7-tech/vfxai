import { useState } from 'react';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Video generation API not connected yet. This is a demo.');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">AI Video Generator</h1>
      <p className="text-white/60">Create videos with AI</p>
      
      <div className="bg-gray-900 border border-white/10 rounded-xl p-6">
        <label className="block text-sm text-white/60 mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white h-32 resize-none"
          placeholder="Describe your video..."
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-4 bg-gradient-to-r from-neon-purple to-neon-blue text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Video'}
        </button>
      </div>
    </div>
  );
}

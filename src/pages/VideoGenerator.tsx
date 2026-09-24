import { useState } from 'react';
import { Sparkles, Loader2, Download, Play, AlertCircle, Clock, Film } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);

  // Calculate credit cost (5 credits per second for Runway Gen-4 Turbo)
  const creditCost = duration * 5;

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (prompt.trim().length < 5) {
      setError('Prompt must be at least 5 characters');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setStatus('Starting video generation...');
    setPredictionId(null);

    try {
      // Get auth token from localStorage or your auth system
      const token = localStorage.getItem('vfxai.auth.token') || '';

      // Step 1: Call the generate API
      const response = await fetch('/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelId: 'runway-gen4-turbo',
          prompt: prompt.trim(),
          duration,
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start generation');
      }

      setPredictionId(data.predictionId);
      setStatus('Video is being generated... This may take 1-2 minutes.');

      // Step 2: Poll for completion
      await pollForCompletion(data.predictionId, token);

    } catch (err: any) {
      setError(err.message || 'Generation failed');
      setLoading(false);
    }
  };

  const pollForCompletion = async (id: string, token: string) => {
    const maxAttempts = 60; // 2 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/video/status?id=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check status');
        }

        if (data.status === 'succeeded' && data.video_url) {
          setVideoUrl(data.video_url);
          setStatus('Video generated successfully!');
          setLoading(false);
          return;
        }

        if (data.status === 'failed') {
          throw new Error(data.error_message || 'Video generation failed');
        }

        if (data.status === 'processing' || data.status === 'queued') {
          setStatus(`Processing... (${Math.min((attempts / maxAttempts) * 100, 95).toFixed(0)}%)`);
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000); // Poll every 2 seconds
        } else {
          throw new Error('Generation timed out. Please try again.');
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    poll();
  };

  const durations = [5, 10];
  const ratios: Array<'16:9' | '9:16' | '1:1'> = ['16:9', '9:16', '1:1'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Video Generator</h1>
        <p className="text-white/60 mt-2">Create videos with AI using Runway Gen-4 Turbo</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-red-400/80 text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
            
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Video Preview */}
        <Card className="p-6">
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
                autoPlay
              />
            ) : loading ? (
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-neon-purple animate-spin mx-auto mb-4" />
                <p className="text-white/80">{status}</p>
              </div>
            ) : (
              <div className="text-center text-white/40">
                <Play className="h-16 w-16 mx-auto mb-2" />
                <p>Your video will appear here</p>
              </div>
            )}
          </div>

          {videoUrl && (
            <div className="mt-4 flex gap-2">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-gradient-to-r from-neon-purple to-neon-blue">
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </Button>
              </a>
            </div>
          )}
        </Card>

        {/* Controls */}
        <Card className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Prompt <span className="text-white/60">(describe your video)</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic drone shot of a futuristic city at sunset with flying cars..."
              className="w-full h-32 bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple resize-none"
            />
            <p className="text-xs text-white/50 mt-1">{prompt.length} characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Duration</label>
            <div className="flex gap-2 flex-wrap">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    duration === d
                      ? 'border-neon-purple bg-neon-purple/20 text-white'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Aspect Ratio</label>
            <div className="flex gap-2 flex-wrap">
              {ratios.map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    aspectRatio === r
                      ? 'border-neon-purple bg-neon-purple/20 text-white'
                      : 'border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
            <Film className="h-4 w-4 text-blue-400" />
            <p className="text-blue-400 text-sm">
              Cost: <strong>{creditCost} credits</strong> ({duration}s × 5 credits/sec)
            </p>
          </div>

          <Button
            onClick={generateVideo}
            loading={loading}
            disabled={!prompt.trim() || loading}
            className="w-full bg-gradient-to-r from-neon-purple to-neon-blue"
            size="lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {loading ? 'Generating...' : 'Generate Video'}
          </Button>

          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-purple-400 text-sm">
              💡 <strong>Tip:</strong> Be specific in your prompt for better results. 
              Include style, lighting, and motion details.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
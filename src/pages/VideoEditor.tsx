import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, Music, Wand2, Play, Pause, Scissors, Layers, Download, X, Check, Film } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';

export default function VideoEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [textOverlay, setTextOverlay] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [selectedTransition, setSelectedTransition] = useState('Fade');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState('1080p');

  const transitions = ['Fade', 'Cut', 'Slide', 'Zoom', 'Glitch'];
  const qualities = ['4K', '1080p', '720p', '480p'];
  const formats = ['MP4', 'MOV', 'AVI', 'WebM'];
  const [selectedFormat, setSelectedFormat] = useState('MP4');

  const saveProject = () => {
    push({ type: 'success', title: 'Project saved', description: 'Your edits have been autosaved.' });
  };

  const handleExport = async () => {
    setShowExportModal(true);
    setExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExporting(false);
          push({ 
            type: 'success', 
            title: 'Export complete!', 
            description: `Your video has been exported in ${selectedQuality} ${selectedFormat}.` 
          });
          setTimeout(() => setShowExportModal(false), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold">Video Editor</h1>
            <p className="text-sm text-white/60">Project ID: {id || 'demo-123'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveProject}>Save Draft</Button>
          <Button onClick={handleExport} className="bg-gradient-to-r from-neon-purple to-neon-blue">
            <Download className="h-4 w-4 mr-2" /> Export Video
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main Preview & Timeline */}
        <div className="space-y-4">
          <Card className="p-0 overflow-hidden bg-black aspect-video flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <div className="text-center">
                  <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-neon-purple/20 flex items-center justify-center">
                    <Play className="h-10 w-10 text-neon-purple" />
                  </div>
                  <p className="text-white/80 font-semibold">Playing Preview...</p>
                  {textOverlay && (
                    <p className="absolute bottom-10 text-2xl font-bold drop-shadow-lg" style={{ color: textColor }}>{textOverlay}</p>
                  )}
                </div>
              ) : (
                <button onClick={() => setIsPlaying(true)} className="h-20 w-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition">
                  <Play className="h-10 w-10 text-white" />
                </button>
              )}
            </div>
            
            {/* Mock Timeline */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-ink-900/90 border-t border-white/10 p-2 flex items-center gap-2">
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded bg-white/10 hover:bg-white/20">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <div className="flex-1 h-8 bg-ink-800 rounded relative overflow-hidden flex">
                <div className="w-1/3 h-full bg-neon-purple/40 border-r border-white/20 flex items-center justify-center text-[10px] text-white/70">Clip 1</div>
                <div className="w-1/4 h-full bg-neon-blue/40 border-r border-white/20 flex items-center justify-center text-[10px] text-white/70">Clip 2</div>
                <div className="w-1/2 h-full bg-neon-pink/40 flex items-center justify-center text-[10px] text-white/70">Clip 3</div>
              </div>
              <button className="p-2 rounded bg-white/10 hover:bg-white/20"><Scissors className="h-4 w-4" /></button>
            </div>
          </Card>
        </div>

        {/* Editor Controls */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-neon-purple">
              <Type className="h-5 w-5" />
              <h3 className="font-semibold text-white">Text Overlays</h3>
            </div>
            <Input label="Overlay Text" placeholder="Enter text..." value={textOverlay} onChange={e => setTextOverlay(e.target.value)} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Text Color</label>
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="h-10 w-full rounded-lg cursor-pointer" />
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-neon-blue">
              <Wand2 className="h-5 w-5" />
              <h3 className="font-semibold text-white">Transitions</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {transitions.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTransition(t)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                    selectedTransition === t ? 'border-neon-blue bg-neon-blue/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-2 text-neon-pink">
              <Music className="h-5 w-5" />
              <h3 className="font-semibold text-white">Audio & Music</h3>
            </div>
            <Button variant="outline" className="w-full"><Layers className="h-4 w-4" /> Add Audio Track</Button>
          </Card>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass rounded-2xl p-6 border border-white/10 shadow-neon">
            {!exporting ? (
              <>
                <button onClick={() => setShowExportModal(false)} className="absolute right-4 top-4 text-white/50 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-purple/20 text-neon-purple">
                    <Film className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Export Video</h2>
                    <p className="text-sm text-white/60">Choose your export settings</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Quality</label>
                    <div className="flex flex-wrap gap-2">
                      {qualities.map(q => (
                        <button
                          key={q}
                          onClick={() => setSelectedQuality(q)}
                          className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                            selectedQuality === q ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">Format</label>
                    <div className="flex flex-wrap gap-2">
                      {formats.map(f => (
                        <button
                          key={f}
                          onClick={() => setSelectedFormat(f)}
                          className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                            selectedFormat === f ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-ink-800 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Estimated size</span>
                      <span className="font-semibold text-white">~{selectedQuality === '4K' ? '2.5' : selectedQuality === '1080p' ? '850' : '420'} MB</span>
                    </div>
                  </div>

                  <Button onClick={handleExport} className="w-full" size="lg">
                    <Download className="h-4 w-4 mr-2" /> Start Export
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neon-purple/20 text-neon-purple">
                  <Film className="h-10 w-10 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Exporting Video...</h2>
                <p className="text-sm text-white/60 mb-6">Please wait while we process your video</p>
                
                <div className="w-full bg-ink-800 rounded-full h-3 mb-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-neon-purple to-neon-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
                <p className="text-sm text-white/80">{exportProgress}% complete</p>
                
                {exportProgress === 100 && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">Export complete!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
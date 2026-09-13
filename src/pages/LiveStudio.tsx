import { useEffect, useRef, useState } from 'react';
import {
  Video as VideoIcon, Mic, Monitor, UserRound, Wand2, Image as ImageIcon,
  Radio, Square, Play,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DemoBadge } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { MOCK_AVATARS } from '@/lib/mock-data';

export default function LiveStudio() {
  const { push } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: micOn })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(err => {
          setError('Camera permission denied or unavailable.');
          setCameraOn(false);
        });
    } else if (stream) {
if (stream) {
  const tracks = stream.getTracks();
  tracks.forEach((track) => track.stop());
}
    }
    return () => { stream?.getTracks().forEach(t => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraOn]);

  const toggleLive = () => {
    if (!cameraOn) { push({ type: 'error', title: 'Start the camera first' }); return; }
    setLive(v => !v);
    push({ type: 'info', title: live ? 'Stream ended' : 'You are live (demo)' });
  };

  const ToolBtn = ({ active, onClick, children, title }: any) => (
    <button
      title={title}
      onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
        active ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Live Studio</h1>
          <p className="mt-1 text-white/60">AI-powered live video workspace.</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-0 overflow-hidden">
          <div className="relative aspect-video bg-ink-800">
            {cameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <VideoIcon className="mx-auto h-12 w-12 text-white/20" />
                  <p className="mt-3 text-sm text-white/50">{error || 'Camera is off'}</p>
                </div>
              </div>
            )}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {live && (
                <span className="flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
                </span>
              )}
              <Badge tone={cameraOn ? 'success' : 'default'}>{cameraOn ? 'Camera' : 'Camera off'}</Badge>
              <Badge tone={micOn ? 'success' : 'warning'}>{micOn ? 'Mic on' : 'Mic muted'}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-4 border-t border-white/5">
            <ToolBtn active={cameraOn} onClick={() => setCameraOn(v => !v)} title="Camera">
              <VideoIcon className="h-4 w-4" />
            </ToolBtn>
            <ToolBtn active={micOn} onClick={() => setMicOn(v => !v)} title="Microphone">
              <Mic className="h-4 w-4" />
            </ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Screen share (demo)' })} title="Screen share">
              <Monitor className="h-4 w-4" />
            </ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Select avatar (demo)' })} title="Avatar">
              <UserRound className="h-4 w-4" />
            </ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Face effects (demo)' })} title="Face effect">
              <Wand2 className="h-4 w-4" />
            </ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Backgrounds (demo)' })} title="Background">
              <ImageIcon className="h-4 w-4" />
            </ToolBtn>

            <div className="ml-auto flex items-center gap-2">
              {!live ? (
                <Button onClick={() => { if (!cameraOn) { setCameraOn(true); } }}><Play className="h-4 w-4" /> Start Camera</Button>
              ) : null}
              <Button variant={live ? 'danger' : 'primary'} onClick={toggleLive}>
                {live ? <><Square className="h-4 w-4" /> Stop Live</> : <><Radio className="h-4 w-4" /> Start Live</>}
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold">AI Avatars</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {MOCK_AVATARS.map(a => (
                <button key={a.id} className="rounded-xl border border-white/10 overflow-hidden hover:border-neon-purple/40">
                  <img src={a.thumbnail_url} alt={a.name} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold">AI Effects</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {['Neon', 'Cyber', 'Anime', 'Sketch', 'Glow', 'Retro'].map(e => (
                <button key={e} className="rounded-xl border border-white/10 bg-ink-800 py-3 text-xs hover:border-neon-purple/40">
                  {e}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <h3 className="font-semibold">Backgrounds</h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-video rounded-lg bg-gradient-to-br from-neon-purple/30 to-neon-blue/20" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
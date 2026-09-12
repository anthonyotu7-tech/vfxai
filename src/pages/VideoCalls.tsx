import { useState } from 'react';
import { Mic, MicOff, Video as VIcon, VideoOff, Volume2, Monitor, UserRound, Wand2, PhoneOff } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DemoBadge } from '@/components/ui/Toast';

export default function VideoCalls() {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [inCall, setInCall] = useState(false);

  const ToolBtn = ({ active, onClick, children, danger }: any) => (
    <button
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
        danger
          ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500'
          : active
            ? 'border-neon-purple bg-neon-purple/15 text-white'
            : 'border-white/10 bg-ink-800 text-white/70 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">AI Video Calls</h1>
          <p className="mt-1 text-white/60">Interactive video calls with AI avatars.</p>
        </div>
        <DemoBadge />
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="relative aspect-video bg-ink-800">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <UserRound className="mx-auto h-20 w-20 text-white/20" />
              <p className="mt-3 text-sm text-white/50">{inCall ? 'Connected to demo participant' : 'Start a call to connect'}</p>
            </div>
          </div>

          {/* Self preview */}
          <div className="absolute bottom-4 right-4 h-28 w-40 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-pink/20 border border-white/10 overflow-hidden">
            <div className="flex h-full items-center justify-center text-xs text-white/60">You</div>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2">
            {inCall && (
              <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> In call · 00:42
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 p-5 border-t border-white/5">
          <ToolBtn active={mic} onClick={() => setMic(v => !v)}>
            {mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </ToolBtn>
          <ToolBtn active={cam} onClick={() => setCam(v => !v)}>
            {cam ? <VIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </ToolBtn>
          <ToolBtn active={true} onClick={() => {}}><Volume2 className="h-5 w-5" /></ToolBtn>
          <ToolBtn active={false} onClick={() => {}}><Monitor className="h-5 w-5" /></ToolBtn>
          <ToolBtn active={false} onClick={() => {}}><UserRound className="h-5 w-5" /></ToolBtn>
          <ToolBtn active={false} onClick={() => {}}><Wand2 className="h-5 w-5" /></ToolBtn>
          <ToolBtn danger onClick={() => setInCall(false)}><PhoneOff className="h-5 w-5" /></ToolBtn>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" onClick={() => setInCall(true)} disabled={inCall}>
          {inCall ? 'In call…' : 'Start demo call'}
        </Button>
      </div>
    </div>
  );
}
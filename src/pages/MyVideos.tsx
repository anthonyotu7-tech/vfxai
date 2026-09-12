import { useState } from 'react';
import { Play, Download, Share2, Trash2, MoreVertical, Edit, X, Film } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import type { VideoProject } from '@/types';

const statusTone = { completed: 'success', processing: 'warning', queued: 'info', failed: 'danger' } as const;

export default function MyVideos() {
  const { push } = useToast();
  // Make videos state mutable so we can delete them
  const [videos, setVideos] = useState<VideoProject[]>(MOCK_PROJECTS);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<VideoProject | null>(null);

  const handlePlay = (video: VideoProject) => {
    setPlayingVideo(video);
  };

  const handleDownload = (video: VideoProject) => {
    push({ 
      type: 'success', 
      title: 'Download started', 
      description: `${video.title} is being saved to your device.` 
    });
    setActiveMenu(null);
  };

  const handleDelete = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    push({ type: 'success', title: 'Video deleted', description: 'The video has been removed from your library.' });
    setActiveMenu(null);
  };

  const handleShare = (video: VideoProject) => {
    push({ 
      type: 'info', 
      title: 'Share link copied', 
      description: `Link for "${video.title}" copied to clipboard!` 
    });
    setActiveMenu(null);
  };

  const handleEdit = (id: string) => {
    window.location.href = `/editor/${id}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">My Videos</h1>
        <p className="mt-1 text-white/60">Your video library.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Completed', 'Processing', 'Failed'].map(filter => (
          <button
            key={filter}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              filter === 'All' ? 'bg-neon-purple/20 text-white border border-neon-purple/50' : 'bg-white/5 text-white/70 border border-white/10 hover:border-white/20'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-20">
          <Film className="mx-auto h-12 w-12 text-white/20" />
          <h3 className="mt-4 text-lg font-semibold text-white">No videos yet</h3>
          <p className="mt-2 text-white/60">Generate your first video to see it here.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map(video => (
            <Card key={video.id} className="group p-0 overflow-hidden">
              <div className="relative aspect-video bg-ink-800">
                <img src={video.thumbnail_url} alt={video.title} className="h-full w-full object-cover" />
                <div className="absolute bottom-2 left-2 rounded-md bg-black/80 px-2 py-1 text-xs text-white">
                  0:{video.duration_sec.toString().padStart(2, '0')}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge tone={statusTone[video.status]}>{video.status}</Badge>
                </div>
                {/* Hover Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition">
                  <button 
                    onClick={() => handlePlay(video)}
                    className="rounded-full bg-white/20 p-4 backdrop-blur hover:bg-white/30 transition"
                  >
                    <Play className="h-8 w-8 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">{video.title}</h3>
                <p className="mt-1 text-xs text-white/50">{video.created_at}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePlay(video)}
                      className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white transition"
                      title="Play"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDownload(video)}
                      className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white transition"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleShare(video)}
                      className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white transition"
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(video.id)}
                      className="rounded-lg p-2 text-white/60 hover:bg-rose-500/10 hover:text-rose-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Three Dots Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === video.id ? null : video.id)}
                      className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white transition"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    
                    {activeMenu === video.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-white/10 bg-ink-900 p-2 shadow-xl">
                          <button 
                            onClick={() => handleEdit(video.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                          >
                            <Edit className="h-4 w-4" /> Edit Video
                          </button>
                          <button 
                            onClick={() => handleShare(video)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5"
                          >
                            <Share2 className="h-4 w-4" /> Share
                          </button>
                          <button 
                            onClick={() => handleDelete(video.id)}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-white/5"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <button 
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Simulated Video Player */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-ink-900 to-black">
              <div className="h-24 w-24 rounded-full bg-neon-purple/20 flex items-center justify-center mb-6 animate-pulse">
                <Play className="h-12 w-12 text-neon-purple" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{playingVideo.title}</h2>
              <p className="text-white/60">Simulating playback... (Demo Mode)</p>
              
              {/* Mock Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="w-full h-1 bg-white/20 rounded-full mb-4">
                  <div className="w-1/3 h-full bg-neon-purple rounded-full" />
                </div>
                <div className="flex justify-between items-center text-white/80 text-sm">
                  <span>0:05 / 0:{playingVideo.duration_sec.toString().padStart(2, '0')}</span>
                  <div className="flex gap-4">
                    <button className="hover:text-white"><Play className="h-5 w-5" /></button>
                    <button className="hover:text-white"><Volume2Icon /></button>
                    <button className="hover:text-white"><MaximizeIcon /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple icon components to avoid extra imports
function Volume2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
  );
}

function MaximizeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
  );
}
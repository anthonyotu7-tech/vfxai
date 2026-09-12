#!/bin/bash
set -e

echo "🎬 Setting up Prompt 2: Dashboard Polish..."

# ─────────────────────────────────────────────
# 1. New UI Components (Skeleton, EmptyState, FileUpload, CommandPalette)
# ──────────────────────────────────────────────

cat > src/components/ui/Skeleton.tsx << 'EOF'
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-white/5', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/components/ui/EmptyState.tsx << 'EOF'
import { ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface Props {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white/40">
        {icon || <FolderOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-white/60">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">{actionLabel}</Button>
      )}
    </div>
  );
}
EOF

cat > src/components/ui/FileUpload.tsx << 'EOF'
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X, FileImage, FileVideo } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ onFileSelect, accept = "image/*,video/*", label = "Upload file" }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelect(file);
  };

  const clear = () => {
    setPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {preview ? (
        <div className="relative rounded-xl border border-neon-purple/30 bg-ink-800/50 p-2">
          {preview.startsWith('data:image') || fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img src={preview} alt="Preview" className="h-32 w-full rounded-lg object-cover" />
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg bg-ink-900">
              <FileVideo className="h-8 w-8 text-white/40" />
            </div>
          )}
          <button
            onClick={clear}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-500"
          >
            <X className="h-3 w-3" />
          </button>
          <p className="mt-2 truncate text-xs text-white/60">{fileName}</p>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition',
            isDragging ? 'border-neon-purple bg-neon-purple/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          )}
        >
          <Upload className="mb-2 h-8 w-8 text-white/40" />
          <p className="text-sm font-medium text-white/80">{label}</p>
          <p className="mt-1 text-xs text-white/50">Drag & drop or click to browse</p>
        </div>
      )}
    </div>
  );
}
EOF

cat > src/components/ui/CommandPalette.tsx << 'EOF'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Video, UserRound, Radio, Sparkles, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const commands: Command[] = [
    { id: '1', label: 'Go to Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate('/dashboard') },
    { id: '2', label: 'Create New Video', icon: <Sparkles className="h-4 w-4" />, action: () => navigate('/video-generator') },
    { id: '3', label: 'AI Avatar Studio', icon: <UserRound className="h-4 w-4" />, action: () => navigate('/avatar-studio') },
    { id: '4', label: 'Live Studio', icon: <Radio className="h-4 w-4" />, action: () => navigate('/live-studio') },
    { id: '5', label: 'My Videos', icon: <Video className="h-4 w-4" />, action: () => navigate('/videos') },
    { id: '6', label: 'Settings', icon: <Settings className="h-4 w-4" />, action: () => navigate('/settings') },
    ...(user?.role === 'admin' ? [{ id: '7', label: 'Admin Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, action: () => navigate('/admin') }] : []),
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg glass rounded-2xl shadow-neon overflow-hidden">
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <Search className="h-5 w-5 text-white/40" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">ESC</kbd>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/50">No results found.</div>
          ) : (
            filtered.map(cmd => (
              <button
                key={cmd.id}
                onClick={() => { cmd.action(); onClose(); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-neon-purple">
                  {cmd.icon}
                </div>
                {cmd.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
EOF

# ──────────────────────────────────────────────
# 2. Supabase Service Layer (Data Fetching)
# ──────────────────────────────────────────────

cat > src/lib/supabase-service.ts << 'EOF'
import { supabase, isSupabaseEnabled } from './supabase';
import type { VideoProject, Avatar, CreditTransaction } from '@/types';
import { MOCK_PROJECTS, MOCK_AVATARS } from './mock-data';

// Simulate network delay for demo mode
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchProjects(userId: string): Promise<VideoProject[]> {
  if (!isSupabaseEnabled) {
    await delay(800);
    return MOCK_PROJECTS.filter(p => p.user_id === userId);
  }
  const { data, error } = await supabase!
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchAvatars(userId: string): Promise<Avatar[]> {
  if (!isSupabaseEnabled) {
    await delay(600);
    return MOCK_AVATARS.filter(a => a.user_id === userId);
  }
  const { data, error } = await supabase!
    .from('avatars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchCredits(userId: string): Promise<number> {
  if (!isSupabaseEnabled) {
    await delay(400);
    return 500; // Demo balance
  }
  const { data, error } = await supabase!
    .rpc('get_credits', { p_user_id: userId });
  if (error) throw error;
  return data || 0;
}

export async function createProject(project: Omit<VideoProject, 'id' | 'created_at'>): Promise<VideoProject> {
  if (!isSupabaseEnabled) {
    await delay(1000);
    return { ...project, id: 'p_' + Math.random().toString(36).slice(2), created_at: new Date().toISOString() } as VideoProject;
  }
  const { data, error } = await supabase!
    .from('projects')
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(projectId: string): Promise<void> {
  if (!isSupabaseEnabled) {
    await delay(500);
    return;
  }
  const { error } = await supabase!.from('projects').delete().eq('id', projectId);
  if (error) throw error;
}
EOF

# ──────────────────────────────────────────────
# 3. New Page: Video Detail
# ──────────────────────────────────────────────

cat > src/pages/VideoDetail.tsx << 'EOF'
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download, Share2, RefreshCw, Save, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import type { VideoProject } from '@/types';

const statusTone = { completed: 'success', processing: 'warning', queued: 'info', failed: 'danger' } as const;

export default function VideoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { push } = useToast();
  const [project, setProject] = useState<VideoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    // Simulate fetching
    setLoading(true);
    setTimeout(() => {
      const found = MOCK_PROJECTS.find(p => p.id === id);
      if (found) {
        setProject(found);
        setTitle(found.title);
      }
      setLoading(false);
    }, 600);
  }, [id]);

  const save = () => {
    if (project) {
      setProject({ ...project, title });
      push({ type: 'success', title: 'Project updated' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold">Video not found</h2>
        <Button onClick={() => navigate('/videos')} className="mt-4">Back to Videos</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/videos')} className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold">Video Details</h1>
          <p className="text-sm text-white/60">ID: {project.id}</p>
        </div>
        <div className="ml-auto">
          <Badge tone={statusTone[project.status]}>{project.status}</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-0 overflow-hidden">
          <div className="relative aspect-video bg-ink-800">
            {project.video_url ? (
              <video src={project.video_url} controls className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img src={project.thumbnail_url} alt={project.title} className="h-full w-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 flex flex-wrap gap-2">
            <Button variant="outline"><Play className="h-4 w-4" /> Play</Button>
            <Button variant="outline"><Download className="h-4 w-4" /> Download</Button>
            <Button variant="outline"><Share2 className="h-4 w-4" /> Share</Button>
            <Button variant="outline"><RefreshCw className="h-4 w-4" /> Regenerate</Button>
          </div>
        </Card>

        <Card className="space-y-5">
          <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} />
          
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Prompt</label>
            <div className="rounded-xl border border-white/10 bg-ink-800/50 p-3 text-sm text-white/80 min-h-[80px]">
              {project.prompt || 'No prompt provided.'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/50">Style</p>
              <p className="font-medium">{project.style}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Duration</p>
              <p className="font-medium">0:{project.duration_sec.toString().padStart(2, '0')}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Aspect Ratio</p>
              <p className="font-medium">{project.aspect_ratio}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Credits Used</p>
              <p className="font-medium">{project.credits_used}</p>
            </div>
          </div>

          <Button onClick={save} className="w-full"><Save className="h-4 w-4" /> Save Changes</Button>
        </Card>
      </div>
    </div>
  );
}
EOF

# ──────────────────────────────────────────────
# 4. Update Dashboard with Real Data & Skeletons
# ──────────────────────────────────────────────

cat > src/pages/Dashboard.tsx << 'EOF'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Video, UserRound, Clock, Coins, Plus, Sparkles, Radio, Phone, Play, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { fetchProjects, fetchAvatars } from '@/lib/supabase-service';
import type { VideoProject } from '@/types';

const quick = [
  { to: '/video-generator', label: 'Create Video', icon: Sparkles },
  { to: '/avatar-studio', label: 'Create Avatar', icon: UserRound },
  { to: '/live-studio', label: 'Start Live', icon: Radio },
  { to: '/video-calls', label: 'AI Video Call', icon: Phone },
];

const statusTone = { completed: 'success', processing: 'warning', queued: 'info', failed: 'danger' } as const;

export default function Dashboard() {
  const { user } = useAuth();
  const { credits } = useCredits();
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [avatarCount, setAvatarCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      fetchProjects(user.id),
      fetchAvatars(user.id)
    ]).then(([proj, av]) => {
      setProjects(proj);
      setAvatarCount(av.length);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  const totalMinutes = projects.reduce((acc, p) => acc + p.duration_sec, 0) / 60;

  const stats = [
    { label: 'Videos Created', value: loading ? null : projects.length, icon: Video, tone: 'from-neon-purple to-neon-blue' },
    { label: 'AI Avatars', value: loading ? null : avatarCount, icon: UserRound, tone: 'from-neon-blue to-neon-cyan' },
    { label: 'Minutes Generated', value: loading ? null : `${Math.round(totalMinutes)} min`, icon: Clock, tone: 'from-neon-cyan to-neon-pink' },
    { label: 'Credits Remaining', value: loading ? null : credits, icon: Coins, tone: 'from-neon-pink to-neon-purple' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}</h1>
        <p className="mt-1 text-white/60">Create something amazing today.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          loading ? <CardSkeleton key={i} /> : (
            <Card key={s.label} className="relative overflow-hidden">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.tone} opacity-20 blur-2xl`} />
              <div className="relative flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.tone}`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60">{s.label}</p>
                  <p className="font-display text-2xl font-bold">{s.value}</p>
                </div>
              </div>
            </Card>
          )
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quick.map(q => (
            <Link key={q.to} to={q.to}>
              <Card className="group cursor-pointer hover:border-neon-purple/40 transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 border border-neon-purple/30 group-hover:from-neon-purple/30">
                    <q.icon className="h-5 w-5 text-neon-purple" />
                  </div>
                  <span className="font-medium">{q.label}</span>
                  <Plus className="ml-auto h-4 w-4 text-white/40 group-hover:text-white" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Recent projects</h2>
          <Link to="/videos" className="text-xs text-white/60 hover:text-white">View all →</Link>
        </div>
        
        {loading ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-video rounded-2xl" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-3">
            <EmptyState 
              title="No videos yet" 
              description="Create your first AI video to see it here."
              actionLabel="Create Video"
              onAction={() => window.location.href = '/video-generator'}
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map(p => (
              <Link key={p.id} to={`/videos/${p.id}`}>
                <Card className="group overflow-hidden p-0 cursor-pointer">
                  <div className="relative aspect-video bg-ink-800 overflow-hidden">
                    <img src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px]">
                      <Play className="h-3 w-3" /> 0:{p.duration_sec.toString().padStart(2, '0')}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge tone={statusTone[p.status]}>{p.status}</Badge>
                    </div>
                  </div>
                  <div className="p-4 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{p.title}</p>
                      <p className="text-xs text-white/50 mt-0.5">{p.created_at}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
EOF

# ──────────────────────────────────────────────
# 5. Update App.tsx to include new routes & Command Palette
# ──────────────────────────────────────────────

cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { CreditsProvider } from '@/hooks/useCredits';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminShell } from '@/components/layout/AdminShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { CommandPalette } from '@/components/ui/CommandPalette';

import Landing from '@/pages/Landing';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';

import Dashboard from '@/pages/Dashboard';
import AvatarStudio from '@/pages/AvatarStudio';
import VideoGenerator from '@/pages/VideoGenerator';
import LiveStudio from '@/pages/LiveStudio';
import VideoCalls from '@/pages/VideoCalls';
import MyVideos from '@/pages/MyVideos';
import VideoDetail from '@/pages/VideoDetail';
import Templates from '@/pages/Templates';
import Credits from '@/pages/Credits';
import Settings from '@/pages/Settings';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import Users from '@/pages/admin/Users';
import Videos from '@/pages/admin/Videos';
import Avatars from '@/pages/admin/Avatars';
import CreditsAdmin from '@/pages/admin/CreditsAdmin';
import Transactions from '@/pages/admin/Transactions';
import Subscriptions from '@/pages/admin/Subscriptions';
import AdminSettings from '@/pages/admin/AdminSettings';

export default function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CreditsProvider>
            <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/avatar-studio" element={<AvatarStudio />} />
                <Route path="/video-generator" element={<VideoGenerator />} />
                <Route path="/live-studio" element={<LiveStudio />} />
                <Route path="/video-calls" element={<VideoCalls />} />
                <Route path="/videos" element={<MyVideos />} />
                <Route path="/videos/:id" element={<VideoDetail />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route element={<ProtectedRoute adminOnly><AdminShell /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/videos" element={<Videos />} />
                <Route path="/admin/avatars" element={<Avatars />} />
                <Route path="/admin/credits" element={<CreditsAdmin />} />
                <Route path="/admin/transactions" element={<Transactions />} />
                <Route path="/admin/subscriptions" element={<Subscriptions />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CreditsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
EOF

echo "✅ Prompt 2 setup complete!"
echo ""
echo "Run 'npm run dev' to see the updates."
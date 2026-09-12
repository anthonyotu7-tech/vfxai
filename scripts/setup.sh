#!/bin/bash
set -e

echo "🎬 Setting up VFXAI..."

# ──────────────────────────────────────────────
# Create directory structure
# ──────────────────────────────────────────────
mkdir -p supabase
mkdir -p src/types
mkdir -p src/lib
mkdir -p src/hooks
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/pages/admin

# ──────────────────────────────────────────────
# Root config files
# ──────────────────────────────────────────────

cat > package.json << 'EOF'
{
  "name": "vfxai",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.45.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.441.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4",
    "vite": "^5.4.2"
  }
}
EOF

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: { port: 5173 },
});
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
EOF

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05050a',
          900: '#0a0a14',
          800: '#10101f',
          700: '#16162a',
        },
        neon: {
          purple: '#a855f7',
          violet: '#8b5cf6',
          blue: '#3b82f6',
          cyan: '#22d3ee',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(rgba(168,85,247,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.07) 1px, transparent 1px)',
        'radial-glow':
          'radial-gradient(600px circle at 50% 0%, rgba(139,92,246,0.25), transparent 60%)',
      },
      boxShadow: {
        neon: '0 0 24px rgba(168,85,247,0.35), 0 0 60px rgba(59,130,246,0.15)',
        'neon-pink': '0 0 24px rgba(236,72,153,0.4)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
EOF

cat > postcss.config.js << 'EOF'
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
EOF

cat > .env.example << 'EOF'
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_PROVIDER=demo
EOF

cat > .env << 'EOF'
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_AI_PROVIDER=demo
EOF

cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>VFXAI — Create. Transform. Imagine.</title>
  </head>
  <body class="bg-ink-950 text-white antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

cat > README.md << 'EOF'
# VFXAI

Production-first AI video SaaS platform.

## Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Supabase (auth + database, optional)

## Getting started
```bash
npm install
npm run dev

---

## 📜 Part 2 of the Script (UI + Layout + Pages)

Since the script is very long, here's the continuation. **Append this to the same `setup.sh` file:**

```bash
# ──────────────────────────────────────────────
# src/components/ui/
# ──────────────────────────────────────────────

cat > src/components/ui/Button.tsx << 'EOF'
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant; size?: Size; loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-neon-purple via-neon-violet to-neon-blue text-white shadow-neon hover:brightness-110 active:brightness-95',
  secondary: 'bg-ink-700 text-white border border-white/10 hover:border-neon-purple/50 hover:bg-ink-800',
  ghost: 'text-white/80 hover:text-white hover:bg-white/5',
  danger: 'bg-rose-600/90 text-white hover:bg-rose-600',
  outline: 'bg-transparent text-white border border-white/15 hover:border-neon-purple/60 hover:bg-white/5',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-4 text-sm rounded-xl',
  lg: 'h-12 px-6 text-base rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn('inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className)}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
EOF

cat > src/components/ui/Input.tsx << 'EOF'
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, icon, className, ...rest }, ref) => (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-white/80">{label}</label>}
      <div className="relative">
        {icon && <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            'w-full h-11 rounded-xl bg-ink-800/70 border border-white/10 px-3 text-sm text-white placeholder:text-white/40',
            'focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/60 transition',
            icon && 'pl-10', error && 'border-rose-500/70', className,
          )}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  ),
);
Input.displayName = 'Input';
EOF

cat > src/components/ui/Card.tsx << 'EOF'
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('glass rounded-2xl p-5 shadow-glass', className)} {...rest}>{children}</div>;
}

export function GradientCard({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('gradient-border p-[1px]', className)} {...rest}>
      <div className="rounded-2xl bg-ink-900/80 p-5 h-full">{children}</div>
    </div>
  );
}
EOF

cat > src/components/ui/Modal.tsx << 'EOF'
import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean; onClose: () => void; title?: string;
  children: ReactNode; className?: string;
}

export function Modal({ open, onClose, title, children, className }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative glass rounded-2xl w-full max-w-lg shadow-neon', className)}>
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button onClick={onClose} className="ml-auto rounded-lg p-1.5 text-white/60 hover:text-white hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
EOF

cat > src/components/ui/Toast.tsx << 'EOF'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import type { ToastItem } from '@/types';
import { cn } from '@/lib/utils';

export function ToastContainer({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
      {items.map(t => (
        <div key={t.id} className="glass rounded-xl p-3 flex gap-3 shadow-neon">
          <div className="mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
            {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400" />}
            {t.type === 'info' && <Info className="h-5 w-5 text-sky-400" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{t.title}</p>
            {t.description && <p className="text-xs text-white/60 mt-0.5">{t.description}</p>}
          </div>
          <button onClick={() => onDismiss(t.id)} className="text-white/50 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-neon-pink/15 text-neon-pink border border-neon-pink/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', className)}>
      Demo
    </span>
  );
}
EOF

cat > src/components/ui/Badge.tsx << 'EOF'
import { cn } from '@/lib/utils';

export function Badge({ children, tone = 'default', className }: { children: React.ReactNode; tone?: 'default' | 'success' | 'warning' | 'danger' | 'info'; className?: string }) {
  const tones = {
    default: 'bg-white/5 text-white/80 border-white/10',
    success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    info: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}
EOF

cat > src/components/ui/Loader.tsx << 'EOF'
export function Spinner({ className = '' }: { className?: string }) {
  return <div className={`h-8 w-8 rounded-full border-2 border-white/10 border-t-neon-purple animate-spin ${className}`} />;
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full">
      {label && <div className="mb-1 flex justify-between text-xs text-white/60"><span>{label}</span><span>{Math.round(value)}%</span></div>}
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
EOF

cat > src/components/ui/ConsentNotice.tsx << 'EOF'
import { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export function ConsentNotice() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('vfxai.consent')) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, []);
  const accept = () => {
    localStorage.setItem('vfxai.consent', '1');
    setOpen(false);
  };
  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[90] w-[min(680px,calc(100vw-2rem))] -translate-x-1/2">
      <div className="glass rounded-2xl p-4 shadow-neon flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-neon-purple mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-sm">
          <p className="font-semibold">Ethical use & consent</p>
          <p className="text-white/70 mt-1">
            By using VFXAI you confirm that you have permission to use any images, videos or voices
            you upload. Do not impersonate real people without their explicit authorization.
          </p>
        </div>
        <button onClick={accept} className="rounded-lg bg-neon-purple px-3 py-1.5 text-xs font-semibold hover:brightness-110">
          I understand
        </button>
        <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
EOF

# ──────────────────────────────────────────────
# src/components/layout/
# ──────────────────────────────────────────────

cat > src/components/layout/Navbar.tsx << 'EOF'
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LOGO } from '@/lib/brand';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const links = [
    { to: '/features', label: 'Features' },
    { to: '/dashboard', label: 'AI Studio' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
  ];
  const isActive = (p: string) => loc.pathname === p;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center"><LOGO /></Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={cn('rounded-lg px-3 py-2 text-sm font-medium transition',
                isActive(l.to) ? 'text-white bg-white/5' : 'text-white/70 hover:text-white hover:bg-white/5')}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
          <Link to="/signup"><Button size="sm">Start Creating</Button></Link>
        </div>
        <button className="md:hidden rounded-lg p-2 text-white/80 hover:bg-white/5" onClick={() => setOpen(v => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 bg-ink-950/95 px-4 py-3 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/5">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Log in</Button></Link>
            <Link to="/signup" className="flex-1"><Button size="sm" className="w-full">Start Creating</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
EOF

cat > src/components/layout/Footer.tsx << 'EOF'
import { Link } from 'react-router-dom';
import { LOGO, BRAND } from '@/lib/brand';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-ink-950/80">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <LOGO />
          <p className="mt-3 text-sm text-white/60 max-w-xs">
            {BRAND.tagline} The AI video studio for creators, teams and brands.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">AI Studio</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><a href={`mailto:${BRAND.supportEmail}`} className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li><a href="#" className="hover:text-white">Privacy</a></li>
            <li><a href="#" className="hover:text-white">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {year} {BRAND.name}. All rights reserved.</p>
          <p>Built for creators. Powered by AI.</p>
        </div>
      </div>
    </footer>
  );
}
EOF

cat > src/components/layout/PublicLayout.tsx << 'EOF'
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ConsentNotice } from '@/components/ui/ConsentNotice';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <ConsentNotice />
    </div>
  );
}
EOF

cat > src/components/layout/ProtectedRoute.tsx << 'EOF'
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Loader';

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-10 w-10" /></div>;
  }
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
EOF

cat > src/components/layout/Sidebar.tsx << 'EOF'
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UserRound, Video, Radio, Phone, Folder, LayoutTemplate,
  Coins, Settings, HelpCircle, LogOut, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LOGO } from '@/lib/brand';
import { cn } from '@/lib/utils';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/avatar-studio', label: 'AI Avatar Studio', icon: UserRound },
  { to: '/video-generator', label: 'AI Video Generator', icon: Sparkles },
  { to: '/live-studio', label: 'Live Studio', icon: Radio },
  { to: '/video-calls', label: 'AI Video Calls', icon: Phone },
  { to: '/videos', label: 'My Videos', icon: Folder },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/credits', label: 'Credits', icon: Coins },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signOut } = useAuth();
  const nav = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-gradient-to-r from-neon-purple/20 to-neon-blue/10 text-white border border-neon-purple/30'
        : 'text-white/70 hover:text-white hover:bg-white/5');

  const content = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5 border-b border-white/5">
        <NavLink to="/dashboard" className="flex items-center"><LOGO /></NavLink>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} onClick={onClose} className={linkClass}>
            <it.icon className="h-4 w-4" /><span>{it.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/5 px-3 py-3 space-y-1">
        <a href="#" className={linkClass({ isActive: false })}>
          <HelpCircle className="h-4 w-4" /><span>Help</span>
        </a>
        <button
          onClick={() => { signOut(); nav('/'); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" /><span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-white/5 bg-ink-900/60 backdrop-blur-xl h-[100dvh] sticky top-0">
        {content}
      </aside>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-ink-900 border-r border-white/10">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
EOF

cat > src/components/layout/Topbar.tsx << 'EOF'
import { Bell, Menu, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  const initials = (user?.full_name || user?.email || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-ink-950/70 px-4 backdrop-blur-xl sm:px-6">
      <button onClick={onMenu} className="lg:hidden rounded-lg p-2 text-white/70 hover:bg-white/5">
        <Menu className="h-5 w-5" />
      </button>
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          placeholder="Search videos, avatars, templates…"
          className="h-10 w-full rounded-xl bg-ink-800/70 border border-white/10 pl-9 pr-3 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-purple/50"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="relative rounded-xl p-2 text-white/70 hover:bg-white/5">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon-pink" />
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-ink-800/60 px-2 py-1.5">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-[11px] font-bold">
            {initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-semibold">{user?.full_name || user?.username || 'User'}</p>
            <p className="text-[10px] text-white/50">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
EOF

cat > src/components/layout/AppLayout.tsx << 'EOF'
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-[100dvh]">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
EOF

cat > src/components/layout/AdminShell.tsx << 'EOF'
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Video, UserRound, Coins, Receipt, CreditCard, Settings, LogOut, Shield,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LOGO } from '@/lib/brand';
import { cn } from '@/lib/utils';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/videos', label: 'Videos', icon: Video },
  { to: '/admin/avatars', label: 'Avatars', icon: UserRound },
  { to: '/admin/credits', label: 'Credits', icon: Coins },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell() {
  const { signOut } = useAuth();
  const nav = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-gradient-to-r from-neon-pink/20 to-neon-purple/10 text-white border border-neon-pink/30'
        : 'text-white/70 hover:text-white hover:bg-white/5');

  return (
    <div className="flex min-h-[100dvh]">
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col border-r border-white/5 bg-ink-900/60 backdrop-blur-xl h-[100dvh] sticky top-0">
        <div className="px-5 py-5 border-b border-white/5 flex items-center gap-2">
          <LOGO />
          <Shield className="h-4 w-4 text-neon-pink" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-neon-pink">Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map(it => (
            <NavLink key={it.to} to={it.to} end={(it as any).end ?? false} className={linkClass}>
              <it.icon className="h-4 w-4" /><span>{it.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/5 px-3 py-3">
          <NavLink to="/dashboard" className={linkClass({ isActive: false })}>
            <LayoutDashboard className="h-4 w-4" /><span>Exit Admin</span>
          </NavLink>
          <button
            onClick={() => { signOut(); nav('/'); }}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-ink-950/70 px-6 backdrop-blur-xl">
          <Shield className="h-5 w-5 text-neon-pink" />
          <h1 className="text-sm font-semibold">Admin Console</h1>
          <span className="ml-auto text-xs text-white/50">Demo data</span>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}
EOF

echo "✅ Components + layout created"
# ──────────────────────────────────────────────
# Public pages
# ──────────────────────────────────────────────

cat > src/pages/Landing.tsx << 'EOF'
import { Link } from 'react-router-dom';
import { Sparkles, Video, Wand2, Phone, Radio, Share2, Check, ArrowRight, Zap, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BRAND } from '@/lib/brand';

const features = [
  { icon: Sparkles, title: 'AI Avatar Studio', desc: 'Create and customize AI-powered digital avatars.' },
  { icon: Video, title: 'AI Video Generator', desc: 'Turn ideas and prompts into engaging videos.' },
  { icon: Wand2, title: 'Real-Time AI Effects', desc: 'Transform your live camera experience with AI-powered effects.' },
  { icon: Phone, title: 'AI Video Calls', desc: 'Create interactive video experiences with AI avatars.' },
  { icon: Radio, title: 'Live Studio', desc: 'Prepare your AI-powered live streaming workspace.' },
  { icon: Share2, title: 'Social Video Creator', desc: 'Create content optimized for TikTok, Instagram, YouTube and more.' },
];

const steps = [
  { n: '01', t: 'Choose your AI tool', d: 'Pick from avatars, video generation, live effects or calls.' },
  { n: '02', t: 'Create or upload your content', d: 'Use a prompt, image or video as your starting point.' },
  { n: '03', t: 'Customize your video', d: 'Adjust style, voice, avatar and aspect ratio.' },
  { n: '04', t: 'Generate and share', d: 'Render in the cloud and publish everywhere.' },
];

const socials = ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'X'];

const plans = [
  { name: 'Free', price: '$0', features: ['3 videos / month', '720p exports', 'Community support'], cta: 'Start free' },
  { name: 'Creator', price: '$19', features: ['50 videos / month', '1080p exports', 'Priority rendering', 'All templates'], cta: 'Go Creator', highlight: true },
  { name: 'Pro', price: '$49', features: ['Unlimited videos', '4K exports', 'API access', 'Dedicated support'], cta: 'Go Pro' },
];

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 h-[500px] bg-radial-glow" />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 text-xs font-medium text-neon-purple">
              <Zap className="h-3.5 w-3.5" /> AI-native video studio
            </div>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Create. <span className="neon-text">Transform.</span><br />Imagine.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Create professional videos with AI avatars, generative video tools and real-time visual effects — all in one powerful studio.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg">Start Creating <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/features"><Button size="lg" variant="outline">Explore Features</Button></Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Free plan available</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-400" /> Cancel anytime</span>
            </div>
          </div>
          <div className="relative">
            <div className="gradient-border aspect-video overflow-hidden">
              <div className="relative h-full w-full rounded-2xl bg-gradient-to-br from-ink-800 to-ink-950 overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-6 rounded-full bg-neon-purple/30 blur-2xl animate-pulse-slow" />
                    <button className="relative h-20 w-20 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-neon hover:scale-105 transition">
                      <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-black/40 backdrop-blur px-3 py-2 text-xs">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Live preview</span>
                  <span className="text-white/60">00:12 / 00:30</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block">
              <Card className="w-56">
                <p className="text-xs text-white/60">Generating</p>
                <p className="mt-1 font-semibold">Cinematic product ad</p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-neon-purple to-neon-pink" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Your AI Video Studio</h2>
          <p className="mt-4 text-white/60">Everything you need to create, transform and ship video at the speed of thought.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(f => (
            <Card key={f.title} className="group hover:border-neon-purple/40 transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 border border-neon-purple/30">
                <f.icon className="h-5 w-5 text-neon-purple" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-white/60">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center">How it works</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} className="relative glass rounded-2xl p-6">
              <div className="font-display text-5xl font-bold neon-text">{s.n}</div>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-white/60">{s.d}</p>
              {i < steps.length - 1 && <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20" />}
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Create once. Share everywhere.</h2>
          <p className="mt-4 text-white/60">Optimized exports for every major platform.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {socials.map(s => (
            <div key={s} className="glass rounded-2xl p-5 text-center hover:border-neon-purple/40 transition">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-pink/20 flex items-center justify-center text-xl font-bold">
                {s[0]}
              </div>
              <p className="mt-3 text-sm font-medium">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Simple, transparent pricing</h2>
          <p className="mt-4 text-white/60">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {plans.map(p => (
            <div key={p.name} className={`relative rounded-2xl p-[1px] ${p.highlight ? 'bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink' : 'bg-white/10'}`}>
              <div className="h-full rounded-2xl bg-ink-900 p-7">
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">{p.price}</span>
                  <span className="text-sm text-white/50">/month</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-white/80">
                      <Check className="h-4 w-4 text-emerald-400" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="mt-7 block">
                  <Button variant={p.highlight ? 'primary' : 'outline'} className="w-full">{p.cta}</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-neon-purple/30 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-10 sm:p-16 text-center">
          <div className="absolute inset-0 bg-radial-glow opacity-60" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-5xl font-bold">Ready to create with AI?</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto">Join thousands of creators shipping better video, faster.</p>
            <Link to="/signup"><Button size="lg" className="mt-8">Start Creating <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
EOF

cat > src/pages/Features.tsx << 'EOF'
import { Sparkles, Video, Wand2, Phone, Radio, Share2, Zap, Shield, Globe } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const features = [
  { icon: Sparkles, title: 'AI Avatar Studio', desc: 'Generate lifelike digital presenters with customizable voice, expression and wardrobe.' },
  { icon: Video, title: 'AI Video Generator', desc: 'Turn text prompts into cinematic videos with styles from corporate to gaming.' },
  { icon: Wand2, title: 'Real-Time AI Effects', desc: 'Apply face effects, backgrounds and stylizations to your live camera feed.' },
  { icon: Phone, title: 'AI Video Calls', desc: 'Host calls where you appear as an AI avatar — great for privacy and branding.' },
  { icon: Radio, title: 'Live Studio', desc: 'Stream with AI overlays, virtual sets and real-time scene switching.' },
  { icon: Share2, title: 'Social Video Creator', desc: 'One-click exports for TikTok, Instagram Reels, YouTube Shorts and more.' },
  { icon: Zap, title: 'Lightning Rendering', desc: 'Cloud rendering pipeline optimized for speed without sacrificing quality.' },
  { icon: Shield, title: 'Ethical by design', desc: 'Consent-first workflows. No impersonation. No deepfake misuse.' },
  { icon: Globe, title: 'Multi-language', desc: 'Generate voices and subtitles in dozens of languages.' },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-5xl font-bold">Features built for the AI video era</h1>
        <p className="mt-4 text-white/60">Every tool you need to go from idea to published video — in minutes.</p>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(f => (
          <Card key={f.title}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-blue/10 border border-neon-purple/30">
              <f.icon className="h-5 w-5 text-neon-purple" />
            </div>
            <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
            <p className="mt-1.5 text-sm text-white/60">{f.desc}</p>
          </Card>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link to="/signup"><Button size="lg">Try all features free</Button></Link>
      </div>
    </div>
  );
}
EOF

cat > src/pages/Pricing.tsx << 'EOF'
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const plans = [
  { name: 'Free', price: '$0', period: 'forever', features: ['3 videos / month', '720p exports', '1 AI avatar', 'Community support'], cta: 'Start free' },
  { name: 'Creator', price: '$19', period: '/month', features: ['50 videos / month', '1080p exports', '10 AI avatars', 'All templates', 'Priority rendering', 'Email support'], cta: 'Go Creator', highlight: true },
  { name: 'Pro', price: '$49', period: '/month', features: ['Unlimited videos', '4K exports', 'Unlimited avatars', 'API access', 'Team seats', 'Dedicated support'], cta: 'Go Pro' },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-5xl font-bold">Pricing that scales with you</h1>
        <p className="mt-4 text-white/60">Start free. Upgrade when you need more.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map(p => (
          <div key={p.name} className={`relative rounded-2xl p-[1px] ${p.highlight ? 'bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink shadow-neon' : 'bg-white/10'}`}>
            <div className="h-full rounded-2xl bg-ink-900 p-8">
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Most popular</span>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className="text-sm text-white/50">{p.period}</span>
              </div>
              <ul className="mt-7 space-y-3 text-sm">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-white/80">
                    <Check className="h-4 w-4 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="mt-8 block">
                <Button variant={p.highlight ? 'primary' : 'outline'} className="w-full" size="lg">{p.cta}</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF

cat > src/pages/About.tsx << 'EOF'
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-5xl font-bold">About {BRAND.name}</h1>
      <p className="mt-6 text-lg text-white/70 leading-relaxed">
        {BRAND.name} is the AI video studio built for creators, teams and brands who refuse to compromise on quality. We combine generative video, AI avatars, real-time effects and live streaming into a single, elegant workspace.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { t: 'Mission', d: 'Make professional video creation accessible to everyone.' },
          { t: 'Values', d: 'Speed, craft, and ethical AI — in that order.' },
          { t: 'Vision', d: 'A world where every idea becomes a video in minutes.' },
        ].map(c => (
          <div key={c.t} className="glass rounded-2xl p-6">
            <h3 className="font-semibold text-lg">{c.t}</h3>
            <p className="mt-2 text-sm text-white/60">{c.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <Link to="/signup"><Button size="lg">Start creating</Button></Link>
      </div>
    </div>
  );
}
EOF

cat > src/pages/Login.tsx << 'EOF'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { LOGO } from '@/lib/brand';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const { push } = useToast();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(email, password);
      push({ type: 'success', title: 'Welcome back' });
      nav('/dashboard');
    } catch (err: any) {
      push({ type: 'error', title: 'Login failed', description: err?.message || 'Check your credentials.' });
    } finally { setLoading(false); }
  };

  const google = async () => {
    try { await signInWithGoogle(); }
    catch (err: any) { push({ type: 'info', title: 'Google sign-in', description: err?.message || 'Not configured in demo mode.' }); }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex justify-center mb-5"><LOGO /></div>
        <h1 className="text-center text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-white/60">Log in to continue creating.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} icon={<Mail className="h-4 w-4" />} />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} icon={<Lock className="h-4 w-4" />} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/70">
              <input type="checkbox" className="accent-neon-purple" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-neon-purple hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" loading={loading} className="w-full" size="lg"><LogIn className="h-4 w-4" /> Log in</Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-white/40">
          <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={google}>Continue with Google</Button>
        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account? <Link to="/signup" className="text-neon-purple hover:underline font-medium">Create account</Link>
        </p>
      </Card>
    </div>
  );
}
EOF

cat > src/pages/Signup.tsx << 'EOF'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { LOGO } from '@/lib/brand';

export default function Signup() {
  const { signUp } = useAuth();
  const { push } = useToast();
  const nav = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = 'Required';
    if (!form.username.trim()) e.username = 'Required';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username)) e.username = '3–20 chars, letters/numbers/_';
    if (!form.email) e.email = 'Required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (form.password.length < 8) e.password = 'At least 8 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({ full_name: form.full_name, username: form.username, email: form.email, password: form.password });
      push({ type: 'success', title: 'Account created', description: 'Welcome to VFXAI.' });
      nav('/dashboard');
    } catch (err: any) {
      push({ type: 'error', title: 'Signup failed', description: err?.message || 'Please try again.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex justify-center mb-5"><LOGO /></div>
        <h1 className="text-center text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-center text-sm text-white/60">Start creating AI videos in minutes.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Full name" placeholder="Jane Creator" value={form.full_name} onChange={set('full_name')} error={errors.full_name} icon={<User className="h-4 w-4" />} />
          <Input label="Username" placeholder="janecreator" value={form.username} onChange={set('username')} error={errors.username} icon={<AtSign className="h-4 w-4" />} />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} icon={<Mail className="h-4 w-4" />} />
          <Input label="Password" type="password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} error={errors.password} icon={<Lock className="h-4 w-4" />} />
          <Input label="Confirm password" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} icon={<Lock className="h-4 w-4" />} />
          <Button type="submit" loading={loading} className="w-full" size="lg">Create account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account? <Link to="/login" className="text-neon-purple hover:underline font-medium">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
EOF

cat > src/pages/ForgotPassword.tsx << 'EOF'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { LOGO } from '@/lib/brand';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { push } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { push({ type: 'error', title: 'Invalid email' }); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      push({ type: 'success', title: 'Reset link sent', description: 'Check your inbox.' });
    } catch (err: any) {
      push({ type: 'error', title: 'Could not send reset', description: err?.message });
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6 py-12">
      <Card className="w-full">
        <div className="flex justify-center mb-5"><LOGO /></div>
        <h1 className="text-center text-2xl font-bold">Reset your password</h1>
        <p className="mt-1 text-center text-sm text-white/60">
          {sent ? "We've emailed you a reset link." : "Enter your email and we'll send a reset link."}
        </p>
        {!sent ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} />
            <Button type="submit" loading={loading} className="w-full" size="lg">Send reset link</Button>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <Button variant="outline" className="w-full" onClick={() => window.location.href = 'mailto:'}>Open email app</Button>
          </div>
        )}
        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}
EOF

echo "✅ Public pages created"
# ──────────────────────────────────────────────
# Dashboard pages
# ──────────────────────────────────────────────

cat > src/pages/Dashboard.tsx << 'EOF'
import { Link } from 'react-router-dom';
import { Video, UserRound, Clock, Coins, Plus, Sparkles, Radio, Phone, Play, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { DemoBadge } from '@/components/ui/Toast';

const stats = [
  { label: 'Videos Created', value: 12, icon: Video, tone: 'from-neon-purple to-neon-blue' },
  { label: 'AI Avatars', value: 4, icon: UserRound, tone: 'from-neon-blue to-neon-cyan' },
  { label: 'Minutes Generated', value: '38 min', icon: Clock, tone: 'from-neon-cyan to-neon-pink' },
  { label: 'Credits Remaining', value: 500, icon: Coins, tone: 'from-neon-pink to-neon-purple' },
];

const quick = [
  { to: '/video-generator', label: 'Create Video', icon: Sparkles },
  { to: '/avatar-studio', label: 'Create Avatar', icon: UserRound },
  { to: '/live-studio', label: 'Start Live', icon: Radio },
  { to: '/video-calls', label: 'AI Video Call', icon: Phone },
];

const statusTone = { completed: 'success', processing: 'warning', queued: 'info', failed: 'danger' } as const;

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}</h1>
        <p className="mt-1 text-white/60">Create something amazing today.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
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
        ))}
      </div>
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
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Recent projects</h2>
          <Link to="/videos" className="text-xs text-white/60 hover:text-white">View all →</Link>
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PROJECTS.map(p => (
            <Card key={p.id} className="group overflow-hidden p-0">
              <div className="relative aspect-video bg-ink-800 overflow-hidden">
                <img src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px]">
                  <Play className="h-3 w-3" /> 0:{p.duration_sec.toString().padStart(2, '0')}
                </div>
                <div className="absolute top-2 right-2"><Badge tone={statusTone[p.status]}>{p.status}</Badge></div>
              </div>
              <div className="p-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-white/50 mt-0.5">{p.created_at}</p>
                </div>
                <button className="text-white/50 hover:text-white"><MoreVertical className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-neon-pink/30 bg-neon-pink/5 px-4 py-3 text-sm text-white/80">
        <DemoBadge /> Preview data — connect Supabase to load real projects.
      </div>
    </div>
  );
}
EOF

cat > src/pages/AvatarStudio.tsx << 'EOF'
import { useState } from 'react';
import { Upload, Sparkles, UserRound } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Loader';
import { DemoBadge } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { AI, type GenerationProgress } from '@/lib/ai-provider';
import { MOCK_AVATARS } from '@/lib/mock-data';

const voices = ['Female — Warm', 'Female — Bright', 'Male — Deep', 'Male — Energetic'];
const expressions = ['Friendly', 'Confident', 'Playful', 'Serious'];
const clothing = ['Business', 'Casual', 'Streetwear', 'Formal'];
const backgrounds = ['Studio', 'Neon City', 'Abstract', 'Office'];
const styles = ['Realistic', 'Cinematic', 'Social Media', 'Stylized'];

export default function AvatarStudio() {
  const { push } = useToast();
  const [name, setName] = useState('');
  const [voice, setVoice] = useState(voices[0]);
  const [expression, setExpression] = useState(expressions[0]);
  const [clothing, setClothing] = useState(clothing[0]);
  const [background, setBackground] = useState(backgrounds[0]);
  const [style, setStyle] = useState(styles[0]);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const generate = async () => {
    if (!name.trim()) { push({ type: 'error', title: 'Name your avatar' }); return; }
    setProgress({ stage: 'preparing', percent: 0, message: 'Starting…' });
    setResultUrl(null);
    try {
      const res = await AI.generateAvatar({ name, voice, expression, clothing, background, style }, setProgress);
      setResultUrl(res.avatarUrl);
      push({ type: 'success', title: 'Avatar created', description: 'Demo generation complete.' });
    } catch { push({ type: 'error', title: 'Generation failed' }); setProgress(null); }
  };

  const Select = ({ label, value, onChange, options }: any) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-white/80">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((o: string) => (
          <button key={o} onClick={() => onChange(o)}
            className={`rounded-lg border px-3 py-1.5 text-xs transition ${value === o ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">AI Avatar Studio</h1>
          <p className="mt-1 text-white/60">Create your digital presenter.</p>
        </div>
        <DemoBadge />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-ink-800">
            {resultUrl ? (
              <img src={resultUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <UserRound className="mx-auto h-16 w-16 text-white/20" />
                  <p className="mt-3 text-sm text-white/50">Your avatar preview</p>
                </div>
              </div>
            )}
            {progress && progress.stage !== 'complete' && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <Progress value={progress.percent} label={progress.message} />
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline"><Upload className="h-4 w-4" /> Upload Image</Button>
            <Button variant="outline"><Upload className="h-4 w-4" /> Upload Video</Button>
            <Button onClick={generate} loading={!!progress && progress.stage !== 'complete'}>
              <Sparkles className="h-4 w-4" /> Generate Avatar
            </Button>
          </div>
          <p className="mt-3 text-xs text-white/50">Demo generation — connect an AI provider to generate real avatars.</p>
        </Card>
        <Card className="space-y-5">
          <Input label="Avatar Name" placeholder="e.g. Nova" value={name} onChange={e => setName(e.target.value)} />
          <Select label="Voice" value={voice} onChange={setVoice} options={voices} />
          <Select label="Expression" value={expression} onChange={setExpression} options={expressions} />
          <Select label="Clothing" value={clothing} onChange={setClothing} options={clothing} />
          <Select label="Background" value={background} onChange={setBackground} options={backgrounds} />
          <Select label="Speaking Style" value={style} onChange={setStyle} options={styles} />
          <Button onClick={generate} loading={!!progress && progress.stage !== 'complete'} className="w-full" size="lg">
            <Sparkles className="h-4 w-4" /> Generate Avatar
          </Button>
        </Card>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">Your avatars</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_AVATARS.map(a => (
            <Card key={a.id} className="p-0 overflow-hidden">
              <div className="aspect-square bg-ink-800"><img src={a.thumbnail_url} alt={a.name} className="h-full w-full object-cover" /></div>
              <div className="p-4">
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-white/50">{a.voice} · {a.style}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
EOF

cat > src/pages/VideoGenerator.tsx << 'EOF'
import { useState } from 'react';
import { Sparkles, Upload, Play, Download, Pencil, RefreshCw, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Loader';
import { DemoBadge } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useCredits } from '@/hooks/useCredits';
import { AI, type GenerationProgress } from '@/lib/ai-provider';
import { MOCK_AVATARS } from '@/lib/mock-data';

const CREDIT_COST = 20;
const styles = ['Cinematic', 'Realistic', 'Social Media', 'Advertisement', 'Corporate', 'Gaming', 'News'];
const durations = [5, 10, 15, 30];
const ratios: Array<'16:9' | '9:16' | '1:1'> = ['16:9', '9:16', '1:1'];

export default function VideoGenerator() {
  const { push } = useToast();
  const { credits, consume } = useCredits();
  const [prompt, setPrompt] = useState('');
  const [avatarId, setAvatarId] = useState(MOCK_AVATARS[0]?.id || '');
  const [voice, setVoice] = useState('Female — Warm');
  const [style, setStyle] = useState(styles[0]);
  const [duration, setDuration] = useState(10);
  const [ratio, setRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [result, setResult] = useState<{ videoUrl: string; thumbnailUrl: string } | null>(null);

  const generate = async () => {
    if (!prompt.trim()) { push({ type: 'error', title: 'Enter a prompt' }); return; }
    if (credits < CREDIT_COST) { push({ type: 'error', title: 'Not enough credits' }); return; }
    if (!consume(CREDIT_COST, 'video-generation')) { push({ type: 'error', title: 'Credits failed' }); return; }
    setProgress({ stage: 'preparing', percent: 0, message: 'Starting…' });
    setResult(null);
    try {
      const r = await AI.textToVideo({ prompt, style, durationSec: duration, aspectRatio: ratio, avatarId, voice }, setProgress);
      setResult(r);
      push({ type: 'success', title: 'Video ready', description: 'Demo generation complete.' });
    } catch { push({ type: 'error', title: 'Generation failed' }); setProgress(null); }
  };

  const Chip = ({ label, active, onClick }: any) => (
    <button onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs transition ${active ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'}`}>
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">AI Video Generator</h1>
          <p className="mt-1 text-white/60">Turn ideas into videos with AI.</p>
        </div>
        <DemoBadge />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink-800">
            {result ? (
              <video src={result.videoUrl} poster={result.thumbnailUrl} controls className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-center">
                <div>
                  <Sparkles className="mx-auto h-12 w-12 text-white/20" />
                  <p className="mt-3 text-sm text-white/50">Your generated video will appear here</p>
                </div>
              </div>
            )}
            {progress && progress.stage !== 'complete' && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <Progress value={progress.percent} label={progress.message} />
              </div>
            )}
          </div>
          {result && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline"><Play className="h-4 w-4" /> Play</Button>
              <Button variant="outline"><Download className="h-4 w-4" /> Download</Button>
              <Button variant="outline"><Pencil className="h-4 w-4" /> Edit</Button>
              <Button variant="outline" onClick={generate}><RefreshCw className="h-4 w-4" /> Regenerate</Button>
              <Button variant="outline"><Share2 className="h-4 w-4" /> Share</Button>
            </div>
          )}
          <p className="mt-3 text-xs text-white/50">Demo generation — connect an AI provider to generate real videos.</p>
        </Card>
        <Card className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Prompt</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4}
              placeholder="Create a cinematic product advertisement for a new smartphone..."
              className="w-full rounded-xl bg-ink-800/70 border border-white/10 px-3 py-2.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-neon-purple/50" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Upload image</label>
            <Button variant="outline" className="w-full"><Upload className="h-4 w-4" /> Choose file</Button>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Avatar</label>
            <div className="flex gap-2 overflow-x-auto">
              {MOCK_AVATARS.map(a => (
                <button key={a.id} onClick={() => setAvatarId(a.id)}
                  className={`flex-shrink-0 rounded-xl border p-1 transition ${avatarId === a.id ? 'border-neon-purple' : 'border-white/10'}`}>
                  <img src={a.thumbnail_url} alt={a.name} className="h-14 w-14 rounded-lg object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Voice</label>
            <select value={voice} onChange={e => setVoice(e.target.value)}
              className="w-full rounded-xl bg-ink-800/70 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neon-purple/50">
              {['Female — Warm', 'Female — Bright', 'Male — Deep', 'Male — Energetic'].map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-white/80">Style</label>
            <div className="flex flex-wrap gap-2">
              {styles.map(s => <Chip key={s} label={s} active={style === s} onClick={() => setStyle(s)} />)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Duration</label>
              <div className="flex flex-wrap gap-2">
                {durations.map(d => <Chip key={d} label={`${d}s`} active={duration === d} onClick={() => setDuration(d)} />)}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Aspect ratio</label>
              <div className="flex flex-wrap gap-2">
                {ratios.map(r => <Chip key={r} label={r} active={ratio === r} onClick={() => setRatio(r)} />)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-800/50 px-4 py-3">
            <div>
              <p className="text-xs text-white/60">Credit cost</p>
              <p className="font-display text-xl font-bold">{CREDIT_COST} credits</p>
            </div>
            <p className="text-xs text-white/50">Balance: {credits}</p>
          </div>
          <Button onClick={generate} loading={!!progress && progress.stage !== 'complete'} className="w-full" size="lg">
            <Sparkles className="h-4 w-4" /> Generate Video
          </Button>
        </Card>
      </div>
    </div>
  );
}
EOF

cat > src/pages/LiveStudio.tsx << 'EOF'
import { useEffect, useRef, useState } from 'react';
import { Video as VideoIcon, Mic, Monitor, UserRound, Wand2, Image as ImageIcon, Radio, Square, Play } from 'lucide-react';
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
        .then(s => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
        .catch(() => { setError('Camera permission denied or unavailable.'); setCameraOn(false); });
    } else if (stream) { stream.getTracks().forEach(t => t.stop()); }
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, [cameraOn]);

  const toggleLive = () => {
    if (!cameraOn) { push({ type: 'error', title: 'Start the camera first' }); return; }
    setLive(v => !v);
    push({ type: 'info', title: live ? 'Stream ended' : 'You are live (demo)' });
  };

  const ToolBtn = ({ active, onClick, children, title }: any) => (
    <button title={title} onClick={onClick}
      className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${active ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20 hover:text-white'}`}>
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
              {live && <span className="flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold"><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE</span>}
              <Badge tone={cameraOn ? 'success' : 'default'}>{cameraOn ? 'Camera' : 'Camera off'}</Badge>
              <Badge tone={micOn ? 'success' : 'warning'}>{micOn ? 'Mic on' : 'Mic muted'}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-4 border-t border-white/5">
            <ToolBtn active={cameraOn} onClick={() => setCameraOn(v => !v)} title="Camera"><VideoIcon className="h-4 w-4" /></ToolBtn>
            <ToolBtn active={micOn} onClick={() => setMicOn(v => !v)} title="Microphone"><Mic className="h-4 w-4" /></ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Screen share (demo)' })} title="Screen share"><Monitor className="h-4 w-4" /></ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Select avatar (demo)' })} title="Avatar"><UserRound className="h-4 w-4" /></ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Face effects (demo)' })} title="Face effect"><Wand2 className="h-4 w-4" /></ToolBtn>
            <ToolBtn active={false} onClick={() => push({ type: 'info', title: 'Backgrounds (demo)' })} title="Background"><ImageIcon className="h-4 w-4" /></ToolBtn>
            <div className="ml-auto flex items-center gap-2">
              {!live ? <Button onClick={() => { if (!cameraOn) setCameraOn(true); }}><Play className="h-4 w-4" /> Start Camera</Button> : null}
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
                <button key={e} className="rounded-xl border border-white/10 bg-ink-800 py-3 text-xs hover:border-neon-purple/40">{e}</button>
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
EOF

cat > src/pages/VideoCalls.tsx << 'EOF'
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
    <button onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${danger ? 'bg-rose-600 border-rose-500 text-white hover:bg-rose-500' : active ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 bg-ink-800 text-white/70 hover:text-white'}`}>
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
          <div className="absolute bottom-4 right-4 h-28 w-40 rounded-xl bg-gradient-to-br from-neon-purple/30 to-neon-pink/20 border border-white/10 overflow-hidden">
            <div className="flex h-full items-center justify-center text-xs text-white/60">You</div>
          </div>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {inCall && <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> In call · 00:42</span>}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 p-5 border-t border-white/5">
          <ToolBtn active={mic} onClick={() => setMic(v => !v)}>{mic ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}</ToolBtn>
          <ToolBtn active={cam} onClick={() => setCam(v => !v)}>{cam ? <VIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}</ToolBtn>
          <ToolBtn active={true} onClick={() => {}}><Volume2 className="h-5 w-5" /></ToolBtn>
          <ToolBtn active={false} onClick={() => {}}><Monitor className="h-5 w-5" /></ToolBtn>
          <ToolBtn active={false} onClick={() => {}}><UserRound className="h-5 w-5" /></ToolBtn>
          <ToolBtn active={false} onClick={() => {}}><Wand2 className="h-5 w-5" /></ToolBtn>
          <ToolBtn danger onClick={() => setInCall(false)}><PhoneOff className="h-5 w-5" /></ToolBtn>
        </div>
      </Card>
      <div className="flex justify-center">
        <Button size="lg" onClick={() => setInCall(true)} disabled={inCall}>{inCall ? 'In call…' : 'Start demo call'}</Button>
      </div>
    </div>
  );
}
EOF

cat > src/pages/MyVideos.tsx << 'EOF'
import { useState } from 'react';
import { Play, Download, Share2, Trash2, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PROJECTS } from '@/lib/mock-data';
import { useToast } from '@/hooks/useToast';

const filters = ['All', 'Completed', 'Processing', 'Failed'] as const;
const statusTone = { completed: 'success', processing: 'warning', queued: 'info', failed: 'danger' } as const;

export default function MyVideos() {
  const { push } = useToast();
  const [filter, setFilter] = useState<typeof filters[number]>('All');
  const [items, setItems] = useState(MOCK_PROJECTS);
  const filtered = items.filter(p => filter === 'All' || p.status === filter.toLowerCase());

  const remove = (id: string) => { setItems(s => s.filter(p => p.id !== id)); push({ type: 'success', title: 'Video deleted' }); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">My Videos</h1>
        <p className="mt-1 text-white/60">Your video library.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${filter === f ? 'border-neon-purple bg-neon-purple/15 text-white' : 'border-white/10 text-white/70 hover:border-white/20'}`}>
            {f}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <Card className="text-center py-12 text-white/60">No videos match this filter.</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(p => (
            <Card key={p.id} className="p-0 overflow-hidden group">
              <div className="relative aspect-video bg-ink-800">
                <img src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px]">
                  <Play className="h-3 w-3" /> 0:{p.duration_sec.toString().padStart(2, '0')}
                </div>
                <div className="absolute top-2 right-2"><Badge tone={statusTone[p.status]}>{p.status}</Badge></div>
              </div>
              <div className="p-4">
                <p className="font-semibold truncate">{p.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{p.created_at}</p>
                <div className="mt-3 flex items-center gap-1">
                  <Button variant="ghost" size="sm"><Play className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm"><Download className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm"><Share2 className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5 text-rose-400" /></Button>
                  <Button variant="ghost" size="sm" className="ml-auto"><MoreVertical className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

cat > src/pages/Templates.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MOCK_TEMPLATES } from '@/lib/mock-data';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

export default function Templates() {
  const { push } = useToast();
  const nav = useNavigate();
  const useTemplate = (_id: string, title: string) => {
    push({ type: 'info', title: `Template loaded`, description: title });
    nav('/video-generator');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Templates</h1>
        <p className="mt-1 text-white/60">Start from a proven template.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_TEMPLATES.map(t => (
          <Card key={t.id} className="p-0 overflow-hidden group">
            <div className="relative aspect-video bg-ink-800">
              <img src={t.thumbnail_url} alt={t.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[11px]">{t.aspect_ratio}</div>
            </div>
            <div className="p-4">
              <p className="text-xs text-white/50">{t.category}</p>
              <p className="font-semibold mt-0.5">{t.title}</p>
              <p className="text-xs text-white/60 mt-1 line-clamp-2">{t.description}</p>
              <Button size="sm" className="mt-3 w-full" onClick={() => useTemplate(t.id, t.title)}>Use Template</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF

cat > src/pages/Credits.tsx << 'EOF'
import { useState } from 'react';
import { Coins, Zap, UserRound, Radio } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useCredits } from '@/hooks/useCredits';
import { useToast } from '@/hooks/useToast';
import { DemoBadge } from '@/components/ui/Toast';

const packs = [
  { amount: 100, price: 5 },
  { amount: 500, price: 20, highlight: true },
  { amount: 2000, price: 70 },
];

const usage = [
  { icon: Zap, label: 'AI Video Generation', cost: '20 credits' },
  { icon: UserRound, label: 'AI Avatar Generation', cost: '50 credits' },
  { icon: Radio, label: 'Live AI Session', cost: '5 credits/minute' },
];

export default function Credits() {
  const { credits, add } = useCredits();
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(packs[1]);

  const buy = () => {
    add(selected.amount, 'purchase');
    push({ type: 'success', title: 'Credits added (demo)', description: `${selected.amount} credits added.` });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Credits</h1>
          <p className="mt-1 text-white/60">Manage your generation credits.</p>
        </div>
        <DemoBadge />
      </div>
      <Card className="relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink opacity-20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-pink">
            <Coins className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/60">Current balance</p>
            <p className="font-display text-4xl font-bold">{credits} <span className="text-lg text-white/50">credits</span></p>
          </div>
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Credit usage</h2>
          <div className="mt-4 space-y-3">
            {usage.map(u => (
              <div key={u.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-800/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <u.icon className="h-4 w-4 text-neon-purple" />
                  <span className="text-sm">{u.label}</span>
                </div>
                <span className="text-sm font-semibold">{u.cost}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Buy credits</h2>
          <div className="mt-4 grid gap-3">
            {packs.map(p => (
              <button key={p.amount} onClick={() => { setSelected(p); setOpen(true); }}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${p.highlight ? 'border-neon-purple bg-neon-purple/10' : 'border-white/10 hover:border-white/20'}`}>
                <div className="flex items-center gap-3">
                  <Coins className="h-5 w-5 text-neon-purple" />
                  <span className="font-semibold">{p.amount} credits</span>
                </div>
                <span className="font-display text-xl font-bold">${p.price}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/50">Demo checkout — connect Stripe or Paystack to process real payments.</p>
        </Card>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm purchase">
        <p className="text-sm text-white/70">Add <b>{selected.amount} credits</b> for <b>${selected.price}</b>.</p>
        <div className="mt-5 flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={buy}>Confirm (demo)</Button>
        </div>
      </Modal>
    </div>
  );
}
EOF

cat > src/pages/Settings.tsx << 'EOF'
import { useState } from 'react';
import { User, Mail, Lock, Bell, Palette, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Mail },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

export default function Settings() {
  const { user } = useAuth();
  const { push } = useToast();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
  });

  const save = () => push({ type: 'success', title: 'Settings saved' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Settings</h1>
        <p className="mt-1 text-white/60">Manage your account.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Card className="p-2 h-fit">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${tab === t.id ? 'bg-neon-purple/15 text-white border border-neon-purple/30' : 'text-white/70 hover:text-white hover:bg-white/5'}`}>
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </nav>
        </Card>
        <Card>
          {tab === 'profile' && (
            <div className="space-y-5">
              <h2 className="font-semibold text-lg">Profile</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xl font-bold">
                  {(profile.full_name || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <Button variant="outline">Change picture</Button>
              </div>
              <Input label="Full name" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} />
              <Input label="Username" value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} />
              <Input label="Email" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
              <Button onClick={save}>Save changes</Button>
            </div>
          )}
          {tab === 'account' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Account</h2>
              <p className="text-sm text-white/60">Account ID: <code className="rounded bg-white/5 px-1.5 py-0.5">{user?.id}</code></p>
              <p className="text-sm text-white/60">Role: <b>{user?.role}</b></p>
              <Button variant="danger">Delete account</Button>
            </div>
          )}
          {tab === 'password' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Password</h2>
              <Input label="Current password" type="password" />
              <Input label="New password" type="password" />
              <Input label="Confirm new password" type="password" />
              <Button onClick={save}>Update password</Button>
            </div>
          )}
          {tab === 'notifications' && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Notifications</h2>
              {['Video generation complete', 'Credits low', 'New features', 'Marketing emails'].map(n => (
                <label key={n} className="flex items-center justify-between rounded-xl border border-white/5 bg-ink-800/50 px-4 py-3">
                  <span className="text-sm">{n}</span>
                  <input type="checkbox" defaultChecked className="accent-neon-purple" />
                </label>
              ))}
            </div>
          )}
          {tab === 'appearance' && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Appearance</h2>
              <div className="flex gap-2">
                {['Dark', 'Midnight', 'AMOLED'].map(t => (
                  <button key={t} className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:border-neon-purple/40">{t}</button>
                ))}
              </div>
            </div>
          )}
          {tab === 'billing' && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Billing</h2>
              <p className="text-sm text-white/60">Plan: <b>Free</b></p>
              <Button variant="outline">Manage subscription</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
EOF

echo "✅ Dashboard pages created"
# ──────────────────────────────────────────────
# Admin pages
# ──────────────────────────────────────────────

cat > src/pages/admin/AdminDashboard.tsx << 'EOF'
import { Users, UserCheck, Video, UserRound, Coins, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const stats = [
  { label: 'Total Users', value: '1,284', icon: Users, tone: 'from-neon-purple to-neon-blue' },
  { label: 'Active Users', value: '412', icon: UserCheck, tone: 'from-neon-blue to-neon-cyan' },
  { label: 'Videos Generated', value: '9,842', icon: Video, tone: 'from-neon-cyan to-neon-pink' },
  { label: 'Avatars Created', value: '3,107', icon: UserRound, tone: 'from-neon-pink to-neon-purple' },
  { label: 'Credits Used', value: '128K', icon: Coins, tone: 'from-neon-purple to-neon-pink' },
  { label: 'Revenue', value: '$24,580', icon: DollarSign, tone: 'from-emerald-400 to-neon-cyan' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Admin Overview</h1>
        <p className="mt-1 text-white/60">Platform-wide metrics.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(s => (
          <Card key={s.label} className="relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${s.tone} opacity-20 blur-2xl`} />
            <div className="relative flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${s.tone}`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60">{s.label}</p>
                <p className="font-display text-2xl font-bold">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="font-semibold">Recent activity</h3>
        <ul className="mt-3 divide-y divide-white/5 text-sm">
          {['New user: alex@demo.com', 'Video generated: "Product Advertisement"', 'Avatar created: "Nova v2"', 'Subscription upgraded: Creator → Pro'].map((a, i) => (
            <li key={i} className="py-2.5 text-white/70">{a}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
EOF

cat > src/pages/admin/Users.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const users = [
  { name: 'Alex Morgan', email: 'alex@demo.com', plan: 'Pro', status: 'active' },
  { name: 'Jamie Lee', email: 'jamie@demo.com', plan: 'Creator', status: 'active' },
  { name: 'Sam Rivera', email: 'sam@demo.com', plan: 'Free', status: 'active' },
  { name: 'Taylor Kim', email: 'taylor@demo.com', plan: 'Creator', status: 'past_due' },
];

export default function Users() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Users</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map(u => (
                <tr key={u.email} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-white/70">{u.email}</td>
                  <td className="px-4 py-3">{u.plan}</td>
                  <td className="px-4 py-3"><Badge tone={u.status === 'active' ? 'success' : 'warning'}>{u.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
EOF

cat > src/pages/admin/Videos.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export default function Videos() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Videos</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Style</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_PROJECTS.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-white/70">{p.style}</td>
                  <td className="px-4 py-3">0:{p.duration_sec.toString().padStart(2, '0')}</td>
                  <td className="px-4 py-3">{p.credits_used}</td>
                  <td className="px-4 py-3"><Badge tone={p.status === 'completed' ? 'success' : 'warning'}>{p.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
EOF

cat > src/pages/admin/Avatars.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
import { MOCK_AVATARS } from '@/lib/mock-data';

export default function Avatars() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Avatars</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_AVATARS.map(a => (
          <Card key={a.id} className="p-0 overflow-hidden">
            <img src={a.thumbnail_url} alt={a.name} className="aspect-square w-full object-cover" />
            <div className="p-4">
              <p className="font-semibold">{a.name}</p>
              <p className="text-xs text-white/50">{a.style} · {a.voice}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF

cat > src/pages/admin/CreditsAdmin.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
export default function CreditsAdmin() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Credits</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card><p className="text-xs text-white/60">Total issued</p><p className="font-display text-3xl font-bold">128,400</p></Card>
        <Card><p className="text-xs text-white/60">Total consumed</p><p className="font-display text-3xl font-bold">94,210</p></Card>
        <Card><p className="text-xs text-white/60">Remaining</p><p className="font-display text-3xl font-bold">34,190</p></Card>
      </div>
    </div>
  );
}
EOF

cat > src/pages/admin/Transactions.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const tx = [
  { id: 'tx_1', user: 'alex@demo.com', amount: '+500', type: 'purchase', date: '2026-09-09' },
  { id: 'tx_2', user: 'jamie@demo.com', amount: '-20', type: 'video', date: '2026-09-09' },
  { id: 'tx_3', user: 'sam@demo.com', amount: '-50', type: 'avatar', date: '2026-09-08' },
  { id: 'tx_4', user: 'taylor@demo.com', amount: '+100', type: 'purchase', date: '2026-09-07' },
];

export default function Transactions() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Transactions</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tx.map(t => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                  <td className="px-4 py-3">{t.user}</td>
                  <td className={`px-4 py-3 font-semibold ${t.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>{t.amount}</td>
                  <td className="px-4 py-3"><Badge>{t.type}</Badge></td>
                  <td className="px-4 py-3 text-white/60">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
EOF

cat > src/pages/admin/Subscriptions.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const subs = [
  { user: 'alex@demo.com', plan: 'Pro', status: 'active', mrr: 49 },
  { user: 'jamie@demo.com', plan: 'Creator', status: 'active', mrr: 19 },
  { user: 'taylor@demo.com', plan: 'Creator', status: 'past_due', mrr: 19 },
];

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Subscriptions</h1>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/60 text-left text-white/60">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subs.map(s => (
                <tr key={s.user}>
                  <td className="px-4 py-3">{s.user}</td>
                  <td className="px-4 py-3 font-medium">{s.plan}</td>
                  <td className="px-4 py-3"><Badge tone={s.status === 'active' ? 'success' : 'warning'}>{s.status}</Badge></td>
                  <td className="px-4 py-3">${s.mrr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
EOF

cat > src/pages/admin/AdminSettings.tsx << 'EOF'
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

export default function AdminSettings() {
  const { push } = useToast();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Admin Settings</h1>
      <Card className="space-y-4">
        <Input label="Platform name" defaultValue="VFXAI" />
        <Input label="Support email" defaultValue="support@vfxai.app" />
        <Input label="Default free credits" defaultValue="500" />
        <Button onClick={() => push({ type: 'success', title: 'Settings saved' })}>Save</Button>
      </Card>
    </div>
  );
}
EOF

# ──────────────────────────────────────────────
# App.tsx (Router)
# ──────────────────────────────────────────────

cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import { CreditsProvider } from '@/hooks/useCredits';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminShell } from '@/components/layout/AdminShell';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

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
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CreditsProvider>
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

# ──────────────────────────────────────────────
# Done!
# ──────────────────────────────────────────────

echo ""
echo "🎉 VFXAI setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. npm run dev"
echo "  3. Open http://localhost:5173"
echo ""
echo "To access the admin area, edit src/hooks/useAuth.tsx"
echo "and change DEMO_USER.role from 'user' to 'admin'."
echo ""
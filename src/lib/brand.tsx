export const BRAND = {
  name: 'VFXAI',
  tagline: 'Create. Transform. Imagine.',
  primary: '#a855f7',   // purple
  secondary: '#3b82f6', // blue
  accent: '#ec4899',    // pink
  supportEmail: 'support@vfxai.app',
  website: 'https://vfxai.app',
};

export const LOGO = () => (
  <span className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-purple via-neon-blue to-neon-pink shadow-neon">
      <span className="absolute inset-[2px] rounded-[6px] bg-ink-950" />
      <span className="relative text-white text-sm font-black">V</span>
    </span>
    <span className="neon-text">{BRAND.name}</span>
  </span>
);
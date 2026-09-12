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
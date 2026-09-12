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
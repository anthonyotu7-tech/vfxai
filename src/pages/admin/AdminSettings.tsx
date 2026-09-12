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
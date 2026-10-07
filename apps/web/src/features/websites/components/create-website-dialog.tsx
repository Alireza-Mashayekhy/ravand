'use client';

import { Globe, Plus, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useActiveProject } from '@/features/projects/active-project-context';
import { useProjects } from '@/features/projects/store';

import { useWebsites } from '../store';

export function CreateWebsiteDialog({ onClose }: { onClose: () => void }) {
  const { addWebsite } = useWebsites();
  const { projects } = useProjects();
  const { activeProjectId } = useActiveProject();

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(
    activeProjectId !== 'all' ? activeProjectId : projects[0]?.id || '',
  );
  const [cms, setCms] = useState('Next.js / Custom');
  const [framework, setFramework] = useState('React / TypeScript');
  const [registrar, setRegistrar] = useState('Nic.ir (ایرنیک)');
  const [domainDays, setDomainDays] = useState(365);
  const [sslProvider, setSslProvider] = useState("Let's Encrypt");
  const [sslDays, setSslDays] = useState(90);
  const [hostingProvider, setHostingProvider] = useState('Hetzner');
  const [hostingDays, setHostingDays] = useState(180);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;

    addWebsite({
      name: name.trim(),
      domain: domain.trim().replace(/^https?:\/\//, ''),
      description: description.trim(),
      status: 'active',
      projectId: projectId || undefined,
      cms,
      framework,
      domainInfo: {
        name: domain.trim(),
        registrar,
        registeredAt: '۱۴۰۳/۰۱/۰۱',
        expiresAt: '۱۴۰۴/۰۱/۰۱',
        daysRemaining: Number(domainDays) || 365,
        autoRenew: true,
        nameservers: ['ns1.example.com', 'ns2.example.com'],
      },
      sslInfo: {
        provider: sslProvider,
        issuer: 'Authority',
        expiresAt: '۱۴۰۳/۰۷/۰۱',
        daysRemaining: Number(sslDays) || 90,
        autoRenew: true,
      },
      hostingInfo: {
        provider: hostingProvider,
        plan: 'Standard Cloud',
        expiresAt: '۱۴۰۳/۱۰/۰۱',
        daysRemaining: Number(hostingDays) || 180,
      },
      accessList: [],
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-card w-full max-w-xl rounded-2xl border p-6 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-primary">
              <Globe className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-bold">افزودن وب‌سایت جدید</h2>
              <p className="text-xs text-muted-foreground">ثبت مشخصات و اطلاعات هاستینگ و دامنه</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold">نام وب‌سایت</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثلاً: وب‌سایت منشیم"
                className="mt-1.5"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold">دامنه اصلی</label>
              <Input
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="monshiim.ir"
                className="mt-1.5"
                dir="ltr"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold">توضیحات مختصر</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="هدف یا مخاطب این وب‌سایت"
              className="mt-1.5"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold">پروژه مرتبط</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="bg-card mt-1.5 h-9 w-full rounded-md border px-3 text-xs"
              >
                <option value="">(بدون پروژه مستقیم)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold">سیستم مدیریت محتوا (CMS)</label>
              <Input
                value={cms}
                onChange={(e) => setCms(e.target.value)}
                placeholder="Next.js / WordPress"
                className="mt-1.5"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">فریم‌ورک / تکنولوژی</label>
              <Input
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                placeholder="React / TypeScript"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-3">
            <h3 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-primary">
              <ShieldCheck className="size-4" /> وضعیت انقضا و زیرساخت
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-[11px] text-muted-foreground">ثبت‌کننده دامنه</label>
                <Input
                  value={registrar}
                  onChange={(e) => setRegistrar(e.target.value)}
                  className="mt-1 h-8 text-xs"
                />
                <label className="mt-2 block text-[10px] text-muted-foreground">روز تا انقضای دامنه</label>
                <Input
                  type="number"
                  value={domainDays}
                  onChange={(e) => setDomainDays(Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground">صادرکننده SSL</label>
                <Input
                  value={sslProvider}
                  onChange={(e) => setSslProvider(e.target.value)}
                  className="mt-1 h-8 text-xs"
                />
                <label className="mt-2 block text-[10px] text-muted-foreground">روز تا انقضای SSL</label>
                <Input
                  type="number"
                  value={sslDays}
                  onChange={(e) => setSslDays(Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground">میزبان / هاستینگ</label>
                <Input
                  value={hostingProvider}
                  onChange={(e) => setHostingProvider(e.target.value)}
                  className="mt-1 h-8 text-xs"
                />
                <label className="mt-2 block text-[10px] text-muted-foreground">روز تا انقضای هاست</label>
                <Input
                  type="number"
                  value={hostingDays}
                  onChange={(e) => setHostingDays(Number(e.target.value))}
                  className="mt-1 h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" size="sm" className="gap-1.5 bg-primary text-primary-foreground">
              <Plus className="size-4" /> ذخیره وب‌سایت
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

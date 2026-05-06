import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    business_name: "ONE BIG PARTY",
     support_email: "info@onebigparty.net",
    instagram: "",
    facebook: "",
    twitter: "",
    seo_title: "ONE BIG PARTY – Prague's Premium Nightlife",
    seo_description: "Premium party events in Prague. Buy verified tickets, get QR entry, experience the best nightlife.",
  });

  const handleSave = () => {
    localStorage.setItem("obp_settings", JSON.stringify(settings));
    toast.success("Settings saved!");
  };

  useEffect(() => {
    const saved = localStorage.getItem("obp_settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="rounded-xl bg-card neon-border p-6 space-y-4">
          <h2 className="font-display font-semibold">Business Info</h2>
          <input placeholder="Business name" value={settings.business_name} onChange={(e) => setSettings({ ...settings, business_name: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          <input placeholder="Support email" value={settings.support_email} onChange={(e) => setSettings({ ...settings, support_email: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
        </div>

        <div className="rounded-xl bg-card neon-border p-6 space-y-4">
          <h2 className="font-display font-semibold">Social Links</h2>
          <input placeholder="Instagram URL" value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          <input placeholder="Facebook URL" value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          <input placeholder="Twitter / X URL" value={settings.twitter} onChange={(e) => setSettings({ ...settings, twitter: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
        </div>

        <div className="rounded-xl bg-card neon-border p-6 space-y-4">
          <h2 className="font-display font-semibold">SEO Defaults</h2>
          <input placeholder="Default title" value={settings.seo_title} onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          <textarea placeholder="Default meta description" value={settings.seo_description} onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none" />
        </div>

        <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:glow-purple transition-all">Save Settings</button>
      </div>
    </div>
  );
}

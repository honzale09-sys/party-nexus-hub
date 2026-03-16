import { useState, useRef } from "react";
import { useEvents } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Eye, EyeOff, Copy, Upload, X } from "lucide-react";

export default function AdminEvents() {
  const { data: events = [], isLoading } = useEvents(false);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "", slug: "", date: "", time: "22:00", venue_name: "", venue_address: "",
    category: "club", age_restriction: "18+", dress_code: "", tagline: "", description: "",
    featured: false, status: "draft", capacity_total: 0, poster_url: "",
  });

  const resetForm = () => {
    setForm({ title: "", slug: "", date: "", time: "22:00", venue_name: "", venue_address: "", category: "club", age_restriction: "18+", dress_code: "", tagline: "", description: "", featured: false, status: "draft", capacity_total: 0, poster_url: "" });
    setEditingId(null);
    setShowForm(false);
    setPosterFile(null);
    setPosterPreview(null);
  };

  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const uploadPoster = async (slug: string): Promise<string | null> => {
    if (!posterFile) return form.poster_url || null;
    setUploading(true);
    try {
      const ext = posterFile.name.split(".").pop();
      const path = `${slug}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("event-posters").upload(path, posterFile, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("event-posters").getPublicUrl(path);
      return data.publicUrl;
    } catch (err: any) {
      toast.error("Failed to upload poster: " + err.message);
      return form.poster_url || null;
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSave = async () => {
    try {
      const slug = form.slug || generateSlug(form.title);
      const posterUrl = await uploadPoster(slug);
      const { poster_url, ...rest } = form;
      const payload = { ...rest, slug, date: new Date(form.date).toISOString(), poster_url: posterUrl };
      if (editingId) {
        const { error } = await supabase.from("events").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Event updated!");
      } else {
        const { error } = await supabase.from("events").insert(payload);
        if (error) throw error;
        toast.success("Event created!");
      }
      queryClient.invalidateQueries({ queryKey: ["events"] });
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (e: any) => {
    setForm({
      title: e.title, slug: e.slug, date: e.date?.split("T")[0] || "", time: e.time, venue_name: e.venue_name,
      venue_address: e.venue_address, category: e.category, age_restriction: e.age_restriction || "18+",
      dress_code: e.dress_code || "", tagline: e.tagline || "", description: e.description || "",
      featured: e.featured, status: e.status, capacity_total: e.capacity_total || 0,
      poster_url: e.poster_url || "",
    });
    setPosterPreview(e.poster_url || null);
    setPosterFile(null);
    setEditingId(e.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Event deleted"); queryClient.invalidateQueries({ queryKey: ["events"] }); }
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "published" ? "draft" : "published";
    const { error } = await supabase.from("events").update({ status: next }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Event ${next}`); queryClient.invalidateQueries({ queryKey: ["events"] }); }
  };

  const duplicate = async (e: any) => {
    const { id, created_at, updated_at, ticket_tiers, ...rest } = e;
    const { error } = await supabase.from("events").insert({ ...rest, title: `${rest.title} (Copy)`, slug: `${rest.slug}-copy-${Date.now()}`, status: "draft" });
    if (error) toast.error(error.message);
    else { toast.success("Event duplicated"); queryClient.invalidateQueries({ queryKey: ["events"] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Events</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus size={16} /> New Event</button>
      </div>

      {showForm && (
        <div className="rounded-xl bg-card neon-border p-6 mb-6 space-y-4">
          <h2 className="font-display font-semibold text-lg">{editingId ? "Edit Event" : "New Event"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="Time (e.g. 22:00)" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="Venue name" value={form.venue_name} onChange={(e) => setForm({ ...form, venue_name: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="Venue address" value={form.venue_address} onChange={(e) => setForm({ ...form, venue_address: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm">
              <option value="club">Club</option><option value="rooftop">Rooftop</option><option value="warehouse">Warehouse</option><option value="theme">Theme</option>
            </select>
            <input placeholder="Age restriction" value={form.age_restriction} onChange={(e) => setForm({ ...form, age_restriction: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="Dress code (optional)" value={form.dress_code} onChange={(e) => setForm({ ...form, dress_code: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="Capacity" type="number" value={form.capacity_total} onChange={(e) => setForm({ ...form, capacity_total: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          </div>

          {/* Poster Upload */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Event Poster</label>
            <div className="flex items-start gap-4">
              {posterPreview ? (
                <div className="relative w-32 aspect-[3/4] rounded-lg overflow-hidden bg-muted border border-border">
                  <img src={posterPreview} alt="Poster preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setPosterFile(null); setPosterPreview(null); setForm({ ...form, poster_url: "" }); }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-destructive hover:bg-background transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 aspect-[3/4] rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Upload size={20} />
                  <span className="text-xs">Upload</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePosterSelect} className="hidden" />
              {posterPreview && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-primary hover:underline mt-1">Change image</button>
              )}
            </div>
          </div>

          <input placeholder="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none" />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm">
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Save</button>
            <button onClick={resetForm} className="px-6 py-2 rounded-lg bg-muted text-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl bg-card neon-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3">Event</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Venue</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {events.map((e: any) => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3"><p className="font-semibold">{e.title}</p><p className="text-xs text-muted-foreground">{e.category} {e.featured ? "⭐" : ""}</p></td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-muted-foreground">{e.venue_name}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${e.status === "published" ? "bg-green-500/10 text-green-400" : e.status === "draft" ? "bg-yellow-500/10 text-yellow-400" : "bg-muted text-muted-foreground"}`}>{e.status}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(e)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                      <button onClick={() => toggleStatus(e.id, e.status)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">{e.status === "published" ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                      <button onClick={() => duplicate(e)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Copy size={14} /></button>
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded hover:bg-muted transition-colors text-destructive"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

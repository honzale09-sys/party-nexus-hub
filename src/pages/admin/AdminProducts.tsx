import { useState, useRef } from "react";
import { useProducts } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Upload, X } from "lucide-react";

export default function AdminProducts() {
  const { data: products = [], isLoading } = useProducts(false);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", category: "tees", price: 0, featured: false, active: true, sku: "", images: [] as string[] });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const genSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      const skipped: string[] = [];
      for (const file of files) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const imageExts = ["jpg","jpeg","png","webp","gif","heic","heif","avif","bmp"];
        const isImage = file.type.startsWith("image/") || imageExts.includes(ext);
        if (!isImage) { toast.error(`${file.name} is not an image`); skipped.push(file.name); continue; }
        if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB`); skipped.push(file.name); continue; }
        const path = `${(form.slug || genSlug(form.name) || "product")}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const contentType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;
        const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false, contentType });
        if (error) {
          console.error("Upload error for", file.name, error);
          toast.error(`${file.name}: ${error.message}`);
          skipped.push(file.name);
          continue;
        }
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      if (uploaded.length > 0) {
        setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
        toast.success(`Uploaded ${uploaded.length} image(s)`);
      } else if (skipped.length > 0) {
        toast.error(`No files uploaded. Check file type/size.`);
      }
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error("Upload failed: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, slug: form.slug || genSlug(form.name) };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product created!");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false); setEditingId(null);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleEdit = (p: any) => {
    setForm({ name: p.name, slug: p.slug, description: p.description || "", category: p.category, price: p.price, featured: p.featured, active: p.active, sku: p.sku || "", images: p.images || [] });
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); queryClient.invalidateQueries({ queryKey: ["products"] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <button onClick={() => { setForm({ name: "", slug: "", description: "", category: "tees", price: 0, featured: false, active: true, sku: "", images: [] }); setEditingId(null); setShowForm(true); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus size={16} /> Add Product</button>
      </div>

      {showForm && (
        <div className="rounded-xl bg-card neon-border p-6 mb-6 space-y-4">
          <h2 className="font-display font-semibold">{editingId ? "Edit" : "New"} Product</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: genSlug(e.target.value) })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm">
              <option value="tees">Tees</option><option value="hoodies">Hoodies</option><option value="accessories">Accessories</option>
            </select>
            <input type="number" placeholder="Price (CZK)" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none" />

          {/* Product images */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Product Images</label>
            <div className="flex items-start gap-3 flex-wrap">
              {form.images.map((url) => (
                <div key={url} className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted border border-border">
                  <img src={url} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-destructive hover:bg-background transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
              >
                <Upload size={16} />
                <span className="text-[10px]">{uploading ? "Uploading..." : "Add"}</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">First image will be used as the main thumbnail. Max 5MB each.</p>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Save</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg bg-muted text-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl bg-card neon-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {products.map((p: any) => {
                const totalStock = p.product_variants?.reduce((s: number, v: any) => s + v.stock, 0) || 0;
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3"><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.sku}</p></td>
                    <td className="px-5 py-3 text-muted-foreground capitalize">{p.category}</td>
                    <td className="px-5 py-3 font-semibold">{p.price} CZK</td>
                    <td className="px-5 py-3"><span className={totalStock <= 5 ? "text-destructive font-medium" : "text-muted-foreground"}>{totalStock}</span></td>
                    <td className="px-5 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${p.active ? "bg-green-500/10 text-green-400" : "bg-muted text-muted-foreground"}`}>{p.active ? "Active" : "Inactive"}</span></td>
                    <td className="px-5 py-3 flex gap-2">
                      <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-muted text-destructive"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

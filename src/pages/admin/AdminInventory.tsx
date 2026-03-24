import { useInventory, useProducts } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Plus, X } from "lucide-react";

export default function AdminInventory() {
  const { data: variants = [], isLoading } = useInventory();
  const { data: products = [] } = useProducts(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockDelta, setStockDelta] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newVariant, setNewVariant] = useState({ product_id: "", size: "", color: "", sku: "", stock: 0 });

  const updateStock = async (variantId: string, currentStock: number) => {
    const newStock = currentStock + stockDelta;
    if (newStock < 0) { toast.error("Stock can't be negative"); return; }
    const { error } = await supabase.from("product_variants").update({ stock: newStock }).eq("id", variantId);
    if (error) { toast.error(error.message); return; }
    await supabase.from("inventory_logs").insert({ product_variant_id: variantId, delta: stockDelta, reason: "Manual adjustment", changed_by: user?.id });
    toast.success("Stock updated");
    setEditingId(null);
    setStockDelta(0);
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const addVariant = async () => {
    if (!newVariant.product_id) { toast.error("Select a product"); return; }
    const { error } = await supabase.from("product_variants").insert({
      product_id: newVariant.product_id,
      size: newVariant.size || null,
      color: newVariant.color || null,
      sku: newVariant.sku || null,
      stock: newVariant.stock,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Variant added!");
    setShowAdd(false);
    setNewVariant({ product_id: "", size: "", color: "", sku: "", stock: 0 });
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const deleteVariant = async (id: string) => {
    if (!confirm("Delete this variant?")) return;
    const { error } = await supabase.from("product_variants").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Variant deleted");
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Inventory</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Variant
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl bg-card neon-border p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">New Variant</h2>
            <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              value={newVariant.product_id}
              onChange={(e) => setNewVariant({ ...newVariant, product_id: e.target.value })}
              className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
            >
              <option value="">Select product…</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input placeholder="Size (e.g. M, L, XL)" value={newVariant.size} onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="Color" value={newVariant.color} onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input placeholder="SKU" value={newVariant.sku} onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input type="number" placeholder="Initial stock" value={newVariant.stock} onChange={(e) => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          </div>
          <button onClick={addVariant} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Add Variant</button>
        </div>
      )}

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl bg-card neon-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3">Product</th><th className="px-5 py-3">Variant</th><th className="px-5 py-3">SKU</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Adjust</th><th className="px-5 py-3"></th>
            </tr></thead>
            <tbody>
              {variants.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No variants yet. Add a product first, then add variants here.</td></tr>
              ) : variants.map((v: any) => (
                <tr key={v.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${v.stock <= 5 ? "bg-destructive/5" : ""}`}>
                  <td className="px-5 py-3 font-medium">{v.products?.name || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.size || "—"} {v.color || ""}</td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{v.sku || "—"}</td>
                  <td className="px-5 py-3"><span className={v.stock <= 5 ? "text-destructive font-bold" : "font-semibold"}>{v.stock} {v.stock <= 5 && "⚠️"}</span></td>
                  <td className="px-5 py-3">
                    {editingId === v.id ? (
                      <div className="flex items-center gap-2">
                        <input type="number" value={stockDelta} onChange={(e) => setStockDelta(parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 rounded bg-background border border-border text-foreground text-sm" />
                        <button onClick={() => updateStock(v.id, v.stock)} className="text-xs text-primary font-medium">Apply</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(v.id); setStockDelta(0); }} className="text-xs text-primary">Adjust</button>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => deleteVariant(v.id)} className="text-xs text-destructive hover:underline">Delete</button>
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

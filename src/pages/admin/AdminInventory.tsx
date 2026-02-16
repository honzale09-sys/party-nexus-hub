import { useInventory } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AdminInventory() {
  const { data: variants = [], isLoading } = useInventory();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [stockDelta, setStockDelta] = useState(0);

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

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Inventory</h1>
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl bg-card neon-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3">Product</th><th className="px-5 py-3">Variant</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Adjust</th>
            </tr></thead>
            <tbody>
              {variants.map((v: any) => (
                <tr key={v.id} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${v.stock <= 5 ? "bg-destructive/5" : ""}`}>
                  <td className="px-5 py-3 font-medium">{(v as any).products?.name || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{v.size || "—"} {v.color || ""}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { usePromoCodes } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function AdminPromoCodes() {
  const { data: promos = [], isLoading } = usePromoCodes();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discount_type: "percentage", discount_value: 10, applies_to: "both", valid_from: "", valid_until: "", usage_limit: 100, minimum_spend: 0, per_customer_limit: 1 });

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("promo_codes").insert({
        ...form,
        valid_from: form.valid_from ? new Date(form.valid_from).toISOString() : null,
        valid_until: form.valid_until ? new Date(form.valid_until).toISOString() : null,
      });
      if (error) throw error;
      toast.success("Promo code created!");
      queryClient.invalidateQueries({ queryKey: ["promo_codes"] });
      setShowForm(false);
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("promo_codes").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); queryClient.invalidateQueries({ queryKey: ["promo_codes"] }); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Promo Codes</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2"><Plus size={16} /> New Code</button>
      </div>

      {showForm && (
        <div className="rounded-xl bg-card neon-border p-6 mb-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Code (e.g. SUMMER20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm">
              <option value="percentage">Percentage (%)</option><option value="fixed">Fixed (CZK)</option>
            </select>
            <input type="number" placeholder="Discount value" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <select value={form.applies_to} onChange={(e) => setForm({ ...form, applies_to: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm">
              <option value="both">Tickets & Merch</option><option value="tickets">Tickets only</option><option value="merch">Merch only</option>
            </select>
            <input type="date" placeholder="Valid from" value={form.valid_from} onChange={(e) => setForm({ ...form, valid_from: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input type="date" placeholder="Valid until" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input type="number" placeholder="Usage limit" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
            <input type="number" placeholder="Min spend (CZK)" value={form.minimum_spend} onChange={(e) => setForm({ ...form, minimum_spend: parseInt(e.target.value) || 0 })} className="px-4 py-2 rounded-lg bg-background border border-border text-foreground text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Create</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 rounded-lg bg-muted text-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl bg-card neon-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3">Code</th><th className="px-5 py-3">Discount</th><th className="px-5 py-3">Applies To</th><th className="px-5 py-3">Usage</th><th className="px-5 py-3">Valid</th><th className="px-5 py-3">Actions</th>
            </tr></thead>
            <tbody>
              {promos.map((p: any) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono font-semibold">{p.code}</td>
                  <td className="px-5 py-3">{p.discount_value}{p.discount_type === "percentage" ? "%" : " CZK"}</td>
                  <td className="px-5 py-3 text-muted-foreground capitalize">{p.applies_to}</td>
                  <td className="px-5 py-3">{p.usage_count}/{p.usage_limit || "∞"}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{p.valid_from ? new Date(p.valid_from).toLocaleDateString() : "—"} → {p.valid_until ? new Date(p.valid_until).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-3"><button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-muted text-destructive"><Trash2 size={14} /></button></td>
                </tr>
              ))}
              {promos.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No promo codes</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

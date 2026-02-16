import { useState } from "react";
import { useCustomers } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdminCustomers() {
  const { data: customers = [], isLoading } = useCustomers();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const saveNote = async (id: string) => {
    const { error } = await supabase.from("customers").update({ notes }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Notes saved"); setEditingId(null); queryClient.invalidateQueries({ queryKey: ["customers"] }); }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Customers</h1>
      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl bg-card neon-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Phone</th><th className="px-5 py-3">Tags</th><th className="px-5 py-3">Notes</th>
            </tr></thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{c.name || "—"}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.phone || "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">{c.tags?.map((t: string) => <span key={t} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{t}</span>)}</div>
                  </td>
                  <td className="px-5 py-3">
                    {editingId === c.id ? (
                      <div className="flex gap-2">
                        <input value={notes} onChange={(e) => setNotes(e.target.value)} className="px-2 py-1 rounded bg-background border border-border text-foreground text-xs w-40" />
                        <button onClick={() => saveNote(c.id)} className="text-xs text-primary">Save</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(c.id); setNotes(c.notes || ""); }} className="text-xs text-muted-foreground hover:text-foreground">{c.notes || "Add note..."}</button>
                    )}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No customers yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

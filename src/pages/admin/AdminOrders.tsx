import { useOrders } from "@/hooks/useData";
import { Download } from "lucide-react";

export default function AdminOrders() {
  const { data: orders = [], isLoading } = useOrders();

  const exportCSV = () => {
    const rows = orders.map((o: any) => [o.id, o.customer_email, o.customer_name || "", o.total_amount, o.currency, o.payment_status, o.fulfillment_status, o.created_at].join(","));
    const csv = "Order ID,Email,Name,Amount,Currency,Payment,Fulfillment,Date\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Orders</h1>
        <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold flex items-center gap-2"><Download size={16} /> Export CSV</button>
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="rounded-xl bg-card neon-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-5 py-3">ID</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Fulfillment</th><th className="px-5 py-3">Date</th>
              </tr></thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                    <td className="px-5 py-3"><p className="font-medium">{o.customer_name || "—"}</p><p className="text-xs text-muted-foreground">{o.customer_email}</p></td>
                    <td className="px-5 py-3 font-semibold">{o.total_amount} {o.currency}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${o.payment_status === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>{o.payment_status}</span></td>
                    <td className="px-5 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${o.fulfillment_status === "shipped" ? "bg-blue-500/10 text-blue-400" : "bg-muted text-muted-foreground"}`}>{o.fulfillment_status}</span></td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

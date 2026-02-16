import { motion } from "framer-motion";
import { DollarSign, Ticket, Calendar, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents, useProducts, useOrders } from "@/hooks/useData";

export default function AdminDashboard() {
  const { data: events = [] } = useEvents(false);
  const { data: products = [] } = useProducts(false);
  const { data: orders = [] } = useOrders();

  const totalRevenue = orders.reduce((s: number, o: any) => s + (o.payment_status === "paid" ? o.total_amount : 0), 0);
  const ticketsSold = orders.reduce((s: number, o: any) => s + (o.order_items?.filter((i: any) => i.item_type === "ticket").reduce((ts: number, i: any) => ts + i.quantity, 0) || 0), 0);
  const lowStockProducts = products.filter((p: any) => p.product_variants?.some((v: any) => v.stock <= 5)).length;

  const kpis = [
    { label: "Total Revenue", value: `${totalRevenue.toLocaleString()} CZK`, icon: DollarSign },
    { label: "Tickets Sold", value: String(ticketsSold), icon: Ticket },
    { label: "Total Events", value: String(events.length), icon: Calendar },
    { label: "Low Stock Items", value: String(lowStockProducts), icon: Package },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/events" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all hover:glow-purple">+ Create Event</Link>
          <Link to="/admin/products" className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">+ Add Product</Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-card neon-border p-5">
            <k.icon size={20} className="text-primary mb-3" />
            <p className="font-display text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl bg-card neon-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-primary flex items-center gap-1">View all <ArrowRight size={12} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="px-5 py-3">Order ID</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Date</th>
            </tr></thead>
            <tbody>
              {orders.slice(0, 5).map((o: any) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">{o.id.slice(0, 8)}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.customer_email}</td>
                  <td className="px-5 py-3 font-semibold">{o.total_amount} {o.currency}</td>
                  <td className="px-5 py-3"><span className={`px-2 py-1 rounded text-xs font-medium ${o.payment_status === "paid" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>{o.payment_status}</span></td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

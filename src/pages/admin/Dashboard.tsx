import { motion } from "framer-motion";
import { DollarSign, Ticket, Calendar, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { events, products } from "@/data/mockData";

const kpis = [
  { label: "Total Revenue", value: "245,800 CZK", icon: DollarSign, change: "+12%" },
  { label: "Tickets Sold", value: "1,247", icon: Ticket, change: "+8%" },
  { label: "Upcoming Events", value: String(events.length), icon: Calendar, change: "" },
  { label: "Low Stock Items", value: String(products.filter((p) => !p.inStock).length), icon: Package, change: "" },
];

const recentOrders = [
  { id: "ORD-001", customer: "jan.novak@email.cz", items: "2x Regular – NEON NIGHTS", amount: "1,100 CZK", status: "Paid" },
  { id: "ORD-002", customer: "eva.k@email.cz", items: "1x VIP – SKYLINE SESSIONS", amount: "4,500 CZK", status: "Paid" },
  { id: "ORD-003", customer: "peter.s@email.cz", items: "OBP Classic Tee (M)", amount: "890 CZK", status: "Shipped" },
  { id: "ORD-004", customer: "maria.d@email.cz", items: "1x Early Bird – NEON NIGHTS", amount: "350 CZK", status: "Paid" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/events" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all hover:glow-purple">
            + Create Event
          </Link>
          <Link to="/admin/products" className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-surface-hover transition-colors">
            + Add Product
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-card neon-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <k.icon size={20} className="text-primary" />
              {k.change && <span className="text-xs text-green-400 font-medium">{k.change}</span>}
            </div>
            <p className="font-display text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{k.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-card neon-border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs text-primary flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                  <td className="px-5 py-3 text-muted-foreground">{o.customer}</td>
                  <td className="px-5 py-3">{o.items}</td>
                  <td className="px-5 py-3 font-semibold">{o.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      o.status === "Paid" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

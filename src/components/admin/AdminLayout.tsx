import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, Calendar, Ticket, Users, ShoppingBag, Package, Tag, QrCode, Settings, LogOut, Menu, X,
} from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/events", icon: Calendar, label: "Events" },
  { to: "/admin/orders", icon: Ticket, label: "Orders" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/products", icon: ShoppingBag, label: "Products" },
  { to: "/admin/inventory", icon: Package, label: "Inventory" },
  { to: "/admin/promos", icon: Tag, label: "Promo Codes" },
  { to: "/admin/scanner", icon: QrCode, label: "Door Scanner" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/" className="font-display text-sm font-bold text-gradient">ONE BIG PARTY</Link>
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Link
            to="/admin/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-background/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 h-14 border-b border-border bg-card/80 backdrop-blur flex items-center px-4 gap-4">
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h2 className="font-display text-sm font-semibold text-muted-foreground">Admin Dashboard</h2>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

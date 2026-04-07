import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TicketCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: {
    id: string;
    name: string;
    price: number;
    currency: string;
    max_per_order: number;
  };
  eventTitle: string;
}

export default function TicketCheckoutDialog({ open, onOpenChange, tier, eventTitle }: TicketCheckoutDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const total = tier.price * qty;

  const handleCheckout = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{ type: "ticket", ticket_tier_id: tier.id, quantity: qty }],
          customer_email: email.trim(),
          customer_name: name.trim() || undefined,
          origin: window.location.origin,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Checkout failed");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onOpenChange(false);
    setTimeout(() => {
      setName("");
      setEmail("");
      setQty(1);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Buy {tier.name} Tickets</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">{eventTitle} · {tier.name} · {tier.price} {tier.currency} each</p>

          <div>
            <label className="text-sm font-medium">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground" />
          </div>

          <div>
            <label className="text-sm font-medium">Email *</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" required className="mt-1 w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground" />
          </div>

          <div>
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3 mt-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground hover:text-primary transition-colors">−</button>
              <span className="font-semibold w-6 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(tier.max_per_order, qty + 1))} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-foreground hover:text-primary transition-colors">+</button>
              <span className="text-xs text-muted-foreground ml-2">max {tier.max_per_order}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-display font-bold text-lg">{total} {tier.currency}</span>
          </div>

          <button onClick={handleCheckout} disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:glow-purple hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={16} /> Redirecting to payment...</> : "Proceed to Payment"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

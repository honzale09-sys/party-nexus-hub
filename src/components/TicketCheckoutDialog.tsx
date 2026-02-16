import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, Copy } from "lucide-react";
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

type Step = "form" | "processing" | "success";

interface TicketResult {
  id: string;
  qr_code: string;
  qr_url: string;
}

export default function TicketCheckoutDialog({ open, onOpenChange, tier, eventTitle }: TicketCheckoutDialogProps) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [qty, setQty] = useState(1);
  const [tickets, setTickets] = useState<TicketResult[]>([]);

  const total = tier.price * qty;

  const handleCheckout = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    setStep("processing");

    try {
      // 1. Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_email: email.trim(),
          customer_name: name.trim() || null,
          total_amount: total,
          currency: tier.currency,
          payment_status: "paid", // test mode — mark as paid
          fulfillment_status: "confirmed",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order item
      const { error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          item_type: "ticket",
          ticket_tier_id: tier.id,
          quantity: qty,
          unit_price: tier.price,
          total_price: total,
        });

      if (itemError) throw itemError;

      // 3. Call generate-qr edge function
      const { data: qrData, error: qrError } = await supabase.functions.invoke("generate-qr", {
        body: { order_id: order.id },
      });

      if (qrError) throw qrError;

      setTickets(qrData.tickets || []);
      setStep("success");
      toast.success(`${qrData.count} ticket(s) generated!`);
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err.message || "Checkout failed");
      setStep("form");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setStep("form");
      setTickets([]);
      setName("");
      setEmail("");
      setQty(1);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {step === "success" ? "Your Tickets 🎉" : `Buy ${tier.name} Tickets`}
          </DialogTitle>
        </DialogHeader>

        {step === "form" && (
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

            <button onClick={handleCheckout} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:glow-purple hover:scale-[1.02]">
              Complete Purchase (Test Mode)
            </button>
            <p className="text-xs text-center text-muted-foreground">No real payment — this is test mode</p>
          </div>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="animate-spin text-primary" size={32} />
            <p className="text-sm text-muted-foreground">Creating order & generating QR codes...</p>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Your {tickets.length} ticket(s) for <strong>{eventTitle}</strong>. Show QR at the door.</p>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {tickets.map((t, i) => (
                <div key={t.id} className="text-center p-4 rounded-xl bg-muted">
                  <p className="text-sm font-semibold mb-2">Ticket {i + 1}</p>
                  <img src={t.qr_url} alt={`QR ${i + 1}`} className="w-48 h-48 mx-auto rounded-lg bg-white p-2" />
                  <button onClick={() => { navigator.clipboard.writeText(t.qr_code); toast.success("Copied!"); }} className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Copy size={12} /> {t.qr_code.slice(0, 8)}...
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleClose} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">Done</button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

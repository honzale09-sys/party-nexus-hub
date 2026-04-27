import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MerchCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productVariantId: string;
  productName: string;
  unitPrice: number;
  currency: string;
  quantity: number;
}

export default function MerchCheckoutDialog({
  open,
  onOpenChange,
  productVariantId,
  productName,
  unitPrice,
  currency,
  quantity,
}: MerchCheckoutDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);

  const total = unitPrice * quantity;

  const handleCheckout = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{ type: "product", product_variant_id: productVariantId, quantity }],
          customer_email: email.trim(),
          customer_name: name.trim() || undefined,
          promo_code: promoCode.trim() || undefined,
          origin: window.location.origin,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.url) {
        window.open(data.url, "_blank");
        setLoading(false);
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
      setPromoCode("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">{productName} · {quantity} × {unitPrice} {currency}</p>

          <div>
            <label className="text-sm font-medium">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-1 w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground" />
          </div>

          <div>
            <label className="text-sm font-medium">Email *</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" required className="mt-1 w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground" />
          </div>

          <div>
            <label className="text-sm font-medium">Promo code (optional)</label>
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME10"
              className="mt-1 w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground uppercase"
            />
            <p className="text-xs text-muted-foreground mt-1">Discount will be applied at payment.</p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-display font-bold text-lg">{total} {currency}</span>
          </div>

          <button onClick={handleCheckout} disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:glow-purple hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={16} /> Redirecting to payment...</> : "Proceed to Payment"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
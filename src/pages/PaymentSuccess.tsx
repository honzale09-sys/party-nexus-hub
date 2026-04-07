import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, Copy, XCircle } from "lucide-react";
import { toast } from "sonner";

interface TicketResult {
  id: string;
  qr_code: string;
  qr_url: string;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [tickets, setTickets] = useState<TicketResult[]>([]);
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("verify-payment", {
          body: { session_id: sessionId },
        });
        if (error) throw error;
        setOrderId(data.order_id);
        setTickets(data.tickets || []);
        setStatus("success");
      } catch (err: any) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    verify();
  }, [sessionId]);

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="animate-spin text-primary mx-auto" size={48} />
            <h1 className="font-display text-2xl font-bold">Verifying your payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your order.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6">
            <CheckCircle className="text-green-500 mx-auto" size={64} />
            <h1 className="font-display text-3xl font-bold">Payment Successful! 🎉</h1>
            <p className="text-muted-foreground">Your order has been confirmed.</p>

            {tickets.length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="font-display text-xl font-semibold">Your Tickets</h2>
                <p className="text-sm text-muted-foreground">Show these QR codes at the door</p>
                <div className="space-y-4">
                  {tickets.map((t, i) => (
                    <div key={t.id} className="p-4 rounded-xl bg-muted text-center">
                      <p className="text-sm font-semibold mb-2">Ticket {i + 1}</p>
                      <img src={t.qr_url} alt={`QR ${i + 1}`} className="w-48 h-48 mx-auto rounded-lg bg-white p-2" />
                      <button
                        onClick={() => { navigator.clipboard.writeText(t.qr_code); toast.success("Copied!"); }}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Copy size={12} /> {t.qr_code.slice(0, 8)}...
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Link to="/events" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:scale-105 transition-transform">
                Browse Events
              </Link>
              <Link to="/merch" className="px-6 py-3 rounded-lg bg-muted text-foreground font-semibold text-sm hover:scale-105 transition-transform">
                Shop Merch
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <XCircle className="text-destructive mx-auto" size={64} />
            <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground">We couldn't verify your payment. Please contact support if you were charged.</p>
            <Link to="/" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm mt-4">
              Go Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

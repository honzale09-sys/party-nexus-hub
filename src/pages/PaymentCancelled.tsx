import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentCancelled() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-20 max-w-lg text-center space-y-6">
        <XCircle className="text-muted-foreground mx-auto" size={64} />
        <h1 className="font-display text-3xl font-bold">Payment Cancelled</h1>
        <p className="text-muted-foreground">Your payment was cancelled. No charges were made.</p>
        <div className="flex gap-3 justify-center pt-4">
          <Link to="/events" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:scale-105 transition-transform">
            Back to Events
          </Link>
          <Link to="/merch" className="px-6 py-3 rounded-lg bg-muted text-foreground font-semibold text-sm hover:scale-105 transition-transform">
            Back to Merch
          </Link>
        </div>
      </div>
    </div>
  );
}

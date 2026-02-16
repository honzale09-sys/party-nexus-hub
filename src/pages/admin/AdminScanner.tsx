import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Camera, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

type ScanResult = { status: "valid" | "already_used" | "invalid" | "idle"; message: string; event?: string };

export default function AdminScanner() {
  const { user } = useAuth();
  const [result, setResult] = useState<ScanResult>({ status: "idle", message: "" });
  const [manualId, setManualId] = useState("");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const validateTicket = useCallback(async (qrCode: string) => {
    try {
      const { data: ticket, error } = await supabase
        .from("ticket_instances")
        .select("*, events(title)")
        .eq("qr_code", qrCode)
        .single();

      if (error || !ticket) {
        setResult({ status: "invalid", message: "Ticket not found in the system." });
        await supabase.from("scan_logs").insert({ ticket_instance_id: ticket?.id, scanned_by: user?.id, result: "invalid", event_id: ticket?.event_id });
        return;
      }

      if (ticket.status === "used") {
        setResult({ status: "already_used", message: `Already scanned at ${ticket.scanned_at ? new Date(ticket.scanned_at).toLocaleTimeString() : "unknown time"}`, event: (ticket as any).events?.title });
        await supabase.from("scan_logs").insert({ ticket_instance_id: ticket.id, scanned_by: user?.id, result: "already_used", event_id: ticket.event_id });
        return;
      }

      // Mark as used
      await supabase.from("ticket_instances").update({ status: "used", scanned_at: new Date().toISOString() }).eq("id", ticket.id);
      await supabase.from("scan_logs").insert({ ticket_instance_id: ticket.id, scanned_by: user?.id, result: "valid", event_id: ticket.event_id });

      setResult({ status: "valid", message: "Welcome! Entry approved.", event: (ticket as any).events?.title });
      toast.success("Ticket validated!");
    } catch (err: any) {
      setResult({ status: "invalid", message: err.message });
    }
  }, [user]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setScanning(true);
      toast.info("Camera active. QR scanning requires a library integration — use manual lookup for now.");
    } catch {
      toast.error("Camera access denied");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setScanning(false);
  };

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) validateTicket(manualId.trim());
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-display text-2xl font-bold mb-6 text-center">Door Scanner</h1>

      {/* Camera */}
      <div className="rounded-xl bg-card neon-border overflow-hidden mb-6">
        <div className="aspect-video bg-muted relative flex items-center justify-center">
          {scanning ? (
            <video ref={videoRef} className="w-full h-full object-cover" />
          ) : (
            <Camera size={48} className="text-muted-foreground" />
          )}
        </div>
        <div className="p-4 flex justify-center">
          <button onClick={scanning ? stopCamera : startCamera} className={`px-6 py-2 rounded-lg text-sm font-semibold ${scanning ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"}`}>
            {scanning ? "Stop Camera" : "Start Camera"}
          </button>
        </div>
      </div>

      {/* Manual lookup */}
      <form onSubmit={handleManualLookup} className="flex gap-2 mb-6">
        <input value={manualId} onChange={(e) => setManualId(e.target.value)} placeholder="Enter QR code / Order ID" className="flex-1 px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm" />
        <button type="submit" className="px-4 py-3 rounded-lg bg-primary text-primary-foreground"><Search size={18} /></button>
      </form>

      {/* Result */}
      {result.status !== "idle" && (
        <div className={`rounded-xl p-6 text-center ${result.status === "valid" ? "bg-green-500/10 border border-green-500/30" : result.status === "already_used" ? "bg-yellow-500/10 border border-yellow-500/30" : "bg-destructive/10 border border-destructive/30"}`}>
          {result.status === "valid" && <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />}
          {result.status === "already_used" && <AlertTriangle size={48} className="text-yellow-400 mx-auto mb-3" />}
          {result.status === "invalid" && <XCircle size={48} className="text-destructive mx-auto mb-3" />}
          <h2 className="font-display text-xl font-bold">{result.status === "valid" ? "VALID" : result.status === "already_used" ? "ALREADY USED" : "INVALID"}</h2>
          <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
          {result.event && <p className="text-sm font-medium mt-1">{result.event}</p>}
          <button onClick={() => setResult({ status: "idle", message: "" })} className="mt-4 text-xs text-primary">Scan another</button>
        </div>
      )}
    </div>
  );
}

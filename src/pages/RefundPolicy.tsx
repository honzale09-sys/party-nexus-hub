export default function RefundPolicy() {
  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-8">Refund <span className="text-gradient">Policy</span></h1>
        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: February 2026</p>
          <h2 className="text-foreground font-display font-semibold text-lg">Ticket Refunds</h2>
          <p><strong>More than 48 hours before the event:</strong> Full refund minus a 5% processing fee.</p>
          <p><strong>Less than 48 hours before the event:</strong> No refund. Tickets may be transferred to another person by contacting support.</p>
          <p><strong>Cancelled events:</strong> Full refund issued automatically within 5-7 business days.</p>
          <h2 className="text-foreground font-display font-semibold text-lg">Merchandise Refunds</h2>
          <p><strong>Defective items:</strong> Full refund or replacement within 14 days of delivery. Contact support with photos of the defect.</p>
          <p><strong>Wrong size:</strong> Exchanges available within 14 days if the item is unworn and in original packaging.</p>
          <p><strong>Change of mind:</strong> No refunds for non-defective merchandise.</p>
          <h2 className="text-foreground font-display font-semibold text-lg">How to Request a Refund</h2>
           <p>Email info@onebigparty.net with your order ID, email address, and reason for the refund request. We aim to respond within 2 business days.</p>
        </div>
      </section>
    </div>
  );
}

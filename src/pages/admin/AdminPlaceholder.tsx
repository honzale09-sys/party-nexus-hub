export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-2xl font-bold mb-3">{title}</h1>
      <p className="text-muted-foreground text-sm max-w-md">
        This section will be fully functional once the backend is connected. Enable Lovable Cloud to add database, authentication, and Stripe integration.
      </p>
    </div>
  );
}

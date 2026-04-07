import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { useProduct } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  if (isLoading) return <div className="pt-20 min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

  if (!product) return (
    <div className="pt-20 container mx-auto px-4 py-40 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <Link to="/merch" className="text-primary mt-4 inline-block">← Back to merch</Link>
    </div>
  );

  const sizes = [...new Set(product.product_variants?.map((v: any) => v.size).filter(Boolean))];
  const selectedVariant = product.product_variants?.find((v: any) => v.size === selectedSize);
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.product_variants?.some((v: any) => v.stock > 0);

  const handleBuy = async () => {
    // Determine variant to buy
    let variantId: string | undefined;
    if (sizes.length > 0) {
      variantId = selectedVariant?.id;
    } else {
      variantId = product.product_variants?.[0]?.id;
    }

    if (!variantId) {
      toast.error("Please select a variant");
      return;
    }

    setCheckoutLoading(true);
    try {
      const email = prompt("Enter your email to proceed to checkout:");
      if (!email) {
        setCheckoutLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{ type: "product", product_variant_id: variantId, quantity: qty }],
          customer_email: email.trim(),
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
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="container mx-auto px-4 py-10">
        <Link to="/merch" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={14} /> Back to merch
        </Link>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-xl bg-muted flex items-center justify-center text-8xl text-muted-foreground">
            {product.category === "tees" ? "👕" : product.category === "hoodies" ? "🧥" : "🧢"}
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-primary">{product.category}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
            <p className="text-2xl font-display font-bold text-primary mt-3">{product.price} {product.currency}</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

            {sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-3">Size</p>
                <div className="flex gap-2">
                  {sizes.map((s: any) => {
                    const variant = product.product_variants?.find((v: any) => v.size === s);
                    const outOfStock = variant && variant.stock <= 0;
                    return (
                      <button key={s} onClick={() => !outOfStock && setSelectedSize(s)} disabled={outOfStock} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSize === s ? "bg-primary text-primary-foreground" : outOfStock ? "bg-muted text-muted-foreground opacity-50 cursor-not-allowed line-through" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:text-primary transition-colors"><Minus size={16} /></button>
                <span className="font-semibold w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:text-primary transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            <button onClick={handleBuy} disabled={!inStock || (sizes.length > 0 && !selectedSize) || checkoutLoading} className="mt-8 w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:glow-purple hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
              {checkoutLoading ? <><Loader2 className="animate-spin" size={18} /> Redirecting...</> : <><ShoppingBag size={18} /> {inStock ? "Buy Now" : "Sold Out"}</>}
            </button>
            {sizes.length > 0 && !selectedSize && inStock && <p className="text-xs text-muted-foreground mt-2">Please select a size</p>}

            <div className="mt-8 p-4 rounded-xl bg-muted text-sm text-muted-foreground">
              <p>🚚 Free shipping on orders over 2000 CZK</p>
              <p className="mt-1">📦 Ships in 2-3 business days (CZ) / 5-7 days (EU)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { products } from "@/data/mockData";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="pt-20 container mx-auto px-4 py-40 text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <Link to="/merch" className="text-primary mt-4 inline-block">← Back to merch</Link>
      </div>
    );
  }

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

            {/* Sizes */}
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Size</p>
              <div className="flex gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedSize === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              disabled={!product.inStock || !selectedSize}
              className="mt-8 w-full sm:w-auto px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold transition-all hover:glow-purple hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              {product.inStock ? "Add to Cart" : "Sold Out"}
            </button>

            {!selectedSize && product.inStock && (
              <p className="text-xs text-muted-foreground mt-2">Please select a size</p>
            )}

            {/* Shipping */}
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

import eventPoster1 from "@/assets/event-poster-1.jpg";
import eventPoster2 from "@/assets/event-poster-2.jpg";
import eventPoster3 from "@/assets/event-poster-3.jpg";

export interface Event {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  venueAddress: string;
  category: "club" | "rooftop" | "warehouse" | "theme";
  tagline: string;
  description: string;
  poster: string;
  ageRestriction: string;
  dressCode?: string;
  lineup?: string[];
  featured: boolean;
  capacityPercent: number;
  ticketTiers: TicketTier[];
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  remaining: number;
  total: number;
  maxPerOrder: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: "tees" | "hoodies" | "accessories";
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  images: string[];
}

export const events: Event[] = [
  {
    id: "1",
    slug: "neon-nights-vol-12",
    title: "NEON NIGHTS VOL. 12",
    date: "2026-03-14",
    time: "22:00",
    venue: "Roxy Prague",
    venueAddress: "Dlouhá 33, 110 00 Prague 1",
    category: "club",
    tagline: "The biggest electronic night this spring",
    description: "Get ready for the 12th edition of Prague's most iconic electronic music night. Featuring a world-class lineup of DJs spinning techno, house, and everything in between. Three stages, immersive light shows, and 1000+ party people under one roof.",
    poster: eventPoster1,
    ageRestriction: "18+",
    dressCode: "Smart casual – no sportswear",
    lineup: ["DJ KARMA", "SYNTHEX", "MILA NOVA", "BASS PROPHET"],
    featured: true,
    capacityPercent: 72,
    ticketTiers: [
      { id: "t1", name: "Early Bird", price: 350, currency: "CZK", remaining: 12, total: 100, maxPerOrder: 4 },
      { id: "t2", name: "Regular", price: 550, currency: "CZK", remaining: 180, total: 300, maxPerOrder: 6 },
      { id: "t3", name: "VIP", price: 1200, currency: "CZK", remaining: 25, total: 50, maxPerOrder: 2 },
    ],
  },
  {
    id: "2",
    slug: "skyline-sessions",
    title: "SKYLINE SESSIONS",
    date: "2026-04-05",
    time: "19:00",
    venue: "Cloud 9 Rooftop",
    venueAddress: "Hilton Prague, Pobřežní 1, 186 00 Prague 8",
    category: "rooftop",
    tagline: "Sunset beats above the city",
    description: "Experience Prague from above at this exclusive rooftop party. Deep house & melodic techno as the sun sets over the castle. Premium cocktails, stunning views, and an intimate crowd of 200.",
    poster: eventPoster2,
    ageRestriction: "21+",
    dressCode: "Elegant / cocktail",
    lineup: ["AURORA DEEP", "VELVETA"],
    featured: true,
    capacityPercent: 45,
    ticketTiers: [
      { id: "t4", name: "Standard", price: 800, currency: "CZK", remaining: 90, total: 150, maxPerOrder: 4 },
      { id: "t5", name: "VIP Table (4 pax)", price: 4500, currency: "CZK", remaining: 8, total: 12, maxPerOrder: 1 },
    ],
  },
  {
    id: "3",
    slug: "underground-rave-001",
    title: "UNDERGROUND RAVE 001",
    date: "2026-04-19",
    time: "23:00",
    venue: "Secret Warehouse",
    venueAddress: "Location revealed 2h before event",
    category: "warehouse",
    tagline: "Raw. Loud. Unforgettable.",
    description: "Our first-ever underground warehouse rave. Hard techno, industrial beats, and no compromises. Location disclosed via SMS 2 hours before doors open. Bring ID, wear comfortable shoes, prepare for an experience.",
    poster: eventPoster3,
    ageRestriction: "18+",
    lineup: ["HARDKORE", "INDUSTRIAL COMPLEX", "NOISE MACHINE"],
    featured: false,
    capacityPercent: 30,
    ticketTiers: [
      { id: "t6", name: "General Admission", price: 450, currency: "CZK", remaining: 250, total: 400, maxPerOrder: 4 },
      { id: "t7", name: "Backstage Pass", price: 900, currency: "CZK", remaining: 15, total: 20, maxPerOrder: 2 },
    ],
  },
];

export const products: Product[] = [
  {
    id: "p1", slug: "obp-classic-tee", name: "OBP Classic Tee", description: "Premium cotton tee with embroidered ONE BIG PARTY logo. Soft-touch fabric, relaxed fit.", price: 890, currency: "CZK", category: "tees", sizes: ["S", "M", "L", "XL", "XXL"], inStock: true, featured: true,
    images: [],
  },
  {
    id: "p2", slug: "neon-nights-hoodie", name: "Neon Nights Hoodie", description: "Heavyweight fleece hoodie with reflective neon print. Oversized fit, drop shoulders.", price: 1690, currency: "CZK", category: "hoodies", sizes: ["S", "M", "L", "XL"], inStock: true, featured: true,
    images: [],
  },
  {
    id: "p3", slug: "obp-snapback", name: "OBP Snapback", description: "Structured snapback with embroidered logo. One size fits all.", price: 590, currency: "CZK", category: "accessories", sizes: ["One Size"], inStock: true, featured: true,
    images: [],
  },
  {
    id: "p4", slug: "rave-tee-black", name: "Rave Tee Black", description: "Limited edition rave tee with glow-in-the-dark print.", price: 990, currency: "CZK", category: "tees", sizes: ["S", "M", "L", "XL"], inStock: true, featured: false,
    images: [],
  },
  {
    id: "p5", slug: "underground-hoodie", name: "Underground Hoodie", description: "Washed black hoodie with industrial-style branding.", price: 1890, currency: "CZK", category: "hoodies", sizes: ["M", "L", "XL"], inStock: true, featured: false,
    images: [],
  },
  {
    id: "p6", slug: "obp-tote-bag", name: "OBP Tote Bag", description: "Heavy-duty canvas tote with screen-printed logo.", price: 390, currency: "CZK", category: "accessories", sizes: ["One Size"], inStock: true, featured: false,
    images: [],
  },
  {
    id: "p7", slug: "laser-tee", name: "Laser Tee", description: "Reflective laser-cut design on premium black tee.", price: 1090, currency: "CZK", category: "tees", sizes: ["S", "M", "L"], inStock: false, featured: false,
    images: [],
  },
  {
    id: "p8", slug: "obp-beanie", name: "OBP Beanie", description: "Ribbed knit beanie with woven label. Perfect for late-night afters.", price: 490, currency: "CZK", category: "accessories", sizes: ["One Size"], inStock: true, featured: false,
    images: [],
  },
];

export const faqs = [
  { q: "How do I get my ticket?", a: "After purchasing, you'll receive an email with a unique QR code. Show it at the door for instant entry." },
  { q: "Can I get a refund?", a: "Tickets are non-refundable within 48 hours of the event. Earlier cancellations receive a full refund minus processing fees." },
  { q: "What's the age requirement?", a: "Most events are 18+. Some premium events may be 21+. Always check the event detail page." },
  { q: "I lost my QR code. What do I do?", a: "Use the 'Resend My Ticket' form on the Tickets page with your order email and ID." },
  { q: "What should I wear?", a: "Dress codes vary by event. Check the event page for specifics. When in doubt, smart casual works." },
  { q: "How does merch shipping work?", a: "We ship within the Czech Republic (2-3 business days) and EU (5-7 business days). Free shipping on orders over 2000 CZK." },
  { q: "Can I buy tickets at the door?", a: "Only if tickets are still available. We recommend buying online as events sell out fast." },
  { q: "Is there an age check at entry?", a: "Yes. Bring a valid government-issued ID. No exceptions." },
];

export const testimonials = [
  { name: "Jakub M.", text: "Best party in Prague, hands down. The production quality is unreal.", rating: 5 },
  { name: "Sarah K.", text: "Smooth entry with QR tickets, amazing vibes, incredible lineup. Will be back!", rating: 5 },
  { name: "Tom R.", text: "VIP was worth every crown. The rooftop views + music = perfection.", rating: 5 },
];

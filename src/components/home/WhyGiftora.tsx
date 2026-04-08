interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  images: { url: string; isPrimary: boolean }[];
}

interface Props {
  products?: Product[];
}

const fallbackCards = [
  {
    src: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=800",
    name: "Make a Wish Birthday",
    price: "59.60",
  },
  {
    src: "https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?q=80&w=800",
    name: "Make a Wish Birthday",
    price: "60.40",
  },
  {
    src: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800",
    name: "Sweet Sunshine Box",
    price: null,
  },
  {
    src: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?q=80&w=800",
    name: "Home Sweet Home Box",
    price: null,
  },
];

export function WhyGiftora({ products = [] }: Props) {
  void products;
  return null;
}

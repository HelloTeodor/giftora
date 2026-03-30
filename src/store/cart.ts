import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  stock: number;
}

interface CartVariant {
  id: string;
  name: string;
  price?: number | null;
  stock: number;
}

export interface CartEntry {
  id: string; // productId + (variantId || '')
  productId: string;
  variantId?: string;
  product: CartProduct;
  variant?: CartVariant;
  quantity: number;
  giftNote?: string;
}

interface CartState {
  items: CartEntry[];
  isOpen: boolean;
  addItem: (product: CartProduct, variant?: CartVariant, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setGiftNote: (id: string, note: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, qty = 1) => {
        const entryId = `${product.id}${variant ? `-${variant.id}` : ''}`;
        const items = get().items;
        const existing = items.find((i) => i.id === entryId);

        if (existing) {
          const maxStock = variant ? variant.stock : product.stock;
          set({
            items: items.map((i) =>
              i.id === entryId
                ? { ...i, quantity: Math.min(i.quantity + qty, maxStock) }
                : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: entryId,
                productId: product.id,
                variantId: variant?.id,
                product,
                variant,
                quantity: qty,
              },
            ],
            isOpen: true,
          });
        }
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      setGiftNote: (id, note) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, giftNote: note } : i)),
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => {
          const price = i.variant?.price ?? i.product.price;
          return sum + price * i.quantity;
        }, 0),
    }),
    {
      name: 'giftora-cart',
    }
  )
);

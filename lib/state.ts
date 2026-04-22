import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, User } from './types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: { id: 'u2', name: 'Jane Doe', email: 'jane@store.com', role: 'customer' },
      setCurrentUser: (user) => set({ currentUser: user }),
      cart: [],
      addToCart: (product) => {
        const { cart } = get();
        const existing = cart.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            cart: cart.map((i) =>
              i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) =>
        set({ cart: get().cart.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => 
        set({ cart: get().cart.map((i) => i.product.id === productId ? { ...i, quantity } : i) }),
      clearCart: () => set({ cart: [] }),
      wishlist: [],
      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },
      compareList: [],
      toggleCompare: (product) => {
        const { compareList } = get();
        if (compareList.find((p) => p.id === product.id)) {
          set({ compareList: compareList.filter((p) => p.id !== product.id) });
        } else {
          if (compareList.length < 3) {
            set({ compareList: [...compareList, product] });
          }
        }
      },
      isChatOpen: false,
      setChatOpen: (open) => set({ isChatOpen: open })
    }),
    { name: 'ecommerce-storage' }
  )
);

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      addToCart: (product) => {
        const cart = get().cart
        const existingItem = cart.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({ cart: [...cart, { product, quantity: 1 }] })
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        
        set({
          cart: get().cart.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
      },
      getCartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0)
      },

      // User state
      user: null,
      setUser: (user) => set({ user }),
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' })
          set({ user: null })
        } catch (error) {
          console.error('Logout error:', error)
        }
      },

      // UI state
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'All',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      priceRange: [0, 1000],
      setPriceRange: (range) => set({ priceRange: range }),

      // Auth methods
      // checkAuth: async () => {
      //   try {
      //     const response = await fetch('/api/auth/me')
      //     if (response.ok) {
      //       const data = await response.json()
      //       set({ user: data.user })
      //     } else {
      //       set({ user: null })
      //     }
      //   } catch (error) {
      //     console.error('Auth check error:', error)
      //     set({ user: null })
      //   }
      // }
    }),
    {
      name: 'ecommerce-store',
      partialize: (state) => ({ cart: state.cart })
    }
  )
)
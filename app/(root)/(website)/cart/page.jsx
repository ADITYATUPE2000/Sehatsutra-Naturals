'use client';
import { Button } from "@/components/ui/Button.jsx";
import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Image from "next/image";
import Footer from "@/components/website/Footer";
import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingCart, AlertCircle } from "lucide-react";
import { showToast } from '@/lib/showToast';
import { useStore } from '@/lib/store';
import { useSelector } from "react-redux";
import { WEBSITE_CHECKOUT } from '@/routes/WebsiteRoute';
import Product1 from '@/assets/images/Product1.jpeg';

const CartPage = () => {
  const cart = useSelector(store => store.cartStore);
  const { user } = useStore();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Sync with Redux state if available
  useEffect(() => {
    if (cart && cart.items) {
      setCartItems(cart.items);
    }
  }, [cart]);

  const fetchCart = async () => {
    try {
      setError(null);
      const response = await fetch('/api/cart');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.data.items || data.data || []);
      } else {
        setError(data.error || 'Failed to load cart');
        showToast('error', data.error || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Unable to load cart. Please try again.');
      showToast('error', 'Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    // Find the item to check stock limit
    const item = cartItems.find(item => item.product._id === productId);
    if (newQuantity > item.product.stock) {
      showToast('error', `Only ${item.product.stock} items available in stock`);
      return;
    }

    setUpdating(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.data.items || []);
        showToast('success', 'Quantity updated');
      } else {
        showToast('error', data.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showToast('error', 'Error updating quantity');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const removeFromCart = async (productId) => {
    setUpdating(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.data.items || []);
        showToast('success', 'Removed from cart');
      } else {
        showToast('error', data.error || 'Failed to remove from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showToast('error', 'Error removing from cart');
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const retryFetchCart = () => {
    setLoading(true);
    fetchCart();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-4">Please Login</h1>
            <p className="text-muted-foreground mb-6">Please login to view your cart</p>
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-4 text-foreground">Error Loading Cart</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={retryFetchCart}>Try Again</Button>
              <Link href="/products">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started!</p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 border rounded ">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="bg-card rounded-lg p-4 flex items-center space-x-4 relative">
                      {updating[item.product._id] && (
                        <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      )}
                      
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {imageErrors[item.product._id] ? (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                          </div>
                        ) : (
                          <Image
                            src={item.product.images?.[0] || Product1 }
                            alt={item.product.name || 'Product'}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(item.product._id)}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">₹{item.product.price} each</p>
                        {item.product.stock <= 5 && (
                          <p className="text-xs text-orange-500">Only {item.product.stock} left in stock</p>
                        )}
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating[item.product._id]}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium text-sm">
                            {updating[item.product._id] ? '...' : item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock || updating[item.product._id]}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        {item.quantity >= item.product.stock && (
                          <p className="text-xs text-orange-500 text-center">Max stock</p>
                        )}
                      </div>

                      <div className="text-right min-w-0">
                        <p className="font-semibold text-foreground">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.product._id)}
                        disabled={updating[item.product._id]}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        title="Remove from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 border rounded ">
                <div className="bg-card rounded-lg p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({calculateTotalItems()} items)</span>
                      <span className="text-foreground">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href={WEBSITE_CHECKOUT}>
                      <Button 
                        className="w-full bg-[#2D5016] hover:bg-[#7BA428] text-white"
                        disabled={cartItems.length === 0 || Object.values(updating).some(Boolean)}
                      >
                        {Object.values(updating).some(Boolean) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          'Proceed to Checkout'
                        )}
                      </Button>
                    </Link>

                    <Link href="/products">
                      <Button variant="outline" className="w-full">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  {/* Cart summary info */}
                  <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <p>✓ Free shipping on all orders</p>
                    <p>✓ Secure checkout</p>
                    <p>✓ Easy returns within 30 days</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
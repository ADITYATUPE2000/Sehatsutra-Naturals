'use client';
import { Button } from "@/components/ui/Button.jsx";
import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Image from "next/image";
import Footer from "@/components/website/Footer";
import { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, MapPin, User } from "lucide-react";
import { showToast } from '@/lib/showToast';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Product1 from '@/assets/images/Product1.png';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  useEffect(() => {
    if (user) {
      fetchCart();
      // Pre-fill user data
      setFormData(prev => ({
        ...prev,
        fullName: user?.name || '',
        email: user?.email || ''
      }));
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.data.items || data.data || []);
      } else {
        showToast('error', 'Failed to load cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      showToast('error', 'Error loading cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    setProcessing(true);

    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        showToast('error', 'Failed to load payment gateway');
        setProcessing(false);
        return;
      }

      // Create Razorpay order
      const createOrderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: calculateTotal() * 100, // Convert to paise
          currency: 'INR',
          items: cartItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price
          })),
          shippingAddress: formData,
        }),
      });

      if (!createOrderResponse.ok) {
        const errorText = await createOrderResponse.text();
        console.error('Server response:', errorText);
        throw new Error(`Server error: ${createOrderResponse.status}`);
      }

      const orderData = await createOrderResponse.json();
      console.log('Order response:', orderData);

      if (!orderData.success) {
        showToast('error', orderData.error || 'Failed to create order');
        setProcessing(false);
        return;
      }

      if (!orderData.order || !orderData.order.id) {
        console.error('Invalid order data structure:', orderData);
        showToast('error', 'Invalid order data received');
        setProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Product Name',
        description: 'Purchase Description',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId || orderData.order.id,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              showToast('success', 'Payment successful! Order placed.');
              router.push(`/order-success/${verifyData.orderId}`);
            } else {
              showToast('error', verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            showToast('error', 'Error verifying payment');
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#2D5016',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error during checkout:', error);
      showToast('error', 'Error during checkout');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please login to checkout</h2>
            <Link href="/auth/login">
              <Button className="bg-[#2D5016] hover:bg-[#7BA428] text-white">
                Login
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>
          
          <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-card rounded-lg p-6 border">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="razorpay"
                      name="paymentMethod"
                      value="razorpay"
                      defaultChecked
                      className="mr-3"
                    />
                    <label htmlFor="razorpay" className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-muted-foreground" />
                      <span>Razorpay</span>
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-8">
                    Secure online payment via Razorpay
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg p-6 sticky top-24 border">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </h2>
                
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={Product1}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.product.price}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        ₹{item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">Free</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{calculateTotal()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={processing || cartItems.length === 0}
                  className="w-full mt-6 bg-[#2D5016] hover:bg-[#7BA428] text-white"
                >
                  {processing ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;

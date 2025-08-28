'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/website/Navbar';
import Footer from '@/components/website/Footer';
import { Button } from '@/components/ui/Button.jsx';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import Image from 'next/image';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Successful!</h1>
            <p className="text-muted-foreground">Thank you for your purchase</p>
            <p className="text-sm text-muted-foreground mt-2">
              Order ID: <span className="font-mono">{order._id}</span>
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-2">Contact Information</h3>
                <p className="text-sm text-muted-foreground">
                  Email: {order.shippingAddress.email}<br />
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images[0] || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Status</h2>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="ml-2 text-sm font-medium">Order Placed</span>
              </div>
              
              <div className="flex-1 h-1 bg-muted rounded-full">
                <div className="h-1 bg-green-500 rounded-full w-1/4"></div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="ml-2 text-sm text-muted-foreground">Processing</span>
              </div>
              
              <div className="flex-1 h-1 bg-muted rounded-full"></div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="ml-2 text-sm text-muted-foreground">Shipped</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link href="/products">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/my-account/orders">
              <Button>
                <Package className="w-4 h-4 mr-2" />
                View My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccessPage;

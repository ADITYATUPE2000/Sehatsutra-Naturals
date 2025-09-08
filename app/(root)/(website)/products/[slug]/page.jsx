'use client';
import { Button } from "@/components/ui/Button.jsx";
import { Star, Shield, Truck } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Image from "next/image";
import Footer from "@/components/website/Footer";
import { HiMinus, HiPlus } from 'react-icons/hi2';
import { useState, useEffect} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { showToast } from '@/lib/showToast';

const ProductPage = () => {
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { user } = useStore();

  const slug = params.slug;

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        showToast('error', 'Failed to load product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      showToast('error', 'Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleQty = (actionType) => {
    if (actionType === 'inc') {
      setQty(prev => prev + 1);
    } else {
      if (qty !== 1) {
        setQty(prev => prev - 1);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      showToast('error', 'Please login to add items to cart');
      return;
    }

    if (!product) return;

    setAddingToCart(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: qty
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        showToast('success', 'Added to cart successfully!');
        setQty(1);
        // Redirect to cart page
        setTimeout(() => {
          router.push('/cart');
        }, 1000);
      } else {
        showToast('error', data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('error', 'Error adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

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

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link href="/" className="text-primary hover:underline">
              Go back to home
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-subtle overflow-hidden">
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-secondary/10 rounded-3xl blur-xl -z-10"></div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl font-bold text-primary">
                    ₹{product.mrp}
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                    <span className="text-muted-foreground ml-2">2,847 reviews</span>
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 text-accent-green">
                <Truck className="w-5 h-5" />
                <span className="font-medium">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity Selector */}       
              <div className="mt-5">
                <p className="font-bold mb-2">Quantity</p>
                <div className="flex items-center h-10 border w-fit rounded-full">
                  <Button 
                    type="button" 
                    className="px-4 text-muted-foreground hover:text-foreground" 
                    onClick={() => handleQty('dec')}
                    disabled={qty <= 1}
                  >
                    <HiMinus/>
                  </Button>
                  <input 
                    type='text' 
                    value={qty} 
                    className="w-14 text-center border-none outline-offset-0" 
                    readOnly 
                  />
                  <Button 
                    type="button" 
                    className="px-4 text-muted-foreground hover:text-foreground"
                    onClick={() => handleQty('inc')}
                    disabled={qty >= product.stock}
                  >
                    <HiPlus/>
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              
              <div className="mt-5">
              {!addingToCart ?
              <ButtonLoading type="button" text="Add To Cart"
              className="w-full rounded-full py-6 text-md cursor-pointer"
              onClick={handleAddToCart} />
              :
              <Button lassName="w-full rounded-full py-6 text-md cursor-pointer" 
              type="button" asChild>
              <Link href={WEBSITE_CART}>Go To Cart</Link>
              </Button>
              }</div>

              {/* Guarantee */}
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span>30-Day Money Back Guarantee</span>
              </div>

              {/* Key Benefits */}
              <div className="border-t border-border pt-6">
                <h4 className="font-semibold text-foreground mb-3">Key Benefits</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm text-muted-foreground">100% Natural</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm text-muted-foreground">No Side Effects</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm text-muted-foreground">Clinically Tested</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm text-muted-foreground">100% pure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-16">
            <div className="bg-card/50 rounded-3xl p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8">
                Product Details
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                    </div>
                    About Product
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.description}
                    </p>
                    
                    <h4 className="font-semibold text-foreground">Why You'll Love It:</h4>
                    <div className="text-semibold text-muted-foreground mt-1">
                      <p>• 100% Pure & Organic – No additives, preservatives, or fillers</p>
                      <p>• Nutrient-dense superfood for everyday vitality</p>
                      <p>• Supports immunity, energy, and overall wellness</p>
                      <p>• Vegan, gluten-free, and sustainably sourced</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Key Benefits:</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>• Supports immunity and metabolism</p>
                        <p>• Increases natural energy levels</p>
                        <p>• Promotes skin, hair, and joint health</p>
                        <p>• Aids digestion and detoxification</p>
                      </div>

                      <h4 className="font-medium text-foreground mb-3 mt-6">Key Ingredients</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{product.ingredients || '100% Pure Organic Moringa Leaf Powder'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;

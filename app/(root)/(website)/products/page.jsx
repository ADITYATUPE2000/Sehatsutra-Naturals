'use client';
import { Button } from "@/components/ui/Button.jsx";
import Link from "next/link";
import Navbar from "@/components/website/Navbar";
import Image from "next/image";
import Footer from "@/components/website/Footer";
import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Plus, X, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { showToast } from '@/lib/showToast'
import { useSession } from 'next-auth/react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    care: false,
    shipping: false,
    returns: false
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: '',
    isActive: true
  });
  const { data: session } = useSession();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset selectedImage when products change
  useEffect(() => {
    setSelectedImage(0);
  }, [products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        const errorMsg = 'Failed to load products';
        if (typeof showToast === 'function') {
          showToast(errorMsg, 'error');
        } else if (showToast && typeof showToast.error === 'function') {
          showToast.error(errorMsg);
        } else {
          console.error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMsg = 'Error loading products';
      if (typeof showToast === 'function') {
        showToast(errorMsg, 'error');
      } else if (showToast && typeof showToast.error === 'function') {
        showToast.error(errorMsg);
      } else {
        console.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId, product) => {
    if (!session) {
      // Handle showToast safely - check if it exists and has the method
      if (typeof showToast === 'function') {
        showToast('Please login to add items to cart', 'error');
      } else if (showToast && typeof showToast.error === 'function') {
        showToast.error('Please login to add items to cart');
      } else {
        console.error('Please login to add items to cart');
        alert('Please login to add items to cart'); // Fallback
      }
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          quantity: 1
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (typeof showToast === 'function') {
          showToast('Added to cart successfully!', 'success');
        } else if (showToast && typeof showToast.success === 'function') {
          showToast.success('Added to cart successfully!');
        } else {
          console.log('Added to cart successfully!');
        }
      } else {
        const errorMsg = data.error || 'Failed to add to cart';
        if (typeof showToast === 'function') {
          showToast(errorMsg, 'error');
        } else if (showToast && typeof showToast.error === 'function') {
          showToast.error(errorMsg);
        } else {
          console.error(errorMsg);
          alert(errorMsg);
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMsg = 'Error adding to cart';
      if (typeof showToast === 'function') {
        showToast(errorMsg, 'error');
      } else if (showToast && typeof showToast.error === 'function') {
        showToast.error(errorMsg);
      } else {
        console.error(errorMsg);
        alert(errorMsg);
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.images ? formData.images.split(',').map(img => img.trim()) : []
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        if (typeof showToast === 'function') {
          showToast('Product added successfully!', 'success');
        } else if (showToast && typeof showToast.success === 'function') {
          showToast.success('Product added successfully!');
        } else {
          console.log('Product added successfully!');
        }
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          stock: '',
          images: '',
          isActive: true
        });
        setShowAddForm(false);
        fetchProducts();
      } else {
        const errorMsg = result.error || 'Failed to add product';
        if (typeof showToast === 'function') {
          showToast(errorMsg, 'error');
        } else if (showToast && typeof showToast.error === 'function') {
          showToast.error(errorMsg);
        } else {
          console.error(errorMsg);
          alert(errorMsg);
        }
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      const errorMsg = 'Failed to add product: ' + error.message;
      if (typeof showToast === 'function') {
        showToast(errorMsg, 'error');
      } else if (showToast && typeof showToast.error === 'function') {
        showToast.error(errorMsg);
      } else {
        console.error(errorMsg);
        alert(errorMsg);
      }
    } finally {
      setAddingProduct(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Safe image selection with bounds checking
  const handleImageSelect = (index) => {
    if (products[0]?.images && index >= 0 && index < products[0].images.length) {
      setSelectedImage(index);
    }
  };

  // Get current product safely
  const currentProduct = products.length > 0 ? products[0] : null;

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Add Product Button */}
          {session && (
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-[#2D5016] hover:bg-[#7BA428] text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Product
              </Button>
            </div>
          )}

          {/* Add Product Form */}
          {showAddForm && (
            <div className="bg-card rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="grid gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-muted-foreground mb-1">Price (₹)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-muted-foreground mb-1">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-muted-foreground mb-1">Images (URLs, comma-separated)</label>
                  <input
                    type="text"
                    id="images"
                    name="images"
                    value={formData.images}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-input rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={addingProduct}
                    className="bg-[#2D5016] hover:bg-[#7BA428] text-white"
                  >
                    {addingProduct ? (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2 animate-pulse" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Product Detail Layout - Fixed with proper safety checks */}
          {currentProduct && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Product Images */}
                <div className="space-y-4">
                  {/* Main Product Image */}
                  <div className="aspect-square relative overflow-hidden rounded-lg">
                    <Image
                      src={
                        currentProduct?.images?.[selectedImage] || 
                        currentProduct?.images?.[0] || 
                        '/assets/images/Product1.jpeg'
                      }
                      alt={currentProduct?.name || 'Product'}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Thumbnail Images */}
                  {currentProduct?.images && currentProduct.images.length > 1 && (
                    <div className="flex gap-2">
                      {currentProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageSelect(index)}
                          className={`aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            selectedImage === index 
                              ? 'border-[#2D5016]' 
                              : 'border-gray-200'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${currentProduct.name} view ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-6">
                  {/* Product Name and Price */}
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {currentProduct.name}
                    </h1>
                    <p className="text-2xl font-bold text-[#2D5016]">
                      ₹{currentProduct.price}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-muted-foreground">(2,847 reviews)</span>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {currentProduct.description}
                  </p>

                  {/* Stock Status */}
                  <div className="text-lg text-muted-foreground">
                    {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <Button
                      size="lg"
                      className="flex-1 bg-[#2D5016] hover:bg-[#7BA428] text-white text-lg py-3"
                      onClick={() => handleAddToCart(currentProduct._id, currentProduct)}
                      disabled={addingToCart[currentProduct._id] || currentProduct.stock === 0}
                    >
                      {addingToCart[currentProduct._id] ? (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2 animate-pulse" />
                          Adding to bag...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to bag
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="p-3"
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Collapsible Sections */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    {/* Features Section */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSection('features')}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                      >
                        <span className="font-semibold text-foreground">Features</span>
                        {expandedSections.features ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections.features && (
                        <div className="px-4 pb-3">
                          <ul className="space-y-2 text-muted-foreground">
                            <li>• Premium organic ingredients</li>
                            <li>• Rich in essential nutrients</li>
                            <li>• 100% pure & natural</li>
                            <li>• Made in India</li>
                            <li>• Traditional Ayurvedic wisdom</li>
                            <li>• Modern wellness benefits</li>
                            <li>• Sustainable packaging</li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Care Section */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSection('care')}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                      >
                        <span className="font-semibold text-foreground">Care</span>
                        {expandedSections.care ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections.care && (
                        <div className="px-4 pb-3 text-muted-foreground">
                          <p>Store in a cool, dry place. Keep away from direct sunlight and moisture. Best consumed within 12 months of opening.</p>
                        </div>
                      )}
                    </div>

                    {/* Shipping Section */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSection('shipping')}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                      >
                        <span className="font-semibold text-foreground">Shipping</span>
                        {expandedSections.shipping ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections.shipping && (
                        <div className="px-4 pb-3 text-muted-foreground">
                          <p>Free shipping on orders above ₹499. Standard delivery: 3-5 business days. Express delivery available.</p>
                        </div>
                      )}
                    </div>

                    {/* Returns Section */}
                    <div className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleSection('returns')}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                      >
                        <span className="font-semibold text-foreground">Returns</span>
                        {expandedSections.returns ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      {expandedSections.returns && (
                        <div className="px-4 pb-3 text-muted-foreground">
                          <p>30-day return policy for unopened products. Contact our customer service for any quality issues.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-4">
                We're currently adding new products. Please check back soon!
              </p>
              <Link href="/">
                <Button>Back to Home</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
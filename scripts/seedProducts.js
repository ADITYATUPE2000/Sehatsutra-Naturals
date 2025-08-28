const mongoose = require('mongoose');
const Product = require('../models/Product.model');

const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    description: "Experience crystal-clear audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort for all-day wear.",
    price: 2999,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"],
    category: "Electronics",
    stock: 50,
    slug: "premium-wireless-headphones"
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with our advanced smartwatch. Monitor heart rate, steps, sleep patterns, and receive notifications on the go.",
    price: 3999,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
    category: "Electronics",
    stock: 30,
    slug: "smart-fitness-watch"
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Perfect for everyday wear with a modern fit and premium quality fabric.",
    price: 799,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"],
    category: "Clothing",
    stock: 100,
    slug: "organic-cotton-t-shirt"
  },
  {
    name: "Professional Camera Lens",
    description: "Capture stunning photos with this professional-grade camera lens. Features advanced optics and weather-sealed construction.",
    price: 12999,
    images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop"],
    category: "Electronics",
    stock: 15,
    slug: "professional-camera-lens"
  },
  {
    name: "Minimalist Backpack",
    description: "Sleek and functional backpack perfect for work or travel. Features laptop compartment, water-resistant material, and ergonomic design.",
    price: 1599,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
    category: "Accessories",
    stock: 40,
    slug: "minimalist-backpack"
  },
  {
    name: "Artisan Coffee Beans",
    description: "Premium single-origin coffee beans roasted to perfection. Rich, smooth flavor with notes of chocolate and caramel.",
    price: 599,
    images: ["https://images.unsplash.com/photo-1511920170033-f8396924c129?w=500&h=500&fit=crop"],
    category: "Food & Beverage",
    stock: 75,
    slug: "artisan-coffee-beans"
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overheat protection.",
    price: 999,
    images: ["https://images.unsplash.com/photo-1609592806596-4d7b6b6d2e7b?w=500&h=500&fit=crop"],
    category: "Electronics",
    stock: 60,
    slug: "wireless-charging-pad"
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip, eco-friendly yoga mat made from natural rubber. Extra thick for comfort and stability during your practice.",
    price: 1299,
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop"],
    category: "Sports",
    stock: 45,
    slug: "yoga-mat-premium"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/productecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${createdProducts.length} products`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed script
seedDatabase();

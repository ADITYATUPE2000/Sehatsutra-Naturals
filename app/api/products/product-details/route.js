import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import Product from '@/models/Product.model';

export async function GET() {
  try {
    await connectDB();

    // Check if product exists, if not create it
    let product = await Product.findOne({ 
      slug: 'sehatsutra-naturals-organic-moringa-powder' 
    });

    if (!product) {
      product = await Product.create({
        name: 'Sehatsutra Naturals - Organic Moringa Powder',
        slug: 'sehatsutra-naturals-organic-moringa-powder',
        brand: 'Sehatsutra Naturals',
        category: 'Health & Wellness',
        price: 599,
        originalPrice: 799,
        discount: 25,
        description: 'Premium quality organic moringa powder made from naturally dried moringa leaves.',
        images: [
          '/assets/images/Product1.jpeg',
          '/assets/images/Product.png'
        ],
        
        
        isActive: true,
        featured: true
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

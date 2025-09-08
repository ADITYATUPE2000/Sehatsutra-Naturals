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
      // Create a default category ObjectId (this should be replaced with actual category)
      const defaultCategoryId = '507f1f77bcf86cd799439011'; // Placeholder ObjectId

      product = await Product.create({
        name: 'Sehatsutra Naturals - Organic Moringa Powder',
        slug: 'sehatsutra-naturals-organic-moringa-powder',
        brand: 'Sehatsutra Naturals',
        category: defaultCategoryId, // Should be ObjectId
        mrp: 249,
        description: "Premium organic moringa powder by SEHATSUTRA NATURALS. Rich in iron, calcium & antioxidants. 100% pure & natural superfood. Ancient purity, modern wellness. Made in India. Net quantity: 250g.",
        images: [
          '/assets/images/Product1.jpeg',
          '/assets/images/Product.png'
        ],
        media: [], // Required by schema
        stock: 100, // Required by schema
        isActive: true
      });
    }

    // Remove discountPrice from response
    const productObj = product.toObject();
    delete productObj.discountPrice;

    return NextResponse.json(productObj);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

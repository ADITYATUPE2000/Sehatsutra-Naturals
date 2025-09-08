import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import Product from '@/models/Product.model';

// GET /api/products/[slug] - Get single product by slug
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    
    const product = await Product.findOne({ slug, isActive: true });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Remove discountPrice from response
    const productObj = product.toObject();
    delete productObj.discountPrice;

    return NextResponse.json({
      success: true,
      data: productObj
    });
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/products/[slug] - Update product (Admin only)
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    const body = await request.json();
    
    const product = await Product.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[slug] - Delete product (Admin only)
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { slug } = params;
    
    const product = await Product.findOneAndDelete({ slug });
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

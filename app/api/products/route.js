import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import Product from '@/models/Product.model';

// GET /api/products - Get all products
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort
    let sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Handle price sorting (use mrp as default price field)
    if (sortBy === 'price') {
      sort = { mrp: sortOrder === 'desc' ? -1 : 1 };
    }
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    // Remove discountPrice from response
    const productsWithoutDiscountPrice = products.map(product => {
      const productObj = product.toObject();
      delete productObj.discountPrice;
      return productObj;
    });

    return NextResponse.json({
      success: true,
      data: productsWithoutDiscountPrice,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // Handle price field mapping
    if (body.price && !body.mrp) {
      body.mrp = body.price;
      
    }

    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Ensure required fields
    if (!body.category) {
      body.category = '507f1f77bcf86cd799439011'; // Placeholder ObjectId
    }
    if (!body.media) {
      body.media = [];
    }
    if (!body.stock) {
      body.stock = 0;
    }

    const product = new Product(body);
    await product.save();

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

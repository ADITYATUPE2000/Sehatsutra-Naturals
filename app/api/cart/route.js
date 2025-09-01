import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import Cart from '@/models/Cart.model';
import Product from '@/models/Product.model';
import { isAuthenticated } from '@/lib/authentication';

// GET /api/cart - Get user's cart
export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await isAuthenticated('user');
    
    if (!authResult.isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const cart = await Cart.findOne({ user: authResult.userId, isActive: true })
      .populate('items.product', 'name price images stock');
    
    if (!cart) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
          totalItems: 0
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      data: cart
    });
    
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add item to cart
export async function POST(request) {
  try {
    await connectDB();
    
    const authResult = await isAuthenticated('user');
    
    if (!authResult.isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { productId, quantity = 1 } = await request.json();
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Check if product exists and is available
    const product = await Product.findById(productId);
    
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, error: 'Insufficient stock' },
        { status: 400 }
      );
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: authResult.userId, isActive: true });
    
    if (!cart) {
      cart = new Cart({
        user: authResult.userId,
        items: []
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    await cart.save();
    
    // Populate product details
    await cart.populate('items.product', 'name price images stock');
    
    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Item added to cart successfully'
    });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request) {
  try {
    await connectDB();
    
    const authResult = await isAuthenticated('user');
    
    if (!authResult.isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { productId, quantity } = await request.json();
    
    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }
    
    const cart = await Cart.findOne({ user: authResult.userId, isActive: true });
    
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    
    // Populate product details
    await cart.populate('items.product', 'name price images stock');
    
    return NextResponse.json({
      success: true,
      data: cart,
      message: 'Cart updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request) {
  try {
    await connectDB();
    
    const authResult = await isAuthenticated('user');
    
    if (!authResult.isAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const cart = await Cart.findOne({ user: authResult.userId, isActive: true });
    
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    cart.items = [];
    await cart.save();
    
    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

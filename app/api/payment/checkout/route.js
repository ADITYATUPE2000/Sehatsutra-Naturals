import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import Cart from '@/models/Cart.model';
import Order from '@/models/Order.model';
import Product from '@/models/Product.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST /api/payment/checkout - Process checkout
export async function POST(request) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { shippingAddress, paymentMethod = 'cod' } = await request.json();
    
    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 }
      );
    }
    
    // Get user's cart
    const cart = await Cart.findOne({ user: session.user.id, isActive: true })
      .populate('items.product', 'name price images stock');
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of cart.items) {
      const product = item.product;
      
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
      
      totalAmount += product.price * item.quantity;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.images[0]
      });
    }
    
    // Create order
    const order = new Order({
      user: session.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });
    
    await order.save();
    
    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }
    
    // Clear cart
    cart.items = [];
    cart.isActive = false;
    await cart.save();
    
    // Create new empty cart for user
    const newCart = new Cart({
      user: session.user.id,
      items: []
    });
    await newCart.save();
    
    return NextResponse.json({
      success: true,
      data: {
        order,
        orderId: order._id
      },
      message: 'Order placed successfully'
    });
    
  } catch (error) {
    console.error('Error processing checkout:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

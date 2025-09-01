import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import Order from '@/models/Order.model';
import Product from '@/models/Product.model';
import Cart from '@/models/Cart.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const { 
      orderId, 
      paymentId, 
      paymentStatus, 
      shippingAddress, 
      items, 
      totalAmount,
      paymentMethod 
    } = await request.json();

    // Validate required fields
    if (!orderId || !paymentId || !paymentStatus || !items || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment status
    if (paymentStatus !== 'success') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      );
    }

    // Create order with product details
    const orderItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
        total: product.price * item.quantity
      });

      calculatedTotal += product.price * item.quantity;

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Verify total amount matches
    if (calculatedTotal !== totalAmount) {
      return NextResponse.json(
        { error: 'Amount mismatch' },
        { status: 400 }
      );
    }

    // Create order
    const order = new Order({
      userId: session.user.id,
      orderId,
      paymentId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'completed',
      orderStatus: 'processing',
      createdAt: new Date()
    });

    await order.save();

    // Clear user's cart
    await Cart.deleteMany({ userId: session.user.id });

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        items: order.items.length,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch order details
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID required' },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ 
      orderId,
      userId: session.user.id 
    }).populate('items.productId');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

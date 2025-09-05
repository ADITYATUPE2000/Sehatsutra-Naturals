import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import { isAuthenticated } from '@/lib/authentication';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '@/models/Order.model';
import Cart from '@/models/Cart.model';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get the Razorpay order to retrieve notes
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    
    if (!razorpayOrder || !razorpayOrder.notes) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Parse shipping address from notes
    let shippingAddress;
    try {
      shippingAddress = JSON.parse(razorpayOrder.notes.shippingAddress);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid shipping address data' },
        { status: 400 }
      );
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: authResult.userId, isActive: true })
      .populate({
        path: 'items.product',
        select: 'name price images'
      });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    // Calculate total amount
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // Create order record with all required fields
    const order = new Order({
      user: authResult.userId,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
        image: item.product.images?.[0] || ''
      })),
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      paymentMethod: 'online',
      paymentStatus: 'paid',
      status: 'pending',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    await order.save();

    // Clear the user's cart
    await Cart.findOneAndUpdate(
      { user: authResult.userId, isActive: true },
      { $set: { items: [] } }
    );

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    
    return NextResponse.json(
      { success: false, error: 'Error verifying payment' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import { isAuthenticated } from '@/lib/authentication';
import Cart from '@/models/Cart.model';
import Order from '@/models/Order.model';
import Razorpay from 'razorpay';

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

    const requestBody = await request.json();
    
    
    const { amount, currency, items, shippingAddress } = requestBody;

    // Validate required fields
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      
      return NextResponse.json(
        { success: false, error: 'Missing shipping address' },
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
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Calculate total amount from cart (use server data, not client data for security)
    const totalAmount = cart.items.reduce((sum, item) => {
      
      
      // Use the price stored in cart item if product price is not available
      const price = item.product?.price || item.price;
      
      if (!price || price <= 0) {
        return sum;
      }
      
      const itemTotal = price * item.quantity;
      
      return sum + itemTotal;
    }, 0);


    // Validate total amount
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart total amount' },
        { status: 400 }
      );
    }

    // Validate Razorpay credentials
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Payment gateway configuration error' },
        { status: 500 }
      );
    }


    // Create Razorpay order
    const amountInPaise = Math.round(totalAmount * 100); // Ensure integer
    
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: authResult.userId,
        shippingAddress: JSON.stringify(shippingAddress)
      }
    });


    

    // Return response matching frontend expectations
    return NextResponse.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      },
      orderId: razorpayOrder.id, // Also include this for the payment verification
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });

  } catch (error) {
    
    
    // Return more specific error information
    let errorMessage = 'Error creating payment order';
    if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage, debug: error.message },
      { status: 500 }
    );
  }
}
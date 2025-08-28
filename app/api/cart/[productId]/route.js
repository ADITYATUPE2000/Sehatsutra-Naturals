import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/databaseConnection';
import Cart from '@/models/Cart.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// DELETE /api/cart/[productId] - Remove specific item from cart
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { productId } = params;
    
    const cart = await Cart.findOne({ user: session.user.id, isActive: true });
    
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
    
    cart.items.splice(itemIndex, 1);
    await cart.save();
    
    // Populate product details
    await cart.populate('items.product', 'name price images stock');
    
    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
    
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

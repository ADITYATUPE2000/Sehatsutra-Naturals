import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/databaseConnection";
import Order from '@/models/Order.model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ user: session.user.id })
      .populate({
        path: 'items.product',
        select: 'name images price'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

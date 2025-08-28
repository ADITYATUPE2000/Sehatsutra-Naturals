import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";

export async function GET() {
    try{
        await connectDB()
        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }

        const userId = auth.userId


        // get recent orders
        const recentOrders = await OrderModel.find({ user: userId})
        .populate({
            path: 'items.product',
            select: 'name images price'
          })
          .sort({ createdAt: -1 });

        // get total order count
        const totalOrder = await OrderModel.countDocuments({ user: userId })
        return response(true, 200, 'Dashboard info.', { recentOrders, totalOrder })  



    }catch (error) {
    return catchError(error)
    }
}
    
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/Order.model";
import ProductModel from "@/models/Product.model";

export async function GET() {
    try{
        await connectDB()
        const auth = await isAuthenticated('user')
        if (!auth.isAuth) {
            return response(false, 401, 'Unauthorized')
        }

        const userId = auth.userId

        // get recent orders
        const Orders = await OrderModel.find({ user: userId})
        .populate({
            path: 'items.product',
            select: 'name images price'
          })
          .sort({ createdAt: -1 });

        return response(true, 200, 'Order info.', Orders)  

    }catch (error) {
    return catchError(error)
    }
}

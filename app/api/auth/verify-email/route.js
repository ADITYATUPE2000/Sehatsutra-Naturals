import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
    try {
        await connectDB()
        const {token} = await request.json()

        if(!token){
            return response(false, 400, 'missing token.')
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const decoded = await jwtVerify(token, secret)
        const userId = decoded.payload.userId.toString()
        if (!isValidObjectId(userId)){
            return response(false, 400, 'Invalid user id.',userId)
        }

        // get user 
        const user = await UserModel.findById(userId)
        if(!user){
            return response(false, 404, 'user not found.')
        }        

        user.isEmailVerified = true
        await user.save()

        return response(true, 200, 'Email verification successful.')

    } catch (error) {
        return catchError(error)
        
    }
    
}

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";


export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            otp: true, email: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response( false,401,'Invalid or missing input.', validatedData.error)
        }

        const {email, otp} = validatedData.data

        const getOtpData = await OTPModel.findOne({ email, otp })
        if(!getOtpData){
            return response( false,404,'Invalid or Expired OTP.') 
        }

        const getUser = await UserModel.findOne({ deletedAt : null ,email}).lean()
        if(!getUser){
            return response( false, 404, 'User not found')
        }    
             
        //remove otp after validation
        await getOtpData.deleteOne()

        return response( true, 200, 'OTP Verified.')
            
    } catch (error) {
        return catchError(error)       
    }   
}

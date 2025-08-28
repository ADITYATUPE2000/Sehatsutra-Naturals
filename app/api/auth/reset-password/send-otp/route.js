import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { otpEmail } from "@/email/otpEmail";



export async function POST(request){
    try {
        await connectDB()
        const payload = await request.json()
        const validationSchema = zSchema.pick({
            email : true
        })

        const validatedData= validationSchema.safeParse(payload)
        if(!validatedData.success){
           return  response(false, 401, 'Invalid or missing input field.', validatedData.error ) 
        }

        const {email} = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt: null, email}).lean()
        if (!getUser) {
            return  response(false, 401, 'User not found.') 
        }

         //remove old otp
         await OTPModel.deleteMany({email})
         const otp = generateOTP()
         const newOtpData = new OTPModel({
             email,otp
         })
 
         await newOtpData.save()
 
         const otpSendStatus = await sendMail('your login verification code.', email,otpEmail(otp))
 
         if(!otpSendStatus){
             return response( false, 400, 'Failed to resend OTP.') 
         }
         return response( true, 200, 'Please verify your acount.')
         

    } catch (error) {
        catchError(error) 
        return response(false, 500, 'Internal server error', error)
    }
}

import { connectDB } from '@/lib/databaseConnection'
import { zSchema } from '@/lib/zodSchema'
import UserModel from '@/models/User.model'
import { response, catchError } from '@/lib/helperFunction'

export async function POST(request){
    try {
        await connectDB()   
        const payload = await request.json()
        const validationSchema = zSchema.pick({
             email: true, password: true
        })

        const validatedData = validationSchema.safeParse(payload)
        if(!validatedData.success){
            return response( false,401,'Invalid or missing input.', validatedData.error)
        }

        const {email, password} = validatedData.data

        const getUser = await UserModel.findOne({ deletedAt : null ,email}).select('+password')
        
        if(!getUser){
            return response( false, 404, 'User not found.')
        }

        getUser.password = password
        await getUser.save()

        return response( true, 200, 'Password Updated suceesfully.')

    } catch (error) {
        catchError(error)
    }
}

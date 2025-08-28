import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ButtonLoading from './ButtonLoading'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form.jsx'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp.jsx'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const OTPVerification = ({email, onSubmit, loading}) => {

    const [isResendingOtp, setIsResendingOtp] = useState(false)
    const formSchema = zSchema.pick({
        otp: true, email: true
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            otp: "",
            email: email
        }
    })

    const handleOtpVerification = async (values) =>{
        // console.log("OTPVerification values:", values);
        // console.log("Form state:", form.getValues());
        onSubmit(values)
    }

    const reSendOTP = async () => {
        try {
            setIsResendingOtp(true)
            const {data: resendOtpResponse} = await axios.post('/api/auth/resend-otp',{email})

            if (!resendOtpResponse.success){
              throw new Error(resendOtpResponse.message)
            }
            showToast('success', resendOtpResponse.message)
            
        } catch (error) {
            showToast('error', error.message) 
        }finally{
            setIsResendingOtp(false)
        }
    }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <div className='w-full max-w-md mx-auto'>
            <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold mb-2'> Please Complete Verification </h1>
                        <p className='text-md'>We have sent an One time Password (OTP) to your registered email address. The OTP is valid for 10 minutes only.</p>
                    </div>
                    
                    <div className='mb-5 mt-5 flex justify-center'>
                      <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">One-time Password (OTP)</FormLabel>
                            <FormControl>
                            <InputOTP 
                                maxLength={6} 
                                value={field.value}
                                onChange={field.onChange}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot className="text-xl size-10" index={0} />
                                    <InputOTPSlot className="text-xl size-10" index={1} />
                                    <InputOTPSlot className="text-xl size-10" index={2} />
                                    <InputOTPSlot className="text-xl size-10" index={3} />
                                    <InputOTPSlot className="text-xl size-10" index={4} />
                                    <InputOTPSlot className="text-xl size-10" index={5} />
                                </InputOTPGroup>
                           </InputOTP>

                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} 
                      />  
                    </div>

                    <div className='mb-3'>
                      <ButtonLoading loading={loading} type="submit" text="Verify" 
                        className='w-full cursor-pointer' />
                       <div className='text-center mt-5'>
                        {!isResendingOtp ?
                            <button onClick={reSendOTP} type = 'button' className='text-blue-500 cursor-pointer hover:underline'>Resend OTP</button>
                            :
                            <span className='text-md'>Resending...</span>
                        }
                       </div>
                    </div>
                  </form>
                </Form>
        </div>
    </div>
  )
}

export default OTPVerification
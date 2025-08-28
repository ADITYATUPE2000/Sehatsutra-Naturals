'use client'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { CardContent } from '@/components/ui/card.jsx';
import OTPVerification from '@/components/Application/OTPVerification';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import UpdatePassword from '@/components/Application/UpdatePassword'



const ResetPassword = () => {
    const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
    const [OtpVerificationLoading, setOtpVerificationLoading] = useState(false)
    const [otpEmail, setOtpEmail] = useState('')
    const [isOtpVerified, setIsOtpVerified] = useState(false)

    const formSchema = zSchema.pick({ 
        email: true
    })


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
        },

    })

    const handleEmailVerification = async (values) => {
        try {
            setEmailVerificationLoading(true)
            const {data : sendotpResponse} = await axios.post('/api/auth/reset-password/send-otp',values)
            if (!sendotpResponse.success){
              throw new Error(sendotpResponse.message)
            }
      
            setOtpEmail(values.email)
            showToast('success', sendotpResponse.message)
      

            
          } catch (error) {
            showToast('error', error.message) 
          }finally{
            setEmailVerificationLoading(false)
        }
    
    }

      // OTP verification
  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true)
      const {data : otpResponse} = await axios.post('/api/auth/reset-password/verify-otp',values)
      if (!otpResponse.success){
        throw new Error(otpResponse.message)
      }

      showToast('success', otpResponse.message)
      setIsOtpVerified(true)
      
    } catch (error) {
      showToast('error', error.message) 
    }finally{
      setOtpVerificationLoading(false)
    }
  }

  return (
    <CardContent>
            {!otpEmail ? (
                // Email Verification Form
                <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full space-y-8"
                    >
                        <div>
                            <div className="flex justify-center">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">E</span>
                                </div>
                            </div>
                            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Enter your Email for Password reset.
                            </p>
                        </div>
                        
                        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(handleEmailVerification)}>
                
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        {...form.register('email')}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your email"
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                                    )}
                                </div>
                                
                                {/* Remove password field - not needed for password reset request */}
                            </div>

                            {/* Remove remember me checkbox - not relevant for password reset */}

                            <div>
                                <button
                                    type="submit"
                                    disabled={emailVerificationLoading}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                >
                                    {emailVerificationLoading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending OTP...
                                        </div>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            </div>

                            <div className='text-center'>
                                <div className='flex justify-center items-center gap-1'>
                                    <Link href={WEBSITE_LOGIN} className='text-blue-600 hover:text-blue-800 underline'>
                                        Back to Login
                                    </Link>
                                </div>    
                            </div>        
                        </form>
                    </motion.div>
                </div>
            ) : (
                
                !isOtpVerified 
                    ? 
                    <OTPVerification  email={otpEmail}  onSubmit={handleOtpVerification}  loading={OtpVerificationLoading} />
                    :
                    <UpdatePassword email = {otpEmail}/>   
            )}
        </CardContent>
    ) 
       
}

export default ResetPassword;

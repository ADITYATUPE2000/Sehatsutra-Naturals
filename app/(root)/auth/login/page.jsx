'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'
import { useDispatch } from 'react-redux'
import { CardContent } from '@/components/ui/card.jsx';
import OTPVerification from '@/components/Application/OTPVerification';
import { login } from '@/store/reducer/authReducer'
import { USER_DASHBOARD, WEBSITE_RESTPASSWORD } from '@/routes/WebsiteRoute'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Logo from "@/assets/images/Logo.png"

export default function LoginPage() {
  const dispatch = useDispatch()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [OtpVerificationLoading, setOtpVerificationLoading] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')
  const router = useRouter()

  // Login form schema
  const loginFormSchema = zSchema.pick({ 
    email: true
  }).extend({ 
    password: z.string().min(3, 'Password field is required.')
  })

  // OTP form schema
  const otpFormSchema = z.object({
    otp: z.string().min(4, 'OTP must be at least 4 characters').max(8, 'OTP must be at most 8 characters')
  })

  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // OTP form
  const otpForm = useForm({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: ''
    }
  })

  const handleLoginSubmit = async (values) => { 
    try {
      setLoading(true)
      const {data: loginResponse} = await axios.post('/api/auth/login', values)
      
      if (!loginResponse.success){
        throw new Error(loginResponse.message)
      }

      // Set email for OTP verification and reset form
      setOtpEmail(values.email)
      loginForm.reset() // ✅ Fixed: Use loginForm instead of form
      showToast('success', loginResponse.message)
      
    } catch (error) {
      showToast('error', error?.response?.data?.message || error.message) 
    } finally {
      setLoading(false)
    }
  }

  // OTP verification
  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true)
      
      // ✅ Fixed: Include both email and OTP in the request
      const requestData = {
        email: otpEmail,
        otp: values.otp
      }
      
      const {data: otpResponse} = await axios.post('/api/auth/verify-otp', requestData)
      
      if (!otpResponse.success){
        throw new Error(otpResponse.message)
      }

      // Clear OTP email and reset form
      setOtpEmail('')
      otpForm.reset() // ✅ Added: Reset OTP form after success
      showToast('success', otpResponse.message)

      // Dispatch login action
      dispatch(login(otpResponse.data))

      // Handle navigation
      if (searchParams.has('callback')) {
        router.push(searchParams.get('callback'))
      } else {
        const redirectPath = otpResponse.data.role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD
        router.push(redirectPath)
      }
      
    } catch (error) {
      showToast('error', error?.response?.data?.message || error.message) 
    } finally {
      setOtpVerificationLoading(false)
    }
  }

  return (
    <CardContent>
      {!otpEmail ? (
        // Login Form
        <div className="min-h-screen bg-[#FAF4E9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full space-y-8"
          >
            <div>
              <div className="flex justify-center">
                <Image 
                  src={Logo} 
                  alt="Vedara Naturals Logo" 
                  width={60} 
                  height={60}
                />
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  create a new account
                </Link>
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
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
                    {...loginForm.register('email')}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      {...loginForm.register('password')}
                      className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href={WEBSITE_RESTPASSWORD} className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#2D5016] hover:bg-[#7BA428] group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      ) : (
        // OTP Verification Form
        <OTPVerification 
          email={otpEmail} 
          onSubmit={handleOtpVerification} 
          loading={OtpVerificationLoading} 
        />
      )}
    </CardContent>
  )
}
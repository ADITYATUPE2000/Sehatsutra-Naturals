'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { showToast } from '@/lib/showToast'
import { zSchema } from '@/lib/zodSchema'

// Fix 1: Component should receive props object, not just email parameter
export default function UpdatedPassword({ email }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const router = useRouter()

  // Fix 2: Add missing WEBSITE_LOGIN constant or import
  const WEBSITE_LOGIN = '/auth/login' // Define the login route

  const formSchema = zSchema.pick({ 
    email: true, 
    password: true
  }).extend({
    confirmPassword: z.string().min(1, 'Please confirm your password')
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || '', // Fix 3: Handle case where email might be undefined
      password: "",
      confirmPassword: "",
    },
  })

  const handlePasswordUpdate = async (values) => {
    try {
      setLoading(true)
      setError('')
      
      // Fix 4: Change axios.push to axios.post (push is not a valid axios method)
      const { data: passwordUpdate } = await axios.post('/api/auth/reset-password/update-password', values)
      
      if (!passwordUpdate.success) {
        throw new Error(passwordUpdate.message)
      }

      // Set success state and store email for display
      setRegisteredEmail(values.email)
      setSuccess(true)
      form.reset()
      showToast('success', passwordUpdate.message)
      router.push(WEBSITE_LOGIN)
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      setError(errorMessage)
      showToast('error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setSuccess(false)
    setRegisteredEmail('')
    setError('')
    form.reset()
  }

  // Fix 5: Update success screen content to match password update context
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Password Updated Successfully!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your password has been updated. You can now login with your new password.
            </p>
            <div className="mt-8 space-y-3">
              <Link
                href="/auth/login"
                className="inline-block w-full text-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                Go to Login
              </Link>
              <button
                onClick={handleBackToLogin}
                className="inline-block w-full text-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                Update Another Password
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Fix 6: Remove email field from form since it's passed as prop and should be read-only
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div>
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔒</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Update Password
          </h2>
          {email && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Updating password for: <strong>{email}</strong>
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(handlePasswordUpdate)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  {...form.register('password')}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your new password"
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
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  {...form.register('confirmPassword')}
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Fix 7: Remove terms checkbox for password update - not typically needed */}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
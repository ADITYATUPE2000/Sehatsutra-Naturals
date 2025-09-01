'use client'
import { useEffect } from 'react'
import { useStore } from '@/lib/store'

const AuthInitializer = () => {
  const { checkAuth } = useStore()

  useEffect(() => {
    // Check if user is authenticated when the app loads
    checkAuth()
  }, [checkAuth])

  return null // This component doesn't render anything
}

export default AuthInitializer
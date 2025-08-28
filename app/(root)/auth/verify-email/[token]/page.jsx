'use client' 
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import verifiedImg from "@/assets/images/verified.gif"
import verificationFailedImg from "@/assets/images/verification-failed.gif"
import {Card, CardContent } from '@/components/ui/card.jsx'
import Image from 'next/image'
import { Button } from '@/components/ui/Button.jsx'
import Link from 'next/link'
import { USER_DASHBOARD, WEBSITE_DASHBOARD } from '@/routes/WebsiteRoute'

const EmailVerification = ({params}) => {
  const { token } = params;
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verify = async () => {
      try {
        const { data : verificationResponse } = await axios.post('/api/auth/verify-email',{token})
        if (verificationResponse.success){
          setIsVerified(true)
        }
        
      } catch (error) {
        console.error('Verification failed:', error)
      } finally {
        setIsLoading(false)
      }
    } 
    verify()
  },[token, router])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className = "w-[400px]">
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Verifying your email...</p>
          </CardContent>
       </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className = "w-[400px]">
        <CardContent>
        {isVerified ?
          <div>
            <div className='flex justify-center items-center'>
              <Image src ={verifiedImg.src} height={verifiedImg.height}
              width={verifiedImg.width} className='h-[100px] w-auto' alt='Verification success'/ >
            </div>
            <div className='text-center'>
              <h1 className='text-2xl font-bold text-green-500 my-5'>Email verification success!</h1>
              <p className='text-gray-600 mb-4'>Redirecting to home page...</p>

              <Button asChild>
                <Link href ={USER_DASHBOARD}> Continue Shopping </Link>
              </Button>
            </div>
          </div>
          :
          <div>
            <div className='flex justify-center items-center'>
              <Image src ={verificationFailedImg.src} height={verificationFailedImg.height}
              width={verificationFailedImg.width} className='h-[100px] w-auto' alt='Verification failed'/>
            </div>
            <div className='text-center'>
              <h1 className='text-2xl font-bold text-red-500 my-5'>Email verification failed!</h1>

              <Button asChild>
                <Link href ={WEBSITE_HOME}> Continue Shopping </Link>
              </Button>
            </div>
          </div>
        }
      </CardContent>
      </Card>
    </div>
  )
}

export default EmailVerification
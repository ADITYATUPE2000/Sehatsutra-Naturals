'use client'
import Hero from '@/components/website/Hero'
import FeaturesSection from "@/components/website/FeaturesSection"
import Footer from "@/components/website/Footer"
import Navbar from '@/components/website/Navbar'
import { useStore } from '@/lib/store'
import { useEffect } from 'react'

export default function Page() {
  const { checkAuth } = useStore()

  useEffect(() => {
    checkAuth()
  }, []) 

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <Footer />
    </div>
  )
}
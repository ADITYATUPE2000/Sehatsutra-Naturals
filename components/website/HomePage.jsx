'use client'

import Hero from '@/components/Hero'
import FeatureSection from "@/components/FeatureSection"
import Footer from "@/components/Footer"
import Navbar from '@/components/Navbar'
import Testimonials from '@/components/Testimonials'



export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureSection />
      <Testimonials/>
      <Footer />

    </div>
    
  )
}
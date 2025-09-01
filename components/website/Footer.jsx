'use client'

import Link from 'next/link'
import Logo from "@/assets/images/Logo.png"
import Image from 'next/image'
import facebook2x from "@/assets/email/facebook2x.png"
import twitter2x from "@/assets/email/twitter2x.png"
import instagram2x from "@/assets/email/instagram2x.png"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src={Logo} 
                alt="Vedara Naturals Logo" 
                width={40} 
                height={40}    
              />
              <span className="text-xl font-bold">Sehatsutra Naturals</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your one-stop shop for sustainable and eco-friendly products. 
              Making the world a better place, one purchase at a time.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/register" className="text-gray-300 hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">              
            </div>
            <div className="flex space-x-4">
              <Link href={""} className="text-gray-300 hover:text-white transition-colors">
                <Image src={facebook2x} alt="Instagram" width={40} height={40} />
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                </svg>
              </Link>
              <Link href={""} className="text-gray-300 hover:text-white transition-colors">
              <Image src={twitter2x} alt="Twitter" width={40} height={40} />
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                </svg>
              </Link>
              <Link href={""} className="text-gray-300 hover:text-white transition-colors">
                <Image src={instagram2x} alt="Instagram" width={40} height={40} />
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-300">
          <p>&copy; 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
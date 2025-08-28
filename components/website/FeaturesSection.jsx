import React from 'react';
import { Leaf, Sprout, MapPin, UtensilsCrossed, Soup, Croissant } from "lucide-react";
import Product from "@/assets/images/Product.png";
import Image from 'next/image';

const FeaturesSection = () => {
  return (
    <div className="text-[#1A2E22]">

      {/* Section 1 - Closing */}
      <section className="bg-white py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Your Journey to Natural Wellness Starts Here!
          </h2>
        </div>
      </section>

      {/* Section 2 - Hero */}
      <section className="bg-[#FAF6ED] py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-8 lg:gap-12">
          <div className="space-y-6 order-2 md:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Ancient Purity,<br />
              Modern Wellness
            </h1>
            <p className="text-lg sm:text-xl text-gray-700">
              Organic Moringa Powder — Superfood for Daily Vitality
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <button className="bg-[#1A2E22] text-white text-lg sm:text-xl px-6 sm:px-7 py-3 rounded font-medium w-full sm:w-auto hover:bg-[#2A3E32] transition-colors">
                Shop Now
              </button>
              <button className="border border-[#1A2E22] text-[#1A2E22] text-lg sm:text-xl px-6 sm:px-7 py-3 rounded font-medium w-full sm:w-auto hover:bg-[#1A2E22] hover:text-white transition-colors">
                Know More
              </button>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-6 sm:gap-10 lg:gap-14 mt-12 sm:mt-16 lg:mt-20">
              <div className="flex flex-col items-center text-center sm:text-left">
                <Leaf className="w-6 sm:w-7 lg:w-9 h-6 sm:h-7 lg:h-9 mb-2 sm:mb-3" />
                <p className="text-sm sm:text-lg lg:text-xl font-medium leading-tight">100%<br />Pure &<br />Natural</p>
              </div>
              <div className="flex flex-col items-center text-center sm:text-left">
                <Sprout className="w-6 sm:w-7 lg:w-9 h-6 sm:h-7 lg:h-9 mb-2 sm:mb-3" />
                <p className="text-sm sm:text-lg lg:text-xl font-medium leading-tight">Sustainably<br />Sourged</p>
              </div>
              <div className="flex flex-col items-center text-center sm:text-left">
                <MapPin className="w-6 sm:w-7 lg:w-9 h-6 sm:h-7 lg:h-9 mb-2 sm:mb-3" />
                <p className="text-sm sm:text-lg lg:text-xl font-medium leading-tight">Made in<br />India</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center order-1 md:order-2">
            <Image src={Product}
            alt="Organic Moringa Powder" className="w-72 sm:w-96 lg:w-[32rem] h-auto max-w-full" />
          </div>
        </div>
      </section>

      {/* Section 3 - Why Moringa */}
      <section className="bg-white py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 max-w-4xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">Why Moringa?</h2>
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-700">
              At SehatSutra Naturals, we believe in thriving while tending the timeless purity of nature with the wellness needs of today. Our Organic Moringa Powder is a nutrient-rich superfood, carefully sourced, minimally processed, and packed with natural goodness.
            </p>
            {/* <button className="bg-[#1A2E22] text-white px-6 py-3 rounded font-bold text-base sm:text-lg hover:bg-[#2A3E32] transition-colors">
              Shop Now - Starting ₹299
            </button> */}
          </div>
        </div>
      </section>

      {/* Section 4 - How to Use */}
      <section className="bg-[#FAF6ED] py-12 sm:py-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 sm:mb-12 lg:mb-16 text-left">
            Simple to Add,<br />
            Powerful in Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <UtensilsCrossed className="w-8 h-8 mt-1 flex-shrink-0 text-[#1A2E22]" />
              <div>
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-2">Mix</h3>
                <p className="text-lg sm:text-xl text-gray-700">Add 1tsp to smoothies, juices, or warm water</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Soup className="w-8 h-8 mt-1 flex-shrink-0 text-[#1A2E22]" />
              <div>
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-2">Sprinkle</h3>
                <p className="text-lg sm:text-xl text-gray-700">Over salads, soups, or curries</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Croissant className="w-8 h-8 mt-1 flex-shrink-0 text-[#1A2E22]" />
              <div>
                <h3 className="font-bold text-xl sm:text-2xl lg:text-3xl mb-2">Blend</h3>
                <p className="text-lg sm:text-xl text-gray-700">Into baked goods for a healthy twist</p>
              </div>
            </div>
          </div>
        </div>
      </section>   
    </div>
  );
};

export default FeaturesSection;
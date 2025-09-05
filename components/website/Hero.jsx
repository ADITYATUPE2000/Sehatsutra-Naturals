'use client';
import { Button } from "@/components/ui/Button.jsx";
import Image from "next/image";
import white from "@/assets/images/white.png";
import Link from "next/link";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

const Hero = () => {
  // Animation refs for different elements
  const [titleRef] = useInViewAnimation('top', 0);
  const [descRef] = useInViewAnimation('left', 200);
  const [buttonRef] = useInViewAnimation('left', 400);
  const [imageRef] = useInViewAnimation('right', 100);

  return (
    <section className="min-h-[75vh] py-10 flex items-center bg-[#FAF4E9]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 lg:gap-16">
        
        {/* Left Text Section */}
        <div className="flex flex-col justify-center space-y-6 sm:space-y-8 text-center md:text-left order-2 md:order-1">
          <h1
            ref={titleRef}
            className="text-[#2D5016] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-bold leading-tight"
          >
            Ancient Purity,<br /> Modern Wellness
          </h1>
          
          <p
            ref={descRef}
            className="text-[#2D5016] text-base sm:text-lg md:text-xl lg:text-2xl max-w-md mx-auto md:mx-0"
          >
            Organic Moringa Powder — Superfood for Daily Vitality
          </p>
          
          <div
            ref={buttonRef}
            className="flex justify-center md:justify-start pt-2"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#2D5016] hover:bg-[#7BA428] text-white text-base sm:text-lg md:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-md transition-colors duration-200"
            >
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
        
        {/* Right Product Image */}
        <div className="flex justify-center order-1 md:order-2">
          <div
            ref={imageRef}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
          >
            <Image
              src={white}
              alt="Organic Moringa Powder"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
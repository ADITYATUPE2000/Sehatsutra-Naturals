import { useEffect, useRef, useState } from 'react';

/**
 * Animation hook that properly handles scroll-triggered animations
 */
export const useInViewAnimation = (direction = 'top', delay = 0) => {
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setHasAnimated(true);
      setShouldAnimate(true);
      return;
    }

    // If this element has already animated, don't reset styles or re-observe it.
    // Keep shouldAnimate true so callers can use that flag if needed.
    if (hasAnimated) {
      setShouldAnimate(true);
      return;
    }
    
    // Set initial hidden state (only when not yet animated)
    element.style.opacity = '0';
    element.style.transform = getInitialTransform(direction);
    element.style.transition = 'none';
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          const triggerAnimation = () => {
            setHasAnimated(true);
            setShouldAnimate(true);
            
            // Apply animation
            element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translate3d(0, 0, 0)';
          };

          if (delay > 0) {
            setTimeout(triggerAnimation, delay);
          } else {
            triggerAnimation();
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    observer.observe(element);

    // Check if element is initially in viewport
    const checkInitialView = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      
      if (isVisible && !hasAnimated) {
        const triggerAnimation = () => {
          setHasAnimated(true);
          setShouldAnimate(true);
          
          // Apply animation
          element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
          element.style.opacity = '1';
          element.style.transform = 'translate3d(0, 0, 0)';
        };

        if (delay > 0) {
          setTimeout(triggerAnimation, delay);
        } else {
          // Small delay to ensure DOM is ready
          setTimeout(triggerAnimation, 50);
        }
      }
    };

    // Check immediately and after a brief delay for initial render
    checkInitialView();
    const timeoutId = setTimeout(checkInitialView, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [direction, delay, hasAnimated]);

  return [ref, shouldAnimate];
};

/**
 * Helper function to get initial transform based on direction
 */
const getInitialTransform = (direction) => {
  switch (direction) {
    case 'left':
      return 'translate3d(-30px, 0, 0)';
    case 'right':
      return 'translate3d(30px, 0, 0)';
    case 'top':
    default:
      return 'translate3d(0, -30px, 0)';
  }
};

/**
 * Hook for staggered animations
 */
export const useStaggeredAnimation = (count, direction = 'top', baseDelay = 0) => {
  const animations = [];
  
  for (let i = 0; i < count; i++) {
    const [ref, shouldAnimate] = useInViewAnimation(direction, baseDelay + (i * 150));
    animations.push([ref, shouldAnimate]);
  }
  
  return animations;
};

export default useInViewAnimation;
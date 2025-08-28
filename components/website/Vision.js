// 'use client'

// import { motion } from 'framer-motion'
// import { useRef, useEffect, useState } from 'react'

// export default function Vision() {
//   const ref = useRef(null)
//   const [isInView, setIsInView] = useState(false)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsInView(true)
//         }
//       },
//       { threshold: 0.1 }
//     )

//     if (ref.current) {
//       observer.observe(ref.current)
//     }

//     return () => observer.disconnect()
//   }, [])

//   const features = [
//     {
//       icon: '🌱',
//       title: 'Sustainable Materials',
//       description: 'All our products are made from renewable, biodegradable, or recycled materials.'
//     },
//     {
//       icon: '♻️',
//       title: 'Zero Waste',
//       description: 'We are committed to eliminating waste throughout our supply chain.'
//     },
//     {
//       icon: '🌍',
//       title: 'Carbon Neutral',
//       description: 'Our operations are completely carbon neutral with offset programs.'
//     },
//     {
//       icon: '🤝',
//       title: 'Fair Trade',
//       description: 'We ensure fair wages and ethical working conditions for all our partners.'
//     }
//   ]

//   return (
//     <section className="py-16 bg-white" ref={ref}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.6 }}
//             className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
//           >
//             Our Vision for a Sustainable Future
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-xl text-gray-600 max-w-3xl mx-auto"
//           >
//             We believe that sustainable living should be accessible, affordable, and beautiful. 
//             Every product we offer is carefully selected to minimize environmental impact while 
//             maximizing quality and functionality.
//           </motion.p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {features.map((feature, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 30 }}
//               animate={isInView ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.6, delay: index * 0.1 }}
//               className="text-center"
//             >
//               <div className="text-4xl mb-4">{feature.icon}</div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//               <p className="text-gray-600">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.6, delay: 0.4 }}
//           className="mt-16 text-center"
//         >
//           <div className="bg-green-50 rounded-2xl p-8 md:p-12">
//             <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//               Join Our Mission
//             </h3>
//             <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
//               Every purchase you make contributes to a more sustainable world. Together, we can 
//               create positive change for our planet and future generations.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
//                 Learn More
//               </button>
//               <button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-colors duration-300">
//                 Start Shopping
//               </button>
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </section>
//   )
// }
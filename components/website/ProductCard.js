// 'use client'

// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline'
// import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
// import { useStore } from '../lib/store'

// export default function ProductCard({ product }) {
//   const [isWishlisted, setIsWishlisted] = useState(false)
//   const { addToCart } = useStore()

//   const handleAddToCart = () => {
//     addToCart(product)
//   }

//   const toggleWishlist = () => {
//     setIsWishlisted(!isWishlisted)
//   }

//   return (
//     <motion.div
//       whileHover={{ y: -5 }}
//       className="bg-white rounded-lg shadow-md overflow-hidden group"
//     >
//       <div className="relative">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//         />
//         <button
//           onClick={toggleWishlist}
//           className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
//         >
//           {isWishlisted ? (
//             <HeartIconSolid className="w-5 h-5 text-red-500" />
//           ) : (
//             <HeartIcon className="w-5 h-5 text-gray-600" />
//           )}
//         </button>
        
//         {product.stock <= 5 && (
//           <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
//             Low Stock
//           </div>
//         )}
//       </div>
      
//       <div className="p-4">
//         <div className="flex items-center justify-between mb-2">
//           <span className="text-sm text-gray-500">{product.category}</span>
//           <div className="flex items-center">
//             <span className="text-yellow-400 text-sm">★</span>
//             <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
//           </div>
//         </div>
        
//         <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
//         <div className="flex items-center justify-between">
//           <span className="text-lg font-bold text-blue-600">${product.price}</span>
//           <button
//             onClick={handleAddToCart}
//             className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors duration-300"
//           >
//             <ShoppingCartIcon className="w-4 h-4" />
//             <span className="text-sm">Add</span>
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }
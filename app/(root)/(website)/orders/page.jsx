'use client'
import UserPanelLayout from '@/components/website/UserPanelLayout'
import React from 'react'
import useFetch from '@/hooks/useFetch'
import Link from 'next/link'
import Navbar from '@/components/website/Navbar'
import Footer from '@/components/website/Footer'

const Orders = () => {
  const { data: orderData, loading } = useFetch("/api/user-order")
  
  return (
    <div>
      <Navbar/>
      <UserPanelLayout>
        <div className='shadow rounded bg-white'>
          <div className='p-5 text-xl font-semibold border'>
            Orders
          </div>
          <div className='p-5'> 
            {loading ? (
              <div className='text-center py-5'>Loading...</div>
            ) : (
              <div className='overflow-auto'>
                <table className='w-full'>
                  <thead>
                    <tr>
                      <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Sr.No.</th>
                      <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Order id</th>
                      <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Total Item</th>
                      <th className='text-start p-2 text-sm border-b text-nowrap text-gray-500'>Amount</th>
                    </tr> 
                  </thead>
                  <tbody>
                    {orderData && orderData?.orders?.map((order, i) => (
                      <tr key={order._id}>
                        <td className='text-start text-sm text-gray-500 p-2 font-bold'>{i + 1}</td>
                        <td className='text-start text-sm text-gray-500 p-2'>
                          <Link className='underline hover:text-blue-500' href={`/orders/${order._id}`}>
                            {order._id}
                          </Link>
                        </td>
                        <td className='text-start text-sm text-gray-500 p-2'>
                          {order.items?.length || 0}
                        </td>
                        <td className='text-start text-sm text-gray-500 p-2'>
                          {order.totalAmount?.toLocaleString('en-IN', { 
                            style: 'currency', 
                            currency: 'INR' 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>                  
            )}
          </div>
        </div>
      </UserPanelLayout>
      <Footer/>
    </div>
  )
}

export default Orders

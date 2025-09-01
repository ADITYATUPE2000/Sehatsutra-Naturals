'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button.jsx'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { USER_DASHBOARD ,USER_ORDERS, USER_PROFILE, WEBSITE_LOGIN } from '../../routes/WebsiteRoute'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { logout } from '@/store/reducer/authReducer'
import { useStore } from '@/lib/store'
import { showToast } from '@/lib/showToast'
const UserPanelNavigation = () => {
    const pathname = usePathname()
    const dispatch = useDispatch()
    const { setUser } = useStore()
    const router = useRouter()
    const handleLogout = async () => {
       try {
            const { data: logoutResponse } = await axios.post('/api/auth/logout')
            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message)
            }
            // Clear both Redux and Zustand stores
            dispatch(logout())
            setUser(null)
            showToast('success', logoutResponse.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
    <div className='border shadow-sw p-4 rounded bg-white'>
        <ul>
            <li className='mb-2'>
                <Link href={USER_DASHBOARD} className={`block p-3 text-sm rounded
                hover:bg-primary hover:text-white ${pathname.startsWith(USER_DASHBOARD) ?
                'bg-primary text-white' : ''}`} >Dashboard</Link>
            </li>
            <li className='mb-2'>
                <Link href={USER_PROFILE} className={`block p-3 text-sm rounded
                hover:bg-primary hover:text-white ${pathname.startsWith(USER_PROFILE) ?
                'bg-primary text-white' : ''}`} >Profile</Link>
            </li>
            <li className='mb-2'>
                <Link href={USER_ORDERS} className={`block p-3 text-sm rounded
                hover:bg-primary hover:text-white ${pathname.startsWith(USER_ORDERS) ?
                'bg-primary text-white' : ''}`} >Orders</Link>
            </li>
            <li className='mb-2'>
                <Button type="button" onClick={handleLogout} variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white text-sm rounded">
                    Logout
                </Button>
            </li>

        </ul>

    </div>
  )
}

export default UserPanelNavigation
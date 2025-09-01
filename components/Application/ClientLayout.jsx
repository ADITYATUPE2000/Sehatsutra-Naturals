'use client'
import React from 'react'
import GlobalProvider from './GlobalProvider.jsx';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from "next-auth/react";

const ClientLayout = ({children}) => {
  return (
    <GlobalProvider>
      <ToastContainer />
      <SessionProvider>{children}</SessionProvider>
    </GlobalProvider>
  )
}

export default ClientLayout;

'use client'
import React from 'react'
import { Provider } from 'react-redux'
import { persistor, store } from '@/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import Loading from './loading'

const GlobalProvider = ({children}) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading= {<Loading/>}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default GlobalProvider;  
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import persistStore from "redux-persist/es/persistStore"
import storage from "../lib/storage"
import persistReducer from "redux-persist/es/persistReducer"
import authReducer  from "./reducer/authReducer"
import cartReducer from "./reducer/cartReducer"

const rootReducer = combineReducers({
  authStore: authReducer,
  cartStore: cartReducer
})

const persistConfig = {
    key : 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer : persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false})
 
})
export const persistor = persistStore(store)
export default store;
 
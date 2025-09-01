import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0,
    products: []
}

export const cartReducer = createSlice({
    name: 'cartStore',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.products = action.payload.items || [];
            state.count = action.payload.totalItems || 0;
        },
        
        addIntoCart: (state, action) => {
            const payload = action.payload;
            const existingProduct = state.products.findIndex(
                (product) => product.productId === payload.productId
            );

            if (existingProduct < 0) {
                state.products.push({
                    productId: payload.productId,
                    name: payload.name,
                    price: payload.price,
                    image: payload.image,
                    quantity: payload.quantity || 1
                });
            } else {
                state.products[existingProduct].quantity += payload.quantity || 1;
            }
            state.count = state.products.reduce((total, item) => total + item.quantity, 0);
        },    

        increaseQuantity: (state, action) => {
            const { productId } = action.payload;
            const existingProduct = state.products.findIndex(
                (product) => product.productId === productId
            );

            if (existingProduct >= 0) {
                state.products[existingProduct].quantity += 1;
                state.count = state.products.reduce((total, item) => total + item.quantity, 0);
            }
        },
        
        decreaseQuantity: (state, action) => {
            const { productId } = action.payload;
            const existingProduct = state.products.findIndex(
                (product) => product.productId === productId
            );

            if (existingProduct >= 0) {
                if (state.products[existingProduct].quantity > 1) {
                    state.products[existingProduct].quantity -= 1;
                    state.count = state.products.reduce((total, item) => total + item.quantity, 0);
                }
            }
        },
        
        removeFromCart: (state, action) => {
            const { productId } = action.payload;
            state.products = state.products.filter((product) => product.productId !== productId);
            state.count = state.products.reduce((total, item) => total + item.quantity, 0);
        },
        
        clearCart: (state, action) => {
            state.products = [];
            state.count = 0;
        }
    }
})

export const { 
    setCart,
    addIntoCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
} = cartReducer.actions;

export default cartReducer.reducer;

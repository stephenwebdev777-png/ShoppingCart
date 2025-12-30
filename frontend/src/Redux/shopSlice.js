import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = "http://localhost:3000";

// Async Thunks for API Calls
export const fetchAllProducts = createAsyncThunk('shop/fetchAllProducts', async () => {
    const response = await fetch(`${API_BASE_URL}/products/allproduct`);
    return response.json();
});

export const fetchCartData = createAsyncThunk('shop/fetchCartData', async (token, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/getcart`, {
            method: "POST",
            headers: { "auth-token": token, "Content-Type": "application/json" }
        });
        if (response.status === 401) return rejectWithValue("Unauthorized");
        return response.json();
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        all_product: [],
        cartItems: [],
        loading: false,
    },
    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        addToCartLocal: (state, action) => {
            const { itemId, size } = action.payload;
            const key = `${itemId}_${size}`;
            const existingItem = state.cartItems.find(item => item.key === key);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ key: key, quantity: 1 });
            }
        },
        removeFromCartLocal: (state, action) => {
            const key = action.payload;
            const index = state.cartItems.findIndex(item => item.key === key);
            if (index > -1) {
                if (state.cartItems[index].quantity > 1) {
                    state.cartItems[index].quantity -= 1;
                } else {
                    state.cartItems.splice(index, 1);
                }
            }
        },
        // NEW: Moved inside the reducers block
        deleteFromCartLocal: (state, action) => {
            const key = action.payload;
            state.cartItems = state.cartItems.filter(item => item.key !== key);
        },
        setCartItemsManual: (state, action) => {
            state.cartItems = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.all_product = action.payload;
            })
            .addCase(fetchCartData.fulfilled, (state, action) => {
                if (Array.isArray(action.payload)) state.cartItems = action.payload;
            });
    }
});

// Added deleteFromCartLocal to the exports
export const { 
    addToCartLocal, 
    removeFromCartLocal, 
    deleteFromCartLocal, 
    clearCart, 
    setCartItemsManual 
} = shopSlice.actions;

export default shopSlice.reducer;
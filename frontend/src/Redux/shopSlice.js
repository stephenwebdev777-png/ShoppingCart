import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:3000";

export const fetchAllProducts = createAsyncThunk(
  "shop/fetchAllProducts",
  async () => {
    const res = await fetch(`${API_BASE_URL}/products/allproduct`);
    return res.json();
  }
);

export const fetchCartData = createAsyncThunk(
  "shop/fetchCartData",
  async (token, { rejectWithValue }) => {
    const res = await fetch(`${API_BASE_URL}/user/getcart`, {
      method: "POST",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) 
      return rejectWithValue("Unauthorized");
    return res.json();
  }
);

export const addToCart = createAsyncThunk(
  "shop/addToCart",
  async ({ itemId, size }, { rejectWithValue }) => {
    const token = localStorage.getItem("auth-token");
    const key = `${itemId}_${size}`;

    if (token) {
      const res = await fetch(`${API_BASE_URL}/user/addtocart`, {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: key }),
      });

      if (res.status === 401) 
        return rejectWithValue("Unauthorized");
    }

    return { key };
  }
);

export const removeFromCart = createAsyncThunk(
  "shop/removeFromCart",
  async (key, { rejectWithValue }) => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      const res = await fetch(`${API_BASE_URL}/user/removefromcart`, {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: key }),
      });

      if (res.status === 401) 
        return rejectWithValue("Unauthorized");
    }
    return key;
  }
);

export const deleteFromCart = createAsyncThunk(
  "shop/deleteFromCart",
  async (key, { rejectWithValue }) => {
    const token = localStorage.getItem("auth-token");

    if (token) {
      const res = await fetch(`${API_BASE_URL}/user/removeentireitem`, {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: key }),
      });

      if (res.status === 401)
         return rejectWithValue("Unauthorized");
    }

    return key;
  }
);
const shopSlice = createSlice({
  name: "shop",
  initialState: {
    all_product: [],
    cartItems: [],
  },
  reducers: {
    clearCart: (state) => { //no api call, just clear local cart so used reducers
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder  
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.all_product = action.payload;
      })
      .addCase(fetchCartData.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.cartItems = action.payload;
        }
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        const { key } = action.payload;
        const item = state.cartItems.find((i) => i.key === key);

        if (item) item.quantity += 1;
        else state.cartItems.push({ key, quantity: 1 });
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        const key = action.payload;
        const item = state.cartItems.find((i) => i.key === key);

        if (!item) return;
        if (item.quantity > 1) item.quantity -= 1;
        else
          state.cartItems = state.cartItems.filter((i) => i.key !== key);
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (i) => i.key !== action.payload
        );
      });
  },
});

export const { clearCart } = shopSlice.actions;
export default shopSlice.reducer;

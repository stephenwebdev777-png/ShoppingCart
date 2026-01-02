import { configureStore } from '@reduxjs/toolkit';
import shopReducer from './shopSlice';

export const store = configureStore({ //global Redux store
    reducer: {
        shop: shopReducer,
    },
});
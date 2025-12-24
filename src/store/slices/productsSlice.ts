import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductsState {
    products: any[];
}

const initialState: ProductsState = {
    products: [],
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<any[]>) => {
            state.products = action.payload;
        },
    },
});

export const { setProducts } = productsSlice.actions;
export const productsReducer = productsSlice.reducer;
export default productsSlice.reducer;

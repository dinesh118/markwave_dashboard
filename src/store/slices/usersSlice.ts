import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UsersState {
    referralUsers: any[];
    existingCustomers: any[];
}

const initialState: UsersState = {
    referralUsers: [],
    existingCustomers: [],
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setReferralUsers: (state, action: PayloadAction<any[]>) => {
            state.referralUsers = action.payload;
        },
        setExistingCustomers: (state, action: PayloadAction<any[]>) => {
            state.existingCustomers = action.payload;
        },
    },
});

export const { setReferralUsers, setExistingCustomers } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
export default usersSlice.reducer;

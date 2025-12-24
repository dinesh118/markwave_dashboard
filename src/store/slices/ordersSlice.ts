import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrdersState {
    pendingUnits: any[];
    trackingData: {
        [key: string]: {
            currentStageId: number;
            history: { [stageId: number]: { date: string, time: string } };
        }
    };
    filters: {
        searchQuery: string;
        paymentFilter: string;
        statusFilter: string;
    };
    expansion: {
        expandedOrderId: string | null;
        activeUnitIndex: number | null;
        showFullDetails: boolean;
    };
    error: string | null;
}

const initialState: OrdersState = {
    pendingUnits: [],
    trackingData: {},
    filters: {
        searchQuery: '',
        paymentFilter: 'All Payments',
        statusFilter: 'PENDING_ADMIN_VERIFICATION',
    },
    expansion: {
        expandedOrderId: null,
        activeUnitIndex: null,
        showFullDetails: false,
    },
    error: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setPendingUnits: (state, action: PayloadAction<any[]>) => {
            state.pendingUnits = action.payload;
        },
        setOrdersError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.filters.searchQuery = action.payload;
        },
        setPaymentFilter: (state, action: PayloadAction<string>) => {
            state.filters.paymentFilter = action.payload;
        },
        setStatusFilter: (state, action: PayloadAction<string>) => {
            state.filters.statusFilter = action.payload;
        },
        setExpandedOrderId: (state, action: PayloadAction<string | null>) => {
            state.expansion.expandedOrderId = action.payload;
        },
        setActiveUnitIndex: (state, action: PayloadAction<number | null>) => {
            state.expansion.activeUnitIndex = action.payload;
        },
        setShowFullDetails: (state, action: PayloadAction<boolean>) => {
            state.expansion.showFullDetails = action.payload;
        },
        updateTrackingData: (state, action: PayloadAction<{ key: string; stageId: number; date: string; time: string }>) => {
            const { key, stageId, date, time } = action.payload;
            if (!state.trackingData[key]) {
                state.trackingData[key] = { currentStageId: stageId, history: {} };
            }
            state.trackingData[key].currentStageId = stageId;
            state.trackingData[key].history[stageId] = { date, time };
        },
        setInitialTracking: (state, action: PayloadAction<{ key: string; data: any }>) => {
            state.trackingData[action.payload.key] = action.payload.data;
        }
    },
});

export const {
    setPendingUnits,
    setOrdersError,
    setSearchQuery,
    setPaymentFilter,
    setStatusFilter,
    setExpandedOrderId,
    setActiveUnitIndex,
    setShowFullDetails,
    updateTrackingData,
    setInitialTracking,
} = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;
export default ordersSlice.reducer;

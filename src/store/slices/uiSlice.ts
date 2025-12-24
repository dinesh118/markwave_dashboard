import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
    activeTab: 'orders' | 'nonVerified' | 'existing' | 'tree' | 'products';
    isSidebarOpen: boolean;
    showAdminDetails: boolean;
    modals: {
        referral: boolean;
        editReferral: {
            isOpen: boolean;
            user: any;
        };
        proof: {
            isOpen: boolean;
            data: any;
        };
    };
}

const initialState: UIState = {
    activeTab: 'orders',
    isSidebarOpen: window.innerWidth >= 768,
    showAdminDetails: false,
    modals: {
        referral: false,
        editReferral: {
            isOpen: false,
            user: null,
        },
        proof: {
            isOpen: false,
            data: null,
        },
    },
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<UIState['activeTab']>) => {
            state.activeTab = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.isSidebarOpen = action.payload;
        },
        setShowAdminDetails: (state, action: PayloadAction<boolean>) => {
            state.showAdminDetails = action.payload;
        },
        setReferralModalOpen: (state, action: PayloadAction<boolean>) => {
            state.modals.referral = action.payload;
        },
        setEditReferralModal: (state, action: PayloadAction<{ isOpen: boolean; user?: any }>) => {
            state.modals.editReferral.isOpen = action.payload.isOpen;
            if (action.payload.user !== undefined) {
                state.modals.editReferral.user = action.payload.user;
            }
        },
        setProofModal: (state, action: PayloadAction<{ isOpen: boolean; data?: any }>) => {
            state.modals.proof.isOpen = action.payload.isOpen;
            if (action.payload.data !== undefined) {
                state.modals.proof.data = action.payload.data;
            }
        },
    },
});

export const {
    setActiveTab,
    toggleSidebar,
    setSidebarOpen,
    setShowAdminDetails,
    setReferralModalOpen,
    setEditReferralModal,
    setProofModal,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
export default uiSlice.reducer;

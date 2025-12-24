import React, { useState, useEffect } from 'react';
import './UserTabs.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useTableSortAndSearch } from '../hooks/useTableSortAndSearch';
import { LayoutDashboard, Users, TreePine, ShoppingBag, LogOut, UserCheck, PanelLeft, PanelLeftClose, Menu, X } from 'lucide-react';
import HealthStatus from './HealthStatus';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RootState } from '../store';
import {
  setActiveTab,
  toggleSidebar,
  setSidebarOpen,
  setShowAdminDetails,
  setReferralModalOpen,
  setEditReferralModal,
  setProofModal,
} from '../store/slices/uiSlice';
import {
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
} from '../store/slices/ordersSlice';
import { setReferralUsers, setExistingCustomers } from '../store/slices/usersSlice';
import { setProducts } from '../store/slices/productsSlice';

// Extracted Components
import ImageNamesModal from './modals/ImageNamesModal';
import AdminDetailsModal from './modals/AdminDetailsModal';
import ReferralModal from './modals/ReferralModal';
import EditReferralModal from './modals/EditReferralModal';
import OrdersTab from './tabs/OrdersTab';
import NonVerifiedUsersTab from './tabs/NonVerifiedUsersTab';
import ExistingCustomersTab from './tabs/ExistingCustomersTab';
import ProductsTab from './tabs/ProductsTab';
import BuffaloTreeTab from './tabs/BuffaloTreeTab';


interface UserTabsProps {
  adminMobile: string;
  adminName: string;
  adminRole: string;
  lastLogin?: string;
  presentLogin?: string;
  onLogout: () => void;
}


const UserTabs: React.FC<UserTabsProps> = ({ adminMobile, adminName, adminRole, lastLogin, presentLogin, onLogout }) => {
  const dispatch = useAppDispatch();

  // UI State from Redux
  const { isSidebarOpen, activeTab, showAdminDetails } = useAppSelector((state: RootState) => state.ui);
  const { referral: showModal, editReferral: { isOpen: showEditModal, user: editingUser }, proof: { isOpen: showProofModal, data: selectedProofData } } = useAppSelector((state: RootState) => state.ui.modals);

  // Business Logic State from Redux
  const { referralUsers, existingCustomers } = useAppSelector((state: RootState) => state.users);
  const products = useAppSelector((state: RootState) => state.products.products);
  const { pendingUnits, error: ordersError } = useAppSelector((state: RootState) => state.orders);
  const { searchQuery, paymentFilter, statusFilter } = useAppSelector((state: RootState) => state.orders.filters);
  const { expandedOrderId, activeUnitIndex, showFullDetails } = useAppSelector((state: RootState) => state.orders.expansion);
  const trackingData = useAppSelector((state: RootState) => state.orders.trackingData);

  const [formData, setFormData] = useState({
    mobile: '',
    first_name: '',
    last_name: '',
    refered_by_mobile: '',
    refered_by_name: '',
    role: 'Investor',
  });

  const [editFormData, setEditFormData] = useState({
    mobile: '',
    first_name: '',
    last_name: '',
    refered_by_mobile: '',
    refered_by_name: '',
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebarOpen(false));
      } else {
        dispatch(setSidebarOpen(true));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);



  // --- Referral Users Table Logic ---
  const {
    filteredData: filteredReferrals,

    sortConfig: referralSortConfig,
    requestSort: requestReferralSort,
  } = useTableSortAndSearch(referralUsers, { key: '', direction: 'asc' });

  // --- Existing Users Table Logic ---
  const {
    filteredData: filteredExistingUsers,

    sortConfig: existingUsersSortConfig,
    requestSort: requestExistingUsersSort,
  } = useTableSortAndSearch(existingCustomers, { key: '', direction: 'asc' });

  const getSortIcon = (key: string, currentSortConfig: any) => {
    if (currentSortConfig.key !== key) return '';
    return currentSortConfig.direction === 'asc' ? '↑' : '↓';
  };


  useEffect(() => {
    const fetchReferralUsers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getReferrals());
        dispatch(setReferralUsers(response.data.users || []));
      } catch (error) {
        dispatch(setReferralUsers([])); // Clear users on error
      }
    };


    const fetchExistingCustomers = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getUsers());
        dispatch(setExistingCustomers(response.data.users || []));
      } catch (error) {
        dispatch(setExistingCustomers([])); // Clear users on error
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.getProducts());
        const productsData = response.data?.products || [];
        dispatch(setProducts(productsData));
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(setProducts([])); // Clear products on error
      }
    };

    // Only fetch data for the user-related tabs. The 'tree' tab is client-side.
    if (activeTab === 'orders') {
      fetchPendingUnits();
    } else if (activeTab === 'nonVerified') {
      fetchReferralUsers();
    } else if (activeTab === 'existing') {
      fetchExistingCustomers();
    } else if (activeTab === 'products') {
      fetchProducts();
    }
  }, [activeTab, dispatch]); // Added dispatch to deps

  const fetchPendingUnits = async () => {
    try {
      dispatch(setOrdersError(null));
      const response = await axios.get(API_ENDPOINTS.getPendingUnits(), {
        headers: {
          'X-Admin-Mobile': adminMobile,
        },
      });
      const units = response.data?.orders || [];
      dispatch(setPendingUnits(units));
    } catch (error: any) {
      console.error('Error fetching pending units:', error);
      const rawDetail = error?.response?.data?.detail;
      let msg: string;
      if (typeof rawDetail === 'string') {
        msg = rawDetail;
      } else if (Array.isArray(rawDetail)) {
        const first = rawDetail[0];
        if (first && typeof first === 'object' && 'msg' in first) {
          msg = String(first.msg);
        } else {
          msg = 'Failed to load orders';
        }
      } else if (rawDetail && typeof rawDetail === 'object' && 'msg' in rawDetail) {
        msg = String(rawDetail.msg);
      } else {
        msg = 'Failed to load orders';
      }
      dispatch(setOrdersError(msg));
      dispatch(setPendingUnits([]));
    }
  };

  const handleApproveClick = async (unitId: string) => {
    try {
      await axios.post(API_ENDPOINTS.approveUnit(), { orderId: unitId }, {
        headers: {
          'X-Admin-Mobile': adminMobile,
        }
      });
      alert('Order approved successfully!');
      fetchPendingUnits();
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order.');
    }
  };
  const handleReject = async (unitId: string) => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;
    try {
      await axios.post(API_ENDPOINTS.rejectUnit(), { orderId: unitId }, {
        headers: {
          'X-Admin-Mobile': adminMobile,
        }
      });
      alert('Order rejected successfully!');
      fetchPendingUnits();
    } catch (error) {
      console.error('Error rejecting order:', error);
      alert('Failed to reject order.');
    }
  };

  const handleCreateClick = () => {
    dispatch(setReferralModalOpen(true));
  };

  const handleCloseModal = () => {
    dispatch(setReferralModalOpen(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchReferrerDetails = async (mobile: string, isEditMode: boolean = false) => {
    if (!mobile || mobile.length < 10) return;

    try {
      const response = await axios.get(API_ENDPOINTS.getUserDetails(mobile));
      if (response.data && response.data.user) {
        const user = response.data.user;
        let fullName = '';

        if (user.first_name || user.last_name) {
          fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        } else if (user.name) {
          fullName = user.name;
        }

        if (isEditMode) {
          setEditFormData(prev => ({
            ...prev,
            refered_by_name: fullName
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            refered_by_name: fullName
          }));
        }
      }
    } catch (error) {
      console.log('Referrer not found or error fetching details');
      // Optional: Clear the name field if user not found? 
      // For now, let's keep the user input or allow manual entry if API fails.
    }
  };

  const handleReferralMobileBlur = () => {
    fetchReferrerDetails(formData.refered_by_mobile, false);
  };

  const handleEditReferralMobileBlur = () => {
    fetchReferrerDetails(editFormData.refered_by_mobile, true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ENDPOINTS.createUser(), {
        mobile: formData.mobile,
        first_name: formData.first_name,
        last_name: formData.last_name,
        refered_by_mobile: formData.refered_by_mobile,
        refered_by_name: formData.refered_by_name,
        role: formData.role,
      });

      console.log('User response:', response.data);

      // Check if user already exists
      if (response.data.message === 'User already exists') {
        alert('User already exists with this mobile number.');
      } else {
        alert('User created successfully!');
      }

      // Close modal and reset form
      dispatch(setReferralModalOpen(false));
      setFormData({
        mobile: '',
        first_name: '',
        last_name: '',
        refered_by_mobile: '',
        refered_by_name: '',
        role: 'Investor',
      });

      // Refresh the referral users list
      if (activeTab === 'nonVerified') {
        const refreshResponse = await axios.get(API_ENDPOINTS.getReferrals());
        dispatch(setReferralUsers(refreshResponse.data.users || []));
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user. Please try again.');
    }
  };

  const handleRowClick = (user: any) => {
    setEditFormData({
      mobile: user.mobile,
      first_name: user.first_name,
      last_name: user.last_name,
      refered_by_mobile: user.refered_by_mobile || '',
      refered_by_name: user.refered_by_name || '',
    });
    dispatch(setEditReferralModal({ isOpen: true, user }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(API_ENDPOINTS.updateUser(editingUser.mobile), {
        first_name: editFormData.first_name,
        last_name: editFormData.last_name,
        refered_by_mobile: editFormData.refered_by_mobile,
        refered_by_name: editFormData.refered_by_name,
      });

      console.log('User updated:', response.data);
      alert('User updated successfully!');

      // Close modal and reset form
      dispatch(setEditReferralModal({ isOpen: false }));
      setEditFormData({
        mobile: '',
        first_name: '',
        last_name: '',
        refered_by_mobile: '',
        refered_by_name: '',
      });

      // Refresh the referral users list
      const refreshResponse = await axios.get(API_ENDPOINTS.getReferrals());
      dispatch(setReferralUsers(refreshResponse.data.users || []));
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
  };

  const handleCloseEditModal = () => {
    dispatch(setEditReferralModal({ isOpen: false }));
  };

  // Helper to format date/time
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
    const time = now.toLocaleTimeString('en-GB');
    return { date, time };
  };

  // Initialize tracking for a buffalo if not present
  const getTrackingForBuffalo = (orderId: string, buffaloNum: number, initialStatus: string) => {
    const key = `${orderId}-${buffaloNum}`;

    // Lazy initialization logic inside render or handler usually, but here accessing state directly
    // If not exists, return default based on paymentStatus
    if (trackingData[key]) {
      return trackingData[key];
    }

    // Default mapping - Always start at Stage 1
    let stageId = 1; // Order Placed
    const history: any = {
      1: { date: '24-05-2025', time: '10:30:00' } // Mock initial
    };

    // Note: Previous logic to auto-advance based on paymentStatus is removed 
    // to allow full manual "Update" flow from the start.

    // We return a transient object if not in state, but ideally we should set state.
    // However, to avoid infinite loops, we'll return this derived state.
    // The "Update" action will commit it to state.
    return { currentStageId: stageId, history };
  };

  const handleStageUpdate = (orderId: string, buffaloNum: number, nextStageId: number) => {
    const key = `${orderId}-${buffaloNum}`;
    const { date, time } = getCurrentDateTime();
    dispatch(updateTrackingData({ key, stageId: nextStageId, date, time }));
  };

  const handleViewProof = (transaction: any, investor: any) => {
    dispatch(setProofModal({ isOpen: true, data: { ...transaction, name: investor.name } }));
  };

  const handleCloseProofModal = () => {
    dispatch(setProofModal({ isOpen: false }));
  };

  const filteredUnits = pendingUnits.filter((entry: any) => {
    const unit = entry.order || {};
    const tx = entry.transaction || {};
    const inv = entry.investor || {};


    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLocaleLowerCase();
      matchesSearch = (
        (unit.id && String(unit.id).toLocaleLowerCase().includes(query)) ||
        (unit.userId && String(unit.userId).toLocaleLowerCase().includes(query)) ||
        (unit.breedId && String(unit.breedId).toLocaleLowerCase().includes(query)) ||
        (inv.name && String(inv.name).toLocaleLowerCase().includes(query))
      )
    }

    // 2. Payment Filter
    let matchesPayment = true;
    if (paymentFilter !== 'All Payments') {
      matchesPayment = tx.paymentType === paymentFilter;
    }

    // 3. Status Filter
    let matchesStatus = true;
    if (statusFilter !== 'All Status') {
      matchesStatus = unit.paymentStatus === statusFilter;
    }

    return matchesSearch && matchesPayment && matchesStatus;
  });

  return (
    <div className="app-container">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => dispatch(setSidebarOpen(false))}
      />

      {/* Global Header - Full Width */}
      <header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'var(--bg-color)', /* Match bg */
        position: 'relative',
        zIndex: 101, /* Above sidebar */
        height: '60px' // Check height
      }}>
        {/* Mobile Menu Toggle - Visible only on mobile */}
        {/* Mobile Menu Toggle - Always visible on mobile to toggle state */}
        <button
          className="mobile-menu-toggle"
          onClick={() => dispatch(toggleSidebar())}
          style={{
            position: 'absolute',
            left: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#344767',
            display: 'none' // Hidden by default, shown via CSS on mobile
          }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Centered Title */}
        <h6 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#344767'
        }}>
          Animalkart Dashboard
        </h6>

        {/* Right Status - Absolutely positioned */}
        <div style={{
          position: 'absolute',
          right: '2rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <HealthStatus />
          </div>
        </div>
      </header>

      {/* Main Body Layout (Sidebar + Content) */}
      <div className="layout-body">
        {/* Sidebar */}
        <nav className={`sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
          <div className="sidebar-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: isSidebarOpen ? 'space-between' : 'center', alignItems: 'center', minHeight: '32px' }}>
            {isSidebarOpen && (
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#344767', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', background: 'linear-gradient(310deg, #2152ff 0%, #21d4fd 100%)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <LayoutDashboard size={14} />
                </div>
                MarkWave
              </div>
            )}
            <button
              onClick={() => dispatch(toggleSidebar())}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px', display: 'flex' }}
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
            </button>
          </div>

          <ul className="sidebar-menu">
            <li>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab('orders'))}
                title={!isSidebarOpen ? "Orders" : ""}
              >
                <LayoutDashboard />
                <span className="nav-text">Orders</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'nonVerified' ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab('nonVerified'))}
                title={!isSidebarOpen ? "Referral" : ""}
              >
                <Users />
                <span className="nav-text">Referrals</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'existing' ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab('existing'))}
                title={!isSidebarOpen ? "Verified Users" : ""}
              >
                <UserCheck />
                <span className="nav-text">Investors</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'tree' ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab('tree'))}
                title={!isSidebarOpen ? "Buffalo Tree" : ""}
              >
                <TreePine />
                <span className="nav-text">Buffalo Tree</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => dispatch(setActiveTab('products'))}
                title={!isSidebarOpen ? "Products" : ""}
              >
                <ShoppingBag />
                <span className="nav-text">Products</span>
              </button>
            </li>
          </ul>

          <div className="sidebar-footer">

            <div className="user-profile" onClick={() => dispatch(setShowAdminDetails(true))} style={{ cursor: 'pointer' }}>
              <div className="avatar-circle">{adminName.charAt(0)}</div>
              <div className="user-info">
                <span className="user-name">{adminName}</span>
                <span className="user-email">{adminMobile}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={onLogout} title={!isSidebarOpen ? "Logout" : ""}>
              <LogOut size={18} />
              <span className="nav-text">Logout</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Soft UI Header / Breadcrumbs */}

          <div className="tab-content">
            {/* Content will be rendered here based on activeTab */}
            {activeTab === 'orders' && (
              <OrdersTab
                handleApproveClick={handleApproveClick}
                handleReject={handleReject}
              />
            )}

            {activeTab === 'nonVerified' && (
              <NonVerifiedUsersTab
                getSortIcon={getSortIcon}
              />
            )}

            {activeTab === 'existing' && (
              <ExistingCustomersTab
                getSortIcon={getSortIcon}
              />
            )}


            {activeTab === 'tree' && <BuffaloTreeTab />}

            {activeTab === 'products' && <ProductsTab />}
          </div >
        </main >

        {/* Floating + Icon at bottom left - only show on Referral tab */}
        {
          activeTab === 'nonVerified' && (
            <button
              onClick={handleCreateClick}
              style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px', // Moved to right for better UX with sidebar
                left: 'auto',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
              }}
              aria-label="Add New Referral"
            >
              +
            </button>
          )
        }

        <ReferralModal
          formData={formData}
          onInputChange={handleInputChange}
          onBlur={handleReferralMobileBlur}
          onSubmit={handleSubmit}
        />

        {/* Edit Modal */}
        <EditReferralModal
          editFormData={editFormData}
          onInputChange={handleEditInputChange}
          onBlur={handleEditReferralMobileBlur}
          onSubmit={handleEditSubmit}
        />



        <ImageNamesModal />

        <AdminDetailsModal />

      </div>
    </div>
  );
};

export default UserTabs;
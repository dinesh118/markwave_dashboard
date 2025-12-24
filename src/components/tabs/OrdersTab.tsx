import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import {
    setSearchQuery,
    setPaymentFilter,
    setStatusFilter,
    setExpandedOrderId,
    setActiveUnitIndex,
    setShowFullDetails,
    updateTrackingData,
} from '../../store/slices/ordersSlice';
import { setProofModal } from '../../store/slices/uiSlice';

interface OrdersTabProps {
    handleApproveClick: (unitId: string) => void;
    handleReject: (unitId: string) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({
    handleApproveClick,
    handleReject
}) => {
    const dispatch = useAppDispatch();

    // Redux State
    const pendingUnits = useAppSelector((state: RootState) => state.orders.pendingUnits);
    const ordersError = useAppSelector((state: RootState) => state.orders.error);
    const { searchQuery, paymentFilter, statusFilter } = useAppSelector((state: RootState) => state.orders.filters);
    const { expandedOrderId, activeUnitIndex, showFullDetails } = useAppSelector((state: RootState) => state.orders.expansion);
    const trackingData = useAppSelector((state: RootState) => state.orders.trackingData);

    // Filter Logic
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
            );
        }

        let matchesPayment = true;
        if (paymentFilter !== 'All Payments') {
            matchesPayment = tx.paymentType === paymentFilter;
        }

        let matchesStatus = true;
        if (statusFilter !== 'All Status') {
            matchesStatus = unit.paymentStatus === statusFilter;
        }

        return matchesSearch && matchesPayment && matchesStatus;
    });

    const handleViewProof = (transaction: any, investor: any) => {
        dispatch(setProofModal({ isOpen: true, data: { ...transaction, name: investor.name } }));
    };

    const handleStageUpdateLocal = (orderId: string, buffaloNum: number, nextStageId: number) => {
        const now = new Date();
        const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
        const time = now.toLocaleTimeString('en-GB');
        dispatch(updateTrackingData({ key: `${orderId}-${buffaloNum}`, stageId: nextStageId, date, time }));
    };

    const getTrackingForBuffalo = (orderId: string, buffaloNum: number, initialStatus: string) => {
        const key = `${orderId}-${buffaloNum}`;
        if (trackingData[key]) return trackingData[key];
        return { currentStageId: 1, history: { 1: { date: '24-05-2025', time: '10:30:00' } } };
    };

    const formatIndiaDate = (val: any) => {
        if (!val || (typeof val !== 'string' && typeof val !== 'number')) return String(val);
        const date = new Date(val);
        if (date instanceof Date && !isNaN(date.getTime()) && String(val).length > 10) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }
        return val;
    };

    const formatIndiaDateHeader = (val: any) => {
        if (!val || (typeof val !== 'string' && typeof val !== 'number')) return '-';
        const date = new Date(val);
        if (date instanceof Date && !isNaN(date.getTime()) && String(val).length > 10) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
        }
        return val;
    };

    return (
        <div className="orders-dashboard" style={{ marginTop: '-10px' }}>
            <h2>Live Orders </h2>
            {/* Stats Widgets */}
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => dispatch(setStatusFilter('PENDING_ADMIN_VERIFICATION'))}>
                    <div>
                        <p style={{ color: '#67748e', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 2px 0' }}>Pending Orders</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h5 style={{ color: '#344767', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                {pendingUnits.filter((u: any) => u.order?.paymentStatus === 'PENDING_PAYMENT' || u.order?.paymentStatus === 'PENDING_ADMIN_VERIFICATION').length}
                            </h5>
                            <span style={{ color: '#82d616', fontWeight: 700, fontSize: '0.75rem' }}>+15%</span>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => dispatch(setStatusFilter('PAID'))}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <p style={{ color: '#67748e', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 2px 0' }}>Approved Orders</p>
                            <h5 style={{ color: '#344767', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                {pendingUnits.filter((u: any) => u.order?.paymentStatus === 'Approved' || u.order?.paymentStatus === 'PAID').length}
                            </h5>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => dispatch(setStatusFilter('REJECTED'))}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <p style={{ color: '#67748e', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 2px 0' }}>Rejected Orders</p>
                            <h5 style={{ color: '#344767', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                {pendingUnits.filter((u: any) => u.order?.paymentStatus === 'Rejected' || u.order?.paymentStatus === 'REJECTED').length}
                            </h5>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => dispatch(setStatusFilter('All Status'))}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <p style={{ color: '#67748e', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 2px 0' }}>Total Orders</p>
                            <h5 style={{ color: '#344767', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                {pendingUnits.length}
                            </h5>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <p style={{ color: '#67748e', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 2px 0' }}>Total Units</p>
                            <h5 style={{ color: '#344767', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                {pendingUnits.reduce((acc: number, curr: any) => acc + (curr.order?.numUnits || 0), 0)}
                            </h5>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 20px 27px 0 rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <p style={{ color: '#67748e', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 2px 0' }}>Total Amount</p>
                            <h5 style={{ color: '#344767', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                                ₹{pendingUnits.reduce((acc: number, curr: any) => acc + (Number(curr.transaction?.amount) || 0), 0).toLocaleString()}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-controls" style={{ padding: '0.5rem 0', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search By User Name,Unit Id,User Mobile,Buffalo Id"
                    className="search-input"
                    style={{ width: '400px' }}
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                />

                <select
                    className="filter-select h-5"
                    value={paymentFilter}
                    onChange={(e) => dispatch(setPaymentFilter(e.target.value))}
                >
                    <option value="All Payments">All Payments</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="ONLINE_UPI">Online/UPI</option>
                </select>

                <select
                    className="filter-select h-5"
                    value={statusFilter}
                    onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                >
                    <option value="All Status">All Status</option>
                    <option value="PENDING_ADMIN_VERIFICATION">Needs Approval</option>
                    <option value="PENDING_PAYMENT">Not Paid(Draft)</option>
                    <option value="PAID">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {ordersError && (
                <div style={{ marginBottom: '0.75rem', color: '#dc2626' }}>{ordersError}</div>
            )}

            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th style={{ minWidth: '150px' }}>User Name</th>
                            <th>Status</th>
                            <th>Units</th>
                            <th>Order Id</th>
                            <th>User Mobile</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Payment Type</th>
                            <th style={{ minWidth: '200px' }}>Payment Image Proof</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUnits.length === 0 ? (
                            <tr>
                                <td colSpan={11} style={{ textAlign: 'center', color: '#888' }}>
                                    {searchQuery ? 'No matching orders found' : 'No pending orders'}
                                </td>
                            </tr>
                        ) : (
                            filteredUnits.map((entry: any, index: number) => {
                                const unit = entry.order || {};
                                const tx = entry.transaction || {};
                                const inv = entry.investor || {};
                                const isExpanded = expandedOrderId === unit.id;
                                const canExpand = ['PAID', 'Approved'].includes(unit.paymentStatus);

                                return (
                                    <React.Fragment key={unit.id || index}>
                                        <tr>
                                            <td>{index + 1}</td>
                                            <td>{inv.name}</td>
                                            <td>
                                                <span className={`status-badge ${(unit.paymentStatus === 'PENDING_ADMIN_VERIFICATION' || unit.paymentStatus === 'PENDING_PAYMENT') ? 'pending' :
                                                    unit.paymentStatus === 'PAID' ? 'approved' :
                                                        unit.paymentStatus === 'REJECTED' ? 'rejected' : ''
                                                    }`}>
                                                    {unit.paymentStatus === 'PENDING_ADMIN_VERIFICATION' ? 'PENDING_ADMIN_VERIFICATION' :
                                                        unit.paymentStatus === 'PENDING_PAYMENT' ? 'PENDING_PAYMENT' :
                                                            unit.paymentStatus || '-'}
                                                </span>
                                            </td>
                                            <td>{unit.numUnits}</td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        if (!canExpand) return;
                                                        if (isExpanded) {
                                                            dispatch(setExpandedOrderId(null));
                                                            dispatch(setActiveUnitIndex(null));
                                                            dispatch(setShowFullDetails(false));
                                                        } else {
                                                            dispatch(setExpandedOrderId(unit.id));
                                                            dispatch(setActiveUnitIndex(0));
                                                            dispatch(setShowFullDetails(false));
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: canExpand ? '#2563eb' : '#64748b',
                                                        fontWeight: '600',
                                                        cursor: canExpand ? 'pointer' : 'default',
                                                        padding: 0,
                                                        textDecoration: canExpand ? 'underline' : 'none'
                                                    }}
                                                >
                                                    {unit.id}
                                                </button>
                                            </td>
                                            <td>{inv.mobile}</td>
                                            <td>{inv.email || '-'}</td>
                                            <td>{tx.amount ?? '-'}</td>
                                            <td>{tx.paymentType || '-'}</td>
                                            <td>
                                                {unit.paymentType ? (
                                                    <button
                                                        className="view-proof-btn"
                                                        onClick={() => handleViewProof(tx, inv)}
                                                    >
                                                        Payment Proof
                                                    </button>
                                                ) : '-'}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    {unit.paymentStatus === 'PENDING_ADMIN_VERIFICATION' && (
                                                        <button
                                                            onClick={() => handleApproveClick(unit.id)}
                                                            className="action-btn approve"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {unit.paymentStatus === 'PENDING_ADMIN_VERIFICATION' && (
                                                        <button
                                                            onClick={() => handleReject(unit.id)}
                                                            className="action-btn reject"
                                                        >
                                                            Reject
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                        {isExpanded && canExpand && (
                                            <tr style={{ backgroundColor: '#f9fafb' }}>
                                                <td colSpan={11} style={{ padding: '24px' }}>
                                                    <div className="order-expand-animation" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <div style={{
                                                                backgroundColor: '#fff',
                                                                borderRadius: '12px',
                                                                border: '1px solid #e5e7eb',
                                                                overflow: 'hidden'
                                                            }}>
                                                                <div style={{
                                                                    padding: '12px 20px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    gap: '20px',
                                                                    borderBottom: showFullDetails ? '1px solid #f1f5f9' : 'none'
                                                                }}>
                                                                    <div style={{
                                                                        display: 'grid',
                                                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                                                        gap: '20px',
                                                                        flex: 1
                                                                    }}>
                                                                        {[
                                                                            { label: 'Payment Method', value: tx.paymentType || '-' },
                                                                            { label: 'Total Amount', value: `₹${tx.amount ?? '-'}` },
                                                                            { label: 'Approval Date', value: formatIndiaDateHeader(unit.updatedAt || unit.updated_at || unit.createdAt || unit.created_at || tx.updatedAt || tx.updated_at || tx.createdAt || tx.created_at || unit.paymentApprovedAt || tx.receipt_date || unit.date || tx.date || unit.approved_at || unit.approvedAt || tx.approved_at || tx.approvedAt || unit.order_date || tx.payment_date) },
                                                                            { label: 'Payment Mode', value: tx.paymentType || 'MANUAL_PAYMENT' },
                                                                            { label: 'Breed ID', value: unit.breedId || 'MURRAH-001' }
                                                                        ].map((item, idx) => (
                                                                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                                                                                <div style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>{item.value}</div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => dispatch(setShowFullDetails(!showFullDetails))}
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                            fontSize: '14px',
                                                                            color: '#94a3b8',
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            padding: '4px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            transition: 'transform 0.2s ease',
                                                                            transform: showFullDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                            lineHeight: 1
                                                                        }}
                                                                    >
                                                                        ∨
                                                                    </button>
                                                                </div>

                                                                {showFullDetails && (
                                                                    <div className="order-expand-animation" style={{
                                                                        padding: '0 20px 20px 20px',
                                                                        display: 'grid',
                                                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                                                        gap: '20px'
                                                                    }}>
                                                                        {(() => {
                                                                            const excludedKeys = ['id', 'name', 'mobile', 'email', 'amount', 'paymentType', 'paymentStatus', 'numUnits', 'order', 'transaction', 'investor', 'password', 'token', 'images', 'cpfUnitCost', 'unitCost', 'base_unit_cost', 'baseUnitCost', 'cpf_unit_cost', 'unit_cost', 'otp', 'first_name', 'last_name', 'otp_verified', 'otp_created_at', 'is_form_filled', 'occupation', 'updatedAt', 'updated_at', 'createdAt', 'created_at', 'breedId', 'breed_id', 'paymentApprovedAt', 'receipt_date', 'date', 'approved_at', 'approvedAt', 'order_date', 'payment_date'];
                                                                            const combinedData = { ...unit, ...tx, ...inv };

                                                                            return Object.entries(combinedData)
                                                                                .filter(([key, value]) => {
                                                                                    const isExcluded = excludedKeys.includes(key);
                                                                                    const lowerKey = key.toLowerCase();
                                                                                    const isUrlKey = lowerKey.includes('url') || lowerKey.includes('link') || lowerKey.includes('proof') || lowerKey.includes('image');
                                                                                    const isUrlValue = typeof value === 'string' && (value.startsWith('http') || value.startsWith('/api/'));
                                                                                    return !isExcluded && !isUrlKey && !isUrlValue && value !== null && value !== undefined && typeof value !== 'object';
                                                                                })
                                                                                .map(([key, value], idx) => (
                                                                                    <div key={`extra-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                                                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                                            {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                                                                                        </div>
                                                                                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>{formatIndiaDate(value)}</div>
                                                                                    </div>
                                                                                ));
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '24px', minHeight: '300px' }}>
                                                            <div style={{ width: '240px', flexShrink: 0, borderRight: '1px solid #f1f5f9', paddingRight: '20px' }}>
                                                                <div style={{ fontWeight: '700', color: '#111827', fontSize: '14px', marginBottom: '16px' }}>Select Unit</div>
                                                                <div className="units-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '450px', overflowY: 'auto', paddingRight: '4px' }}>
                                                                    {Array.from({ length: unit.numUnits || 0 }).map((_, i) => (
                                                                        <button
                                                                            key={i}
                                                                            onClick={() => dispatch(setActiveUnitIndex(activeUnitIndex === i ? null : i))}
                                                                            style={{
                                                                                width: '100%',
                                                                                padding: '12px 16px',
                                                                                borderRadius: '10px',
                                                                                border: '1px solid',
                                                                                borderColor: activeUnitIndex === i ? '#2563eb' : '#e5e7eb',
                                                                                backgroundColor: activeUnitIndex === i ? '#eff6ff' : '#fff',
                                                                                color: activeUnitIndex === i ? '#2563eb' : '#4b5563',
                                                                                fontWeight: '600',
                                                                                fontSize: '13px',
                                                                                cursor: 'pointer',
                                                                                textAlign: 'left',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'space-between',
                                                                                transition: 'all 0.2s',
                                                                                boxShadow: activeUnitIndex === i ? '0 4px 6px -1px rgba(37, 99, 235, 0.1)' : 'none'
                                                                            }}
                                                                        >
                                                                            <span>Unit {i + 1}</span>
                                                                            <span style={{ fontSize: '10px', opacity: 0.7 }}>{unit.breedId || 'MURRAH-001'}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div style={{ flex: 1 }}>
                                                                {activeUnitIndex !== null ? (
                                                                    <div className="order-expand-animation" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                                                                        {[1, 2].map((buffaloNum) => {
                                                                            const tracker = trackingData[`${unit.id}-${buffaloNum}`] || getTrackingForBuffalo(unit.id, buffaloNum, unit.paymentStatus);
                                                                            const currentStageId = tracker.currentStageId;

                                                                            const timelineStages = [
                                                                                { id: 1, label: 'Order Placed' },
                                                                                { id: 2, label: 'Payment Pending' },
                                                                                { id: 3, label: 'Order Confirm' },
                                                                                { id: 4, label: 'Order Approved' },
                                                                                { id: 5, label: 'Order in Market' },
                                                                                { id: 6, label: 'Order in Quarantine' },
                                                                                { id: 7, label: 'In Transit' },
                                                                                { id: 8, label: 'Order Delivered' }
                                                                            ];

                                                                            return (
                                                                                <div key={buffaloNum} style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                                                                    <div style={{ fontWeight: '700', color: '#111827', fontSize: '15px', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                                                                                        Buffalo {buffaloNum} Progress
                                                                                    </div>

                                                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                        {timelineStages.map((stage, idx) => {
                                                                                            const isLast = idx === timelineStages.length - 1;
                                                                                            const isStepCompleted = stage.id < currentStageId;
                                                                                            const isCurrent = stage.id === currentStageId;
                                                                                            const stageDate = tracker.history[stage.id]?.date || '-';
                                                                                            const stageTime = tracker.history[stage.id]?.time || '-';

                                                                                            return (
                                                                                                <div key={stage.id} style={{ display: 'flex', minHeight: '80px', position: 'relative' }}>
                                                                                                    <div style={{ width: '90px', paddingRight: '16px', textAlign: 'right', paddingTop: '4px' }}>
                                                                                                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>{stageDate}</div>
                                                                                                    </div>

                                                                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px', position: 'relative' }}>
                                                                                                        {!isLast && (
                                                                                                            <div style={{
                                                                                                                position: 'absolute', top: '24px', bottom: '-4px', width: '2px',
                                                                                                                backgroundColor: isStepCompleted ? '#10b981' : '#e2e8f0',
                                                                                                                zIndex: 1
                                                                                                            }} />
                                                                                                        )}
                                                                                                        <div style={{
                                                                                                            width: '24px', height: '24px', borderRadius: '50%',
                                                                                                            backgroundColor: isStepCompleted ? '#10b981' : (isCurrent ? '#3b82f6' : '#fff'),
                                                                                                            border: `2px solid ${isStepCompleted ? '#10b981' : (isCurrent ? '#3b82f6' : '#e2e8f0')}`,
                                                                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                                                            color: isStepCompleted || isCurrent ? 'white' : '#9ca3af',
                                                                                                            fontSize: '12px', fontWeight: 'bold', zIndex: 2,
                                                                                                            flexShrink: 0
                                                                                                        }}>
                                                                                                            {isStepCompleted ? '✓' : stage.id}
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    <div style={{ flex: 1, paddingBottom: isLast ? '0' : '24px' }}>
                                                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                                                                                            <div style={{
                                                                                                                fontSize: '14px', fontWeight: '700',
                                                                                                                color: isStepCompleted ? '#10b981' : (isCurrent ? '#3b82f6' : '#9ca3af')
                                                                                                            }}>
                                                                                                                {stage.label}
                                                                                                            </div>

                                                                                                            {isCurrent && (
                                                                                                                <button
                                                                                                                    style={{
                                                                                                                        padding: '4px 12px',
                                                                                                                        borderRadius: '6px',
                                                                                                                        border: 'none',
                                                                                                                        background: '#2563eb',
                                                                                                                        color: '#fff',
                                                                                                                        fontSize: '11px',
                                                                                                                        fontWeight: '600',
                                                                                                                        cursor: 'pointer',
                                                                                                                        transition: 'all 0.2s',
                                                                                                                        whiteSpace: 'nowrap',
                                                                                                                        marginLeft: '12px'
                                                                                                                    }}
                                                                                                                    onClick={() => handleStageUpdateLocal(unit.id, buffaloNum, stage.id + 1)}
                                                                                                                >
                                                                                                                    {stage.id === 8 ? 'Confirm Delivery' : 'Update'}
                                                                                                                </button>
                                                                                                            )}

                                                                                                            {isStepCompleted && (
                                                                                                                <span style={{
                                                                                                                    padding: '4px 12px',
                                                                                                                    borderRadius: '6px',
                                                                                                                    background: '#dcfce7',
                                                                                                                    color: '#166534',
                                                                                                                    fontSize: '11px',
                                                                                                                    fontWeight: '600',
                                                                                                                    marginLeft: '12px'
                                                                                                                }}>
                                                                                                                    {stage.id === 8 ? 'Delivered' : 'Completed'}
                                                                                                                </span>
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                                                                                            {stageTime !== '-' ? stageTime : ''}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            );
                                                                                        })}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '14px', border: '2px dashed #e2e8f0', borderRadius: '16px' }}>
                                                                        Select a unit to see tracking progress
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTab;

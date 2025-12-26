import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import {
    setExpandedOrderId,
    setActiveUnitIndex,
    setShowFullDetails,
    updateTrackingData
} from '../../store/slices/ordersSlice';
import { setProofModal } from '../../store/slices/uiSlice';

const TrackingTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const { pendingUnits, trackingData, expansion } = useAppSelector((state: RootState) => state.orders);
    const { expandedOrderId, activeUnitIndex, showFullDetails } = expansion;
    const [searchQuery, setSearchQuery] = useState('');

    // Filter for PAID or Approved orders
    const approvedOrders = pendingUnits.filter((entry: any) => {
        const status = entry.order?.paymentStatus;
        const isPaidOrApproved = status === 'PAID' || status === 'Approved';

        if (!isPaidOrApproved) return false;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const orderId = entry.order?.id ? String(entry.order.id).toLowerCase() : '';
            const investorName = entry.investor?.name ? String(entry.investor.name).toLowerCase() : '';
            return orderId.includes(query) || investorName.includes(query);
        }

        return true;
    });

    const handleStageUpdateLocal = (orderId: string, buffaloNum: number, nextStageId: number) => {
        const now = new Date();
        const date = now.toLocaleDateString('en-GB').replace(/\//g, '-');
        const time = now.toLocaleTimeString('en-GB');
        // In a real app this would likely be an API call
        dispatch(updateTrackingData({ key: `${orderId}-${buffaloNum}`, stageId: nextStageId, date, time }));
    };

    const getTrackingForBuffalo = (orderId: string, buffaloNum: number, initialStatus: string) => {
        const key = `${orderId}-${buffaloNum}`;
        if (trackingData[key]) return trackingData[key];
        return { currentStageId: 1, history: { 1: { date: '24-05-2025', time: '10:30:00' } } };
    };

    const formatIndiaDateHeader = (val: any) => {
        if (!val || (typeof val !== 'string' && typeof val !== 'number')) return String(val || '-');
        const date = new Date(val);
        if (date instanceof Date && !isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        return String(val);
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
        return String(val);
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#1f2937' }}>Tracking Orders</h2>
                <input
                    type="text"
                    placeholder="Search By Order ID, Investor Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '300px',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        outline: 'none',
                        fontSize: '0.9rem',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    }}
                />
            </div>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                                <th style={{ padding: '16px 24px', color: '#9ca3af', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>S.No</th>
                                <th style={{ padding: '16px 24px', color: '#9ca3af', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>User Name</th>
                                <th style={{ padding: '16px 24px', color: '#9ca3af', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', color: '#9ca3af', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Units</th>
                                <th style={{ padding: '16px 24px', color: '#9ca3af', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' }}>Order ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                                        No approved orders found.
                                    </td>
                                </tr>
                            ) : (
                                approvedOrders.map((entry: any, index: number) => {
                                    const { order, investor, transaction: tx } = entry;
                                    const unit = order || {};
                                    const isExpanded = expandedOrderId === unit.id;

                                    return (
                                        <React.Fragment key={`${order.id}-${index}`}>
                                            <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '16px 24px', color: '#374151', fontWeight: 500 }}>{index + 1}</td>
                                                <td style={{ padding: '16px 24px', color: '#374151', fontWeight: 600 }}>{investor?.name || 'N/A'}</td>
                                                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                                    <span style={{
                                                        border: '1px solid #34d399',
                                                        background: '#ecfdf5',
                                                        color: '#047857',
                                                        borderRadius: '9999px',
                                                        padding: '4px 12px',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        whiteSpace: 'nowrap',
                                                        display: 'inline-block'
                                                    }}>
                                                        Approved
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 24px', color: '#374151', fontWeight: 600 }}>{order.numUnits}</td>
                                                <td style={{ padding: '16px 24px' }}>
                                                    <button
                                                        onClick={() => {
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
                                                            color: '#2563eb',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            padding: 0
                                                        }}>
                                                        {order.id}
                                                    </button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                                    <td colSpan={5} style={{ padding: '24px' }}>
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
                                                                                { label: 'Payment Method', value: tx?.paymentType || '-' },
                                                                                { label: 'Total Amount', value: `₹${tx?.amount ?? '-'}` },
                                                                                { label: 'Approval Date', value: formatIndiaDateHeader(unit.updatedAt || unit.updated_at || unit.paymentApprovedAt || tx?.payment_date) },
                                                                                { label: 'Payment Mode', value: tx?.paymentType || 'MANUAL_PAYMENT' },
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
                                                                                const combinedData = { ...unit, ...tx, ...investor };

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
        </div>
    );
};

export default TrackingTab;

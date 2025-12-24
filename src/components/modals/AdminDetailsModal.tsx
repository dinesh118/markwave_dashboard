import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { setShowAdminDetails } from '../../store/slices/uiSlice';

interface AdminDetailsModalProps { }

const AdminDetailsModal: React.FC<AdminDetailsModalProps> = () => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state: RootState) => state.ui.showAdminDetails);
    const { adminName, adminMobile, adminRole, lastLogin, presentLogin } = useAppSelector((state: RootState) => state.auth);

    const onClose = () => {
        dispatch(setShowAdminDetails(false));
    };
    if (!isOpen) return null;

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1999, background: 'transparent' }}>
            <div
                className="admin-popover"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    zIndex: 2000,
                    padding: '1.25rem'
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.25rem',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        lineHeight: 1
                    }}
                >
                    ×
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5',
                        fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        {adminName.charAt(0)}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <h2 style={{ margin: '0', fontSize: '1rem', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</h2>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{adminMobile}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Role</div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>{adminRole}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Last Login</div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>{lastLogin || 'N/A'}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '2px' }}>Present Login</div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>{presentLogin || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailsModal;

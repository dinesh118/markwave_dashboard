import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { setReferralModalOpen } from '../../store/slices/uiSlice';

interface ReferralModalProps {
    formData: {
        mobile: string;
        first_name: string;
        last_name: string;
        refered_by_mobile: string;
        refered_by_name: string;
        role: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({
    formData,
    onInputChange,
    onBlur,
    onSubmit
}) => {
    const dispatch = useAppDispatch();
    const showModal = useAppSelector((state: RootState) => state.ui.modals.referral);

    const onClose = () => {
        dispatch(setReferralModalOpen(false));
    };

    const modalStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#ffffff',
        boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)',
        transform: showModal ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1050,
        display: 'flex',
        flexDirection: 'column'
    };

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        opacity: showModal ? 1 : 0,
        visibility: showModal ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease-in-out',
        zIndex: 1040
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1040, visibility: showModal ? 'visible' : 'hidden' }}>
            <div style={overlayStyle} onClick={onClose} />

            <div style={modalStyle}>
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Add New Referral</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Create a user to track their orders</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <span style={{ fontSize: '24px', lineHeight: 1 }}>×</span>
                    </button>
                </div>

                {/* Form Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                Role
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={onInputChange}
                                required
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f9fafb', color: '#1f2937' }}
                            >
                                <option value="Investor">Investor</option>
                                <option value="Admin">Admin</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={onInputChange}
                                required
                                placeholder="Enter mobile number"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f9fafb', color: '#1f2937' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={onInputChange}
                                    required
                                    placeholder="First Name"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f9fafb', color: '#1f2937' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={onInputChange}
                                    required
                                    placeholder="Last Name"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f9fafb', color: '#1f2937' }}
                                />
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '24px', marginTop: '8px' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Referrer Details</h4>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Referrer Mobile
                                </label>
                                <input
                                    type="tel"
                                    name="refered_by_mobile"
                                    value={formData.refered_by_mobile}
                                    onChange={onInputChange}
                                    onBlur={onBlur}
                                    required
                                    placeholder="Enter referrer's mobile"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f9fafb', color: '#1f2937' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                    Referrer Name
                                </label>
                                <input
                                    type="text"
                                    name="refered_by_name"
                                    value={formData.refered_by_name}
                                    onChange={onInputChange}
                                    required
                                    placeholder="Enter referrer's name"
                                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '0.95rem', outline: 'none', backgroundColor: '#f9fafb', color: '#1f2937' }}
                                />
                            </div>
                        </div>

                        {/* Footer Actions (Inside Form to Submit) */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '24px' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                            >
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReferralModal;

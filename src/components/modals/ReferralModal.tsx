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
    if (!showModal) return null;

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.color = '#374151';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#9ca3af';
                    }}
                >
                    ×
                </button>
                <h3>Add New Referral</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        Role:
                        <select
                            name="role"
                            value={formData.role}
                            onChange={onInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="Investor">Investor</option>
                            <option value="Admin">Admin</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Employee">Employee</option>
                        </select>
                    </label>
                    <label>
                        Mobile:
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={onInputChange}
                            required
                            placeholder="Enter mobile number"
                        />
                    </label>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={onInputChange}
                            required
                            placeholder="Enter first name"
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={onInputChange}
                            required
                            placeholder="Enter last name"
                        />
                    </label>
                    <label>
                        Referral(Mobile):
                        <input
                            type="tel"
                            name="refered_by_mobile"
                            value={formData.refered_by_mobile}
                            onChange={onInputChange}
                            onBlur={onBlur}
                            required={formData.role === 'Investor'}
                            placeholder="Enter referrer's mobile"
                        />
                    </label>
                    <label>
                        Referral(Name):
                        <input
                            type="text"
                            name="refered_by_name"
                            value={formData.refered_by_name}
                            onChange={onInputChange}
                            required={formData.role === 'Investor'}
                            placeholder="Enter referrer's name"
                        />
                    </label>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default ReferralModal;

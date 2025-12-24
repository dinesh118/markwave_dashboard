import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { setEditReferralModal } from '../../store/slices/uiSlice';

interface EditReferralModalProps {
    editFormData: {
        mobile: string;
        first_name: string;
        last_name: string;
        refered_by_mobile: string;
        refered_by_name: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

const EditReferralModal: React.FC<EditReferralModalProps> = ({
    editFormData,
    onInputChange,
    onBlur,
    onSubmit
}) => {
    const dispatch = useAppDispatch();
    const { isOpen: showEditModal, user: editingUser } = useAppSelector((state: RootState) => state.ui.modals.editReferral);

    const onClose = () => {
        dispatch(setEditReferralModal({ isOpen: false }));
    };
    if (!showEditModal || !editingUser) return null;

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
                <h3>Edit Referral</h3>
                <form onSubmit={onSubmit}>
                    <label>
                        Mobile:
                        <input
                            type="tel"
                            name="mobile"
                            value={editFormData.mobile}
                            disabled
                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                            placeholder="Mobile number (cannot be changed)"
                        />
                    </label>
                    <label>
                        Role:
                        <input
                            type="text"
                            name="role"
                            value={editingUser.role || 'Investor'}
                            disabled
                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                        />
                    </label>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="first_name"
                            value={editFormData.first_name}
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
                            value={editFormData.last_name}
                            onChange={onInputChange}
                            required
                            placeholder="Enter last name"
                        />
                    </label>
                    <label>
                        Referred By(Mobile):
                        <input
                            type="tel"
                            name="refered_by_mobile"
                            value={editFormData.refered_by_mobile}
                            onChange={onInputChange}
                            onBlur={onBlur}
                            required
                            placeholder="Enter referrer's mobile"
                        />
                    </label>
                    <label>
                        Referred By(Name):
                        <input
                            type="text"
                            name="refered_by_name"
                            value={editFormData.refered_by_name}
                            onChange={onInputChange}
                            required
                            placeholder="Enter referrer's name"
                        />
                    </label>
                    <button type="submit">Update</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditReferralModal;

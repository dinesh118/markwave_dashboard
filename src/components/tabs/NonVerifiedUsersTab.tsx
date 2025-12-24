import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { useTableSortAndSearch } from '../../hooks/useTableSortAndSearch';
import { setEditReferralModal } from '../../store/slices/uiSlice';

interface NonVerifiedUsersTabProps {
    getSortIcon: (key: string, currentSortConfig: any) => string;
}

const NonVerifiedUsersTab: React.FC<NonVerifiedUsersTabProps> = ({
    getSortIcon
}) => {
    const dispatch = useAppDispatch();
    const referralUsers = useAppSelector((state: RootState) => state.users.referralUsers);

    const {
        filteredData: filteredReferrals,
        requestSort: requestReferralSort,
        sortConfig: referralSortConfig
    } = useTableSortAndSearch(referralUsers);

    const handleRowClick = (user: any) => {
        dispatch(setEditReferralModal({ isOpen: true, user }));
    };
    return (
        <div>
            <h2>User Referrals</h2>

            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestReferralSort('first_name')}>First Name {getSortIcon('first_name', referralSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestReferralSort('last_name')}>Last Name {getSortIcon('last_name', referralSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestReferralSort('mobile')}>Mobile {getSortIcon('mobile', referralSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestReferralSort('refered_by_name')}>Referred By {getSortIcon('refered_by_name', referralSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestReferralSort('refered_by_mobile')}>Referrer Mobile {getSortIcon('refered_by_mobile', referralSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestReferralSort('verified')}>Verified {getSortIcon('verified', referralSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReferrals.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No users found</td>
                            </tr>
                        ) : (
                            filteredReferrals.map((user: any, index: number) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{user.first_name || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.last_name || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.mobile}</td>
                                    <td style={{ textAlign: 'center' }}>{user.refered_by_name || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.refered_by_mobile || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.verified ? 'Yes' : 'No'}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button
                                            onClick={() => handleRowClick(user)}
                                            style={{
                                                padding: '4px 8px',
                                                background: '#3b82f6',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NonVerifiedUsersTab;

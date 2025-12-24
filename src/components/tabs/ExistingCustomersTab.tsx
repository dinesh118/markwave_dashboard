import React from 'react';
import { useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { useTableSortAndSearch } from '../../hooks/useTableSortAndSearch';

interface ExistingCustomersTabProps {
    getSortIcon: (key: string, currentSortConfig: any) => string;
}

const ExistingCustomersTab: React.FC<ExistingCustomersTabProps> = ({
    getSortIcon
}) => {
    const existingCustomers = useAppSelector((state: RootState) => state.users.existingCustomers);

    const {
        filteredData: filteredExistingUsers,
        requestSort: requestExistingUsersSort,
        sortConfig: existingUsersSortConfig
    } = useTableSortAndSearch(existingCustomers);
    return (
        <div>
            <h2>Investors</h2>

            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestExistingUsersSort('first_name')}>First Name {getSortIcon('first_name', existingUsersSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestExistingUsersSort('last_name')}>Last Name {getSortIcon('last_name', existingUsersSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestExistingUsersSort('mobile')}>Mobile {getSortIcon('mobile', existingUsersSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestExistingUsersSort('isFormFilled')}>Form Filled {getSortIcon('isFormFilled', existingUsersSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestExistingUsersSort('refered_by_name')}>Referred By {getSortIcon('refered_by_name', existingUsersSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestExistingUsersSort('refered_by_mobile')}>Referrer Mobile {getSortIcon('refered_by_mobile', existingUsersSortConfig)}</th>
                            <th style={{ whiteSpace: 'nowrap', cursor: 'pointer', textAlign: 'center' }} onClick={() => requestExistingUsersSort('verified')}>Verified {getSortIcon('verified', existingUsersSortConfig)}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExistingUsers.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', color: '#888' }}>No users found</td>
                            </tr>
                        ) : (
                            filteredExistingUsers.map((user: any, index: number) => (
                                <tr key={index}>
                                    <td style={{ textAlign: 'center' }}>{user.first_name || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.last_name || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.mobile}</td>
                                    <td style={{ textAlign: 'center' }}>{user.isFormFilled ? 'Yes' : 'No'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.refered_by_name || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.refered_by_mobile || '-'}</td>
                                    <td style={{ textAlign: 'center' }}>{user.verified ? 'Yes' : 'No'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExistingCustomersTab;

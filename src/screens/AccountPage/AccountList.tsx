// AccountList.js
import React, {useEffect} from 'react';
import { AppDispatch, RootState } from 'store';
import { useDispatch, useSelector } from 'react-redux';
import AccountListTable from './AccountListTable';
import { Account, fetchAccounts } from 'features/account/accountSlice';

const AccountList = () => {
  const accounts: Account[] = useSelector((state: RootState) => state.account.accounts);

  return (
    <div>
      <h2>List of Accounts</h2>
      <div>
      
        {/* <AccountListTable accounts={accounts} /> */}
      
    </div>
    </div>
  );
};

export default AccountList;

// AccountListPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddAccountButton from './AddAccountButton';
import { AppDispatch, RootState } from 'store';
import { fetchAccounts, addAccount, Account } from 'features/account/accountSlice';
import AccountListTable from './AccountListTable';

const AccountPage = () => {
   // Assuming you have stored accounts data in Redux store
   const accounts: Account[] = useSelector((state: RootState) => state.account.accounts);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchAccounts action
    dispatch(fetchAccounts());
  }, [dispatch]);

  return (
    <div>
      
      <h1>Account List</h1>
      <AddAccountButton />
      <AccountListTable accounts={accounts} />
    </div>
  );
};

export default AccountPage;

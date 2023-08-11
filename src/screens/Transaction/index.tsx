import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddTransactionForm from './AddTransactionForm'; // Assuming you have a component for adding transactions
import { AppDispatch, RootState } from 'store';
import { fetchTransactions, Transaction } from 'features/transaction/transactionSlice'; // Assuming you have the relevant actions and types for transactions

import { Button, Drawer, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import TransactionListTable from './TransactionListTable';
import { fetchAccounts } from 'features/account/accountSlice';

const TransactionPage: React.FC = () => {
  // Assuming you have stored Transactions data in Redux store
  const transactions: Transaction[] = useSelector((state: RootState) => state.transaction.transactions);
  const loading = useSelector((state: RootState) => state.transaction.loading);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchTransactions action
    dispatch(fetchTransactions());
    dispatch(fetchAccounts());
  }, [dispatch]);

  return (
    <div>
      <h1>Transaction List</h1>
      <AddTransactionForm />
      <TransactionListTable transactions={transactions} />
    </div>
  );
};

export default TransactionPage;

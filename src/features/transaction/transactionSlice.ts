import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from 'types'; // Assuming you have a custom AppThunk type
import { apiEndpoints } from 'api';
import { RootState } from 'store';

export interface Transaction {
  id: string;
  debit_ac: string | null;
  credit_ac: string | null;
  amount: number | null;
  desc: string | null;
  date: string | null;
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

interface DeleteTransactionAction {
  type: 'transaction/deleteTransaction';
  payload: string;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteTransaction: (
      state: TransactionState,
      action: DeleteTransactionAction
    ) => {
      const transactionId = action.payload;
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== transactionId
      );
      state.loading = false;
    },
  },
});

export const { setTransactions, setLoading, setError, deleteTransaction } =
  transactionSlice.actions;

export default transactionSlice.reducer;

// Thunk to fetch transactions from API
export const fetchTransactions = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Transaction[]>(
      apiEndpoints.fetchTransactions
    ); // Replace with your actual API endpoint
    dispatch(setTransactions(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch transactions'));
  }
};

export const addTransaction =
  (newTransaction: Transaction): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<Transaction>(
        apiEndpoints.createTransaction,
        newTransaction
      ); // Replace with your actual API endpoint
      const updatedTransactions = [
        ...getState().transaction.transactions,
        response.data,
      ];
      dispatch(setTransactions(updatedTransactions));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || 'Failed to add transaction'));
      dispatch(setLoading(false));
      throw error;
    }
  };

export const deleteTransactionFromAPI =
  (transactionId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(apiEndpoints.deleteTransaction(transactionId)); // Replace with your actual API endpoint
      dispatch(deleteTransaction(transactionId)); // Dispatch the deleteTransaction action to update the state
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || 'Failed to delete transaction'));
      throw error;
    }
  };

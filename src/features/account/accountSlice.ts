// src/features/account/accountSlice.ts

import {
  createSlice,
  PayloadAction,
  AnyAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "types"; // Assuming you have a custom AppThunk type
import { apiEndpoints } from "api";
import { RootState } from "/store";

export interface Account {
  id: string;
  name: string;
  type: string;
}

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}
interface DeleteAccountAction {
  type: "account/deleteAccount";
  payload: string; // The ID of the account to delete
}
const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
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
    deleteAccount: (state: AccountState, action: DeleteAccountAction) => {
      const accountId = action.payload;
      state.accounts = state.accounts.filter(
        (account) => account.id !== accountId
      );
    },
  },
});

export const { setAccounts, setLoading, setError, deleteAccount } =
  accountSlice.actions;

export default accountSlice.reducer;

// Thunk to fetch accounts from API
export const fetchAccounts = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Account[]>(apiEndpoints.fetchAccounts); // Replace with your actual API endpoint
    dispatch(setAccounts(response.data));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch accounts"));
  }
};

export const addAccount =
  (newAccount: Account): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<Account>(
        apiEndpoints.createAccount,
        newAccount
      ); // Replace with your actual API endpoint
      const updatedAccounts = [...getState().account.accounts, response.data];
      dispatch(setAccounts(updatedAccounts));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to add account"));
      throw error;
    }
  };

export const deleteAccountFromAPI =
  (accountId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(apiEndpoints.deleteAccount(accountId)); // Replace with your actual API endpoint
      dispatch(deleteAccount(accountId)); // Dispatch the deleteAccount action to update the state
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to delete account"));
      throw error;
    }
  };

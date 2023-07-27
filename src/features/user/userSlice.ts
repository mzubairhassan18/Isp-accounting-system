// src/features/account/accountSlice.ts

import { createSlice, PayloadAction, AnyAction, ThunkAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from 'types'; // Assuming you have a custom AppThunk type
import { apiEndpoints } from 'api';
import { RootState } from '@/store';

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: number | null;
  address: string | null;
  cnic: number | null;
  password: string | null;
  role_id: number | null;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}
interface DeleteUserAction {
  type: 'user/deleteUser';
  payload: string; 
}
const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
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
    deleteUser: (state: UserState, action: DeleteUserAction) => {
      const userId = action.payload;
      state.users = state.users.filter((user) => user.id !== userId);
    }
  },
});

export const { setUsers, setLoading, setError, deleteUser } = userSlice.actions;

export default userSlice.reducer;

// Thunk to fetch accounts from API
export const fetchUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<User[]>(apiEndpoints.fetchUsers); // Replace with your actual API endpoint
    dispatch(setUsers(response.data));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch accounts'));
  }
};

export const addUser = (newUser: User): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post<User>(apiEndpoints.createUser, newUser); // Replace with your actual API endpoint
    const updatedUsers = [...getState().user.users, response.data];
    dispatch(setUsers(updatedUsers));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to add account'));
    throw error;
  }
};

export const deleteUserFromAPI = (userId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.delete(apiEndpoints.deleteAccount(userId)); // Replace with your actual API endpoint
    dispatch(deleteUser(userId)); // Dispatch the deleteAccount action to update the state
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to delete account'));
    throw error;
  }
};
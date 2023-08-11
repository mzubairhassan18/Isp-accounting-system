// src/features/account/accountSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "types"; // Assuming you have a custom AppThunk type
import { apiEndpoints } from "api";
import { RootState } from "/store";

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  phone: number | null;
  address: string | null;
  cnic: number | null;
  password: string | null;
  active: number | null;
  fee: number | null;
  pay_date: number | null;
  created_at: Date | null;
  modified_at: Date | null;
  supervisor: string | null;
  intial_charges: number | null;
  package_id: string | null;
  comp_id: string | null;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface DeleteUserAction {
  type: "user/deleteUser";
  payload: string;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
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
    },
  },
});

export const { setUsers, setLoading, setError, deleteUser } = userSlice.actions;

export default userSlice.reducer;

// Thunk to fetch users from API
export const fetchUsers = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<User[]>(apiEndpoints.fetchUsers); // Replace with your actual API endpoint
    dispatch(setUsers(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch users"));
  }
};

export const addUser =
  (newUser: User): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<User>(apiEndpoints.createUser, newUser); // Replace with your actual API endpoint
      const updatedUsers = [...getState().user.users, response.data];
      dispatch(setUsers(updatedUsers));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError("Failed to add user"));
      throw error;
    }
  };

export const deleteUserFromAPI =
  (userId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(apiEndpoints.deleteUser(userId)); // Replace with your actual API endpoint
      dispatch(deleteUser(userId)); // Dispatch the deleteUser action to update the state
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to delete user"));
      throw error;
    }
  };

export const checkUsernameAvailability =
  (userName: string): AppThunk<any> =>
  async (dispatch) => {
    try {
      // dispatch(setLoading(true));
      console.log("checkUsername Availblity 1");
      const response = await axios.get(
        apiEndpoints.checkUsernameAvailability(userName)
      ); // Replace with your actual API endpoint
      // dispatch(setLoading(false));
      console.log("checkUsername Availblity", response);
      return response.data;
    } catch (error) {
      dispatch(setError(error.message));
      throw error;
    }
  };

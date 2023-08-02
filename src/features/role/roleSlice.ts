// src/features/role/roleSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from 'types'; // Assuming you have a custom AppThunk type
import { apiEndpoints } from 'api';
import { RootState } from '@/store';

export interface Role {
  id: string;
  name: string;
  permissions: string;
}

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

interface DeleteRoleAction {
  type: 'role/deleteRole';
  payload: string;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
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
    deleteRole: (state: RoleState, action: DeleteRoleAction) => {
      const roleId = action.payload;
      state.roles = state.roles.filter((role) => role.id !== roleId);
      state.loading = false;
    },
  },
});

export const { setRoles, setLoading, setError, deleteRole } = roleSlice.actions;

export default roleSlice.reducer;

// Thunk to fetch roles from API
export const fetchRoles = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Role[]>(apiEndpoints.fetchRoles); // Replace with your actual API endpoint
    dispatch(setRoles(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch roles'));
  }
};

export const addRole = (newRole: Role): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post<Role>(apiEndpoints.createRole, newRole); // Replace with your actual API endpoint
    const updatedRoles = [...getState().role.roles, response.data];
    dispatch(setRoles(updatedRoles));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to add role'));
    dispatch(setLoading(false));
    throw error;
  }
};

export const deleteRoleFromAPI = (roleId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.delete(apiEndpoints.deleteRole(roleId)); // Replace with your actual API endpoint
    dispatch(deleteRole(roleId)); // Dispatch the deleteRole action to update the state
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to delete role'));
    throw error;
  }
};

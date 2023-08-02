import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from 'types'; // Assuming you have a custom AppThunk type
import { apiEndpoints } from 'api';

export interface Package {
  id: string;
  name: string;
  active: boolean;
  purchase_price: number;
  sale_price: number;
  details: string;
  last_edited: Date;
}

interface PackageState {
  packages: Package[];
  loading: boolean;
  error: string | null;
}

interface DeletePackageAction {
  type: 'package/deletePackage';
  payload: string;
}

const initialState: PackageState = {
  packages: [],
  loading: false,
  error: null,
};

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    setPackages: (state, action: PayloadAction<Package[]>) => {
      state.packages = action.payload;
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
    deletePackage: (state: PackageState, action: DeletePackageAction) => {
      const packageId = action.payload;
      state.packages = state.packages.filter((pkg) => pkg.id !== packageId);
      state.loading = false;
    },
  },
});

export const { setPackages, setLoading, setError, deletePackage } = packageSlice.actions;

export default packageSlice.reducer;

// Thunk to fetch packages from API
export const fetchPackages = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Package[]>(apiEndpoints.fetchPackages); // Replace with your actual API endpoint
    dispatch(setPackages(response.data));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch packages'));
  }
};

export const addPackage = (newPackage: Package): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post<Package>(apiEndpoints.createPackage, newPackage); // Replace with your actual API endpoint
    const updatedPackages = [...getState().package.packages, response.data];
    dispatch(setPackages(updatedPackages));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to add package'));
    dispatch(setLoading(false));
    throw error;
  }
};

export const deletePackageFromAPI = (packageId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await axios.delete(apiEndpoints.deletePackage(packageId)); // Replace with your actual API endpoint
    dispatch(deletePackage(packageId)); // Dispatch the deletePackage action to update the state
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to delete package'));
    throw error;
  }
};

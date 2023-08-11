import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "types"; // Assuming you have a custom AppThunk type
import { apiEndpoints } from "api";
import { RootState } from "/store";

export interface Vendor {
  id: string;
  name: string | null;
  address: string | null;
}

interface VendorState {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
}

interface DeleteVendorAction {
  type: "vendor/deleteVendor";
  payload: string;
}

const initialState: VendorState = {
  vendors: [],
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<Vendor[]>) => {
      state.vendors = action.payload;
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
    deleteVendor: (state: VendorState, action: DeleteVendorAction) => {
      const vendorId = action.payload;
      state.vendors = state.vendors.filter((vendor) => vendor.id !== vendorId);
      state.loading = false;
    },
  },
});

export const { setVendors, setLoading, setError, deleteVendor } =
  vendorSlice.actions;

export default vendorSlice.reducer;

// Thunk to fetch vendors from API
export const fetchVendors = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Vendor[]>(apiEndpoints.fetchVendors); // Replace with your actual API endpoint
    dispatch(setVendors(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch vendors"));
  }
};

export const addVendor =
  (newVendor: Vendor): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<Vendor>(
        apiEndpoints.createVendor,
        newVendor
      ); // Replace with your actual API endpoint
      const updatedVendors = [...getState().vendor.vendors, response.data];
      dispatch(setVendors(updatedVendors));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to add vendor"));
      dispatch(setLoading(false));
      throw error;
    }
  };

export const deleteVendorFromAPI =
  (vendorId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(apiEndpoints.deleteVendor(vendorId)); // Replace with your actual API endpoint
      dispatch(deleteVendor(vendorId)); // Dispatch the deleteVendor action to update the state
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to delete vendor"));
      throw error;
    }
  };

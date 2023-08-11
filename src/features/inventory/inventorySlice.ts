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

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  qty_available: number;
  moq: number;
}

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}
interface DeleteInventoryItemAction {
  type: "inventory/deleteItem";
  payload: string;
}
const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setInventoryItems: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload;
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
    deleteInventoryItem: (
      state: InventoryState,
      action: DeleteInventoryItemAction
    ) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
  },
});

export const { setInventoryItems, setLoading, setError, deleteInventoryItem } =
  inventorySlice.actions;

export default inventorySlice.reducer;

// Thunk to fetch inventory items from API
export const fetchInventoryItems = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<InventoryItem[]>(
      apiEndpoints.fetchInventoryItems
    ); // Replace with your actual API endpoint
    dispatch(setInventoryItems(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch inventory items"));
  }
};

export const addInventoryItem =
  (newItem: InventoryItem): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<InventoryItem>(
        apiEndpoints.createInventoryItem,
        newItem
      ); // Replace with your actual API endpoint
      const updatedItems = [...getState().inventory.items, response.data];
      dispatch(setInventoryItems(updatedItems));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to add inventory item"));
      throw error;
    }
  };

export const deleteInventoryItemFromAPI =
  (itemId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(apiEndpoints.deleteInventoryItem(itemId)); // Replace with your actual API endpoint
      dispatch(deleteInventoryItem(itemId)); // Dispatch the deleteInventoryItem action to update the state
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to delete inventory item"));
      throw error;
    }
  };

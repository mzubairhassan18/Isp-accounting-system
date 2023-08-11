import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "types"; // Assuming you have a custom AppThunk type
import { apiEndpoints } from "api";

export interface Connection {
  id: string;
  username: string;
  initial_charges: number;
  status: string;
  date: string;
  packageName: string;
}

interface ConnectionState {
  connections: Connection[];
  loading: boolean;
  error: string | null;
}

interface DeleteConnectionAction {
  type: "connection/deleteConnection";
  payload: string;
}

const initialState: ConnectionState = {
  connections: [],
  loading: false,
  error: null,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setConnections: (state, action: PayloadAction<Connection[]>) => {
      state.connections = action.payload;
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
    deleteConnection: (
      state: ConnectionState,
      action: DeleteConnectionAction
    ) => {
      const connectionId = action.payload;
      state.connections = state.connections.filter(
        (conn) => conn.id !== connectionId
      );
      state.loading = false;
    },
  },
});

export const { setConnections, setLoading, setError, deleteConnection } =
  connectionSlice.actions;

export default connectionSlice.reducer;

// Thunk to fetch connections from API
export const fetchConnections = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Connection[]>(
      apiEndpoints.fetchConnections
    ); // Replace with your actual API endpoint
    dispatch(setConnections(response.data));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch connections"));
  }
};

export const addConnection =
  (newConnection: Connection): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<Connection>(
        apiEndpoints.createConnection,
        newConnection
      ); // Replace with your actual API endpoint
      const updatedConnections = [
        ...getState().connection.connections,
        response.data,
      ];
      dispatch(setConnections(updatedConnections));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to add connection"));
      dispatch(setLoading(false));
      throw error;
    }
  };

export const deleteConnectionFromAPI =
  (connectionId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(apiEndpoints.deleteConnection(connectionId)); // Replace with your actual API endpoint
      dispatch(deleteConnection(connectionId)); // Dispatch the deleteConnection action to update the state
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to delete connection"));
      throw error;
    }
  };

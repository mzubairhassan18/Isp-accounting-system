import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk } from "types"; // Assuming you have a custom AppThunk type
import { apiEndpoints } from "api";
import { RootState } from "/store";

export interface Employee {
  id: string;
  username: string | null;
  salary: number | null;
  hire_date: Date | null;
  active: boolean;
  last_promotion_date: Date | null;
  designation: string | null;
  role_id: string | null;
  reportedTo: string | null;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

interface DeleteEmployeeAction {
  type: "employee/deleteEmployee";
  payload: string;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployees: (state, action: PayloadAction<Employee[]>) => {
      state.employees = action.payload;
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
    deleteEmployee: (state: EmployeeState, action: DeleteEmployeeAction) => {
      const employeeId = action.payload;
      state.employees = state.employees.filter(
        (employee) => employee.id !== employeeId
      );
      state.loading = false;
    },
  },
});

export const { setEmployees, setLoading, setError, deleteEmployee } =
  employeeSlice.actions;

export default employeeSlice.reducer;

// Thunk to fetch employees from API
export const fetchEmployees = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.get<Employee[]>(apiEndpoints.fetchEmployees); // Replace with your actual API endpoint
    dispatch(setEmployees(response.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || "Failed to fetch employees"));
  }
};

export const addEmployee =
  (newEmployee: Employee): AppThunk =>
  async (dispatch, getState) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post<Employee>(
        apiEndpoints.createEmployee,
        newEmployee
      ); // Replace with your actual API endpoint
      const updatedEmployees = [
        ...getState().employee.employees,
        response.data,
      ];
      dispatch(setEmployees(updatedEmployees));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to add employee"));
      dispatch(setLoading(false));
      throw error;
    }
  };

export const deleteEmployeeFromAPI =
  (employeeId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await axios.delete(apiEndpoints.deleteEmployee(employeeId)); // Replace with your actual API endpoint
      dispatch(deleteEmployee(employeeId)); // Dispatch the deleteEmployee action to update the state
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message || "Failed to delete employee"));
      throw error;
    }
  };

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEmployeeForm from "./AddEmployeeForm"; // Assuming you have a component for adding employees
import { AppDispatch, RootState } from "store";
import { fetchEmployees, Employee } from "features/employee/employeeSlice"; // Assuming you have the relevant actions and types for employees

import { Button, Drawer, Form, Input } from "antd";
import { FormInstance } from "antd/lib/form";
import { fetchAccounts } from "features/account/accountSlice";
import { User, fetchUsers } from "features/user/userSlice";
import { fetchRoles } from "features/role/roleSlice";
import EmployeeListTable from "./EmployeeListTable";

const EmployeePage: React.FC = () => {
  // Assuming you have stored Employees data in Redux store
  const employees: Employee[] = useSelector(
    (state: RootState) => state.employee.employees
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchEmployees action
    dispatch(fetchRoles());
    dispatch(fetchUsers());
    dispatch(fetchEmployees());
  }, [dispatch]);

  return (
    <div>
      <h1>Employee List</h1>
      <AddEmployeeForm />
      <EmployeeListTable employees={employees} />
    </div>
  );
};

export default EmployeePage;

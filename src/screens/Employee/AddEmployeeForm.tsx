import React, { useState } from "react";
import { Input, InputNumber, Select, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Employee, addEmployee } from "features/employee/employeeSlice"; // Assuming you have a custom addEmployee thunk action for employees
import AddListForm, { FormInput } from "components/AddListForm";
import { User } from "/features/user/userSlice";
import { RootState } from "/store";

const AddEmployeeForm: React.FC = () => {
  const dispatch = useDispatch();
  const roles = useSelector((state: RootState) => state.role.roles);
  const employees: Employee[] = useSelector(
    (state: RootState) => state.employee.employees
  );

  const getEmployeeOptions = (): { value: string; label: string }[] => {
    return employees.map((employee) => ({
      value: employee.id,
      label: employee.username,
    }));
  };
  const getRolesOptions = (): { value: string; label: string }[] => {
    return roles.map((roleItem) => ({
      value: roleItem.id,
      label: roleItem.name,
    }));
  };

  const employeeFormInputs: FormInput[] = [
    {
      name: "username",
      label: "Username",
      rules: [{ required: true }],
      inputElement: <Input />,
    },
    {
      name: "salary",
      label: "Employee Salary",
      rules: [{ required: true }],
      inputElement: <InputNumber addonBefore="Rs." />,
    },
    {
      name: "active",
      label: "Active",
      rules: [{ required: true }],
      inputElement: <Switch defaultChecked={true} />,
    },
    {
      name: "hire_date",
      label: "Hire Date",
      rules: [{ required: true }],
      inputElement: <Input type="date" />,
    },
    {
      name: "last_promotion_date",
      label: "Last Promotion Date",
      rules: [{ required: false }],
      inputElement: <Input type="date" />,
    },
    {
      name: "designation",
      label: "Designation",
      rules: [{ required: true }],
      inputElement: <Input />,
    },
    {
      name: "role_id",
      label: "Role ID",
      rules: [{ required: true }],
      inputElement: (
        <Select
          showSearch
          placeholder="Select a role"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={getRolesOptions()}
        />
      ),
    },
    {
      name: "reportedTo",
      label: "Reported To",
      rules: [{ required: false }],
      inputElement: (
        <Select
          showSearch
          placeholder="Reported To"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={
            getEmployeeOptions().length > 0 ? getEmployeeOptions() : null
          }
        />
      ),
    },
  ];

  return (
    <>
      <AddListForm
        entityName="employee"
        entityLabel="Employee"
        formInputs={employeeFormInputs}
        addEntityAction={addEmployee}
      />
    </>
  );
};

export default AddEmployeeForm;

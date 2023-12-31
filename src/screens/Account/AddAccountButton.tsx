// src/components/AddAccountButton.tsx

import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Spin, Select, AutoComplete } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addAccount } from 'features/account/accountSlice';
import { AppDispatch, AppThunk, RootState } from 'store';
import AddListForm, { FormInput } from 'components/AddListForm';


const accountTypeOptions = [
  "Asset",
  "Equity",
  "Expense",
  "Revenue",
  "liability"
]

const AddAccountButton: React.FC = () => {
  const accountFormInputs: FormInput[] = [
    {
      name: 'name',
      label: 'Name',
      rules: [{ required: true, message: 'Please enter a name' }],
      inputElement: <Input />,
    },
    {
      name: 'type',
      label: 'Type',
      rules: [{ required: true, message: 'Please enter a type' }],
      inputElement: <AutoComplete
      placeholder="Select type"
      filterOption={(inputValue: string, option: any) =>
        option?.value.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    >
      {accountTypeOptions.map((permission) => (
        <Select.Option key={permission} value={permission}>
          {permission}
        </Select.Option>
      ))}
    </AutoComplete>,
    },
    // Additional form inputs for the account entity
  ];
  return (
    <>
      <AddListForm
        entityName="account"
        entityLabel="Account"
        formInputs={accountFormInputs}
        addEntityAction={addAccount} // Assuming you have a custom addAccount thunk action for accounts
      />
    </>
  );
};

export default AddAccountButton;

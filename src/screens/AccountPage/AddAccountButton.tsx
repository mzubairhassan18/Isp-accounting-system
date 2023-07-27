// src/components/AddAccountButton.tsx

import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addAccount } from 'features/account/accountSlice';
import { AppDispatch, AppThunk, RootState } from 'store';
import AddEntityButton, { FormInput } from 'components/AddEntityButton';

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
      inputElement: <Input />,
    },
    // Additional form inputs for the account entity
  ];
  return (
    <>
      <AddEntityButton
        entityName="account"
        entityLabel="Account"
        formInputs={accountFormInputs}
        addEntityAction={addAccount} // Assuming you have a custom addAccount thunk action for accounts
      />
    </>
  );
};

export default AddAccountButton;

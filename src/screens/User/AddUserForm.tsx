// src/components/AddUserButton.tsx

import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Spin, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from 'features/user/userSlice';
import { AppDispatch, AppThunk, RootState } from 'store';
import AddEntityButton, { FormInput } from 'components/AddListForm';

const AddUserButton: React.FC = () => {
  const roles = useSelector((state: RootState) => state.role.roles); 
  const getRolesOptions = (): { value: string; label: string }[] => {
    return roles.map((roleItem) => ({
      value: roleItem.id,
      label: roleItem.name,
    }));
  };

  const userFormInputs: FormInput[] = [
    {
      name: 'username',
      label: 'Username',
      rules: [{ required: true, message: 'Please enter a username' }],
      inputElement: <Input />,
    },
    {
      name: 'full_name',
      label: 'Full Name',
      rules: [{ required: true, message: 'Please enter a full name' }],
      inputElement: <Input />,
    },
    {
      name: 'email',
      label: 'Email',
      rules: [
        { required: true, message: 'Please enter an email' },
        { type: 'email', message: 'Invalid email format' },
      ],
      inputElement: <Input />,
    },
    {
      name: 'phone',
      label: 'Phone',
      rules: [{ required: true, message: 'Please enter a phone number' },{
        pattern: /^92\d{10}$/,
        message: 'Phone number must start with "92" and contain 12 digits',
      },],
      inputElement: <Input
      placeholder="923124545734"
      maxLength={12}
      onChange={(e) => {
        const value = e.target.value;
        // Allow only numbers
        const formattedValue = value.replace(/[^\d]/g, '');
        // Add "92" at the beginning
        const formatted = `92${formattedValue}`;
        // Set the formatted value to the input
        e.target.value = formatted;
      }}
    />,
    },
    {
      name: 'address',
      label: 'Address',
      rules: [{ required: false }],
      inputElement: <Input />,
    },
    {
      name: 'cnic',
      label: 'CNIC',
      rules: [{ required: true }],
      inputElement: <Input placeholder="00000-0000000-0"
      maxLength={15}
      onChange={(e) => {
        const value = e.target.value;
        // Only allow numbers and hyphen
        const formattedValue = value.replace(/[^\d-]/g, '');
        // Format the value as 00000-0000000-0
        const parts = formattedValue.match(/^(\d{0,5})(-?)(\d{0,7})(-?)(\d{0,1})/);
        if (parts) {
          const formatted = `${parts[1]}${parts[2] ? '-' : ''}${parts[3]}${parts[4] ? '-' : ''}${parts[5]}`;
          // Set the formatted value to the input
          e.target.value = formatted;
        }
      }} />,
    },
    {
      name: 'password',
      label: 'Password',
      rules: [{ required: true, message: 'Please enter a password' }],
      inputElement: <Input.Password />,
    },
    {
      name: 'roleId',
      label: 'Role ID',
      rules: [{ required: false }],
      inputElement: <Select
      showSearch
      placeholder="Select a role"
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={getRolesOptions()}
    />,
      
    },
  ];

  return (
    <>
      <AddEntityButton
        entityName="user"
        entityLabel="User"
        formInputs={userFormInputs}
        addEntityAction={addUser} // Assuming you have a custom addUser thunk action for users
      />
    </>
  );
};

export default AddUserButton;

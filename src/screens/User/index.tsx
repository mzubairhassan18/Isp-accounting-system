// UserListPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddUserButton from './AddUserForm';
import { AppDispatch, RootState } from 'store';
import { fetchUsers, addUser, User } from 'features/user/userSlice';
import { Spin } from 'antd';
import UserListTable from './UserListTable';
import { Button, Drawer, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { fetchRoles } from 'features/role/roleSlice';

const UserPage = () => {
   // Assuming you have stored Users data in Redux store
   const Users: User[] = useSelector((state: RootState) => state.user.users);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchUsers action
    dispatch(fetchUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  return (
    <div>
      
      <h1>User List</h1>
      <AddUserButton />

      <UserListTable users={Users} />
    </div>
  );
};



export default UserPage;

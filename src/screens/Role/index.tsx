// RoleListPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddRoleForm from './AddRoleForm'; // Assuming you have a component for adding roles
import { AppDispatch, RootState } from 'store';
import { fetchRoles, Role } from 'features/role/roleSlice'; // Assuming you have the relevant actions and types for roles

import { Button, Drawer, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import RoleListTable from './RoleListTable';

const RolePage: React.FC = () => {
  // Assuming you have stored Roles data in Redux store
  const roles: Role[] = useSelector((state: RootState) => state.role.roles);
  const loading = useSelector((state: RootState) => state.user.loading);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchRoles action
    dispatch(fetchRoles());
  }, [dispatch, loading]);

  return (
    <div>
      <h1>Role List</h1>
      <AddRoleForm />
      <RoleListTable roles={roles} />
    </div>
  );
};

export default RolePage;

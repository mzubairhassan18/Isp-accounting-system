// PackageListPage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchPackages, Package } from 'features/package/packageSlice'; // Assuming you have the relevant actions and types for packages

import { Button, Drawer, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import PackageListTable from './PackageListTable';
import AddPackageForm from './AddPackageForm';

const PackagePage: React.FC = () => {
  // Assuming you have stored packages data in Redux store
  const packages: Package[] = useSelector((state: RootState) => state.package.packages);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchPackages action
    dispatch(fetchPackages());
  }, [dispatch]);

  return (
    <div>
      <h1>Package List</h1>
      <AddPackageForm />
      <PackageListTable packages={packages} />
    </div>
  );
};

export default PackagePage;

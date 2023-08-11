import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddVendorForm from './AddVendorForm'; // Assuming you have a component for adding vendors
import { AppDispatch, RootState } from 'store';
import { fetchVendors, Vendor } from 'features/vendor/vendorSlice'; // Assuming you have the relevant actions and types for vendors

import { Button, Drawer, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import VendorListTable from './VendorListTable';
import { fetchAccounts } from 'features/account/accountSlice';

const VendorPage: React.FC = () => {
  // Assuming you have stored Vendors data in Redux store
  const vendors: Vendor[] = useSelector(
    (state: RootState) => state.vendor.vendors
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchVendors action
    dispatch(fetchVendors());
  }, [dispatch]);

  return (
    <div>
      <h1>Vendor List</h1>
      <AddVendorForm />
      <VendorListTable vendors={vendors} />
    </div>
  );
};

export default VendorPage;

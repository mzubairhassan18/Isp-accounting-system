import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddInventoryItemForm from './AddInventoryForm'; // Rename the component
import { AppDispatch, RootState } from 'store';
import { fetchInventoryItems, InventoryItem } from 'features/inventory/inventorySlice'; // Use the inventory-related actions and selectors
import { Spin } from 'antd';
import InventoryListTable from './InventoryListTable'; // Assuming you have a component to render the inventory item list
import { Button, Drawer, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { fetchRoles } from 'features/role/roleSlice';

const InventoryPage = () => {
  // Assuming you have stored inventory data in Redux store
  const inventoryItems: InventoryItem[] = useSelector((state: RootState) => state.inventory.items); // Use the inventory-related selector

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Dispatch the fetchInventoryItems action
    dispatch(fetchInventoryItems()); // Use the inventory-related action
   
  }, [dispatch]);

  return (
    <div>
      <h1>Inventory List</h1>
      <AddInventoryItemForm /> {/* Use the inventory-related component */}
      <InventoryListTable inventoryItems={inventoryItems} /> {/* Use the inventory-related component */}
    </div>
  );
};

export default InventoryPage;

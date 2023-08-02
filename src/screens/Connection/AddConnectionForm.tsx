import React from 'react';
import { Input, Select, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection } from 'features/connection/connectionSlice'; // Assuming you have a custom addConnection thunk action for connections
import AddListForm, { FormInput } from 'components/AddListForm';
import { RootState } from 'store';
import { Package } from 'features/package/packageSlice';

interface Connection {
  id: string;
  user_id: number;
  initial_charges: number;
  status: string;
  date: Date;
  package_id: number;
}

const AddConnectionForm: React.FC = () => {
  const { Option } = Select;
  const users = useSelector((state: RootState) => state.user.users); 
  const packages = useSelector((state: RootState) => state.package.packages); 
  const getPackageOptions = (): { value: string; label: string }[] => {
    return packages.map((packageItem) => ({
      value: packageItem.id,
      label: packageItem.name,
    }));
  };
  const getUserOptions = (): { value: string; label: string }[] => {
    return users.map((userItem) => ({
      value: userItem.id,
      label: userItem.username,
    }));
  };
  const connectionFormInputs: FormInput[] = [
    {
      name: 'user_id',
      label: 'User ID',
      rules: [{ required: true, message: 'Please enter a user ID' }],
      inputElement: <Select
      showSearch
      placeholder="Select a user"
      optionFilterProp="label"
      options={getUserOptions()}
    >
    </Select>,
    },
    {
      name: 'initial_charges',
      label: 'Initial Charges',
      rules: [{ required: true, message: 'Please enter initial charges' }],
      inputElement: <Input type="number" />,
    },
    {
      name: 'status',
      label: 'Status',
      rules: [{ required: true, message: 'Please enter status' }],
      inputElement: <Input />,
    },
    {
      name: 'date',
      label: 'Date',
      rules: [{ required: true, message: 'Please select a date' }],
      inputElement: <Input type="date" />,
    },
    {
      name: 'package_id',
      label: 'Package ID',
      rules: [{ required: true, message: 'Please enter package ID' }],
      inputElement: <Select
      showSearch
      placeholder="Select a package"
      optionFilterProp="children"
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={getPackageOptions()}
    >
    </Select>,
    }
  ];

  return (
    <>
      <AddListForm
        entityName="connection"
        entityLabel="Connection"
        formInputs={connectionFormInputs}
        addEntityAction={addConnection}
      />
    </>
  );
};

export default AddConnectionForm;

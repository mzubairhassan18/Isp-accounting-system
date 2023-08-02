import React from 'react';
import { Input, Select, Switch } from 'antd';
import { useDispatch } from 'react-redux';
import { addPackage } from 'features/package/packageSlice'; // Assuming you have a custom addPackage thunk action for packages
import AddListForm, { FormInput } from 'components/AddListForm';

interface Package {
  id: string;
  name: string;
  active: boolean;
  purchase_price: number;
  sale_price: number;
  details: string;
  last_edited: Date;
}

const AddPackageForm: React.FC = () => {
  const packageFormInputs: FormInput[] = [
    {
      name: 'name',
      label: 'Name',
      rules: [{ required: true, message: 'Please enter a name' }],
      inputElement: <Input />,
    },
    {
      name: 'active',
      label: 'Active',
      rules: [{ required: true, message: 'Please select active status' }],
      inputElement: <Switch checkedChildren="Active" unCheckedChildren="Inactive" />,
    },
    {
      name: 'purchase_price',
      label: 'Purchase Price',
      rules: [{ required: true, message: 'Please enter purchase price' }],
      inputElement: <Input type="number" />,
    },
    {
      name: 'sale_price',
      label: 'Sale Price',
      rules: [{ required: true, message: 'Please enter sale price' }],
      inputElement: <Input type="number" />,
    },
    {
      name: 'details',
      label: 'Details',
      rules: [{ required: false }],
      inputElement: <Input.TextArea />,
    }
  ];

  return (
    <>
      <AddListForm
        entityName="package"
        entityLabel="Package"
        formInputs={packageFormInputs}
        addEntityAction={addPackage}
      />
    </>
  );
};

export default AddPackageForm;

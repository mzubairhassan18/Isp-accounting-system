import React from 'react';
import { AutoComplete, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { addRole } from 'features/role/roleSlice'; // Assuming you have a custom addRole thunk action for roles
import AddListForm, { FormInput } from 'components/AddListForm';

interface Role {
  id: string;
  name: string;
  permissions: string;
}

const AddRoleForm: React.FC = () => {

  const permissionsOptions = [
    'admin',
    'billing-admin',
    'user-admin',
    'supervisor',
    'worker',
    'shareholder',
  ];

  const roleFormInputs: FormInput[] = [
    {
      name: 'name',
      label: 'Name',
      rules: [{ required: true, message: 'Please enter a name' }],
      inputElement: <Input />,
    },
    {
      name: 'permissions',
      label: 'Permissions',
      rules: [{ required: false }],
      inputElement: 
      <Select
          mode="tags"
          placeholder="Select permissions"
          tokenSeparators={[';']}
          filterOption={(inputValue: string, option: any) =>
            option?.value.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        >
          {permissionsOptions.map((permission) => (
            <Select.Option key={permission} value={permission}>
              {permission}
            </Select.Option>
          ))}
        </Select>
    },
  ];

  return (
    <>
      <AddListForm
        entityName="role"
        entityLabel="Role"
        formInputs={roleFormInputs}
        addEntityAction={addRole}
      />
    </>
  );
};

export default AddRoleForm;

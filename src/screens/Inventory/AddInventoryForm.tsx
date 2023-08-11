import React from "react";
import { Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addInventoryItem } from "features/inventory/inventorySlice"; // Assuming you have a custom addInventoryItem thunk action for inventory items
import { AppDispatch, AppThunk, RootState } from "store";
import AddEntityButton, { FormInput } from "components/AddListForm";
import { useForm } from "antd/es/form/Form";

const AddInventoryItemForm: React.FC = () => {
  const inventoryFormInputs: FormInput[] = [
    {
      name: "name",
      label: "Name",
      rules: [{ required: true, message: "Please enter a name" }],
      inputElement: <Input />,
    },
    {
      name: "unit",
      label: "Unit",
      rules: [{ required: true, message: "Please enter a unit" }],
      inputElement: <Input />,
    },
    {
      name: "qty_available",
      label: "Quantity Available",
      rules: [
        { required: true, message: "Please enter the quantity available" },
      ],
      inputElement: <Input type="number" />,
    },
    {
      name: "moq",
      label: "Minimum Order Quantity",
      rules: [
        { required: true, message: "Please enter the minimum order quantity" },
      ],
      inputElement: <Input type="number" />,
    },
  ];

  return (
    <>
      <AddEntityButton
        entityName="inventory item"
        entityLabel="Inventory Item"
        formInputs={inventoryFormInputs}
        addEntityAction={addInventoryItem} // Assuming you have a custom addInventoryItem thunk action for inventory items
      />
    </>
  );
};

export default AddInventoryItemForm;

import React from "react";
import { AutoComplete, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addVendor } from "features/vendor/vendorSlice"; // Assuming you have a custom addVendor thunk action for vendors
import AddListForm, { FormInput } from "components/AddListForm";
import { RootState } from "/store";

interface Vendor {
  id: string;
  name: string | null;
  address: string | null;
}

const AddVendorForm: React.FC = () => {
  const dispatch = useDispatch();

  const vendors = useSelector((state: RootState) => state.vendor.vendors);
  // Define your options for name, address, or any other field related to vendors
  const getVendorOptions = (): { value: string; label: string }[] => {
    return vendors.map((vendor) => ({
      value: vendor.id,
      label: vendor.name || "",
    }));
  };

  const vendorFormInputs: FormInput[] = [
    {
      name: "name",
      label: "Vendor Name",
      rules: [{ required: true }],
      inputElement: <Input />,
    },
    {
      name: "address",
      label: "Vendor Address",
      rules: [{ required: true }],
      inputElement: <Input />,
    },
  ];

  return (
    <>
      <AddListForm
        entityName="vendor"
        entityLabel="Vendor"
        formInputs={vendorFormInputs}
        addEntityAction={addVendor}
      />
    </>
  );
};

export default AddVendorForm;

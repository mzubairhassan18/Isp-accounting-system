// src/components/AddUserButton.tsx

import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Select,
  DatePicker,
  Switch,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addUser, checkUsernameAvailability } from "features/user/userSlice";
import { AppDispatch, AppThunk, RootState } from "store";
import AddEntityButton, { FormInput } from "components/AddListForm";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const AddUserButton: React.FC = () => {
  const [form] = Form.useForm();
  const supervisors = useSelector(
    (state: RootState) => state.employee.employees
  );
  const packages = useSelector((state: RootState) => state.package.packages);
  const getSupervisorOptions = (): { value: string; label: string }[] => {
    return supervisors.map((employee) => ({
      value: employee.id,
      label: employee.username,
    }));
  };
  const getPackageOptions = (): { value: string; label: string }[] => {
    return packages.map((packageItem) => ({
      value: packageItem.id,
      label: packageItem.name,
    }));
  };

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  useEffect(() => {
    form.validateFields(["username"]);
  }, [isUsernameAvailable]);

  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  ); // Timeout to delay API request
  const handleUsernameChange = (value: string) => {
    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to trigger the API request after a delay
    const newTypingTimeout = setTimeout(async () => {
      await checkUsernameAvailabilityAndUpdate(value);
    }, 800);

    setTypingTimeout(newTypingTimeout);
  };

  const checkUsernameAvailabilityAndUpdate = async (value) => {
    if (value != "") {
      try {
        console.log("Validating username availability");
        const response = await dispatch(checkUsernameAvailability(value));
        console.log(
          "response check",
          response,
          response?.length > 0 ? false : true
        );
        // return response?.length > 0 ? false : true;
        setIsUsernameAvailable(response?.length > 0 ? false : true); // Update local state with validation result
      } catch (error) {
        console.error("Error checking username availability:", error);
        setIsUsernameAvailable(false);
        // form.validateFields(["username"]);
        console.log("response erro", error);
        // return true;
      }
    }
  };
  const dispatch = useDispatch<AppDispatch>();

  const userFormInputs: FormInput[] = [
    {
      name: "username",
      label: "Username",
      rules: [
        { required: true, message: "Please enter a username" },
        {
          validator: async (_, value) => {
            if (!isUsernameAvailable) {
              return Promise.reject("Username is already taken");
            }
            return Promise.resolve();
          },
        },
      ],
      inputElement: (
        <Input onChange={(e) => handleUsernameChange(e.target.value)} />
      ),
    },
    {
      name: "full_name",
      label: "Full Name",
      rules: [{ required: true, message: "Please enter a full name" }],
      inputElement: <Input />,
    },
    {
      name: "email",
      label: "Email",
      rules: [
        { required: true, message: "Please enter an email" },
        { type: "email", message: "Invalid email format" },
      ],
      inputElement: <Input />,
    },
    {
      name: "phone",
      label: "Phone",
      rules: [
        { required: true, message: "Please enter a phone number" },
        {
          pattern: /^92\d{10}$/,
          message: 'Phone number must start with "92" and contain 12 digits',
        },
      ],
      inputElement: (
        <Input
          placeholder="923124545734"
          maxLength={12}
          onChange={(e) => {
            const value = e.target.value;
            // Allow only numbers
            const formattedValue = value.replace(/[^\d]/g, "");
            // Add "92" at the beginning
            const formatted = `92${formattedValue}`;
            // Set the formatted value to the input
            e.target.value = formatted;
          }}
        />
      ),
    },
    {
      name: "address",
      label: "Address",
      rules: [{ required: false }],
      inputElement: <Input />,
    },
    {
      name: "cnic",
      label: "CNIC",
      rules: [{ required: true }],
      inputElement: (
        <Input
          placeholder="00000-0000000-0"
          maxLength={15}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow numbers and hyphen
            const formattedValue = value.replace(/[^\d-]/g, "");
            // Format the value as 00000-0000000-0
            const parts = formattedValue.match(
              /^(\d{0,5})(-?)(\d{0,7})(-?)(\d{0,1})/
            );
            if (parts) {
              const formatted = `${parts[1]}${parts[2] ? "-" : ""}${parts[3]}${
                parts[4] ? "-" : ""
              }${parts[5]}`;
              // Set the formatted value to the input
              e.target.value = formatted;
            }
          }}
        />
      ),
    },
    {
      name: "password",
      label: "Password",
      rules: [{ required: true, message: "Please enter a password" }],
      inputElement: <Input.Password />,
    },
    {
      name: "active",
      label: "Active",
      rules: [{ required: true }],
      inputElement: (
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked
        />
      ),
    },
    {
      name: "fee",
      label: "Fee",
      rules: [{ required: true }],
      inputElement: <InputNumber />,
    },
    {
      name: "pay_date",
      label: "Bill Due Day",
      rules: [{ required: true }],
      inputElement: <InputNumber addonAfter="day of month" max={20} min={1} />,
    },

    {
      name: "package_id",
      label: "Package",
      rules: [{ required: true }],
      inputElement: (
        <Select
          showSearch
          placeholder="Select Pacakage"
          optionFilterProp="label"
          options={getPackageOptions()}
        ></Select>
      ),
    },
    {
      name: "supervisor",
      label: "Supervisor",
      rules: [{ required: true }],
      inputElement: (
        <Select
          showSearch
          placeholder="Supervisor"
          optionFilterProp="label"
          options={getSupervisorOptions()}
        ></Select>
      ),
    },
    {
      name: "intial_charges",
      label: "Initial Charges",
      rules: [{ required: true }],
      inputElement: <InputNumber style={{ width: "50%" }} addonBefore="Rs." />,
    },
  ];

  return (
    <>
      <AddEntityButton
        entityName="user"
        entityLabel="User"
        formRef={form}
        formInputs={userFormInputs}
        addEntityAction={addUser} // Assuming you have a custom addUser thunk action for users
      />
    </>
  );
};

export default AddUserButton;

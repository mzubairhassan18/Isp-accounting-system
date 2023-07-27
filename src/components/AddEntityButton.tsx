// src/components/AddEntityButton.tsx

import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppThunk, RootState } from 'store';

export interface FormInput {
  name: string;
  label: string;
  rules?: any[]; // Form validation rules
  inputElement: React.ReactNode; // The custom form input element
}

interface AddEntityButtonProps {
  entityName: string;
  entityLabel: string;
  formInputs: FormInput[]; // Custom form inputs for the entity
  addEntityAction: (values: any) => AppThunk; // The thunk action to add the entity
}

const AddEntityButton: React.FC<AddEntityButtonProps> = ({
  entityName,
  entityLabel,
  formInputs,
  addEntityAction,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const entityError = useSelector((state: RootState) => state[entityName].error);
  const loading = useSelector((state: RootState) => state[entityName].loading);
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const result = await dispatch(addEntityAction(values));
      form.resetFields();
      setVisible(false);
      message.success(`${entityLabel} added successfully.`);
    } catch (error) {
      console.log("error", error);
      message.error(error.message);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add {entityLabel}
      </Button>
      {loading && <div className="overlay"> <Spin size="large" /></div>}
      <Modal
        title={`Add ${entityLabel}`}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form}>
          {formInputs.map((input) => (
            <Form.Item key={input.name} name={input.name} label={input.label} rules={input.rules}>
              {input.inputElement}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </>
  );
};

export default AddEntityButton;

// src/components/AddEntityButton.tsx

import React, { useState } from 'react';
import { Button, Modal, Form, Input, message, Spin, Drawer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, AppThunk, RootState } from 'store';
import { SaveOutlined, PlusCircleOutlined } from '@ant-design/icons';

export interface FormInput {
  name: string;
  label: string;
  rules?: any[]; // Form validation rules
  inputElement: React.ReactNode; // The custom form input element
}

interface AddListFormProps {
  entityName: string;
  entityLabel: string;
  formInputs: FormInput[]; // Custom form inputs for the entity
  addEntityAction: (values: any) => AppThunk; // The thunk action to add the entity
}

const AddListForm: React.FC<AddListFormProps> = ({
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
        message.error('An error occurred while adding the entity.'+error.message);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <>
      <Button style={{marginBottom: "10px"}} type="primary" onClick={showModal} icon={<PlusCircleOutlined  />}>
        Add {entityLabel}
      </Button>
      {/* {loading && <div className="overlay"> <Spin size="large" /></div>} */}
        <Drawer
        title={`Add ${entityLabel}`}
        placement="right"
        onClose={handleCancel}
        open={visible}
        width={500}
      >
        <Form layout='horizontal' form={form}>
          {formInputs.map((input) => (
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} key={input.name} name={input.name} label={input.label} rules={input.rules}>
              {input.inputElement}
            </Form.Item>
          ))}
          <Button block type='primary' onClick={handleOk} icon={<SaveOutlined />} style={{fontWeight: "bold"}}>
            Save
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default AddListForm;

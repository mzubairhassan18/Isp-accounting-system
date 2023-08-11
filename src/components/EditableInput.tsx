import React from 'react';
import { Input, InputNumber, Switch, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const EditableInput = ({ inputType, value, ...props }) => {
  switch (inputType) {
    case 'text':
      return <Input {...props} value={value} />;
    case 'number':
      return <InputNumber {...props} value={value} />;
    case 'password':
      return <Input.Password {...props} />;
    case 'switch':
      return <Switch {...props} checked={value} />;
    case 'date':
      return <DatePicker {...props} defaultValue={dayjs(value)} />;
    case 'select':
      return <Select {...props} value={value} />;
    default:
      return <Input {...props} value={value} />;
  }
};

export default EditableInput;

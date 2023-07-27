// src/components/AccountListTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Form, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import  { Account } from 'features/account/accountSlice'; // Assuming you have an interface for the Account model
import { deleteAccount } from 'features/account/accountSlice'; // Import your deleteAccount action
import { AppDispatch, RootState } from '@/store';


import "./styles.css"

interface AccountListTableProps {
  accounts: Account[];
}


interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text' | 'number';
  record: Account;
  children?: React.ReactNode;
  index: number;
}

const EditableCell: React.FC<any> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const [form] = Form.useForm();
  const inputNode = inputType === 'number' ? <Input type="number" /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AccountListTable: React.FC<AccountListTableProps> = ({ accounts }) => {
  console.log("accounts list props", accounts);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState(accounts);
  const loading = useSelector((state: RootState) => state.account.loading);
  useEffect(() => {
    setData(accounts);
  }, [accounts, loading]);

  const handleDelete = (id: string) => {
    dispatch(deleteAccount(id));
    message.success('Account deleted successfully.');
  };
  const renderCell = (props: EditableCellProps) => {
    const { editing, dataIndex, title, inputType, record,index, ...restProps } = props;
    return (
      <td {...restProps}>
        {editing ? (
          <EditableCell
            editing={editing}
            dataIndex={dataIndex}
            title={title}
            inputType={inputType}
            record={record}
            index={index}
          />
        ) : (
          restProps.children
        )}
      </td>
    );
  };
  const handleBulkDelete = () => {
    // Perform bulk delete action here using selectedRowKeys array
    // ...
    setSelectedRowKeys([]);
    message.success('Selected accounts deleted successfully.');
  };
  const handleSearch = (value: string) => {
    setSearchInput(value);
  };
  const handleCancel = () => {
    // Cancel editing mode
    setEditingKey('');
  };
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchInput('');
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Account, b: Account) => a.id.localeCompare(b.id),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Account, b: Account) => a.name.localeCompare(b.name),
      editable: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      sorter: (a: Account, b: Account) => a.type.localeCompare(b.type),
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: Account) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const edit = (record: Account) => {
    form.setFieldsValue({ id: '', name: '', type: '', ...record });
    setEditingKey(record.id);
  };
const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Account;

      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const isEditing = (record: Account) => record.id === editingKey;
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Account) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: string[]) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
      {loading && <div className="overlay"> <Spin size="large" /></div>}
      <Input.Search
          placeholder="Search name or type"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 200, marginRight: 8 }}
        />
        <Button onClick={handleBulkDelete} disabled={selectedRowKeys.length === 0}>
          Bulk Delete
        </Button>
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowKey="id"
          rowSelection={rowSelection}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 10 }}
          dataSource={data.filter(
            (data) =>
            data.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            data.type.toLowerCase().includes(searchInput.toLowerCase())
          )}
        />
      </Form>
    </>
  );
};

export default AccountListTable;

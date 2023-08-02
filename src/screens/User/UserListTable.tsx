// src/components/UserListTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Form, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import  { User, deleteUserFromAPI } from 'features/user/userSlice'; // Assuming you have an interface for the User model
import { deleteUser } from 'features/user/userSlice'; // Import your deleteUser action
import { AppDispatch, RootState } from '@/store';

import type { ColumnsType } from 'antd/es/table';

interface UserListTableProps {
  users: User[];
}


interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text' | 'number';
  record: User;
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

const UserListTable: React.FC<UserListTableProps> = ({users }) => {
  console.log("Users list props", users);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState(users);
  const loading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    console.log("users from effect", users)
    setData(users);
  }, [users, loading]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteUserFromAPI(id));
      await message.success('User deleted successfully.');
    } catch (error) {
      // If an error occurs during the API call or dispatching, it will be caught here
      // You can handle the error if needed
      message.error('Failed to delete user.');
    }
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
    message.success('Selected Users deleted successfully.');
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
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      editable: true,
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      editable: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => (a.phone || 0) - (b.phone || 0),
      editable: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => (a.address || '').localeCompare(b.address || ''),
      editable: true,
      
    },
    {
      title: 'CNIC',
      dataIndex: 'cnic',
      key: 'cnic',
      sorter: (a, b) => (a.cnic || 0) - (b.cnic || 0),
      editable: true,
    },
    {
      title: 'Role ID',
      dataIndex: 'roleId',
      key: 'roleId',
      sorter: (a, b) => (a.role_id || 0) - (b.role_id || 0),
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: 150,
      responsive: ['md'],
      render: (_: any, record: User) => {
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
    },{
      title: 'Delete',
      dataIndex: 'delete',
      fixed: 'right',
      width: 100,
      responsive: ['md'],
      render: (_: any, record: User) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    }
  ];
  const edit = (record: User) => {
    form.setFieldsValue({ id: '', name: '', type: '', ...record });
    setEditingKey(record.id);
  };
const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as User;

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
  const isEditing = (record: User) => record.id === editingKey;
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: User) => ({
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
          // @ts-ignore
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 10 }}
          scroll={{ y: 500 }}
          dataSource={data.filter(
            (data) => {
            const searchText = searchInput.toLowerCase();
            return (
              data.username?.toLowerCase().includes(searchText) ||
              data.full_name?.toLowerCase().includes(searchText) ||
              data.email?.toLowerCase().includes(searchText)
            );
            }
          )}
        />
      </Form>
    </>
  );
};

export default UserListTable;

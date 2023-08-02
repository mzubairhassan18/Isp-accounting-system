// src/components/RoleListTable.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Form, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Role, deleteRoleFromAPI } from 'features/role/roleSlice'; // Assuming you have an interface for the Role model
import { deleteRole } from 'features/role/roleSlice'; // Import your deleteRole action
import { AppDispatch, RootState } from '@/store';

interface RoleListTableProps {
  roles: Role[];
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text' | 'number';
  record: Role;
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

const RoleListTable: React.FC<RoleListTableProps> = ({ roles }) => {
  console.log("Roles list props", roles);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState(roles);
  const loading = useSelector((state: RootState) => state.role.loading);
  console.log("Roles from effect 1", roles);
  console.log("Loading from effect 1", loading);
  useEffect(() => {
    console.log("Roles from effect", roles);
  console.log("Loading from effect", loading);
    setData(roles);
  }, [roles,loading]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteRoleFromAPI(id));
      await message.success('Role deleted successfully.');
    } catch (error) {
      // If an error occurs during the API call or dispatching, it will be caught here
      // You can handle the error if needed
      message.error('Failed to delete role.');
    }
  };

  const renderCell = (props: EditableCellProps) => {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = props;
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
    message.success('Selected Roles deleted successfully.');
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      editable: true,
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      sorter: (a, b) => a.permissions.localeCompare(b.permissions),
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: 150,
      responsive: ['md'],
      render: (_: any, record: Role) => {
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
    {
      title: 'Delete',
      dataIndex: 'delete',
      fixed: 'right',
      width: 100,
      responsive: ['md'],
      render: (_: any, record: Role) => (
        <Popconfirm
          title="Are you sure you want to delete this role?"
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

  const edit = (record: Role) => {
    form.setFieldsValue({ id: '', name: '', permissions: '', ...record });
    setEditingKey(record.id);
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Role;

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

  const isEditing = (record: Role) => record.id === editingKey;

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Role) => ({
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
          placeholder="Search name or permissions"
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
          scroll={{ y: 240 }}
          dataSource={data.filter(
            (data) => {
              const searchText = searchInput.toLowerCase();
              return (
                data.name?.toLowerCase().includes(searchText) ||
                data.permissions?.toLowerCase().includes(searchText)
              );
            }
          )}
        />
      </Form>
    </>
  );
};

export default RoleListTable;

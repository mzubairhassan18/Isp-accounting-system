import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Form, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Connection, deleteConnectionFromAPI } from 'features/connection/connectionSlice'; // Assuming you have an interface for the Connection model
import { deleteConnection } from 'features/connection/connectionSlice'; // Import your deleteConnection action
import { AppDispatch, RootState } from '@/store';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface ConnectionListTableProps {
  connections: Connection[];
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text' | 'number';
  record: Connection;
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

const ConnectionListTable: React.FC<ConnectionListTableProps> = ({ connections }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState(connections);
  const loading = useSelector((state: RootState) => state.connection.loading);

  useEffect(() => {
    setData(connections);
  }, [connections]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteConnectionFromAPI(id));
      await message.success('Connection deleted successfully.');
    } catch (error) {
      message.error('Failed to delete connection.');
    }
  };

  const handleBulkDelete = () => {
    // Perform bulk delete action here using selectedRowKeys array
    // ...
    setSelectedRowKeys([]);
    message.success('Selected Connections deleted successfully.');
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

  const isEditing = (record: Connection) => record.id === editingKey;

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Connection;

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



  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username - b.username,
      editable: true,
    },
    {
      title: 'Initial Charges',
      dataIndex: 'initial_charges',
      key: 'initial_charges',
      sorter: (a, b) => a.initial_charges - b.initial_charges,
      editable: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      editable: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      editable: true,
    },
    {
      title: 'Package Name',
      dataIndex: 'packageName',
      key: 'package_id',
      sorter: (a, b) => a.packageName - b.packageName,
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: 100,
      responsive: ['md'],
      render: (_: any, record: Connection) => {
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
      render: (_: any, record: Connection) => (
        <Popconfirm
          title="Are you sure you want to delete this connection?"
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

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Connection) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const edit = (record: Connection) => {
    form.setFieldsValue({ id: '', user_id: '', initial_charges: 0, status: '', date: '', package_id: 0, ...record });
    setEditingKey(record.id);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: string[]) => setSelectedRowKeys(selectedKeys),
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        {loading && <div className="overlay"> <Spin size="large" /></div>}
        <Input.Search
          placeholder="Search name or details"
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
                data.username?.toLowerCase().includes(searchText)
              );
            }
          )}
        />
      </Form>
    </>
  );
};

export default ConnectionListTable;

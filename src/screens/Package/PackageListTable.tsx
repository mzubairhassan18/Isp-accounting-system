import React, { useState, useEffect } from 'react';
import { Table, Button, Popconfirm, message, Input, Form, Typography, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Package, deletePackageFromAPI } from 'features/package/packageSlice'; // Assuming you have an interface for the Package model
import { deletePackage } from 'features/package/packageSlice'; // Import your deletePackage action
import { AppDispatch, RootState } from '@/store';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface PackageListTableProps {
  packages: Package[];
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'text' | 'number';
  record: Package;
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

const PackageListTable: React.FC<PackageListTableProps> = ({ packages }) => {
  console.log("Packages list props", packages);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [data, setData] = useState(packages);
  const loading = useSelector((state: RootState) => state.package.loading);
  console.log("Packages from effect 1", packages);
  console.log("Loading from effect 1", loading);
  useEffect(() => {
    console.log("Packages from effect", packages);
    console.log("Loading from effect", loading);
    setData(packages);
  }, [packages]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deletePackageFromAPI(id));
      await message.success('Package deleted successfully.');
    } catch (error) {
      // If an error occurs during the API call or dispatching, it will be caught here
      // You can handle the error if needed
      message.error('Failed to delete package.');
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
    message.success('Selected Packages deleted successfully.');
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
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      sorter: (a, b) => (a.active ? 1 : -1) - (b.active ? 1 : -1),
      editable: true,
      render: (active: boolean) => (active ? <Typography.Text strong style={{ background: "#00be13cf",
      color: "white",
      padding: "10px",
      borderRadius: "8px" }}>
      Active
    </Typography.Text> : <Typography.Text strong style={{ background: "#d3d3d3",
    color: "white",
    padding: "10px",
    borderRadius: "8px" }}>
              Inactive
            </Typography.Text>),
    },
    {
      title: 'Purchase Price',
      dataIndex: 'purchase_price',
      key: 'purchase_price',
      sorter: (a, b) => a.purchase_price - b.purchase_price,
      editable: true,
    },
    {
      title: 'Sale Price',
      dataIndex: 'sale_price',
      key: 'sale_price',
      sorter: (a, b) => a.sale_price - b.sale_price,
      editable: true,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      sorter: (a, b) => a.details.localeCompare(b.details),
      editable: true,
    },
    {
      title: 'Last Edited',
      dataIndex: 'last_edited',
      key: 'last_edited',
      sorter: (a, b) => (a.last_edited ? new Date(a.last_edited).getTime() : 0) - (b.last_edited ? new Date(b.last_edited).getTime() : 0),
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: 150,
      responsive: ['md'],
      render: (_: any, record: Package) => {
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
      render: (_: any, record: Package) => (
        <Popconfirm
          title="Are you sure you want to delete this package?"
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

  const edit = (record: Package) => {
    form.setFieldsValue({ id: '', name: '', active: true, purchase_price: 0, sale_price: 0, details: '', last_edited: '' , ...record });
    setEditingKey(record.id);
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Package;

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

  const isEditing = (record: Package) => record.id === editingKey;

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Package) => ({
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
                data.name?.toLowerCase().includes(searchText) ||
                data.details?.toLowerCase().includes(searchText)
              );
            }
          )}
        />
      </Form>
    </>
  );
};

export default PackageListTable;

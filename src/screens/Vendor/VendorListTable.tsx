import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input,
  Form,
  Typography,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Vendor, deleteVendorFromAPI } from "features/vendor/vendorSlice"; // Assuming you have an interface for the Vendor model
import { deleteVendor } from "features/vendor/vendorSlice"; // Import your deleteVendor action
import { AppDispatch, RootState } from "/store";

interface VendorListTableProps {
  vendors: Vendor[];
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text" | "number";
  record: Vendor;
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
  const inputNode =
    inputType === "number" ? <Input type="number" /> : <Input />;
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

const VendorListTable: React.FC<VendorListTableProps> = ({ vendors }) => {
  console.log("Vendors list props", vendors);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState(vendors);
  const loading = useSelector((state: RootState) => state.vendor.loading);
  console.log("Vendors from effect 1", vendors);
  console.log("Loading from effect 1", loading);
  useEffect(() => {
    console.log("Vendors from effect", vendors);
    console.log("Loading from effect", loading);
    setData(vendors);
  }, [vendors]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteVendorFromAPI(id));
      await message.success("Vendor deleted successfully.");
    } catch (error) {
      // If an error occurs during the API call or dispatching, it will be caught here
      // You can handle the error if needed
      message.error("Failed to delete vendor.");
    }
  };

  const renderCell = (props: EditableCellProps) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = props;
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
    message.success("Selected Vendors deleted successfully.");
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const handleCancel = () => {
    // Cancel editing mode
    setEditingKey("");
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchInput("");
  };

  const columns = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: Vendor, b: Vendor) => a.name.localeCompare(b.name),
    },
    {
      title: "Vendor Address",
      dataIndex: "address",
      key: "address",
      editable: true,
      sorter: (a: Vendor, b: Vendor) => a.address.localeCompare(b.address),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      fixed: "right",
      width: 150,
      responsive: ["md"],
      render: (_: any, record: Vendor) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={handleCancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      fixed: "right",
      width: 100,
      responsive: ["md"],
      render: (_: any, record: Vendor) => (
        <Popconfirm
          title="Are you sure you want to delete this vendor?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const edit = (record: Vendor) => {
    form.setFieldsValue({ id: "", name: "", address: "", ...record });
    setEditingKey(record.id);
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Vendor;

      const newData = [...data];
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const isEditing = (record: Vendor) => record.id === editingKey;

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Vendor) => ({
        record,
        inputType: "text",
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
        {loading && (
          <div className="overlay">
            {" "}
            <Spin size="large" />
          </div>
        )}
        <Input.Search
          placeholder="Search vendor name or address"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 200, marginRight: 8 }}
        />
        <Button
          onClick={handleBulkDelete}
          disabled={selectedRowKeys.length === 0}
        >
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
          dataSource={data.filter((data) => {
            const searchText = searchInput.toLowerCase();
            // Filter the vendors based on searchInput
            return (
              data.name?.toString().toLowerCase().includes(searchText) ||
              data.address?.toLowerCase().includes(searchText)
            );
          })}
        />
      </Form>
    </>
  );
};

export default VendorListTable;

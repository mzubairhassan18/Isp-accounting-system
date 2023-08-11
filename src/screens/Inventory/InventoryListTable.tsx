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
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  InventoryItem,
  deleteInventoryItemFromAPI,
} from "features/inventory/inventorySlice"; // Use the inventory-related actions and interfaces
import { deleteInventoryItem } from "features/inventory/inventorySlice"; // Import your deleteInventoryItem action
import { AppDispatch, RootState } from "/store";
import { ColumnsType } from "antd/es/table";

interface InventoryListTableProps {
  inventoryItems: InventoryItem[]; // Rename the prop
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text" | "number";
  record: InventoryItem;
  children?: React.ReactNode;
  index: number;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

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

const InventoryListTable: React.FC<InventoryListTableProps> = ({
  inventoryItems,
}) => {
  console.log("Inventory items list props", inventoryItems);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [editingKey, setEditingKey] = useState<string>("");
  const [form] = Form.useForm();
  const [data, setData] = useState<InventoryItem[]>(inventoryItems); // Update the data state with inventory items
  const loading = useSelector((state: RootState) => state.inventory.loading); // Use the inventory-related state

  useEffect(() => {
    console.log("Inventory items from effect", inventoryItems);
    setData(inventoryItems); // Update the data state when inventory items change
  }, [inventoryItems]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteInventoryItemFromAPI(id));
      await message.success("Inventory item deleted successfully.");
    } catch (error) {
      // If an error occurs during the API call or dispatching, it will be caught here
      // You can handle the error if needed
      message.error("Failed to delete inventory item.");
    }
  };

  const renderCell = (props: EditableCellProps) => {
    const { editing, dataIndex, title, inputType, record, index } = props;
    return (
      <EditableCell
        editing={editing}
        dataIndex={dataIndex}
        title={title}
        inputType={inputType}
        record={record}
        index={index}
      />
    );
  };

  const handleBulkDelete = () => {
    // Perform bulk delete action here using selectedRowKeys array
    // ...
    setSelectedRowKeys([]);
    message.success("Selected inventory items deleted successfully.");
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as InventoryItem;

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

  const isEditing = (record: InventoryItem) => record.id === editingKey;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      editable: true,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      sorter: (a, b) => a.unit.localeCompare(b.unit),
      editable: true,
    },
    {
      title: "Quantity Available",
      dataIndex: "qty_available",
      key: "qty_available",
      sorter: (a, b) => (a.qty_available || 0) - (b.qty_available || 0),
    },
    {
      title: "MOQ",
      dataIndex: "moq",
      key: "moq",
      sorter: (a, b) => (a.moq || 0) - (b.moq || 0),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: 150,
      responsive: ["md"],
      render: (_: any, record: InventoryItem) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
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
      render: (_: any, record: InventoryItem) => (
        <Popconfirm
          title="Are you sure you want to delete this item?"
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

  const edit = (record: InventoryItem) => {
    form.setFieldsValue({
      id: "",
      name: "",
      unit: "",
      qty_available: "",
      moq: "",
      ...record,
    });
    setEditingKey(record.id);
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: InventoryItem) => ({
        record,
        inputType:
          col.dataIndex === "moq" || col.dataIndex === "qty_available"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
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
          placeholder="Search name or unit"
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
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedKeys: string[]) =>
              setSelectedRowKeys(selectedKeys),
          }}
          // @ts-ignore
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ pageSize: 10 }}
          scroll={{ y: 500 }}
          dataSource={data.filter((item) => {
            const searchText = searchInput.toLowerCase();
            return (
              item.name?.toLowerCase().includes(searchText) ||
              item.unit?.toLowerCase().includes(searchText)
            );
          })}
        />
      </Form>
    </>
  );
};

export default InventoryListTable;

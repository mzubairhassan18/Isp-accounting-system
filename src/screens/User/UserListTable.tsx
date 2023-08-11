// src/components/UserListTable.tsx
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
import { User, deleteUserFromAPI } from "features/user/userSlice"; // Assuming you have an interface for the User model
import { deleteUser } from "features/user/userSlice"; // Import your deleteUser action
import { AppDispatch, RootState } from "/store";

import type { ColumnsType } from "antd/es/table";
import StatusButton from "components/StatusButton";
import EditableInput from "components/EditableInput";

interface UserListTableProps {
  users: User[];
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text" | "number";
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
          <EditableInput inputType={inputType} value={record[dataIndex]} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const UserListTable: React.FC<UserListTableProps> = ({ users }) => {
  console.log("Users list props", users);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState(users);
  const loading = useSelector((state: RootState) => state.user.loading);

  useEffect(() => {
    console.log("users from effect", users);
    setData(users);
  }, [users, loading]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteUserFromAPI(id));
      await message.success("User deleted successfully.");
    } catch (error) {
      // If an error occurs during the API call or dispatching, it will be caught here
      // You can handle the error if needed
      message.error("Failed to delete user.");
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
    message.success("Selected Users deleted successfully.");
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
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: 150,
      sorter: (a, b) => a.username.localeCompare(b.username),
      editable: true,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
      width: 150,
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      inputType: "switch",
      width: 150,
      sorter: (a, b) => (a.active ? 1 : -1) - (b.active ? 1 : -1),
      editable: true,
      render: (active) => <StatusButton isActive={active} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
      sorter: (a, b) => a.email.localeCompare(b.email),
      editable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      sorter: (a, b) => (a.phone || 0) - (b.phone || 0),
      editable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 200,
      sorter: (a, b) => (a.address || "").localeCompare(b.address || ""),
      editable: true,
    },
    {
      title: "CNIC",
      dataIndex: "cnic",
      key: "cnic",
      width: 150,
      sorter: (a, b) => (a.cnic || 0) - (b.cnic || 0),
      editable: true,
    },
    {
      title: "Fee",
      dataIndex: "fee",
      key: "fee",
      width: 150,
      inputType: "number",
      sorter: (a, b) => (a.fee || 0) - (b.fee || 0),
      editable: true,
    },
    {
      title: "Pay Date",
      dataIndex: "pay_date",
      key: "pay_date",
      inputType: "number",
      width: 100,
      sorter: (a, b) => (a.pay_date || 0) - (b.pay_date || 0),
      editable: true,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      inputType: "date",
      width: 150,
      sorter: (a, b) => {
        if (!a.created_at) return -1;
        if (!b.created_at) return 1;
        return a.created_at.localeCompare(b.created_at);
      },
      render: (created_at: Date | null) =>
        created_at ? created_at.toString() : "N/A",
    },
    {
      title: "Modified At",
      dataIndex: "modified_at",
      key: "modified_at",
      inputType: "date",
      editable: true,
      width: 150,
      sorter: (a, b) => {
        if (!a.modified_at) return -1;
        if (!b.modified_at) return 1;
        return a.modified_at.localeCompare(b.modified_at);
      },
      render: (modified_at: Date | null) =>
        modified_at ? modified_at.toString() : "N/A",
    },
    {
      title: "Supervisor",
      dataIndex: "supervisor",
      key: "supervisor",
      inputType: "select",
      width: 150,
      sorter: (a, b) => a.supervisor?.localeCompare(b.supervisor || ""),
      editable: true,
    },
    {
      title: "Initial Charges",
      dataIndex: "intial_charges",
      key: "intial_charges",
      width: 150,
      sorter: (a, b) => (a.intial_charges || 0) - (b.intial_charges || 0),
      editable: true,
    },
    {
      title: "Package ID",
      dataIndex: "package_id",
      key: "package_id",
      width: 150,
      sorter: (a, b) => a.package_id?.localeCompare(b.package_id || ""),
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      fixed: "right",
      width: 150,
      responsive: ["md"],
      render: (_: any, record: User) => {
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
    },
  ];

  const edit = (record: User) => {
    form.setFieldsValue({ id: "", name: "", type: "", ...record });
    setEditingKey(record.id);
  };
  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as User;
      console.log(row);
      console.log(editingKey);
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
  const isEditing = (record: User) => record.id === editingKey;
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: User) => ({
        record,
        inputType: col.inputType ? col.inputType : "text",
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
          placeholder="Search name or type"
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
          scroll={{ x: 1500 }}
          dataSource={data.filter((data) => {
            const searchText = searchInput.toLowerCase();
            return (
              data.username?.toLowerCase().includes(searchText) ||
              data.full_name?.toLowerCase().includes(searchText) ||
              data.email?.toLowerCase().includes(searchText)
            );
          })}
        />
      </Form>
    </>
  );
};

export default UserListTable;

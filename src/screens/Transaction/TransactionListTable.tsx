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
import {
  Transaction,
  deleteTransactionFromAPI,
} from "features/transaction/transactionSlice"; // Assuming you have an interface for the Transaction model
import { deleteTransaction } from "features/transaction/transactionSlice"; // Import your deleteTransaction action
import { AppDispatch, RootState } from "/store";

interface TransactionListTableProps {
  transactions: Transaction[];
}

interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "text" | "number";
  record: Transaction;
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

const TransactionListTable: React.FC<TransactionListTableProps> = ({
  transactions,
}) => {
  console.log("Transactions list props", transactions);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [data, setData] = useState(transactions);
  const loading = useSelector((state: RootState) => state.transaction.loading);
  console.log("Transactions from effect 1", transactions);
  console.log("Loading from effect 1", loading);
  useEffect(() => {
    console.log("Transactions from effect", transactions);
    console.log("Loading from effect", loading);
    setData(transactions);
  }, [transactions]);

  const handleDelete = async (id: string) => {
    try {
      dispatch(deleteTransactionFromAPI(id));
      await message.success("Transaction deleted successfully.");
    } catch (error) {
      // If an error occurs during the API call or dispatching, it will be caught here
      // You can handle the error if needed
      message.error("Failed to delete transaction.");
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
    message.success("Selected Transactions deleted successfully.");
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: Transaction, b: Transaction) => a.id.localeCompare(b.id),
    },
    {
      title: "Debit Account",
      dataIndex: "debit_ac",
      key: "debit_ac",
      sorter: (a: Transaction, b: Transaction) =>
        a.debit_ac.localeCompare(b.debit_ac),
    },
    {
      title: "Credit Account",
      dataIndex: "credit_ac",
      key: "credit_ac",
      sorter: (a: Transaction, b: Transaction) =>
        a.credit_ac.localeCompare(b.credit_ac),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      editable: true,
      sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
    },
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: Transaction, b: Transaction) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      fixed: "right",
      width: 150,
      responsive: ["md"],
      render: (_: any, record: Transaction) => {
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
      render: (_: any, record: Transaction) => (
        <Popconfirm
          title="Are you sure you want to delete this transaction?"
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

  const edit = (record: Transaction) => {
    form.setFieldsValue({
      id: "",
      debit_ac: "",
      credit_ac: "",
      amount: "",
      desc: "",
      date: "",
      ...record,
    });
    setEditingKey(record.id);
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Transaction;

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

  const isEditing = (record: Transaction) => record.id === editingKey;

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Transaction) => ({
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
          placeholder="Search debit_ac, credit_ac, amount, desc, or date"
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
            // Filter the transactions based on searchInput
            return (
              data.debit_ac?.toString().toLowerCase().includes(searchText) ||
              data.credit_ac?.toString().toLowerCase().includes(searchText) ||
              data.amount?.toString().toLowerCase().includes(searchText) ||
              data.desc?.toLowerCase().includes(searchText) ||
              data.date?.toLowerCase().includes(searchText)
            );
          })}
        />
      </Form>
    </>
  );
};

export default TransactionListTable;

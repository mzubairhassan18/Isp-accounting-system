// import React, { useState, useEffect } from 'react';
// import { Table, Button, Popconfirm, message, Input, Form, Typography, Spin } from 'antd';
// import { useForm } from 'antd/es/form/Form';
// import { ColumnType } from 'antd/es/table';

// interface Entity {
//   id: string;
// }
// type DataIndex<T> = keyof T | string;

// export interface column1<T> extends ColumnType<T> {
//   title: string;
//   dataIndex: string;
//   key: string;
//   sorter?: (a: T, b: T) => number;
//   inputType?: 'text' | 'number';
//   render?: (text: any, record: T) => React.ReactNode;
// }
// type ColumnConfig = column1<T> & { editable?: boolean};

// interface GenericListTableProps<T extends Entity> {
//   data: T[];
//   columns: (ColumnConfig<T> | ColumnType<T>)[];
//   loading: boolean;
//   onDelete: (id: string) => void;
//   onEdit: (record: T) => void;
//   onSave: (record: T) => void;
//   onBulkDelete: () => void;
//   searchKey?: string;
//   scroll?: { x?: number | string; y?: number | string };
// }

// const EditableCell: React.FC<any> = ({
//   editing,
//   dataIndex,
//   title,
//   inputType,
//   record,
//   index,
//   children,
//   ...restProps
// }) => {
//   const [form] = Form.useForm();
//   const inputNode = inputType === 'number' ? <Input type="number" /> : <Input />;
//   return (
//     <td {...restProps}>
//       {editing ? (
//         <Form.Item
//           name={dataIndex as string}
//           style={{ margin: 0 }}
//           rules={[
//             {
//               required: true,
//               message: `Please Input ${title}!`,
//             },
//           ]}
//         >
//           {inputNode}
//         </Form.Item>
//       ) : (
//         children
//       )}
//     </td>
//   );
// };

// const GenericListTable = <T extends Entity>({
//   data,
//   columns,
//   loading,
//   onDelete,
//   onEdit,
//   onSave,
//   onBulkDelete,
//   searchKey,
//   scroll,
// }: GenericListTableProps<T>) => {
//   const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
//   const [searchInput, setSearchInput] = useState<string>('');
//   const [editingKey, setEditingKey] = useState<string | number>('');
//   const [form ] = useForm();
//   useEffect(() => {
//     if (searchKey) {
//       setSearchInput('');
//     }
//   }, [data]);

//   const handleSearch = (value: string) => {
//     setSearchInput(value);
//   };

//   const handleCancel = () => {
//     setEditingKey('');
//   };

//   const handleBulkDelete = () => {
//     onBulkDelete();
//     setSelectedRowKeys([]);
//     message.success('Selected items deleted successfully.');
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     setSearchInput('');
//   };

//   const handleEdit = (record: T) => {
//     setEditingKey(record.id);
//   };

//   const handleSave = async (record: T) => {
//     try {
//       const row = (await form.validateFields()) as T;
//       onSave(row);
//       setEditingKey('');
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo);
//     }
//   };

//   const isEditing = (record: T) => record.id === editingKey;

//   const mergedColumns: ColumnConfig<T>[] = columns.map((col) => {
//     if (!col.editable) {
//       return col as ColumnConfig<T>;
//     }
//     return {
//       ...col,
//       onCell: (record: T) => ({
//         record,
//         dataIndex: col.dataIndex as string,
//         title: col.title as string, // Ensure 'title' is of type 'string'
//         editing: isEditing(record),
//       }),
//     } as ColumnConfig<T>;
//   });
  
  

//   const rowSelection = {
//     selectedRowKeys,
//     onChange: (selectedKeys: string[]) => setSelectedRowKeys(selectedKeys),
//   };

//   return (
//     <>
//       <div style={{ marginBottom: 16 }}>
//         {loading && (
//           <div className="overlay">
//             <Spin size="large" />
//           </div>
//         )}
//         {searchKey && (
//           <Input.Search
//             placeholder={`Search ${searchKey}`}
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             onSearch={handleSearch}
//             style={{ width: 200, marginRight: 8 }}
//           />
//         )}
//         {onBulkDelete && (
//           <Button onClick={handleBulkDelete} disabled={selectedRowKeys.length === 0}>
//             Bulk Delete
//           </Button>
//         )}
//       </div>
//       <Form form={form} component={false}>
//         <Table
//           components={{
//             body: {
//               cell: EditableCell,
//             },
//           }}
//           rowKey="id"
//           rowSelection={rowSelection}
//           columns={mergedColumns}
//           rowClassName="editable-row"
//           pagination={{ pageSize: 10 }}
//           scroll={scroll}
//           dataSource={data.filter((item) =>
//             searchKey
//               ? (item[searchKey] as string)
//                   .toLowerCase()
//                   .includes(searchInput.toLowerCase())
//               : true
//           )}
//         />
//       </Form>
//     </>
//   );
// };

// export default GenericListTable;

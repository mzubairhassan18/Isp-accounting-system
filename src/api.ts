const BASE_URL = "http://localhost:3000";

export const apiEndpoints = {
  fetchAccounts: `${BASE_URL}/api/account/getAccounts`,
  createAccount: `${BASE_URL}/api/account/addAccount`,
  deleteAccount: (accountId: string) => `/api/accounts/${accountId}`,

  fetchUsers: `${BASE_URL}/api/user/getUsers`,
  createUser: `${BASE_URL}/api/user/addUser`,
  deleteUser: (userId: string) => `${BASE_URL}/api/user/deleteUser/${userId}`,
  checkUsernameAvailability: (username: string) =>
    `${BASE_URL}/api/user/getUser/${username}`,

  // role
  fetchRoles: `${BASE_URL}/api/role/getRoles`,
  createRole: `${BASE_URL}/api/role/addRole`,
  deleteRole: (userId: string) => `${BASE_URL}/api/role/deleteRole/${userId}`,

  //  employee
  fetchEmployees: `${BASE_URL}/api/employee/getEmployees`,
  createEmployee: `${BASE_URL}/api/employee/addEmployee`,
  deleteEmployee: (userId: string) =>
    `${BASE_URL}/api/employee/deleteEmployee/${userId}`,

  // Package
  fetchPackages: `${BASE_URL}/api/package/getPackages`,
  createPackage: `${BASE_URL}/api/package/addPackage`,
  deletePackage: (userId: string) =>
    `${BASE_URL}/api/package/deletePackage/${userId}`,

  // connection
  fetchConnections: `${BASE_URL}/api/connection/getConnections`,
  createConnection: `${BASE_URL}/api/connection/addConnection`,
  deleteConnection: (userId: string) =>
    `${BASE_URL}/api/connection/deleteConnection/${userId}`,

  // inventory
  fetchInventoryItems: `${BASE_URL}/api/inventory/getInventoryItems`,
  createInventoryItem: `${BASE_URL}/api/inventory/addInventoryItem`,
  deleteInventoryItem: (userId: string) =>
    `${BASE_URL}/api/inventory/deleteInventoryItem/${userId}`,

  // transaction
  fetchTransactions: `${BASE_URL}/api/transaction/getTransactions`,
  createTransaction: `${BASE_URL}/api/transaction/addTransaction`,
  deleteTransaction: (userId: string) =>
    `${BASE_URL}/api/transaction/deleteTransaction/${userId}`,

  // transaction
  fetchVendors: `${BASE_URL}/api/vendor/getVendors`,
  createVendor: `${BASE_URL}/api/vendor/addVendor`,
  deleteVendor: (userId: string) =>
    `${BASE_URL}/api/vendor/deleteVendor/${userId}`,
};

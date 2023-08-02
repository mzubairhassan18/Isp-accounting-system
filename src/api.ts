const BASE_URL = 'http://localhost:3000';

export const apiEndpoints = {
  fetchAccounts: `${BASE_URL}/api/account/getAccounts`,
  createAccount: `${BASE_URL}/api/account/addAccount`,
  deleteAccount: (accountId: string) => `/api/accounts/${accountId}`,
  
  fetchUsers: `${BASE_URL}/api/user/getUsers`,
  createUser: `${BASE_URL}/api/user/addUser`,
  deleteUser: (userId: string) => `${BASE_URL}/api/user/deleteUser/${userId}`,

  // role
  fetchRoles: `${BASE_URL}/api/role/getRoles`,
  createRole: `${BASE_URL}/api/role/addRole`,
  deleteRole: (userId: string) => `${BASE_URL}/api/role/deleteRole/${userId}`,

  // Package
  fetchPackages: `${BASE_URL}/api/package/getPackages`,
  createPackage: `${BASE_URL}/api/package/addPackage`,
  deletePackage: (userId: string) => `${BASE_URL}/api/package/deletePackage/${userId}`,

  // connection
  fetchConnections: `${BASE_URL}/api/connection/getConnections`,
  createConnection: `${BASE_URL}/api/connection/addConnection`,
  deleteConnection: (userId: string) => `${BASE_URL}/api/connection/deleteConnection/${userId}`,
};
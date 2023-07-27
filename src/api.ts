const BASE_URL = 'http://localhost:3000';

export const apiEndpoints = {
  fetchAccounts: `${BASE_URL}/api/account/getAccounts`,
  createAccount: `${BASE_URL}/api/account/addAccount`,
  deleteAccount: (accountId: string) => `/api/accounts/${accountId}`,
  
  fetchUsers: `${BASE_URL}/api/user/getUsers`,
  createUser: `${BASE_URL}/api/user/addUser`,
};
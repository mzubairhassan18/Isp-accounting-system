// src/store.ts

import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/account/accountSlice';
import userReducer from './features/user/userSlice';
import roleReducer from './features/role/roleSlice';
import packageReducer from './features/package/packageSlice';
import connectionReducer from './features/connection/connectionSlice';
import inventoryReducer from './features/inventory/inventorySlice';
import transactionReducer from './features/transaction/transactionSlice';
import vendorReducer from './features/vendor/vendorSlice';
import employeeReducer from './features/employee/employeeSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
    role: roleReducer,
    package: packageReducer,
    connection: connectionReducer,
    inventory: inventoryReducer,
    transaction: transactionReducer,
    vendor: vendorReducer,
    employee: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

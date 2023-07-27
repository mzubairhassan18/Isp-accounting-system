// src/store.ts

import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import accountReducer from './features/account/accountSlice';
import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;

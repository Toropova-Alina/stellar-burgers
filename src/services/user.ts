import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  getOrdersApi,
  TRegisterData,
  TLoginData,
  TAuthResponse
} from '../utils/burger-api';
import { getCookie, deleteCookie, setCookie } from '../utils/cookie';
import { TUser, TOrder } from '../utils/types';

export interface UserState {
  data: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  orders: TOrder[];
}

const initialState: UserState = {
  data: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: false,
  error: null,
  orders: []
};

export const registerUser = createAsyncThunk<
  TAuthResponse,
  TRegisterData,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    return response;
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Registration error');
  }
});

export const loginUser = createAsyncThunk<
  TAuthResponse,
  TLoginData,
  { rejectValue: string }
>('user/loginUser', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    return response;
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Login error');
  }
});

export const checkUser = createAsyncThunk<
  { user: TUser },
  void,
  { rejectValue: string }
>('user/checkUser', async (_, { rejectWithValue }) => {
  const token = getCookie('accessToken');
  if (!token) {
    return rejectWithValue('The token is missing');
  }
  try {
    const response = await getUserApi();
    return { user: response.user };
  } catch (err: any) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    return rejectWithValue(err.message || 'Invalid token');
  }
});

export const updateUser = createAsyncThunk<
  { user: TUser },
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUser', updateUserApi);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutApi();
      }
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (err: any) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(err.message || 'Exit error');
    }
  }
);

export const getOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('user/getOrders', getOrdersApi);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: UserState) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (
      state: UserState,
      action: PayloadAction<string | undefined>
    ) => {
      state.loading = false;
      state.error = action.payload || 'Unknown error';
    };

    builder
      // registerUser
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload;
        setCookie('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        state.loading = false;
        state.data = user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, handleRejected)

      // loginUser
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, (state, action) => {
        const { accessToken, refreshToken, user } = action.payload;
        setCookie('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        state.loading = false;
        state.data = user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, handleRejected)

      // checkUser
      .addCase(checkUser.pending, handlePending)
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.error = action.payload || null;
      })

      // updateUser
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.user;
      })
      .addCase(updateUser.rejected, handleRejected)

      // logoutUser
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.orders = [];
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.data = null;
        state.orders = [];
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })

      // getOrders
      .addCase(getOrders.pending, handlePending)
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, handleRejected);
  }
});

export const { clearUserError } = userSlice.actions;

export const userDataSelector = (state: { user: UserState }) => state.user.data;
export const isAuthCheckedSelector = (state: { user: UserState }) =>
  state.user.isAuthChecked;
export const isAuthenticatedSelector = (state: { user: UserState }) =>
  state.user.isAuthenticated;
export const userErrorSelector = (state: { user: UserState }) =>
  state.user.error;
export const userOrdersSelector = (state: { user: UserState }) =>
  state.user.orders;

export default userSlice.reducer;

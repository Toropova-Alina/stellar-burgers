import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../utils/burger-api';
import { TOrder } from '@utils-types';

export interface OrderState {
  orderModalData: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderModalData: null,
  loading: false,
  error: null
};

export const orderBurger = createAsyncThunk<
  { order: TOrder; name: string },
  string[],
  { rejectValue: string }
>('order/orderBurger', orderBurgerApi);

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    console.log(response.orders);
    return response.orders[0];
  } catch (err: any) {
    return rejectWithValue(err?.message || 'Failed to fetch order');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const orderRequestSelect = (state: { order: OrderState }) =>
  state.order.loading;
export const orderModalDataSelect = (state: { order: OrderState }) =>
  state.order.orderModalData;

export default orderSlice.reducer;

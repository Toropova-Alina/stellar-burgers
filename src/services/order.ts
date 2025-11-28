import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../utils/burger-api';
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
      });
  }
});

export const { clearOrder } = orderSlice.actions;

export const orderRequestSelect = (state: { order: OrderState }) =>
  state.order.loading;
export const orderModalDataSelect = (state: { order: OrderState }) =>
  state.order.orderModalData;

export default orderSlice.reducer;

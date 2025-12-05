import orderSlice, { orderBurger, OrderState, getOrderByNumber } from './order';
import { TOrder } from '@utils-types';

const expectedOrder: TOrder = {
  _id: '1',
  name: 'Био-марсианский краторный бургер',
  status: 'done',
  createdAt: '2025-12-05T00:00:00.000Z',
  updatedAt: '2025-12-05T00:00:00.000Z',
  number: 12345,
  ingredients: []
};

const initialState: OrderState = {
  orderModalData: null,
  loading: false,
  error: null
};

describe('order test', () => {
  test('orderBurger/pending', () => {
    const state = orderSlice(initialState, { type: orderBurger.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('orderBurger/fulfilled', () => {
    const state = orderSlice(initialState, {
      type: orderBurger.fulfilled.type,
      payload: {
        order: expectedOrder,
        name: expectedOrder.name
      }
    });

    expect(state.loading).toBe(false);
    expect(state.orderModalData).toEqual(expectedOrder);
  });

  test('orderBurger/rejected', () => {
    const state = orderSlice(initialState, {
      type: orderBurger.rejected.type,
      payload: 'Order error'
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Order error');
  });

  test('getOrderByNumber/pending', () => {
    const state = orderSlice(initialState, {
      type: getOrderByNumber.pending.type
    });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('getOrderByNumber/fulfilled', () => {
    const state = orderSlice(initialState, {
      type: getOrderByNumber.fulfilled.type,
      payload: expectedOrder
    });

    expect(state.loading).toBe(false);
    expect(state.orderModalData).toEqual(expectedOrder);
  });

  test('getOrderByNumber/rejected', () => {
    const state = orderSlice(initialState, {
      type: getOrderByNumber.rejected.type,
      payload: 'Order error'
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Order error');
  });
});

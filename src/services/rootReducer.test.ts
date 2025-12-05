import { RootState, rootReducer } from './store';
import { expect, test, describe } from '@jest/globals';

const expectedState: RootState = {
  ingredients: {
    ingredients: [],
    loading: false,
    error: null
  },
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  feed: {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  },
  order: {
    orderModalData: null,
    loading: false,
    error: null
  },
  user: {
    data: null,
    isAuthChecked: false,
    isAuthenticated: false,
    loading: false,
    error: null,
    orders: []
  }
};

describe('rootReducer', () => {
  test('Initialization rootReducer', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(expectedState);
  });
});

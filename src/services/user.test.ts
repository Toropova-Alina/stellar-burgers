import userSlice, {
  registerUser,
  loginUser,
  checkUser,
  updateUser,
  logoutUser,
  getOrders,
  clearUserError,
  UserState
} from './user';
import { TUser, TOrder } from '../utils/types';

const expectedUser: TUser = {
  email: 'al.test@yandex.ru',
  name: 'Алина'
};

const expectedOrder: TOrder = {
  _id: '1',
  name: 'Био-марсианский краторный бургер',
  status: 'done',
  createdAt: '2025-12-05T00:00:00.000Z',
  updatedAt: '2025-12-05T00:00:00.000Z',
  number: 12345,
  ingredients: []
};

const expectedUpdatedUser: TUser = {
  ...expectedUser,
  name: 'New Name'
};

const initialState: UserState = {
  data: null,
  isAuthChecked: false,
  isAuthenticated: false,
  loading: false,
  error: null,
  orders: []
};

describe('user test', () => {
  // registerUser
  test('registerUser/pending', () => {
    const state = userSlice(initialState, { type: registerUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('registerUser/fulfilled', () => {
    const state = userSlice(initialState, {
      type: registerUser.fulfilled.type,
      payload: {
        user: expectedUser
      }
    });

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(expectedUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('registerUser/rejected', () => {
    const state = userSlice(initialState, {
      type: registerUser.rejected.type,
      payload: 'Register error'
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Register error');
  });

  // loginUser
  test('loginUser/pending', () => {
    const state = userSlice(initialState, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('loginUser/fulfilled', () => {
    const state = userSlice(initialState, {
      type: loginUser.fulfilled.type,
      payload: {
        user: expectedUser
      }
    });

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(expectedUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('loginUser/rejected', () => {
    const state = userSlice(initialState, {
      type: loginUser.rejected.type,
      payload: 'Login error'
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Login error');
  });

  // checkUser
  test('checkUser/pending', () => {
    const state = userSlice(initialState, { type: checkUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('checkUser/fulfilled', () => {
    const state = userSlice(initialState, {
      type: checkUser.fulfilled.type,
      payload: { user: expectedUser }
    });

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(expectedUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  test('checkUser/rejected', () => {
    const state = userSlice(initialState, {
      type: checkUser.rejected.type,
      payload: 'Invalid token'
    });

    expect(state.loading).toBe(false);
    expect(state.data).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Invalid token');
  });

  // updateUser
  test('updateUser/pending', () => {
    const state = userSlice(initialState, { type: updateUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('updateUser/fulfilled', () => {
    const state = userSlice(
      { ...initialState, data: expectedUser },
      {
        type: updateUser.fulfilled.type,
        payload: { user: expectedUpdatedUser }
      }
    );

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(expectedUpdatedUser);
  });

  test('updateUser/rejected', () => {
    const state = userSlice(initialState, {
      type: updateUser.rejected.type,
      payload: 'Update error'
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Update error');
  });

  // logoutUser
  test('logoutUser/pending', () => {
    const state = userSlice(initialState, { type: logoutUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('logoutUser/fulfilled', () => {
    const state = userSlice(
      {
        ...initialState,
        data: expectedUser,
        isAuthenticated: true,
        isAuthChecked: true,
        orders: [expectedOrder]
      },
      { type: logoutUser.fulfilled.type }
    );

    expect(state.data).toBeNull();
    expect(state.orders).toEqual([]);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('logoutUser/rejected', () => {
    const state = userSlice(initialState, {
      type: logoutUser.rejected.type,
      payload: 'Logout error'
    });
    expect(state.data).toBeNull();
    expect(state.orders).toEqual([]);
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Logout error');
  });

  // getOrders
  test('getOrders/pending', () => {
    const state = userSlice(initialState, { type: getOrders.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('getOrders/fulfilled', () => {
    const state = userSlice(initialState, {
      type: getOrders.fulfilled.type,
      payload: [expectedOrder]
    });
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual([expectedOrder]);
  });

  test('getOrders/rejected', () => {
    const state = userSlice(initialState, {
      type: getOrders.rejected.type,
      payload: 'Profile orders error'
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Profile orders error');
  });
});

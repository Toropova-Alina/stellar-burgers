import feedSlice, { fetchFeed, FeedState } from './feed';
import { TOrdersData } from '@utils-types';

const expectedFeed: TOrdersData = {
  orders: [
    {
      _id: '1',
      name: 'Био-марсианский краторный бургер',
      status: 'done',
      createdAt: '2025-12-05T00:00:00.000Z',
      updatedAt: '2025-12-05T00:00:00.000Z',
      number: 12345,
      ingredients: []
    }
  ],
  total: 10,
  totalToday: 1
};
const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

describe('feed test', () => {
  test('fetchFeed/pending', () => {
    const state = feedSlice(initialState, { type: fetchFeed.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchFeed/fulfilled', () => {
    const state = feedSlice(initialState, {
      type: fetchFeed.fulfilled.type,
      payload: expectedFeed
    });

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(expectedFeed.orders);
    expect(state.total).toBe(expectedFeed.total);
    expect(state.totalToday).toBe(expectedFeed.totalToday);
  });

  test('fetchFeed/rejected', () => {
    const state = feedSlice(initialState, {
      type: fetchFeed.rejected.type,
      payload: 'Feed error'
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Feed error');
  });
});

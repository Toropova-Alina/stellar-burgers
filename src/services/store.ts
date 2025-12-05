import { configureStore, combineSlices } from '@reduxjs/toolkit';
import ingredientsSlise from './ingredients';
import constructorSlice from './constructor';
import feedSlice from './feed';
import orderSlice from './order';
import userSlice from './user';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices({
  ingredients: ingredientsSlise,
  burgerConstructor: constructorSlice,
  feed: feedSlice,
  order: orderSlice,
  user: userSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
export { rootReducer };

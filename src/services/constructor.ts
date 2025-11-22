import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

export interface ConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: uuidv4()
      };

      if (ingredient.type === 'bun') {
        state.bun = constructorIngredient;
      } else {
        state.ingredients.push(constructorIngredient);
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const clientId = action.payload;
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== clientId
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredient = state.ingredients[fromIndex];
      const newIngredients = state.ingredients.filter(
        (_, i) => i !== fromIndex
      );
      newIngredients.splice(toIndex, 0, ingredient);
      state.ingredients = newIngredients;
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;

export const constructorBunSelect = (state: {
  burgerConstructor: ConstructorState;
}): TConstructorIngredient | null => state.burgerConstructor.bun;

export const constructorIngredientsSelect = (state: {
  burgerConstructor: ConstructorState;
}): TConstructorIngredient[] => state.burgerConstructor.ingredients;

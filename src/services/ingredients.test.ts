import ingredientsSlice, {
  fetchIngredients,
  IngredientsState
} from './ingredients';
import { TIngredient } from '@utils-types';

const expectedIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    calories: 4242,
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    image: 'https://code.s3.yandex.net/react/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    price: 424
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    calories: 30,
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    image: 'https://code.s3.yandex.net/react/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    price: 90
  }
];

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

describe('ingredients test', () => {
  test('fetchIngredients/pending ', () => {
    const state = ingredientsSlice(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients/fulfilled', () => {
    const state = ingredientsSlice(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: expectedIngredients
    });

    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(expectedIngredients);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients/rejected', () => {
    const state = ingredientsSlice(initialState, {
      type: fetchIngredients.rejected.type,
      payload: 'Ingredients error'
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ingredients error');
  });
});

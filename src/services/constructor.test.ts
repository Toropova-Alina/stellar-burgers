import constructorSlice, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  ConstructorState
} from './constructor';
import { TIngredient } from '@utils-types';
import { expect, test, describe } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

const mockUuid = uuidv4 as jest.Mock;
mockUuid
  .mockReturnValueOnce('id-bun-1')
  .mockReturnValueOnce('id-bun-2')
  .mockReturnValueOnce('id-main-1')
  .mockReturnValueOnce('id-sauce-1');

const expectedBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  calories: 420,
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  price: 1255
};

const anotherExpectedBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  calories: 643,
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  price: 988
};

const expectedMain: TIngredient = {
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
};

const expectedSauce: TIngredient = {
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
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

describe('constructor test', () => {
  test('addIngredient (bun)', () => {
    let state = constructorSlice(initialState, addIngredient(expectedBun));
    expect(state.bun).toEqual({ ...expectedBun, id: 'id-bun-1' });
    state = constructorSlice(state, addIngredient(anotherExpectedBun));
    expect(state.bun).toEqual({ ...anotherExpectedBun, id: 'id-bun-2' });
  });

  test('addIngredient (main and sauce)', () => {
    let state = constructorSlice(initialState, addIngredient(expectedMain));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({ ...expectedMain, id: 'id-main-1' });

    state = constructorSlice(state, addIngredient(expectedSauce));
    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual({ ...expectedMain, id: 'id-main-1' });
    expect(state.ingredients[1]).toEqual({
      ...expectedSauce,
      id: 'id-sauce-1'
    });
  });

  test('removeIngredient', () => {
    let state = constructorSlice(initialState, addIngredient(expectedMain));
    expect(state.ingredients).toHaveLength(1);
    const ingredientsId = state.ingredients[0].id;
    state = constructorSlice(state, removeIngredient(ingredientsId));
    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredient', () => {
    let state = constructorSlice(initialState, addIngredient(expectedMain));
    state = constructorSlice(state, addIngredient(expectedSauce));
    expect(state.ingredients).toHaveLength(2);

    const [firstId, secondId] = state.ingredients.map((i) => i.id!);
    state = constructorSlice(
      state,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );
    const movedIds = state.ingredients.map((i) => i.id!);
    expect(movedIds).toEqual([secondId, firstId]);
  });

  test('clearConstructor', () => {
    let state = constructorSlice(initialState, addIngredient(expectedBun));
    state = constructorSlice(state, addIngredient(expectedMain));
    expect(state.ingredients).toHaveLength(1);

    state = constructorSlice(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});

describe('Burger constructor page', () => {
  beforeEach(() => {
    cy.setCookie('accessToken', 'mock-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    cy.intercept('GET', '**/ingredients', {
      statusCode: 200,
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      fixture: 'user.json'
    });
    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Add ingredient', () => {
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]')
      .find('button')
      .click();
    cy.get('[data-cy=ingredients]').should('exist');
    cy.get('[data-cy=ingredients]').contains(
      'Биокотлета из марсианской Магнолии'
    );

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0942]')
      .find('button')
      .click();
    cy.get('[data-cy=ingredients]').should('exist');
    cy.get('[data-cy=ingredients]').contains('Соус Spicy-X');

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]')
      .find('button')
      .click();
    cy.get('[data-cy=bun-top]').should('exist');
    cy.get('[data-cy=bun-bottom]').should('exist');
    cy.get('[data-cy=bun-top]').contains('Краторная булка N-200i');
    cy.get('[data-cy=bun-bottom]').contains('Краторная булка N-200i');

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093d]')
      .find('button')
      .click();
    cy.get('[data-cy=bun-top]').should('exist');
    cy.get('[data-cy=bun-bottom]').should('exist');
    cy.get('[data-cy=bun-top]').contains('Флюоресцентная булка R2-D3');
    cy.get('[data-cy=bun-bottom]').contains('Флюоресцентная булка R2-D3');
  });

  it('Open and close modal', () => {
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]').click();
    cy.get('[data-cy=modal]')
      .contains('Детали ингредиента')
      .should('be.visible');

    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]').click();
    cy.get('[data-cy=modal]').find('button').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Order check', () => {
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]')
      .find('button')
      .click();
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]')
      .find('button')
      .click();
    cy.get('[data-cy=bun-top]').should('exist');
    cy.get('[data-cy=bun-bottom]').should('exist');
    cy.get('[data-cy=ingredients]').should('exist');
    cy.get('[data-cy=bun-top]').contains('Краторная булка N-200i');
    cy.get('[data-cy=bun-bottom]').contains('Краторная булка N-200i');
    cy.get('[data-cy=ingredients]').contains(
      'Биокотлета из марсианской Магнолии'
    );

    cy.get('[data-cy=constructor-button]').find('button').click();
    cy.wait('@createOrder');

    cy.get('[data-cy=modal]').should('be.visible');
    cy.contains('12345').should('exist');
    cy.get('[data-cy=modal]').find('button').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=bun-top]').contains('Выберите булки');
    cy.get('[data-cy=bun-bottom]').contains('Выберите булки');
    cy.get('[data-cy=ingredients]').contains('Выберите начинку');
  });
});

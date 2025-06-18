// Example command (optional)
Cypress.Commands.add('visitHome', () => {
  cy.visit('/');
});

// Add TypeScript definitions
declare global {
  namespace Cypress {
    interface Chainable {
      visitHome(): Chainable<void>;
    }
  }
}

export {};

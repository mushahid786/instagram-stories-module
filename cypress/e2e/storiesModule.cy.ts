describe('StoriesModule E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render all user avatars', () => {
    cy.get('.user-imagse-list .user-list').should('have.length.at.least', 1);
  });

  it('should open story viewer on avatar click', () => {
    cy.get('.user-list').first().click();
    cy.get('.story-viewer-overlay').should('exist');
  });

  it('should display progress bars in story viewer', () => {
    cy.get('.user-list').first().click();
    cy.get('.story-progress-bar').should('have.length.at.least', 1);
  });

  it('should close the story viewer on clicking ✕', () => {
    cy.get('.user-list').first().click();
    cy.get('.story-close-button').click();
    cy.get('.story-viewer-overlay').should('not.exist');
  });
});

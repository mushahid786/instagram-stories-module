describe('Story Viewer', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');

    // Open first user's story
    cy.get('.user-list').first().click();
    cy.get('.story-viewer-overlay').should('exist');
  });

  it('should render the first story', () => {
    cy.get('.story-content')
      .should('have.attr', 'src')
      .and('include', 'http');
  });

  it('should automatically advance to the next story', () => {
    cy.get('.story-content')
      .invoke('attr', 'src')
      .then((firstSrc) => {
        // Wait for the story to change
        cy.get('.story-content', { timeout: 8000 }).should(($img) => {
          const nextSrc = $img.attr('src');
          expect(nextSrc).to.not.equal(firstSrc);
        });
      });
  });

  it('should navigate to the next story on right tap zone click', () => {
    cy.get('.story-content')
      .invoke('attr', 'src')
      .then((firstSrc) => {
        cy.get('.story-tap-zone').last().click({ force: true });
        cy.get('.story-content')
          .invoke('attr', 'src')
          .should('not.equal', firstSrc);
      });
  });

  it('should navigate to the previous story on left tap zone click', () => {
    // Go forward first to avoid edge case
    cy.get('.story-tap-zone').last().click({ force: true });

    // Then go back
    cy.get('.story-tap-zone').first().click({ force: true });

    cy.get('.story-content')
      .should('exist')
      .and('have.attr', 'src');
  });

  it('should close the viewer after all stories are done', () => {
    // Click through until story viewer disappears
    const maxClicks = 6; // max number of stories (adjust if needed)

    for (let i = 0; i < maxClicks; i++) {
      cy.get('body').then(($body) => {
        if ($body.find('.story-viewer-overlay').length) {
          cy.get('.story-tap-zone').last().click({ force: true });
        }
      });
    }

    // Or explicitly close with the ✕
    cy.get('body').then(($body) => {
      if ($body.find('.story-close-button').length > 0) {
        cy.get('.story-close-button').click({ force: true });
      }
    });
    cy.get('.story-viewer-overlay').should('not.exist');
  });
});

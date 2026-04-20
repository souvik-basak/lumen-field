describe('Fan Experience Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('allows a user to select a stadium and navigate the dashboard', () => {
    // 1. Stadium Selection
    cy.contains('Popular Cities').should('be.visible');
    cy.contains('Kolkata').click();
    
    // 2. Dashboard Verification
    cy.contains('DISCOVER').should('be.visible');
    cy.contains('LUMEN FIELD').should('be.visible');
    
    // 3. Navigation to Map
    cy.get('nav').contains('Map').click();
    cy.url().should('include', '/fan/navigate');
    cy.contains('Interactive Map').should('be.visible');
    
    // 4. Check Smart Suggestions
    cy.get('nav').contains('Home').click();
    cy.contains('Smart Suggestions').should('be.visible');
    
    // 5. Test Google Auth Mock
    cy.contains('Sign in with Google').click();
    cy.wait(2000); // Wait for mock timeout
    cy.contains('Welcome back').should('be.visible');
  });

  it('can navigate to food ordering', () => {
    cy.contains('Kolkata').click();
    cy.get('nav').contains('Order').click();
    cy.url().should('include', '/fan/food');
    cy.contains('Kolkata Kati Rolls').should('be.visible');
  });
});

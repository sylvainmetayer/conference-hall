type ProposalFormType = {
  title?: string;
  abstract?: string;
  level?: string;
  language?: string;
  references?: string;
};

class EventEditProposalPage {
  visit(eventSlug: string, proposalId: string) {
    cy.visit(`/${eventSlug}/proposals/${proposalId}/edit`);
    this.isPageVisible();
  }

  isPageVisible() {
    cy.findByRole('button', { name: 'Save proposal' }).should('exist');
  }

  fillProposalForm(data: ProposalFormType) {
    if (data.title) cy.typeOn('Title', data.title);
    if (data.abstract) cy.typeOn('Abstract', data.abstract);
    if (data.level) cy.clickOn(data.level);
    if (data.language) cy.selectOn('Languages', data.language);
    if (data.references) cy.typeOn('References', data.references);
  }

  selectFormatTrack(format: string) {
    cy.clickOn(format);
  }

  selectCategoryTrack(category: string) {
    cy.clickOn(category);
  }

  saveAbstract() {
    return cy.findByRole('button', { name: 'Save proposal' });
  }

  error(label: string) {
    return cy
      .findByLabelText(label)
      .invoke('attr', 'id')
      .then((id) => {
        return cy.get(`#${id}-description`);
      });
  }
}

export default EventEditProposalPage;

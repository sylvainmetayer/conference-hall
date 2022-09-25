import OrganizerEventNewPage from 'page-objects/organizer-event-new.page';
import OrganizerEventSettingsPage from 'page-objects/organizer-event-settings.page';
import OrganizationEventsPage from 'page-objects/organizer-events.page';

describe('Organizer event creation', () => {
  beforeEach(() => {
    cy.task('seedDB', 'organizer/event-new');
  });

  afterEach(() => cy.task('disconnectDB'));

  const eventNew = new OrganizerEventNewPage();
  const eventSettings = new OrganizerEventSettingsPage();
  const eventsList = new OrganizationEventsPage();

  describe('as a organization owner', () => {
    beforeEach(() => cy.login('Clark Kent'));

    it('can create a new conference', () => {
      eventNew.visit('awesome-orga');
      eventNew.newConference();
      eventNew.isConferenceStepVisible();
      eventNew.fillForm({ name: 'Hello world' });
      cy.assertInputText('Event URL', 'hello-world');
      eventNew.newEvent().click();
      eventSettings.isPageVisible();
      cy.assertText('conference');
      cy.assertInputText('Name', 'Hello world');
      cy.assertInputText('Event URL', 'hello-world');
    });

    it('can create a new meetup', () => {
      eventNew.visit('awesome-orga');
      eventNew.newMeetup();
      eventNew.isMeetupStepVisible();
      eventNew.fillForm({ name: 'Hello world' });
      cy.assertInputText('Event URL', 'hello-world');
      eventNew.newEvent().click();
      eventSettings.isPageVisible();
      cy.assertText('meetup');
      cy.assertInputText('Name', 'Hello world');
      cy.assertInputText('Event URL', 'hello-world');
    });

    it('cannot create an event with an existing slug', () => {
      eventNew.visit('awesome-orga');
      eventNew.newConference();
      eventNew.isConferenceStepVisible();
      eventNew.fillForm({ name: 'Hello world', slug: 'event-1' });
      eventNew.newEvent().click();
      eventNew.error('Event URL').should('contain.text', 'Slug already exists, please try another one.');
    });
  });

  it('cannot create new event as a organization member', () => {
    cy.login('Bruce Wayne');
    cy.visit(`/organizer/awesome-orga/new`);
    eventsList.isPageVisible();
  });

  it('cannot create new event as a organization reviewer', () => {
    cy.login('Bruce Wayne');
    cy.visit(`/organizer/awesome-orga/new`);
    eventsList.isPageVisible();
  });
});

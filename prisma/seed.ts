import { eventFormatFactory } from '../tests/factories/formats';
import { eventCategoryFactory } from '../tests/factories/categories';
import { eventFactory } from '../tests/factories/events';
import { userFactory } from 'tests/factories/users';
import { organizationFactory } from 'tests/factories/organization';
import { talkFactory } from 'tests/factories/talks';
import { proposalFactory } from 'tests/factories/proposals';

async function seed() {
  const user = await userFactory({ traits: ['clark-kent'] });
  const user2 = await userFactory({ traits: ['bruce-wayne'] });
  const user3 = await userFactory({ traits: ['peter-parker'] });

  const organization = await organizationFactory({
    owners: [user],
    members: [user2],
    attributes: { name: 'GDG Nantes', slug: 'gdg-nantes' },
  });

  const event = await eventFactory({
    traits: ['conference', 'conference-cfp-open', 'withSurvey'],
    organization,
    attributes: {
      name: 'Devfest Nantes',
      slug: 'devfest-nantes',
      maxProposals: 3,
    },
  });
  const format1 = await eventFormatFactory({ event });
  const format2 = await eventFormatFactory({ event });
  await eventFormatFactory({ event });
  const cat1 = await eventCategoryFactory({ event });
  const cat2 = await eventCategoryFactory({ event });
  await eventCategoryFactory({ event });

  await eventFactory({
    traits: ['meetup-cfp-open'],
    organization,
    attributes: { name: 'GDG Nantes', slug: 'gdg-nantes' },
  });

  await eventFactory({
    traits: ['conference', 'private'],
    organization,
    attributes: { name: 'VIP event', slug: 'vip-event' },
  });

  const organization2 = await organizationFactory({
    owners: [user2],
    members: [user],
    attributes: { name: 'Devoxx', slug: 'devoxx' },
  });

  await eventFactory({
    traits: ['conference-cfp-past'],
    attributes: { name: 'Devoxx France', slug: 'devoxx-france' },
    organization: organization2,
  });

  await eventFactory({
    traits: ['conference-cfp-future'],
    attributes: { name: 'BDX.io', slug: 'bdx-io' },
  });

  await eventFactory({
    traits: ['conference-cfp-open'],
    attributes: { name: 'Sunny Tech', slug: 'sunny-tech' },
  });

  await Promise.all(Array.from({ length: 50 }).map(() => eventFactory({ traits: ['meetup-cfp-open'] })));

  const talk1 = await talkFactory({
    attributes: {
      title: 'Awesome talk',
      abstract: 'This is an awesome talk',
      references: 'Best talk ever',
      level: 'BEGINNER',
      languages: ['fr'],
    },
    speakers: [user3],
  });

  await proposalFactory({ talk: talk1, event, categories: [cat1], formats: [format1], traits: ['submitted'] });

  const talk2 = await talkFactory({
    attributes: {
      title: 'Awesome talk 2',
      abstract: 'This is an awesome talk 2',
      references: 'Best talk ever',
      level: 'BEGINNER',
      languages: ['en'],
    },
    speakers: [user3, user2],
  });

  await proposalFactory({ talk: talk2, event, categories: [cat2], formats: [format1, format2], traits: ['accepted'] });

  const talk3 = await talkFactory({
    attributes: {
      title: 'Awesome talk 3',
      abstract: 'This is an awesome talk 3',
      references: 'Best talk ever',
      level: 'ADVANCED',
      languages: ['fr'],
    },
    speakers: [user3],
  });

  await proposalFactory({ talk: talk3, event, categories: [], formats: [], traits: ['rejected'] });
}

seed();

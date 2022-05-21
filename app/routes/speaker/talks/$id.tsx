import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Container } from '~/components/layout/Container';
import Badge from '../../../components/Badges';
import { ButtonLink } from '../../../components/Buttons';
import { Markdown } from '../../../components/Markdown';
import { H1, H2, Text } from '../../../components/Typography';
import { EventActivity } from '../components/Activity';
import { requireUserSession } from '../../../features/auth/auth.server';
import { getSpeakerTalk, SpeakerTalk } from '../../../features/speaker-talks.server';
import { getLanguage } from '../../../utils/languages';
import { getLevel } from '../../../utils/levels';
import TalkActions from '../components/TalkActions';
import { AddCoSpeakerButton } from '../components/CoSpeaker';

export const loader: LoaderFunction = async ({ request, params }) => {
  const uid = await requireUserSession(request);
  try {
    const talk = await getSpeakerTalk(uid, params.id);
    return json<SpeakerTalk>(talk);
  } catch {
    throw new Response('Talk not found.', { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const uid = await requireUserSession(request);
  const talkId = params.id;
  const form = await request.formData();
  const action = form.get('_action');
  if (action === 'speaker-invitation') {
    const invitationId = talkId + '-' + uid;
    return json({
      link: `http://localhost:3000/invitation/${invitationId}`,
    });
  }
}

export default function SpeakerTalkRoute() {
  const talk = useLoaderData<SpeakerTalk>();

  return (
    <Container className="mt-8">
      <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
        <div>
          <H1>{talk.title}</H1>
          <div className="mt-2 flex gap-2">
            <Badge color='indigo'>{getLevel(talk.level)}</Badge>
            <Badge color='indigo'>{getLanguage(talk.language)}</Badge>
          </div>
        </div>

        <div className="flex-shrink-0 space-x-4">
          <TalkActions />
          <ButtonLink to={`/search?talkId=${talk.id}`}>Submit</ButtonLink>
        </div>
      </div>

      <div className="flex flex-row gap-4 mt-8">
        <div className="w-2/3 bg-white border border-gray-200 overflow-hidden sm:rounded-lg p-4">
          <H2>Abstract</H2>
          <Markdown source={talk.abstract} className="mt-2" />
          <H2 className="mt-8">References</H2>
          <Markdown source={talk.references} className="mt-2" />
        </div>
        <div className="w-1/3">
          <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg p-4">
            <H2>Speakers</H2>
            {talk.speakers.map((speaker) => (
              <div key={speaker.id} className="mt-4 flex items-center">
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={speaker.photoURL || 'http://placekitten.com/100/100'}
                  alt={speaker.name || 'Speaker'}
                />
                <Text className="ml-3">{speaker.name}</Text>
              </div>
            ))}
            <AddCoSpeakerButton />
          </div>
          <div className="bg-white border border-gray-200 overflow-hidden sm:rounded-lg p-4 mt-4">
            <H2>Submissions</H2>
            <div className="mt-4">
              {talk.proposals.map((proposal) => (
                <EventActivity
                  key={proposal.eventSlug}
                  eventSlug={proposal.eventSlug}
                  eventName={proposal.eventName}
                  date={proposal.date}
                  status={proposal.status}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

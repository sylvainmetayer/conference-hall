import { GlobeIcon, HeartIcon, MailIcon } from '@heroicons/react/solid';
import { useCatch } from '@remix-run/react';
import { Container } from '~/components-ui/Container';
import { useEvent } from '../$eventSlug';
import { ButtonLink } from '../../components-ui/Buttons';
import { CfpHeader } from '../../components-app/CfpInfo';
import { ExternalLink } from '../../components-ui/Links';
import { Markdown } from '../../components-ui/Markdown';
import { H2, Text } from '../../components-ui/Typography';

export default function EventRoute() {
  const event = useEvent();
  return (
    <div>
      <section className="border-b border-gray-200 py-8">
        <Container className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <CfpHeader
            cfpState={event.cfpState}
            cfpStart={event.cfpStart}
            cfpEnd={event.cfpEnd}
          />
          {event.cfpState === 'OPENED' && (
            <div className="flex-shrink-0">
              <ButtonLink to="submission" block>
                Submit a proposal
              </ButtonLink>
            </div>
          )}
        </Container>
      </section>

      <img
        src={event.bannerUrl || 'https://placekitten.com/1200/300'}
        className="w-full bg-gray-100 object-cover lg:h-64"
        height="256px"
        aria-hidden="true"
        alt=""
      />

      <section className="pt-16 pb-8">
        <Container>
          {event.websiteUrl || event.contactEmail || event.codeOfConductUrl ? (
            <div className="flex gap-16">
              {event.websiteUrl && (
                <ExternalLink href={event.websiteUrl} icon={GlobeIcon}>
                  Website
                </ExternalLink>
              )}
              {event.contactEmail && (
                <ExternalLink
                  href={`mailto:${event.contactEmail}`}
                  icon={MailIcon}
                >
                  Contacts
                </ExternalLink>
              )}
              {event.codeOfConductUrl && (
                <ExternalLink href={event.codeOfConductUrl} icon={HeartIcon}>
                  Code of conduct
                </ExternalLink>
              )}
            </div>
          ) : null}
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <Markdown source={event.description} size="base" />
        </Container>
      </section>

      {event.formats.length > 0 || event.categories.length > 0 ? (
        <section className="py-8">
          <Container className="grid grid-cols-2 gap-16">
            {event.formats.length > 0 ? (
              <div>
                <H2>Formats</H2>
                <Text variant="secondary" className="mt-1">
                  Talks formats proposed by the conference.
                </Text>
                <div className="mt-4">
                  <dl className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
                    {event.formats.map((f) => (
                      <div key={f.name} className="py-3 pl-3 pr-4">
                        <Text
                          as="dt"
                          variant="secondary"
                          className="font-semibold"
                        >
                          {f.name}
                        </Text>
                        <Text as="dd" className="mt-1">
                          {f.description}
                        </Text>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ) : null}

            {event.categories.length > 0 ? (
              <div>
                <H2>Categories</H2>
                <Text variant="secondary" className="mt-1">
                  Different categories and tracks proposed by the conference.
                </Text>
                <div className="mt-4">
                  <dl
                    role="list"
                    className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white"
                  >
                    {event.categories.map((c) => (
                      <div key={c.name} className="py-3 pl-3 pr-4">
                        <Text
                          as="dt"
                          variant="secondary"
                          className="font-semibold"
                        >
                          {c.name}
                        </Text>
                        <Text as="dd" className="mt-1">
                          {c.description}
                        </Text>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <Container className="my-8 px-8 py-32 text-center">
      <h1 className="text-8xl font-black text-indigo-400">{caught.status}</h1>
      <p className="mt-10 text-4xl font-bold text-gray-600">{caught.data}</p>
    </Container>
  );
}

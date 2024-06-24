import type { LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { UserTeam } from '~/.server/team/user-team.ts';
import { requireSession } from '~/libs/auth/session.ts';
import { mergeMeta } from '~/libs/meta/merge-meta.ts';
import { useUser } from '~/routes/__components/use-user.tsx';

import { NavbarOrga } from '../__components/navbar/navbar-orga.tsx';
import type { loader as routeEventLoader } from './$team.$event+/_layout';
import { EventTabs } from './$team+/__components/event-tabs.tsx';
import { TeamTabs } from './$team+/__components/team-tabs.tsx';

export const meta = mergeMeta<typeof loader>(({ data }) => (data ? [{ title: `${data.name} | Conference Hall` }] : []));

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireSession(request);
  invariant(params.team, 'Invalid team slug');

  const team = await UserTeam.for(userId, params.team).get();
  return json(team);
};

export default function TeamLayout() {
  const { user } = useUser();
  const team = useLoaderData<typeof loader>();
  const event = useRouteLoaderData<typeof routeEventLoader>('routes/team+/$team.$event+/_layout');

  return (
    <>
      <NavbarOrga user={user} />

      {event ? (
        <EventTabs teamSlug={team.slug} eventSlug={event.slug} eventType={event.type} role={team.role} />
      ) : (
        <TeamTabs slug={team.slug} role={team.role} />
      )}

      <Outlet context={{ user, team }} />
    </>
  );
}

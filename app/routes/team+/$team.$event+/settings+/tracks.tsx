import { parse } from '@conform-to/zod';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { EventTracksSettings } from '~/.server/organizer-event-settings/EventTracksSettings.ts';
import { TrackSaveSchema, TracksSettingsSchema } from '~/.server/organizer-event-settings/EventTracksSettings.types.ts';
import { ToggleGroup } from '~/design-system/forms/Toggles.tsx';
import { Card } from '~/design-system/layouts/Card.tsx';
import { H2, Subtitle } from '~/design-system/Typography.tsx';
import { requireSession } from '~/libs/auth/session.ts';
import { toast } from '~/libs/toasts/toast.server.ts';

import { useEvent } from '../__components/useEvent.tsx';
import { NewTrackButton } from './__components/SaveTrackForm.tsx';
import { TrackList } from './__components/TrackList.tsx';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireSession(request);
  return null;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await requireSession(request);
  invariant(params.team, 'Invalid team slug');
  invariant(params.event, 'Invalid event slug');

  const tracks = EventTracksSettings.for(userId, params.team, params.event);

  const form = await request.formData();
  switch (form.get('_action')) {
    case 'delete-formats': {
      const trackId = String(form.get('trackId'));
      await tracks.deleteFormat(trackId);
      break;
    }
    case 'delete-categories': {
      const trackId = String(form.get('trackId'));
      await tracks.deleteCategory(trackId);
      break;
    }
    case 'save-formats': {
      const result = parse(form, { schema: TrackSaveSchema });
      if (!result.value) return json(result.error);
      await tracks.saveFormat(result.value);
      break;
    }
    case 'save-categories': {
      const result = parse(form, { schema: TrackSaveSchema });
      if (!result.value) return json(result.error);
      await tracks.saveCategory(result.value);
      break;
    }
    case 'update-track-settings': {
      const result = parse(form, { schema: TracksSettingsSchema });
      if (!result.value) return json(result.error);
      await tracks.updateSettings(result.value);
      return toast('success', 'Track setting updated.');
    }
  }
  return null;
};

export default function EventTracksSettingsRoute() {
  const { event } = useEvent();

  const fetcher = useFetcher();
  const handleUpdateSettings = (name: string, checked: boolean) => {
    fetcher.submit({ _action: 'update-track-settings', [name]: String(checked) }, { method: 'POST' });
  };

  return (
    <>
      <Card as="section" p={8} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <H2>Formats</H2>
            <Subtitle>Define talk formats available for your event proposals.</Subtitle>
          </div>
          <NewTrackButton type="formats" />
        </div>

        {event.formats.length > 0 && (
          <>
            <TrackList type="formats" tracks={event.formats} />
            <ToggleGroup
              label="Format selection required"
              description="When a speaker submit a proposal, the format selection is mandatory."
              value={event.formatsRequired}
              onChange={(checked) => handleUpdateSettings('formatsRequired', checked)}
            />
          </>
        )}
      </Card>

      <Card as="section" p={8} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <H2>Categories</H2>
            <Subtitle>Define talk categories available for your event proposals.</Subtitle>
          </div>
          <NewTrackButton type="categories" />
        </div>

        {event.categories.length > 0 && (
          <>
            <TrackList type="categories" tracks={event.categories} />
            <ToggleGroup
              label="Category selection required"
              description="When a speaker submit a proposal, the category selection is mandatory."
              value={event.categoriesRequired}
              onChange={(checked) => handleUpdateSettings('categoriesRequired', checked)}
            />
          </>
        )}
      </Card>
    </>
  );
}

import { OpenPlanner } from './open-planner.ts';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

describe('OpenPlanner integration', () => {
  beforeEach(async () => {
    fetchMock.mockReset();
  });

  describe('#postSessionsAndSpeakers', () => {
    it('successfully posts sessions and speakers', async () => {
      const eventId = '123';
      const apiKey = '456';
      const payload = {
        sessions: [{ id: 'idSession', title: 'title!', speakerIds: ['idSpeaker'] }],
        speakers: [{ id: 'idSpeaker', name: 'name!', socials: [] }],
      };

      fetchMock.mockResolvedValue({ ok: true, json: () => ({ success: true }) });

      const result = await OpenPlanner.postSessionsAndSpeakers(eventId, apiKey, payload);

      expect(result).toEqual({ success: true });

      expect(fetchMock).toHaveBeenCalledWith('https://api.openplanner.fr/v1/123/sessions-speakers?apiKey=456', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    });

    it('returns an error when the apiKey or eventId are invalid', async () => {
      const payload = {
        sessions: [{ id: 'idSession', title: 'title!', speakerIds: ['idSpeaker'] }],
        speakers: [{ id: 'idSpeaker', name: 'name!', socials: [] }],
      };

      const result1 = await OpenPlanner.postSessionsAndSpeakers('eventId', '', payload);
      expect(result1.success).toBe(false);
      expect(result1.error).toBe('Validation error');

      const result2 = await OpenPlanner.postSessionsAndSpeakers('eventId', '', payload);
      expect(result2.success).toBe(false);
      expect(result2.error).toBe('Validation error');
    });

    it('returns an error when the payload is invalid', async () => {
      const eventId = '123';
      const apiKey = '456';
      const payload = {};

      // @ts-expect-error
      const result = await OpenPlanner.postSessionsAndSpeakers(eventId, apiKey, payload);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Validation error');

      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('returns an error when the OpenPlanner call fails', async () => {
      const eventId = '123';
      const apiKey = '456';
      const payload = {
        sessions: [{ id: 'idSession', title: 'title!', speakerIds: ['idSpeaker'] }],
        speakers: [{ id: 'idSpeaker', name: 'name!', socials: [] }],
      };

      fetchMock.mockResolvedValue({ ok: false, json: () => ({ success: false, error: 'Something wrong' }) });

      const result = await OpenPlanner.postSessionsAndSpeakers(eventId, apiKey, payload);

      expect(result).toEqual({ success: false, error: 'Something wrong' });
      expect(fetchMock).toHaveBeenCalled();
    });

    it('returns an error when the OpenPlanner call fails unexpectedly"', async () => {
      const eventId = '123';
      const apiKey = '456';
      const payload = {
        sessions: [{ id: 'idSession', title: 'title!', speakerIds: ['idSpeaker'] }],
        speakers: [{ id: 'idSpeaker', name: 'name!', socials: [] }],
      };

      fetchMock.mockRejectedValue(new Error('Boom!'));

      const result = await OpenPlanner.postSessionsAndSpeakers(eventId, apiKey, payload);

      expect(result).toEqual({ success: false, error: 'Boom!' });
      expect(fetchMock).toHaveBeenCalled();
    });
  });
});

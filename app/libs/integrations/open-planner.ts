import { z } from 'zod';

const BASE_URL = 'https://api.openplanner.fr';

type ApiResponse = { success: true; error: undefined } | { success: false; error: string };

const SessionAndSpeakersPayloadSchema = z.object({
  sessions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      abstract: z.string().nullish(),
      speakerIds: z.array(z.string()).min(1),
      language: z.string().nullish(),
      level: z.string().nullish(),
      formatId: z.string().nullish(),
      formatName: z.string().nullish(),
      categoryId: z.string().nullish(),
      categoryName: z.string().nullish(),
    }),
  ),
  speakers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      bio: z.string().nullish(),
      company: z.string().nullish(),
      photoUrl: z.string().nullish(),
      socials: z.array(z.object({ name: z.string(), link: z.string() })),
    }),
  ),
});

type SessionAndSpeakersPayload = z.infer<typeof SessionAndSpeakersPayloadSchema>;

async function postSessionsAndSpeakers(eventId: string, apiKey: string, payload: SessionAndSpeakersPayload) {
  const validation = SessionAndSpeakersPayloadSchema.safeParse(payload);

  if (!eventId || !apiKey || !validation.success) {
    return { success: false, error: 'Validation error' };
  }

  try {
    const url = `${BASE_URL}/v1/${eventId}/sessions-speakers?apiKey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || 'Unknown error');
    }

    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const OpenPlanner = { postSessionsAndSpeakers };

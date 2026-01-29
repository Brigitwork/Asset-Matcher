import { z } from 'zod';
import { telegramPayloadSchema } from './schema';

export const api = {
  telegram: {
    submit: {
      method: 'POST' as const,
      path: '/api/telegram',
      input: telegramPayloadSchema,
      responses: {
        200: z.object({ success: z.boolean(), message: z.string() }),
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  },
};

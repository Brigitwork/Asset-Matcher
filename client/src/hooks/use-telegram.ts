import { useMutation } from "@tanstack/react-query";
import { api, type TelegramPayload } from "@shared/routes";

// POST /api/telegram
export function useSubmitTelegram() {
  return useMutation({
    mutationFn: async ({ event, payload }: TelegramPayload) => {
      const res = await fetch(api.telegram.submit.path, {
        method: api.telegram.submit.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, payload }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to submit');
      }
      
      return await res.json();
    },
  });
}

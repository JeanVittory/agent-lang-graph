import { z } from "zod";

export const IntentSchema = z.object({
  intent: z.enum([
    "scheduled",
    "consult",
    "cancel",
    "conversation",
    "unknown",
  ]),
});

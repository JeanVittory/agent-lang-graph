import * as z from 'zod';

export const TopicGateSchema = z.object({
  inScope: z.boolean(),
});

export type TopicGateResult = z.infer<typeof TopicGateSchema>;

import { z } from "zod";

export const ProcessVideoDTO = z.object({
  url: z.string().url(),
  userId: z.string(),
});

export type ProcessVideoDTO = z.infer<typeof ProcessVideoDTO>;

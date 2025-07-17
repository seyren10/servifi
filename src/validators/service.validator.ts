import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string().trim().nonempty().max(50),
  description: z.string().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

import { isValidObjectId } from "mongoose";
import { z } from "zod";

export const createPromoValidator = z.object({
  title: z.string().nonempty().max(255),
  description: z.string().optional(),
  restrictedProducts: z
    .array(z.string().refine((v) => isValidObjectId(v), "Invalid product id"))
    .optional(),
});

export const updatePromoValidator = z.object({
  title: z.string().nonempty().max(255).optional(),
  description: z.string().optional(),
  restrictedProducts: z
    .array(z.string().refine((v) => isValidObjectId(v), "Invalid product id"))
    .optional(),
});

import { z } from "zod";
import { Types } from "mongoose";

export const productCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid category ID",
  }),
  price: z.number().nonnegative(),
  imageUrl: z.string().optional(),
  availability: z.boolean().default(true),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  category: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid category ID",
    })
    .optional(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().optional(),
  availability: z.boolean().optional(),
});

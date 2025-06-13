import { z } from "zod";
import { Types } from "mongoose";

export const productCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  category: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid category ID",
  }),
  price: z.coerce.number().nonnegative(),
  image: z
    .custom<Express.Multer.File>()
    .refine((file) => {
      return file.size < 4000 * 1024;
    }, "should be maximum of 4mb")
    .refine((file) => {
      return file.mimetype.startsWith("image");
    }, "should be of type image"),
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
  image: z
    .custom<Express.Multer.File>()
    .refine((file) => {
      return file.size < 4000 * 1024;
    }, "should be maximum of 4mb")
    .refine((file) => {
      return file.mimetype.startsWith("image");
    }, "should be of type image")
    .optional(),
  availability: z.boolean().optional(),
});

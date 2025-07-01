import { Types } from "mongoose";
import { z } from "zod";
import { exists } from "./dbValidatorHelpers";
import categoryModel from "../models/category.model";

export const categoryCreateSchema = z.object({
  name: z.string().trim().nonempty().max(50),
  icon: z.string().nonempty(),
});

export const moveProductsCategorySchema = z
  .object({
    from: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), "Invalid category id")
      .refine(exists(categoryModel, "_id"), "category does not exists"),
    to: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), "Invalid category id")
      .refine(exists(categoryModel, "_id"), "category does not exists"),
  })
  .superRefine((data, ctx) => {
    if (data.from === data.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cannot move products to the same category",
      });
    }
  });

import { z } from "zod";
import { tableIsOccupied } from "./dbValidatorHelpers";
import { isValidObjectId } from "mongoose";

export const createOrderSchema = z.object({
  table: z.string().refine(tableIsOccupied, "is not occupied"),
  products: z
    .array(
      z.object({
        product: z
          .string()
          .refine((v) => isValidObjectId(v), "Invalid product id"),
        quantity: z.number().nonnegative().min(1),
      })
    )
    .nonempty(),
});

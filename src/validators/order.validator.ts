import { z } from "zod";
import { productIsAvailable, tableIsOccupied } from "./dbValidatorHelpers";

export const createOrderSchema = z.object({
  table: z.string().refine(tableIsOccupied, "is not occupied"),
  products: z.array(
    z.object({
      product: z.string().refine(productIsAvailable, "is not available"),
      quantity: z.number().nonnegative().min(1),
    })
  ).nonempty(),
});

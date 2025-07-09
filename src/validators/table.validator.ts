import { z } from "zod";
import { TableStatus } from "../enums/table";
import { exists } from "./dbValidatorHelpers";
import Table from "../models/table.model";
import { isValidObjectId } from "mongoose";

export const createTableSchema = z.object({
  number: z
    .number()
    .nonnegative()
    .refine(exists(Table, "number", true), "Table number already Exists"),
  capacity: z.number().nonnegative(),
  status: z.nativeEnum(TableStatus).default(TableStatus.AVAILABLE),
});

export const updateTableSchema = z
  .object({
    number: z.number().nonnegative(),
    capacity: z.number().nonnegative(),
    status: z.nativeEnum(TableStatus),
  })
  .partial();

export const generateTableSessionSchema = z.object({
  restrictedProductIds: z
    .array(z.string().refine((v) => isValidObjectId(v), "Invalid product id"))
    .optional(),
});

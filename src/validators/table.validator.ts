import { z } from "zod";
import { TableStatus } from "../enums/table";
import { unique } from "./dbValidatorHelpers";
import Table from "../models/table.model";

export const createTableSchema = z.object({
  number: z
    .number()
    .nonnegative()
    .refine(unique(Table, "number"), "Table number already Exists"),
  capacity: z.number().nonnegative(),
  status: z.nativeEnum(TableStatus).default(TableStatus.AVAILABLE),
});

export const updateTableSchema = z
  .object({
    number: z
      .number()
      .nonnegative()
      .refine(unique(Table, "number"), "Table number already Exists"),
    capacity: z.number().nonnegative(),
    status: z.nativeEnum(TableStatus),
  })
  .partial();

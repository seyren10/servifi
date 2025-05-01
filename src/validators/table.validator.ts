import { z } from "zod";
import { TableStatus } from "../enums/table";

export const createTableSchema = z.object({
  number: z.number().nonnegative(),
  capacity: z.number().nonnegative(),
  status: z.nativeEnum(TableStatus).default(TableStatus.AVAILABLE),
});

export const updateTableSchema = z.object({
  number: z.number().nonnegative().optional(),
  capacity: z.number().nonnegative().optional(),
  status: z.nativeEnum(TableStatus).optional(),
});

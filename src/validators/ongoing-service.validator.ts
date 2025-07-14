import { z } from "zod";

import { isValidObjectId } from "mongoose";
import { exists } from "./dbValidatorHelpers";
import Table from "../models/table.model";

export const createOngoingServiceSchema = z.object({
  table: z
    .string()
    .refine((v) => isValidObjectId(v), "Invalid id")
    .pipe(z.string().refine(exists(Table, "_id"), "doest not exists")),
  service: z.string().refine((v) => isValidObjectId(v), "Invalid id"),
  completed: z.coerce.boolean().optional().default(false),
});

export const updateOngoingServiceSchema = createOngoingServiceSchema.partial();

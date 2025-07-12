import { z } from "zod";

import { isValidObjectId } from "mongoose";
import { exists } from "./dbValidatorHelpers";
import Table from "../models/table.model";
import serviceModel from "../models/service.model";
import ongoingServiceModel from "../models/ongoing-service.model";

export const createOngoingServiceSchema = z.object({
  table: z
    .string()
    .refine((v) => isValidObjectId(v), "Invalid id")
    .pipe(z.string().refine(exists(Table, "_id"), "doest not exists"))
    .pipe(
      z
        .string()
        .refine(
          exists(ongoingServiceModel, "table", true),
          "already have an ongoing service"
        )
    ),
  service: z
    .string()
    .refine((v) => isValidObjectId(v), "Invalid id")
    .pipe(z.string().refine(exists(serviceModel, "_id"), "doest not exists")),
  completed: z.coerce.boolean().optional().default(false),
});

export const updateOngoingServiceSchema = createOngoingServiceSchema.partial();

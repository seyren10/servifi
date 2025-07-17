import { NextFunction, Request, Response } from "express";
import ongoingServiceModel from "../models/ongoing-service.model";
import { NotFoundError, ValidationError } from "../utils/AppError";
import {
  createOngoingServiceSchema,
  updateOngoingServiceSchema,
} from "../validators/ongoing-service.validator";
import { getIO } from "../config/socket";
import { ZodError } from "zod";

export async function getOngoingServices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { completed } = req.query;

    let query = ongoingServiceModel.find();

    if (typeof completed !== "undefined") {
      query = query.where({ completed }); // chain the condition
    }

    const ongoingServices = await query
      .populate(["service", "table"])
      .lean()
      .exec();

    res.json(ongoingServices);
  } catch (error) {
    next(error);
  }
}

export async function getOngoingService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const ongoingService = await ongoingServiceModel.findById(id);

    if (!ongoingService) throw new NotFoundError("Ongoing service not found");

    res.json(ongoingService);
  } catch (error) {
    next(error);
  }
}

export async function createOngoingService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } =
      await createOngoingServiceSchema.safeParseAsync(req.body);

    if (!success) throw new ValidationError(error);

    const existingOngoingService = await ongoingServiceModel
      .countDocuments({
        service: data.service,
        table: data.table,
      })
      .lean()
      .exec();

    if (existingOngoingService)
      throw new ValidationError(
        new ZodError([
          {
            path: ["service"],
            message: "Ongoing service already exists",
            code: "custom",
          },
        ])
      );

    const ongoingService = await ongoingServiceModel.create(data);

    const io = getIO();

    io.emit("ongoing-service-created", {
      message: "New ongoing service created",
    });

    res.status(201).json(ongoingService);
  } catch (error) {
    next(error);
  }
}

export async function updateOngoingService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { success, data, error } =
      await updateOngoingServiceSchema.safeParseAsync(req.body);

    if (!success) throw new ValidationError(error);

    const ongoingService = await ongoingServiceModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ongoingService) throw new NotFoundError("Ongoing service not found");

    res.json(ongoingService);
  } catch (error) {
    next(error);
  }
}

export async function deleteOngoingService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const ongoingService = await ongoingServiceModel.findByIdAndDelete(id);

    if (!ongoingService) throw new NotFoundError("Ongoing service not found");

    res.json({ message: "Ongoing service deleted successfully" });
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request, Response } from "express";
import serviceModel from "../models/service.model";
import {
  createServiceSchema,
  updateServiceSchema,
} from "../validators/service.validator";
import { NotFoundError, ValidationError } from "../utils/AppError";

export async function getServices(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const services = await serviceModel.find();

    res.json(services);
  } catch (error) {
    next(error);
  }
}

export async function getService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const service = await serviceModel.findById(id);

    if (!service) throw new NotFoundError("Service not found");

    res.json(service);
  } catch (error) {
    next(error);
  }
}
export async function createService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } = await createServiceSchema.safeParseAsync(
      req.body
    );

    if (!success) throw new ValidationError(error);

    const service = await serviceModel.create(data);

    res.json(service);
  } catch (error) {
    next(error);
  }
}

export async function updateService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const { success, data, error } = await updateServiceSchema.safeParseAsync(
      req.body
    );

    if (!success) throw new ValidationError(error);

    const service = await serviceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!service) throw new NotFoundError("Service not found");

    res.json(service);
  } catch (error) {
    next(error);
  }
}

export async function deleteService(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const service = await serviceModel.findByIdAndDelete(id);

    if (!service) throw new NotFoundError("Service not found");

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
}

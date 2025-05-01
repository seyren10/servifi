import { NextFunction, Request, Response } from "express";
import logger from "../config/winston";
import {
  AppError,
  MongooseValidationError,
  NotFoundError,
} from "../utils/AppError";
import { Error,  } from "mongoose";

export function errorHander(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let error = err;
    logger.debug(error);
    logger.debug(error.stack)

    if (error instanceof Error.CastError) {
      error = new NotFoundError("Resource not found");
    }

    if (error instanceof Error.ValidationError) {
      error = new MongooseValidationError(error);
    }

    if (error instanceof AppError) {
      AppError.handle(error, res);
      return;
    }

    res.status(500).json({
      message: "Internal Server Error",
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

import { Response } from "express";
import { Error } from "mongoose";
import { ZodError } from "zod";

export enum AppErrorType {
  BAD_REQUEST = "BadRequest",
  NOT_FOUND = "NotFound",
  UNAUTHORIZED = "Unauthorized",
  FORBIDDEN = "Forbidden",
  INTERNAL = "Internal",
  TOKEN_EXPIRED = "TokenExpired",
  BAD_TOKEN = "BadToken",
  ACCESS_TOKEN_ERROR = "AccessTokenError",
  VALIDATION_ERROR = "ValidationError",
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly type: AppErrorType;

  constructor(type: AppErrorType, message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static handle(err: AppError, res: Response) {
    res.status(err.statusCode || 500).json({
      type: err.type,
      message: err.message || "Internal Server Error",
    });
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(AppErrorType.BAD_REQUEST, message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource Not Found") {
    super(AppErrorType.NOT_FOUND, message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(AppErrorType.UNAUTHORIZED, message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(AppErrorType.FORBIDDEN, message, 403);
  }
}

export class InternalError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(AppErrorType.INTERNAL, message, 500);
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = "Token Expired") {
    super(AppErrorType.TOKEN_EXPIRED, message, 401);
  }
}

export class BadTokenError extends AppError {
  constructor(message: string = "Bad Token") {
    super(AppErrorType.BAD_TOKEN, message, 401);
  }
}

export class AccessTokenError extends AppError {
  constructor(message: string = "Access Token Error") {
    super(AppErrorType.ACCESS_TOKEN_ERROR, message, 401);
  }
}

export class ValidationError extends AppError {
  constructor(error: ZodError) {
    const message = error.errors
      .map((e) => `${e.path.join(".")} - ${e.message}`)
      .join(", ");
    super(AppErrorType.VALIDATION_ERROR, message, 422);
  }
}

export class MongooseValidationError extends AppError {
  constructor(error: Error.ValidationError) {
    const message = Object.keys(error.errors)
      .map((key) => `${key} - ${error.errors[key].message}`)
      .join(", ");
    super(AppErrorType.VALIDATION_ERROR, message, 422);
  }
}

import { NextFunction, Request, Response } from "express";
import { BadTokenError, UnauthorizedError } from "../utils/AppError";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import config from "../config/dotenv";
import { JwtAuthPayload } from "../types/jwt";
import { ClientRole } from "../enums/roles";
import Table from "../models/table.model";
import { TableStatus } from "../enums/table";
import { Table as TypeTable } from "../types/table";

/**
 * Middleware function to authorize requests based on user roles.
 *
 * @param forUser - The role required to access the resource. Defaults to `ClientRole.CUSTOMER`.
 * @returns An Express middleware function that verifies the authorization header and user role.
 *
 * @throws {UnauthorizedError} If the authorization header is missing or the user does not have the required role.
 * @throws {BadTokenError} If the authorization header is malformed or the token is invalid.
 *
 * The middleware performs the following steps:
 * 1. Checks for the presence of the `Authorization` header in the request.
 * 2. Splits the header into a prefix and token, validating their existence.
 * 3. Verifies the token using the configured JWT secret.
 * 4. Ensures the user's role matches the required role (`forUser`).
 * 5. If the user is a `ClientRole.CUSTOMER`, verifies the payload and attaches the corresponding model to `req.table`.
 *
 * Example usage:
 * ```typescript
 * app.use(authorize(ClientRole.USER));
 * ```
 */
export function authorize(forUser: ClientRole = ClientRole.CUSTOMER) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError("Authorization Header is missing");
      }

      const [prefix, token] = authHeader.split(" ");
      if (!prefix || !token) throw new BadTokenError();

      const payload = jwt.verify(token, config.jwtSecret!) as JwtAuthPayload;

      if (payload.type === ClientRole.CUSTOMER && forUser === ClientRole.USER) {
        throw new UnauthorizedError();
      }

      if (payload.type === ClientRole.CUSTOMER) {
        const model = await verifyTablePayload(payload.id);
        req.table = model;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Verifies and updates the status of a table payload by its ID.
 *
 * This function retrieves a table from the database using the provided ID.
 * If the table exists, its status is updated to `OCCUPIED` and the changes
 * are saved to the database. The updated table is then returned.
 *
 * @param id - The unique identifier of the table to verify and update.
 * @returns A promise that resolves to the updated table object cast as `TypeTable`.
 *          If the table is not found, the function returns `null`.
 */
async function verifyTablePayload(id: string) {
  const table = await Table.findById(id);

  if (table) {
    table.status = TableStatus.OCCUPIED;
    await table.save();
  }

  return table as TypeTable;
}

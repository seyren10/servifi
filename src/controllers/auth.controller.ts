import { NextFunction, Request, Response } from "express";

export async function getAuthUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request, Response } from "express";
import Table from "../models/table.model";
import {
  createTableSchema,
  updateTableSchema,
} from "../validators/table.validator";
import { ValidationError } from "../utils/AppError";

export async function getTables(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tables = await Table.find();

    res.json(tables);
  } catch (error) {
    next(error);
  }
}

export async function createTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } = await createTableSchema.safeParseAsync(
      req.body
    );
    if (!success) throw new ValidationError(error);

    const newTable = await Table.create({ ...data });

    res.status(201).json(newTable);
  } catch (error) {
    next(error);
  }
}

export async function updateTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { success, data, error } = await updateTableSchema.safeParseAsync(
      req.body
    );

    if (!success) throw new ValidationError(error);

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    );
    res.status(200).json(updatedTable);
  } catch (error) {
    next(error);
  }
}

export async function deleteTable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await Table.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

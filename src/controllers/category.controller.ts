import { NextFunction, Request, Response } from "express";
import { categoryCreateSchema } from "../validators/category.validator";
import categoryModel from "../models/category.model";
import { ZodError, ZodIssue } from "zod";
import { ValidationError } from "../utils/AppError";

export async function getCategories(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categories = await categoryModel.find().lean();

    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = categoryCreateSchema.parse(req.body);

    const category = await categoryModel.create({ name });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof ZodError) {
      next(new ValidationError(error));
      return;
    }

    next(error);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { success, data, error } = categoryCreateSchema.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    const category = await categoryModel.updateOne(
      { _id: id },
      { name: data.name }
    );

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    await categoryModel.deleteOne({ _id: id });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request, Response } from "express";
import {
  categoryCreateSchema,
  moveProductsCategorySchema,
} from "../validators/category.validator";
import categoryModel from "../models/category.model";
import { ZodError } from "zod";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../utils/AppError";
import productModel from "../models/product.model";

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

export async function getCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { populates } = req.query as { populates: string };

    const category = await categoryModel.findById(id).populate({
      path: populates || "",
      strictPopulate: false,
    });

    if (!category) throw new NotFoundError();

    res.json(category?.toJSON({ virtuals: true }));
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
    const data = categoryCreateSchema.parse(req.body);

    const category = await categoryModel.create(data);

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

    const category = await categoryModel.findByIdAndUpdate(id, data);

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

    const productsCount = await productModel
      .countDocuments({ category: id })
      .lean()
      .exec();

    if (productsCount) {
      throw new BadRequestError(
        `There are associated products to category id: ${id}`
      );
    } else await categoryModel.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function categoryProductsCount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: category } = req.params;
    const productsCount = await productModel.countDocuments({
      category,
    });
    res.json(productsCount);
  } catch (error) {
    next(error);
  }
}

export async function moveProductsCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } =
      await moveProductsCategorySchema.safeParseAsync(req.params);

    if (!success) throw new ValidationError(error);

    await productModel.updateMany(
      { category: data.from },
      {
        category: data.to,
      }
    );

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

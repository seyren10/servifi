import { NextFunction, Request, Response } from "express";
import productModel from "../models/product.model";
import {
  productCreateSchema,
  updateProductSchema,
} from "../validators/product.validator";
import { ValidationError } from "../utils/AppError";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await productModel
      .find()
      .populate("category", "name")
      .lean()
      .exec();

    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id).populate("category").lean();

    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProductsByCategoryId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const products = await productModel.find({ category: id }).lean();

    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { success, data, error } = productCreateSchema.safeParse(req.body);

    if (!success) throw new ValidationError(error);
    const createdProduct = await productModel.create(data);

    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { success, data, error } = updateProductSchema.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    await productModel.findByIdAndUpdate(id, {
      ...data,
    });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

import { NextFunction, Request, Response } from "express";
import productModel from "../models/product.model";
import {
  productCreateSchema,
  updateProductSchema,
} from "../validators/product.validator";
import { ValidationError } from "../utils/AppError";
import { deleteImageJob } from "../workers/imageDelete.queue";
import { imageUploadQueue } from "../workers/imageUpload.worker";
import jwt from "jsonwebtoken";
import { JwtAuthPayload } from "../types/jwt";
import { getRestrictedProductsFromJwt } from "../utils/products.helpers";

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const products = await productModel
      .find()
      .sort({ createdAt: "desc" })
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
    const restrictedProducts = getRestrictedProductsFromJwt(req);

    const { id } = req.params;
    const products = await productModel
      .find({ category: id })
      .lean()
      .transform((products) =>
        products.map((product) =>
          restrictedProducts?.includes(product._id.toString())
            ? { ...product, availability: false }
            : product
        )
      )
      .exec();

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
    req.body.image = req.file;
    const { success, data, error } = productCreateSchema.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    const createdProduct = await productModel.create(data);

    if (data.image) {
      imageUploadQueue.add("image-upload", {
        productId: createdProduct?._id.toString(),
        imagePath: data.image.path,
      });
    }

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
    req.body.image = req.file;
    const { success, data, error } = updateProductSchema.safeParse(req.body);

    if (!success) throw new ValidationError(error);

    const product = await productModel.findByIdAndUpdate(id, {
      ...data,
    });

    if (data.image) {
      if (product?.imageUrl) await deleteImageJob(product.imageUrl);

      await imageUploadQueue.add("image-upload", {
        productId: product?._id.toString(),
        imagePath: data.image.path,
      });
    }

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
